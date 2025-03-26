import * as _ from 'lodash';

export function slugify(str: string, id?: string) {
	let result = _.kebabCase(str);
	if (id == null) return result;
	const splitedId = id.split('-');
	let idSlugPart = splitedId[0];
	if (idSlugPart.length > 8) idSlugPart = idSlugPart.slice(0, 8);
	return result.concat(`-${idSlugPart}`);
}
