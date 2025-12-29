import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';
import { UserTicket } from './user-ticket.entity';

@Entity({
  name: 'movie_sessions',
})
export class MovieSession extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  guid: string;

  @Column({ type: 'int', nullable: false })
  movieId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  roomNumber: string;

  @Column({ type: 'date', nullable: false })
  screeningDate: Date;

  @Column({ type: 'time', nullable: false })
  screeningTime: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    this.guid = uuidv4();
  }

  @ManyToOne(() => Movie, (movie) => movie.sessions)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'movie_id' })
  movie: Movie;

  @OneToMany(() => UserTicket, (ticket) => ticket.session)
  tickets: UserTicket[];
}
