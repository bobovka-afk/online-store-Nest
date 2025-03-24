import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seed.service';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const seederService = app.get(SeederService);
  await seederService.seed();
  console.log('Сидирование завершено!');
  await app.close();
}

runSeeder();
