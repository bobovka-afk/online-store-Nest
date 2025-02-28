import { Injectable, NotFoundException } from '@nestjs/common';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create.dto';
import { UpdateProductDto } from './dto/update.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async findAllByCategory(category: string): Promise<any[]> {
    return this.productsRepository.find({ where: { category } });
  }

  async findAllCategory(): Promise<string[]> {
    const categories = await this.productsRepository.find({
      select: ['category'],
    });
    return categories.map((c) => c.category);
  }

  async findOne(id: number): Promise<Products | null> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
