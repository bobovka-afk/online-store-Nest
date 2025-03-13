import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST', 'localhost'),
  port: parseInt(configService.get<string>('POSTGRES_PORT', '5432'), 10),
  username: configService.get<string>('POSTGRES_USER', 'pgadmin'),
  password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
  database: configService.get<string>('POSTGRES_DB', 'pgsql'),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
