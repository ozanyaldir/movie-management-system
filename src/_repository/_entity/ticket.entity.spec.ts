import { Ticket } from './ticket.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { MovieSession } from './movie-session.entity';

describe('Ticket Entity', () => {
  it('should construct and extend BaseEntity', () => {
    const e = new Ticket();
    expect(e).toBeInstanceOf(Ticket);
    expect(e).toBeInstanceOf(BaseEntity);
  });

  it('should have undefined base fields before persistence', () => {
    const e = new Ticket();
    expect(e.id).toBeUndefined();
    expect(e.createdAt).toBeUndefined();
    expect(e.updatedAt).toBeUndefined();
  });

  it('should generate guid on before insert', () => {
    const e = new Ticket();
    e.generateId();
    expect(typeof e.guid).toBe('string');
    expect(e.guid.length).toBeGreaterThan(0);
  });

  it('should allow assigning scalar properties', () => {
    const e = new Ticket();
    e.userId = 10;
    e.sessionId = 20;
    e.isUsed = true;
    expect(e.userId).toBe(10);
    expect(e.sessionId).toBe(20);
    expect(e.isUsed).toBe(true);
  });

  it('should allow assigning relations', () => {
    const e = new Ticket();
    e.user = new User();
    e.session = new MovieSession();
    expect(e.user).toBeInstanceOf(User);
    expect(e.session).toBeInstanceOf(MovieSession);
  });
});
