import { ProductAlreadyExistsException } from '@libs/errors/duplicated-product.error';
import {
  BadRequestException,
  CallHandler,
  Catch,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Catch(ProductAlreadyExistsException)
export class ProductAlreadyExistsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ProductAlreadyExistsException)
          throw new BadRequestException(error.message);
        throw error;
      }),
    );
  }
}
