import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {ConfigService, registerAs} from '@nestjs/config';
import {DatabaseType} from 'typeorm';

const config: ConfigService = new ConfigService();

const getOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {

  return {
    type: config.get<DatabaseType>(`DB_TYPE`),
    host: config.get(`DB_HOST`),
    port: config.get<number>(`DB_PORT`),
    database: config.get(`DB_NAME`),
    username: config.get(`DB_USERNAME`),
    password: config.get(`DB_PASSWORD`),
    synchronize: config.get('DB_SYNC'),
    cli: {
      entitiesDir: "src/**/entities",
      migrationsDir: 'src/resources/migrations',
    },
    autoLoadEntities: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
  } as TypeOrmModuleOptions;
};

export const dbConnectionsConfig = registerAs('DB_CONFIG', () => getOrmConfig(config));

export default getOrmConfig(config);
