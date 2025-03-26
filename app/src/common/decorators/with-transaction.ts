import { PrismaBaseService, PrismaService } from 'src/prisma/prisma.service';

export function WithTransaction(
	txParams?: Parameters<PrismaService['$transaction']>[1],
) {
	return function (
		target: any,
		propertyName: string,
		descriptor: TypedPropertyDescriptor<Function>,
	) {
		const method = descriptor.value!;

		descriptor.value = function () {
			if (this.prisma instanceof PrismaBaseService)
				return this.prisma.$transaction(async (tx) => {
					const result = method.apply(
						this,
						[...arguments].concat([tx]),
					);
					return result;
				}, txParams);
			if (this.prisma?._isMockObject)
				return method.apply(this, arguments);
			throw new Error(`${target} should have prisma in constructor`);
		};
	};
}
