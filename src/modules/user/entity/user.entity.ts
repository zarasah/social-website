import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, OneToMany, Entity } from "typeorm";
import { FriendRequestEntity } from "../../friendrequest/entity/friend.request.entity";
import { FriendEntity } from "../../friend/entity/friend.entity";

@Entity({name: 'user'})
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  public firstName: string;

  @Column({ type: 'varchar', nullable: false })
  public lastName: string;

  @Column({ unique: true, type: 'varchar', nullable: false })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  @Column({ type: 'int', nullable: false })
  public age: number;

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequestEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.firstUser)
  friendshipsAsFirstUser: FriendEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.secondUser)
  friendshipsAsSecondUser: FriendEntity[];
}