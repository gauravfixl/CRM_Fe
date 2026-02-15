"use client";

import React, { useState } from "react";
import { Package, Power, Settings, MoreVertical, Trash2, ExternalLink, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

export default function InstalledAppsPage() {
    const [apps, setApps] = useState([
        { id: "1", name: "Slack Integration", version: "2.4.1", status: "Active", lastUpdated: "2 days ago", autoUpdate: true, icon: "💬" },
        { id: "2", name: "QuickBooks Sync", version: "1.0.5", status: "Active", lastUpdated: "1 week ago", autoUpdate: true, icon: "💰" },
        { id: "3", name: "Zoom Meetings", version: "5.12.0", status: "Inactive", lastUpdated: "1 month ago", autoUpdate: false, icon: "🎥" },
        { id: "4", name: "Google Drive", version: "3.2.1", status: "Active", lastUpdated: "3 days ago", autoUpdate: true, icon: "📁" },
        { id: "5", name: "Mailchimp Connector", version: "1.2.0", status: "Maintenance", lastUpdated: "Yesterday", autoUpdate: false, icon: "🐒" },
    ]);

    const toggleStatus = (id: string) => {
        setApps(prev => prev.map(app => app.id === id ? { ...app, status: app.status === "Active" ? "Inactive" : "Active" } : app));
    };

    const toggleAutoUpdate = (id: string) => {
        setApps(prev => prev.map(app => app.id === id ? { ...app, autoUpdate: !app.autoUpdate } : app));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Installed Apps</h1>
                    <p className="text-sm text-gray-600">Manage your active applications and configurations.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <RotateCw size={16} /> Check for Updates
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Installed</p>
                    <h2 className="text-white text-2xl font-bold">{apps.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Apps</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active</p>
                    <h3 className="text-2xl font-bold text-gray-900">{apps.filter(a => a.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Running smoothly</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Inactive</p>
                    <h3 className="text-2xl font-bold text-gray-900">{apps.filter(a => a.status === "Inactive").length}</h3>
                    <p className="text-zinc-500 text-xs mt-1">Disabled manually</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Auto-Update</p>
                    <h3 className="text-2xl font-bold text-gray-900">{apps.filter(a => a.autoUpdate).length}</h3>
                    <p className="text-blue-600 text-xs mt-1">Apps enabled</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <h3 className="text-sm font-bold text-gray-900">Installed Application List</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Application</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Version</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Auto Update</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Updated</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {apps.map((app) => (
                                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-100 rounded-none flex items-center justify-center text-lg">{app.icon}</div>
                                            <span className="text-sm font-bold text-gray-900">{app.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-none border border-zinc-200">v{app.version}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={app.status === "Active"} onCheckedChange={() => toggleStatus(app.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${app.status === "Active" ? "bg-green-600" :
                                                    app.status === "Maintenance" ? "bg-amber-500" :
                                                        "bg-zinc-400"
                                                } text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {app.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleAutoUpdate(app.id)}>
                                            <div className={`w-3 h-3 rounded-full ${app.autoUpdate ? "bg-blue-600" : "bg-zinc-300"}`}></div>
                                            <span className="text-sm text-gray-700">{app.autoUpdate ? "On" : "Off"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-600">{app.lastUpdated}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" className="h-8 rounded-none border-zinc-200 text-xs gap-1 group-hover:border-blue-300 group-hover:text-blue-700">
                                                <Settings size={14} /> Configure
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                    <DropdownMenuLabel className="text-xs font-bold text-gray-600">App Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"><ExternalLink size={14} /> Open App</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"><Power size={14} /> Restart</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"><Trash2 size={14} /> Uninstall</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
