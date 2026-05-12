"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { getMyEffectivePermissions } from "@/hooks/roleNPermissionHooks";

/**
 * One-shot bootstrap: pulls the current user's effective role + permissions
 * from the backend (GET /me/permissions, falls back to /auth/getprofile)
 * and writes them into useAuthStore so all downstream gates work.
 *
 * Usage: mount this once near the top of authenticated layouts (e.g. inside
 * the [orgName]/layout.tsx or a root provider).
 */
export function usePermissionBootstrap(enabled = true) {
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const setUserRole = useAuthStore((s) => s.setUserRole);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inflight = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!isAuthenticated && typeof window !== "undefined" && !localStorage.getItem("orgToken")) {
      // not signed in — skip
      return;
    }
    if (inflight.current) return;
    inflight.current = true;
    (async () => {
      try {
        const data = await getMyEffectivePermissions();
        if (!data) return;

        // Accept either { role, permissions } or { user: {...} } shape.
        const role: string | null =
          data.role || data?.user?.role || data?.orgUser?.role || null;
        const perms = Array.isArray(data.permissions)
          ? data.permissions
          : Array.isArray(data?.user?.permissions)
            ? data.user.permissions
            : Array.isArray(data?.orgUser?.permissions)
              ? data.orgUser.permissions
              : [];

        if (role) setUserRole(role);
        if (Array.isArray(perms)) {
          // Normalize shape: backend may send { module, actions } objects.
          const normalized = perms
            .filter((p) => p && p.module && Array.isArray(p.actions))
            .map((p) => ({ module: String(p.module), actions: p.actions.map(String) }));
          setPermissions(normalized);
        }
      } finally {
        inflight.current = false;
        setReady(true);
      }
    })();
  }, [enabled, isAuthenticated, setPermissions, setUserRole]);

  return { ready };
}
