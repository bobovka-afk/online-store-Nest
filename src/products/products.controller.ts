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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/create.dto';
import { Products } from './entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/category')
  async findAllByCategory(
    @Query('category') category: string,
  ): Promise<Products[]> {
    if (!category) {
      throw new Error('Необходим параметр запроса категории');
    }
    return this.productsService.findAllByCategory(category);
  }
  @Get('/categories')
  public async getAllCategories() {
    return this.productsService.findAllCategory();
  }

  @Get('/:id')
  public async getById(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    return product;
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Товар успешно создан', product };
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    return {
      message: `Товар с ID ${id} обновлен`,
      updatedProduct,
    };
  }

  @Delete('/:id')
  public async delete(@Param('id') id: number) {
    await this.productsService.delete(id);
    return { message: 'Товар успешно удален' };
  }
}
