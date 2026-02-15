"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Eye,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Save,
    ArrowLeft,
    AlertCircle
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useRolesStore, AVAILABLE_MODULES, type Role, type ModulePermission, type DataScope, type PermissionAction } from "@/shared/data/roles-store";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

const PermissionMatrixPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams.get('role');

    const { roles, updatePermissions } = useRolesStore();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [permissions, setPermissions] = useState<ModulePermission[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (roleId) {
            const role = roles.find(r => r.id === roleId);
            if (role) {
                setSelectedRole(role);
                // Initialize permissions for all modules
                const initialPerms = AVAILABLE_MODULES.map(module => {
                    const existing = role.permissions.find(p => p.module === module);
                    return existing || {
                        module,
                        actions: { view: false, create: false, edit: false, delete: false, approve: false },
                        scope: 'Self' as DataScope
                    };
                });
                setPermissions(initialPerms);
            }
        }
    }, [roleId, roles]);

    const handleActionToggle = (moduleIndex: number, action: PermissionAction) => {
        const newPermissions = [...permissions];
        newPermissions[moduleIndex].actions[action] = !newPermissions[moduleIndex].actions[action];
        setPermissions(newPermissions);
        setHasChanges(true);
    };

    const handleScopeChange = (moduleIndex: number, scope: DataScope) => {
        const newPermissions = [...permissions];
        newPermissions[moduleIndex].scope = scope;
        setPermissions(newPermissions);
        setHasChanges(true);
    };

    const handleSelectAll = (moduleIndex: number) => {
        const newPermissions = [...permissions];
        const allSelected = Object.values(newPermissions[moduleIndex].actions).every(v => v);
        newPermissions[moduleIndex].actions = {
            view: !allSelected,
            create: !allSelected,
            edit: !allSelected,
            delete: !allSelected,
            approve: !allSelected
        };
        setPermissions(newPermissions);
        setHasChanges(true);
    };

    const handleSave = () => {
        if (!selectedRole) return;

        // Filter out modules with no permissions
        const activePermissions = permissions.filter(p =>
            Object.values(p.actions).some(v => v)
        );

        updatePermissions(selectedRole.id, activePermissions);
        setHasChanges(false);
        toast({
            title: "Permissions Updated",
            description: `${selectedRole.name} permissions have been saved successfully.`
        });
    };

    if (!selectedRole) {
        return (
            <div className="flex-1 min-h-screen bg-[#fcfdff] p-8">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-12 text-center">
                    <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">No Role Selected</h2>
                    <p className="text-slate-500 font-medium mb-6">Please select a role from the roles list to manage permissions.</p>
                    <Button
                        className="bg-slate-900 text-white rounded-xl h-12 px-8 font-bold"
                        onClick={() => router.push('/hrmcubicle/admin/roles')}
                    >
                        Go to Roles
                    </Button>
                </Card>
            </div>
        );
    }

    const actionLabels: { key: PermissionAction; label: string; icon: any }[] = [
        { key: 'view', label: 'View', icon: Eye },
        { key: 'create', label: 'Create', icon: Plus },
        { key: 'edit', label: 'Edit', icon: Edit },
        { key: 'delete', label: 'Delete', icon: Trash2 },
        { key: 'approve', label: 'Approve', icon: CheckCircle }
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 h-12 w-12"
                        onClick={() => router.push('/hrmcubicle/admin/roles')}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Permission Matrix</h1>
                        <p className="text-slate-500 font-medium">Configure access control for <span className="font-bold text-indigo-600">{selectedRole.name}</span></p>
                    </div>
                </div>

                <Button
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold disabled:opacity-50"
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    <Save className="mr-2 h-5 w-5" /> Save Changes
                </Button>
            </div>

            {/* Role Info Card */}
            <Card className="border-none shadow-lg rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Shield size={32} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-xl">{selectedRole.name}</h3>
                        <p className="text-white/70 text-sm font-medium">{selectedRole.description}</p>
                    </div>
                    <div className="text-right">
                        <Badge className="bg-white/20 text-white border-none font-bold mb-2">
                            {selectedRole.type}
                        </Badge>
                        <p className="text-xs text-white/60 font-bold">Assigned to {selectedRole.assignedTo.length} users</p>
                    </div>
                </div>
            </Card>

            {/* Permission Matrix Table */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-6 font-black text-slate-900 uppercase tracking-wider text-xs w-64">
                                    Module
                                </th>
                                {actionLabels.map(action => (
                                    <th key={action.key} className="text-center p-6 font-black text-slate-900 uppercase tracking-wider text-xs">
                                        <div className="flex flex-col items-center gap-2">
                                            <action.icon size={16} className="text-slate-400" />
                                            {action.label}
                                        </div>
                                    </th>
                                ))}
                                <th className="text-center p-6 font-black text-slate-900 uppercase tracking-wider text-xs">
                                    Data Scope
                                </th>
                                <th className="text-center p-6 font-black text-slate-900 uppercase tracking-wider text-xs">
                                    Quick
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((perm, index) => {
                                const hasAnyPermission = Object.values(perm.actions).some(v => v);
                                return (
                                    <motion.tr
                                        key={perm.module}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.02 }}
                                        className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${hasAnyPermission ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${hasAnyPermission ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Shield size={18} />
                                                </div>
                                                <span className="font-bold text-slate-900">{perm.module}</span>
                                            </div>
                                        </td>
                                        {actionLabels.map(action => (
                                            <td key={action.key} className="p-6 text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        checked={perm.actions[action.key]}
                                                        onCheckedChange={() => handleActionToggle(index, action.key)}
                                                        className="h-5 w-5 rounded-md data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-6">
                                            <Select
                                                value={perm.scope}
                                                onValueChange={(v) => handleScopeChange(index, v as DataScope)}
                                                disabled={!hasAnyPermission}
                                            >
                                                <SelectTrigger className="rounded-xl h-10 bg-slate-50 border-none font-bold text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Self">Self Only</SelectItem>
                                                    <SelectItem value="Team">Team</SelectItem>
                                                    <SelectItem value="Department">Department</SelectItem>
                                                    <SelectItem value="Organization">Organization</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-6 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                onClick={() => handleSelectAll(index)}
                                            >
                                                {Object.values(perm.actions).every(v => v) ? 'Clear All' : 'Select All'}
                                            </Button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Legend */}
            <Card className="border-none shadow-lg rounded-[2rem] bg-slate-50 p-6">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider mb-4">Data Scope Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-600">S</div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Self</p>
                            <p className="text-xs text-slate-500">Own data only</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-600">T</div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Team</p>
                            <p className="text-xs text-slate-500">Direct reports</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-600">D</div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Department</p>
                            <p className="text-xs text-slate-500">Same department</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-600">O</div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Organization</p>
                            <p className="text-xs text-slate-500">All employees</p>
                        </div>
                    </div>
                </div>
            </Card>

            {hasChanges && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 right-8 bg-amber-100 border-2 border-amber-200 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
                >
                    <AlertCircle className="text-amber-600" size={20} />
                    <span className="font-bold text-amber-900 text-sm">You have unsaved changes</span>
                    <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold h-8"
                        onClick={handleSave}
                    >
                        Save Now
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default PermissionMatrixPage;
