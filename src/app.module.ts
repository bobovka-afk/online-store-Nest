import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';
import { UsersModule } from 'users/users.module';
import { AuthModule } from './auth/auth.module';
import { Categories } from './entities/categories.entity';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-items.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Product, Categories, Cart, CartItem, Order, OrderItem],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    JwtModule.register({}),
    ProductsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    CartModule,
    OrderModule,
    SeedModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
