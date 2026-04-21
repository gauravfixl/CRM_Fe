import { useAuthStore } from "@/lib/useAuthStore";
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks";

/**
 * Standalone helper to re-fetch the current user's permissions and update
 * the auth store. Call after context changes (firm switch, role edit,
 * user self-assignment) so the sidebar + dashboard gates reflect the
 * new permissions without a full page reload.
 */
export async function refreshPermissions(): Promise<boolean> {
  try {
    const state = useAuthStore.getState();
    const orgId = state.singleOrg?.orgId;
    const userRole = state.userRole;
    if (!orgId) return false;

    const response = await getAllRolesNPermissions({ orgId });
    if (!response?.data) return false;

    const roles = response.data.roles || response.data.data || response.data;
    if (!Array.isArray(roles)) return false;

    const currentRole = roles.find(
      (r: any) =>
        r.name === userRole || r.role === userRole || r.type === userRole
    );

    if (currentRole?.permissions && Array.isArray(currentRole.permissions)) {
      state.setPermissions(currentRole.permissions);
      return true;
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
      const merged = Object.entries(allPermissions).map(([module, actions]) => ({
        module,
        actions: Array.from(actions),
      }));
      if (merged.length > 0) {
        state.setPermissions(merged);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Error refreshing permissions:", err);
    return false;
  }
}
