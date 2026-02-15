"use client";

import React, { useState } from "react";
import {
    UserX,
    RotateCcw,
    Trash2,
    Search,
    AlertOctagon,
    ShieldAlert,
    Ban,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialDeactivated = [
    {
        id: "du-1",
        name: "Michael Scott",
        email: "michael.s@dundermifflin.com",
        role: "Regional Manager",
        deactivatedAt: "Jan 12, 2024",
        reason: "Termination",
        avatar: "MS"
    },
    {
        id: "du-2",
        name: "Dwight Schrute",
        email: "dwight.s@dundermifflin.com",
        role: "Assistant to the RM",
        deactivatedAt: "Feb 01, 2024",
        reason: "Security Policy Violation",
        avatar: "DS"
    },
];

export default function DeactivatedUsersPage() {
    const [users, setUsers] = useState(initialDeactivated);
    const [searchQuery, setSearchQuery] = useState("");

    const handleRestore = (id: string, name: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success(`${name} has been restored to active status.`);
    };

    const handlePermanentDelete = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.error("User data permanently purged.");
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <UserX className="w-6 h-6 text-slate-500" />
                        Deactivated Users
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage suspended accounts and historical user data.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100">
                        <History className="w-4 h-4" />
                        View Access Logs
                    </Button>
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-none flex items-center gap-4">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                    placeholder="Search deactivated users..."
                    className="border-none shadow-none focus-visible:ring-0 p-0 text-sm font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* LIST */}
            <div className="grid gap-4">
                {users.length > 0 ? (
                    users
                        .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((user) => (
                            <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-none group overflow-hidden border-l-4 border-l-slate-400">
                                <div className="p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <Avatar className="h-12 w-12 rounded-none border border-slate-200 grayscale opacity-70">
                                            <AvatarFallback className="font-bold bg-slate-100 text-slate-500 rounded-none">{user.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-slate-700 decoration-slate-400 line-through decoration-2">{user.name}</h3>
                                            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-[9px] uppercase font-bold rounded-none border-slate-200 text-slate-500 bg-slate-50">
                                                    {user.role}
                                                </Badge>
                                                <Badge variant="outline" className="text-[9px] uppercase font-bold rounded-none border-red-200 text-red-600 bg-red-50 gap-1">
                                                    <Ban className="w-3 h-3" /> {user.reason}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 w-full md:w-auto">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Deactivated On</span>
                                        <span className="text-sm font-bold text-slate-900">{user.deactivatedAt}</span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <Button
                                            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-none gap-2 shadow-sm"
                                            onClick={() => handleRestore(user.id, user.name)}
                                        >
                                            <RotateCcw className="w-4 h-4" /> Restore Access
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-none border-t-4 border-t-red-600">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                                        <AlertOctagon className="w-5 h-5" />
                                                        Permanent Deletion
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="font-medium text-slate-600">
                                                        Are you sure you want to permanently delete <strong>{user.name}</strong>?
                                                        This action is irreversible and will remove all associated logs and private data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-none font-bold">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="rounded-none bg-red-600 hover:bg-red-700 font-bold"
                                                        onClick={() => handlePermanentDelete(user.id)}
                                                    >
                                                        Yes, Delete Forever
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        ))) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-none">
                        <ShieldAlert className="w-12 h-12 text-emerald-100 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No deactivated users</h3>
                        <p className="text-slate-500 text-sm max-w-sm text-center">Your workforce is fully active. Deactivated accounts will appear here for audit purposes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
