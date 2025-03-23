import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as qs from 'qs';
import { Request } from 'express';

@Injectable()
export class ParseQueryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request:Request = context.switchToHttp().getRequest();
    
    const parsedQuery= qs.parse(qs.stringify(request.query));

    Object.defineProperty(request, 'query', {
        value: parsedQuery,
        writable: false, // اجعله غير قابل للتعديل بعد التعيين
        configurable: true, // يسمح بإعادة تعريفه إذا لزم الأمر
        enumerable: true, // يظل جزءًا من الكائن عند الطباعة
      })

    return next.handle();
  }
}
