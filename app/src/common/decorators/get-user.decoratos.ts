import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from '../types/auth/interfaces';

export const GetUser = createParamDecorator(
	(data: string, ctx: ExecutionContext): UserPayload => {
		const req = ctx.switchToHttp().getRequest();
		if (data && typeof data === 'string' && req.user[data])
			return req.user[data];
		return req.user;
	},
);
