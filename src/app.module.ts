import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Products } from './products/entities/products.entity';

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
      entities: [User, Products],
      synchronize: true,
    }),
    ProductsModule,
  ],
  providers: [],
})
export class AppModule {}
