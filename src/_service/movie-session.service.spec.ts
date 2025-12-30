import { Test, TestingModule } from '@nestjs/testing';
import { MovieSessionService } from './movie-session.service';
import { MovieSessionRepository } from 'src/_repository';
import { MovieSession } from 'src/_repository/_entity';

describe('MovieSessionService', () => {
  let service: MovieSessionService;
  let repository: jest.Mocked<MovieSessionRepository>;

  const session: MovieSession = {
    id: 4,
    guid: 'session-guid',
    startsAt: new Date(),
  } as unknown as MovieSession;

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
        MovieSessionService,
        { provide: MovieSessionRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<MovieSessionService>(MovieSessionService);
  });

  describe('create', () => {
    it('delegates to repository.create', async () => {
      repository.create.mockResolvedValue(session);

      const result = await service.create(session);

      expect(repository.create).toHaveBeenCalledWith(session);
      expect(result).toBe(session);
    });
  });

  describe('update', () => {
    it('delegates to repository.update', async () => {
      repository.update.mockResolvedValue(undefined);

      await service.update(4, session);

      expect(repository.update).toHaveBeenCalledWith(4, session);
    });
  });

  describe('delete', () => {
    it('delegates to repository.delete', async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.delete(4);

      expect(repository.delete).toHaveBeenCalledWith(4);
    });
  });

  describe('getPlainById', () => {
    it('calls getById without details', async () => {
      repository.getById.mockResolvedValue(session);

      const result = await service.getPlainById(4);

      expect(repository.getById).toHaveBeenCalledWith(4);
      expect(result).toBe(session);
    });
  });

  describe('getDetailedById', () => {
    it('calls getById with details=true', async () => {
      repository.getById.mockResolvedValue(session);

      const result = await service.getDetailedById(4);

      expect(repository.getById).toHaveBeenCalledWith(4, true);
      expect(result).toBe(session);
    });
  });

  describe('getPlainByGuid', () => {
    it('calls getByGuid without details', async () => {
      repository.getByGuid.mockResolvedValue(session);

      const result = await service.getPlainByGuid('session-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith('session-guid');
      expect(result).toBe(session);
    });
  });

  describe('getDetailedByGuid', () => {
    it('calls getByGuid with details=true', async () => {
      repository.getByGuid.mockResolvedValue(session);

      const result = await service.getDetailedByGuid('session-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith(
        'session-guid',
        true,
      );
      expect(result).toBe(session);
    });
  });

  describe('list', () => {
    it('delegates to repository.list with provided params', async () => {
      const expected: [MovieSession[], number, number, number] = [
        [session],
        2,
        1,
        20,
      ];

      repository.list.mockResolvedValue(expected);

      const result = await service.list(11, 1, 20);

      expect(repository.list).toHaveBeenCalledWith(11, 1, 20);
      expect(result).toBe(expected);
    });

    it('uses default params when omitted', async () => {
      const expected: [MovieSession[], number, number, number] = [
        [session],
        3,
        1,
        20,
      ];

      repository.list.mockResolvedValue(expected);

      await service.list(11);

      expect(repository.list).toHaveBeenCalledWith(11, 1, 20);
    });
  });
});
