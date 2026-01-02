import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthOrchestrator } from './auth.orchestrator';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request';

describe('AuthController', () => {
  let controller: AuthController;
  let orchestrator: jest.Mocked<AuthOrchestrator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthOrchestrator,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    orchestrator = module.get(
      AuthOrchestrator,
    ) as jest.Mocked<AuthOrchestrator>;
  });

  it('should delegate register to orchestrator', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozan';
    dto.password = 'secret123';

    const resource = { token: 'jwt-token' } as any;
    orchestrator.register.mockResolvedValue(resource);

    const result = await controller.register(dto);

    expect(orchestrator.register).toHaveBeenCalledWith(dto);
    expect(result).toBe(resource);
  });

  it('should delegate login to orchestrator', async () => {
    const dto = new LoginRequestDTO();
    dto.username = 'ozan';
    dto.password = 'secret123';

    const resource = { token: 'jwt-token' } as any;
    orchestrator.login.mockResolvedValue(resource);

    const result = await controller.login(dto);

    expect(orchestrator.login).toHaveBeenCalledWith(dto);
    expect(result).toBe(resource);
  });
});
