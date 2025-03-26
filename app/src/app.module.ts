import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import applicationConfig from './common/config/config';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/user.module';
import { DebugModule } from './debug/debug.module';
import { FeedModule } from './feed/feed.module';
import { VersionsModule } from './versions/versions.module';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true, load: [applicationConfig] }),
		ScheduleModule.forRoot(),
		HealthcheckModule,
		DebugModule,
		FeedModule,
		VersionsModule,
		ProjectsModule,
		FilesModule,
	],
})
export class AppModule {
	constructor() {
		console.log('AppModule loaded');
		console.log(process.env);
	}
}
