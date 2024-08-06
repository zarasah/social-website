import { IsNotEmpty, IsNumber } from "class-validator";
// import { Transform } from "class-transformer";

export class FriendRequestDto {
  // @Transform(({value}) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  // @Transform(({value}) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}