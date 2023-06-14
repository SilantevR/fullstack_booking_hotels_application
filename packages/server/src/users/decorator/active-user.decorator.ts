import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ActiveUserData } from '../interfaces/interfaces';
dotenv.config();

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[process.env.REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
