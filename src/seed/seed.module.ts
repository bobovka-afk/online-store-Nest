import { Module } from '@nestjs/common';
import { SeederService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Categories } from '../entities/categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Categories])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeedModule {}
