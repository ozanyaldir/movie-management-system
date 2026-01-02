import { TicketNotFoundException } from './ticket-not-found.exception';

describe('TicketNotFoundException', () => {
  it('creates exception with default message when guid is not provided', () => {
    const ex = new TicketNotFoundException();

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'ticket_not_found',
      message: 'Ticket was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });

  it('creates exception with guid-specific message', () => {
    const ex = new TicketNotFoundException('tkt-123');

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'ticket_not_found',
      message: 'Ticket with guid "tkt-123" was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });
});
