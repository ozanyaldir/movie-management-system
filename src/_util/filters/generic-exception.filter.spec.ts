import {
  BadRequestException,
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { GenericExceptionFilter } from './generic-exception.filter';

describe('GenericExceptionFilter', () => {
  let filter: GenericExceptionFilter;
  let mockReply: any;
  let mockHost: ArgumentsHost;

  const mockHttpHost = () =>
    ({
      switchToHttp: () => ({
        getResponse: () => mockReply,
      }),
    } as any);

  beforeEach(() => {
    filter = new GenericExceptionFilter();

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockHost = mockHttpHost();
  });

  describe('catch()', () => {
    it('handles BadRequestException with validation error format', () => {
      const exception = new BadRequestException(['field is required']);

      (exception as any).response = { message: ['field is required'] };

      filter.catch(exception, mockHost);

      expect(mockReply.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: {
            code: 'validation_failed',
            message: 'The given data was invalid.',
          },
          attributes: ['field is required'],
        }),
      );
    });

    it('handles other HttpException with code + message', () => {
      const exception = new HttpException(
        { code: 'movie_not_found', message: 'Movie not found' },
        HttpStatus.NOT_FOUND,
      );

      filter.catch(exception, mockHost);

      expect(mockReply.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);

      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: {
            code: 'movie_not_found',
            message: 'Movie not found',
          },
        }),
      );
    });

    it('handles non-HTTP exceptions with fallback 422 response', () => {
      const exception = new Error('Unexpected failure');
      (exception as any).name = 'RuntimeError';

      filter.catch(exception, mockHost);

      expect(mockReply.status).toHaveBeenCalledWith(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          error: {
            name: 'RuntimeError',
            message: 'Unexpected failure',
          },
        }),
      );
    });
  });

  describe('applygGenericErrorFormat()', () => {
    it('wraps payload in generic error format', () => {
      const payload = { code: 'x', message: 'oops' };

      const result = GenericExceptionFilter.applygGenericErrorFormat(payload);

      expect(result.status).toBe('error');
      expect(result.error).toEqual(payload);
      expect(typeof result.timestamp).toBe('number');
    });
  });
});
