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
import { OrdersModule } from './orders/orders.module';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-items.entity';
import { Order } from './entities/orders.entity';
import { OrderItem } from './entities/order-items.entity';

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
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'Password',
        database: 'database',
        entities: [User, Product, Categories, Cart, CartItem, Order, OrderItem],
        synchronize: false,
        entity: [__dirname + '/database/core/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
      }),
    }),
    JwtModule.register({}),
    ProductsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
