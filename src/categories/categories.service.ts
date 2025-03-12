import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'entities/categories.entity';
import { Product } from 'entities/product.entity';
import { CreateCategoryDto } from 'categories/dto/createCategory.dto';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAllByCategory(
    categoryId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; count: number }> {
    const category: Categories | null =
      await this.categoriesRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException(`Категория с id ${categoryId} не найдена`);
    }
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

  async findAllCategory(): Promise<Categories[]> {
    return this.categoriesRepository.find();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    return this.categoriesRepository.save(createCategoryDto);
  }
}
