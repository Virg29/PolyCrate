import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RemoveAssignedRoleRequest {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	userId: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	roleId: string;
}
