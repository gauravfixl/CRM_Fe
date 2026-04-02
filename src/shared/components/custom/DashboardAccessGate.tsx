"use client";

import { ReactNode } from "react";
import { useRoleAccess } from "@/shared/hooks/use-role-access";
import { useAuthStore } from "@/lib/useAuthStore";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DashboardAccessGateProps {
  children: ReactNode;
  /** The dashboard path to check access for, e.g. "/hrmcubicle", "/lead-management" */
  dashboardPath: string;
  /** Display name for the dashboard in the access denied message */
  dashboardName: string;
}

/**
 * DashboardAccessGate wraps an entire dashboard layout and checks if the user
 * has at least ONE relevant permission for that dashboard module.
 *
 * If the user doesn't have any permissions for the module, they see an
 * "Access Denied" screen instead of the dashboard.
 *
 * This is a LAYOUT-LEVEL gate — different from ProtectedRoute which is page-level.
 *
 * Usage: Wrap in dashboard layouts (HRM, Lead, Client, PM)
 * ```tsx
 * <DashboardAccessGate dashboardPath="/hrmcubicle" dashboardName="HRM">
 *   <Sidebar />
 *   <main>{children}</main>
 * </DashboardAccessGate>
 * ```
 */
export function DashboardAccessGate({
  children,
  dashboardPath,
  dashboardName,
}: DashboardAccessGateProps) {
  const { canAccessDashboard, accessSummary } = useRoleAccess();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Don't block if not authenticated (auth redirects handle that)
  if (!isAuthenticated) return <>{children}</>;

  // Admin roles always have access
  if (accessSummary.isAdmin) return <>{children}</>;

  // Check dashboard-level permission
  if (!canAccessDashboard(dashboardPath)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] gap-6 p-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">
            Access Denied
          </h2>
          <p className="text-sm text-zinc-500 max-w-md">
            You don&apos;t have permission to access the{" "}
            <span className="font-semibold text-zinc-700">{dashboardName}</span>{" "}
            dashboard. Please contact your organization administrator to request access.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="px-4 py-2 bg-zinc-100 rounded-lg">
            <p className="text-xs text-zinc-500">
              Your role:{" "}
              <span className="font-medium text-zinc-700">
                {accessSummary.role || "Unknown"}
              </span>
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
