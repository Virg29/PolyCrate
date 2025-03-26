import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertProjectDto } from './dto/upsert-project.dto';

@Injectable()
export class ProjectsService {
	constructor(private prisma: PrismaService) {}

	async getProject(
		id: string,
		userId: string,
		protectFromGuest: boolean = false,
	) {
		const project = await this.prisma.project.findUnique({
			where: { id },
			include: {
				creator: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				collaborators: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				versions: {
					orderBy: {
						created_at: 'desc',
					},
					include: {
						_count: {
							select: {
								files: true,
							},
						},
						files: {
							select: {
								id: true,
								name: true,
								size: true,
								description: true,
								mime_type: true,
								created_at: true,
							},
						},
					},
				},
				_count: {
					select: {
						versions: true,
						collaborators: true,
					},
				},
			},
		});

		if (!project) {
			throw new NotFoundException('Project not found');
		}

		// Check if user has access (is creator or collaborator)
		const hasAccess =
			!protectFromGuest ||
			project.creator_id === userId ||
			project.collaborators.some((c) => c.id === userId);

		if (!hasAccess) {
			throw new ForbiddenException(
				'You do not have access to this project',
			);
		}

		return project;
	}

	async upsertProject(dto: UpsertProjectDto, userId: string) {
		// Check if project exists and user has access
		if (dto.id) {
			const existingProject = await this.prisma.project.findUnique({
				where: { id: dto.id },
				include: {
					collaborators: {
						select: { id: true },
					},
				},
			});

			if (existingProject) {
				// Check if user is creator or collaborator
				const hasAccess =
					existingProject.creator_id === userId ||
					existingProject.collaborators.some((c) => c.id === userId);

				if (!hasAccess) {
					throw new ForbiddenException(
						'You do not have access to modify this project',
					);
				}
			}
		}

		// Upsert project
		return this.prisma.project.upsert({
			where: {
				id: dto.id || '00000000-0000-0000-0000-000000000000', // Dummy ID for creation
			},
			create: {
				name: dto.name,
				description: dto.description,
				tags: dto.tags || [],
				creator_id: userId,
				collaborators: {
					connect: dto.collaboratorIds.map((id) => ({ id })),
				},
			},
			update: {
				name: dto.name,
				description: dto.description,
				tags: dto.tags || [],
				collaborators: {
					set: dto.collaboratorIds.map((id) => ({ id })),
				},
			},
			include: {
				creator: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				collaborators: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});
	}
}
