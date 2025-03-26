import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthcheckService } from './healthcheck.service';

@Controller('healthcheck')
@ApiTags('healthcheck')
export class HealthcheckController {
	constructor(private service: HealthcheckService) {}

	@Get('/')
	async healthcheck() {
		const result = await this.service.checkHealth();
		if (!result) throw new HttpException('Something wrong', 500);
		return {};
	}
}
