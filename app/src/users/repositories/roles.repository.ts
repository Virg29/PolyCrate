import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { type Role } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findOneOrThrow(options): Promise<Role> {
		const role = await this.prisma.role.findUnique({ where: options });

		if (!role)
			throw new HttpException('Role not found', HttpStatus.NOT_FOUND);

		return role;
	}

	async findAll(): Promise<Role[]> {
		return this.prisma.role.findMany();
	}
}
