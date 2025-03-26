import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginationCombine = function () {
	return applyDecorators(
		ApiQuery({
			name: 'page',
			type: 'string',
			required: false,
		}),
		ApiQuery({
			name: 'pageSize',
			type: 'string',
			required: false,
			examples: {
				'5': {},
				'10': {},
				'-1': {
					description:
						'View all at one page, if unlimeted query allowed',
				},
			},
		}),
	);
};
