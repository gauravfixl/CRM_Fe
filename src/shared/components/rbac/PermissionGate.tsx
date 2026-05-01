"use client";

import React, { ReactNode } from "react";
import { useHasPermission } from "@/shared/hooks/use-has-permission";
import { PermissionRequirement } from "@/shared/utils/module-permission-map";

interface BaseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SingleProps extends BaseProps {
  module: string;
  action: string;
  any?: never;
}

interface AnyProps extends BaseProps {
  any: PermissionRequirement[];
  module?: never;
  action?: never;
}

type PermissionGateProps = SingleProps | AnyProps;

/**
 * Conditionally renders children only when the current user holds the required permission(s).
 *
 * Single check:
 *   <PermissionGate module="lead" action="VIEW_LEAD"><LeadList/></PermissionGate>
 *
 * Any-of (OR semantics):
 *   <PermissionGate any={[{ module: "lead", actions: ["VIEW_LEAD"] }]}>...</PermissionGate>
 *
 * Admin roles always pass.
 */
export function PermissionGate(props: PermissionGateProps) {
  const can = useHasPermission();
  const allowed =
    "any" in props && props.any
      ? can.any(props.any)
      : can(props.module as string, props.action as string);

  if (!allowed) return <>{props.fallback ?? null}</>;
  return <>{props.children}</>;
}

/**
 * Disables (rather than hides) wrapped content when permission missing.
 * Useful for action buttons where you want to keep layout consistent.
 */
export function PermissionDisabled({
  module,
  action,
  children,
  reason = "You don't have permission for this action",
}: {
  module: string;
  action: string;
  children: ReactNode;
  reason?: string;
}) {
  const can = useHasPermission();
  const allowed = can(module, action);

  if (allowed) return <>{children}</>;
  return (
    <div title={reason} className="opacity-50 pointer-events-none">
      {children}
    </div>
  );
}
