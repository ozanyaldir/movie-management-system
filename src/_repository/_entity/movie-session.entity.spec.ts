import { MovieSession } from './movie-session.entity';
import { BaseEntity } from './base.entity';
import { Movie } from './movie.entity';
import { Ticket } from './ticket.entity';

describe('MovieSession Entity', () => {
  it('should construct and extend BaseEntity', () => {
    const e = new MovieSession();
    expect(e).toBeInstanceOf(MovieSession);
    expect(e).toBeInstanceOf(BaseEntity);
  });

  it('should have undefined base fields before persistence', () => {
    const e = new MovieSession();
    expect(e.id).toBeUndefined();
    expect(e.createdAt).toBeUndefined();
    expect(e.updatedAt).toBeUndefined();
    expect(e.deletedAt).toBeUndefined();
  });

  it('should generate guid on before insert', () => {
    const e = new MovieSession();
    e.generateId();
    expect(typeof e.guid).toBe('string');
    expect(e.guid.length).toBeGreaterThan(0);
  });

  it('should allow assigning scalar properties', () => {
    const e = new MovieSession();
    e.movieId = 1;
    e.roomNumber = 'A1';
    e.screeningDate = new Date('2026-01-01');
    e.screeningTime = '10:00:00';
    expect(e.movieId).toBe(1);
    expect(e.roomNumber).toBe('A1');
    expect(e.screeningDate).toEqual(new Date('2026-01-01'));
    expect(e.screeningTime).toBe('10:00:00');
  });

  it('should allow assigning relations', () => {
    const e = new MovieSession();
    e.movie = new Movie();
    e.tickets = [new Ticket()];
    expect(e.movie).toBeInstanceOf(Movie);
    expect(e.tickets[0]).toBeInstanceOf(Ticket);
  });
});
