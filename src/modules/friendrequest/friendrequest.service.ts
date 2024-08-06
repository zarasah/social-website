import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestEntity } from "./entity/friend.request.entity";
import { Repository } from "typeorm";
import { FriendRequestDto } from "./dto/friend.request.dto";
import { UserEntity } from "../user/entity/user.entity";
import { FriendEntity } from "../friend/entity/friend.entity";
import { FriendRequestStatusEnum } from "../../common/enums/friend.request.status.enum";

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
        },
        status: FriendRequestStatusEnum.PENDING,
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
      order: { createdAt: 'DESC' },
    });

    if (existingRequest) {
      if (existingRequest.status === FriendRequestStatusEnum.PENDING) {
        throw new HttpException('Friend request already exists', HttpStatus.CONFLICT);
      } else if (existingRequest.status === FriendRequestStatusEnum.ACCEPTED) {
        throw new HttpException('You are already friends', HttpStatus.CONFLICT);
      } else if (existingRequest.status === FriendRequestStatusEnum.DECLINED) {
        existingRequest.status = FriendRequestStatusEnum.PENDING;
        await this.friendRequestRepository.save(existingRequest);
        return {
          status: HttpStatus.OK,
          message: 'Friend request re-sent successfully',
        };
      }
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: user,
      receiver: receiver,
      status: FriendRequestStatusEnum.PENDING
    });
    await this.friendRequestRepository.save(friendRequest);

    return {
      status: HttpStatus.OK,
      message: 'Friend request sent successfully'
    };
  }

  async acceptFriendRequest(user: UserEntity, requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: user, status: FriendRequestStatusEnum.PENDING },
      relations: ['sender', 'receiver']
    });

    if (!friendRequest) {
      throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);
    }

    const newFriendship = this.friendRepository.create({
      firstUser: friendRequest.sender,
      secondUser: friendRequest.receiver,
    });

    await this.friendRepository.save(newFriendship);

    friendRequest.status = FriendRequestStatusEnum.ACCEPTED;
    await this.friendRequestRepository.save(friendRequest);

    return {
      status: HttpStatus.OK,
      message: 'Friend request accepted successfully',
    };
  }

  async declineFriendRequest(user: UserEntity, requestId: number) {
    console.log('requestId', requestId)
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: user, status: FriendRequestStatusEnum.PENDING }
    });

    if (!friendRequest) {
      throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);
    }

    friendRequest.status = FriendRequestStatusEnum.DECLINED;
    await this.friendRequestRepository.save(friendRequest);

    return {
      status: HttpStatus.OK,
      message: 'Friend request declined successfully',
    };
  }
}
