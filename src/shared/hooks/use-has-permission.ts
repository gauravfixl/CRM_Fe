"use client";

import { useCallback } from "react";
import { useAuthStore, Permission } from "@/lib/useAuthStore";
import {
  PermissionRequirement,
} from "@/shared/utils/module-permission-map";

const ADMIN_ROLES = new Set([
  "SuperAdmin",
  "OrgOwner",
  "OrgAdmin",
  "PlatformAdmin",
  "admin",
  "ADMIN",
]);

/**
 * Lightweight permission check hook for any component.
 *
 * Usage:
 *   const can = useHasPermission()
 *   if (can("lead", "VIEW_LEAD")) { ... }
 *   if (can.any([{ module: "lead", actions: ["VIEW_LEAD"] }])) { ... }
 *
 * Admin roles short-circuit to true so org owners always pass.
 */
export function useHasPermission() {
  const permissions = useAuthStore((s) => s.permissions);
  const userRole = useAuthStore((s) => s.userRole);

  const isAdmin = ADMIN_ROLES.has(userRole || "");

  const check = useCallback(
    (module: string, action: string): boolean => {
      if (isAdmin) return true;
      if (!permissions || permissions.length === 0) return false;
      const entry = permissions.find((p: Permission) => p.module === module);
      return Boolean(entry && entry.actions.includes(action));
    },
    [permissions, isAdmin]
  );

  const checkAny = useCallback(
    (requirements: PermissionRequirement[]): boolean => {
      if (isAdmin) return true;
      if (!requirements || requirements.length === 0) return true;
      if (!permissions || permissions.length === 0) return false;
      return requirements.some((req) => {
        const entry = permissions.find((p: Permission) => p.module === req.module);
        if (!entry) return false;
        return req.actions.some((a) => entry.actions.includes(a));
      });
    },
    [permissions, isAdmin]
  );

  // Make the function callable as `can(module, action)` AND offer `.any(...)` helper.
  const fn = check as typeof check & {
    any: typeof checkAny;
    isAdmin: boolean;
  };
  fn.any = checkAny;
  fn.isAdmin = isAdmin;
  return fn;
}
