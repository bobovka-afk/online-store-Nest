import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(private readonly dataSource: DataSource) {}

  async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const existingUser = await userRepository.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (!existingUser) {
      await userRepository.insert({
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });
    }
  }

  async seedCategories() {
    const categoryRepository = this.dataSource.getRepository(Category);

    const existingCategories = await categoryRepository.find();
    const existingCategoryNames = new Set(existingCategories.map((cat) => cat.name));

    const newCategories = Array.from({ length: 5 })
      .map(() => ({ name: faker.commerce.department() }))
      .filter((cat) => !existingCategoryNames.has(cat.name)); // Исключаем дубликаты

    if (newCategories.length > 0) {
      await categoryRepository
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(newCategories)
        .orIgnore() // Для PostgreSQL, чтобы пропустить дубликаты
        .execute();
    }
  }

  async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Category);

    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      return; // Продукты уже существуют, пропуск
    }

    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      return; // Нет категорий, пропуск добавления продуктов
    }

    const products = Array.from({ length: 5 }).map(() => {
      const randomCategories = faker.helpers.arrayElements(categories, faker.number.int({ min: 1, max: 3 }));

      return {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        stockQuantity: faker.number.int({ min: 10, max: 100 }),
        description: faker.commerce.productDescription(),
        categories: randomCategories,
      };
    });

    await productRepository.save(products);
  }

  async seed() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedProducts();
  }
}
