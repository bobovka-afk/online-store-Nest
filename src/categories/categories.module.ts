import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'entities/categories.entity';
import { Product } from 'entities/product.entity';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Categories]), AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
