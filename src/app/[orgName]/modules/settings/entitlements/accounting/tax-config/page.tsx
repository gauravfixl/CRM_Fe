"use client";

import React, { useState } from "react";
import { Calculator, Plus, Search, Filter, MoreVertical, Edit, Trash2, Globe, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

export default function TaxConfigPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [taxConfigs, setTaxConfigs] = useState([
        { id: "1", name: "US Sales Tax", type: "Sales Tax", rate: "8.5%", scope: "Global", regions: "US", status: "Active" },
        { id: "2", name: "EU VAT", type: "VAT", rate: "20%", scope: "Global", regions: "EU", status: "Active" },
        { id: "3", name: "India GST", type: "GST", rate: "18%", scope: "Firm", regions: "India", status: "Active" },
        { id: "4", name: "Canada HST", type: "HST", rate: "13%", scope: "Global", regions: "Canada", status: "Paused" },
    ]);

    const toggleStatus = (id: string) => {
        setTaxConfigs(prev => prev.map(t => t.id === id ? { ...t, status: t.status === "Active" ? "Paused" : "Active" } : t));
    };

    const deleteConfig = (id: string) => {
        setTaxConfigs(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-4 text-[12.5px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Tax Configuration (Global/Firm)</h1>
                    <p className="text-xs text-slate-500">Manage tax rules and rates for different jurisdictions.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4">
                    <Plus size={16} /> Add Tax Rule
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Total Tax Rules</p>
                    <h2 className="text-xl font-semibold text-white">{taxConfigs.length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Active Rules</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter(t => t.status === "Active").length}</h3>
                    <p className="text-[10px] text-green-600 mt-1">Currently applied</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Global Scope</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter(t => t.scope === "Global").length}</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Organization-wide</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Firm Scope</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter(t => t.scope === "Firm").length}</h3>
                    <p className="text-[10px] text-purple-600 mt-1">Firm-specific</p>
                </div>
            </div>

            {/* Tax Configs List */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search tax rules..." className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-lg border-zinc-200 h-8 text-xs font-medium gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Tax Name</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Type</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Rate</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Scope</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Regions</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {taxConfigs.map((config) => (
                                <tr key={config.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <Calculator size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{config.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {config.type}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{config.rate}</span></td>
                                    <td className="px-5 py-3">
                                        <Badge className={`${config.scope === "Global" ? "bg-indigo-600" : "bg-purple-600"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {config.scope === "Global" ? <Globe size={10} /> : <Building2 size={10} />} {config.scope}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs text-gray-700">{config.regions}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={config.status === "Active"} onCheckedChange={() => toggleStatus(config.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${config.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>{config.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-slate-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteConfig(config.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {taxConfigs.length} tax rules</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        View Tax Reports <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden shadow-lg border-none">
                    <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-5 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator size={80} /></div>
                        <h2 className="text-sm font-semibold flex items-center gap-3"><Plus size={18} /> Add Tax Rule</h2>
                        <p className="text-xs opacity-80 mt-1">Configure tax rates for different jurisdictions.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-500">Tax Name</Label>
                            <Input placeholder="e.g., US Sales Tax" className="rounded-lg border-zinc-200 h-9 text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Tax Type</Label>
                                <Select><SelectTrigger className="rounded-lg border-zinc-200 h-9 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent className="rounded-lg"><SelectItem value="sales">Sales Tax</SelectItem><SelectItem value="vat">VAT</SelectItem><SelectItem value="gst">GST</SelectItem><SelectItem value="hst">HST</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Tax Rate (%)</Label>
                                <Input type="number" placeholder="e.g., 8.5" className="rounded-lg border-zinc-200 h-9 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Scope</Label>
                                <Select><SelectTrigger className="rounded-lg border-zinc-200 h-9 text-xs"><SelectValue placeholder="Select scope" /></SelectTrigger><SelectContent className="rounded-lg"><SelectItem value="global">Global (Organization-wide)</SelectItem><SelectItem value="firm">Firm (Specific firm)</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500">Regions</Label>
                                <Input placeholder="e.g., US, EU" className="rounded-lg border-zinc-200 h-9 text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-500">Description (Optional)</Label>
                            <Textarea placeholder="Additional details about this tax rule..." className="rounded-lg border-zinc-200 min-h-[80px] text-xs" />
                        </div>
                    </div>
                    <DialogFooter className="p-5 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-slate-500">Cancel</Button>
                        <Button className="bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium px-4 h-8 shadow-sm">Create Tax Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
