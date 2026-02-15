"use client";

import React, { useState } from "react";
import {
    Bell,
    Plus,
    Mail,
    MessageSquare,
    Smartphone,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Users,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

export default function NotificationRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [notificationRules, setNotificationRules] = useState([
        { id: "1", name: "New Lead Assignment", trigger: "Lead Assigned", channels: ["Email", "In-App"], recipients: "Sales Team", status: "Active" },
        { id: "2", name: "Task Deadline Alert", trigger: "Task Due in 24h", channels: ["Email", "SMS"], recipients: "Task Owner", status: "Active" },
        { id: "3", name: "Deal Won Celebration", trigger: "Deal Closed Won", channels: ["In-App", "Slack"], recipients: "All Sales", status: "Active" },
        { id: "4", name: "Leave Request Notification", trigger: "Leave Submitted", channels: ["Email"], recipients: "Manager", status: "Paused" },
    ]);

    const toggleStatus = (id: string) => {
        setNotificationRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" } : rule
        ));
    };

    const deleteRule = (id: string) => {
        setNotificationRules(prev => prev.filter(rule => rule.id !== id));
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "Email": return <Mail size={12} />;
            case "SMS": return <Smartphone size={12} />;
            case "In-App": return <Bell size={12} />;
            case "Slack": return <MessageSquare size={12} />;
            default: return <Bell size={12} />;
        }
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Notification Rules</h1>
                    <p className="text-sm text-gray-600">Configure automated notifications across multiple channels.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Active Rules</p>
                    <h2 className="text-white text-2xl font-bold">{notificationRules.filter(r => r.status === "Active").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Currently running</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Notifications Sent</p>
                    <h3 className="text-2xl font-bold text-gray-900">12,450</h3>
                    <p className="text-blue-600 text-xs mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Delivery Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">99.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Open Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">68.5%</h3>
                    <p className="text-blue-600 text-xs mt-1">Above average</p>
                </div>
            </div>

            {/* Rules List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search notification rules..."
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger Event</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Channels</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Recipients</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {notificationRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <Bell size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{rule.trigger}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            {rule.channels.map((channel, idx) => (
                                                <Badge key={idx} className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                                                    {getChannelIcon(channel)} {channel}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Users size={12} /> {rule.recipients}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={rule.status === "Active"}
                                                onCheckedChange={() => toggleStatus(rule.id)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {rule.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Bell size={14} /> Test Notification
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteRule(rule.id)}
                                                    className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {notificationRules.length} notification rules</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bell size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Plus size={24} /> Create Notification Rule
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Set up automated notifications for your team.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Rule Name</Label>
                            <Input placeholder="e.g., New Lead Assignment" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="lead-assigned">Lead Assigned</SelectItem>
                                    <SelectItem value="task-due">Task Due Soon</SelectItem>
                                    <SelectItem value="deal-won">Deal Closed Won</SelectItem>
                                    <SelectItem value="leave-submitted">Leave Submitted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Notification Channels</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Email", "SMS", "In-App", "Slack"].map((channel) => (
                                    <label key={channel} className="flex items-center gap-2 p-3 border border-zinc-200 rounded-none cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                                        <input type="checkbox" className="rounded-none" />
                                        <span className="text-sm font-bold text-gray-700">{channel}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-amber-600 hover:bg-amber-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-amber-100">
                            Create Rule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
