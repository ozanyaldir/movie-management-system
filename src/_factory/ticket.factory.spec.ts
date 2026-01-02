import { newTicketFromUserAndSession } from './ticket.factory';
import { MovieSession, Ticket, User } from 'src/_repository/_entity';

describe('newTicketFromUserAndSession', () => {
  function makeUser(id?: number): User {
    const u = new User();
    // @ts-expect-error allow manual assignment for test
    u.id = id;
    return u;
  }

  function makeSession(id?: number): MovieSession {
    const s = new MovieSession();
    // @ts-expect-error allow manual assignment for test
    s.id = id;
    return s;
  }

  it('should map userId and sessionId when ids are defined', () => {
    const user = makeUser(10);
    const session = makeSession(20);

    const ticket = newTicketFromUserAndSession(user, session);

    expect(ticket).toBeInstanceOf(Ticket);
    expect(ticket.userId).toBe(10);
    expect(ticket.sessionId).toBe(20);
  });

  it('should allow undefined ids (before persistence)', () => {
    const user = makeUser(undefined);
    const session = makeSession(undefined);

    const ticket = newTicketFromUserAndSession(user, session);

    expect(ticket).toBeInstanceOf(Ticket);
    expect(ticket.userId).toBeUndefined();
    expect(ticket.sessionId).toBeUndefined();
  });
});
