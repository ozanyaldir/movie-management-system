import { MovieSessionNotFoundException } from './movie-session-not-found.exception';

describe('MovieSessionNotFoundException', () => {
  it('creates exception with default message when guid is not provided', () => {
    const ex = new MovieSessionNotFoundException();

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'movie_session_not_found',
      message: 'Movie session was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });

  it('creates exception with guid-specific message', () => {
    const ex = new MovieSessionNotFoundException('xyz-999');

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'movie_session_not_found',
      message: 'Movie session with guid "xyz-999" was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });
});
