import { User, UserType } from './user.entity';
import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';

describe('User Entity', () => {
  it('should construct and extend BaseEntity', () => {
    const e = new User();
    expect(e).toBeInstanceOf(User);
    expect(e).toBeInstanceOf(BaseEntity);
  });

  it('should have undefined base fields before persistence', () => {
    const e = new User();
    expect(e.id).toBeUndefined();
    expect(e.createdAt).toBeUndefined();
    expect(e.updatedAt).toBeUndefined();
  });

  it('should generate guid on before insert', () => {
    const e = new User();
    e.generateId();
    expect(typeof e.guid).toBe('string');
    expect(e.guid.length).toBeGreaterThan(0);
  });

  it('should allow assigning scalar properties', () => {
    const e = new User();
    e.username = 'ozan';
    e.passwordHash = 'hash123';
    e.dob = new Date('1995-01-01');
    e.type = UserType.Manager;
    expect(e.username).toBe('ozan');
    expect(e.passwordHash).toBe('hash123');
    expect(e.dob).toEqual(new Date('1995-01-01'));
    expect(e.type).toBe(UserType.Manager);
  });

  it('should allow assigning relations', () => {
    const e = new User();
    e.tickets = [new Ticket()];
    expect(e.tickets[0]).toBeInstanceOf(Ticket);
  });
});
