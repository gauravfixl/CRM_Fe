// utils/permissions.ts
import { Permission } from "@/lib/useAuthStore";

export const hasPermission = (
  permissions: Permission[],
  module: string,
  action: string
) => {
  const mod = permissions?.find((p) => p.module === module);
  return mod ? mod.actions.includes(action) : false;
};
