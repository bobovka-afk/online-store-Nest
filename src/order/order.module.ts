import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-items.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { OrderItem } from '../entities/order-items.entity';
import { Order } from '../entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, User, OrderItem, Order]), // Регистрируем сущности
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
