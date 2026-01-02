import { Ticket } from 'src/_repository/_entity';
import { newTicketResourceFromEntity } from '../../../_shared/dto/resource/ticket.dto';
import { newPaginatedTicketResourceDTO } from './paginated-tickets.dto';

jest.mock('../../../_shared/dto/resource/ticket.dto', () => ({
  newTicketResourceFromEntity: jest.fn(),
}));

describe('newPaginatedTicketResourceDTO', () => {
  it('should map tickets to resource dto array', () => {
    const t1 = new Ticket();
    const t2 = new Ticket();

    (newTicketResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 't1',
    });
    (newTicketResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 't2',
    });

    const result = newPaginatedTicketResourceDTO(
      [t1, t2],
      8,
      1,
      4,
    );

    expect(result.total).toBe(8);
    expect(result.page).toBe(1);
    expect(result.size).toBe(4);

    expect(result.data).toEqual([
      { guid: 't1' },
      { guid: 't2' },
    ]);

    expect(newTicketResourceFromEntity).toHaveBeenCalledTimes(2);
    expect(newTicketResourceFromEntity).toHaveBeenCalledWith(t1);
    expect(newTicketResourceFromEntity).toHaveBeenCalledWith(t2);
  });
});
