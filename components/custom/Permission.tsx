"use client";
import { ReactNode } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { hasPermission } from "@/utils/permission";

interface PermissionProps {
  module: string;
  action: string | string[];
  children: ReactNode;
}

export const Permission = ({ module, action, children }: PermissionProps) => {
  const permissions = useAuthStore((state) => state.permissions);

  const hasPerm = Array.isArray(action)
    ? action.some((act) => hasPermission(permissions, module, act))
    : hasPermission(permissions, module, action);

  if (!hasPerm) return null;
  return <>{children}</>;
};

