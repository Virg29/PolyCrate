import { Controller, Put, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllowedRoles } from '../auth/allowed-roles.decorator';
import { Auth as AuthTypes } from '../common/types';
import { GetUser } from '../common/decorators/get-user.decoratos';
import { ProjectsService } from './projects.service';
import { UpsertProjectDto } from './dto/upsert-project.dto';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get(':id')
	@AllowedRoles(
		AuthTypes.Enum.UserRole.USER,
		AuthTypes.Enum.UserRole.MAKER,
		AuthTypes.Enum.UserRole.ADMIN,
	)
	@ApiOperation({
		summary: 'Get project by ID',
		description:
			'Get detailed project information including versions and collaborators, but excluding file contents',
	})
	async getProject(@Param('id') id: string, @GetUser('id') userId: string) {
		return this.projectsService.getProject(id, userId);
	}

	@Put()
	@AllowedRoles(AuthTypes.Enum.UserRole.MAKER, AuthTypes.Enum.UserRole.ADMIN)
	@ApiOperation({
		summary: 'Create or update a project',
		description:
			'Creates a new project if ID is not provided, updates existing project if ID exists',
	})
	async upsertProject(
		@Body() dto: UpsertProjectDto,
		@GetUser('id') userId: string,
	) {
		return this.projectsService.upsertProject(dto, userId);
	}
}
