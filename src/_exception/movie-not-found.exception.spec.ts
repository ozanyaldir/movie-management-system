import { MovieNotFoundException } from './movie-not-found.exception';

describe('MovieNotFoundException', () => {
  it('creates exception with default message when guid is not provided', () => {
    const ex = new MovieNotFoundException();

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'movie_not_found',
      message: 'Movie was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });

  it('creates exception with guid-specific message', () => {
    const ex = new MovieNotFoundException('abc-123');

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'movie_not_found',
      message: 'Movie with guid "abc-123" was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });
});
