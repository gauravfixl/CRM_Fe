"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks";

/**
 * Hook that auto-fetches the current user's permissions from the backend
 * on app load and stores them in the auth store.
 *
 * This hook should be called once in the app layout (e.g., app-layout.tsx).
 * It reads the user's role from their org membership and fetches
 * the associated permissions from the role-permission API.
 *
 * Backend APIs used:
 * - GET /role-permission/all  -> fetches all roles with permissions
 * - The user's role is already set in auth store during login/org-switch
 */
export function usePermissionLoader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.userRole);
  const permissions = useAuthStore((state) => state.permissions);
  const setPermissions = useAuthStore((state) => state.setPermissions);
  const singleOrg = useAuthStore((state) => state.singleOrg);
  const loaded = useRef(false);

  useEffect(() => {
    // Only fetch if authenticated and we haven't loaded permissions yet
    if (!isAuthenticated || !singleOrg?.orgId) return;
    if (loaded.current && permissions.length > 0) return;

    const fetchPermissions = async () => {
      try {
        const response = await getAllRolesNPermissions({
          orgId: singleOrg.orgId,
        });

        if (response?.data) {
          const roles = response.data.roles || response.data.data || response.data;

          if (Array.isArray(roles)) {
            // Find the user's current role in the roles list
            const currentRole = roles.find(
              (r: any) =>
                r.name === userRole ||
                r.role === userRole ||
                r.type === userRole
            );

            if (currentRole?.permissions && Array.isArray(currentRole.permissions)) {
              setPermissions(currentRole.permissions);
              loaded.current = true;
              return;
            }

            // If user is admin/owner, merge all org-level permissions
            const adminRoles = ["SuperAdmin", "OrgOwner", "OrgAdmin", "admin", "ADMIN", "SUB_ADMIN"];
            if (adminRoles.includes(userRole || "")) {
              const allPermissions: Record<string, Set<string>> = {};

              roles.forEach((role: any) => {
                const perms = role.permissions || [];
                perms.forEach((perm: any) => {
                  if (!allPermissions[perm.module]) {
                    allPermissions[perm.module] = new Set();
                  }
                  (perm.actions || []).forEach((action: string) => {
                    allPermissions[perm.module].add(action);
                  });
                });
              });

              const mergedPermissions = Object.entries(allPermissions).map(
                ([module, actions]) => ({
                  module,
                  actions: Array.from(actions),
                })
              );

              if (mergedPermissions.length > 0) {
                setPermissions(mergedPermissions);
                loaded.current = true;
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading permissions:", err);
      }
    };

    fetchPermissions();
  }, [isAuthenticated, singleOrg?.orgId, userRole, permissions.length, setPermissions]);

  return { permissionsLoaded: loaded.current || permissions.length > 0 };
}
