import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieOrchestrator } from './movie.orchestrator';
import {
  CreateMovieRequestDTO,
  ListMoviesRequestDTO,
  UpdateMovieRequestDTO,
} from './dto/request';
import { JWTGuard, ManagerGuard } from 'src/_guard';

describe('MovieController', () => {
  let controller: MovieController;
  let orchestrator: jest.Mocked<MovieOrchestrator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieOrchestrator,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            list: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ManagerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MovieController>(MovieController);
    orchestrator = module.get(MovieOrchestrator);
  });

  it('should delegate create to orchestrator', async () => {
    const dto = new CreateMovieRequestDTO();
    const resource = { guid: 'm1' } as any;

    orchestrator.create.mockResolvedValue(resource);

    const result = await controller.create(dto);

    expect(orchestrator.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(resource);
  });

  it('should delegate update to orchestrator', async () => {
    const dto = new UpdateMovieRequestDTO();
    const resource = { guid: 'm1' } as any;

    orchestrator.update.mockResolvedValue(resource);

    const result = await controller.update('uuid-1', dto);

    expect(orchestrator.update).toHaveBeenCalledWith('uuid-1', dto);
    expect(result).toBe(resource);
  });

  it('should delegate delete to orchestrator', async () => {
    orchestrator.delete.mockResolvedValue(undefined);

    const result = await controller.delete('uuid-1');

    expect(orchestrator.delete).toHaveBeenCalledWith('uuid-1');
    expect(result).toBeUndefined();
  });

  it('should delegate list to orchestrator', async () => {
    const query = new ListMoviesRequestDTO();
    const mapped = { data: [] } as any;

    orchestrator.list.mockResolvedValue(mapped);

    const result = await controller.list(query);

    expect(orchestrator.list).toHaveBeenCalledWith(query);
    expect(result).toBe(mapped);
  });
});
