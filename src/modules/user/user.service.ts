import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Like, Repository } from "typeorm";
import { SearchUserDto } from "./dto/search.user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async searchUsers(searchUserDto: SearchUserDto): Promise<UserEntity[]> {
    const { firstName, lastName, age } = searchUserDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.select(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.age']);

    if (firstName) {
      queryBuilder.andWhere('user.firstName ILIKE :firstName', { firstName: `%${firstName}%` });
    }
    if (lastName) {
      queryBuilder.andWhere('user.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
    }
    if (age !== undefined) {
      queryBuilder.andWhere('user.age = :age', { age });
    }

    return queryBuilder.getMany();
  }
}
