"use client";

import React, { useState, useMemo } from "react";
import {
  Laptop,
  Smartphone,
  Search,
  MoreVertical,
  RefreshCw,
  ShieldOff,
  Monitor,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/utils/toast";

interface Device {
  id: string;
  name: string;
  user: string;
  os: string;
  type: "Laptop" | "Mobile";
  status: "Managed" | "Unmanaged";
  lastSync: string;
  health: number;
}

const initialDevices: Device[] = [
  { id: "1", name: "MacBook Pro M2", user: "Sarah Miller", os: "macOS 14.2", type: "Laptop", status: "Managed", lastSync: "2 mins ago", health: 98 },
  { id: "2", name: "Dell XPS 15", user: "Robert Wilson", os: "Windows 11", type: "Laptop", status: "Managed", lastSync: "1 hour ago", health: 95 },
  { id: "3", name: "iPhone 15 Pro", user: "Elena Kostic", os: "iOS 17.1", type: "Mobile", status: "Unmanaged", lastSync: "5 mins ago", health: 70 },
  { id: "4", name: "Samsung S23", user: "James Chen", os: "Android 14", type: "Mobile", status: "Managed", lastSync: "12 hours ago", health: 100 },
];

function getHealthColor(health: number) {
  if (health >= 90) return "text-green-600";
  if (health >= 70) return "text-amber-500";
  return "text-red-500";
}

function getHealthBg(health: number) {
  if (health >= 90) return "bg-green-500";
  if (health >= 70) return "bg-amber-500";
  return "bg-red-500";
}

export default function DeviceTrustPage() {
  const [strictMode, setStrictMode] = useState(false);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Managed" | "Unmanaged">("All");

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.user.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || device.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [devices, search, statusFilter]);

  const totalDevices = devices.length;
  const managedCount = devices.filter((d) => d.status === "Managed").length;
  const unmanagedCount = devices.filter((d) => d.status === "Unmanaged").length;

  const handleSync = (device: Device) => {
    showSuccess(`${device.name} synced successfully`);
  };

  const handleRevoke = (device: Device) => {
    const confirmed = window.confirm(`Are you sure you want to revoke trust for ${device.name}?`);
    if (confirmed) {
      setDevices((prev) => prev.filter((d) => d.id !== device.id));
      showWarning(`Trust revoked for ${device.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Device trust</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage trusted devices across your organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Strict mode</span>
          <Switch checked={strictMode} onCheckedChange={setStrictMode} />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total devices */}
        <div className="bg-primary rounded-none p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total devices</p>
              <p className="text-2xl font-semibold mt-1">{totalDevices}</p>
            </div>
            <Monitor className="h-8 w-8 text-white/60" />
          </div>
        </div>

        {/* Managed */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Managed</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">{managedCount}</p>
            </div>
            <div className="h-10 w-10 rounded-none bg-green-50 flex items-center justify-center">
              <Laptop className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Unmanaged */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unmanaged</p>
              <p className="text-2xl font-semibold text-amber-500 mt-1">{unmanagedCount}</p>
            </div>
            <div className="h-10 w-10 rounded-none bg-amber-50 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Avg health */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. health</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">91%</p>
            </div>
            <div className="h-10 w-10 rounded-none bg-gray-50 flex items-center justify-center">
              <Activity className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by device name or user..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-9 rounded-none h-9 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Managed", "Unmanaged"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className="rounded-none text-sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Device name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Os</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Health %</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-none flex items-center justify-center">
                        {device.type === "Laptop" ? (
                          <Laptop className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Smartphone className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{device.name}</p>
                        <p className="text-xs text-gray-400">{device.lastSync}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{device.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{device.os}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`rounded-none text-xs font-medium ${
                        device.type === "Laptop"
                          ? "border-blue-200 text-blue-700 bg-blue-50"
                          : "border-purple-200 text-purple-700 bg-purple-50"
                      }`}
                    >
                      {device.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-none ${getHealthBg(device.health)}`} />
                      <span className={`text-sm font-medium ${getHealthColor(device.health)}`}>
                        {device.health}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`rounded-none text-xs font-medium border-none ${
                        device.status === "Managed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {device.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none min-w-[160px]">
                        <DropdownMenuItem
                          className="text-sm cursor-pointer gap-2"
                          onClick={() => handleSync(device)}
                        >
                          <RefreshCw className="h-4 w-4" />
                          Sync now
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-sm cursor-pointer gap-2 text-red-600 focus:text-red-600"
                          onClick={() => handleRevoke(device)}
                        >
                          <ShieldOff className="h-4 w-4" />
                          Revoke trust
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {filteredDevices.length} of {devices.length} devices
          </p>
        </div>
      </div>
    </div>
  );
}
