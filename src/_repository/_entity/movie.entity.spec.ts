import { Movie } from './movie.entity';
import { BaseEntity } from './base.entity';
import { MovieSession } from './movie-session.entity';

describe('Movie Entity', () => {
  it('should construct and extend BaseEntity', () => {
    const e = new Movie();
    expect(e).toBeInstanceOf(Movie);
    expect(e).toBeInstanceOf(BaseEntity);
  });

  it('should have undefined base fields before persistence', () => {
    const e = new Movie();
    expect(e.id).toBeUndefined();
    expect(e.createdAt).toBeUndefined();
    expect(e.updatedAt).toBeUndefined();
    expect(e.deletedAt).toBeUndefined();
  });

  it('should generate guid on before insert', () => {
    const e = new Movie();
    e.generateId();
    expect(typeof e.guid).toBe('string');
    expect(e.guid.length).toBeGreaterThan(0);
  });

  it('should allow assigning scalar properties', () => {
    const e = new Movie();
    e.title = 'Interstellar';
    e.minAllowedAge = 13;
    expect(e.title).toBe('Interstellar');
    expect(e.minAllowedAge).toBe(13);
  });

  it('should allow assigning relations', () => {
    const e = new Movie();
    e.sessions = [new MovieSession()];
    expect(e.sessions[0]).toBeInstanceOf(MovieSession);
  });
});
