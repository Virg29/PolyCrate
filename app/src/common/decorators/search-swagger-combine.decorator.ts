import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const SearchCombine = function (withExactMatch?: boolean) {
	const decorators = [
		ApiQuery({
			name: 'fields',
			type: 'string',
			example: 'public_name;abbreviation_name',
			required: false,
		}),
		ApiQuery({
			name: 'search',
			type: 'string',
			example: 'Some search query string',
			required: false,
		}),
		ApiQuery({
			name: 'sort',
			type: 'string',
			schema: { default: 'desc', enum: ['desc', 'asc'] },
			required: false,
		}),
		...(withExactMatch
			? [
					ApiQuery({
						name: 'exact_match_filter',
						type: 'string',
						examples: {
							'public_name:Alba': {
								description:
									'Select models with public_name="Alba"',
							},
							'id_collection!:uuid_': {
								description:
									'Select models with id_collection not equals "uuid_"',
							},
							'type.name[]Slab,Barn': {
								description:
									'Select models with type:{name} in list ["Slab","Barn"]',
							},
							'id_color![]uuid1_,uuid2_': {
								description:
									'Select models with id_color NOT in list ["uuid1_","uuid2_"]',
							},
						},
						required: false,
					}),
			  ]
			: []),
	];
	return applyDecorators(...decorators);
};
