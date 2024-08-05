import { Controller, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./entity/user.entity";
import { SearchUserDto } from "./dto/search.user.dto";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @Get('search')
  async searchUsers(
    @Query() searchUserDto: SearchUserDto,
  ): Promise<UserEntity[]> {
    return this.userService.searchUsers(searchUserDto);
  }
}
