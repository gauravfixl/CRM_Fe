"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Shield,
    Building2,
    User,
    Plus,
    X,
    Search,
    Check,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchUsersApi, updateOrgUser } from "@/modules/crm/organizations/hooks/orgHooks";
import { getAllFirms } from "@/hooks/firmHooks";

interface AccessUser {
    id: string;
    name: string;
    role: string;
    firms: string[];
    firmIds: string[];
    avatar: string;
}

interface FirmData {
    _id: string;
    FirmName: string;
    [key: string]: any;
}

export default function AccessMatrixPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<AccessUser[]>([]);
    const [allFirms, setAllFirms] = useState<FirmData[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [usersData, firmsRes] = await Promise.all([
                fetchUsersApi(),
                getAllFirms(),
            ]);

            const rawUsers = usersData?.users || usersData || [];
            const firmsData: FirmData[] = firmsRes?.data?.firms || firmsRes?.data?.data || [];
            setAllFirms(firmsData);

            // Build a firm ID->Name lookup
            const firmNameMap: Record<string, string> = {};
            firmsData.forEach((f: FirmData) => {
                firmNameMap[f._id] = f.FirmName;
            });

            const mappedUsers: AccessUser[] = (Array.isArray(rawUsers) ? rawUsers : [])
                .filter((u: any) => u.orgActive !== false)
                .map((u: any) => {
                    const name = u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "—";
                    const initials = name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                    // Map firmAccess IDs to firm names
                    const userFirmIds: string[] = Array.isArray(u.firmAccess) ? u.firmAccess : [];
                    const userFirmNames = userFirmIds
                        .map((fid: string) => firmNameMap[fid] || fid)
                        .filter(Boolean);

                    return {
                        id: u.memberId || u._id,
                        name,
                        role: u.role || "Member",
                        firms: userFirmNames,
                        firmIds: userFirmIds,
                        avatar: u.avatar || initials,
                    };
                });

            setUsers(mappedUsers);
        } catch (error) {
            console.error("Failed to load access matrix data:", error);
            toast.error("Failed to load users and firms.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Build firm name -> id lookup
    const firmIdMap: Record<string, string> = {};
    allFirms.forEach((f) => {
        firmIdMap[f.FirmName] = f._id;
    });

    const allFirmNames = allFirms.map((f) => f.FirmName);

    const handleGrantAccess = async (userId: string, firmNames: string[]) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const newFirmIds = firmNames
            .map((name) => firmIdMap[name])
            .filter(Boolean);
        const updatedFirmIds = [...new Set([...user.firmIds, ...newFirmIds])];

        setActionLoading(userId);
        try {
            await updateOrgUser(userId, { firmAccess: updatedFirmIds });
            toast.success("Firm access permissions updated.");
            await loadData();
        } catch (error) {
            console.error("Failed to grant access:", error);
            toast.error("Failed to update firm access.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRevoke = async (userId: string, firmName: string) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const revokedFirmId = firmIdMap[firmName];
        const updatedFirmIds = user.firmIds.filter((fid) => fid !== revokedFirmId);

        setActionLoading(userId);
        try {
            await updateOrgUser(userId, { firmAccess: updatedFirmIds });
            toast.info(`Access to ${firmName} revoked.`);
            await loadData();
        } catch (error) {
            console.error("Failed to revoke access:", error);
            toast.error("Failed to revoke firm access.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                <p className="text-sm text-slate-500 mt-3">Loading access matrix...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cross-Firm Access Control</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage which users can access data across different business units.</p>
                </div>
                <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100">
                    <Shield className="w-4 h-4" />
                    Audit Logs
                </Button>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-none flex items-center gap-4">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search users by name..."
                    className="border-none shadow-none focus-visible:ring-0 p-0 text-sm font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* USERS LIST */}
            <div className="grid gap-4">
                {users
                    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((user) => (
                        <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-none group overflow-hidden">
                            <div className="flex flex-col md:flex-row items-stretch">
                                {/* USER PROFILE */}
                                <div className="p-6 bg-white w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-4">
                                    <Avatar className="h-12 w-12 rounded-none border border-slate-200">
                                        <AvatarFallback className="font-bold bg-slate-50 text-slate-600 rounded-none">{user.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{user.name}</h3>
                                        <p className="text-xs font-bold uppercase text-slate-400 mt-1 tracking-wider">{user.role}</p>
                                    </div>
                                </div>

                                {/* ACCESS TOKENS */}
                                <div className="p-6 bg-slate-50/30 flex-1 flex flex-col justify-center">
                                    {actionLoading === user.id ? (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs">Updating access...</span>
                                        </div>
                                    ) : (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {user.firms.length > 0 ? (
                                            user.firms.map((firm) => (
                                                <Badge key={firm} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors group/badge cursor-pointer rounded-none gap-2 shadow-sm" onClick={() => handleRevoke(user.id, firm)}>
                                                    <Building2 className="w-3 h-3 text-slate-400 group-hover/badge:text-red-500" />
                                                    <span className="font-bold">{firm}</span>
                                                    <X className="w-3 h-3 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No explicit firm access assignments.</span>
                                        )}

                                        {/* ADD ACCESS BUTTON */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md rounded-none border-t-4 border-t-blue-600">
                                                <DialogHeader>
                                                    <DialogTitle>Grant Access</DialogTitle>
                                                    <DialogDescription>Select firms to authorize for <strong>{user.name}</strong>.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-2 py-4">
                                                    {allFirmNames
                                                        .filter(f => !user.firms.includes(f))
                                                        .map((firm) => (
                                                            <div key={firm} className="flex items-center justify-between p-3 border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group/item" onClick={() => handleGrantAccess(user.id, [firm])}>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                                        <Building2 className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="font-bold text-slate-700 text-sm">{firm}</span>
                                                                </div>
                                                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100">
                                                                    <ArrowRight className="w-4 h-4 text-blue-600" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    {allFirmNames.filter(f => !user.firms.includes(f)).length === 0 && (
                                                        <p className="text-center text-sm text-slate-400 py-4">User already has access to all firms.</p>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
