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

  // Добавление товара в корзину
  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;

    // Находим пользователя и его корзину
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Если корзины нет, создаем её
    let cart = user.cart;
    if (!cart) {
      cart = new Cart();
      cart.user_id = user;
      cart.items = [];
      await this.cartRepository.save(cart);
    }

    // Находим товар
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Проверяем, достаточно ли товара на складе
    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    // Проверяем, есть ли товар уже в корзине
    let cartItem = cart.items.find((item) => item.product.id === productId);
    if (cartItem) {
      // Если товар уже в корзине, обновляем количество
      cartItem.quantity += quantity;
    } else {
      // Если товара нет в корзине, создаем новый элемент
      cartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    return cart;
  }

  // Получение товаров в корзине
  async getCart(userId: number): Promise<Cart> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user || !user.cart) {
      throw new NotFoundException('Cart not found');
    }
    return user.cart;
  }

  // Удаление товара из корзины
  async removeFromCart(
    userId: number,
    removeFromCartDto: RemoveFromCartDto,
  ): Promise<void> {
    const { productId } = removeFromCartDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user || !user.cart) {
      throw new NotFoundException('Cart not found');
    }

    // Находим элемент корзины
    const cartItem = user.cart.items.find(
      (item) => item.product.id === productId,
    );
    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    // Удаляем элемент корзины
    await this.cartItemRepository.remove(cartItem);
  }
}
