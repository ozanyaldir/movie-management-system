import { Test } from '@nestjs/testing'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import request from 'supertest'
import { AuthController } from '../src/auth/auth.controller'
import { AuthOrchestrator } from '../src/auth/auth.orchestrator'

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication
  let orchestrator: AuthOrchestrator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthOrchestrator,
          useValue: {
            register: jest.fn().mockResolvedValue({ token: 'registered-jwt' }),
            login: jest.fn().mockResolvedValue({ token: 'login-jwt' }),
          },
        },
      ],
    }).compile()

    orchestrator = moduleRef.get(AuthOrchestrator)

    app = await moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app?.close()
  })

  it('/auth/register (POST) should return 201 and delegate to orchestrator', async () => {
    const dto = { username: 'ozan', password: 'supersecret' }

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201)

    expect(orchestrator.register).toHaveBeenCalledWith(dto)
    expect(res.body).toEqual({ token: 'registered-jwt' })
  })

  it('/auth/login (POST) should return 200 and delegate to orchestrator', async () => {
    const dto = { username: 'ozan', password: 'supersecret' }

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(200)

    expect(orchestrator.login).toHaveBeenCalledWith(dto)
    expect(res.body).toEqual({ token: 'login-jwt' })
  })
})
