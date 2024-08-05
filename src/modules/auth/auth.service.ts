import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../user/dto/create.user.dto";
import { UserResponseDto } from "./dto/user.response.dto";
import * as bcrypt from "bcryptjs";
import { plainToClass } from "class-transformer";
import { sign } from "jsonwebtoken";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if (!userExists) {
      const hashPassword = await bcrypt.hash(createUserDto.password, 5);
      const newUser = this.userRepository.create({...createUserDto, password: hashPassword});
      const user = await this.userRepository.save(newUser);
      const token = await this.generateToken(user);
      const responseUser = plainToClass(UserResponseDto, user);

      return {...responseUser, token}
    } else {
      throw new HttpException('user already exist...', HttpStatus.CONFLICT);
    }
  }

  async login(loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.validateJwtUser(loginDto);
    const token = await this.generateToken(user);
    const responseUser = plainToClass(UserResponseDto, user);

    return {...responseUser, token}
  }

  async validateJwtUser(loginDto: LoginDto) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: loginDto.email
      }
    })

    if(!userExists) {
      throw new HttpException('invalid email or password', HttpStatus.BAD_REQUEST)
    }

    const passwordEquals = await bcrypt.compare(loginDto.password, userExists.password);

    if (passwordEquals) {
      return userExists;
    } else {
      throw new HttpException('invalid email or password', HttpStatus.UNAUTHORIZED)
    }
  }

  private async generateToken(user: UserEntity) {
    const payload = {email: user.email, id: user.id}
    return sign(
      { ...payload },
      this.configService.get('JWT_SECRET')
    )
  }
}