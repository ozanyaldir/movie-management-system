import { Test } from '@nestjs/testing'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import request from 'supertest'

import { JWTGuard, ManagerGuard } from '../src/_guard'
import { MovieOrchestrator } from '../src/movie/movie.orchestrator'
import { MovieController } from '../src/movie/movie.controller'

const MOVIE_ID = '11111111-1111-1111-1111-111111111111'

describe('MovieController (e2e)', () => {
  let app: NestFastifyApplication
  let orchestrator: MovieOrchestrator

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieOrchestrator,
          useValue: {
            create: jest.fn().mockResolvedValue({
              guid: MOVIE_ID,
              title: 'Movie',
              min_allowed_age: 13,
            }),
            update: jest.fn().mockResolvedValue({
              guid: MOVIE_ID,
              title: 'Updated',
              min_allowed_age: 16,
            }),
            delete: jest.fn().mockResolvedValue(undefined),
            list: jest.fn().mockResolvedValue({
              total: 1,
              page: 1,
              size: 20,
              data: [
                { guid: MOVIE_ID, title: 'Movie', min_allowed_age: 13 },
              ],
            }),
          },
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(ManagerGuard)
      .useValue({ canActivate: () => true })
      .compile()

    orchestrator = moduleRef.get(MovieOrchestrator)

    app = await moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/movies (POST) should call orchestrator.create and return 201', async () => {
    const dto = { title: 'Movie', min_allowed_age: 13 }

    const res = await request(app.getHttpServer())
      .post('/movies')
      .send(dto)
      .expect(201)

    expect(orchestrator.create).toHaveBeenCalledWith(dto)
    expect(res.body).toEqual({
      guid: MOVIE_ID,
      title: 'Movie',
      min_allowed_age: 13,
    })
  })

  it('/movies/:id (PUT) should call orchestrator.update and return 200', async () => {
    const dto = { title: 'Updated', min_allowed_age: 16 }

    const res = await request(app.getHttpServer())
      .put(`/movies/${MOVIE_ID}`)
      .send(dto)
      .expect(200)

    expect(orchestrator.update).toHaveBeenCalledWith(MOVIE_ID, dto)
    expect(res.body).toEqual({
      guid: MOVIE_ID,
      title: 'Updated',
      min_allowed_age: 16,
    })
  })

  it('/movies/:id (DELETE) should call orchestrator.delete and return 200', async () => {
    await request(app.getHttpServer())
      .delete(`/movies/${MOVIE_ID}`)
      .expect(200)

    expect(orchestrator.delete).toHaveBeenCalledWith(MOVIE_ID)
  })

  it('/movies (GET) should call orchestrator.list and return results', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies?page=1&size=20')
      .expect(200)

    expect(orchestrator.list).toHaveBeenCalled()
    expect(res.body).toEqual({
      total: 1,
      page: 1,
      size: 20,
      data: [{ guid: MOVIE_ID, title: 'Movie', min_allowed_age: 13 }],
    })
  })
})
