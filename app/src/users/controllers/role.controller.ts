import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/role.service';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	async findAll() {
		return this.rolesService.findAllRoles();
	}
}
