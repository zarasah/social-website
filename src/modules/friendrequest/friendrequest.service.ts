import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./entity/friend.request.entity";
import { Repository } from "typeorm";
import { FriendRequestDto } from "./dto/friend.request.dto";
import { UserEntity } from "../user/entity/user.entity";
import { FriendEntity } from "../friend/entity/friend.entity";

@Injectable()
export class FriendrequestService {
  constructor(
    @InjectRepository(FriendRequestEntity) private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendEntity) private readonly friendRepository: Repository<FriendEntity>,
  ) {}

  async getFriendRequests(user: UserEntity) {
    return this.friendRequestRepository.find({
      where: {
        receiver: {
          id: user.id
        }
      },
      relations: ['sender'],
      select: {
        sender: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    });
  }

  async sendFriendRequest(friendRequestDto: FriendRequestDto, user: UserEntity) {
    if (user.id === friendRequestDto.receiverId) {
      throw new HttpException('Cannot send friend request to yourself', HttpStatus.BAD_REQUEST);
    }

    const receiver = await this.userRepository.findOne({ where: { id: friendRequestDto.receiverId }});

    if (!receiver) {
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: user.id }, receiver: { id: friendRequestDto.receiverId } },
        { sender: { id: friendRequestDto.receiverId }, receiver: { id: user.id } },
      ],
    });

    if (existingRequest) {
      throw new HttpException('Friend request already exists', HttpStatus.CONFLICT);
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: user,
      receiver: receiver,
    });
    await this.friendRequestRepository.save(friendRequest);

    return {
      status: HttpStatus.OK,
      message: 'Friend request sent successfully'
    };
  }
}
