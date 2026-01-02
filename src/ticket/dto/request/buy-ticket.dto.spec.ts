import { validate } from 'class-validator';
import { BuyTicketRequestDTO } from './buy-ticket.dto';

describe('BuyTicketRequestDTO', () => {
  it('should be valid with a uuid v4 session_id', async () => {
    const dto = new BuyTicketRequestDTO();
    dto.session_id = '550e8400-e29b-41d4-a716-446655440000';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when session_id is not uuid v4', async () => {
    const dto = new BuyTicketRequestDTO();
    dto.session_id = '123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
