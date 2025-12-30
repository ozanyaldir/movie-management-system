import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';
import { Ticket } from './ticket.entity';

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

  @DeleteDateColumn()
  deletedAt: Date | null;

  @BeforeInsert()
  generateId() {
    this.guid = uuidv4();
  }

  @ManyToOne(() => Movie, (movie) => movie.sessions)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'movie_id' })
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.session)
  tickets: Ticket[];
}
