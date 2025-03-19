import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeederService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 4200;

  const seederService = app.get(SeederService);

  await seederService.seed();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalGuards(app.get(RolesGuard));

  const config = new DocumentBuilder()
    .setTitle('Online Store API')
    .setDescription('API для управления онлайн-магазином')
    .setVersion('1.0')
    .addTag('products', 'Управление товарами')
    .addTag('category', 'Управление категориями')
    .addTag('cart', 'Корзина покупателя')
    .addTag('order', 'Оформление и управление заказами')
    .addTag('users', 'Управление пользователями')
    .addTag('auth', 'Аутентификация/Авторизация')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
bootstrap();
