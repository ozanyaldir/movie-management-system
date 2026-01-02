import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListTicketsRequestDTO } from './list-tickets.dto';

describe('ListTicketsRequestDTO', () => {
  it('should be valid when no fields are provided', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform and validate numeric page and size', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {
      page: '2',
      size: '25',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(25);
  });

  it('should ignore page when value is 0 due to transform', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {
      page: 0,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBeUndefined();
  });

  it('should fail when size exceeds max limit', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {
      size: 200,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when size is not integer', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {
      size: 10.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should parse is_used string true/false values', async () => {
    const t1 = plainToInstance(ListTicketsRequestDTO, { is_used: 'true' });
    const t2 = plainToInstance(ListTicketsRequestDTO, { is_used: 'false' });

    await validate(t1);
    await validate(t2);

    expect(t1.is_used).toBe(true);
    expect(t2.is_used).toBe(false);
  });

  it('should parse is_used numeric-like values', async () => {
    const t1 = plainToInstance(ListTicketsRequestDTO, { is_used: '1' });
    const t0 = plainToInstance(ListTicketsRequestDTO, { is_used: '0' });

    await validate(t1);
    await validate(t0);

    expect(t1.is_used).toBe(true);
    expect(t0.is_used).toBe(false);
  });

  it('should ignore is_used when empty', async () => {
    const dto = plainToInstance(ListTicketsRequestDTO, {
      is_used: '',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.is_used).toBeUndefined();
  });

  it('should coerce boolean values directly', async () => {
    const t1 = plainToInstance(ListTicketsRequestDTO, { is_used: true });
    const t0 = plainToInstance(ListTicketsRequestDTO, { is_used: false });

    await validate(t1);
    await validate(t0);

    expect(t1.is_used).toBe(true);
    expect(t0.is_used).toBe(false);
  });
});
