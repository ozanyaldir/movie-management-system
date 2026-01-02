import { Movie, MovieSession } from 'src/_repository/_entity';

describe('newMovieResourceFromEntity', () => {
  let newMovieResourceFromEntity: any;

  beforeEach(() => {
    jest.resetModules();
  });

  it('maps primitive fields and omits sessions when not provided', () => {
    newMovieResourceFromEntity =
      require('./movie.dto').newMovieResourceFromEntity;

    const movie = {
      guid: 'mov-1',
      title: 'Inception',
      minAllowedAge: 13,
      deletedAt: null,
      sessions: undefined,
    } as unknown as Movie;

    const dto = newMovieResourceFromEntity(movie);

    expect(dto).toEqual({
      guid: 'mov-1',
      title: 'Inception',
      min_allowed_age: 13,
    });

    expect(dto.sessions).toBeUndefined();
  });

  it('does NOT include sessions when array is empty', () => {
    newMovieResourceFromEntity =
      require('./movie.dto').newMovieResourceFromEntity;

    const movie = {
      guid: 'mov-2',
      title: 'Interstellar',
      minAllowedAge: 12,
      deletedAt: null,
      sessions: [],
    } as unknown as Movie;

    const dto = newMovieResourceFromEntity(movie);

    expect(dto.sessions).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(dto, 'sessions')).toBe(false);
  });

  it('maps sessions when provided (length > 0)', () => {
    newMovieResourceFromEntity =
      require('./movie.dto').newMovieResourceFromEntity;

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

    const dto = newMovieResourceFromEntity(movie);

    expect(dto.sessions).toHaveLength(1);
    expect(dto.sessions?.[0]).toEqual({
      guid: 'sess-1',
      room_number: 'A1',
      screening_date: new Date('2025-01-01'),
      screening_time: '10:00:00',
    });
  });

  it('delegates each session to newMovieSessionResourceFromEntity()', () => {
    const session = {} as MovieSession;

    const mockMapper = {
      newMovieSessionResourceFromEntity: jest.fn().mockReturnValue({
        guid: 'mock-session',
        room_number: 'X',
        screening_date: new Date('2025-02-01'),
        screening_time: '18:00',
      }),
    };

    jest.doMock('./movie-session.dto', () => mockMapper);

    jest.isolateModules(() => {
      newMovieResourceFromEntity =
        require('./movie.dto').newMovieResourceFromEntity;
    });

    const movie = {
      guid: 'mov-4',
      title: 'Dune',
      minAllowedAge: 14,
      deletedAt: null,
      sessions: [session],
    } as unknown as Movie;

    const dto = newMovieResourceFromEntity(movie);

    expect(mockMapper.newMovieSessionResourceFromEntity).toHaveBeenCalledTimes(
      1,
    );

    expect(mockMapper.newMovieSessionResourceFromEntity).toHaveBeenCalledWith(
      session,
    );

    expect(dto.sessions?.[0].guid).toBe('mock-session');
  });
});
