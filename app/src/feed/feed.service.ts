import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationArgs } from '../common/types/prisma/types';
import {
	SearchQueryGeneral,
	ExactMatchQuery,
} from '../common/types/interfaces/search.interface';
import { constructSearchObject } from '../common/utils/search-utils';

@Injectable()
export class FeedService {
	constructor(private prisma: PrismaService) {}

	async getProjects(
		pagination: PaginationArgs,
		search?: SearchQueryGeneral | null,
		exactMatch?: ExactMatchQuery | null,
	) {
		const searchFields = ['name', 'description'];
		const searchQuery = search
			? {
					OR: constructSearchObject({
						...search,
						fields: search.fields.length
							? search.fields
							: searchFields,
					}),
			  }
			: {};

		const where = {
			...searchQuery,
			...exactMatch,
		};

		const orderBy = search?.sort
			? {
					[search.fields[0] || 'created_at']: search.sort,
			  }
			: {
					created_at: 'desc' as const,
			  };

		return this.prisma.project.paginate({
			where,
			orderBy,
			pagination,
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
					take: 1,
					include: {
						files: {
							select: {
								id: true,
								name: true,
								size: true,
								mime_type: true,
							},
						},
						_count: {
							select: {
								files: true,
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
	}
}
