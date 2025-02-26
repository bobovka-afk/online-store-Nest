import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/create.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  public getAll() {
    return ['products']; 
  }

  @Get('/:id')
  public getById(@Param('id') id: string) {
    return { id };
  }

  @Post('/')
  public create(@Body() createProductDto: CreateProductDto) {
    return { message: 'Продукт успешно создан', product: createProductDto };
  }

  @Put('/:id')
  public update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return { message: `Продукт с ID ${id} обновлен`, updatedProduct: updateProductDto };
  }

  @Delete('/:id')
  public delete(@Param('id') id: string) {
    return { message: `Продукт с ID ${id} удален` };
  }
}
