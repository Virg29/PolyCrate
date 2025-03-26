import {
	ExactMatchQuery,
	SearchQueryGeneral,
} from '../types/interfaces/search.interface';

function constructNestedConditionWith(
	field: string,
	value: Record<string, unknown>,
) {
	let obj = {};
	if (field.includes('.'))
		field.split('.').reduce((acc, chunk, index, array) => {
			acc[chunk] = {};
			if (index + 1 == array.length)
				acc[chunk] = {
					...value,
				};
			return acc[chunk];
		}, obj);
	else
		obj[field] = {
			...value,
		};
	return obj;
}

export function constructExactMatchObject(exactMatch: ExactMatchQuery) {
	let obj = {};
	Object.keys(exactMatch).forEach((key) => {
		obj = { ...obj, ...constructNestedConditionWith(key, exactMatch[key]) };
	});
	return obj;
}

export function constructSearchObject(search: SearchQueryGeneral) {
	const searchString = search?.query.split(' ').join(' & ');
	return search.fields.map((field) =>
		constructNestedConditionWith(field, {
			search: searchString,
		}),
	);
}
