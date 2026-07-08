import { describe, expect, it } from 'vitest';
import {
  ALL_ROLES,
  canManageMenu,
  canManageSettings,
  canManageStaff,
  homeRouteForRole,
  isManagementRole,
  requiresRestaurant,
  roleLabel,
  ROLE_PERMISSIONS,
} from '../roles';

describe('roles helpers', () => {
  it('declares all roles in priority order', () => {
    expect(ALL_ROLES).toEqual(['super_admin', 'owner', 'employee', 'customer']);
  });

  it('maps management roles correctly', () => {
    expect(isManagementRole('super_admin')).toBe(true);
    expect(isManagementRole('owner')).toBe(true);
    expect(isManagementRole('employee')).toBe(true);
    expect(isManagementRole('customer')).toBe(false);
  });

  it('identifies roles that require a restaurant tenancy', () => {
    expect(requiresRestaurant('super_admin')).toBe(false);
    expect(requiresRestaurant('owner')).toBe(true);
    expect(requiresRestaurant('employee')).toBe(true);
    expect(requiresRestaurant('customer')).toBe(false);
  });

  it('routes roles to their home destinations', () => {
    expect(homeRouteForRole('super_admin')).toBe('/admin');
    expect(homeRouteForRole('owner')).toBe('/dashboard');
    expect(homeRouteForRole('employee')).toBe('/pos');
    expect(homeRouteForRole('customer')).toBe('/');
    expect(homeRouteForRole(null)).toBe('/onboarding');
  });

  it('enforces staff permissions via the shared permission map', () => {
    expect(canManageStaff('super_admin')).toBe(ROLE_PERMISSIONS.super_admin.manageStaff);
    expect(canManageStaff('owner')).toBe(ROLE_PERMISSIONS.owner.manageStaff);
    expect(canManageStaff('employee')).toBe(ROLE_PERMISSIONS.employee.manageStaff);
    expect(canManageStaff('customer')).toBe(ROLE_PERMISSIONS.customer.manageStaff);
  });

  it('enforces menu permissions via the shared permission map', () => {
    expect(canManageMenu('super_admin')).toBe(ROLE_PERMISSIONS.super_admin.manageMenu);
    expect(canManageMenu('owner')).toBe(ROLE_PERMISSIONS.owner.manageMenu);
    expect(canManageMenu('employee')).toBe(ROLE_PERMISSIONS.employee.manageMenu);
    expect(canManageMenu('customer')).toBe(ROLE_PERMISSIONS.customer.manageMenu);
  });

  it('enforces settings permissions via the shared permission map', () => {
    expect(canManageSettings('super_admin')).toBe(ROLE_PERMISSIONS.super_admin.manageSettings);
    expect(canManageSettings('owner')).toBe(ROLE_PERMISSIONS.owner.manageSettings);
    expect(canManageSettings('employee')).toBe(ROLE_PERMISSIONS.employee.manageSettings);
    expect(canManageSettings('customer')).toBe(ROLE_PERMISSIONS.customer.manageSettings);
  });

  it('returns human-friendly labels for every role', () => {
    expect(roleLabel('super_admin')).toBe('Super Admin');
    expect(roleLabel('owner')).toBe('Restaurant Owner');
    expect(roleLabel('employee')).toBe('Employee');
    expect(roleLabel('customer')).toBe('Customer');
  });
});
