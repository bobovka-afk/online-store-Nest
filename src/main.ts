import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/guards/roles.guard';

const PORT = process.env.PORT ?? 4200; // эту переменную объявляй внутри функции

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
        //эти поля лучше убрать, если не используешь этот функционал
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalGuards(app.get(RolesGuard)); 

  await app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    // логи только латиницей
  });
}
bootstrap();
