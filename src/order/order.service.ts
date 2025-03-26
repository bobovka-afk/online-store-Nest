import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { PaginationOrderDto } from './dto/paginationOrder.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly mailService: MailService,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const cart = await this.entityManager.findOne(Cart, {
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'],
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Корзина пуста или пользователь не найден');
    }

    // Проверка наличия товара на складе
    for (const cartItem of cart.items) {
      if (cartItem.quantity > cartItem.product.stockQuantity) {
        throw new BadRequestException(
          `Недостаточно товара "${cartItem.product.name}" на складе. Доступно: ${cartItem.product.stockQuantity}`,
        );
      }
    }

    // Начало транзакции
    return this.entityManager.transaction(async (manager: EntityManager) => {
      // Расчет общей суммы заказа
      const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      // Создание нового заказа
      const order = manager.create(Order, {
        user: cart.user,
        phoneNumber: createOrderDto.phoneNumber,
        address: createOrderDto.address,
        deliveryDate: createOrderDto.deliveryDate,
        totalPrice,
        status: 'generated', // Статус заказа
      });

      // Сохранение заказа
      await manager.save(order);

      const orderItems = cart.items.map((cartItem) =>
        manager.create(OrderItem, {
          order,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price_at_order_time: cartItem.product.price,
        }),
      );

      await manager.save(orderItems);

      // Уменьшаем количество товара на складе
      for (const cartItem of cart.items) {
        await manager.decrement(Product, { id: cartItem.product.id }, 'stockQuantity', cartItem.quantity);
      }

      // Очистка корзины
      await manager.delete(Cart, { id: cart.id });

      const userEmail = createOrderDto.email;

      // Отправка письма с подтверждением заказа
      await this.mailService.sendOrderConfirmationEmail(userEmail, order.id);

      return {
        id: order.id,
        status: order.status,
        phoneNumber: order.phoneNumber,
        address: order.address,
        deliveryDate: order.deliveryDate,
        totalPrice: order.totalPrice,
      };
    });
  }

  async orderList(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async updateOrderStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;

    return this.orderRepository.save(order);
  }

  async getAllOrders(paginationOrderDto: PaginationOrderDto): Promise<{ data: Order[]; count: number }> {
    const { limit, offset } = paginationOrderDto;

    const [orders, total] = await this.orderRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    if (orders.length === 0) {
      throw new NotFoundException('Список заказов пуст.');
    }

    return {
      data: orders,
      count: total,
    };
  }

  async getOrdersByStatus(paginationOrderDto: PaginationOrderDto): Promise<{ data: Order[]; count: number }> {
    const { limit, offset } = paginationOrderDto;

    const [orders, total] = await this.orderRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    if (orders.length === 0) {
      throw new NotFoundException(`Заказы не найдены.`);
    }

    return {
      data: orders,
      count: total,
    };
  }
}
