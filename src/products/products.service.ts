import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { Categories } from 'entities/categories.entity';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async findOneProduct(id: number): Promise<Product | null> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Товар с указанным id ${id} не найден`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { name, price, description, stockQuantity, categoryIds } = createProductDto;

      const categories = await this.categoriesRepository.find({
        where: {
          id: In(categoryIds),
        },
      });

      if (categories.length !== categoryIds.length) {
        throw new NotFoundException('Неверно указаны категории');
      }

      const product = await this.productsRepository.save({
        name,
        price,
        description,
        stockQuantity,
        categories,
      });

      return product;
    } catch (error) {
      if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
        throw new ConflictException('Товар с таким именем уже существует');
      }
      throw new InternalServerErrorException('Не удалось создать товар');
    }
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<boolean> {
    const updateResult = await this.productsRepository.update(
      id,
      updateProductDto,
    );

    if (updateResult.affected === 0) {
      throw new NotFoundException('Продукт не найден');
    }

    return true;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    return true;
  }
}
