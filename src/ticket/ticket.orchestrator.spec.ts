import { TicketOrchestrator } from './ticket.orchestrator';
import { MovieSessionService, TicketService } from 'src/_service';
import { BuyTicketRequestDTO, ListTicketsRequestDTO } from './dto/request';
import {
  MovieSessionNotFoundException,
  TicketNotFoundException,
} from 'src/_exception';
import { User } from 'src/_repository/_entity';
import { newTicketFromUserAndSession } from 'src/_factory/ticket.factory';
import { newTicketResourceFromEntity } from 'src/_shared/dto/resource';
import { newPaginatedTicketResourceDTO } from './dto/resource';

jest.mock('src/_factory/ticket.factory', () => ({
  newTicketFromUserAndSession: jest.fn(),
}));

jest.mock('src/_shared/dto/resource', () => ({
  newTicketResourceFromEntity: jest.fn(),
}));

jest.mock('./dto/resource', () => ({
  newPaginatedTicketResourceDTO: jest.fn(),
}));

describe('TicketOrchestrator', () => {
  let orchestrator: TicketOrchestrator;
  let movieSessionService: jest.Mocked<MovieSessionService>;
  let ticketService: jest.Mocked<TicketService>;

  beforeEach(() => {
    movieSessionService = {
      getPlainByGuid: jest.fn(),
    } as any;

    ticketService = {
      create: jest.fn(),
      getDetailedById: jest.fn(),
      getPlainByGuid: jest.fn(),
      setUsed: jest.fn(),
      list: jest.fn(),
    } as any;

    orchestrator = new TicketOrchestrator(movieSessionService, ticketService);
  });

  describe('buyTicket', () => {
    it('should create ticket and return resource', async () => {
      const user = new User();
      user.id = 1 as any;

      const dto = new BuyTicketRequestDTO();
      dto.session_id = 'session-guid';

      const session = { id: 5 } as any;
      movieSessionService.getPlainByGuid.mockResolvedValue(session);

      const ticketEntity = { id: 10, guid: 'ticket-guid' } as any;
      (newTicketFromUserAndSession as jest.Mock).mockReturnValue(ticketEntity);

      ticketService.create.mockResolvedValue(ticketEntity);

      const detailedTicket = { id: 10, guid: 'ticket-guid' } as any;
      ticketService.getDetailedById.mockResolvedValue(detailedTicket);

      const resource = { guid: 'ticket-guid' } as any;
      (newTicketResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.buyTicket(user, dto);

      expect(movieSessionService.getPlainByGuid).toHaveBeenCalledWith(
        'session-guid',
      );
      expect(newTicketFromUserAndSession).toHaveBeenCalledWith(user, session);
      expect(ticketService.create).toHaveBeenCalledWith(ticketEntity);
      expect(ticketService.getDetailedById).toHaveBeenCalledWith(10);
      expect(newTicketResourceFromEntity).toHaveBeenCalledWith(detailedTicket);
      expect(result).toBe(resource);
    });

    it('should throw MovieSessionNotFoundException when session does not exist', async () => {
      const user = new User();
      const dto = new BuyTicketRequestDTO();
      dto.session_id = 'missing-session';

      movieSessionService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.buyTicket(user, dto)).rejects.toBeInstanceOf(
        MovieSessionNotFoundException,
      );
    });

    it('should throw TicketNotFoundException when detailed ticket lookup fails', async () => {
      const user = new User();
      const dto = new BuyTicketRequestDTO();
      dto.session_id = 'session-guid';

      movieSessionService.getPlainByGuid.mockResolvedValue({ id: 5 } as any);

      const created = { id: 10, guid: 'ticket-guid' } as any;
      ticketService.create.mockResolvedValue(created);

      ticketService.getDetailedById.mockResolvedValue(null);

      await expect(orchestrator.buyTicket(user, dto)).rejects.toBeInstanceOf(
        TicketNotFoundException,
      );
    });
  });

  describe('useTicket', () => {
    it('should set ticket as used and return updated resource', async () => {
      const ticket = { id: 7, guid: 't1' } as any;
      ticketService.getPlainByGuid.mockResolvedValue(ticket);

      const updatedTicket = { id: 7, guid: 't1' } as any;
      ticketService.getDetailedById.mockResolvedValue(updatedTicket);

      const resource = { guid: 't1' } as any;
      (newTicketResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.useTicket('t1');

      expect(ticketService.getPlainByGuid).toHaveBeenCalledWith('t1');
      expect(ticketService.setUsed).toHaveBeenCalledWith(7);
      expect(ticketService.getDetailedById).toHaveBeenCalledWith(7);
      expect(newTicketResourceFromEntity).toHaveBeenCalledWith(updatedTicket);
      expect(result).toBe(resource);
    });

    it('should throw TicketNotFoundException when ticket does not exist', async () => {
      ticketService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.useTicket('missing')).rejects.toBeInstanceOf(
        TicketNotFoundException,
      );
    });

    it('should throw TicketNotFoundException when updated ticket missing', async () => {
      ticketService.getPlainByGuid.mockResolvedValue({ id: 7 } as any);
      ticketService.getDetailedById.mockResolvedValue(null);

      await expect(orchestrator.useTicket('t1')).rejects.toBeInstanceOf(
        TicketNotFoundException,
      );
    });
  });

  describe('list', () => {
    it('should delegate to ticket service and map result', async () => {
      const user = new User();
      user.id = 1 as any;

      const query = new ListTicketsRequestDTO();
      query.is_used = true;
      query.page = 2 as any;
      query.size = 10 as any;

      const rows = [{ guid: 't1' }] as any;
      ticketService.list.mockResolvedValue([rows, 5, 2, 10]);

      const mapped = { data: [] } as any;
      (newPaginatedTicketResourceDTO as jest.Mock).mockReturnValue(mapped);

      const result = await orchestrator.list(user, query);

      expect(ticketService.list).toHaveBeenCalledWith(1, true, 2, 10);

      expect(newPaginatedTicketResourceDTO).toHaveBeenCalledWith(
        rows,
        5,
        2,
        10,
      );

      expect(result).toBe(mapped);
    });
  });
});
