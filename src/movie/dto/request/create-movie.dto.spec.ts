import { validate } from 'class-validator';
import { CreateMovieRequestDTO } from './create-movie.dto';

describe('CreateMovieRequestDTO', () => {
  it('should be valid when all optional fields are provided', async () => {
    const dto = new CreateMovieRequestDTO();
    dto.title = 'Interstellar';
    dto.min_allowed_age = 13 as any;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when no fields are provided', async () => {
    const dto = new CreateMovieRequestDTO();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when title is too short', async () => {
    const dto = new CreateMovieRequestDTO();
    dto.title = 'abc';
    dto.min_allowed_age = 10 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when min_allowed_age is negative', async () => {
    const dto = new CreateMovieRequestDTO();
    dto.min_allowed_age = -1 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when min_allowed_age is not an integer', async () => {
    const dto = new CreateMovieRequestDTO();
    dto.min_allowed_age = 12.5 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
