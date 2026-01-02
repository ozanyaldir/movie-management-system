import { Ticket, MovieSession } from 'src/_repository/_entity';

describe('newTicketResourceFromEntity', () => {
  let newTicketResourceFromEntity: any;

  beforeEach(() => {
    jest.resetModules();
  });

  it('maps primitive fields and omits session when not provided', () => {
    newTicketResourceFromEntity =
      require('./ticket.dto').newTicketResourceFromEntity;

    const ticket = {
      guid: 't-1',
      isUsed: true,
      session: undefined,
      userId: 1,
      sessionId: 10,
    } as unknown as Ticket;

    const dto = newTicketResourceFromEntity(ticket);

    expect(dto).toEqual({
      guid: 't-1',
      is_used: true,
      session: undefined,
    });
  });

  it('maps session when provided', () => {
    newTicketResourceFromEntity =
      require('./ticket.dto').newTicketResourceFromEntity;

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

    const dto = newTicketResourceFromEntity(ticket);

    expect(dto.guid).toBe('t-2');
    expect(dto.is_used).toBe(false);

    expect(dto.session).toEqual({
      guid: 'sess-1',
      room_number: 'A1',
      screening_date: new Date('2025-01-01'),
      screening_time: '10:00:00',
    });
  });

  it('delegates mapping to newMovieSessionResourceFromEntity()', () => {
    const session = {} as MovieSession;

    const mockMapper = {
      newMovieSessionResourceFromEntity: jest.fn().mockReturnValue({
        guid: 'mock-session',
        room_number: 'X',
        screening_date: new Date('2025-03-01'),
        screening_time: '14:00',
      }),
    };

    jest.doMock('./movie-session.dto', () => mockMapper);

    jest.isolateModules(() => {
      newTicketResourceFromEntity =
        require('./ticket.dto').newTicketResourceFromEntity;
    });

    const ticket = {
      guid: 't-3',
      isUsed: true,
      session,
      userId: 3,
      sessionId: 9,
    } as unknown as Ticket;

    const dto = newTicketResourceFromEntity(ticket);

    expect(mockMapper.newMovieSessionResourceFromEntity).toHaveBeenCalledTimes(
      1,
    );

    expect(mockMapper.newMovieSessionResourceFromEntity).toHaveBeenCalledWith(
      session,
    );

    expect(dto.session?.guid).toBe('mock-session');
  });
});
