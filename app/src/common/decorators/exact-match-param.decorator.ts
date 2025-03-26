import {
	ExecutionContext,
	HttpException,
	HttpStatus,
	createParamDecorator,
	Logger,
} from '@nestjs/common';
import { ExactMatchQuery } from '../types/interfaces/search.interface';

const splitDirectiveStringRegEx = /([\w.,-]+)(\:|\!\:|\[\]|\!\[\])([\w\s,\-]+)/;
const logger = new Logger('ExactMatchParam');

type SearchDirective = {
	key: string;
	directive: string;
	value: string;
};

function convertSearchDirectiveToQueryChunk({
	key,
	value,
	directive,
}: SearchDirective) {
	if (key == null || value == null || directive == null) {
		logger.warn(
			`Invalid search directive: ${JSON.stringify({
				key,
				value,
				directive,
			})}`,
		);
		return {};
	}

	const searchChunk = { [key]: {} };
	switch (directive) {
		case ':':
			searchChunk[key] = { equals: value };
			break;
		case '!:':
			searchChunk[key] = { not: value };
			break;
		case '[]':
			searchChunk[key] = { in: value.split(',') };
			break;
		case '![]':
			searchChunk[key] = { notIn: value.split(',') };
			break;
		default:
			logger.warn(`Unknown directive: ${directive}`);
			return {};
	}
	return searchChunk;
}

export const ExactMatchParam = createParamDecorator(
	(data, ctx: ExecutionContext): ExactMatchQuery | null => {
		const req = ctx.switchToHttp().getRequest();
		const exactMatchQuery = req.query.exact_match_filter as string;
		logger.debug(`Processing exact match query: ${exactMatchQuery}`);

		if (exactMatchQuery == null || exactMatchQuery.length == 0) return null;

		let exactMatchFilterParams = {};

		try {
			exactMatchQuery.split(';').forEach((exactMatchChunk) => {
				const regExExecRes =
					splitDirectiveStringRegEx.exec(exactMatchChunk);
				if (regExExecRes == null || regExExecRes.length != 4) {
					logger.warn(
						`Invalid search directive format: ${exactMatchChunk}`,
					);
					return;
				}

				const searchDirective: SearchDirective = {
					key: regExExecRes[1],
					directive: regExExecRes[2],
					value: regExExecRes[3],
				};

				const chunk =
					convertSearchDirectiveToQueryChunk(searchDirective);
				exactMatchFilterParams = {
					...exactMatchFilterParams,
					...chunk,
				};
			});

			logger.debug(
				`Processed filter params: ${JSON.stringify(
					exactMatchFilterParams,
				)}`,
			);
			return Object.keys(exactMatchFilterParams).length > 0
				? { ...exactMatchFilterParams }
				: null;
		} catch (error) {
			logger.error(
				`Error processing exact match filter: ${error.message}`,
			);
			return null;
		}
	},
);
