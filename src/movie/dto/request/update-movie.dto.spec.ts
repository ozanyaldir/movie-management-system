import { validate } from 'class-validator';
import { UpdateMovieRequestDTO } from './update-movie.dto';

describe('UpdateMovieRequestDTO', () => {
  it('should be valid when no fields are provided', async () => {
    const dto = new UpdateMovieRequestDTO();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when optional fields are provided', async () => {
    const dto = new UpdateMovieRequestDTO();
    dto.title = 'Inception';
    dto.min_allowed_age = 12 as any;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when title is too short', async () => {
    const dto = new UpdateMovieRequestDTO();
    dto.title = 'abc';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when min_allowed_age is negative', async () => {
    const dto = new UpdateMovieRequestDTO();
    dto.min_allowed_age = -1 as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when min_allowed_age is not an integer', async () => {
    const dto = new UpdateMovieRequestDTO();
    dto.min_allowed_age = 11.3 as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
