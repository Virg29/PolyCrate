import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
	constructor(private prisma: PrismaService) {}

	async getFile(fileId: string, userId: string) {
		const file = await this.prisma.projectFile.findUnique({
			where: { id: fileId },
			include: {
				version: {
					include: {
						project: {
							include: {
								collaborators: {
									select: { id: true },
								},
							},
						},
					},
				},
			},
		});

		if (!file) {
			throw new NotFoundException('File not found');
		}

		// Check if user has access to the project
		const hasAccess =
			file.version.project.creator_id === userId ||
			file.version.project.collaborators.some((c) => c.id === userId);

		if (!hasAccess) {
			throw new ForbiddenException('You do not have access to this file');
		}

		return {
			content: file.content,
			name: file.name,
			mimeType: file.mime_type,
			size: file.size,
		};
	}
}
