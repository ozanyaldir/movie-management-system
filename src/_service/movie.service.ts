import { Injectable } from '@nestjs/common';
import { newMovieFromDeleteRequest } from 'src/_factory';
import { MovieRepository } from 'src/_repository';
import { Movie } from 'src/_repository/_entity';

@Injectable()
export class MovieService {
  constructor(private readonly repository: MovieRepository) {}

  async create(m: Movie): Promise<Movie> {
    return await this.repository.createNewMovie(m);
  }

  async update(id: number, m: Movie): Promise<void> {
    await this.repository.update(id, m);
  }

  async delete(id: number): Promise<void> {
    const m = newMovieFromDeleteRequest();
    await this.repository.update(id, m);
  }

  async getByGuid(guid: string): Promise<Movie | null> {
    return await this.repository.getByGuid(guid);
  }

  async list(
    page: number = 1,
    size: number = 20,
  ): Promise<[Movie[], number, number, number]> {
    return await this.repository.list(page, size);
  }
}
