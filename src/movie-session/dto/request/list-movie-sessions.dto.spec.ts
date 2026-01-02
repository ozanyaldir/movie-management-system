import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ListMovieSessionsRequestDTO } from './list-movie-sessions.dto';

describe('ListMovieSessionsRequestDTO', () => {
  it('should be valid with only movie_id', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '550e8400-e29b-41d4-a716-446655440000',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform and validate numeric page and size', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '550e8400-e29b-41d4-a716-446655440000',
      page: '2',
      size: '20',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(20);
  });

  it('should ignore page when value is 0 due to transform', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '550e8400-e29b-41d4-a716-446655440000',
      page: 0,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.page).toBeUndefined();
  });

  it('should fail when size exceeds max limit', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '550e8400-e29b-41d4-a716-446655440000',
      size: 200,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when page is not integer', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '550e8400-e29b-41d4-a716-446655440000',
      page: 3.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when movie_id is not uuid v4', async () => {
    const dto = plainToInstance(ListMovieSessionsRequestDTO, {
      movie_id: '123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
