import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesRepository } from 'src/users/repositories/roles.repository';
import { RolesService } from '../users/services/role.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';

@Module({
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
		}),
		ConfigModule,
		PrismaModule,
	],
	providers: [AuthService, PasswordService, RolesService, RolesRepository],
	controllers: [AuthController],
	exports: [AuthService, PasswordService],
})
export class AuthModule {}
