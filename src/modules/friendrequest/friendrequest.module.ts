import { Module } from '@nestjs/common';
import { FriendrequestService } from './friendrequest.service';
import { FriendrequestController } from './friendrequest.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./entity/friend.request.entity";
import { UserEntity } from "../user/entity/user.entity";
import { FriendEntity } from "../friend/entity/friend.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestEntity, UserEntity, FriendEntity])],
  providers: [FriendrequestService],
  controllers: [FriendrequestController]
})
export class FriendrequestModule {}
