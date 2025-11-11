import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Task } from '../entities/task.entity';
import { Permission } from '../entities/permission.entity';
import { AuditLog } from '../entities/audit-log.entity';

export const typeOrmOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'turbovets',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [User, Organization, Task, Permission, AuditLog],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
};

const AppDataSource = new DataSource(typeOrmOptions);
export default AppDataSource;
