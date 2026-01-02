import { validate } from 'class-validator';
import { SCREENING_TIME_SLOTS } from 'src/movie-session/constants';
import { CreateMovieSessionRequestDTO } from './create-movie-session.dto';

describe('CreateMovieSessionRequestDTO', () => {
  it('should be valid with proper fields', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.room_number = 'A1';
    dto.screening_date = '2026-02-01' as any;
    dto.screening_time = '16:00';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid for all predefined time slots', async () => {
    for (const slot of SCREENING_TIME_SLOTS) {
      const dto = new CreateMovieSessionRequestDTO();
      dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
      dto.room_number = 'A1';
      dto.screening_date = '2026-02-01' as any;
      dto.screening_time = slot;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });

  it('should fail when movie_id is not uuid v4', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '123';
    dto.room_number = 'A1';
    dto.screening_date = '2026-02-01' as any;
    dto.screening_time = '16:00';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when room_number is shorter than 1 char', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.room_number = '';
    dto.screening_date = '2026-02-01' as any;
    dto.screening_time = '16:00';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when room_number is longer than 4 chars', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.room_number = 'ROOM5';
    dto.screening_date = '2026-02-01' as any;
    dto.screening_time = '16:00';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when screening_date is not ISO string', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.room_number = 'A1';
    dto.screening_date = 'not-a-date' as any;
    dto.screening_time = '16:00';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when screening_time is not in slot list', async () => {
    const dto = new CreateMovieSessionRequestDTO();
    dto.movie_id = '550e8400-e29b-41d4-a716-446655440000';
    dto.room_number = 'A1';
    dto.screening_date = '2026-02-01' as any;
    dto.screening_time = '16:00:00' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
