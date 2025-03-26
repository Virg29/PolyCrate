import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from '@nestjs/common';
import { type Role, type User, Prisma } from '@prisma/client';

import { Auth } from '../../common/types';
import { type CreateUserRequest } from '../dto/createUser.request';
import { RolesRepository } from '../repositories/roles.repository';
import { UserRepository } from '../repositories/user.repository';
import { GetUserSafeDto } from '../dto/responses/get-user-safe.dto';
import { PaginationArgs } from '../../common/types/prisma/types';
import {
	SearchQueryGeneral,
	ExactMatchQuery,
} from '../../common/types/interfaces/search.interface';
import {
	GetUsersPaginatedDto,
	UserPaginatedItemDto,
} from '../dto/responses/get-users-paginated.dto';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(
		private readonly usersRepository: UserRepository,
		private readonly rolesRepository: RolesRepository,
	) {}

	async getAllUsers(
		pagination: PaginationArgs,
		search?: SearchQueryGeneral | null,
		exactMatch?: ExactMatchQuery | null,
	): Promise<GetUsersPaginatedDto> {
		let where: Prisma.UserWhereInput = {};

		if (search?.query) {
			where = {
				OR: search.fields.map((field) => ({
					[field]: {
						contains: search.query,
						mode: 'insensitive',
					},
				})),
			};
		}

		if (exactMatch) {
			where = {
				...where,
				...exactMatch,
			};
		}

		const orderBy = search?.sort
			? {
					[search.fields[0] || 'created_at']: search.sort,
			  }
			: {
					created_at: 'desc' as const,
			  };

		const { list, total, page, pageSize } =
			await this.usersRepository.findAllPaginated({
				where,
				orderBy,
				pagination,
			});

		const safeList = list.map((user) => {
			return user as UserPaginatedItemDto;
		});

		return {
			list: safeList,
			total,
			page,
			pageSize,
		};
	}

	async createUser(
		user: CreateUserRequest,
		authUser?: Auth.Interfaces.UserPayload,
	): Promise<GetUserSafeDto> {
		let role: Role = null;
		if (user.role_id == null)
			role = await this.rolesRepository.findOneOrThrow({
				name: Auth.Enum.UserRole.USER,
			});
		if (user.role_id)
			role = await this.rolesRepository.findOneOrThrow({
				id: user.role_id,
			});

		const userCreated = await this.usersRepository.createOrThrow({
			name: user.name,
			email: user.email,
			password: user.password,
			created_by: authUser?.id,
			role_id: role.id,
		});

		return userCreated;
	}

	async findOneByEmail(
		email: string,
		unsafe: boolean = false,
	): Promise<
		(Omit<User, 'password'> | User) & { role?: Pick<Role, 'id' | 'name'> }
	> {
		const userWithRole = await this.usersRepository.findOne(
			{ email },
			true,
			unsafe,
		);

		if (!userWithRole) return undefined;

		return userWithRole;
	}

	async changeRole(userId: string, roleId: string): Promise<GetUserSafeDto> {
		const [foundUser, foundRole] = await Promise.all([
			this.usersRepository.findOne({ id: userId }),
			this.rolesRepository.findOneOrThrow({ id: roleId }),
		]);

		if (!foundRole || !foundUser) {
			throw new BadRequestException('Data not found');
		}

		const updatedUser = await this.usersRepository.update(userId, {
			role_id: roleId,
		});
		return updatedUser;
	}

	async getUserSafe(userId: string): Promise<GetUserSafeDto> {
		const foundUser = await this.usersRepository.findOne({ id: userId });
		if (foundUser == null)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		return foundUser;
	}
}
