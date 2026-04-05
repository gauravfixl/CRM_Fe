"use client";

import React, { useState } from "react";
import {
    ShieldAlert,
    Plus,
    MoreHorizontal,
    Check,
    X,
    Lock,
    Users,
    Edit3,
    Trash2
} from "lucide-react";
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const initialRoles = [
    {
        id: "role-super",
        name: "Super Admin",
        users: 3,
        description: "Full access to all settings, billing, and user management.",
        type: "System",
        permissions: { users: true, billing: true, settings: true, deletion: true }
    },
    {
        id: "role-admin",
        name: "Organization Admin",
        users: 8,
        description: "Can manage users and settings but cannot delete the organization.",
        type: "System",
        permissions: { users: true, billing: false, settings: true, deletion: false }
    },
    {
        id: "role-viewer",
        name: "Auditor / Viewer",
        users: 2,
        description: "Read-only access to logs and reports.",
        type: "Custom",
        permissions: { users: false, billing: false, settings: false, deletion: false }
    }
];

export default function RolesPage() {
    const [roles, setRoles] = useState(initialRoles);

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("New role created successfully.");
    };

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Roles & Permissions"
                breadcrumbItems={[
                    { label: "Org Admins", href: "#" },
                    { label: "Org Staff", href: "#" },
                    { label: "Org Roles", href: "#" }
                ]}
                rightControls={
                    <Dialog>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold shadow-xl border-0">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Custom Role
                            </CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                            <div className="h-2 bg-indigo-600 w-full" />
                            <div className="p-6 sm:p-8 space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Define New Role</DialogTitle>
                                    <DialogDescription className="font-medium text-zinc-500">Create a unique permission set for specific operational needs.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateRole} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Role Name</label>
                                        <Input className="rounded-xl font-medium h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Finance Manager" required />
                                    </div>
                                    <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl bg-white dark:bg-zinc-950">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider block mb-4">Capabilities</label>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Manage Users</span>
                                            <Switch className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">View Billing</span>
                                            <Switch className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Edit Settings</span>
                                            <Switch className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                    </div>
                                    <CustomButton type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 text-sm">Save Role Definition</CustomButton>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 gap-6">
                    {roles.map((role) => (
                        <Card key={role.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden group">
                            <div className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${role.type === 'System' ? 'border-l-4 border-l-slate-400 dark:border-l-slate-600' : 'border-l-4 border-l-indigo-500'}`}>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{role.name}</h3>
                                        {role.type === 'System' ? (
                                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0 rounded-full text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 gap-1">
                                                <Lock className="w-3 h-3" /> System Locked
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-0 rounded-full text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5">
                                                Custom
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">{role.description}</p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-zinc-400" />
                                            {role.users}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wider">Active Users</span>
                                    </div>

                                    <div className="h-12 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 min-w-[200px]">
                                        {Object.entries(role.permissions).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-2 text-xs">
                                                {val ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />}
                                                <span className={`font-semibold uppercase tracking-wider text-[10px] ${val ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`}>{key}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <CustomButton variant="outline" size="icon" className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" disabled={role.type === 'System'} onClick={() => { if (role.type !== 'System') toast.info(`Editing ${role.name}`) }}>
                                            <Edit3 className="w-4 h-4 text-zinc-500" />
                                        </CustomButton>
                                        {role.type !== 'System' && (
                                            <CustomButton variant="outline" size="icon" className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-100" onClick={() => toast.error(`Deleted ${role.name}`)}>
                                                <Trash2 className="w-4 h-4" />
                                            </CustomButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
