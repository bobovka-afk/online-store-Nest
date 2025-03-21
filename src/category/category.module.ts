import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'entities/category.entity';
import { Product } from 'entities/product.entity';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Categories]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
