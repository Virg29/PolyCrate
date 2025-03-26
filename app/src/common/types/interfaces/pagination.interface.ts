export interface PaginationQuery {
	page: number;
	pageSize?: number;
}

export interface ResponseWithPagination<T> {
	list: Array<T>;
	total: number;
	page: number;
	count: number;
}
