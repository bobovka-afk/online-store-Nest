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
      where: { categories: { name: categoryName } }, // работать надо с айди, не с именем. исходи из того что ты пришлешь на фронт массив категорий, который будет включать айди, и они тебе будут уже присылать айди категории.
    });
  }

  async findAllCategory(): Promise<{ id: number; name: string }[]> {
    const categories = await this.categoriesRepository.find(); // лучше так не делать. ты вытаскиваешь всё содержимое таблицы. точно ли есть в этом необходимость, или можно добавить фильтр? как минимум нужно добавить пагинацию
    return categories.map((category) => ({
      // в чем смысл этого перебора?
      id: category.id,
      name: category.name,
    }));
  }

  async findOne(id: number): Promise<Products | null> {
    const product = await this.productsRepository.findOne({ where: { id } }); // findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Продукт с id ${id} не найден`); // текст тут необязательно. на незащищенных роутах всегда надо быть осторожным с текстом который отдаешь обратно, чтобы не было возможности перебрать твою базу
    }
    return this.productsRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const { name, price, description, categoryIds } = createProductDto; //я бы лучше сделал отдельный роут который будет по одной добавлять категории к продукту

    const categories = await this.categoriesRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    // категории запрос == бд
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('Некоторые категории не найдены'); // какие?
    }

    const product = this.productsRepository.create({
      name,
      price,
      description,
      categories,
    });
    // кода который на несколько строк лучше отделять пустыми строками для чистоты
    return this.productsRepository.save(product);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    // почему функция для создания категорий находится в сервисе по работе с продуктами, а не в сервисе по работе с категориями?
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }

  async update( // лучше использовать более интуитивные названия. не update, a updateProduct например
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    Object.assign(product, updateProductDto); // чистая чепуха, в тг уже писал почему

    return this.productsRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.delete(id);
    // что произойдет если ты удалишь продукт который уже лежит у кого-то в корзине?
  }
}
