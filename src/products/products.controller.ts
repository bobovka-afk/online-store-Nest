import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Products } from '../entities/products.entity';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
//убрал / из названия эндпоинтов и декораторы @Roles user, пайпы
@Controller('products')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/category')
  async findAllByCategory(
    @Query('categoryName') categoryName: string,
  ): Promise<Products[]> {
    if (!categoryName) {
      throw new NotFoundException('Некоторые категории не найдены');
    } else {
      return this.productsService.findAllByCategory(categoryName);
    }
  }

  @Get('categories')
  public async getAllCategories() {
    return this.productsService.findAllCategory();
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async getById(@Param('id') id: number) {
    return this.productsService.findOneProduct(id);
  }

  @Post('create')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Post('create-category')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.updateProduct(
      id,
      updateProductDto,
    );
    return {
      message: `Товар с ID ${id} обновлен`,
      updatedProduct,
    }; //
    // //
    // //
    // //перенести логику в сервис
  }

  @Delete(':id')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async delete(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
    return { message: 'Товар успешно удален' };
  }
}
