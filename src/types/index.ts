export type Role = 'Admin' | 'Editor' | 'Viewer' | 'Custom';
export type Permission = 'Read' | 'Write' | 'Delete' | 'Share';
export type Module = 'Dashboard' | 'Reports' | 'Settings';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  permissions?: Record<Module, Record<Permission, boolean>>;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}