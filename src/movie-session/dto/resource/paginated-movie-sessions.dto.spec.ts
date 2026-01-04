import { MovieSession } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from '../../../_shared/dto/resource/movie-session.dto';
import { PaginatedMovieSessionResourceDTO } from './paginated-movie-sessions.dto';

describe('PaginatedMovieSessionResourceDTO (constructor mapping)', () => {
  it('should map movie sessions to resource dto array', () => {
    const s1 = { guid: 's1' } as MovieSession;
    const s2 = { guid: 's2' } as MovieSession;

    const result = new PaginatedMovieSessionResourceDTO([s1, s2], 12, 2, 6);

    expect(result.total).toBe(12);
    expect(result.page).toBe(2);
    expect(result.size).toBe(6);

    expect(result.data).toHaveLength(2);

    expect(result.data?.[0]).toBeInstanceOf(MovieSessionResourceDTO);
    expect(result.data?.[1]).toBeInstanceOf(MovieSessionResourceDTO);

    expect(result.data?.map((d) => d.guid)).toEqual(['s1', 's2']);
  });
});
