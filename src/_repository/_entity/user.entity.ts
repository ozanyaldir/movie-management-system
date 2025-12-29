import { Entity, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './base.entity';

export enum UserType {
  Manager = 'manager',
  Customer = 'customer',
}

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  guid: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  passwordHash: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({
    type: 'enum',
    enum: Object.values(UserType),
    default: UserType.Customer,
    nullable: false,
  })
  type: UserType;

  @BeforeInsert()
  generateId() {
    this.guid = uuidv4();
  }
}
