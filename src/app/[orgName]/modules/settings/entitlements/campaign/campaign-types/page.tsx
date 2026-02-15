"use client";

import React, { useState } from "react";
import { Megaphone, Plus, Search, Filter, MoreVertical, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

export default function CampaignTypesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [campaignTypes, setCampaignTypes] = useState([
        { id: "1", name: "Email Campaign", category: "Email Marketing", channels: ["Email"], defaultBudget: "$5,000", status: "Active", usage: 156 },
        { id: "2", name: "Social Media Ads", category: "Paid Advertising", channels: ["Facebook", "LinkedIn"], defaultBudget: "$10,000", status: "Active", usage: 89 },
        { id: "3", name: "Webinar Series", category: "Events", channels: ["Email", "Social"], defaultBudget: "$3,000", status: "Active", usage: 24 },
        { id: "4", name: "Content Marketing", category: "Organic", channels: ["Blog", "SEO"], defaultBudget: "$2,000", status: "Paused", usage: 45 },
    ]);

    const toggleStatus = (id: string) => {
        setCampaignTypes(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c));
    };

    const deleteType = (id: string) => {
        setCampaignTypes(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Campaign Types</h1>
                    <p className="text-sm text-gray-600">Define and manage different types of marketing campaigns.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Type
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Campaign Types</p>
                    <h2 className="text-white text-2xl font-bold">{campaignTypes.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active Types</p>
                    <h3 className="text-2xl font-bold text-gray-900">{campaignTypes.filter(c => c.status === "Active").length}</h3>
                    <p className="text-green-600 text-xs mt-1">Currently available</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Campaigns</p>
                    <h3 className="text-2xl font-bold text-gray-900">{campaignTypes.reduce((sum, c) => sum + c.usage, 0)}</h3>
                    <p className="text-blue-600 text-xs mt-1">Created</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Budget</p>
                    <h3 className="text-2xl font-bold text-gray-900">$20K</h3>
                    <p className="text-purple-600 text-xs mt-1">Default allocation</p>
                </div>
            </div>

            {/* Campaign Types List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search campaign types..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Channels</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Default Budget</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {campaignTypes.map((type) => (
                                <tr key={type.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-50 text-pink-600 rounded-none border border-pink-100 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                                <Megaphone size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{type.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {type.category}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {type.channels.map((channel, idx) => (
                                                <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                    {channel}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{type.defaultBudget}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{type.usage}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={type.status === "Active"} onCheckedChange={() => toggleStatus(type.id)} className="data-[state=checked]:bg-green-600" />
                                            <Badge className={`${type.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>{type.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Type
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem onClick={() => deleteType(type.id)} className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer">
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
                    <p className="text-sm text-gray-600">Showing {campaignTypes.length} campaign types</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Campaign Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-pink-700 to-rose-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Megaphone size={80} /></div>
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Create Campaign Type</h2>
                        <p className="text-sm opacity-80 mt-2">Define a new campaign type for your marketing efforts.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Type Name</Label>
                            <Input placeholder="e.g., Email Campaign" className="rounded-none border-zinc-200 h-12 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Category</Label>
                                <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="email">Email Marketing</SelectItem><SelectItem value="paid">Paid Advertising</SelectItem><SelectItem value="events">Events</SelectItem><SelectItem value="organic">Organic</SelectItem></SelectContent></Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-600">Default Budget</Label>
                                <Input type="number" placeholder="e.g., 5000" className="rounded-none border-zinc-200 h-12 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Description (Optional)</Label>
                            <Textarea placeholder="Describe this campaign type..." className="rounded-none border-zinc-200 min-h-[80px] text-sm" />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-pink-600 hover:bg-pink-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-pink-100">Create Type</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
