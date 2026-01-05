import { Movie } from 'src/_repository/_entity';
import { MovieResourceDTO } from '../../../_shared/dto/resource/movie.dto';
import { PaginatedMovieResourceDTO } from './paginated-movies.dto';

describe('PaginatedMovieResourceDTO (constructor mapping)', () => {
  it('maps movies to MovieResourceDTO array when list has items', () => {
    const movie1 = { guid: 'm1' } as Movie;
    const movie2 = { guid: 'm2' } as Movie;

    const dto = new PaginatedMovieResourceDTO([movie1, movie2], 10, 2, 5);

    expect(dto.total).toBe(10);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(5);

    expect(dto.data).toHaveLength(2);

    expect(dto.data?.[0]).toBeInstanceOf(MovieResourceDTO);
    expect(dto.data?.[1]).toBeInstanceOf(MovieResourceDTO);

    expect(dto.data?.map((d) => d.guid)).toEqual(['m1', 'm2']);
  });

  it('maps empty movie array to an empty DTO array', () => {
    const dto = new PaginatedMovieResourceDTO([], 0, 1, 5);

    expect(dto.total).toBe(0);
    expect(dto.data).toEqual([]);
    expect(Array.isArray(dto.data)).toBe(true);
  });

  it('sets data to null when movies is not an array', () => {
    const dto = new PaginatedMovieResourceDTO(
      undefined as unknown as Movie[],
      0,
      1,
      5,
    );

    expect(dto.data).toBeNull();
  });
});
