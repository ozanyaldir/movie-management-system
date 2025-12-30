import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from 'src/_repository';
import { Movie } from 'src/_repository/_entity';
import { SortMoviesBy } from 'src/_shared/constant';

describe('MovieService', () => {
  let service: MovieService;
  let repository: jest.Mocked<MovieRepository>;

  const movie: Movie = {
    id: 7,
    guid: 'movie-guid',
    title: 'Inception',
    minAllowedAge: 16,
  } as unknown as Movie;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
      getByGuid: jest.fn(),
      list: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        { provide: MovieRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  describe('create', () => {
    it('delegates to repository.create', async () => {
      repository.create.mockResolvedValue(movie);

      const result = await service.create(movie);

      expect(repository.create).toHaveBeenCalledWith(movie);
      expect(result).toBe(movie);
    });
  });

  describe('update', () => {
    it('delegates to repository.update', async () => {
      repository.update.mockResolvedValue(undefined);

      await service.update(7, movie);

      expect(repository.update).toHaveBeenCalledWith(7, movie);
    });
  });

  describe('delete', () => {
    it('delegates to repository.delete', async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.delete(7);

      expect(repository.delete).toHaveBeenCalledWith(7);
    });
  });

  describe('getPlainById', () => {
    it('calls getById without details', async () => {
      repository.getById.mockResolvedValue(movie);

      const result = await service.getPlainById(7);

      expect(repository.getById).toHaveBeenCalledWith(7);
      expect(result).toBe(movie);
    });
  });

  describe('getDetailedById', () => {
    it('calls getById with details=true', async () => {
      repository.getById.mockResolvedValue(movie);

      const result = await service.getDetailedById(7);

      expect(repository.getById).toHaveBeenCalledWith(7, true);
      expect(result).toBe(movie);
    });
  });

  describe('getPlainByGuid', () => {
    it('calls getByGuid without details', async () => {
      repository.getByGuid.mockResolvedValue(movie);

      const result = await service.getPlainByGuid('movie-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith('movie-guid');
      expect(result).toBe(movie);
    });
  });

  describe('getDetailedByGuid', () => {
    it('calls getByGuid with details=true', async () => {
      repository.getByGuid.mockResolvedValue(movie);

      const result = await service.getDetailedByGuid('movie-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith(
        'movie-guid',
        true,
      );
      expect(result).toBe(movie);
    });
  });

  describe('list', () => {
    it('delegates to repository.list with provided params', async () => {
      const expected: [Movie[], number, number, number] = [[movie], 3, 1, 20];

      repository.list.mockResolvedValue(expected);

      const result = await service.list(SortMoviesBy.Title, 1, 20);

      expect(repository.list).toHaveBeenCalledWith(
        SortMoviesBy.Title,
        1,
        20,
      );
      expect(result).toBe(expected);
    });

    it('uses default params when omitted', async () => {
      const expected: [Movie[], number, number, number] = [[movie], 5, 1, 20];

      repository.list.mockResolvedValue(expected);

      await service.list();

      expect(repository.list).toHaveBeenCalledWith(null, 1, 20);
    });
  });
});
