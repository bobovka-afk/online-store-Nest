import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Products } from './entities/products.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Categories } from './entities/categories.entity';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'sa',
      password: 'Password2201',
      database: 'db_currency',
      // host, port, username, password, database perenesti v .env
      entities: [User, Products, Categories],
      synchronize: true,
      // synchronize: true ubrat'
    }),
      // а где миграции?
    JwtModule.register({}),
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
