import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
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
    return this.friendRequestService.getFriendRequests(user)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(@Body() friendRequestDto: FriendRequestDto, @User() user: UserEntity) {
    return this.friendRequestService.sendFriendRequest(friendRequestDto, user);
  }

  @Post('accept/:id')
  @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(@User() user: UserEntity, @Param('id', ParseIntPipe) requestId: number) {
    return this.friendRequestService.acceptFriendRequest(user, requestId);
  }

  @Post('decline/:id')
  @UseGuards(JwtAuthGuard)
  async declineFriendRequest(@User() user: UserEntity, @Param('id', ParseIntPipe) requestId: number) {
    return this.friendRequestService.declineFriendRequest(user, requestId);
  }
}
