import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeRoleRequest {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	roleId: string;
}
