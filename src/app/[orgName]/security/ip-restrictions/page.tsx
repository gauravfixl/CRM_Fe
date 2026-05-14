"use client";

import React, { useState } from "react";
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldBan,
  Search,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { showSuccess, showWarning } from "@/utils/toast";

interface IpRule {
  id: string;
  range: string;
  label: string;
  type: "Whitelist" | "Blacklist";
  status: "Active" | "Blocked";
  addedOn: string;
}

const initialData: IpRule[] = [
  { id: "1", range: "115.124.98.0/24", label: "Mumbai HQ - Primary VPN", type: "Whitelist", status: "Active", addedOn: "Oct 12, 2024" },
  { id: "2", range: "203.0.113.42", label: "AWS Production", type: "Whitelist", status: "Active", addedOn: "Nov 01, 2024" },
  { id: "3", range: "45.12.8.201", label: "Brute force suspect", type: "Blacklist", status: "Blocked", addedOn: "Feb 10, 2025" },
  { id: "4", range: "10.0.0.0/8", label: "Internal network", type: "Whitelist", status: "Active", addedOn: "Jan 05, 2025" },
];

export default function IPRestrictionsPage() {
  const [ipList, setIpList] = useState<IpRule[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<IpRule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Whitelist" | "Blacklist">("All");

  // Form state
  const [formRange, setFormRange] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formType, setFormType] = useState<"Whitelist" | "Blacklist">("Whitelist");

  const openAddModal = () => {
    setEditingRule(null);
    setFormRange("");
    setFormLabel("");
    setFormType("Whitelist");
    setShowModal(true);
  };

  const openEditModal = (rule: IpRule) => {
    setEditingRule(rule);
    setFormRange(rule.range);
    setFormLabel(rule.label);
    setFormType(rule.type);
    setShowModal(true);
  };

  const handleSave = () => {
    const sanitizedRange = formRange.trim();
    const sanitizedLabel = formLabel.trim();
    
    // IP / CIDR Regex
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;

    if (!sanitizedRange) {
      showWarning("IP range is required");
      return;
    }
    if (!ipRegex.test(sanitizedRange)) {
      showWarning("Please enter a valid IP address or CIDR range");
      return;
    }

    if (!sanitizedLabel) {
      showWarning("Label is required");
      return;
    }
    if (/\d/.test(sanitizedLabel)) {
      showWarning("Label cannot contain numbers");
      return;
    }

    if (editingRule) {
      setIpList((prev) =>
        prev.map((ip) =>
          ip.id === editingRule.id
            ? { ...ip, range: formRange, label: formLabel, type: formType, status: formType === "Blacklist" ? "Blocked" : ip.status }
            : ip
        )
      );
      showSuccess("IP rule updated successfully");
    } else {
      const newRule: IpRule = {
        id: Date.now().toString(),
        range: formRange,
        label: formLabel,
        type: formType,
        status: formType === "Blacklist" ? "Blocked" : "Active",
        addedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      };
      setIpList((prev) => [...prev, newRule]);
      showSuccess("IP rule added successfully");
    }

    setShowModal(false);
  };

  const handleRemove = (rule: IpRule) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${rule.label}"?`);
    if (confirmed) {
      setIpList((prev) => prev.filter((ip) => ip.id !== rule.id));
      showSuccess("IP rule removed successfully");
    }
  };

  const handleToggleStatus = (id: string) => {
    setIpList((prev) =>
      prev.map((ip) => {
        if (ip.id !== id) return ip;
        const newStatus = ip.status === "Active" ? "Blocked" : "Active";
        return { ...ip, status: newStatus };
      })
    );
  };

  const filtered = ipList.filter((ip) => {
    const matchesSearch =
      ip.range.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || ip.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalRules = ipList.length;
  const whitelisted = ipList.filter((ip) => ip.type === "Whitelist").length;
  const blacklisted = ipList.filter((ip) => ip.type === "Blacklist").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ip restrictions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage whitelisted and blacklisted IP addresses to control access to your organization.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="rounded-none bg-primary hover:bg-primary/90 text-sm h-9 gap-2 px-4"
        >
          <Plus size={15} /> Add ip rule
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setFilterType("All")}
          className={`bg-primary rounded-none p-4 text-white text-left cursor-pointer transition-all hover:shadow-lg ${filterType === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/80">Total rules</p>
            <Globe size={18} className="text-white/60" />
          </div>
          <p className="text-2xl font-semibold mt-2">{totalRules}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterType("Whitelist")}
          className={`bg-white border border-gray-200 rounded-none p-4 text-left cursor-pointer transition-all hover:shadow-md ${filterType === "Whitelist" ? "ring-2 ring-green-500" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Whitelisted</p>
            <ShieldCheck size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-green-600 mt-2">{whitelisted}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilterType("Blacklist")}
          className={`bg-white border border-gray-200 rounded-none p-4 text-left cursor-pointer transition-all hover:shadow-md ${filterType === "Blacklist" ? "ring-2 ring-red-500" : ""}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Blacklisted</p>
            <ShieldBan size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-red-600 mt-2">{blacklisted}</p>
        </button>

        <div className="bg-white border border-gray-200 rounded-none p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Last blocked</p>
            <Clock size={18} className="text-gray-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">2 hours ago</p>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white border border-gray-200 rounded-none">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <Input
              placeholder="Search by ip or label..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none border-gray-200 h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Whitelist", "Blacklist"] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={`rounded-none h-9 text-sm ${
                  filterType === type
                    ? "bg-primary hover:bg-primary/90"
                    : "border-gray-200"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-xs font-medium text-gray-500">Ip range</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500">Label</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500">Added on</th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ip) => (
                <tr key={ip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-mono text-gray-900">{ip.range}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-700">{ip.label}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      className={`rounded-none text-xs font-medium px-2 py-0.5 border-none ${
                        ip.type === "Whitelist"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ip.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ip.status === "Active"}
                        onCheckedChange={() => handleToggleStatus(ip.id)}
                      />
                      <span className="text-sm text-gray-600">
                        {ip.status === "Active" ? "Active" : "Blocked"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-500">{ip.addedOn}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(ip)}
                        className="rounded-none h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/5"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(ip)}
                        className="rounded-none h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                    No ip rules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md rounded-none p-0 border border-gray-200">
          <DialogHeader className="px-5 py-4 border-b border-gray-100">
            <DialogTitle className="text-base font-semibold text-gray-900">
              {editingRule ? "Edit ip rule" : "Add ip rule"}
            </DialogTitle>
          </DialogHeader>

          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Ip range</Label>
              <Input
                placeholder="e.g., 192.168.1.0/24"
                value={formRange}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRange(e.target.value)}
                className="rounded-none border-gray-200 h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Label</Label>
              <Input
                placeholder="e.g., Office network"
                value={formLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormLabel(e.target.value)}
                className="rounded-none border-gray-200 h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Type</Label>
              <Select value={formType} onValueChange={(val: string) => setFormType(val as "Whitelist" | "Blacklist")}>
                <SelectTrigger className="rounded-none border-gray-200 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="Whitelist">Whitelist</SelectItem>
                  <SelectItem value="Blacklist">Blacklist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="px-5 py-4 border-t border-gray-100 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="rounded-none h-9 text-sm border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-none h-9 text-sm bg-primary hover:bg-primary/90"
            >
              {editingRule ? "Save changes" : "Add rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
