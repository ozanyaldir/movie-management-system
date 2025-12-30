import { Ticket } from 'src/_repository/_entity';
import {
  TicketResourceDTO,
  newTicketResourceFromEntity,
} from '../../../_shared/dto/resource/ticket.dto';

export class PaginatedTicketResourcesDTO {
  total?: number;
  page?: number;
  size?: number;
  data?: TicketResourceDTO[];
}

export function newPaginatedTicketResourceDTO(
  m: Ticket[],
  total: number,
  page: number,
  size: number,
): PaginatedTicketResourcesDTO {
  return {
    total,
    page,
    size,
    data: m.map((m) => newTicketResourceFromEntity(m)),
  };
}
