"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks";

/**
 * Hook that auto-fetches the current user's permissions from the backend
 * on app load and stores them in the auth store.
 *
 * Call once in the app layout. Also exposes a `refresh()` function that can
 * be called after a context change (firm switch, role assignment, etc.) to
 * re-fetch permissions scoped to the new context.
 */
export function usePermissionLoader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.userRole);
  const permissions = useAuthStore((state) => state.permissions);
  const setPermissions = useAuthStore((state) => state.setPermissions);
  const singleOrg = useAuthStore((state) => state.singleOrg);
  const loaded = useRef(false);

  const fetchPermissions = useCallback(async () => {
    if (!isAuthenticated || !singleOrg?.orgId) return;
    try {
      const response = await getAllRolesNPermissions({ orgId: singleOrg.orgId });

      if (!response?.data) return;
      const roles = response.data.roles || response.data.data || response.data;
      if (!Array.isArray(roles)) return;

      const currentRole = roles.find(
        (r: any) =>
          r.name === userRole || r.role === userRole || r.type === userRole
      );

      if (currentRole?.permissions && Array.isArray(currentRole.permissions)) {
        setPermissions(currentRole.permissions);
        loaded.current = true;
        return;
      }

      const adminRoles = [
        "SuperAdmin",
        "OrgOwner",
        "OrgAdmin",
        "admin",
        "ADMIN",
        "SUB_ADMIN",
      ];
      if (adminRoles.includes(userRole || "")) {
        const allPermissions: Record<string, Set<string>> = {};
        roles.forEach((role: any) => {
          (role.permissions || []).forEach((perm: any) => {
            if (!allPermissions[perm.module]) {
              allPermissions[perm.module] = new Set();
            }
            (perm.actions || []).forEach((action: string) => {
              allPermissions[perm.module].add(action);
            });
          });
        });
        const mergedPermissions = Object.entries(allPermissions).map(
          ([module, actions]) => ({ module, actions: Array.from(actions) })
        );
        if (mergedPermissions.length > 0) {
          setPermissions(mergedPermissions);
          loaded.current = true;
        }
      }
    } catch (err) {
      console.error("Error loading permissions:", err);
    }
  }, [isAuthenticated, singleOrg?.orgId, userRole, setPermissions]);

  useEffect(() => {
    if (!isAuthenticated || !singleOrg?.orgId) return;
    if (loaded.current && permissions.length > 0) return;
    fetchPermissions();
  }, [isAuthenticated, singleOrg?.orgId, userRole, permissions.length, fetchPermissions]);

  const refresh = useCallback(async () => {
    loaded.current = false;
    await fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissionsLoaded: loaded.current || permissions.length > 0,
    refresh,
  };
}
