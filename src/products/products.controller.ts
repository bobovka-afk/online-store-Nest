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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/create.dto';
import { Products } from './entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  public async getAll(): Promise<Products[]> {
    return this.productsService.findAll();
  }

  @Get('/:id')
  public async getById(@Param('id') id: number) {
    if (id) {
      return this.productsService.findOne(id);
    }
  }

  @Post('/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Товар успешно создан', product: createProductDto };
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
    return this.productsService.delete(id), { message: 'Товар успешно удален' };
  }
}
