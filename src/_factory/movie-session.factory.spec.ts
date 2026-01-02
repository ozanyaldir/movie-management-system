import moment from 'moment';
import {
  newMovieSessionFromCreateRequestDTO,
  newMovieSessionFromUpdateRequestDTO,
} from './movie-session.factory';
import { Movie, MovieSession } from 'src/_repository/_entity';

describe('MovieSession factory helpers', () => {
  function makeMovie(id?: number): Movie {
    const m = new Movie();
    // @ts-expect-error manual assignment in tests
    m.id = id;
    return m;
  }

  describe('newMovieSessionFromCreateRequestDTO', () => {
    it('should map fields and format screening time to HH:mm:ss', () => {
      const dto = {
        screening_date: new Date('2026-02-01'),
        screening_time: '19:30',
        room_number: 'A2',
      };

      const movie = makeMovie(5);

      const session = newMovieSessionFromCreateRequestDTO(
        dto as any,
        movie,
      );

      expect(session).toBeInstanceOf(MovieSession);
      expect(session.movieId).toBe(5);
      expect(session.screeningDate).toEqual(dto.screening_date);

      expect(session.screeningTime).toBe(
        moment('19:30', 'HH:mm').format('HH:mm:ss'),
      );

      expect(session.roomNumber).toBe('A2');
    });
  });

  describe('newMovieSessionFromUpdateRequestDTO', () => {
    it('should map provided fields', () => {
      const dto = {
        screening_date: new Date('2026-03-10'),
        screening_time: '16:45',
        room_number: 'B1',
      };

      const session = newMovieSessionFromUpdateRequestDTO(
        dto as any,
      );

      expect(session).toBeInstanceOf(MovieSession);
      expect(session.roomNumber).toBe('B1');
      expect(session.screeningDate).toEqual(dto.screening_date);

      expect(session.screeningTime).toBe(
        moment('16:45', 'HH:mm').format('HH:mm:ss'),
      );
    });

    it('should allow nullable / undefined update fields', () => {
      const dto = {
        screening_date: undefined,
        room_number: undefined,
      };

      const session = newMovieSessionFromUpdateRequestDTO(
        dto as any,
      );

      expect(session.roomNumber).toBeUndefined();
      expect(session.screeningDate).toBeUndefined();
      expect(session.screeningTime).toBeUndefined();
    });

    it('should not touch screeningTime when screening_time is empty string', () => {
      const dto = {
        screening_time: '',
      };

      const session = newMovieSessionFromUpdateRequestDTO(
        dto as any,
      );

      expect(session.screeningTime).toBeUndefined();
    });

    it('should format screening_time only when provided', () => {
      const dto = {
        screening_time: '08:05',
      };

      const session = newMovieSessionFromUpdateRequestDTO(
        dto as any,
      );

      expect(session.screeningTime).toBe(
        moment('08:05', 'HH:mm').format('HH:mm:ss'),
      );
    });
  });
});
