import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class UpsertProjectDto {
	@ApiProperty({
		description: 'Project ID - optional for creation, required for update',
	})
	@IsOptional()
	@IsUUID()
	id?: string;

	@ApiProperty({ description: 'Project name' })
	@IsString()
	name: string;

	@ApiProperty({ description: 'Project description in markdown format' })
	@IsString()
	description: string;

	@ApiProperty({ description: 'Array of project tags' })
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags?: string[];

	@ApiProperty({ description: 'Array of collaborator user IDs' })
	@IsArray()
	@IsUUID('4', { each: true })
	collaboratorIds: string[];
}
