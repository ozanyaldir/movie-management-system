import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './_entity';

@Injectable()
export class MovieRepository {
  constructor(@InjectRepository(Movie) private repository: Repository<Movie>) {}

  async createNewMovie(m: Movie): Promise<Movie> {
    return await this.repository.save(m);
  }

  async update(id: number, m: Movie): Promise<void> {
    await this.repository.update({ id }, m);
  }

  async updateMovie(id: number, m: Movie): Promise<void> {
    await this.repository.update({ id }, m);
    return;
  }

  async getById(id: number): Promise<Movie | null> {
    const result = await this.repository.findOne({
      where: { id },
      relations: [],
    });
    return result;
  }

  async getByGuid(guid: string): Promise<Movie | null> {
    return await this.repository
      .createQueryBuilder('movie')
      .where('movie.guid = :guid', { guid: guid })
      .andWhere('movie.deletedAt IS NULL')
      .getOne();
  }
}
