import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export interface Config {
	nest: NestConfig;
	cors: CorsConfig;
	swagger: SwaggerConfig;
	security: SecurityConfig;
}

export interface NestConfig {
	port: number;
}

export interface CorsConfig {
	enabled: boolean;
	config: CorsOptions;
}

export interface SwaggerConfig {
	enabled: boolean;
	title: string;
	description: string;
	version: string;
	path: string;
}

export interface SecurityConfig {
	jwtSecret: string;
	expiresIn: string;
	bcryptSaltOrRound: string | number;
}
