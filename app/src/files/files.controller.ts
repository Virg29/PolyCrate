import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../common/decorators/get-user.decoratos';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowedRoles } from '../auth/allowed-roles.decorator';
import { Auth } from '../common/types';

@ApiTags('files')
@Controller('files')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get(':id/download')
	@AllowedRoles(
		Auth.Enum.UserRole.USER,
		Auth.Enum.UserRole.MAKER,
		Auth.Enum.UserRole.ADMIN,
	)
	@ApiOperation({
		summary: 'Download a file by ID',
		description:
			'Download a file if the user has access to the project it belongs to',
	})
	async downloadFile(
		@Param('id') id: string,
		@GetUser('id') userId: string,
		@Res() res: Response,
	) {
		const file = await this.filesService.getFile(id, userId);

		res.set({
			'Content-Type': file.mimeType,
			'Content-Disposition': `attachment; filename="${file.name}"`,
			'Content-Length': file.size,
		});

		res.send(file.content);
	}
}
