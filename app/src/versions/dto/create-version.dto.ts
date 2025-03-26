import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsUUID,
	IsOptional,
	ValidateNested,
	ArrayMinSize,
	IsArray,
	Matches,
	MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export const ALLOWED_FILE_TYPES = [
	'MODEL',
	'INSTRUCTION',
	'IMAGE',
	'DOCUMENT',
] as const;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export class FileDto {
	@ApiProperty({ description: 'Name of the file' })
	@IsString()
	@Matches(/^[a-zA-Z0-9-_.\(\)]+$/, {
		message:
			'File name can only contain letters, numbers, hyphens, underscores, and dots',
	})
	@MaxLength(255)
	name: string;

	@ApiProperty({ description: 'Description of the file in markdown format' })
	@IsString()
	@MaxLength(10000)
	description: string;

	@ApiProperty({ description: 'MIME type of the file' })
	@IsString()
	@Matches(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-+.]+$/, {
		message: 'Invalid MIME type format',
	})
	mime_type: string;

	@ApiProperty({
		description: 'File content as base64 string',
		format: 'byte',
	})
	@IsString()
	@Matches(/^[A-Za-z0-9+/]*={0,2}$/, {
		message: 'Content must be a valid base64 string',
	})
	content: string;
}

export class CreateVersionDto {
	@ApiProperty({ description: 'Project ID this version belongs to' })
	@IsUUID()
	project_id: string;

	@ApiProperty({ description: 'Version tag' })
	@IsString()
	version_tag: string;

	@ApiProperty({
		description: 'Optional description/changelog for this version',
	})
	@IsOptional()
	@IsString()
	@MaxLength(10000)
	description?: string;

	@ApiProperty({
		description: 'Array of files to include in this version',
		type: [FileDto],
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => FileDto)
	files: FileDto[];
}
