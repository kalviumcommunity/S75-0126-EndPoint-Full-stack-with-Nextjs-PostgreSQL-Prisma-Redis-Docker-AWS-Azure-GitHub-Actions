export const roles = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users', 'view_reports'] as const,
  editor: ['read', 'update', 'create'] as const,
  viewer: ['read'] as const,
} as const;

export type Role = keyof typeof roles;
export type Permission = typeof roles[Role][number];

// Define role hierarchy (optional) - higher roles inherit lower role permissions
export const roleHierarchy = {
  admin: 3,
  editor: 2,
  viewer: 1,
} as const;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return roles[role].includes(permission);
}

/**
 * Check if a role has any of the required permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all required permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Check if a role is higher than or equal to another role
 */
export function hasHigherOrEqualRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}