import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadType } from 'src/utils/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadType => {
    const request: Request = context.switchToHttp().getRequest();
    return request['user'] as JwtPayloadType;
  },
);
// This decorator extracts the current user from the request object in the context of an HTTP request.
// It uses the ExecutionContext to access the request and retrieves the user information from it.
// The user information is expected to be of type JwtPayloadType, which is defined in the types file.
// The decorator can be used in route handlers to easily access the current user's information without having to manually extract it from the request object each time.