import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Product } from 'entities/product.entity';
import { CreateCategoryDto } from 'category/dto/createCategory.dto';
import { Repository } from 'typeorm';
import { PaginationCategoryDto } from './dto/paginationCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAllByCategory(
    categoryId: number,
    paginationCategoryDto: PaginationCategoryDto,
  ): Promise<{ data: Product[]; count: number }> {
    const category: Category | null = await this.categoriesRepository.findOneBy(
      { id: categoryId },
    );
    if (!category) {
      throw new NotFoundException(`Категория с id ${categoryId} не найдена`);
    }

    const [products, total] = await this.productsRepository.findAndCount({
      relations: ['categories'],
      where: { category: { id: categoryId } },
      take: paginationCategoryDto.limit,
      skip: paginationCategoryDto.offset,
      order: {
        price: (paginationCategoryDto.priceOrder ?? 'desc').toUpperCase() as
          | 'ASC'
          | 'DESC',
      },
    });

    return {
      data: products,
      count: total,
    };
  }

  async findAllCategory(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoriesRepository.save(createCategoryDto);
    } catch {
      throw new InternalServerErrorException('Не удалось создать категорию');
    }
  }
}
