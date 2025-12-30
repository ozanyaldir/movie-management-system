import { Injectable } from '@nestjs/common';
import { MovieSessionRepository } from 'src/_repository';
import { MovieSession } from 'src/_repository/_entity';

@Injectable()
export class MovieSessionService {
  constructor(private readonly repository: MovieSessionRepository) {}

  async create(m: MovieSession): Promise<MovieSession> {
    return await this.repository.create(m);
  }

  async update(id: number, m: MovieSession): Promise<void> {
    await this.repository.update(id, m);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getPlainByGuid(guid: string): Promise<MovieSession | null> {
    return await this.repository.getByGuid(guid);
  }

  async getDetailedByGuid(guid: string): Promise<MovieSession | null> {
    return await this.repository.getByGuid(guid, true);
  }

  async list(
    movieId: number,
    page: number = 1,
    size: number = 20,
  ): Promise<[MovieSession[], number, number, number]> {
    return await this.repository.list(movieId, page, size);
  }
}
