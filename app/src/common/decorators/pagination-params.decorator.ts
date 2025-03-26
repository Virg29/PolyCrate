import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { PaginationQuery } from '../types/interfaces/pagination.interface';
import { UnlimitedQueryAllowed } from './allow-unlimited-query.decorator';

export const PaginationParams = createParamDecorator(
	(data, ctx: ExecutionContext): PaginationQuery => {
		const req: Request = ctx.switchToHttp().getRequest();

		const page =
			req.query.page != null ? parseInt(req.query.page as string) : 0;

		const unlimitedQueryAllowed =
			Reflect.getMetadata(UnlimitedQueryAllowed, ctx.getHandler()) ??
			false;

		const pageSize =
			req.query.pageSize != null
				? parseInt(req.query.pageSize as string)
				: 20;

		// check if pageSize settled in -1 and unlimitedQueryAllowed
		if (!unlimitedQueryAllowed && pageSize == -1)
			throw new BadRequestException(
				'Unlimited query not allowed here, you can not pass -1 in pageSize param',
			);

		// check if page and size are valid
		if (isNaN(page) || page < 0)
			throw new BadRequestException(
				'Invalid pagination params: Page not a number or less than -1',
			);

		// do not allow to fetch large slices of the dataset if unlimitedQuery not allowed
		if (
			!unlimitedQueryAllowed &&
			(isNaN(pageSize) || pageSize > 20 || pageSize < 1)
		)
			throw new BadRequestException(
				'Invalid pagination params: Page size not a number or greater than 20 or less than 1',
			);

		if (unlimitedQueryAllowed && (isNaN(pageSize) || pageSize < -1))
			throw new BadRequestException(
				'Invalid pagination params: pageSize param must be pageSize>=-1',
			);

		// calculate pagination parameters
		return {
			page,
			pageSize,
		};
	},
);
