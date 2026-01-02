import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder, IsNull } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieSessionRepository } from './movie-session.repository';
import { MovieSession } from './_entity';

describe('MovieSessionRepository', () => {
  let repo: MovieSessionRepository;
  let ormRepo: jest.Mocked<Repository<MovieSession>>;
  let qb: jest.Mocked<SelectQueryBuilder<MovieSession>>;

  beforeEach(async () => {
    qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
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
        MovieSessionRepository,
        {
          provide: getRepositoryToken(MovieSession),
          useValue: ormRepo,
        },
      ],
    }).compile();

    repo = module.get(MovieSessionRepository);
  });

  describe('create', () => {
    it('should save movie session', async () => {
      const entity = new MovieSession();
      ormRepo.save.mockResolvedValueOnce(entity);

      const result = await repo.create(entity);

      expect(ormRepo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('update', () => {
    it('should call repository.update with id filter', async () => {
      const entity = new MovieSession();

      await repo.update(10, entity);

      expect(ormRepo.update).toHaveBeenCalledWith({ id: 10 }, entity);
    });
  });

  describe('delete', () => {
    it('should soft delete by id', async () => {
      await repo.delete(5);

      expect(ormRepo.softDelete).toHaveBeenCalledWith(5);
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
        relations: ['movie'],
      });
    });
  });

  describe('getByGuid', () => {
    it('should fetch with deletedAt = IS NULL and no relations', async () => {
      await repo.getByGuid('abc-guid', false);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'abc-guid', deletedAt: IsNull() },
        relations: [],
      });
    });

    it('should fetch with relations when detailed = true', async () => {
      await repo.getByGuid('abc-guid', true);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'abc-guid', deletedAt: IsNull() },
        relations: ['movie'],
      });
    });
  });

  describe('list', () => {
    it('should build paginated query and return tuple', async () => {
      const sampleSessions = [new MovieSession()];
      qb.getManyAndCount.mockResolvedValueOnce([sampleSessions, 1]);

      const result = await repo.list(22, 2, 10);

      expect(ormRepo.createQueryBuilder).toHaveBeenCalledWith('movieSession');

      expect(qb.where).toHaveBeenCalledWith(
        'movieSession.movieId = :movieId',
        { movieId: 22 },
      );

      expect(qb.andWhere).toHaveBeenCalledWith(
        'movieSession.deletedAt IS NULL',
      );

      expect(qb.addOrderBy).toHaveBeenCalledWith(
        'movieSession.createdAt',
        'DESC',
      );

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);

      expect(result).toEqual([sampleSessions, 1, 2, 10]);
    });
  });
});
