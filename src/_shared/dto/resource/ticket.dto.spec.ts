import { Ticket, MovieSession } from 'src/_repository/_entity';
import { TicketResourceDTO } from './ticket.dto';
import { MovieSessionResourceDTO } from './movie-session.dto';

describe('TicketResourceDTO (constructor mapping)', () => {
  it('maps primitive fields and keeps session undefined when not provided', () => {
    const ticket = {
      guid: 't-1',
      isUsed: true,
      session: undefined,
      userId: 1,
      sessionId: 10,
    } as unknown as Ticket;

    const dto = new TicketResourceDTO(ticket);

    expect(dto.guid).toBe('t-1');
    expect(dto.is_used).toBe(true);
    expect(dto.session).toBeUndefined();
  });

  it('maps session when provided', () => {
    const session = {
      guid: 'sess-1',
      roomNumber: 'A1',
      screeningDate: new Date('2025-01-01'),
      screeningTime: '10:00:00',
      movie: undefined,
      tickets: undefined,
    } as unknown as MovieSession;

    const ticket = {
      guid: 't-2',
      isUsed: false,
      session,
      sessionId: 5,
      userId: 2,
    } as unknown as Ticket;

    const dto = new TicketResourceDTO(ticket);

    expect(dto.guid).toBe('t-2');
    expect(dto.is_used).toBe(false);

    expect(dto.session).toMatchObject({
      guid: 'sess-1',
      room_number: 'A1',
      screening_date: new Date('2025-01-01'),
      screening_time: '10:00:00',
    });
  });

  it('creates MovieSessionResourceDTO when session exists', () => {
    const session = {} as MovieSession;

    const ticket = {
      guid: 't-3',
      isUsed: true,
      session,
      userId: 3,
      sessionId: 9,
    } as unknown as Ticket;

    const dto = new TicketResourceDTO(ticket);

    expect(dto.session).toBeInstanceOf(MovieSessionResourceDTO);
  });
});
