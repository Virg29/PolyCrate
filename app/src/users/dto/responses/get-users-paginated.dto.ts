import { ApiProperty } from '@nestjs/swagger';

export class UserPaginatedItemDto {
	@ApiProperty({ format: 'uuid' })
	readonly id: string;

	@ApiProperty({ format: 'uuid' })
	readonly role_id: string;

	@ApiProperty()
	readonly name: string;

	@ApiProperty()
	readonly email: string;

	@ApiProperty()
	readonly created_at: Date;

	@ApiProperty()
	readonly updated_at: Date;

	@ApiProperty()
	readonly role?: {
		id: string;
		name: string;
	};
}

export class GetUsersPaginatedDto {
	@ApiProperty({ type: [UserPaginatedItemDto] })
	readonly list: UserPaginatedItemDto[];

	@ApiProperty()
	readonly total: number;

	@ApiProperty()
	readonly page: number;

	@ApiProperty()
	readonly pageSize: number;
}
