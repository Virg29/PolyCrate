import {
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type SecurityConfig } from 'src/common/config/config.interface';
import { type CreateUserRequest } from 'src/users/dto/createUser.request';

import { type Auth as AuthTypes } from '../../common/types';
import { RolesService } from '../../users/services/role.service';
import { UsersService } from '../../users/services/user.service';
import { PasswordService } from './password.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	private readonly config: SecurityConfig;

	constructor(
		private usersService: UsersService,
		private rolesService: RolesService,
		private jwtService: JwtService,
		private passwordService: PasswordService,
		private configService: ConfigService,
	) {
		this.config = this.configService.get<SecurityConfig>('security');
	}

	async register(data: CreateUserRequest) {
		const hashedPassword = await this.passwordService.hashPassword(
			data.password,
		);

		const preparedUser: CreateUserRequest = {
			name: data.name,
			email: data.email,
			password: hashedPassword,
			role_id: data.role_id,
		};
		return await this.usersService.createUser(preparedUser);
	}

	async signIn(email, password) {
		try {
			this.logger.log(
				`Invoked method signIn: ${JSON.stringify({ email })}`,
			);

			const user = (await this.usersService.findOneByEmail(
				email,
				true,
			)) as User & { role: Role };

			if (!user) {
				throw new UnauthorizedException('Incorrect credentials passed');
			}

			if (user?.password == null || user?.email == null) {
				throw new HttpException(
					'Missing Password or Email',
					HttpStatus.BAD_REQUEST,
				);
			}

			const passwordIsValid = await this.passwordService.validatePassword(
				password,
				user.password,
			);

			if (!passwordIsValid) {
				throw new UnauthorizedException('Incorrect credentials passed');
			}

			this.logger.log(`Found user: ${JSON.stringify({ found: user })}`);

			const payload: AuthTypes.Interfaces.UserPayload = {
				id: user.id,
				name: user.name,
				role: user.role.name as AuthTypes.Enum.UserRole,
			};

			const access_token = await this.jwtService.signAsync(payload, {
				secret: this.config.jwtSecret,
				expiresIn: this.config.expiresIn,
			});

			this.logger.log(
				`Completed method signIn: ${JSON.stringify({
					access_token,
					payload,
				})}`,
			);

			return {
				access_token,
				userInfo: payload,
			};
		} catch (error) {
			this.logger.error(
				`Failed method signIn: ${JSON.stringify({ error })}`,
			);
			throw error;
		}
	}
}
