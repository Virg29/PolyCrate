import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { HealthcheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';
import { DiscoveryModule } from '@nestjs/core';

@Module({
	providers: [HealthcheckService],
	controllers: [HealthcheckController],
	imports: [PrismaModule, DiscoveryModule],
})
export class HealthcheckModule {}
