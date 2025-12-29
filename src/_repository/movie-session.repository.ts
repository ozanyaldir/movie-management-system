import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieSession } from './_entity';

@Injectable()
export class MovieSessionRepository {
  constructor(
    @InjectRepository(MovieSession)
    private repository: Repository<MovieSession>,
  ) {}

  async createNewMovieSession(m: MovieSession): Promise<MovieSession> {
    return await this.repository.save(m);
  }

  async updateMovieSession(id: number, m: MovieSession): Promise<void> {
    await this.repository.update({ id }, m);
    return;
  }
}
