import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { FriendrequestService } from "./friendrequest.service";
import { FriendRequestDto } from "./dto/friend.request.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { User } from "../../common/decorators/current.user.decorator";
import { UserEntity } from "../user/entity/user.entity";

@Controller('friendrequest')
export class FriendrequestController {
  constructor(
    private readonly friendRequestService: FriendrequestService
  ) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFriendRequests(@User() user: UserEntity) {
    console.log('user', user)
  }

  @Post()
  async sendFriendRequest(@Body() friendRequestDto: FriendRequestDto) {
    console.log('friendRequestDto', friendRequestDto)
    return this.friendRequestService.sendFriendRequest(friendRequestDto);
  }
}
