import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {dbConnectionsConfig} from "./configs/ormconfig";
import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FriendrequestModule } from './modules/friendrequest/friendrequest.module';
import { FriendModule } from './modules/friend/friend.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
    expandVariables: true,
    load: [dbConnectionsConfig]
  }),
    DatabaseModule,
    AuthModule,
    UserModule,
    FriendrequestModule,
    FriendModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
