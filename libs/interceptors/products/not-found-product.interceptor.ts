import { ProductNotFoundException } from '@libs/errors/not-found-product.error';
import {
  CallHandler,
  Catch,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Catch(ProductNotFoundException)
export class ProductNotFoundInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ProductNotFoundException)
          throw new NotFoundException(error.message);
        throw error;
      }),
    );
  }
}
