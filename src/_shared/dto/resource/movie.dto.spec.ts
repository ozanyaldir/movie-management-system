import { Movie, MovieSession } from 'src/_repository/_entity';
import { MovieResourceDTO } from './movie.dto';
import { MovieSessionResourceDTO } from './movie-session.dto';

describe('MovieResourceDTO (constructor mapping)', () => {
  it('maps primitive fields and keeps sessions undefined when not provided', () => {
    const movie = {
      guid: 'mov-1',
      title: 'Inception',
      minAllowedAge: 13,
      deletedAt: null,
      sessions: undefined,
    } as unknown as Movie;

    const dto = new MovieResourceDTO(movie);

    expect(dto.guid).toBe('mov-1');
    expect(dto.title).toBe('Inception');
    expect(dto.min_allowed_age).toBe(13);

    expect(dto.sessions).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(dto, 'sessions')).toBe(true);
  });

  it('keeps sessions undefined when array is empty', () => {
    const movie = {
      guid: 'mov-2',
      title: 'Interstellar',
      minAllowedAge: 12,
      deletedAt: null,
      sessions: [],
    } as unknown as Movie;

    const dto = new MovieResourceDTO(movie);

    expect(dto.sessions).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(dto, 'sessions')).toBe(true);
  });

  it('maps sessions when provided (length > 0)', () => {
    const session = {
      guid: 'sess-1',
      roomNumber: 'A1',
      screeningDate: new Date('2025-01-01'),
      screeningTime: '10:00:00',
      tickets: undefined,
      movie: undefined,
    } as unknown as MovieSession;

    const movie = {
      guid: 'mov-3',
      title: 'Tenet',
      minAllowedAge: 16,
      deletedAt: null,
      sessions: [session],
    } as unknown as Movie;

    const dto = new MovieResourceDTO(movie);

    expect(dto.sessions).toHaveLength(1);

    expect(dto.sessions?.[0]).toMatchObject({
      guid: 'sess-1',
      room_number: 'A1',
      screening_date: new Date('2025-01-01'),
      screening_time: '10:00:00',
    });
  });

  it('creates MovieSessionResourceDTO instances for each session', () => {
    const session = {} as MovieSession;

    const movie = {
      guid: 'mov-4',
      title: 'Dune',
      minAllowedAge: 14,
      deletedAt: null,
      sessions: [session],
    } as unknown as Movie;

    const dto = new MovieResourceDTO(movie);

    expect(dto.sessions?.[0]).toBeInstanceOf(MovieSessionResourceDTO);
  });
});
