import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('/healthcheck')
  healthcheck(): string {
    return 'UP';
  }

  @Get('/readiness')
  async readiness() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'READY' };
    } catch {
      throw new ServiceUnavailableException({
        status: 'NOT_READY',
        reason: 'Database unavailable',
      });
    }
  }
}
