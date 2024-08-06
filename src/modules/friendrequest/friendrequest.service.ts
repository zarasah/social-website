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

  async sendFriendRequest(friendRequestDto: FriendRequestDto) {
    if (friendRequestDto.senderId === friendRequestDto.receiverId) {
      throw new HttpException('Cannot send friend request to yourself', HttpStatus.BAD_REQUEST);
    }

    const sender = await this.userRepository.findOne({ where: { id: friendRequestDto.senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: friendRequestDto.receiverId }});

    if (!sender || !receiver) {
      throw new HttpException('Sender or receiver not found', HttpStatus.NOT_FOUND);
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: friendRequestDto.senderId }, receiver: { id: friendRequestDto.receiverId } },
        { sender: { id: friendRequestDto.receiverId }, receiver: { id: friendRequestDto.senderId } },
      ],
    });

    if (existingRequest) {
      throw new HttpException('Friend request already exists', HttpStatus.CONFLICT);
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: sender,
      receiver: receiver,
    });
    await this.friendRequestRepository.save(friendRequest);

    return {
      status: HttpStatus.OK, 
      message: 'Friend request sent successfully'
    };
  }
}
