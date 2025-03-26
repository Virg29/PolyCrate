import { ApiProperty } from '@nestjs/swagger';

export class GetUserSafeDto {
	readonly id: string;
	readonly role_id: string;
	readonly name: string;
	readonly email: string;
}
