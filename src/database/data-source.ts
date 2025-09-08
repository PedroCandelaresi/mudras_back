import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

loadEnv();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'mudras',
  password: process.env.DB_PASSWORD || 'mudras2025',
  database: process.env.DB_DATABASE || 'mudras',
  synchronize: false,
  logging: true,
  entities: [
    join(__dirname, '..', 'modules/**/entities/*.entity.{ts,js}')
  ],
  migrations: [
    join(__dirname, 'migrations/*.{ts,js}')
  ],
});
