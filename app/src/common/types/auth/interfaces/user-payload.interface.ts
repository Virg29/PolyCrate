import type * as Enums from '../enums';

export interface UserPayload {
	id: string;
	name: string;
	role: Enums.UserRole;
}
