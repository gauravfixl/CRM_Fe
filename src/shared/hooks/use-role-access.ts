"use client";

import { useMemo, useCallback } from "react";
import { useAuthStore, Permission } from "@/lib/useAuthStore";
import {
  PermissionRequirement,
  SIDEBAR_GROUP_PERMISSIONS,
  SIDEBAR_ITEM_PERMISSIONS,
  PAGE_ROUTE_PERMISSIONS,
} from "@/shared/utils/module-permission-map";

/**
 * Core RBAC hook that provides permission checking utilities
 * based on the user's permissions stored in the auth store.
 */
export function useRoleAccess() {
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = useAuthStore((state) => state.userRole);

  const isAdminRole = useCallback(
    (role: string | null): boolean => {
      if (!role) return false;
      return [
        "SuperAdmin", "OrgOwner", "OrgAdmin",
        "admin", "ADMIN", "SUB_ADMIN",
      ].includes(role);
    },
    []
  );

  /**
   * Check if user has at least one required permission from a list of requirements.
   * Requirements use OR logic: if the user matches ANY requirement, access is granted.
   */
  const hasAnyPermission = useCallback(
    (requirements: PermissionRequirement[]): boolean => {
      if (!requirements || requirements.length === 0) return true;
      if (isAdminRole(userRole)) return true;
      if (!permissions || permissions.length === 0) return false;

      return requirements.some((req) => {
        const userModule = permissions.find(
          (p: Permission) => p.module === req.module
        );
        if (!userModule) return false;
        return req.actions.some((action) =>
          userModule.actions.includes(action)
        );
      });
    },
    [permissions, userRole, isAdminRole]
  );

  const canAccessSidebarGroup = useCallback(
    (groupTitle: string): boolean => {
      const requirements = SIDEBAR_GROUP_PERMISSIONS[groupTitle];
      if (!requirements) return true;
      return hasAnyPermission(requirements);
    },
    [hasAnyPermission]
  );

  const canAccessSidebarItem = useCallback(
    (itemTitle: string): boolean => {
      const requirements = SIDEBAR_ITEM_PERMISSIONS[itemTitle];
      if (!requirements) return true;
      return hasAnyPermission(requirements);
    },
    [hasAnyPermission]
  );

  const canAccessPage = useCallback(
    (pathname: string): boolean => {
      if (isAdminRole(userRole)) return true;

      // Strip org prefix: /orgName/modules/crm/leads -> /modules/crm/leads
      const pathWithoutOrg = pathname.replace(/^\/[^/]+/, "");

      let bestMatch = "";
      let matchedRequirements: PermissionRequirement[] | null = null;

      for (const [route, requirements] of Object.entries(PAGE_ROUTE_PERMISSIONS)) {
        if (pathWithoutOrg.startsWith(route) && route.length > bestMatch.length) {
          bestMatch = route;
          matchedRequirements = requirements;
        }
      }

      if (!matchedRequirements) return true;
      return hasAnyPermission(matchedRequirements);
    },
    [hasAnyPermission, userRole, isAdminRole]
  );

  const filterSidebarGroups = useCallback(
    <T extends { title: string; items: Array<{ title: string }> }>(
      groups: T[]
    ): T[] => {
      return groups
        .filter((group) => canAccessSidebarGroup(group.title))
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            canAccessSidebarItem(item.title)
          ),
        }))
        .filter((group) => {
          return (
            group.items.length > 0 ||
            !SIDEBAR_GROUP_PERMISSIONS[group.title]?.length
          );
        });
    },
    [canAccessSidebarGroup, canAccessSidebarItem]
  );

  const checkPermission = useCallback(
    (module: string, action: string): boolean => {
      if (isAdminRole(userRole)) return true;
      if (!permissions || permissions.length === 0) return false;
      const userModule = permissions.find(
        (p: Permission) => p.module === module
      );
      return userModule ? userModule.actions.includes(action) : false;
    },
    [permissions, userRole, isAdminRole]
  );

  const accessSummary = useMemo(() => {
    return {
      role: userRole,
      permissionCount: permissions?.length || 0,
      isAdmin: isAdminRole(userRole),
      modules: permissions?.map((p: Permission) => p.module) || [],
    };
  }, [permissions, userRole, isAdminRole]);

  return {
    hasAnyPermission,
    canAccessSidebarGroup,
    canAccessSidebarItem,
    canAccessPage,
    filterSidebarGroups,
    checkPermission,
    accessSummary,
    permissions,
    userRole,
  };
}
