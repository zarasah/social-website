import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FriendEntity } from "./entity/friend.entity";
import { In, Repository } from "typeorm";
import { UserEntity } from "../user/entity/user.entity";

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity) private readonly friendRepository: Repository<FriendEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async getUserFriends(user: UserEntity){
    const friends = this.friendRepository.find({
      where: [
        { firstUser: { id: user.id } },
        { secondUser: { id: user.id } },
      ],
      relations: ['firstUser', 'secondUser'],
    });

    const friendIds = (await friends).map(friend =>
      friend.firstUser.id === user.id ? friend.secondUser.id : friend.firstUser.id,
    );

    return this.userRepository.find({
      where: {
        id: In(friendIds),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });
  }
}
