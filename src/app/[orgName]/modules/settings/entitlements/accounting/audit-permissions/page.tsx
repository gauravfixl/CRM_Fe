"use client";

import React, { useState, useMemo } from "react";
import { Shield, Users, FileText, Clock, CheckCircle2, Plus, MoreVertical, Edit, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface RolePermission {
    id: string;
    role: string;
    description?: string;
    viewInvoices: boolean;
    createInvoices: boolean;
    editTax: boolean;
    deleteInvoices: boolean;
    viewReports: boolean;
}

const initialRoles: RolePermission[] = [
    { id: "1", role: "Finance Admin", description: "Full financial authority", viewInvoices: true, createInvoices: true, editTax: true, deleteInvoices: true, viewReports: true },
    { id: "2", role: "Accountant", description: "Day-to-day bookkeeping", viewInvoices: true, createInvoices: true, editTax: false, deleteInvoices: false, viewReports: true },
    { id: "3", role: "Manager", description: "Read-only oversight", viewInvoices: true, createInvoices: false, editTax: false, deleteInvoices: false, viewReports: true },
];

export default function AccountingAuditPermissionsPage() {
    const [roles, setRoles] = useState<RolePermission[]>(initialRoles);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editing, setEditing] = useState<RolePermission | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formRole, setFormRole] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [perms, setPerms] = useState({
        viewInvoices: true,
        createInvoices: false,
        editTax: false,
        deleteInvoices: false,
        viewReports: true,
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const auditLogs = [
        { id: "1", action: "Created Invoice", user: "Admin", invoice: "INV-2024-156", timestamp: "2 mins ago", status: "Success" },
        { id: "2", action: "Modified Tax Rate", user: "Sarah M.", invoice: "Tax Config", timestamp: "15 mins ago", status: "Success" },
        { id: "3", action: "Deleted Invoice", user: "John D.", invoice: "INV-2024-089", timestamp: "1 hour ago", status: "Success" },
    ];

    const resetForm = () => {
        setFormRole("");
        setFormDescription("");
        setPerms({
            viewInvoices: true,
            createInvoices: false,
            editTax: false,
            deleteInvoices: false,
            viewReports: true,
        });
        setTouched({});
        setEditing(null);
    };

    const openCreate = () => {
        resetForm();
        setShowRoleModal(true);
    };

    const openEdit = (role: RolePermission) => {
        setEditing(role);
        setFormRole(role.role);
        setFormDescription(role.description || "");
        setPerms({
            viewInvoices: role.viewInvoices,
            createInvoices: role.createInvoices,
            editTax: role.editTax,
            deleteInvoices: role.deleteInvoices,
            viewReports: role.viewReports,
        });
        setTouched({});
        setShowRoleModal(true);
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formRole.trim();
        if (touched.role) {
            if (!name) e.role = "Role name is required";
            else if (name.length < 2) e.role = "Name is too short";
            else if (name.length > 40) e.role = "Name must be under 40 characters";
            else if (
                !editing &&
                roles.some((r) => r.role.toLowerCase() === name.toLowerCase())
            ) {
                e.role = "A role with this name already exists";
            }
        }
        return e;
    }, [formRole, touched, roles, editing]);

    const togglePermission = (
        id: string,
        key: keyof Omit<RolePermission, "id" | "role" | "description">
    ) => {
        setRoles((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r))
        );
    };

    const removeRole = (id: string) => {
        const role = roles.find((r) => r.id === id);
        if (!role) return;
        if (!window.confirm(`Remove role "${role.role}"?`)) return;
        setRoles((prev) => prev.filter((r) => r.id !== id));
        showSuccess("Role removed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ role: true });

        const name = formRole.trim();
        if (!name || name.length < 2 || name.length > 40) {
            showWarning("Please enter a valid role name");
            return;
        }
        if (
            !editing &&
            roles.some((r) => r.role.toLowerCase() === name.toLowerCase())
        ) {
            showWarning("A role with this name already exists");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            if (editing) {
                setRoles((prev) =>
                    prev.map((r) =>
                        r.id === editing.id
                            ? { ...r, role: name, description: formDescription.trim(), ...perms }
                            : r
                    )
                );
                showSuccess("Role updated successfully");
            } else {
                const newRole: RolePermission = {
                    id: Date.now().toString(),
                    role: name,
                    description: formDescription.trim(),
                    ...perms,
                };
                setRoles((prev) => [...prev, newRole]);
                showSuccess("Role added successfully");
            }
            setShowRoleModal(false);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    const permissionOptions: Array<{
        key: keyof typeof perms;
        label: string;
        hint: string;
    }> = [
        { key: "viewInvoices", label: "View Invoices", hint: "Read invoice records and line items" },
        { key: "createInvoices", label: "Create Invoices", hint: "Raise new invoices and drafts" },
        { key: "editTax", label: "Edit Tax", hint: "Modify tax rates and configuration" },
        { key: "deleteInvoices", label: "Delete Invoices", hint: "Remove invoices and move to trash" },
        { key: "viewReports", label: "View Reports", hint: "Access accounting analytics and exports" },
    ];

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Accounting Audit & Permissions</h1>
                    <p className="text-xs text-slate-500">Manage access control and track all accounting activities.</p>
                </div>
                <Button
                    onClick={openCreate}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Plus size={14} /> Add Role
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs opacity-80">Roles Configured</p>
                    <h2 className="text-xl font-semibold">{roles.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Permission sets</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Audit Events</p>
                    <h3 className="text-xl font-semibold text-gray-900">1,204</h3>
                    <p className="text-green-600 text-[10px] mt-1">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Active Users</p>
                    <h3 className="text-xl font-semibold text-gray-900">24</h3>
                    <p className="text-blue-600 text-[10px] mt-1">With accounting access</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Compliance</p>
                    <h3 className="text-xl font-semibold text-gray-900">100%</h3>
                    <p className="text-green-600 text-[10px] mt-1">All actions logged</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                    <Shield size={14} className="text-slate-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Role Permissions</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Role</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">View Invoices</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Create Invoices</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Edit Tax</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Delete Invoices</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">View Reports</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={14} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-900 block">{role.role}</span>
                                                {role.description && (
                                                    <span className="text-[10px] text-gray-500">{role.description}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={role.viewInvoices}
                                            onCheckedChange={() => togglePermission(role.id, "viewInvoices")}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={role.createInvoices}
                                            onCheckedChange={() => togglePermission(role.id, "createInvoices")}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={role.editTax}
                                            onCheckedChange={() => togglePermission(role.id, "editTax")}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={role.deleteInvoices}
                                            onCheckedChange={() => togglePermission(role.id, "deleteInvoices")}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Switch
                                            checked={role.viewReports}
                                            onCheckedChange={() => togglePermission(role.id, "viewReports")}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(role)}
                                                    className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit Role
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => removeRole(role.id)}
                                                    className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Audit Logs</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Action</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">User</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Target</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Timestamp</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-100 group-hover:bg-gray-600 group-hover:text-white transition-all">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{log.user}</span></td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{log.invoice}</span></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={12} /> {log.timestamp}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className="bg-green-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit">
                                            <CheckCircle2 size={10} /> {log.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <SideFormSheet
                open={showRoleModal}
                onOpenChange={(o) => {
                    setShowRoleModal(o);
                    if (!o) resetForm();
                }}
                title={editing ? "Edit Role" : "Add Role"}
                description={editing ? "Update permissions for this role." : "Define a new role and its accounting permissions."}
                icon={<Shield className="w-5 h-5" />}
                onSubmit={handleSubmit}
                submitLabel={editing ? "Save Changes" : "Create Role"}
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Role Name"
                        required
                        error={errors.role}
                        hint="Unique name identifying this role"
                    >
                        <Input
                            placeholder="e.g., Finance Admin"
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field
                        label="Description"
                        hint="Optional summary of this role's responsibility"
                    >
                        <Textarea
                            placeholder="Full financial authority across firms"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="min-h-[80px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]"
                        />
                    </Field>

                    <div className="space-y-2">
                        <p className="text-[13px] font-semibold text-[#374151]">Permissions</p>
                        <div className="space-y-2">
                            {permissionOptions.map((p) => (
                                <div
                                    key={p.key}
                                    className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]"
                                >
                                    <div>
                                        <p className="text-[13px] font-semibold text-[#374151]">{p.label}</p>
                                        <p className="text-[11.5px] text-[#64748B] mt-0.5">{p.hint}</p>
                                    </div>
                                    <Switch
                                        checked={perms[p.key]}
                                        onCheckedChange={(v) => setPerms((prev) => ({ ...prev, [p.key]: v }))}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Delete permissions are irreversible and should be granted to trusted roles only.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
