import { Controller, Get, UseGuards } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { User } from "../../common/decorators/current.user.decorator";
import { UserEntity } from "../user/entity/user.entity";

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserFriends(@User() user: UserEntity) {
    return this.friendService.getUserFriends(user);
  }
}
