"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useRoleAccess } from "@/shared/hooks/use-role-access";
import { useAuthStore } from "@/lib/useAuthStore";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute wraps page content and checks if the current user
 * has permission to access the current route.
 *
 * If the user does not have permission, an "Access Denied" screen is shown
 * instead of the page content.
 *
 * Usage: Wrap in the org layout to protect all org pages.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const { canAccessPage, accessSummary } = useRoleAccess();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Don't block if not authenticated (auth redirects handle that)
  if (!isAuthenticated) return <>{children}</>;

  // Don't block dashboard - everyone can see it
  if (pathname?.endsWith("/dashboard")) return <>{children}</>;

  // Check page-level permission
  if (!canAccessPage(pathname || "")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-950">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Access Denied
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
          You don&apos;t have permission to access this page. Please contact your
          organization administrator to request access.
        </p>
        <div className="mt-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Your role: <span className="font-medium text-zinc-700 dark:text-zinc-300">{accessSummary.role || "Unknown"}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
