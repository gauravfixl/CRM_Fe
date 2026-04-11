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
  ChevronRight,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import { showSuccess } from "@/utils/toast";
import SubHeader from "@/shared/components/custom/SubHeader";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

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
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Enabled":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Optional":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit">
      <SubHeader
        title="MFA / 2FA"
        breadcrumbItems={[
          { label: "Security", href: "#" },
          { label: "MFA / 2FA", href: "#" }
        ]}
        description="Manage multi-factor authentication settings and enforcement policies for your organization."
        rightControls={
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white">
            <span className="text-sm font-semibold tracking-wide">Global enforcement</span>
            <Switch
              checked={globalMFA}
              onCheckedChange={setGlobalMFA}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/20 border border-white/10 shadow-inner"
            />
          </div>
        }
      />

      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SmallCard className="border bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
            <SmallCardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">Enrollment rate</p>
                  <p className="text-xl font-bold mt-2 text-white">94.2%</p>
                  <p className="text-white/60 text-[10px] mt-1">Target: 100%</p>
                </div>
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden group">
            <SmallCardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Enrolled users</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white mt-2">1,204</p>
                  <p className="text-zinc-400 text-[10px] mt-1">Out of 1,280 total</p>
                </div>
                <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden group">
            <SmallCardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Grace period</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white mt-2">72 hours</p>
                  <p className="text-indigo-600 text-[10px] mt-1 font-bold">Expires in 3 days</p>
                </div>
                <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden group">
            <SmallCardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Recovery codes</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-white mt-2">Active</p>
                  <p className="text-emerald-600 text-[10px] mt-1 font-bold">10 codes per user</p>
                </div>
                <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </SmallCardContent>
          </SmallCard>
        </div>

        {/* Authentication Methods */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Authentication methods</CardTitle>
                <CardDescription className="text-xs font-medium text-zinc-400">Configure which verification methods are available for your organization.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {methods.map((method, index) => (
                <div
                  key={index}
                  className="px-8 py-6 flex items-center gap-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 transition-colors">
                    <method.icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-900 dark:text-white">
                      {method.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 font-medium">
                      {method.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge
                      className={`rounded-lg text-[10px] font-bold uppercase tracking-widest px-3 py-1 border shadow-sm ${getStatusColor(method.status)}`}
                    >
                      {method.status}
                    </Badge>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={() => toggleMethod(index)}
                      className="data-[state=checked]:bg-indigo-600 shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recovery Options */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Key size={28} />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-zinc-900 dark:text-white">
                  Backup recovery codes
                </div>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">
                  Generate single-use backup codes that users can use when their
                  primary method is unavailable. Recommended for all administrators.
                </p>
              </div>
            </div>
            <Button
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl px-8 h-12 font-bold text-xs tracking-widest border-0 shadow-lg"
              onClick={() =>
                showSuccess("Recovery codes configuration saved successfully")
              }
            >
              CONFIGURE CODES
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
