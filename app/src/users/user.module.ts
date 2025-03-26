import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UsersController } from './controllers/user.controller';
import { RolesRepository } from './repositories/roles.repository';
import { UserRepository } from './repositories/user.repository';
import { RolesService } from './services/role.service';
import { UsersService } from './services/user.service';
import { RoleController } from './controllers/role.controller';

@Module({
	providers: [
		UsersService,
		RolesService,

		// repositories
		RolesRepository,
		UserRepository,
	],
	exports: [UsersService, RolesService],
	controllers: [UsersController, RoleController],
	imports: [PrismaModule],
})
export class UserModule {}
