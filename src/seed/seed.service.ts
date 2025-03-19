import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Categories } from '../entities/categories.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) {}

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
      console.log(' Пользователи добавлены успешно');
    } else {
      console.log(' Пользователь "admin@gmail.com" уже существует, пропуск...');
    }
  }

  async seedCategories() {
    const categoryRepository = this.dataSource.getRepository(Categories);

    const existingCategories = await categoryRepository.find();
    const existingCategoryNames = new Set(
      existingCategories.map((cat) => cat.name),
    );

    const newCategories = Array.from({ length: 5 })
      .map(() => ({ name: faker.commerce.department() }))
      .filter((cat) => !existingCategoryNames.has(cat.name)); // Исключаем дубликаты

    if (newCategories.length > 0) {
      try {
        await categoryRepository
          .createQueryBuilder()
          .insert()
          .into(Categories)
          .values(newCategories)
          .orIgnore() // Для PostgreSQL, чтобы пропустить дубликаты
          .execute();
        console.log(' Категории добавлены успешно');
      } catch {
        console.error(' Ошибка при добавлении категорий:');
      }
    } else {
      console.log('️ Все категории уже существуют, пропуск...');
    }
  }

  async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Categories);

    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      console.log(' Продукты уже существуют, пропуск...');
      return;
    }

    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      console.log('️ Нет категорий, пропуск добавления продуктов...');
      return;
    }

    const products = Array.from({ length: 5 }).map(() => {
      const randomCategories = faker.helpers.arrayElements(
        categories,
        faker.number.int({ min: 1, max: 3 }),
      );

      return {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        stockQuantity: faker.number.int({ min: 10, max: 100 }),
        description: faker.commerce.productDescription(),
        categories: randomCategories,
      };
    });

    await productRepository.save(products);
    console.log('Продукты добавлены успешно');
  }

  async seed() {
    await this.seedUsers();
    await this.seedCategories();
    await this.seedProducts();
    console.log('Сеанс заполнения базы данных завершен!');
  }
}
