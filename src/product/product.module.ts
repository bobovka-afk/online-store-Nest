import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../entities/product.entity';
import { Categories } from '../entities/category.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Categories]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
