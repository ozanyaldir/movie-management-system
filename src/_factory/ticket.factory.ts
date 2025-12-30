import { MovieSession, Ticket, User } from 'src/_repository/_entity';

export function newTicketFromUserAndSession(
  user: User,
  session: MovieSession,
): Ticket {
  const m = new Ticket();
  m.userId = user.id;
  m.sessionId = session.id;
  return m;
}
