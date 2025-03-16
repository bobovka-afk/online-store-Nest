import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-items.entity';
import { Cart } from '../entities/cart.entity';
import { Product } from '../entities/product.entity';
import { CreateOrderDto } from './dto/createOrder.dto';

@Injectable()
export class OrderService {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const cart = await this.entityManager.findOne(Cart, {
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user'],
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Корзина пуста или пользователь не найден');
    }

    // Есть ли товар на складе
    for (const cartItem of cart.items) {
      if (cartItem.quantity > cartItem.product.stockQuantity) {
        throw new BadRequestException(
          `Недостаточно товара "${cartItem.product.name}" на складе. Доступно: ${cartItem.product.stockQuantity}`,
        );
      }
    }

    return this.entityManager.transaction(async (manager: EntityManager) => {
      // Сумма заказа
      const totalPrice = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      // Создание заказа
      const order = manager.create(Order, {
        user: cart.user,
        phoneNumber: createOrderDto.phoneNumber,
        address: createOrderDto.address,
        deliveryDate: createOrderDto.deliveryDate,
        totalPrice,
        status: 'generated',
      });

      await manager.save(order);

      // Создаём OrderItem и уменьшаем количество товара
      const orderItems = cart.items.map((cartItem) =>
        manager.create(OrderItem, {
          order,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price_at_order_time: cartItem.product.price,
        }),
      );

      await manager.save(orderItems);

      // Вычесть из остатков на складе
      for (const cartItem of cart.items) {
        await manager.decrement(
          Product,
          { id: cartItem.product.id },
          'stockQuantity',
          cartItem.quantity,
        );
      }

      // Очистить корзину
      await manager.delete(Cart, { id: cart.id });

      return order;
    });
  }
}
