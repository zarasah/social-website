import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, ManyToMany, JoinTable, Entity } from "typeorm";

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

  @ManyToMany(() => UserEntity, user => user.friends)
  @JoinTable()
  public friends: UserEntity[];
}