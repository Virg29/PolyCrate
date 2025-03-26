import { type INestApplication, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
	PaginatedResponse,
	PaginationArgs,
} from '../../src/common/types/prisma/types';
import { IHealthCheckable } from 'src/common/types/interfaces/ihealthcheckable.interface';

//https://github.com/prisma/prisma/issues/18628
const ExtendedPrismaClient = class {
	constructor() {
		return new PrismaBaseService().withExtensions();
	}
} as new () => ReturnType<PrismaBaseService['withExtensions']>;

@Injectable()
// implements IHealthCheckable
export class PrismaService extends ExtendedPrismaClient {}

export class PrismaBaseService
	extends PrismaClient
	implements IHealthCheckable
{
	withExtensions() {
		return this.$extends({
			model: {
				$allModels: {
					async paginate<
						T,
						A extends Prisma.Args<T, 'findMany'> & {
							pagination?: PaginationArgs;
						},
					>(
						this: T,
						args: A,
					): Promise<
						PaginatedResponse<Prisma.Result<T, A, 'findMany'>>
					> {
						const context = Prisma.getExtensionContext(this);
						const { pagination, ...findManyArgs } = args;

						const total = await (context as any).count({
							where: findManyArgs.where,
						});

						const result = await (context as any).findMany({
							...findManyArgs,
							...(pagination.pageSize == -1
								? {}
								: {
										skip:
											pagination.page *
											pagination.pageSize,
										take: pagination.pageSize,
								  }),
						});

						return {
							total,
							count: result.length,
							page: pagination.page,
							lastPage:
								pagination.pageSize != -1
									? Math.ceil(total / pagination.pageSize)
									: pagination.page,
							list: result,
						};
					},
				},
			},
		});
	}

	async enableShutdownHooks(app: INestApplication) {
		this.$on('beforeExit', async () => {
			await app.close();
		});
	}

	async truncate() {
		let records = await this.$queryRawUnsafe<Array<any>>(
			`SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public'`,
		);
		records.forEach((record) => this.truncateTable(record['tablename']));
	}

	async truncateTable(tablename) {
		if (tablename === undefined || tablename === '_prisma_migrations') {
			return;
		}
		try {
			await this.$executeRawUnsafe(
				`TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
			);
		} catch (error) {
			console.log({ error });
		}
	}

	async resetSequences() {
		let results = await this.$queryRawUnsafe<Array<any>>(
			`SELECT c.relname
			FROM pg_class AS c
			JOIN pg_namespace AS n ON c.relnamespace = n.oid
			WHERE c.relkind = 'S'
			AND n.nspname = 'public'`,
		);
		for (const { record } of results) {
			// eslint-disable-next-line no-await-in-loop
			await this.$executeRawUnsafe(
				`ALTER SEQUENCE "public"."${record['relname']}" RESTART WITH 1;`,
			);
		}
	}

	async isHealthy(): Promise<boolean> {
		const client = new PrismaService();
		try {
			await this.$queryRaw`SELECT 1`;
		} catch (e) {
			return false;
		}
		return true;
	}
}
