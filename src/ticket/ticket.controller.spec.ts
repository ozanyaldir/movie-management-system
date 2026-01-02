import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketOrchestrator } from './ticket.orchestrator';
import { BuyTicketRequestDTO, ListTicketsRequestDTO } from './dto/request';
import { User } from 'src/_repository/_entity';
import { JWTGuard, CustomerGuard } from 'src/_guard';

describe('TicketController', () => {
  let controller: TicketController;
  let orchestrator: jest.Mocked<TicketOrchestrator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketOrchestrator,
          useValue: {
            buyTicket: jest.fn(),
            useTicket: jest.fn(),
            list: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CustomerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TicketController>(TicketController);
    orchestrator = module.get(TicketOrchestrator);
  });

  it('should delegate buyTicket to orchestrator', async () => {
    const user = new User();
    user.id = 1 as any;

    const dto = new BuyTicketRequestDTO();
    dto.session_id = '550e8400-e29b-41d4-a716-446655440000';

    const result = { guid: 't1' } as any;
    orchestrator.buyTicket.mockResolvedValue(result);

    const response = await controller.buyTicket(user, dto);

    expect(orchestrator.buyTicket).toHaveBeenCalledWith(user, dto);
    expect(response).toBe(result);
  });

  it('should delegate useTicket to orchestrator', async () => {
    const result = { guid: 't2' } as any;
    orchestrator.useTicket.mockResolvedValue(result);

    const response = await controller.useTicket(
      'a3b7a0fe-5d9b-4b0a-9e04-4c6aefc241f1',
    );

    expect(orchestrator.useTicket).toHaveBeenCalledWith(
      'a3b7a0fe-5d9b-4b0a-9e04-4c6aefc241f1',
    );
    expect(response).toBe(result);
  });

  it('should delegate list to orchestrator', async () => {
    const user = new User();
    user.id = 1 as any;

    const query = new ListTicketsRequestDTO();
    query.page = 1 as any;

    const result = { data: [] } as any;
    orchestrator.list.mockResolvedValue(result);

    const response = await controller.list(user, query);

    expect(orchestrator.list).toHaveBeenCalledWith(user, query);
    expect(response).toBe(result);
  });
});
