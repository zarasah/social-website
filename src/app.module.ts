import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import {dbConnectionsConfig} from "./configs/ormconfig";
import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
    expandVariables: true,
    load: [dbConnectionsConfig]
  }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
