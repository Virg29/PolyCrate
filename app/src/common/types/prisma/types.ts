import { PrismaService } from 'src/prisma/prisma.service';
import { SearchQueryTyped } from '../interfaces/search.interface';

export type PrismaTXClient = Omit<
	PrismaService,
	| '$connect'
	| '$disconnect'
	| '$on'
	| '$transaction'
	| '$use'
	| 'enableShutdownHooks'
	| 'truncate'
	| 'truncateTable'
	| 'resetSequences'
	| '$extends'
	| 'withExtensions'
>;

export interface GeneralPrismaPayload<T, IncludeType, SelectType, WhereType> {
	include?: IncludeType;
	select?: SelectType;
	whereClause?: WhereType;
	search?: SearchQueryTyped<T>;
	pagination?: { skip: number; take: number };
}

export type PaginationArgs = {
	page: number;
	pageSize?: number;
};

export type PaginatedResponse<T> = {
	list: T;
	lastPage: number;
	count: number;
	page: number;
	total: number;
};

export type ArgsWithPagination<T> = T & { pagination: PaginationArgs; };
