import { newMovieSessionResourceFromEntity } from './movie-session.dto';
import { MovieSession, Movie, Ticket } from 'src/_repository/_entity';

describe('newMovieSessionResourceFromEntity', () => {
  it('maps primitive fields and omits movie & tickets when not provided', () => {
    const entity = {
      guid: 'sess-1',
      roomNumber: 'A1',
      screeningDate: new Date('2025-01-01'),
      screeningTime: '10:00:00',
      movie: undefined,
      tickets: undefined,
    } as unknown as MovieSession;

    const dto = newMovieSessionResourceFromEntity(entity);

    expect(dto).toEqual({
      guid: 'sess-1',
      room_number: 'A1',
      screening_date: new Date('2025-01-01'),
      screening_time: '10:00:00',
    });

    expect(dto.movie).toBeUndefined();
    expect(dto.tickets).toBeUndefined();
  });

  it('maps movie when provided', () => {
    const movie = {
      guid: 'mov-1',
      title: 'Inception',
      minAllowedAge: 13,
      sessions: undefined,
    } as unknown as Movie;

    const entity = {
      guid: 'sess-2',
      roomNumber: 'B2',
      screeningDate: new Date('2025-01-02'),
      screeningTime: '18:30:00',
      movie,
      tickets: [],
    } as unknown as MovieSession;

    const dto = newMovieSessionResourceFromEntity(entity);

    expect(dto.movie).toEqual({
      guid: 'mov-1',
      title: 'Inception',
      min_allowed_age: 13,
    });
  });

  it('maps tickets when provided (length > 0)', () => {
    const ticket1 = {
      guid: 't-1',
      isUsed: false,
      session: undefined,
    } as unknown as Ticket;

    const entity = {
      guid: 'sess-3',
      roomNumber: 'C3',
      screeningDate: new Date('2025-01-03'),
      screeningTime: '21:00:00',
      tickets: [ticket1],
      movie: undefined,
    } as unknown as MovieSession;

    const dto = newMovieSessionResourceFromEntity(entity);

    expect(dto.tickets).toHaveLength(1);
    expect(dto.tickets?.[0]).toEqual({
      guid: 't-1',
      is_used: false,
    });
  });

  it('does NOT include tickets property when array is empty', () => {
    const entity = {
      guid: 'sess-4',
      roomNumber: 'D4',
      screeningDate: new Date('2025-01-04'),
      screeningTime: '09:00:00',
      tickets: [],
      movie: undefined,
    } as unknown as MovieSession;

    const dto = newMovieSessionResourceFromEntity(entity);

    expect(dto.tickets).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(dto, 'tickets')).toBe(false);
  });
});
