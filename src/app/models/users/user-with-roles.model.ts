import { RoleModel } from '../roles/role.model';

export interface UserWithRolesModel{
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    age: number;
    roles: string[];
}