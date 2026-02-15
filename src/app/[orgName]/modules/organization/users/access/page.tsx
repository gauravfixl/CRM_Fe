"use client";

import React, { useState } from "react";
import {
    Shield,
    Building2,
    User,
    Plus,
    X,
    Search,
    Check,
    ArrowRight
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

const initialUsers = [
    {
        id: "u1",
        name: "Robert Fox",
        role: "Org Admin",
        firms: ["US-East HQ", "US-West Branch"],
        avatar: "RF"
    },
    {
        id: "u2",
        name: "Jane Cooper",
        role: "Regional Manager",
        firms: ["US-West Branch"],
        avatar: "JC"
    },
    {
        id: "u3",
        name: "Guy Hawkins",
        role: "Auditor",
        firms: ["US-East HQ", "EU-Central Ops", "Asia-Pac Hub"],
        avatar: "GH"
    },
];

const allFirms = ["US-East HQ", "US-West Branch", "EU-Central Ops", "Asia-Pac Hub", "LatAm Sales"];

export default function AccessMatrixPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState(initialUsers);

    const handleGrantAccess = (userId: string, firms: string[]) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, firms: [...new Set([...u.firms, ...firms])] } : u
        ));
        toast.success("Firm access permissions updated.");
    };

    const handleRevoke = (userId: string, firm: string) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, firms: u.firms.filter(f => f !== firm) } : u
        ));
        toast.info(`Access to ${firm} revoked.`);
    };

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
                                                    {allFirms
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
                                                    {allFirms.filter(f => !user.firms.includes(f)).length === 0 && (
                                                        <p className="text-center text-sm text-slate-400 py-4">User already has access to all firms.</p>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
