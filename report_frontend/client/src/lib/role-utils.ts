// Role utilities for managing user permissions and access control

export type UserRole = "admin" | "manager" | "developer";

export interface RolePermissions {
  canManageUsers: boolean;
  canManageRepositories: boolean;
  canGenerateReports: boolean;
  canViewAllReports: boolean;
  canViewBilling: boolean;
  canManageIntegrations: boolean;
  canViewAdminStats: boolean;
  canInviteUsers: boolean;
  canEditSettings: boolean;
  canDeleteReports: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canManageUsers: true,
    canManageRepositories: true,
    canGenerateReports: true,
    canViewAllReports: true,
    canViewBilling: true,
    canManageIntegrations: true,
    canViewAdminStats: true,
    canInviteUsers: true,
    canEditSettings: true,
    canDeleteReports: true,
  },
  manager: {
    canManageUsers: false,
    canManageRepositories: true,
    canGenerateReports: true,
    canViewAllReports: true,
    canViewBilling: false,
    canManageIntegrations: false,
    canViewAdminStats: false,
    canInviteUsers: true,
    canEditSettings: false,
    canDeleteReports: false,
  },
  developer: {
    canManageUsers: false,
    canManageRepositories: false,
    canGenerateReports: true,
    canViewAllReports: false,
    canViewBilling: false,
    canManageIntegrations: false,
    canViewAdminStats: false,
    canInviteUsers: false,
    canEditSettings: false,
    canDeleteReports: false,
  },
};

export function getUserPermissions(userRole: string): RolePermissions {
  // Safe fallback for unknown roles - default to developer permissions
  const role = (userRole as UserRole) || "developer";
  
  if (role in rolePermissions) {
    return rolePermissions[role];
  }
  
  // Fallback to developer permissions for unknown roles
  console.warn(`Unknown role '${userRole}', defaulting to developer permissions`);
  return rolePermissions.developer;
}

export function hasPermission(userRole: string, permission: keyof RolePermissions): boolean {
  const permissions = getUserPermissions(userRole);
  return permissions[permission];
}

export function filterDataByRole<T extends { visibility?: UserRole[]; roles?: UserRole[]; permissions?: (keyof RolePermissions)[] }>(
  data: T[],
  userRole: UserRole
): T[] {
  return data.filter(item => {
    // If item has visibility restrictions
    if (item.visibility && !item.visibility.includes(userRole)) {
      return false;
    }
    
    // If item has role restrictions
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    
    // If item requires specific permissions
    if (item.permissions) {
      return item.permissions.every(permission => hasPermission(userRole, permission));
    }
    
    return true;
  });
}

export function getRoleBadgeVariant(role: string): "default" | "secondary" | "destructive" | "outline" {
  switch (role) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "developer":
      return "secondary";
    default:
      return "outline";
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "manager":
      return "Manager";
    case "developer":
      return "Developer";
    default:
      return "Unknown";
  }
}

export function canAccessRoute(userRole: string, route: string): boolean {
  const permissions = getUserPermissions(userRole);
  
  switch (route) {
    case "/admin":
      return permissions.canManageUsers || permissions.canViewAdminStats;
    case "/billing":
      return permissions.canViewBilling;
    case "/settings":
      return permissions.canEditSettings;
    case "/repositories":
      return permissions.canManageRepositories;
    case "/reports":
    case "/dashboard":
    case "/teams":
    case "/developers":
      return true; // All roles can access these
    default:
      return true;
  }
}