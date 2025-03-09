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
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { ERole } from '../auth/enums/roles.enum';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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

  @Put(':id')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ success: boolean }> {
    const result = await this.productsService.updateProduct(id, updateProductDto);

    if (!result) {
      throw new NotFoundException(`Продукт с id ${id} не найден`);
    }

    return { success: true }; 
  }

  @Delete(':id')
  @Roles(ERole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async delete(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
    return true;
}
}
