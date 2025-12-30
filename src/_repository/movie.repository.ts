import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './_entity';
import { SortMoviesBy } from 'src/_shared/constant';

@Injectable()
export class MovieRepository {
  constructor(@InjectRepository(Movie) private repository: Repository<Movie>) {}

  async create(m: Movie): Promise<Movie> {
    return await this.repository.save(m);
  }

  async update(id: number, m: Movie): Promise<void> {
    await this.repository.update({ id }, m);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async getById(id: number, detailed: boolean = false): Promise<Movie | null> {
    const relations = ['sessions'];
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
  ): Promise<Movie | null> {
    const relations = ['sessions'];
    return await this.repository.findOne({
      where: {
        guid,
        deletedAt: IsNull(),
      },
      relations: detailed ? relations : [],
    });
  }

  async list(
    sort_by: SortMoviesBy | null = null,
    page: number = 1,
    size: number = 20,
  ): Promise<[Movie[], number, number, number]> {
    const skip = (Number(page) - 1) * Number(size);
    const take = size;

    const sortColumnMap: Record<SortMoviesBy, string> = {
      [SortMoviesBy.Title]: 'movie.title',
      [SortMoviesBy.MinAllowedAge]: 'movie.minAllowedAge',
    };

    const qb = this.repository
      .createQueryBuilder('movie')
      .where('movie.deletedAt IS NULL')
      .skip(skip)
      .take(take);

    if (sort_by && sortColumnMap[sort_by]) {
      qb.addOrderBy(sortColumnMap[sort_by], 'ASC');
    } else {
      qb.addOrderBy('movie.createdAt', 'DESC');
    }

    const [result, total] = await qb.getManyAndCount();

    return [result, total, page, size];
  }
}
