import { Movie } from 'src/_repository/_entity';
import { newMovieResourceFromEntity } from '../../../_shared/dto/resource/movie.dto';
import { newPaginatedMovieResourceDTO } from './paginated-movies.dto';

jest.mock('../../../_shared/dto/resource/movie.dto', () => ({
  newMovieResourceFromEntity: jest.fn(),
}));

describe('newPaginatedMovieResourceDTO', () => {
  it('should map movies to resource dto array', () => {
    const movie1 = new Movie();
    const movie2 = new Movie();

    (newMovieResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 'm1',
    });
    (newMovieResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 'm2',
    });

    const result = newPaginatedMovieResourceDTO(
      [movie1, movie2],
      10,
      2,
      5,
    );

    expect(result.total).toBe(10);
    expect(result.page).toBe(2);
    expect(result.size).toBe(5);

    expect(result.data).toEqual([
      { guid: 'm1' },
      { guid: 'm2' },
    ]);

    expect(newMovieResourceFromEntity).toHaveBeenCalledTimes(2);
    expect(newMovieResourceFromEntity).toHaveBeenCalledWith(movie1);
    expect(newMovieResourceFromEntity).toHaveBeenCalledWith(movie2);
  });
});
