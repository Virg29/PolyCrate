import {
	ExecutionContext,
	HttpException,
	HttpStatus,
	createParamDecorator,
} from '@nestjs/common';
import { SearchQueryGeneral } from '../types/interfaces/search.interface';

export const SearchParam = createParamDecorator(
	(data, ctx: ExecutionContext): SearchQueryGeneral | null => {
		const req = ctx.switchToHttp().getRequest();
		const search = req.query.search as string;
		const fields = req.query.fields as string;
		const sort = req.query.sort as SearchQueryGeneral['sort'];

		if (search == null || search.length == 0) return null;
		if (fields == null || fields.length == 0) return null;

		if (
			!new RegExp(
				/^[a-zA-Z0-9\-_\@\.\+]+(?:\s[a-zA-Z0-9\-_\@\.\+]+)*$/,
			).test(search)
		)
			throw new HttpException(
				"Search string must correspond to '^[a-zA-Z0-9-_@.+]+(?:s[a-zA-Z0-9-_@.+]+)*$'",
				HttpStatus.BAD_REQUEST,
			);

		return {
			fields: fields.split(';'),
			query: search,
			sort: sort != null ? sort : 'desc',
		};
	},
);
