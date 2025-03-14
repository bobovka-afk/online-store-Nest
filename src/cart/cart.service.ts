import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-items.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { RemoveFromCartDto } from './dto/remove-from-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    try {
      const { productId, quantity } = addToCartDto;

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['cart', 'cart.items', 'cart.items.product'],
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Если корзины нет, создаем
      let cart = user.cart;
      if (!cart) {
        cart = new Cart();
        cart.user = user;
        cart.items = [];
        await this.cartRepository.save(cart);
        user.cart = cart;
      }

      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Товар не найден');
      }

      if (product.stockQuantity < quantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }

      let cartItem = cart.items.find((item) => item.product.id === productId);
      if (cartItem) {
        cartItem.quantity += quantity;

        // Проверяем, не превышает ли количество товара доступный складской остаток
        if (cartItem.quantity > product.stockQuantity) {
          throw new BadRequestException('Недостаточно товара на складе');
        }
      } else {
        cartItem = new CartItem();
        cartItem.cart = cart;
        cartItem.product = product;
        cartItem.quantity = quantity;
        cart.items.push(cartItem);
      }

      await this.cartItemRepository.save(cartItem);
      await this.cartRepository.save(cart);

      return cart; // fix
    } catch {
      throw new InternalServerErrorException(
        'Не удалось добавить товар в корзину',
      );
    }
  }

  async getCart(userId: number): Promise<Cart> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['cart', 'cart.items', 'cart.items.product'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Корзина не найдена');
      }
      return user.cart;
    } catch {
      throw new InternalServerErrorException(
        'Не удалось получить товары корзины',
      );
    }
  }

  async removeFromCart(
    userId: number,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<boolean> {
    try {
      const { productId } = removeFromCartDto;

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['cart', 'cart.items', 'cart.items.product'],
      });
      if (!user || !user.cart) {
        throw new NotFoundException('Корзина не найдена');
      }

      const cartItem = user.cart.items.find(
        (item) => item.product.id === productId,
      );
      if (!cartItem) {
        throw new NotFoundException('Товар не найден в корзине');
      }

      await this.cartItemRepository.remove(cartItem);
      return true;
    } catch {
      throw new InternalServerErrorException('Не удалось удалить товар');
    }
  }
}
