import { Movie } from 'src/_repository/_entity';
import { MovieResourceDTO } from '../../../_shared/dto/resource/movie.dto';
import { PaginatedMovieResourceDTO } from './paginated-movies.dto';

describe('PaginatedMovieResourceDTO (constructor mapping)', () => {
  it('should map movies to resource dto array', () => {
    const movie1 = { guid: 'm1' } as Movie;
    const movie2 = { guid: 'm2' } as Movie;

    const result = new PaginatedMovieResourceDTO([movie1, movie2], 10, 2, 5);

    expect(result.total).toBe(10);
    expect(result.page).toBe(2);
    expect(result.size).toBe(5);

    expect(result.data).toHaveLength(2);

    expect(result.data?.[0]).toBeInstanceOf(MovieResourceDTO);
    expect(result.data?.[1]).toBeInstanceOf(MovieResourceDTO);

    expect(result.data?.map((d) => d.guid)).toEqual(['m1', 'm2']);
  });
});
