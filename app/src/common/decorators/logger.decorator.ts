import { Logger as NestLogger } from '@nestjs/common';

export function Logger(service: string) {
	const log = new NestLogger(service);

	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const targetMethod = descriptor.value;
		descriptor.value = function (...args) {
			log.log(`Invoked method ${propertyKey}; ${JSON.stringify([args])}`);
			return targetMethod.apply(this, args);
		};

		return descriptor;
	};
}
