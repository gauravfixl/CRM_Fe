"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Search,
  Plus,
  Save,
  Pencil,
  Trash2,
  Layers,
  Lock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { showSuccess, showWarning } from "@/utils/toast";

interface AccessRule {
  id: string;
  module: string;
  sensitive: string;
  group: string;
  accessType: string;
  restriction: string;
  status: string;
}

const MODULE_OPTIONS = ["HRM", "CRM", "Finance", "Admin", "Support"];
const ACCESS_TYPE_OPTIONS = ["Full Access", "Read Only", "Restricted"];
const RESTRICTION_OPTIONS = [
  "IP Bound",
  "MFA Required",
  "Approval Needed",
  "Global Gating",
];
const FILTER_OPTIONS = ["All", "Full Access", "Read Only", "Restricted"];

const initialRules: AccessRule[] = [
  {
    id: "1",
    module: "HRM",
    sensitive: "Salary data",
    group: "HR Admins",
    accessType: "Full Access",
    restriction: "IP bound",
    status: "Active",
  },
  {
    id: "2",
    module: "CRM",
    sensitive: "Client financials",
    group: "Sales Leads",
    accessType: "Read Only",
    restriction: "MFA required",
    status: "Active",
  },
  {
    id: "3",
    module: "Finance",
    sensitive: "Bank details",
    group: "Accountants",
    accessType: "Restricted",
    restriction: "Approval needed",
    status: "Active",
  },
  {
    id: "4",
    module: "Admin",
    sensitive: "Credentials",
    group: "Org Admins",
    accessType: "Full Access",
    restriction: "Global gating",
    status: "Active",
  },
];

const emptyForm = {
  module: "",
  sensitive: "",
  group: "",
  accessType: "",
  restriction: "",
};

export default function DataAccessControlPage() {
  const [rules, setRules] = useState<AccessRule[]>(initialRules);
  const [search, setSearch] = useState("");
  const [filterAccess, setFilterAccess] = useState("All");
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeCount = rules.filter((r) => r.status === "Active").length;

  const filtered = useMemo(() => {
    return rules.filter((rule) => {
      const matchSearch =
        search.trim() === "" ||
        rule.module.toLowerCase().includes(search.toLowerCase()) ||
        rule.group.toLowerCase().includes(search.toLowerCase()) ||
        rule.sensitive.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filterAccess === "All" || rule.accessType === filterAccess;
      return matchSearch && matchFilter;
    });
  }, [rules, search, filterAccess]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (rule: AccessRule) => {
    setEditingId(rule.id);
    setForm({
      module: rule.module,
      sensitive: rule.sensitive,
      group: rule.group,
      accessType: rule.accessType,
      restriction: rule.restriction,
    });
    setModalOpen(true);
  };

  const handleSaveRule = () => {
    const sanitizedSensitive = form.sensitive.trim();
    const sanitizedGroup = form.group.trim();

    if (!form.module) {
      showWarning("Please select a module");
      return;
    }

    if (!sanitizedSensitive) {
      showWarning("Sensitive data description is required");
      return;
    }
    if (/\d/.test(sanitizedSensitive)) {
      showWarning("Sensitive data description cannot contain numbers");
      return;
    }

    if (!sanitizedGroup) {
      showWarning("User group is required");
      return;
    }
    if (/\d/.test(sanitizedGroup)) {
      showWarning("User group cannot contain numbers");
      return;
    }

    if (!form.accessType || !form.restriction) {
      showWarning("Please fill in all access and restriction levels");
      return;
    }

    if (editingId) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, ...form }
            : r
        )
      );
      showSuccess("Rule updated successfully");
    } else {
      const newRule: AccessRule = {
        id: Date.now().toString(),
        ...form,
        status: "Active",
      };
      setRules((prev) => [...prev, newRule]);
      showSuccess("Rule added successfully");
    }
    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
    showSuccess("Rule deleted successfully");
  };

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
          : r
      )
    );
  };

  const handleCommit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showSuccess("Data access rules saved successfully");
    }, 1000);
  };

  const accessBadgeStyle = (type: string) => {
    switch (type) {
      case "Full Access":
        return "bg-primary/10 text-primary border-primary/20";
      case "Read Only":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Restricted":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Data access control
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage access rules and restrictions for sensitive data across modules
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="rounded-none bg-primary hover:bg-primary/90 text-sm font-medium h-9 px-4 gap-2"
        >
          <Plus size={16} />
          Add rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rules */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-none p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Total rules</p>
              <p className="text-2xl font-semibold mt-1">{rules.length}</p>
            </div>
            <div className="p-2 bg-white/20 rounded-none">
              <Layers size={20} />
            </div>
          </div>
        </div>

        {/* Active Rules */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active rules</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-none">
              <ShieldCheck size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Modules Protected */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Modules protected</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">4</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-none">
              <Shield size={20} className="text-gray-600" />
            </div>
          </div>
        </div>

        {/* DLP Policies */}
        <div className="bg-white border border-gray-200 rounded-none p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Dlp policies</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                Enabled
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-none">
              <Lock size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-none">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Search by module, group, data..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 rounded-none border-gray-200 h-9 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt}
                variant={filterAccess === opt ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterAccess(opt)}
                className={`rounded-none text-sm font-medium h-9 px-3 ${
                  filterAccess === opt
                    ? "bg-primary hover:bg-primary/90"
                    : "border-gray-200"
                }`}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  Module
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  Sensitive data
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  User group
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  Access type
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  Restriction
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-medium text-gray-500 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-sm text-gray-400">
                    No rules found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-gray-50/50">
                    <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                      {rule.module}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600">
                      {rule.sensitive}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600">
                      {rule.group}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`rounded-none text-xs font-medium ${accessBadgeStyle(rule.accessType)}`}
                      >
                        {rule.accessType}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-600">
                      {rule.restriction}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.status === "Active"}
                          onCheckedChange={() => toggleStatus(rule.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span
                          className={`text-xs font-medium ${
                            rule.status === "Active"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(rule)}
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 text-gray-500"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(rule.id)}
                          className="h-8 w-8 p-0 rounded-none hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Save */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {rules.length} rules
          </p>
          <Button
            onClick={handleCommit}
            disabled={isSaving}
            className="rounded-none bg-primary hover:bg-primary/90 text-sm font-medium h-9 px-5 gap-2"
          >
            <Save size={14} />
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit rule" : "Add rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Module */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Module</Label>
              <Select
                value={form.module}
                onValueChange={(val: string) => setForm({ ...form, module: val })}
              >
                <SelectTrigger className="rounded-none h-9">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {MODULE_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m} className="rounded-none">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sensitive Data */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Sensitive data
              </Label>
              <Input
                value={form.sensitive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, sensitive: e.target.value })
                }
                placeholder="Enter sensitive data type"
                className="rounded-none h-9 text-sm"
              />
            </div>

            {/* User Group */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                User group
              </Label>
              <Input
                value={form.group}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, group: e.target.value })
                }
                placeholder="Enter user group"
                className="rounded-none h-9 text-sm"
              />
            </div>

            {/* Access Type */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Access type
              </Label>
              <Select
                value={form.accessType}
                onValueChange={(val: string) =>
                  setForm({ ...form, accessType: val })
                }
              >
                <SelectTrigger className="rounded-none h-9">
                  <SelectValue placeholder="Select access type" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {ACCESS_TYPE_OPTIONS.map((a) => (
                    <SelectItem key={a} value={a} className="rounded-none">
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Restriction */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Restriction
              </Label>
              <Select
                value={form.restriction}
                onValueChange={(val: string) =>
                  setForm({ ...form, restriction: val })
                }
              >
                <SelectTrigger className="rounded-none h-9">
                  <SelectValue placeholder="Select restriction" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {RESTRICTION_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r} className="rounded-none">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="rounded-none h-9 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRule}
              className="rounded-none bg-primary hover:bg-primary/90 h-9 text-sm font-medium px-5"
            >
              {editingId ? "Update rule" : "Add rule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Delete rule
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete this rule? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="rounded-none h-9 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="rounded-none bg-red-600 hover:bg-red-700 text-white h-9 text-sm font-medium px-5"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
