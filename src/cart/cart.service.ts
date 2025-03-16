import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-items.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { AddToCartDto } from './dto/addToCart.dto';
import { RemoveFromCartDto } from './dto/removeFromCart.dto';

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

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<boolean> {
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

    // Проверяем есть ли желаемый товар уже в корзине
    let cartItem = cart.items.find((item) => item.product.id === productId);
    if (cartItem) {
      cartItem.quantity += quantity;

      // Проверяем желаемое кол-во + товар в корзине < остатка на складе
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

    return true;
  }

  async getCart(userId: number): Promise<Cart> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user || !user.cart) {
      throw new NotFoundException('Корзина не найдена');
    }
    return user.cart;
  }

  async removeFromCart(
    userId: number,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<boolean> {
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
  }

  async clearCart(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const cart = user.cart;
    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }
    await this.cartRepository.delete({ user });
    return true;
  }
}
