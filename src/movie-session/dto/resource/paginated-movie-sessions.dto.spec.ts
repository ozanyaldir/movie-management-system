import { MovieSession } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from '../../../_shared/dto/resource/movie-session.dto';
import { PaginatedMovieSessionResourceDTO } from './paginated-movie-sessions.dto';

describe('PaginatedMovieSessionResourceDTO (constructor mapping)', () => {
  it('maps movie sessions to MovieSessionResourceDTO array when list has items', () => {
    const s1 = { guid: 's1' } as MovieSession;
    const s2 = { guid: 's2' } as MovieSession;

    const dto = new PaginatedMovieSessionResourceDTO([s1, s2], 12, 2, 6);

    expect(dto.total).toBe(12);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(6);

    expect(dto.data).toHaveLength(2);

    expect(dto.data?.[0]).toBeInstanceOf(MovieSessionResourceDTO);
    expect(dto.data?.[1]).toBeInstanceOf(MovieSessionResourceDTO);

    expect(dto.data?.map((d) => d.guid)).toEqual(['s1', 's2']);
  });

  it('maps empty session array to an empty DTO array', () => {
    const dto = new PaginatedMovieSessionResourceDTO([], 0, 1, 10);

    expect(dto.total).toBe(0);
    expect(dto.data).toEqual([]);
    expect(Array.isArray(dto.data)).toBe(true);
  });

  it('sets data to null when sessions is not an array', () => {
    const dto = new PaginatedMovieSessionResourceDTO(
      undefined as unknown as MovieSession[],
      0,
      1,
      10,
    );

    expect(dto.data).toBeNull();
  });
});
