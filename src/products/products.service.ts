import { Injectable, NotFoundException } from '@nestjs/common';
import { Products } from '../entities/products.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { Categories } from 'entities/categories.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}


  async findOneProduct(id: number): Promise<Products | null> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException 
    }
    return this.productsRepository.findOne({ where: { id } });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Products> {
    const { name, price, description, categoryIds } = createProductDto;

    const categories = await this.categoriesRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('Некоторые категории не найдены'); 
    }

    const product = this.productsRepository.create({
      name,
      price,
      description,
      categories,
    });

    return this.productsRepository.save(product);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<boolean> {
    const result = await this.productsRepository.update(id, updateProductDto);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
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
