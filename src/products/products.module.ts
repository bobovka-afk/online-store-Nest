import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../entities/product.entity';
import { Categories } from '../entities/categories.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Categories]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
