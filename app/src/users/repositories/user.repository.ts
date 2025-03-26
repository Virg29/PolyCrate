import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { type Role, type User, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type * as Types from './type/user-repository.types';
import { PaginationArgs } from '../../common/types/prisma/types';

type SafeUserSelect = {
	id: true;
	name: true;
	email: true;
	role_id: true;
	created_at: true;
	updated_at: true;
	role?: {
		select: {
			id: true;
			name: true;
		};
	};
};

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	private readonly safeSelect: SafeUserSelect = {
		id: true,
		name: true,
		email: true,
		role_id: true,
		created_at: true,
		updated_at: true,
	};

	async createOrThrow(data: Types.Create): Promise<Omit<User, 'password'>> {
		const existing = await this.prisma.user.findUnique({
			where: { email: data.email },
			select: { id: true },
		});

		if (existing != null) {
			throw new HttpException(
				'User with this email already exists',
				HttpStatus.CONFLICT,
			);
		}

		return await this.prisma.user.create({
			data,
			select: this.safeSelect,
		});
	}

	async findOne(
		options: Types.FindWhere,
		includeRole = false,
		includePassword = false,
	): Promise<
		(Omit<User, 'password'> & { role?: Pick<Role, 'id' | 'name'> }) | null
	> {
		const select = includeRole
			? {
					...this.safeSelect,
					...(includePassword ? { password: true } : {}),
					role: {
						select: {
							id: true,
							name: true,
						},
					},
			  }
			: this.safeSelect;

		if (options.id) {
			return await this.prisma.user.findUnique({
				where: { id: options.id },
				select,
			});
		}
		return await this.prisma.user.findFirst({
			where: options,
			select,
		});
	}

	async find(options: Types.FindWhere): Promise<Omit<User, 'password'>[]> {
		return await this.prisma.user.findMany({
			where: options,
			select: this.safeSelect,
		});
	}

	async getAll(): Promise<Omit<User, 'password'>[]> {
		return this.prisma.user.findMany({
			select: this.safeSelect,
		});
	}

	async update(
		id: string,
		data: Partial<User>,
	): Promise<Omit<User, 'password'>> {
		return await this.prisma.user.update({
			where: { id },
			data,
			select: this.safeSelect,
		});
	}

	async findAllPaginated({
		where,
		orderBy,
		pagination,
	}: {
		where?: Prisma.UserWhereInput;
		orderBy?: { [key: string]: 'asc' | 'desc' };
		pagination: PaginationArgs;
	}) {
		const { page, pageSize } = pagination;
		const skip = page * pageSize;
		const take = pageSize === -1 ? undefined : pageSize;

		const [total, users] = await Promise.all([
			this.prisma.user.count({ where }),
			this.prisma.user.findMany({
				where,
				orderBy,
				skip: take ? skip : undefined,
				take,
				select: {
					...this.safeSelect,
					role: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
		]);

		return {
			list: users,
			total,
			page,
			pageSize: take || total,
		};
	}
}
