import type { Role } from './types';

export const ALL_ROLES: Role[] = ['super_admin', 'owner', 'employee', 'customer'];

export const ROLE_PERMISSIONS = {
  super_admin: {
    manageStaff: true,
    manageMenu: true,
    manageSettings: true,
  },
  owner: {
    manageStaff: true,
    manageMenu: true,
    manageSettings: true,
  },
  employee: {
    manageStaff: false,
    manageMenu: true,
    manageSettings: false,
  },
  customer: {
    manageStaff: false,
    manageMenu: false,
    manageSettings: false,
  },
} as const;

export function isManagementRole(role: Role): boolean {
  return role !== 'customer';
}

export function requiresRestaurant(role: Role): boolean {
  return role === 'owner' || role === 'employee';
}

export function homeRouteForRole(role: Role | null): string {
  if (role === 'super_admin') return '/admin';
  if (role === 'owner') return '/dashboard';
  if (role === 'employee') return '/pos';
  if (role === 'customer') return '/';
  return '/onboarding';
}

export function canManageStaff(role: Role): boolean {
  return ROLE_PERMISSIONS[role].manageStaff;
}

export function canManageMenu(role: Role): boolean {
  return ROLE_PERMISSIONS[role].manageMenu;
}

export function canManageSettings(role: Role): boolean {
  return ROLE_PERMISSIONS[role].manageSettings;
}

export function roleLabel(role: Role): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'owner':
      return 'Restaurant Owner';
    case 'employee':
      return 'Employee';
    case 'customer':
      return 'Customer';
  }
}
