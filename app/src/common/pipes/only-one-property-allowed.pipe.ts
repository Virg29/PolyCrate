import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OnlyOneAllowedPropertyValidationPipe implements PipeTransform {
	private readonly accessorsGroups: string[][] = [];
	constructor(...properties: string[][]) {
		this.accessorsGroups.push(...properties);
	}

	// todo: allow to provide dot notation with arrays
	transform(value: any, metadata: ArgumentMetadata) {
		this.accessorsGroups.forEach((acessorsGroup) => {
			const valuesByAccessors: any[] = [];

			acessorsGroup.forEach((accessor) => {
				try {
					valuesByAccessors.push(eval(`value.${accessor}`));
				} catch (error) {
					if (error instanceof TypeError) {
						valuesByAccessors.push(null);
					}
				}
			});

			if (valuesByAccessors.filter((value) => value != null).length != 1)
				throw new BadRequestException({
					message: `only one value of ${acessorsGroup} at the same time allowed`,
				});
		});

		return value;
	}
}
