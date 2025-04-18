import type { Role, Module, Permission } from './index';

export interface AddUserFormState {
  name: string;
  email: string;
  password: string;
  role: Role;
  permissions: Record<Module, Record<Permission, boolean>>;
  errors: string[];
}

export interface RoleAssignmentFormState {
  role: Role;
  permissions: Record<Module, Record<Permission, boolean>>;
  errors: string[];
}