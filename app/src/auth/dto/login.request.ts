import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
	@ApiProperty({ required: true })
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ required: true })
	@IsString()
	@IsNotEmpty()
	password: string;
}
