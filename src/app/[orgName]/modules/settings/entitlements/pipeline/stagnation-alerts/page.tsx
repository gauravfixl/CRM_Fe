"use client";

import React, { useState } from "react";
import { AlertCircle, Clock, TrendingDown, Plus, Search, Edit, Trash2, MoreVertical, Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

export default function StagnationAlertsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [alerts, setAlerts] = useState([
        { id: "1", rule: "30 Days No Activity", threshold: "30 days", affectedDeals: 12, severity: "High", autoNotify: true, status: "Active" },
        { id: "2", rule: "Stuck in Proposal", threshold: "14 days", affectedDeals: 8, severity: "Medium", autoNotify: true, status: "Active" },
        { id: "3", rule: "No Contact Attempt", threshold: "7 days", affectedDeals: 24, severity: "Low", autoNotify: false, status: "Active" },
        { id: "4", rule: "Dormant Lead", threshold: "60 days", affectedDeals: 5, severity: "High", autoNotify: true, status: "Inactive" },
    ]);

    const [newAlert, setNewAlert] = useState({ rule: "", threshold: "", severity: "" });

    const toggleStatus = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a));
    };

    const toggleAutoNotify = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, autoNotify: !a.autoNotify } : a));
    };

    const deleteAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const handleCreate = () => {
        if (!newAlert.rule || !newAlert.threshold) return;
        const alert = {
            id: String(alerts.length + 1),
            rule: newAlert.rule,
            threshold: newAlert.threshold,
            affectedDeals: 0,
            severity: newAlert.severity || "Medium",
            autoNotify: false,
            status: "Active",
        };
        setAlerts(prev => [...prev, alert]);
        setNewAlert({ rule: "", threshold: "", severity: "" });
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-6 font-outfit p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Stagnation Alerts</h1>
                    <p className="text-xs text-gray-500 font-medium">Monitor and alert on deals that are not progressing.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                    <Plus size={16} /> Create Alert Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Alert Rules</p>
                                <p className="text-white text-xl font-semibold mt-1">{alerts.length}</p>
                                <p className="text-white text-[10px] mt-1">Configured</p>
                            </div>
                            <Bell className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Stagnant Deals</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{alerts.reduce((sum, a) => sum + a.affectedDeals, 0)}</p>
                                <p className="text-amber-600 text-[10px] mt-1">Needs attention</p>
                            </div>
                            <TrendingDown className="w-5 h-5 text-amber-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Alerts Sent</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">156</p>
                                <p className="text-blue-600 text-[10px] mt-1">This month</p>
                            </div>
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Recovery Rate</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">68%</p>
                                <p className="text-green-600 text-[10px] mt-1">Deals reactivated</p>
                            </div>
                            <RefreshCw className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Alert Rules</h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Search alerts..." className="pl-11 rounded-xl border-gray-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Threshold</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Affected Deals</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Severity</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Auto Notify</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {alerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <AlertCircle size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{alert.rule}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-gray-500" />
                                            <span className="text-sm text-gray-700">{alert.threshold}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingDown size={12} className="text-amber-600" />
                                            <span className="text-sm font-semibold text-gray-900">{alert.affectedDeals}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${alert.severity === "High" ? "bg-red-600" : alert.severity === "Medium" ? "bg-amber-600" : "bg-blue-600"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>
                                            {alert.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={alert.autoNotify} onCheckedChange={() => toggleAutoNotify(alert.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${alert.autoNotify ? "bg-green-600" : "bg-gray-400"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>
                                                {alert.autoNotify ? "Enabled" : "Disabled"}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={alert.status === "Active"} onCheckedChange={() => toggleStatus(alert.id)} className="data-[state=checked]:bg-green-600" />
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
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteAlert(alert.id)} className="text-sm p-2 rounded-lg text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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
                        <h2 className="text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Create Alert Rule</h2>
                        <p className="text-xs opacity-80 mt-0.5">Define stagnation thresholds for deal monitoring.</p>
                    </div>
                    <div className="px-5 py-4 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Rule Name</Label>
                            <Input
                                placeholder="e.g., 30 Days No Activity"
                                value={newAlert.rule}
                                onChange={(e) => setNewAlert(prev => ({ ...prev, rule: e.target.value }))}
                                className="rounded-lg border-gray-200 h-9 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Threshold</Label>
                                <Select onValueChange={(val) => setNewAlert(prev => ({ ...prev, threshold: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select threshold" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="7 days">7 Days</SelectItem>
                                        <SelectItem value="14 days">14 Days</SelectItem>
                                        <SelectItem value="30 days">30 Days</SelectItem>
                                        <SelectItem value="60 days">60 Days</SelectItem>
                                        <SelectItem value="90 days">90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Severity</Label>
                                <Select onValueChange={(val) => setNewAlert(prev => ({ ...prev, severity: val }))}>
                                    <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                        <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-gray-600 h-9">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-6 h-9 shadow-sm font-semibold">Create Alert Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
