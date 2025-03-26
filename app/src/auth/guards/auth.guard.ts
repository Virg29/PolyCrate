import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { type Request } from 'express';
import { type SecurityConfig } from 'src/common/config/config.interface';

import { type Auth as Types } from '../../common/types';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly config: SecurityConfig;

	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private configService: ConfigService,
	) {
		this.config = this.configService.get<SecurityConfig>('security');
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.config.jwtSecret,
			});

			// Get required roles if any
			const requiredRoles: string[] =
				this.reflector.getAllAndOverride<string[]>('roles', [
					context.getHandler(),
					context.getClass(),
				]) || [];

			// If roles are required, verify the user has one of them
			if (requiredRoles.length > 0) {
				const role: string | Types.Enum.UserRole = payload['role'];
				if (!role || !requiredRoles.includes(role)) {
					throw new UnauthorizedException();
				}
			}

			request['user'] = payload;
			request['role'] = payload['role'];
		} catch (e) {
			console.log(e);
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
