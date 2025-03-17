import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from 'auth/enums/roles.enum';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Product } from 'entities/product.entity';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';
import { Categories } from '../entities/categories.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
@UseGuards(RolesGuard, JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @Roles(ERole.ADMIN)
  public async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Categories> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get('list')
  public async getAllCategories(): Promise<Categories[]> {
    return this.categoriesService.findAllCategory();
  }

  @Get(':categoryId')
  public async findAllByCategory(
    @Param('categoryId') categoryId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; count: number }> {
    return this.categoriesService.findAllByCategory(categoryId, paginationDto);
  }
}
