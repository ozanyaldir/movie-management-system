import { Ticket } from 'src/_repository/_entity';
import { TicketResourceDTO } from '../../../_shared/dto/resource/ticket.dto';

export class PaginatedTicketResourceDTO {
  total: number;
  page: number;
  size: number;
  data: TicketResourceDTO[] | null;

  constructor(tickets: Ticket[], total: number, page: number, size: number) {
    this.total = total;
    this.page = page;
    this.size = size;

    this.data = Array.isArray(tickets)
      ? tickets.map((t) => new TicketResourceDTO(t))
      : null;
  }
}
