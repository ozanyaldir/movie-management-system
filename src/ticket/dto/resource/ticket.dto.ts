import { Ticket } from 'src/_repository/_entity';

export class TicketResourceDTO {
  guid: string;
  is_used: boolean;
}

export function newTicketResourceFromEntity(m: Ticket): TicketResourceDTO {
  return {
    guid: m.guid,
    is_used: m.isUsed,
  } as TicketResourceDTO;
}
