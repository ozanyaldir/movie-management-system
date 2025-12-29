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

  async create(m: MovieSession): Promise<MovieSession> {
    return await this.repository.save(m);
  }

  async update(id: number, m: MovieSession): Promise<void> {
    await this.repository.update({ id }, m);
    return;
  }

  async getById(id: number): Promise<MovieSession | null> {
    const result = await this.repository.findOne({
      where: { id },
      relations: [],
    });
    return result;
  }

  async getByGuid(guid: string): Promise<MovieSession | null> {
    return await this.repository
      .createQueryBuilder('movieSession')
      .where('movieSession.guid = :guid', { guid: guid })
      .andWhere('movieSession.deletedAt IS NULL')
      .getOne();
  }

  async list(
    movieId: number,
    page: number = 1,
    size: number = 20,
  ): Promise<[MovieSession[], number, number, number]> {
    const skip = (Number(page) - 1) * Number(size);
    const take = size;

    const [result, total] = await this.repository
      .createQueryBuilder('movieSession')
      .where('movieSession.movieId = :movieId', { movieId: movieId })
      .andWhere('movieSession.deletedAt IS NULL')
      .addOrderBy(`movieSession.createdAt`, 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [result, total, page, size];
  }
}
