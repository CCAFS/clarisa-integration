import 'dotenv/config';
import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { env } from 'process';
import { join } from 'path';
export const ormConfig: MikroOrmModuleSyncOptions = {
  entities: [join(__dirname, '..', '..', 'domain/**/*.entity{.ts,.js}')],
  entitiesTs: [join(__dirname, '..', '..', 'domain/**/*.entity{.ts,.js}')],
  dbName: env.DB_NAME,
  driver: MySqlDriver,
  user: env.DB_USER_NAME,
  password: env.DB_USER_PASSWORD,
  host: env.DB_HOST,
};
