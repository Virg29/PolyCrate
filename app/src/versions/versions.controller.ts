import {
	Controller,
	Post,
	Body,
	UseGuards,
	UsePipes,
	Get,
	Param,
	Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllowedRoles } from '../auth/allowed-roles.decorator';
import { Auth as AuthTypes } from '../common/types';
import { GetUser } from '../common/decorators/get-user.decoratos';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { FileTypeValidationPipe } from './pipes/file-type.validation.pipe';

@ApiTags('versions')
@Controller('versions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class VersionsController {
	constructor(private readonly versionsService: VersionsService) {}

	@Post()
	@AllowedRoles(AuthTypes.Enum.UserRole.MAKER, AuthTypes.Enum.UserRole.ADMIN)
	// @UsePipes(FileTypeValidationPipe)
	@ApiOperation({
		summary: 'Create a new version with files',
		description:
			'Creates a new version for a project with associated files. Versions cannot be modified or deleted once created.',
	})
	async createVersion(
		@Body(new FileTypeValidationPipe()) dto: CreateVersionDto,
		@GetUser('id') userId: string,
	) {
		return this.versionsService.createVersion(dto, userId);
	}

	@Get(':versionId/download')
	@AllowedRoles(
		AuthTypes.Enum.UserRole.USER,
		AuthTypes.Enum.UserRole.MAKER,
		AuthTypes.Enum.UserRole.ADMIN,
	)
	@ApiOperation({
		summary: 'Download all files from a version as ZIP',
		description:
			'Downloads all files associated with a specific version in a ZIP archive.',
	})
	async downloadVersionFiles(
		@Param('versionId') versionId: string,
		@GetUser('id') userId: string,
		@Res() res: Response,
	) {
		const { zipBuffer, filename } =
			await this.versionsService.createVersionZip(versionId, userId);

		// Encode the filename to handle special characters
		const encodedFilename = encodeURIComponent(filename);

		res.set({
			'Content-Type': 'application/zip',
			'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
			'Access-Control-Expose-Headers': 'Content-Disposition',
		});
		res.send(zipBuffer);
	}
}
