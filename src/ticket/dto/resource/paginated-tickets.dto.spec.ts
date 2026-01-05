import { Ticket } from 'src/_repository/_entity';
import { TicketResourceDTO } from '../../../_shared/dto/resource/ticket.dto';
import { PaginatedTicketResourceDTO } from './paginated-tickets.dto';

describe('PaginatedTicketResourceDTO (constructor mapping)', () => {
  it('maps tickets to TicketResourceDTO array when list has items', () => {
    const t1 = { guid: 'x1' } as Ticket;
    const t2 = { guid: 'x2' } as Ticket;

    const dto = new PaginatedTicketResourceDTO([t1, t2], 8, 1, 4);

    expect(dto.total).toBe(8);
    expect(dto.page).toBe(1);
    expect(dto.size).toBe(4);

    expect(dto.data).toHaveLength(2);

    expect(dto.data?.[0]).toBeInstanceOf(TicketResourceDTO);
    expect(dto.data?.[1]).toBeInstanceOf(TicketResourceDTO);

    expect(dto.data?.map((d) => d.guid)).toEqual(['x1', 'x2']);
  });

  it('maps empty ticket array to an empty TicketResourceDTO array', () => {
    const dto = new PaginatedTicketResourceDTO([], 0, 1, 4);

    expect(dto.total).toBe(0);
    expect(dto.data).toEqual([]);
    expect(Array.isArray(dto.data)).toBe(true);
  });

  it('sets data to null when tickets is not an array', () => {
    const dto = new PaginatedTicketResourceDTO(
      undefined as unknown as Ticket[],
      0,
      1,
      4,
    );

    expect(dto.data).toBeNull();
  });
});
