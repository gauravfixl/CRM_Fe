"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Package,
    Power,
    Settings,
    MoreVertical,
    Trash2,
    ExternalLink,
    RotateCw,
    Search,
    Plus,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function EnabledAppsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "AutoUpdate">("All");
    const [apps, setApps] = useState([
        { id: "1", name: "Slack Integration", version: "2.4.1", status: "Active", lastUpdated: "2 days ago", autoUpdate: true },
        { id: "2", name: "QuickBooks Sync", version: "1.0.5", status: "Active", lastUpdated: "1 week ago", autoUpdate: true },
        { id: "3", name: "Zoom Meetings", version: "5.12.0", status: "Inactive", lastUpdated: "1 month ago", autoUpdate: false },
        { id: "4", name: "Google Drive", version: "3.2.1", status: "Active", lastUpdated: "3 days ago", autoUpdate: true },
        { id: "5", name: "Mailchimp Connector", version: "1.2.0", status: "Maintenance", lastUpdated: "Yesterday", autoUpdate: false },
    ]);

    const toggleStatus = (id: string) => {
        setApps((prev) =>
            prev.map((app) =>
                app.id === id
                    ? { ...app, status: app.status === "Active" ? "Inactive" : "Active" }
                    : app
            )
        );
        toast.success("App status updated");
    };

    const toggleAutoUpdate = (id: string) => {
        setApps((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, autoUpdate: !app.autoUpdate } : app
            )
        );
        toast.success("Auto-update preference saved");
    };

    const filteredApps = apps.filter((app) => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (statusFilter === "All") return true;
        if (statusFilter === "AutoUpdate") return app.autoUpdate;
        return app.status === statusFilter;
    });

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-zinc-900 p-6 rounded-none border border-zinc-200 dark:border-zinc-800 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white shadow-lg">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Enabled Apps</h1>
                        <p className="text-xs text-zinc-500 font-medium">
                            Manage enabled applications and their configurations.
                        </p>
                    </div>
                </div>
                <Button
                    className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-6 gap-2"
                    onClick={() => toast.info("Checking for updatesâ€¦")}
                >
                    <RotateCw className="w-4 h-4" /> Check for Updates
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard
                    onClick={() => setStatusFilter("All")}
                    className={`bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Total Enabled</p>
                            <p className="text-xl font-semibold text-white mt-1">{apps.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Applications</p>
                        </div>
                        <Package className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard
                    onClick={() => setStatusFilter("Active")}
                    className={`bg-white dark:bg-zinc-900 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 cursor-pointer ${statusFilter === "Active" ? "ring-2 ring-emerald-500" : ""}`}
                >
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Active</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">
                                {apps.filter((a) => a.status === "Active").length}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Running</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-none flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard
                    onClick={() => setStatusFilter("Inactive")}
                    className={`bg-white dark:bg-zinc-900 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 cursor-pointer ${statusFilter === "Inactive" ? "ring-2 ring-zinc-400" : ""}`}
                >
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Inactive</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">
                                {apps.filter((a) => a.status === "Inactive").length}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Disabled</span>
                        </div>
                        <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-none flex items-center justify-center">
                            <XCircle className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard
                    onClick={() => setStatusFilter("AutoUpdate")}
                    className={`bg-white dark:bg-zinc-900 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 cursor-pointer ${statusFilter === "AutoUpdate" ? "ring-2 ring-blue-500" : ""}`}
                >
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Auto-Update</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">
                                {apps.filter((a) => a.autoUpdate).length}
                            </span>
                            <span className="text-[10px] text-blue-500 font-medium mt-1 block">Apps enabled</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-none flex items-center justify-center">
                            <RotateCw className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search appsâ€¦"
                            className="pl-10 h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold gap-2"
                        onClick={() => toast.info("Opening marketplaceâ€¦")}
                    >
                        <Plus className="w-4 h-4" /> Add App
                    </Button>
                </div>
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                            <TableHead className="py-3 px-4 text-[11px] font-medium text-zinc-500">Application</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-zinc-500">Version</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-zinc-500">Status</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-zinc-500">Auto Update</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-zinc-500">Last Updated</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-[11px] font-medium text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApps.map((app) => (
                            <TableRow
                                key={app.id}
                                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                            >
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <Package className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            {app.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge
                                        variant="secondary"
                                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0 font-medium text-[10px]"
                                    >
                                        v{app.version}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={app.status === "Active"}
                                            onCheckedChange={() => toggleStatus(app.id)}
                                            className="data-[state=checked]:bg-emerald-600"
                                        />
                                        <Badge
                                            className={`text-[9px] font-medium border-0 px-2 py-0.5 rounded-full ${
                                                app.status === "Active"
                                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                                    : app.status === "Maintenance"
                                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                            }`}
                                        >
                                            {app.status}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleAutoUpdate(app.id)}
                                        className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                app.autoUpdate ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                                            }`}
                                        />
                                        {app.autoUpdate ? "On" : "Off"}
                                    </button>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                    {app.lastUpdated}
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded-xl border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold gap-1"
                                            onClick={() => toast.info(`Opening config for ${app.name}`)}
                                        >
                                            <Settings className="w-3.5 h-3.5" /> Configure
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48 rounded-xl border-zinc-200 dark:border-zinc-700 shadow-lg"
                                            >
                                                <DropdownMenuLabel className="text-[11px] font-medium text-zinc-500">
                                                    App Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="text-sm font-medium cursor-pointer"
                                                    onClick={() => toast.info(`Opening ${app.name}`)}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" /> Open App
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-sm font-medium cursor-pointer"
                                                    onClick={() => toast.success("App restarted")}
                                                >
                                                    <Power className="w-4 h-4 mr-2" /> Restart
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-sm font-medium text-rose-600 cursor-pointer focus:text-rose-600"
                                                    onClick={() => {
                                                        setApps((prev) => prev.filter((a) => a.id !== app.id));
                                                        toast.success(`${app.name} uninstalled`);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Uninstall
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {filteredApps.length === 0 && (
                    <div className="p-12 text-center text-sm text-zinc-500 font-medium">
                        No apps match your search. Try a different term or add an app from the marketplace.
                    </div>
                )}
            </div>
        </div>
    );
}
