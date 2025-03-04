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
} from '@nestjs/common'; // большие импорты отделять от других пустой строкой
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { Products } from '../entities/products.entity';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/category') //   "/" в начале тут не нужен
  @Roles(Role.User, Role.Admin) // нет смысла наглядно указывать что роут доступ для юзера. это по дефолту так. точно также как и админу доступны все роуты которые доступны юзеру. исключение это если стоит декоратор что роут доступен только для админа, тогда юзеру он недоступен.
  async findAllByCategory(
    @Query('categoryName') categoryName: string,
  ): Promise<Products[]> {
    if (!categoryName) {
      throw new NotFoundException('Некоторые категории не найдены');
    } else {
      return this.productsService.findAllByCategory(categoryName);
    }
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
    // return this.productsService.findOne(id);
  }

  @Post('/create')
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('/create-category')
  @Roles(Role.Admin)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
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
    // в контроллере логику и обращения в базу не пишем
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
    // не надо везде возвращать месседж. фронт не будет обрабатывать эти конкретные строки. возвращаем либо данные либо булиан
  }
}
