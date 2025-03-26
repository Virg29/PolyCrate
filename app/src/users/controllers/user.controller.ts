import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

import { AllowedRoles } from 'src/auth/allowed-roles.decorator';
import { Auth as AuthTypes } from 'src/common/types';
import { ChangeRoleRequest } from '../dto/assignRole.request';
import { GetUserSafeDto } from '../dto/responses/get-user-safe.dto';
import { GetUsersPaginatedDto } from '../dto/responses/get-users-paginated.dto';
import { UsersService } from '../services/user.service';
import { SearchCombine } from '../../common/decorators/search-swagger-combine.decorator';
import { AllowUnlimitedQuery } from '../../common/decorators/allow-unlimited-query.decorator';
import { PaginationParams } from '../../common/decorators/pagination-params.decorator';
import { SearchParam } from '../../common/decorators/search-param.decorator';
import { ExactMatchParam } from '../../common/decorators/exact-match-param.decorator';
import { PaginationQuery } from '../../common/types/interfaces/pagination.interface';
import {
	SearchQueryGeneral,
	ExactMatchQuery,
} from '../../common/types/interfaces/search.interface';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/')
	@ApiBearerAuth()
	@ApiResponse({ type: GetUsersPaginatedDto, status: HttpStatus.OK })
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	@ApiOperation({
		summary: 'Get paginated list of users with search capabilities',
		description:
			'Retrieve a list of users with optional search by name or email. Use exact_match_filter for precise filtering.',
	})
	@SearchCombine(true)
	@AllowUnlimitedQuery()
	async getAllUsers(
		@PaginationParams() pagination: PaginationQuery,
		@SearchParam() search?: SearchQueryGeneral,
		@ExactMatchParam() exactMatch?: ExactMatchQuery,
	) {
		return this.usersService.getAllUsers(
			{ page: pagination.page, pageSize: pagination.pageSize },
			search,
			exactMatch,
		);
	}

	@Get('/:userId')
	@ApiBearerAuth()
	@ApiResponse({ type: GetUserSafeDto, status: HttpStatus.OK })
	@AllowedRoles(
		AuthTypes.Enum.UserRole.USER,
		AuthTypes.Enum.UserRole.MAKER,
		AuthTypes.Enum.UserRole.ADMIN,
	)
	@ApiOperation({
		summary: 'Use this to get details of a specific user',
	})
	async getUserSafe(@Param('userId') userId: string) {
		return await this.usersService.getUserSafe(userId);
	}

	@ApiOperation({
		summary: 'Give a role to a user',
	})
	@Post('/:userId/change-role')
	@AllowedRoles(AuthTypes.Enum.UserRole.ADMIN)
	async changeRole(
		@Param('userId') userId: string,
		@Body() data: ChangeRoleRequest,
	) {
		return await this.usersService.changeRole(userId, data.roleId);
	}
}
