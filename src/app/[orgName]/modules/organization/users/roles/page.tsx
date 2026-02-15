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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles & Permissions</h1>
                    <p className="text-sm text-slate-500 mt-1">Define access levels and granular capabilities for administrators.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-200 rounded-none transition-all hover:translate-y-[-1px]">
                            <Plus className="w-4 h-4" />
                            Create Custom Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg rounded-none border-t-4 border-t-blue-600">
                        <DialogHeader>
                            <DialogTitle>Define New Role</DialogTitle>
                            <DialogDescription>Create a unique permission set for specific operational needs.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateRole} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-slate-500">Role Name</label>
                                <Input className="rounded-none font-bold" placeholder="e.g. Finance Manager" />
                            </div>
                            <div className="space-y-4 border border-slate-200 p-4 bg-slate-50">
                                <label className="text-xs uppercase font-bold text-slate-500 block mb-2">Capabilities</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Manage Users</span>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">View Billing</span>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Edit Settings</span>
                                    <Switch />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 font-bold rounded-none">Save Role definition</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {roles.map((role) => (
                    <Card key={role.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-none overflow-hidden group">
                        <div className="bg-white border-l-4 border-l-blue-500 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
                                    {role.type === 'System' ? (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded-none text-[10px] uppercase font-bold tracking-wider gap-1">
                                            <Lock className="w-3 h-3" /> System Locked
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 rounded-none text-[10px] uppercase font-bold tracking-wider">
                                            Custom
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 font-medium">{role.description}</p>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-slate-400" />
                                        {role.users}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Active Users</span>
                                </div>

                                <div className="h-10 w-px bg-slate-200 hidden md:block" />

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 min-w-[200px]">
                                    {Object.entries(role.permissions).map(([key, val]) => (
                                        <div key={key} className="flex items-center gap-2 text-xs">
                                            {val ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-300" />}
                                            <span className={`font-bold uppercase tracking-tight ${val ? 'text-emerald-700' : 'text-slate-400'}`}>{key}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200" disabled={role.type === 'System'}>
                                        <Edit3 className="w-4 h-4 text-slate-600" />
                                    </Button>
                                    {role.type !== 'System' && (
                                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
