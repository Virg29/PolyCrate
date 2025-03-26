import { ApiProperty } from '@nestjs/swagger';

export class UserItemDto {
	readonly id: string;
	readonly role_id: string;
	readonly name: string;
	readonly email: string;
	readonly password: string;
}

export class GetAllCreatedUsersDto {
	@ApiProperty({ type: [UserItemDto] })
	readonly list: UserItemDto[];
	readonly total: number;
}
