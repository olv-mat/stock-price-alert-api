import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AlertEntity } from './modules/alert/entities/alert.entity';
import { UserEntity } from './modules/user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [AlertEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
