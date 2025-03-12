import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards, NotFoundException,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Product } from '../entities/product.entity';

@Controller('products')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/:id')
  public async getById(@Param('id') id: number): Promise<Product | null> {
    return this.productsService.findOneProduct(id);
  }

  @Post('create')
  @Roles(ERole.ADMIN)
  public async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  @Roles(ERole.ADMIN)
  public async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ success: boolean }> {
    const result = await this.productsService.updateProduct(
      id,
      updateProductDto,
    );

    if (!result) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    return { success: true };
  }

  @Delete(':id')
  @Roles(ERole.ADMIN)
  public async delete(@Param('id') id: number): Promise<boolean> {
    await this.productsService.deleteProduct(id);
    return true;
  }
}
