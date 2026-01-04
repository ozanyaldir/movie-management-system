import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import request from 'supertest';

import { JWTGuard, ManagerGuard } from '../src/_guard';
import { MovieSessionOrchestrator } from '../src/movie-session/movie-session.orchestrator';
import { MovieSessionController } from '../src/movie-session/movie-session.controller';

const VALID_ID = '11111111-1111-1111-1111-111111111111';
const MOVIE_ID = '22222222-2222-2222-2222-222222222222';

describe('MovieSessionController (e2e)', () => {
  let app: NestFastifyApplication;
  let orchestrator: MovieSessionOrchestrator;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MovieSessionController],
      providers: [
        {
          provide: MovieSessionOrchestrator,
          useValue: {
            create: jest.fn().mockResolvedValue({
              guid: VALID_ID,
              room_number: '1',
              screening_date: '2025-01-01',
              screening_time: '10:00',
              movie: { guid: MOVIE_ID, title: 'Movie' },
            }),
            update: jest.fn().mockResolvedValue({
              guid: VALID_ID,
              room_number: '2',
              screening_date: '2025-01-02',
              screening_time: '12:00',
              movie: { guid: MOVIE_ID, title: 'Movie' },
            }),
            delete: jest.fn().mockResolvedValue(undefined),
            list: jest.fn().mockResolvedValue({
              total: 1,
              page: 1,
              size: 20,
              data: [
                {
                  guid: VALID_ID,
                  room_number: '1',
                  screening_date: '2025-01-01',
                  screening_time: '10:00',
                },
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
      .compile();

    orchestrator = moduleRef.get(MovieSessionOrchestrator);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/sessions (POST) should call orchestrator.create and return 201', async () => {
    const dto = {
      movie_id: MOVIE_ID,
      room_number: '1',
      screening_date: '2025-01-01',
      screening_time: '10:00',
    };

    const res = await request(app.getHttpServer())
      .post('/sessions')
      .send(dto)
      .expect(201);

    expect(orchestrator.create).toHaveBeenCalledWith(dto);
    expect(res.body.guid).toBe(VALID_ID);
  });

  it('/sessions/:id (PUT) should call orchestrator.update and return 200', async () => {
    const dto = {
      room_number: '2',
      screening_date: '2025-01-02',
      screening_time: '12:00',
    };

    const res = await request(app.getHttpServer())
      .put(`/sessions/${VALID_ID}`)
      .send(dto)
      .expect(200);

    expect(orchestrator.update).toHaveBeenCalledWith(VALID_ID, dto);
    expect(res.body.room_number).toBe('2');
  });

  it('/sessions/:id (DELETE) should call orchestrator.delete and return 200', async () => {
    await request(app.getHttpServer())
      .delete(`/sessions/${VALID_ID}`)
      .expect(200);

    expect(orchestrator.delete).toHaveBeenCalledWith(VALID_ID);
  });

  it('/sessions (GET) should call orchestrator.list and return results', async () => {
    const res = await request(app.getHttpServer())
      .get(`/sessions?movie_id=${MOVIE_ID}&page=1&size=20`)
      .expect(200);

    expect(orchestrator.list).toHaveBeenCalled();
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].guid).toBe(VALID_ID);
  });
});
