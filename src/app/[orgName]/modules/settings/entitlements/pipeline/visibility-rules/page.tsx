"use client";

import React, { useState } from "react";
import { Eye, Users, Plus, Search, Edit, Trash2, MoreVertical, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

export default function VisibilityRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rules, setRules] = useState([
        { id: "1", name: "Team Visibility", scope: "Team Members", canView: true, canEdit: false, canDelete: false, status: "Active" },
        { id: "2", name: "Manager Override", scope: "Managers", canView: true, canEdit: true, canDelete: false, status: "Active" },
        { id: "3", name: "Admin Full Access", scope: "Admins", canView: true, canEdit: true, canDelete: true, status: "Active" },
        { id: "4", name: "External Partner View", scope: "Partners", canView: true, canEdit: false, canDelete: false, status: "Inactive" },
    ]);

    const [newRule, setNewRule] = useState({ name: "", scope: "" });

    const toggleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r));
    };

    const togglePermission = (id: string, perm: "canView" | "canEdit" | "canDelete") => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, [perm]: !r[perm] } : r));
    };

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const handleCreate = () => {
        if (!newRule.name || !newRule.scope) return;
        const rule = {
            id: String(rules.length + 1),
            name: newRule.name,
            scope: newRule.scope,
            canView: true,
            canEdit: false,
            canDelete: false,
            status: "Active",
        };
        setRules(prev => [...prev, rule]);
        setNewRule({ name: "", scope: "" });
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-6 font-outfit p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">Visibility Rules</h1>
                    <p className="text-xs text-gray-500 font-medium">Control who can view and edit pipeline deals.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Visibility Rules</p>
                                <p className="text-white text-xl font-semibold mt-1">{rules.length}</p>
                                <p className="text-white text-[10px] mt-1">Configured</p>
                            </div>
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Protected Deals</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">1,204</p>
                                <p className="text-green-600 text-[10px] mt-1">Access controlled</p>
                            </div>
                            <Shield className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">User Groups</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">8</p>
                                <p className="text-blue-600 text-[10px] mt-1">With permissions</p>
                            </div>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Compliance</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">100%</p>
                                <p className="text-green-600 text-[10px] mt-1">All rules enforced</p>
                            </div>
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900">Access Control Rules</h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="Search rules..." className="pl-11 rounded-xl border-gray-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Scope</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Can View</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Can Edit</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Can Delete</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Eye size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{rule.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-xs font-medium px-2.5 py-0.5 flex items-center gap-1 w-fit">
                                            <Users size={10} /> {rule.scope}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4"><Switch checked={rule.canView} onCheckedChange={() => togglePermission(rule.id, "canView")} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={rule.canEdit} onCheckedChange={() => togglePermission(rule.id, "canEdit")} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4"><Switch checked={rule.canDelete} onCheckedChange={() => togglePermission(rule.id, "canDelete")} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={rule.status === "Active"} onCheckedChange={() => toggleStatus(rule.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-gray-400"} text-white border-none rounded-full text-xs font-medium px-2.5 py-0.5`}>{rule.status}</Badge>
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
                                                <DropdownMenuItem onClick={() => deleteRule(rule.id)} className="text-sm p-2 rounded-lg text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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
                        <h2 className="text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Create Visibility Rule</h2>
                        <p className="text-xs opacity-80 mt-0.5">Define access control for pipeline data visibility.</p>
                    </div>
                    <div className="px-5 py-4 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Rule Name</Label>
                            <Input
                                placeholder="e.g., Team Visibility"
                                value={newRule.name}
                                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                                className="rounded-lg border-gray-200 h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Scope</Label>
                            <Select onValueChange={(val) => setNewRule(prev => ({ ...prev, scope: val }))}>
                                <SelectTrigger className="rounded-lg border-gray-200 h-9 text-sm">
                                    <SelectValue placeholder="Select user group" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="Team Members">Team Members</SelectItem>
                                    <SelectItem value="Managers">Managers</SelectItem>
                                    <SelectItem value="Admins">Admins</SelectItem>
                                    <SelectItem value="Partners">Partners</SelectItem>
                                    <SelectItem value="Executives">Executives</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-lg text-xs text-gray-600 h-9">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs px-6 h-9 shadow-sm font-semibold">Create Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
