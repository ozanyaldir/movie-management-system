import { validate } from 'class-validator';
import { SCREENING_TIME_SLOTS } from 'src/movie-session/constants';
import { UpdateMovieSessionRequestDTO } from './update-movie-session.dto';

describe('UpdateMovieSessionRequestDTO', () => {
  it('should be valid when no fields are provided', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when all optional fields are provided', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    dto.room_number = 'B2';
    dto.screening_date = '2026-03-01' as any;
    dto.screening_time = '18:00';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid for all allowed screening time slots', async () => {
    for (const slot of SCREENING_TIME_SLOTS) {
      const dto = new UpdateMovieSessionRequestDTO();
      dto.screening_time = slot;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });

  it('should fail when room_number is too short', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    dto.room_number = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when room_number is too long', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    dto.room_number = 'ROOM5';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when screening_date is not ISO string', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    dto.screening_date = 'invalid-date' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when screening_time is not in slot list', async () => {
    const dto = new UpdateMovieSessionRequestDTO();
    dto.screening_time = '16:00:00' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
