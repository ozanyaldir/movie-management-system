import { MovieSession, Movie, Ticket } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from './movie-session.dto';

describe('MovieSessionResourceDTO (constructor mapping)', () => {
  it('maps primitive fields and keeps movie & tickets as undefined when not provided', () => {
    const entity = {
      guid: 'sess-1',
      roomNumber: 'A1',
      screeningDate: new Date('2025-01-01'),
      screeningTime: '10:00:00',
      movie: undefined,
      tickets: undefined,
    } as unknown as MovieSession;

    const dto = new MovieSessionResourceDTO(entity);

    expect(dto.guid).toBe('sess-1');
    expect(dto.room_number).toBe('A1');
    expect(dto.screening_date).toEqual(new Date('2025-01-01'));
    expect(dto.screening_time).toBe('10:00:00');

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

    const dto = new MovieSessionResourceDTO(entity);

    expect(dto.movie).toEqual({
      guid: 'mov-1',
      title: 'Inception',
      min_allowed_age: 13,
      sessions: undefined,
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

    const dto = new MovieSessionResourceDTO(entity);

    expect(dto.tickets).toHaveLength(1);
    expect(dto.tickets?.[0]).toEqual({
      guid: 't-1',
      is_used: false,
      session: undefined,
    });
  });

  it('keeps tickets as undefined when array is empty', () => {
    const entity = {
      guid: 'sess-4',
      roomNumber: 'D4',
      screeningDate: new Date('2025-01-04'),
      screeningTime: '09:00:00',
      tickets: [],
      movie: undefined,
    } as unknown as MovieSession;

    const dto = new MovieSessionResourceDTO(entity);

    expect(dto.tickets).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(dto, 'tickets')).toBe(true);
  });
});
