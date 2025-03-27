import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateVersionDto } from '../dto/create-version.dto';

const ALLOWED_MIME_TYPES = [
	// Binary files
	'application/octet-stream',

	// Models
	'model/gltf-binary',
	'model/stl',
	'application/stl',
	'application/x-stl',
	'model/obj',
	'application/x-tgif',
	'application/x-blender',

	// Documents
	'text/markdown',
	'text/plain',
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

	// Excel files
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

	// Images
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
];

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
	transform(value: CreateVersionDto) {
		for (const file of value.files) {
			if (!ALLOWED_MIME_TYPES.includes(file.mime_type)) {
				throw new BadRequestException(
					`Invalid MIME type ${
						file.mime_type
					}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
				);
			}
		}
		return value;
	}
}
