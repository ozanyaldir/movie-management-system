import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SortMoviesBy } from 'src/_shared/constant';
import { ListMoviesRequestDTO } from './list-movies.dto';

describe('ListMoviesRequestDTO', () => {
  it('should be valid when no fields are provided', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform and validate numeric page and size', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      page: '2',
      size: '50',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(50);
  });

  it('should ignore page when value is 0 due to transform', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      page: 0,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBeUndefined();
  });

  it('should fail when size exceeds max limit', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      size: 200,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when size is not an integer', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      size: 10.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should be valid with sort_by enum', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      sort_by: SortMoviesBy.Title,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when sort_by is not enum', async () => {
    const dto = plainToInstance(ListMoviesRequestDTO, {
      sort_by: 'wrong',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
