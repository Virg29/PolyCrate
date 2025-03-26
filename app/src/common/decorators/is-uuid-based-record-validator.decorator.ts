import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	IsObject,
	IsUUID,
} from 'class-validator';

export const IsUUIDBasedRecord = (validationOptions?: ValidationOptions) => {
	return function (object: unknown, propertyName: string) {
		registerDecorator({
			name: 'IsRecord',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: 'Wrong object format',
				...validationOptions,
			},
			validator: {
				validate(value: unknown, args: ValidationArguments) {
					if (Object.keys(value).length === 0) return true;

					const keys = Object.keys(value);
					const regExp = new RegExp(
						/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
					);

					return keys.every((key) => {
						if (typeof key !== 'string') return false;
						if (!regExp.test(key)) return false;

						if (
							typeof value[key] !== 'string' &&
							value[key] != null
						)
							return false;

						return true;
					});
				},
			},
		});
	};
};
