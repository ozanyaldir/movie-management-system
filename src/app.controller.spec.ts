import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(() => {
    dataSource = {
      query: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    controller = new AppController(dataSource);
  });

  describe('healthcheck', () => {
    it('should return UP', () => {
      const result = controller.healthcheck();
      expect(result).toBe('UP');
    });
  });

  describe('readiness', () => {
    it('should return READY when database query succeeds', async () => {
      dataSource.query.mockResolvedValueOnce([{ '1': 1 }]);

      const result = await controller.readiness();

      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
      expect(result).toEqual({ status: 'READY' });
    });

    it('should throw ServiceUnavailableException when database is unavailable', async () => {
      dataSource.query.mockRejectedValueOnce(new Error('DB down'));

      await expect(controller.readiness()).rejects.toThrow(
        ServiceUnavailableException,
      );

      try {
        await controller.readiness();
      } catch (err: any) {
        expect(err.getStatus()).toBe(503);
        expect(err.response).toEqual({
          status: 'NOT_READY',
          reason: 'Database unavailable',
        });
      }
    });
  });
});
