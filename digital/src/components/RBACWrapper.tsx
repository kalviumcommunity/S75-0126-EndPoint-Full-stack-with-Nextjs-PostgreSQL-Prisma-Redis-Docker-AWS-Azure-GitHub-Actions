'use client';

import { useAuth } from '@/hooks/useAuth';
import { hasPermission, hasAnyPermission, Role, Permission } from '@/config/roles';
import { ReactNode } from 'react';

interface RBACWrapperProps {
  allowedRoles?: Role[];
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * RBAC Wrapper Component
 * Conditionally renders content based on user role and permissions
 */
export default function RBACWrapper({
  allowedRoles = [],
  requiredPermissions = [],
  fallback = null,
  children,
}: RBACWrapperProps) {
  const { user } = useAuth();

  // If no roles or permissions are specified, render children by default
  if (allowedRoles.length === 0 && requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.length > 0 && user?.role && 
                         allowedRoles.includes(user.role as Role);

  // Check if user has any of the required permissions
  const hasRequiredPermission = requiredPermissions.length > 0 && user?.role &&
                                hasAnyPermission(user.role as Role, requiredPermissions);

  // Render children if user meets either condition
  if (hasAllowedRole || hasRequiredPermission) {
    return <>{children}</>;
  }

  // Otherwise, render fallback
  return <>{fallback}</>;
}

// Convenience components for common use cases
interface RoleBasedRenderProps {
  allowedRoles: Role[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders content only for specific roles
 */
export function RoleBasedRender({ allowedRoles, fallback, children }: RoleBasedRenderProps) {
  return (
    <RBACWrapper 
      allowedRoles={allowedRoles} 
      fallback={fallback}
    >
      {children}
    </RBACWrapper>
  );
}

interface PermissionBasedRenderProps {
  requiredPermissions: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders content only if user has specific permissions
 */
export function PermissionBasedRender({ requiredPermissions, fallback, children }: PermissionBasedRenderProps) {
  return (
    <RBACWrapper 
      requiredPermissions={requiredPermissions} 
      fallback={fallback}
    >
      {children}
    </RBACWrapper>
  );
}