import { AppDataSource } from '../config/typeorm.config';
import { SeederService } from './seed.service';

async function runSeeder() {
  await AppDataSource.initialize(); // Подключаемся к БД
  console.log('🔗 База данных подключена');

  const seederService = new SeederService(AppDataSource);
  await seederService.seed();

  console.log('✅ Сидирование завершено!');
  await AppDataSource.destroy();
}

runSeeder().catch(console.error);
