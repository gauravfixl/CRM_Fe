"use client"

import React, { useState } from "react"
import {
    TrendingUp,
    Plus,
    Search,
    Activity,
    Target,
    Zap,
    BarChart3
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function AttributionModelsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [models, setModels] = useState([
        { id: "1", name: "First Touch", type: "Single Touch", weight: "100%", description: "Credits first interaction", status: "Active", campaigns: 45 },
        { id: "2", name: "Last Touch", type: "Single Touch", weight: "100%", description: "Credits last interaction", status: "Active", campaigns: 89 },
        { id: "3", name: "Linear", type: "Multi Touch", weight: "Equal", description: "Equal credit to all touchpoints", status: "Active", campaigns: 24 },
        { id: "4", name: "Time Decay", type: "Multi Touch", weight: "Weighted", description: "More recent gets more credit", status: "Paused", campaigns: 12 },
    ])

    const toggleStatus = (id: string) => {
        setModels(prev => prev.map(m => m.id === id ? { ...m, status: m.status === "Active" ? "Paused" : "Active" } : m))
        toast.success("Attribution model status updated.")
    }

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("modelName") as string
        if (!name) return toast.error("Model name is required")
        setModels(prev => [...prev, {
            id: String(Date.now()),
            name,
            type: formData.get("modelType") as string || "Single Touch",
            weight: "100%",
            description: formData.get("description") as string || "",
            status: "Active",
            campaigns: 0
        }])
        setShowCreateModal(false)
        toast.success(`${name} attribution model created.`)
    }

    const filtered = models.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HERO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Attribution Models</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">Configure how campaign success is attributed across touchpoints.</p>
                    </div>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="h-11 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold text-[11px] shadow-xl shadow-blue-500/20 px-6 rounded-2xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Create Model
                </Button>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wider">Attribution Models</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">{models.length}</p>
                        <p className="text-[10px] text-blue-100 font-bold flex items-center gap-1 mt-1">
                            <BarChart3 className="w-3 h-3" /> Configured
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Active Models</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{models.filter(m => m.status === "Active").length}</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3" /> In use
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total Campaigns</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{models.reduce((sum, m) => sum + m.campaigns, 0)}</p>
                        <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
                            <Zap className="w-3 h-3" /> Using attribution
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Accuracy</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">92%</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <Target className="w-3 h-3" /> Model performance
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-2xl border-slate-200 h-11 text-sm bg-white font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Model Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Weight</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Description</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Campaigns</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((model) => (
                                <tr key={model.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{model.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className="bg-blue-50 text-blue-700 border-none rounded-full text-[10px] font-bold px-3 py-1">{model.type}</Badge>
                                    </td>
                                    <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">{model.weight}</span></td>
                                    <td className="px-6 py-5"><span className="text-sm text-slate-500 font-medium">{model.description}</span></td>
                                    <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">{model.campaigns}</span></td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={model.status === "Active"} onCheckedChange={() => toggleStatus(model.id)} />
                                            <Badge className={`${model.status === "Active" ? "bg-emerald-600" : "bg-slate-400"} text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5`}>{model.status}</Badge>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE MODAL */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative">
                        <TrendingUp className="w-16 h-16 text-white/10 absolute right-4 top-4" />
                        <DialogTitle className="text-2xl font-black tracking-tight">Create Attribution Model</DialogTitle>
                        <p className="text-emerald-100 text-xs font-medium mt-2">Define how campaign touchpoints are credited.</p>
                    </div>
                    <form onSubmit={handleCreate} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Model Name</Label>
                            <Input name="modelName" placeholder="e.g., First Touch" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Model Type</Label>
                            <Select name="modelType">
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Single Touch">Single Touch</SelectItem>
                                    <SelectItem value="Multi Touch">Multi Touch</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Description</Label>
                            <Input name="description" placeholder="Describe how this model works..." className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-2xl text-sm text-slate-500 font-bold">Cancel</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-sm px-8 h-12 shadow-xl shadow-emerald-500/20 font-bold transition-all active:scale-95">Create Model</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
