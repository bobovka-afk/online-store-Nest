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
  Query,BadRequestException, UseGuards} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/create.dto';
import { Products } from './entities/products.entity';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum'
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { Admin } from 'typeorm';

@Controller('products')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/category')
  @Roles(Role.User, Role.Admin)
  async findAllByCategory(@Query('category') category: string): Promise<Products[]> {
      if (!category) {
          throw new BadRequestException('Необходим параметр запроса категории');
      }
      return this.productsService.findAllByCategory(category);
  }
  @Get('/categories')
  @Roles(Role.User, Role.Admin)
  public async getAllCategories() {
    return this.productsService.findAllCategory();
  }

  @Get('/:id')
  @Roles(Role.User, Role.Admin)
  public async getById(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);
    return product;
  }

  @Post('/create')
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Товар успешно создан', product };
  }

  @Put('/:id')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  public async delete(@Param('id') id: number) {
    await this.productsService.delete(id);
    return { message: 'Товар успешно удален' };
  }
}
