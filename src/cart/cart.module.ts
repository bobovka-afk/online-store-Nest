// cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-items.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, User]), // Регистрируем сущности
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
