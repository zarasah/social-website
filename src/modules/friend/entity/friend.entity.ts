import { BaseEntity } from "../../../common/entities/base.entity";
import { Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity({name: 'friend'})
export class FriendEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.friendshipsAsFirstUser)
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.friendshipsAsSecondUser)
  secondUser: UserEntity;
}