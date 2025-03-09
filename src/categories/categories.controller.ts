import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from 'auth/enums/roles.enum';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Products } from 'entities/products.entity';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('categories')
@UseGuards(RolesGuard, JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get(':categoryId')
  public async findAllByCategory(
    @Param('categoryId') categoryId: number,
    @Query() paginationDto: PaginationDto, // по умолчанию цена по убыванию 
  ): Promise<{ data: Products[]; count: number }> {
    if (!categoryId) {
      throw new NotFoundException('Категория не найдена');
    }
    return this.categoriesService.findAllByCategory(categoryId, paginationDto);
  }

  @Get('list')
  public async getAllCategories() {
    return this.categoriesService.findAllCategory();
  }
}
