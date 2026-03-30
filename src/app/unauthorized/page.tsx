"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldX, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const attemptedPath = searchParams.get("path");

  const isExpired = reason === "session_expired";
  const isInvalid = reason === "invalid_session";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Error Code */}
        <p className="text-6xl font-bold text-red-500">401</p>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {isExpired
            ? "Session Expired"
            : isInvalid
              ? "Invalid Session"
              : "Unauthorized Access"}
        </h1>

        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
          {isExpired
            ? "Your session has expired. Please sign in again to continue."
            : isInvalid
              ? "Your session is invalid or corrupted. Please sign in again."
              : "You are not authorized to access this page. Please sign in with valid credentials to continue."}
        </p>

        {/* Attempted Path Info */}
        {attemptedPath && (
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-3 mx-auto max-w-sm">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Attempted to access:
            </p>
            <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300 truncate mt-1">
              {attemptedPath}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/auth/signin">
            <Button className="w-full sm:w-auto gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 pt-4">
          If you believe this is a mistake, contact your organization administrator.
        </p>
      </div>
    </div>
  );
}
