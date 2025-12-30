import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
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
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async getById(
    id: number,
    detailed: boolean = false,
  ): Promise<MovieSession | null> {
    const relations = ['movie'];
    return await this.repository.findOne({
      where: {
        id,
      },
      relations: detailed ? relations : [],
    });
  }

  async getByGuid(
    guid: string,
    detailed: boolean = false,
  ): Promise<MovieSession | null> {
    const relations = ['movie'];
    return await this.repository.findOne({
      where: {
        guid,
        deletedAt: IsNull(),
      },
      relations: detailed ? relations : [],
    });
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
