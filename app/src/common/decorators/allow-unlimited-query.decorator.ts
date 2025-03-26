import { SetMetadata } from '@nestjs/common';

export const UnlimitedQueryAllowed = 'unlimitedQueryAllowed';

export const AllowUnlimitedQuery = () =>
	SetMetadata(UnlimitedQueryAllowed, true);
