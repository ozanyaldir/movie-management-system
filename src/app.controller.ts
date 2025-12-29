import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ApiTags,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('/healthcheck')
  @ApiOkResponse({ description: 'Application is running' })
  healthcheck(): string {
    return 'UP';
  }

  @Get('/readiness')
  @ApiOkResponse({ description: 'Service is ready' })
  @ApiServiceUnavailableResponse({ description: 'Database unavailable' })
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
