"use client";

import React, { useState } from "react";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    ShieldCheck,
    UserPlus,
    Mail,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const usersData = [
    { id: "u1", name: "Esther Howard", email: "esther@acme.com", role: "Org Owner", status: "Active", lastActive: "Just now", avatar: "EH" },
    { id: "u2", name: "Cody Fisher", email: "cody@acme.com", role: "Admin", status: "Active", lastActive: "2h ago", avatar: "CF" },
    { id: "u3", name: "Brooklyn Simmons", email: "brooklyn@acme.com", role: "Editor", status: "Active", lastActive: "1d ago", avatar: "BS" },
    { id: "u4", name: "Cameron Williamson", email: "cameron@acme.com", role: "Viewer", status: "Inactive", lastActive: "5d ago", avatar: "CW" },
    { id: "u5", name: "Jenny Wilson", email: "jenny@acme.com", role: "Viewer", status: "Invited", lastActive: "-", avatar: "JW" },
];

export default function UsersListPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInvite = () => {
        // Redirect to invites page or show modal
        toast.info("Redirecting to invite flow...");
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-slate-600" />
                        Organization Users
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage all staff members and their access levels.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100 bg-white">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                    <Button
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleInvite}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex items-center gap-4 bg-white p-4 border border-slate-200 shadow-sm rounded-none">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 border-none shadow-none focus-visible:ring-0 p-0 text-sm font-medium h-9 w-full rounded-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <Button variant="ghost" className="h-9 font-bold text-slate-500 hover:text-slate-900 gap-2 rounded-none">
                    <Filter className="w-4 h-4" /> Filters
                </Button>
            </div>

            {/* USERS TABLE */}
            <Card className="border-none shadow-sm rounded-none overflow-hidden min-h-[400px]">
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-500 font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {usersData.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-full border border-slate-200">
                                                <AvatarFallback className="font-bold bg-slate-100 text-slate-500">{user.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-medium text-slate-700">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`rounded-none border-none font-bold uppercase tracking-wider text-[10px] ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                user.status === 'Inactive' ? 'bg-slate-100 text-slate-500' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-200">
                                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none w-48">
                                                <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2">
                                                    <Mail className="w-4 h-4" /> Email User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <ShieldCheck className="w-4 h-4" /> Change Role
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50">
                                                    Deactivate Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
