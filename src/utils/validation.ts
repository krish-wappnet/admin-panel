import type { User } from '../types';

export const validatePermissions = (permissions: Record<'Dashboard' | 'Reports' | 'Settings', Record<'Read' | 'Write' | 'Delete' | 'Share', boolean>>): string[] => {
  const errors: string[] = [];
  Object.entries(permissions).forEach(([module, perms]) => {
    if (perms.Delete && !perms.Write) {
      errors.push(`${module}: Delete requires Write`);
    }
    if (perms.Share && !perms.Read) {
      errors.push(`${module}: Share requires Read`);
    }
  });
  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain a special character');
  return errors;
};

export const checkEmailUniqueness = (email: string, users: User[]): boolean => {
  return !users.some((user) => user.email.toLowerCase() === email.toLowerCase());
};