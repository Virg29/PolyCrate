import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SearchParam } from '../common/decorators/search-param.decorator';
import { ExactMatchParam } from '../common/decorators/exact-match-param.decorator';
import { PaginationParams } from '../common/decorators/pagination-params.decorator';
import { SearchCombine } from '../common/decorators/search-swagger-combine.decorator';
import { AllowUnlimitedQuery } from '../common/decorators/allow-unlimited-query.decorator';
import { PaginationQuery } from '../common/types/interfaces/pagination.interface';
import {
	SearchQueryGeneral,
	ExactMatchQuery,
} from '../common/types/interfaces/search.interface';
import { FeedService } from './feed.service';
import { AllowedRoles } from '../auth/allowed-roles.decorator';
import { Auth as AuthTypes } from '../common/types';

@ApiTags('feed')
@Controller('feed')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	@Get('projects')
	@AllowedRoles(
		AuthTypes.Enum.UserRole.USER,
		AuthTypes.Enum.UserRole.MAKER,
		AuthTypes.Enum.UserRole.ADMIN,
	)
	@ApiOperation({
		summary: 'Get paginated list of projects with search capabilities',
		description:
			'Retrieve a list of projects with optional search by name or description. Use exact_match_filter for precise filtering.',
	})
	@SearchCombine(true)
	@AllowUnlimitedQuery()
	async getProjects(
		@PaginationParams() pagination: PaginationQuery,
		@SearchParam() search?: SearchQueryGeneral,
		@ExactMatchParam() exactMatch?: ExactMatchQuery,
	) {
		return this.feedService.getProjects(
			{ page: pagination.page, pageSize: pagination.pageSize },
			search,
			exactMatch,
		);
	}
}
