import { MovieOrchestrator } from './movie.orchestrator';
import { MovieService } from 'src/_service';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import {
  newMovieFromCreateRequestDTO,
  newMovieFromUpdateRequestDTO,
} from 'src/_factory';
import { newMovieResourceFromEntity } from 'src/_shared/dto/resource';
import { newPaginatedMovieResourceDTO } from './dto/resource';
import { MovieNotFoundException } from 'src/_exception';

jest.mock('src/_factory', () => ({
  newMovieFromCreateRequestDTO: jest.fn(),
  newMovieFromUpdateRequestDTO: jest.fn(),
}));

jest.mock('src/_shared/dto/resource', () => ({
  newMovieResourceFromEntity: jest.fn(),
}));

jest.mock('./dto/resource', () => ({
  newPaginatedMovieResourceDTO: jest.fn(),
}));

describe('MovieOrchestrator', () => {
  let orchestrator: MovieOrchestrator;
  let movieService: jest.Mocked<MovieService>;

  beforeEach(() => {
    movieService = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      getPlainByGuid: jest.fn(),
      getDetailedById: jest.fn(),
      getDetailedByGuid: jest.fn(),
    } as any;

    orchestrator = new MovieOrchestrator(movieService);
  });

  describe('create', () => {
    it('should create movie and return resource', async () => {
      const dto = new CreateMovieRequestDTO();

      const entity = { guid: 'm1' } as any;
      (newMovieFromCreateRequestDTO as jest.Mock).mockReturnValue(entity);
      movieService.create.mockResolvedValue(entity);

      const detailed = { guid: 'm1' } as any;
      movieService.getDetailedByGuid.mockResolvedValue(detailed);

      const resource = { guid: 'm1' } as any;
      (newMovieResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.create(dto);

      expect(newMovieFromCreateRequestDTO).toHaveBeenCalledWith(dto);
      expect(movieService.create).toHaveBeenCalledWith(entity);
      expect(movieService.getDetailedByGuid).toHaveBeenCalledWith('m1');
      expect(newMovieResourceFromEntity).toHaveBeenCalledWith(detailed);
      expect(result).toBe(resource);
    });

    it('should throw MovieNotFoundException when created movie cannot be fetched', async () => {
      const dto = new CreateMovieRequestDTO();

      movieService.create.mockResolvedValue({ guid: 'm1' } as any);
      movieService.getDetailedByGuid.mockResolvedValue(null);

      await expect(orchestrator.create(dto)).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update movie and return resource', async () => {
      const dto = new UpdateMovieRequestDTO();

      movieService.getPlainByGuid.mockResolvedValue({
        id: 3,
        guid: 'm1',
      } as any);

      const entity = { id: 3 } as any;
      (newMovieFromUpdateRequestDTO as jest.Mock).mockReturnValue(entity);

      const detailed = { id: 3 } as any;
      movieService.getDetailedById.mockResolvedValue(detailed);

      const resource = { guid: 'm1' } as any;
      (newMovieResourceFromEntity as jest.Mock).mockReturnValue(resource);

      const result = await orchestrator.update('m1', dto);

      expect(movieService.getPlainByGuid).toHaveBeenCalledWith('m1');
      expect(newMovieFromUpdateRequestDTO).toHaveBeenCalledWith(dto);
      expect(movieService.update).toHaveBeenCalledWith(3, entity);
      expect(movieService.getDetailedById).toHaveBeenCalledWith(3);
      expect(newMovieResourceFromEntity).toHaveBeenCalledWith(detailed);
      expect(result).toBe(resource);
    });

    it('should throw MovieNotFoundException when movie does not exist', async () => {
      movieService.getPlainByGuid.mockResolvedValue(null);

      await expect(
        orchestrator.update('missing', new UpdateMovieRequestDTO()),
      ).rejects.toBeInstanceOf(MovieNotFoundException);
    });

    it('should throw MovieNotFoundException when updated movie cannot be fetched', async () => {
      movieService.getPlainByGuid.mockResolvedValue({ id: 3 } as any);
      movieService.getDetailedById.mockResolvedValue(null);

      await expect(
        orchestrator.update('m1', new UpdateMovieRequestDTO()),
      ).rejects.toBeInstanceOf(MovieNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete movie when exists', async () => {
      movieService.getPlainByGuid.mockResolvedValue({ id: 4 } as any);

      await orchestrator.delete('m1');

      expect(movieService.getPlainByGuid).toHaveBeenCalledWith('m1');
      expect(movieService.delete).toHaveBeenCalledWith(4);
    });

    it('should throw MovieNotFoundException when movie not found', async () => {
      movieService.getPlainByGuid.mockResolvedValue(null);

      await expect(orchestrator.delete('missing')).rejects.toBeInstanceOf(
        MovieNotFoundException,
      );
    });
  });

  describe('list', () => {
    it('should delegate listing to service and map response', async () => {
      const dto = new ListMoviesRequestDTO();
      dto.page = 2 as any;
      dto.size = 10 as any;

      const rows = [{ guid: 'm1' }] as any;
      movieService.list.mockResolvedValue([rows, 20, 2, 10]);

      const mapped = { data: [] } as any;
      (newPaginatedMovieResourceDTO as jest.Mock).mockReturnValue(mapped);

      const result = await orchestrator.list(dto);

      expect(movieService.list).toHaveBeenCalledWith(dto.sort_by, 2, 10);

      expect(newPaginatedMovieResourceDTO).toHaveBeenCalledWith(
        rows,
        20,
        2,
        10,
      );

      expect(result).toBe(mapped);
    });
  });
});
