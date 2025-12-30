import { INestApplication, ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: { query: jest.Mock };

  beforeEach(async () => {
    dataSource = {
      query: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/healthcheck', () => {
    it('returns 200 UP', async () => {
      await request(app.getHttpServer())
        .get('/healthcheck')
        .expect(200)
        .expect('UP');
    });
  });

  describe('/readiness', () => {
    it('returns READY when DB is available', async () => {
      dataSource.query.mockResolvedValueOnce([{ '1': 1 }]);

      await request(app.getHttpServer())
        .get('/readiness')
        .expect(200)
        .expect({ status: 'READY' });

      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
    });

    it('returns 503 when DB is unavailable', async () => {
      dataSource.query.mockRejectedValueOnce(new Error('DB down'));

      const res = await request(app.getHttpServer())
        .get('/readiness')
        .expect(503);

      expect(res.body).toEqual({
        status: 'NOT_READY',
        reason: 'Database unavailable',
      });
    });
  });
});
