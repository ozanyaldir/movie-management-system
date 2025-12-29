import { Entity, Column, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { MovieSession } from './movie-session.entity';

@Entity({
  name: 'user_tickets',
})
export class UserTicket extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  guid: string;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  sessionId: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isUsed: boolean;

  @BeforeInsert()
  generateId() {
    this.guid = uuidv4();
  }

  @ManyToOne(() => User, (user) => user.tickets)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'user_id' })
  user: User;

  @ManyToOne(() => MovieSession, (session) => session.tickets)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'session_id' })
  session: MovieSession;
}
