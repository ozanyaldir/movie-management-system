import {
  newMovieFromCreateRequestDTO,
  newMovieFromUpdateRequestDTO,
} from './movie.factory';
import { Movie } from 'src/_repository/_entity';
import { CreateMovieRequestDTO } from 'src/movie/dto/request';

describe('Movie factory helpers', () => {
  describe('newMovieFromCreateRequestDTO', () => {
    it('should map title and minAllowedAge', () => {
      const dto: CreateMovieRequestDTO = {
        title: 'Interstellar',
        min_allowed_age: 13,
      };

      const movie = newMovieFromCreateRequestDTO(dto);

      expect(movie).toBeInstanceOf(Movie);
      expect(movie.title).toBe('Interstellar');
      expect(movie.minAllowedAge).toBe(13);
    });
  });

  describe('newMovieFromUpdateRequestDTO', () => {
    it('should map provided fields', () => {
      const dto: CreateMovieRequestDTO = {
        title: 'Inception',
        min_allowed_age: 16,
      };

      const movie = newMovieFromUpdateRequestDTO(dto);

      expect(movie).toBeInstanceOf(Movie);
      expect(movie.title).toBe('Inception');
      expect(movie.minAllowedAge).toBe(16);
    });

    it('should allow title and minAllowedAge to be undefined', () => {
      const dto: CreateMovieRequestDTO = {
        // @ts-expect-error optional fields in tests
        title: undefined,
        // @ts-expect-error optional fields in tests
        min_allowed_age: undefined,
      };

      const movie = newMovieFromUpdateRequestDTO(dto);

      expect(movie).toBeInstanceOf(Movie);
      expect(movie.title).toBeUndefined();
      expect(movie.minAllowedAge).toBeUndefined();
    });

    it('should support missing properties entirely', () => {
      const dto: Partial<CreateMovieRequestDTO> = {};

      const movie = newMovieFromUpdateRequestDTO(dto as CreateMovieRequestDTO);

      expect(movie.title).toBeUndefined();
      expect(movie.minAllowedAge).toBeUndefined();
    });
  });
});
