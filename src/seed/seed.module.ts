import { Module } from '@nestjs/common';
import { SeederService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Category])],
  providers: [SeederService],
  exports: [],
})
export class SeedModule {}
