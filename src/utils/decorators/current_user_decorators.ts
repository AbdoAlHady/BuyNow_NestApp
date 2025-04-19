import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadType } from '../types';

export const CurrntUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayloadType => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
