import { Test, TestingModule } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketRepository } from './ticket.repository';
import { Ticket } from './_entity';

describe('TicketRepository', () => {
  let repo: TicketRepository;
  let ormRepo: jest.Mocked<Repository<Ticket>>;
  let qb: jest.Mocked<SelectQueryBuilder<Ticket>>;

  beforeEach(async () => {
    qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    } as any;

    ormRepo = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => qb),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketRepository,
        {
          provide: getRepositoryToken(Ticket),
          useValue: ormRepo,
        },
      ],
    }).compile();

    repo = module.get(TicketRepository);
  });

  describe('create', () => {
    it('should save ticket', async () => {
      const ticket = new Ticket();
      ormRepo.save.mockResolvedValueOnce(ticket);

      const result = await repo.create(ticket);

      expect(ormRepo.save).toHaveBeenCalledWith(ticket);
      expect(result).toBe(ticket);
    });
  });

  describe('update', () => {
    it('should call update with id filter', async () => {
      const ticket = new Ticket();

      await repo.update(7, ticket);

      expect(ormRepo.update).toHaveBeenCalledWith({ id: 7 }, ticket);
    });
  });

  describe('setUsed', () => {
    it('should update isUsed to true', async () => {
      await repo.setUsed(11);

      expect(ormRepo.update).toHaveBeenCalledWith({ id: 11 }, { isUsed: true });
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
        relations: ['session', 'session.movie'],
      });
    });
  });

  describe('getByGuid', () => {
    it('should fetch without relations when detailed = false', async () => {
      await repo.getByGuid('guid-xyz', false);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'guid-xyz' },
        relations: [],
      });
    });

    it('should fetch with relations when detailed = true', async () => {
      await repo.getByGuid('guid-xyz', true);

      expect(ormRepo.findOne).toHaveBeenCalledWith({
        where: { guid: 'guid-xyz' },
        relations: ['session', 'session.movie'],
      });
    });
  });

  describe('list', () => {
    it('should build query with joins and pagination', async () => {
      const sample = [new Ticket()];
      qb.getManyAndCount.mockResolvedValueOnce([sample, 1]);

      const result = await repo.list(44, null, 2, 10);

      expect(ormRepo.createQueryBuilder).toHaveBeenCalledWith('ticket');

      expect(qb.where).toHaveBeenCalledWith('ticket.userId = :userId', {
        userId: 44,
      });

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'ticket.session',
        'session',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'session.movie',
        'movie',
      );

      expect(qb.addOrderBy).toHaveBeenCalledWith('ticket.createdAt', 'DESC');

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);

      expect(result).toEqual([sample, 1, 2, 10]);
    });

    it('should add isUsed filter when value is not null', async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await repo.list(12, true, 1, 20);

      expect(qb.andWhere).toHaveBeenCalledWith('ticket.isUsed = :isUsed', {
        isUsed: true,
      });
    });

    it('should NOT add isUsed filter when value is null', async () => {
      qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await repo.list(12, null, 1, 20);

      expect(qb.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ticket.isUsed'),
        expect.anything(),
      );
    });
  });
});
