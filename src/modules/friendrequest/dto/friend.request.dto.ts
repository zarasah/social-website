import { IsNotEmpty, IsNumber } from "class-validator";

export class FriendRequestDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}