import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProductsModule } from './products/products.module';
import { Products } from './entities/products.entity';
import { UsersModule } from 'users/users.module';
import { AuthModule } from './auth/auth.module';
import { Categories } from './entities/categories.entity';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UsersModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Products, Categories],
        synchronize: true,
      }),
    }),
    JwtModule.register({}),
    ProductsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
  ],
  providers: [RolesGuard],
})
export class AppModule {}
