"use client";

import React, { useState } from "react";
import { Zap, Plus, Search, Play, Edit, Trash2, MoreVertical, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

export default function ProcessAutomationPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [automations, setAutomations] = useState([
        { id: "1", name: "Auto-assign to Rep", trigger: "Deal Created", action: "Assign Owner", conditions: 2, status: "Active", executions: 1204 },
        { id: "2", name: "Stage Progression Alert", trigger: "Stage Changed", action: "Send Email", conditions: 1, status: "Active", executions: 856 },
        { id: "3", name: "Stale Deal Reminder", trigger: "Time-Based", action: "Create Task", conditions: 3, status: "Active", executions: 342 },
        { id: "4", name: "Win Notification", trigger: "Deal Won", action: "Send Slack", conditions: 1, status: "Inactive", executions: 128 },
    ]);

    const [newAutomation, setNewAutomation] = useState({ name: "", trigger: "", action: "", description: "" });

    const toggleStatus = (id: string) => {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a));
    };

    const deleteAutomation = (id: string) => {
        setAutomations(prev => prev.filter(a => a.id !== id));
    };

    const handleCreate = () => {
        if (!newAutomation.name || !newAutomation.trigger) return;
        const automation = {
            id: String(automations.length + 1),
            name: newAutomation.name,
            trigger: newAutomation.trigger,
            action: newAutomation.action || "Notification",
            conditions: 0,
            status: "Active",
            executions: 0,
        };
        setAutomations(prev => [...prev, automation]);
        setNewAutomation({ name: "", trigger: "", action: "", description: "" });
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-6 font-outfit p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Process Automation</h1>
                    <p className="text-xs text-gray-500 font-medium">Automate pipeline workflows and deal progression.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                    <Plus size={16} /> Create Automation
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Automations</p>
                                <p className="text-white text-xl font-semibold mt-1">{automations.length}</p>
                                <p className="text-white text-[10px] mt-1">Configured</p>
                            </div>
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Total Executions</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{automations.reduce((sum, a) => sum + a.executions, 0).toLocaleString()}</p>
                                <p className="text-green-600 text-[10px] mt-1">This month</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Success Rate</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">99.2%</p>
                                <p className="text-blue-600 text-[10px] mt-1">Highly reliable</p>
                            </div>
                            <Play className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Time Saved</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">240 hrs</p>
                                <p className="text-purple-600 text-[10px] mt-1">This month</p>
                            </div>
                            <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Search automations..." className="pl-11 rounded-xl border-gray-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Automation Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Trigger</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Conditions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Executions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {automations.map((auto) => (
                                <tr key={auto.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <Zap size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{auto.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs font-medium px-2.5 py-0.5">{auto.trigger}</Badge></td>
                                    <td className="px-6 py-4"><Badge className="bg-green-50 text-green-700 border-green-200 rounded-full text-xs font-medium px-2.5 py-0.5">{auto.action}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{auto.conditions}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-900">{auto.executions.toLocaleString()}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={auto.status === "Active"} onCheckedChange={() => toggleStatus(auto.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${auto.status === "Active" ? "bg-green-600" : "bg-gray-400"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>{auto.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-gray-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 rounded-lg flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Play size={14} /> Test Run
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm p-2 rounded-lg flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteAutomation(auto.id)} className="text-sm p-2 rounded-lg text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
                        <h2 className="text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Create Automation</h2>
                        <p className="text-xs opacity-80 mt-0.5">Set up automated workflow actions for your pipeline.</p>
                    </div>
                    <div className="px-5 py-4 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Automation Name</Label>
                            <Input
                                placeholder="e.g., Auto-assign to Rep"
                                value={newAutomation.name}
                                onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                                className="rounded-lg border-gray-200 h-9 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Trigger</Label>
                                <Select onValueChange={(val) => setNewAutomation(prev => ({ ...prev, trigger: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select trigger" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="Deal Created">Deal Created</SelectItem>
                                        <SelectItem value="Stage Changed">Stage Changed</SelectItem>
                                        <SelectItem value="Time-Based">Time-Based</SelectItem>
                                        <SelectItem value="Deal Won">Deal Won</SelectItem>
                                        <SelectItem value="Deal Lost">Deal Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Action</Label>
                                <Select onValueChange={(val) => setNewAutomation(prev => ({ ...prev, action: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="Assign Owner">Assign Owner</SelectItem>
                                        <SelectItem value="Send Email">Send Email</SelectItem>
                                        <SelectItem value="Create Task">Create Task</SelectItem>
                                        <SelectItem value="Send Slack">Send Slack</SelectItem>
                                        <SelectItem value="Notification">Notification</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Description (Optional)</Label>
                            <Textarea
                                placeholder="Describe this automation..."
                                value={newAutomation.description}
                                onChange={(e) => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
                                className="rounded-lg border-gray-200 min-h-[60px] text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-gray-600 h-9">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-6 h-9 shadow-sm font-semibold">Create Automation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
