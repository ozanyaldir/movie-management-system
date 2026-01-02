import { MovieSessionOrchestrator } from './movie-session.orchestrator';
import { MovieSessionService, MovieService } from 'src/_service';
import {
  CreateMovieSessionRequestDTO,
  ListMovieSessionsRequestDTO,
  UpdateMovieSessionRequestDTO,
} from './dto/request';
import {
  MovieNotFoundException,
  MovieSessionNotFoundException,
} from 'src/_exception';
import {
  newMovieSessionFromCreateRequestDTO,
  newMovieSessionFromUpdateRequestDTO,
} from 'src/_factory';
import {
  newMovieSessionResourceFromEntity,
} from 'src/_shared/dto/resource';
import {
  newPaginatedMovieSessionResourceDTO,
} from './dto/resource';

jest.mock('src/_factory', () => ({
  newMovieSessionFromCreateRequestDTO: jest.fn(),
  newMovieSessionFromUpdateRequestDTO: jest.fn(),
}));

jest.mock('src/_shared/dto/resource', () => ({
  newMovieSessionResourceFromEntity: jest.fn(),
}));

jest.mock('./dto/resource', () => ({
  newPaginatedMovieSessionResourceDTO: jest.fn(),
}));

describe('MovieSessionOrchestrator', () => {
  let orchestrator: MovieSessionOrchestrator;
  let movieService: jest.Mocked<MovieService>;
  let movieSessionService: jest.Mocked<MovieSessionService>;

  beforeEach(() => {
    movieService = {
      getPlainByGuid: jest.fn(),
    } as any;

    movieSessionService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      getPlainByGuid: jest.fn(),
      getDetailedById: jest.fn(),
    } as any;

    orchestrator = new MovieSessionOrchestrator(
      movieSessionService,
      movieService,
    );
  });

  describe('create', () => {
    it('should create session and return resource', async () => {
      const dto = new CreateMovieSessionRequestDTO();
      dto.movie_id = 'movie-guid';

      const movie = { id: 3 } as any;
      movieService.getPlainByGuid.mockResolvedValue(movie);

      const entity = { id: 7, guid: 'session-guid' } as any;
      (newMovieSessionFromCreateRequestDTO as jest.Mock).mockReturnValue(entity);
      movieSessionService.create.mockResolvedValue(entity);

      const detailed = { id: 7 } as any;
      movieSessionService.getDetailedById.mockResolvedValue(detailed);

      const resource = { guid: 'session-guid' } as any;
      (newMovieSessionResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.create(dto);

      expect(movieService.getPlainByGuid).toHaveBeenCalledWith('movie-guid');
      expect(newMovieSessionFromCreateRequestDTO).toHaveBeenCalledWith(dto, movie);
      expect(movieSessionService.create).toHaveBeenCalledWith(entity);
      expect(movieSessionService.getDetailedById).toHaveBeenCalledWith(7);
      expect(newMovieSessionResourceFromEntity).toHaveBeenCalledWith(detailed);
      expect(result).toBe(resource);
    });

    it('should throw MovieNotFoundException when movie not found', async () => {
      const dto = new CreateMovieSessionRequestDTO();
      dto.movie_id = 'missing';

      movieService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.create(dto)).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
    });

    it('should throw MovieSessionNotFoundException when detailed lookup fails', async () => {
      const dto = new CreateMovieSessionRequestDTO();
      dto.movie_id = 'movie-guid';

      movieService.getPlainByGuid.mockResolvedValue({ id: 3 } as any);

      movieSessionService.create.mockResolvedValue({
        id: 7,
        guid: 'session-guid',
      } as any);

      movieSessionService.getDetailedById.mockResolvedValue(null);

      await expect(orchestrator.create(dto)).rejects.toBeInstanceOf(
        MovieSessionNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update session and return resource', async () => {
      const dto = new UpdateMovieSessionRequestDTO();

      movieSessionService.getPlainByGuid.mockResolvedValue({
        id: 5,
        guid: 's1',
      } as any);

      const entity = { id: 5 } as any;
      (newMovieSessionFromUpdateRequestDTO as jest.Mock).mockReturnValue(entity);

      const detailed = { id: 5 } as any;
      movieSessionService.getDetailedById.mockResolvedValue(detailed);

      const resource = { guid: 's1' } as any;
      (newMovieSessionResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.update('s1', dto);

      expect(movieSessionService.getPlainByGuid).toHaveBeenCalledWith('s1');
      expect(newMovieSessionFromUpdateRequestDTO).toHaveBeenCalledWith(dto);
      expect(movieSessionService.update).toHaveBeenCalledWith(5, entity);
      expect(movieSessionService.getDetailedById).toHaveBeenCalledWith(5);
      expect(newMovieSessionResourceFromEntity).toHaveBeenCalledWith(detailed);
      expect(result).toBe(resource);
    });

    it('should throw MovieSessionNotFoundException when session does not exist', async () => {
      movieSessionService.getPlainByGuid.mockResolvedValue(null);

      await expect(
        orchestrator.update('missing', new UpdateMovieSessionRequestDTO()),
      ).rejects.toBeInstanceOf(MovieSessionNotFoundException);
    });

    it('should throw MovieSessionNotFoundException when detailed lookup fails', async () => {
      movieSessionService.getPlainByGuid.mockResolvedValue({
        id: 5,
      } as any);

      movieSessionService.getDetailedById.mockResolvedValue(null);

      await expect(
        orchestrator.update('s1', new UpdateMovieSessionRequestDTO()),
      ).rejects.toBeInstanceOf(MovieSessionNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete existing session', async () => {
      movieSessionService.getPlainByGuid.mockResolvedValue({
        id: 9,
      } as any);

      await orchestrator.delete('s1');

      expect(movieSessionService.getPlainByGuid).toHaveBeenCalledWith('s1');
      expect(movieSessionService.delete).toHaveBeenCalledWith(9);
    });

    it('should throw MovieSessionNotFoundException when session not found', async () => {
      movieSessionService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.delete('missing')).rejects.toBeInstanceOf(
        MovieSessionNotFoundException,
      );
    });
  });

  describe('list', () => {
    it('should list sessions and map response', async () => {
      const dto = new ListMovieSessionsRequestDTO();
      dto.movie_id = 'movie-guid';
      dto.page = 2 as any;
      dto.size = 5 as any;

      const movie = { id: 3 } as any;
      movieService.getPlainByGuid.mockResolvedValue(movie);

      const rows = [{ guid: 's1' }] as any;
      movieSessionService.list.mockResolvedValue([rows, 10, 2, 5]);

      const mapped = { data: [] } as any;
      (newPaginatedMovieSessionResourceDTO as jest.Mock).mockReturnValue(
        mapped,
      );

      const result = await orchestrator.list(dto);

      expect(movieService.getPlainByGuid).toHaveBeenCalledWith('movie-guid');
      expect(movieSessionService.list).toHaveBeenCalledWith(3, 2, 5);
      expect(newPaginatedMovieSessionResourceDTO).toHaveBeenCalledWith(
        rows,
        10,
        2,
        5,
      );
      expect(result).toBe(mapped);
    });

    it('should throw MovieNotFoundException when movie not found', async () => {
      const dto = new ListMovieSessionsRequestDTO();
      dto.movie_id = 'missing';

      movieService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.list(dto)).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
    });
  });
});
