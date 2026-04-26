import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from '../modules/credential/contracts/access-token-payload';

type AuthenticatedRequest = Request & { user: AccessTokenPayload };

export const FromRequest = createParamDecorator(
  (data: keyof AuthenticatedRequest, context: ExecutionContext): unknown => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request[data];
  },
);
