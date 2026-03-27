"use client";

import React, { useState } from "react";
import {
  Smartphone,
  ShieldCheck,
  Fingerprint,
  Mail,
  Key,
  Users,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/utils/toast";

export default function MFAPage() {
  const [globalMFA, setGlobalMFA] = useState(true);
  const [methods, setMethods] = useState([
    {
      name: "Authenticator app (TOTP)",
      description: "Google authenticator, Microsoft authenticator, or Authy.",
      icon: Smartphone,
      status: "Mandatory",
      enabled: true,
    },
    {
      name: "Security keys (FIDO2)",
      description: "Hardware keys like YubiKey or Titan security keys.",
      icon: Key,
      status: "Recommended",
      enabled: true,
    },
    {
      name: "Push notifications",
      description: "One-tap approval via mobile enterprise app.",
      icon: Fingerprint,
      status: "Enabled",
      enabled: true,
    },
    {
      name: "Email OTP",
      description: "Six-digit code sent to registered business email.",
      icon: Mail,
      status: "Optional",
      enabled: false,
    },
  ]);

  const toggleMethod = (index: number) => {
    setMethods((prev) =>
      prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mandatory":
        return "bg-red-50 text-red-700 border-red-200";
      case "Recommended":
        return "bg-primary/10 text-primary border-primary/20";
      case "Enabled":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Optional":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mfa / 2fa</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage multi-factor authentication settings and enforcement policies
            for your organization.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-none px-4 py-3">
          <div className="text-sm text-gray-700 font-medium">
            Global enforcement
          </div>
          <Switch
            checked={globalMFA}
            onCheckedChange={setGlobalMFA}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrollment Rate */}
        <div className="bg-primary text-white rounded-none p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="opacity-80" />
            <span className="text-sm font-medium opacity-90">
              Enrollment rate
            </span>
          </div>
          <div className="text-3xl font-semibold">94.2%</div>
        </div>

        {/* Enrolled Users */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Enrolled users
            </span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">1,204</div>
          <p className="text-xs text-gray-400 mt-1">Out of 1,280</p>
        </div>

        {/* Grace Period */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Grace period
            </span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">72 hours</div>
          <p className="text-xs text-gray-400 mt-1">For new users</p>
        </div>

        {/* Recovery Codes */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Recovery codes
            </span>
          </div>
          <div className="text-3xl font-semibold text-gray-900">Active</div>
          <p className="text-xs text-emerald-600 mt-1">10 codes per user</p>
        </div>
      </div>

      {/* Authentication Methods */}
      <div className="bg-white border border-gray-200 rounded-none">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Authentication methods
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure which verification methods are available for your
            organization.
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {methods.map((method, index) => (
            <div
              key={index}
              className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-none bg-gray-100 flex items-center justify-center text-gray-600">
                <method.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {method.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {method.description}
                </div>
              </div>
              <Badge
                className={`rounded-none text-xs font-medium px-2.5 py-0.5 border ${getStatusColor(method.status)}`}
              >
                {method.status}
              </Badge>
              <Switch
                checked={method.enabled}
                onCheckedChange={() => toggleMethod(index)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Options */}
      <div className="bg-white border border-gray-200 rounded-none">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Recovery options
          </h2>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-none bg-gray-100 flex items-center justify-center text-gray-600">
              <Key size={20} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Backup recovery codes
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Generate single-use backup codes that users can use when their
                primary method is unavailable.
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-none border-gray-300 text-sm font-medium"
            onClick={() =>
              showSuccess("Recovery codes configuration saved successfully")
            }
          >
            Configure
          </Button>
        </div>
      </div>
    </div>
  );
}
