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
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Deactivated Users"
                breadcrumbItems={[
                    { label: "Org Admins", href: "#" },
                    { label: "Access", href: "#" },
                    { label: "Deactivated Users", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold" onClick={() => toast.info("Opening access logs")}>
                            <History className="w-4 h-4 mr-2" />
                            View Access Logs
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* SEARCH */}
                <div className="bg-white dark:bg-zinc-900 p-2 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search deactivated users..."
                            className="pl-11 border-none shadow-none focus-visible:ring-0 p-0 text-sm font-medium h-10 bg-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* LIST */}
                <div className="grid gap-4">
                    {users.length > 0 ? (
                        users
                            .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((user) => (
                                <Card key={user.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all rounded-3xl group overflow-hidden border-l-4 border-l-zinc-300 dark:border-l-zinc-700">
                                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <Avatar className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-700 grayscale opacity-80">
                                                <AvatarFallback className="font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                                    {user.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold tracking-tight text-zinc-700 dark:text-zinc-300 decoration-zinc-400 line-through decoration-2">{user.name}</h3>
                                                <p className="text-xs text-zinc-400 font-medium font-mono">{user.email}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className="font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 border-0 uppercase tracking-wide">
                                                        {user.role}
                                                    </Badge>
                                                    <Badge className="font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 text-[10px] px-2 py-0.5 border-0 gap-1 uppercase tracking-wide">
                                                        <Ban className="w-3 h-3" /> {user.reason}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto md:px-8 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 pt-4 md:pt-0 pl-0 md:pl-8">
                                            <span className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wider">Deactivated On</span>
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{user.deactivatedAt}</span>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0">
                                            <CustomButton
                                                className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl gap-2 shadow-xl border-0"
                                                onClick={() => handleRestore(user.id, user.name)}
                                            >
                                                <RotateCcw className="w-4 h-4" /> Restore Status
                                            </CustomButton>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <CustomButton
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </CustomButton>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                                                    <div className="h-2 bg-red-500 w-full" />
                                                    <div className="p-6 sm:p-8 space-y-6">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="flex items-center gap-3 text-red-600 text-xl font-bold">
                                                                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                                                                    <AlertOctagon className="w-5 h-5" />
                                                                </div>
                                                                Permanent Deletion
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="font-medium text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed pt-2">
                                                                Are you sure you want to permanently delete <strong>{user.name}</strong>?
                                                                This action is irreversible and will remove all associated logs and private data.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="flex gap-3">
                                                            <AlertDialogCancel className="rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold h-10 px-6 m-0">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold h-10 px-6 m-0 border-0"
                                                                onClick={() => handlePermanentDelete(user.id)}
                                                            >
                                                                Yes, Delete Forever
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </div>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </Card>
                            ))) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                                <ShieldAlert className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Active Workforce</h3>
                            <p className="text-zinc-500 font-medium text-sm max-w-sm text-center mt-2">Your workforce is fully active. Deactivated or suspended accounts will appear here for audit purposes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
