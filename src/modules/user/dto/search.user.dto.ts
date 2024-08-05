import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from "class-transformer";

export class SearchUserDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @Transform(({value}) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly age?: number;
}