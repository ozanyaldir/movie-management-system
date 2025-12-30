import { NotFoundException } from '@nestjs/common';

export class TicketNotFoundException extends NotFoundException {
  constructor(guid?: string) {
    super({
      code: 'ticket_not_found',
      message: guid
        ? `Ticket with guid "${guid}" was not found.`
        : 'Ticket was not found.',
    });
  }
}
