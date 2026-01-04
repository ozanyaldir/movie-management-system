import { Ticket } from 'src/_repository/_entity';
import { TicketResourceDTO } from '../../../_shared/dto/resource/ticket.dto';
import { PaginatedTicketResourceDTO } from './paginated-tickets.dto';

describe('PaginatedTicketResourceDTO (constructor mapping)', () => {
  it('should map tickets to resource dto array', () => {
    const t1 = { guid: 'x1' } as Ticket;
    const t2 = { guid: 'x2' } as Ticket;

    const result = new PaginatedTicketResourceDTO([t1, t2], 8, 1, 4);

    expect(result.total).toBe(8);
    expect(result.page).toBe(1);
    expect(result.size).toBe(4);

    expect(result.data).toHaveLength(2);

    expect(result.data?.[0]).toBeInstanceOf(TicketResourceDTO);
    expect(result.data?.[1]).toBeInstanceOf(TicketResourceDTO);

    expect(result.data?.map((d) => d.guid)).toEqual(['x1', 'x2']);
  });
});
