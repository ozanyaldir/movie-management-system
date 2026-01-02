import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';
import { Movie } from './_entity';
import { SortMoviesBy } from 'src/_shared/constant';

describe('MovieRepository', () => {
  let repo: MovieRepository;
  let ormRepo: jest.Mocked<Repository<Movie>>;
  let qb: jest.Mocked<SelectQueryBuilder<Movie>>;

  beforeEach(async () => {
    qb = {
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as any;

    ormRepo = {
      save: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => qb),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: getRepositoryToken(Movie),
          useValue: ormRepo,
        },
      ],
    }).compile();

    repo = module.get(MovieRepository);
  });

  describe('create', () => {
    it('should save movie', async () => {
      const movie = new Movie();
      ormRepo.save.mockResolvedValueOnce(movie);

      const result = await repo.create(movie);

      expect(ormRepo.save).toHaveBeenCalledWith(movie);
      expect(result).toBe(movie);
    });
  });

  describe('update', () => {
    it('should call repository.update with id filter', async () => {
      const movie = new Movie();

      await repo.update(3, movie);

      expect(ormRepo.update).toHaveBeenCalledWith({ id: 3 }, movie);
    });
  });

  describe('delete', () => {
    it('should soft delete by id', async () => {
      await repo.delete(9);

      expect(ormRepo.softDelete).toHaveBeenCalledWith(9);
    });
  });

  describe('getById', () => {
      it('should fetch without relations when detailed = false', async () => {
        await repo.getById(1, false);

        expect(ormRepo.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: [],
        });
      });

      it('should fetch with relations when detailed = true', async () => {
        await repo.getById(1, true);

        expect(ormRepo.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: ['sessions'],
        });
      });
  });

  describe('getByGuid', () => {
    it('should fetch with deletedAt = IS NULL and no relations', async () => {
      await repo.getByGuid('guid-123', false);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'guid-123', deletedAt: IsNull() },
        relations: [],
      });
    });

    it('should fetch with relations when detailed = true', async () => {
      await repo.getByGuid('guid-123', true);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'guid-123', deletedAt: IsNull() },
        relations: ['sessions'],
      });
    });
  });

  describe('list', () => {
    it('should apply default sort createdAt DESC when sort_by is null', async () => {
      const sample = [new Movie()];
      qb.getManyAndCount.mockResolvedValueOnce([sample, 1]);

      const result = await repo.list(null, 1, 20);

      expect(ormRepo.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(qb.where).toHaveBeenCalledWith('movie.deletedAt IS NULL');
      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(20);

      expect(qb.addOrderBy).toHaveBeenCalledWith(
        'movie.createdAt',
        'DESC',
      );

      expect(result).toEqual([sample, 1, 1, 20]);
    });

    it('should sort by title when sort_by = Title', async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await repo.list(SortMoviesBy.Title, 2, 10);

      expect(qb.addOrderBy).toHaveBeenCalledWith(
        'movie.title',
        'ASC',
      );

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    it('should sort by minAllowedAge when sort_by = MinAllowedAge', async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await repo.list(SortMoviesBy.MinAllowedAge, 1, 5);

      expect(qb.addOrderBy).toHaveBeenCalledWith(
        'movie.minAllowedAge',
        'ASC',
      );

      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(5);
    });
  });
});
