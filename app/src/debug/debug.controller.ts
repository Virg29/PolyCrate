import { Controller, Get, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { AllowedRoles } from '../auth/allowed-roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Auth as AuthTypes } from '../common/types';
import { DebugService } from './debug.service';

@ApiTags('debug')
@Controller('debug')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DebugController {
	constructor(private readonly debugService: DebugService) {}

	@Get('/heapdump')
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	async heapdump(@Response() res: Res) {
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename="heap.heapdump"',
		});
		this.debugService.heapdump().pipe(res);
	}
}
