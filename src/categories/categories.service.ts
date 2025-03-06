import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'entities/categories.entity';
import { Products } from 'entities/products.entity';
import { CreateCategoryDto } from 'categories/dto/createCategory.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
        @InjectRepository(Products)
        private productsRepository: Repository<Products>
    ) {}

    async findAllByCategory(categoryId: number): Promise<Products[]> {
        return this.productsRepository.find({
        relations: ['categories'],
        where: { categories: { id: categoryId } },
        });
    }
    
    async findAllCategory(): Promise<{ id: number; name: string }[]> {
        return this.categoriesRepository.find();
         }
    
    async createCategory(
         createCategoryDto: CreateCategoryDto,
        ): Promise<Categories> {
        const newCategory = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(newCategory);
        }

 


}



