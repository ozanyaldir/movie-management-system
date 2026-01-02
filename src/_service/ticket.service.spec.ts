import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from 'src/_repository';
import { Ticket } from 'src/_repository/_entity';

describe('TicketService', () => {
  let service: TicketService;
  let repository: jest.Mocked<TicketRepository>;

  const ticket: Ticket = {
    id: 10,
    guid: 'ticket-guid',
    isUsed: false,
  } as unknown as Ticket;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      setUsed: jest.fn(),
      getById: jest.fn(),
      getByGuid: jest.fn(),
      list: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: TicketRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  describe('create', () => {
    it('delegates to repository.create', async () => {
      repository.create.mockResolvedValue(ticket);

      const result = await service.create(ticket);

      expect(repository.create).toHaveBeenCalledWith(ticket);
      expect(result).toBe(ticket);
    });
  });

  describe('update', () => {
    it('delegates to repository.update', async () => {
      repository.update.mockResolvedValue(undefined);

      await service.update(10, ticket);

      expect(repository.update).toHaveBeenCalledWith(10, ticket);
    });
  });

  describe('setUsed', () => {
    it('delegates to repository.setUsed', async () => {
      repository.setUsed.mockResolvedValue(undefined);

      await service.setUsed(10);

      expect(repository.setUsed).toHaveBeenCalledWith(10);
    });
  });

  describe('getPlainById', () => {
    it('calls getById without details', async () => {
      repository.getById.mockResolvedValue(ticket);

      const result = await service.getPlainById(10);

      expect(repository.getById).toHaveBeenCalledWith(10);
      expect(result).toBe(ticket);
    });
  });

  describe('getDetailedById', () => {
    it('calls getById with details=true', async () => {
      repository.getById.mockResolvedValue(ticket);

      const result = await service.getDetailedById(10);

      expect(repository.getById).toHaveBeenCalledWith(10, true);
      expect(result).toBe(ticket);
    });
  });

  describe('getPlainByGuid', () => {
    it('calls getByGuid without details', async () => {
      repository.getByGuid.mockResolvedValue(ticket);

      const result = await service.getPlainByGuid('ticket-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith('ticket-guid');
      expect(result).toBe(ticket);
    });
  });

  describe('getDetailedByGuid', () => {
    it('calls getByGuid with details=true', async () => {
      repository.getByGuid.mockResolvedValue(ticket);

      const result = await service.getDetailedByGuid('ticket-guid');

      expect(repository.getByGuid).toHaveBeenCalledWith('ticket-guid', true);
      expect(result).toBe(ticket);
    });
  });

  describe('list', () => {
    it('delegates to repository.list with given params', async () => {
      const expected: [Ticket[], number, number, number] = [[ticket], 1, 1, 20];

      repository.list.mockResolvedValue(expected);

      const result = await service.list(5, null, 1, 20);

      expect(repository.list).toHaveBeenCalledWith(5, null, 1, 20);
      expect(result).toBe(expected);
    });

    it('passes through default params when omitted', async () => {
      const expected: [Ticket[], number, number, number] = [[ticket], 5, 1, 20];

      repository.list.mockResolvedValue(expected);

      await service.list(5);

      expect(repository.list).toHaveBeenCalledWith(5, null, 1, 20);
    });
  });
});
