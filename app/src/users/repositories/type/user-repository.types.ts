import { type User } from '@prisma/client';

export interface Create {
	name: string;
	email: string;
	password: string;
	role_id: string;
	created_by?: string | null;
}

export type FindWhere = Partial<User>;
export type IncludeOptions = {
	role?: boolean;
};
