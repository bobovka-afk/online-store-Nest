import { Injectable, NotFoundException } from '@nestjs/common';
import { Products } from '../entities/products.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/update.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Categories } from 'entities/categories.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,

    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async findAllByCategory(categoryName: string): Promise<Products[]> {
    return this.productsRepository.find({
      relations: ['categories'],
      where: { categories: { name: categoryName } },
    });
  } // переделать на возврат id 

  async findAllCategory(): Promise<{ id: number; name: string }[]> {
    const categories = await this.categoriesRepository.find();
    return categories.map((category) => ({
      id: category.id,
      name: category.name, //пагинацию и убрать перебор т.к. описание категории удалено
    }));
  }

  async findOneProduct(id: number): Promise<Products | null> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException 
    }
    return this.productsRepository.findOne({ where: { id } });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Products> { // новый роут который присваивает категории товарам
    const { name, price, description, categoryIds } = createProductDto;

    const categories = await this.categoriesRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    // категории запрос == бд
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

  async createCategory( // создать service.category для создания категории и присваивании (43строка)
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    Object.assign(product, updateProductDto); //переделать

    return this.productsRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
