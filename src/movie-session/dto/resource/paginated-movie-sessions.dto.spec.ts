import { MovieSession } from 'src/_repository/_entity';
import { newMovieSessionResourceFromEntity } from '../../../_shared/dto/resource/movie-session.dto';
import { newPaginatedMovieSessionResourceDTO } from './paginated-movie-sessions.dto';

jest.mock('../../../_shared/dto/resource/movie-session.dto', () => ({
  newMovieSessionResourceFromEntity: jest.fn(),
}));

describe('newPaginatedMovieSessionResourceDTO', () => {
  it('should map movie sessions to resource dto array', () => {
    const s1 = new MovieSession();
    const s2 = new MovieSession();

    (newMovieSessionResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 's1',
    });
    (newMovieSessionResourceFromEntity as jest.Mock).mockReturnValueOnce({
      guid: 's2',
    });

    const result = newPaginatedMovieSessionResourceDTO(
      [s1, s2],
      12,
      2,
      6,
    );

    expect(result.total).toBe(12);
    expect(result.page).toBe(2);
    expect(result.size).toBe(6);

    expect(result.data).toEqual([
      { guid: 's1' },
      { guid: 's2' },
    ]);

    expect(newMovieSessionResourceFromEntity).toHaveBeenCalledTimes(2);
    expect(newMovieSessionResourceFromEntity).toHaveBeenCalledWith(s1);
    expect(newMovieSessionResourceFromEntity).toHaveBeenCalledWith(s2);
  });
});
