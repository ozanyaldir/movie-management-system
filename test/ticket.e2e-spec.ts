import { Test } from '@nestjs/testing'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import request from 'supertest'
import { JWTGuard, CustomerGuard } from '../src/_guard'
import { TicketOrchestrator } from '../src/ticket/ticket.orchestrator'
import { TicketController } from '../src/ticket/ticket.controller'

const TICKET_ID = '11111111-1111-1111-1111-111111111111'
const SESSION_ID = '22222222-2222-2222-2222-222222222222'
const USER_ID = '33333333-3333-3333-3333-333333333333'

describe('TicketController (e2e)', () => {
  let app: NestFastifyApplication
  let orchestrator: TicketOrchestrator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketOrchestrator,
          useValue: {
            buyTicket: jest.fn().mockResolvedValue({
              guid: TICKET_ID,
              is_used: false,
              session: { guid: SESSION_ID },
              user: { guid: USER_ID },
            }),

            useTicket: jest.fn().mockResolvedValue({
              guid: TICKET_ID,
              is_used: true,
              session: { guid: SESSION_ID },
            }),

            list: jest.fn().mockResolvedValue({
              total: 1,
              page: 1,
              size: 20,
              data: [
                {
                  guid: TICKET_ID,
                  is_used: false,
                  session: { guid: SESSION_ID },
                },
              ],
            }),
          },
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(CustomerGuard)
      .useValue({ canActivate: () => true })
      .compile()

    orchestrator = moduleRef.get(TicketOrchestrator)

    app = await moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/tickets/buy (POST) should call orchestrator.buyTicket and return 200', async () => {
    const dto = { session_id: SESSION_ID }

    const res = await request(app.getHttpServer())
      .post('/tickets/buy')
      .send(dto)
      .expect(200)

    expect(orchestrator.buyTicket).toHaveBeenCalledWith(undefined, dto)

    expect(res.body.guid).toBe(TICKET_ID)
    expect(res.body.is_used).toBe(false)
  })

  it('/tickets/:id/use (POST) should call orchestrator.useTicket and return 200', async () => {
    const res = await request(app.getHttpServer())
      .post(`/tickets/${TICKET_ID}/use`)
      .expect(200)

    expect(orchestrator.useTicket).toHaveBeenCalledWith(TICKET_ID)
    expect(res.body.is_used).toBe(true)
  })

  it('/tickets (GET) should call orchestrator.list and return results', async () => {
    const res = await request(app.getHttpServer())
      .get('/tickets?page=1&size=20')
      .expect(200)

    expect(orchestrator.list).toHaveBeenCalled()
    expect(res.body.total).toBe(1)
    expect(res.body.data[0].guid).toBe(TICKET_ID)
  })
})
