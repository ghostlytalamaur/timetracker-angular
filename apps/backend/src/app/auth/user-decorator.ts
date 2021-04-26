import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userId = request?.user?.sub;
  if (typeof userId !== 'string') {
    throw new Error('There is not userId');
  }

  return userId;
});
