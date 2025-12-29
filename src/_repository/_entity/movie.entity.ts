import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from './base.entity';
import { MovieSession } from './movie-session.entity';

@Entity({
  name: 'movies',
})
export class Movie extends BaseEntity {
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
  title: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
  })
  minAllowedAge: number;

  @BeforeInsert()
  generateId() {
    this.guid = uuidv4();
  }

  @OneToMany(() => MovieSession, (session) => session.movie)
  sessions: MovieSession[];
}
