import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter<HttpException> {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const attributes = exception.response?.message ?? [];
    if (exception instanceof BadRequestException) {
      response.status(HttpStatus.BAD_REQUEST).send({
        status: 'error',
        timestamp: new Date().getTime(),
        error: {
          code: 'validation_failed',
          message: 'The given data was invalid.',
        },
        attributes: attributes,
      });
    } else if (exception instanceof HttpException) {
      const errCode = exception.getResponse()?.['message'];
      response.status(exception.getStatus()).send({
        status: 'error',
        timestamp: new Date().getTime(),
        error: {
          code: errCode,
        },
      });
    } else {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        status: 'error',
        timestamp: new Date().getTime(),
        error: {
          name: exception.name,
          message: exception.message,
        },
      });
    }
  }

  public static applygGenericErrorFormat(payload: any): any {
    return {
      status: 'error',
      timestamp: new Date().getTime(),
      error: payload,
    };
  }
}
