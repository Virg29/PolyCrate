import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserRequest {
	@IsString()
	@IsNotEmpty()
	readonly name: string;

	@IsString()
	@IsEmail()
	@IsNotEmpty()
	readonly email: string;

	@IsString()
	@IsNotEmpty()
	readonly password: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	readonly role_id?: string;
}
