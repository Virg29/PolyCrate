import {
	Body,
	Controller,
	ExecutionContext,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	Request,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserRequest } from 'src/users/dto/createUser.request';
import { RolesService } from '../users/services/role.service';

import { Auth as AuthTypes } from 'src/common/types';
import { LoginRequest } from './dto/login.request';
import { AuthGuard } from './guards/auth.guard';
import { AllowedRoles } from './allowed-roles.decorator';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private rolesService: RolesService
	) {}

	@ApiOperation({
		summary: 'Use this to register a new User with provided credentials',
	})
	@UseGuards(AuthGuard)
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	@Post('/register')
	async registerUser(@Body() data: CreateUserRequest) {
		//todo email verification
		return await this.authService.register(data);
	}

	@ApiOperation({
		summary:
			'Use this to login as a user and get a response with jwt token',
	})
	@HttpCode(HttpStatus.OK)
	@Post('/login')
	async signIn(@Body() data: LoginRequest) {
		return await this.authService.signIn(data.email, data.password);
	}

	@ApiOperation({
		summary: 'Use this to get a roles list of current user',
	})
	@UseGuards(AuthGuard)
	@AllowedRoles(AuthTypes.Enum.UserRole.USER)
	@HttpCode(HttpStatus.OK)
	@Get('/whoami')
	async whoami(@Request() req) {
		const { user } = req;
		return user;
	}

	@Get('settings')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	async getSettings() {
		// ...existing code...
	}

	@Get('quote-manager')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@AllowedRoles(AuthTypes.Enum.UserRole.USER)
	async getQuoteManagerSettings() {
		// ...existing code...
	}

	@ApiOperation({
		summary: 'Get all available roles',
		description: 'Returns a list of all available roles in the system'
	})
	@UseGuards(AuthGuard)
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	@ApiBearerAuth()
	@Get('/roles')
	async getRoles() {
		return await this.rolesService.findAllRoles();
	}
}
