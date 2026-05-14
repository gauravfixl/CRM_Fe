"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Globe,
  Fingerprint,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

export default function SecurityOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const orgName = (params?.orgName as string) || "";

  const securityAlerts = [
    {
      title: "Multiple failed logins",
      user: "j.smith@fixl.com",
      time: "2 mins ago",
      severity: "High",
      badgeClass: "bg-red-50 text-red-600",
    },
    {
      title: "New IP detected",
      user: "Admin (S. Miller)",
      time: "15 mins ago",
      severity: "Medium",
      badgeClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "MFA disabled for guest",
      user: "v.kumar@external.com",
      time: "1 hour ago",
      severity: "Low",
      badgeClass: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Security Overview</h1>
        <p className="text-xs text-gray-600 mt-1">
          System-wide security posture, active threats, and authentication health monitoring.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Security Score - Primary Gradient */}
        <button
          type="button"
          onClick={() => router.push(`/${orgName}/system-health`)}
          className="bg-gradient-to-r from-primary/70 to-primary text-white p-4 rounded-none border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs opacity-80">Security Score</p>
              <p className="text-white text-xl font-semibold mt-1">82/100</p>
              <p className="text-white text-[10px] mt-1">Compliance: Excellent</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* Active Sessions */}
        <button
          type="button"
          onClick={() => router.push(`/${orgName}/activity-logs`)}
          className="bg-white border p-4 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Active Sessions</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">248</p>
              <p className="text-gray-500 text-[10px] mt-1">Currently authenticated</p>
            </div>
            <Users className="w-5 h-5 text-primary" />
          </div>
        </button>

        {/* MFA Adoption */}
        <button
          type="button"
          onClick={() => router.push(`/${orgName}/security/mfa`)}
          className="bg-white border p-4 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">MFA Adoption</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">94%</p>
              <p className="text-green-600 text-[10px] mt-1">Enforced globally</p>
            </div>
            <Fingerprint className="w-5 h-5 text-primary" />
          </div>
        </button>

        {/* Blocked IPs */}
        <button
          type="button"
          onClick={() => router.push(`/${orgName}/security/ip-restrictions`)}
          className="bg-white border p-4 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Blocked IPs</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">1,204</p>
              <p className="text-gray-500 text-[10px] mt-1">Threats filtered</p>
            </div>
            <Globe className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white border p-4 rounded-none shadow-md">
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-gray-900">Recent Alerts</p>
          <Button
            variant="link"
            className="text-primary text-xs p-0 h-auto font-medium"
            onClick={() => showSuccess("Viewing all security alerts")}
          >
            View all <ChevronRight size={14} />
          </Button>
        </div>

        <div className="space-y-3">
          {securityAlerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-none hover:bg-white transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500">{alert.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{alert.time}</span>
                <Badge
                  className={`${alert.badgeClass} border-none rounded-none text-[10px] font-medium px-2 py-0.5`}
                >
                  {alert.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border p-4 rounded-none shadow-md">
        <p className="text-base font-medium text-gray-900 mb-4">Quick Actions</p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-none text-sm font-medium"
          >
            Review policies
          </Button>
          <Button
            className="rounded-none bg-primary hover:bg-primary/90 text-white text-sm font-medium"
            onClick={() => showSuccess("MFA enforcement has been applied globally.")}
          >
            Enforce MFA
          </Button>
        </div>
      </div>
    </div>
  );
}
