import { Injectable, Logger } from '@nestjs/common';

import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
	private readonly logger = new Logger(RolesService.name);

	constructor(private readonly rolesRepo: RolesRepository) {}

	async findAllRoles() {
		try {
			this.logger.log(`Invoked method findAllRoles`);

			const roles = await this.rolesRepo.findAll();

			this.logger.log(
				`Complete method findAllRoles: ${JSON.stringify({
					length: roles.length,
				})}`,
			);

			return roles;
		} catch (error) {
			this.logger.error(
				`Failed method findAllRoles: ${JSON.stringify({
					error,
				})}`,
			);
			throw error;
		}
	}
}
