import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'entities/categories.entity';
import { Products } from 'entities/products.entity';
import { CreateCategoryDto } from 'categories/dto/createCategory.dto';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async findAllByCategory(
    categoryId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: Products[]; count: number }> {
    const { limit = 20, offset = 0, priceOrder = 'desc' } = paginationDto;

    const [products, total] = await this.productsRepository.findAndCount({
      relations: ['categories'],
      where: { categories: { id: categoryId } },
      take: limit,
      skip: offset,
      order: {
        price: priceOrder.toUpperCase() as 'ASC' | 'DESC',
      },
    });

    return {
      data: products,
      count: total,
    };
  }

  async findAllCategory(): Promise<{ id: number; name: string }[]> {
    return this.categoriesRepository.find();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    return this.categoriesRepository.save(createCategoryDto);
  }
}
