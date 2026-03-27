"use client";
import { ReactNode } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { hasPermission } from "@/utils/permission";

interface PermissionProps {
  module: string;
  action: string | string[];
  children: ReactNode;
  /** Optional: content to show when permission is denied */
  fallback?: ReactNode;
}

export const Permission = ({ module, action, children, fallback = null }: PermissionProps) => {
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = useAuthStore((state) => state.userRole);

  // Admin roles always have full access
  const adminRoles = ["SuperAdmin", "OrgOwner", "OrgAdmin", "admin", "ADMIN", "SUB_ADMIN"];
  if (adminRoles.includes(userRole || "")) {
    return <>{children}</>;
  }

  const hasPerm = Array.isArray(action)
    ? action.some((act) => hasPermission(permissions, module, act))
    : hasPermission(permissions, module, action);

  if (!hasPerm) return <>{fallback}</>;
  return <>{children}</>;
};
