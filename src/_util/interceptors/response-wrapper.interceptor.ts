import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  status: string;
  timestamp: number;
}

@Injectable()
export class ResponseWrapperInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) =>
        ResponseWrapperInterceptor.applyGenericSuccessResponseFormat(data),
      ),
    );
  }

  public static applyGenericSuccessResponseFormat(payload: any): Response<any> {
    return {
      status: 'success',
      timestamp: new Date().getTime(),
      data: payload,
    };
  }
}
