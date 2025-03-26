import {
	Injectable,
	ForbiddenException,
	ConflictException,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVersionDto, MAX_FILE_SIZE } from './dto/create-version.dto';
import { Prisma } from '@prisma/client';
import JSZip from 'jszip';

@Injectable()
export class VersionsService {
	constructor(private prisma: PrismaService) {}

	async createVersion(dto: CreateVersionDto, userId: string) {
		// Validate file sizes
		for (const file of dto.files) {
			const fileSize = Buffer.from(file.content, 'base64').length;
			if (fileSize > MAX_FILE_SIZE) {
				throw new BadRequestException(
					`File ${file.name} exceeds maximum size of ${
						MAX_FILE_SIZE / (1024 * 1024)
					}MB`,
				);
			}
		}

		// Check if user has access to the project
		const project = await this.prisma.project.findUnique({
			where: { id: dto.project_id },
			include: {
				collaborators: {
					select: { id: true },
				},
			},
		});

		if (!project) {
			throw new ForbiddenException('Project not found');
		}

		const hasAccess =
			project.creator_id === userId ||
			project.collaborators.some((c) => c.id === userId);

		if (!hasAccess) {
			throw new ForbiddenException(
				'You do not have access to this project',
			);
		}

		// Check if version tag already exists for this project
		const existingVersion = await this.prisma.version.findFirst({
			where: {
				project_id: dto.project_id,
				version_tag: dto.version_tag,
			},
		});

		if (existingVersion) {
			throw new ConflictException(
				`Version tag ${dto.version_tag} already exists in this project`,
			);
		}

		// Create version with files in a transaction
		return this.prisma.$transaction(async (tx) => {
			const version = await tx.version.create({
				data: {
					version_tag: dto.version_tag,
					description: dto.description,
					project_id: dto.project_id,
					files: {
						create: dto.files.map((file) => ({
							name: file.name,
							description: file.description,
							mime_type: file.mime_type,
							content: Buffer.from(file.content, 'base64'),
							size: Buffer.from(file.content, 'base64').length,
						})),
					},
				},
				include: {
					files: {
						select: {
							id: true,
							name: true,
							description: true,
							mime_type: true,
							size: true,
							created_at: true,
						},
					},
				},
			});

			return version;
		});
	}

	async createVersionZip(versionId: string, userId: string) {
		// Find version and check access
		const version = await this.prisma.version.findUnique({
			where: { id: versionId },
			include: {
				project: {
					select: {
						name: true,
						creator_id: true,
						collaborators: {
							select: { id: true },
						},
					},
				},
				files: true,
			},
		});

		if (!version) {
			throw new NotFoundException('Version not found');
		}

		// Check if user has access to the project
		const hasAccess =
			version.project.creator_id === userId ||
			version.project.collaborators.some((c) => c.id === userId);

		if (!hasAccess) {
			throw new ForbiddenException(
				'You do not have access to this version',
			);
		}

		// Create ZIP file
		const zip = JSZip();

		// Add files to ZIP
		for (const file of version.files) {
			zip.file(file.name, file.content);
		}

		// Generate ZIP buffer
		const zipBuffer = await zip.generateAsync({
			type: 'nodebuffer',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9,
			},
		});

		// Generate filename based on project and version
		const sanitizedProjectName = (version.project.name || 'project')
			.replace(/[^a-zA-Z0-9-_]/g, '-')
			.toLowerCase();
		const filename = `${sanitizedProjectName}-v${version.version_tag.replace(
			/[^a-zA-Z0-9-_.]/g,
			'-',
		)}.zip`;

		return { zipBuffer, filename };
	}
}
