"use client"

import React, { useState } from "react"
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
    Activity,
    DollarSign,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function CampaignTypesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [campaignTypes, setCampaignTypes] = useState([
        { id: "1", name: "Email Campaign", category: "Email Marketing", channels: ["Email"], defaultBudget: "$5,000", status: "Active", usage: 156 },
        { id: "2", name: "Social Media Ads", category: "Paid Advertising", channels: ["Facebook", "LinkedIn"], defaultBudget: "$10,000", status: "Active", usage: 89 },
        { id: "3", name: "Webinar Series", category: "Events", channels: ["Email", "Social"], defaultBudget: "$3,000", status: "Active", usage: 24 },
        { id: "4", name: "Content Marketing", category: "Organic", channels: ["Blog", "SEO"], defaultBudget: "$2,000", status: "Paused", usage: 45 },
    ])

    const toggleStatus = (id: string) => {
        setCampaignTypes(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c))
        toast.success("Campaign type status updated.")
    }

    const deleteType = (id: string) => {
        setCampaignTypes(prev => prev.filter(c => c.id !== id))
        toast.success("Campaign type deleted.")
    }

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("typeName") as string
        if (!name) return toast.error("Type name is required")
        setCampaignTypes(prev => [...prev, {
            id: String(Date.now()),
            name,
            category: formData.get("category") as string || "General",
            channels: ["Email"],
            defaultBudget: `$${formData.get("budget") || "0"}`,
            status: "Active",
            usage: 0
        }])
        setShowCreateModal(false)
        toast.success(`${name} campaign type created.`)
    }

    const filtered = campaignTypes.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HERO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Campaign Types</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">Define and manage different types of marketing campaigns across your organization.</p>
                    </div>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="h-11 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold text-[11px] shadow-xl shadow-blue-500/20 px-6 rounded-2xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Create Type
                </Button>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wider">Campaign Types</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">{campaignTypes.length}</p>
                        <p className="text-[10px] text-blue-100 font-bold flex items-center gap-1 mt-1">
                            <Megaphone className="w-3 h-3" /> Configured
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Active Types</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{campaignTypes.filter(c => c.status === "Active").length}</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3" /> Currently available
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total Campaigns</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{campaignTypes.reduce((sum, c) => sum + c.usage, 0)}</p>
                        <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
                            <Zap className="w-3 h-3" /> Created
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total Budget</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">$20K</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <DollarSign className="w-3 h-3" /> Default allocation
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search campaign types..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-2xl border-slate-200 h-11 text-sm bg-white font-medium"
                        />
                    </div>
                    <Button variant="outline" className="rounded-2xl border-slate-200 h-11 text-[11px] font-bold gap-2 hover:border-blue-500 transition-all">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Type Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Channels</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Default Budget</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((type) => (
                                <tr key={type.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl border border-pink-100 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                                <Megaphone className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{type.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className="bg-blue-50 text-blue-700 border-none rounded-full text-[10px] font-bold px-3 py-1">{type.category}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-1 flex-wrap">
                                            {type.channels.map((channel, idx) => (
                                                <Badge key={idx} className="bg-slate-100 text-slate-600 border-none rounded-full text-[10px] font-bold px-2 py-0.5">{channel}</Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">{type.defaultBudget}</span></td>
                                    <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">{type.usage}</span></td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={type.status === "Active"} onCheckedChange={() => toggleStatus(type.id)} />
                                            <Badge className={`${type.status === "Active" ? "bg-emerald-600" : "bg-slate-400"} text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5`}>{type.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-200 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-bold text-slate-400">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-sm font-bold p-2 flex items-center gap-2 rounded-xl focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit className="w-4 h-4" /> Edit Type
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem onClick={() => deleteType(type.id)} className="text-sm font-bold p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 rounded-xl cursor-pointer">
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest">Showing {filtered.length} campaign types</p>
                    <Button variant="ghost" className="text-xs font-bold text-blue-600 gap-1 hover:bg-white transition-all active:scale-95">
                        View Analytics <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-br from-pink-600 to-rose-700 p-8 text-white relative">
                        <Megaphone className="w-16 h-16 text-white/10 absolute right-4 top-4" />
                        <DialogTitle className="text-2xl font-black tracking-tight">Create Campaign Type</DialogTitle>
                        <p className="text-pink-100 text-xs font-medium mt-2">Define a new campaign type for your marketing efforts.</p>
                    </div>
                    <form onSubmit={handleCreate} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Type Name</Label>
                            <Input name="typeName" placeholder="e.g., Email Campaign" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400">Category</Label>
                                <Select name="category">
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                                        <SelectItem value="Paid Advertising">Paid Advertising</SelectItem>
                                        <SelectItem value="Events">Events</SelectItem>
                                        <SelectItem value="Organic">Organic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400">Default Budget</Label>
                                <Input name="budget" type="number" placeholder="e.g., 5000" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Description (Optional)</Label>
                            <Textarea name="description" placeholder="Describe this campaign type..." className="bg-slate-50 border-slate-100 rounded-2xl min-h-[80px] font-medium" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-2xl text-sm text-slate-500 font-bold">Cancel</Button>
                            <Button type="submit" className="bg-pink-600 hover:bg-pink-700 rounded-2xl text-sm px-8 h-12 shadow-xl shadow-pink-500/20 font-bold transition-all active:scale-95">Create Type</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
