import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";
import { FriendRequestStatusEnum } from "../../../common/enums/friend.request.status.enum";

@Entity({name: 'friendReques'})
export class FriendRequestEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests)
  receiver: UserEntity;

  @Column({ type: 'varchar', nullable: false, default: FriendRequestStatusEnum.PENDING })
  status: FriendRequestStatusEnum;
}