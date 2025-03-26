import { ApiProperty } from '@nestjs/swagger';

export class RoleItemDto {
	@ApiProperty({ type: 'string', format: 'uuid' })
	readonly id: string;
	readonly name: string;
}

export class FindAllRolesDto {
	@ApiProperty({ type: [RoleItemDto] })
	readonly list: RoleItemDto[];
	readonly total: number;
}
