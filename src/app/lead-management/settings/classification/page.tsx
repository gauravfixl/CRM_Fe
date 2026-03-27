"use client"

import React, { useState, useEffect } from "react"
import {
    Tags, Plus, Pencil, Trash2, X, MoreHorizontal, Settings2, ShieldCheck,
    CheckCircle2, AlertCircle, Layout, Tag, Circle, AlertOctagon, Hash
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"

type TabType = "statuses" | "tags" | "reasons"

interface LeadStatus { id: string; name: string; color: string; leadCount: number; active: boolean }
interface GlobalTag { id: string; name: string; color: string; usageCount: number }
interface LossReason { id: string; reason: string; frequency: number; impactLevel: "High" | "Medium" | "Low" }

const INITIAL_STATUSES: LeadStatus[] = [
    { id: "LS1", name: "New", color: "bg-blue-500", leadCount: 142, active: true },
    { id: "LS2", name: "Contacted", color: "bg-indigo-500", leadCount: 89, active: true },
    { id: "LS3", name: "Qualified", color: "bg-purple-500", leadCount: 56, active: true },
    { id: "LS4", name: "Proposal", color: "bg-amber-500", leadCount: 34, active: true },
    { id: "LS5", name: "Negotiation", color: "bg-orange-500", leadCount: 18, active: true },
    { id: "LS6", name: "Won", color: "bg-emerald-500", leadCount: 290, active: true },
    { id: "LS7", name: "Lost", color: "bg-rose-500", leadCount: 120, active: true },
]

const INITIAL_TAGS: GlobalTag[] = [
    { id: "T1", name: "Hot Lead", color: "bg-rose-500", usageCount: 312 },
    { id: "T2", name: "Enterprise", color: "bg-indigo-500", usageCount: 145 },
    { id: "T3", name: "High Value", color: "bg-amber-500", usageCount: 98 },
    { id: "T4", name: "Referral", color: "bg-emerald-500", usageCount: 76 },
    { id: "T5", name: "Trial User", color: "bg-blue-500", usageCount: 211 },
]

const INITIAL_REASONS: LossReason[] = [
    { id: "R1", reason: "Budget Constraints", frequency: 34, impactLevel: "High" },
    { id: "R2", reason: "Chose Competitor", frequency: 28, impactLevel: "High" },
    { id: "R3", reason: "No Decision Made", frequency: 19, impactLevel: "Medium" },
    { id: "R4", reason: "Product Mismatch", frequency: 12, impactLevel: "Medium" },
    { id: "R5", reason: "Lost Contact", frequency: 7, impactLevel: "Low" },
]

const COLORS = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-orange-500", "bg-cyan-500"]

const STAT_CARDS = [
    { label: "Active Statuses", value: "8", sub: "Operational flow", icon: Layout, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Loss Reasons", value: "12", sub: "Churn analytics", icon: AlertCircle, bg: "bg-rose-50/10", text: "text-rose-600", border: "border-rose-100/20" },
    { label: "Global Tags", value: "142", sub: "Meta categorization", icon: Tag, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Policy Guard", value: "Active", sub: "Strict enforcement", icon: ShieldCheck, bg: "bg-slate-900", text: "text-white", border: "border-slate-800" },
]

export default function ClassificationPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [activeTab, setActiveTab] = useState<TabType>("statuses")
    const [statuses, setStatuses] = useState<LeadStatus[]>(INITIAL_STATUSES)
    const [tags, setTags] = useState<GlobalTag[]>(INITIAL_TAGS)
    const [reasons, setReasons] = useState<LossReason[]>(INITIAL_REASONS)
    const [enforceRoR, setEnforceRoR] = useState(true)
    const [enforceTag, setEnforceTag] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<any>(null)
    const [editItem, setEditItem] = useState<any>(null)
    const [newItem, setNewItem] = useState({ name: "", reason: "", color: "bg-blue-500", impactLevel: "Medium" as "High" | "Medium" | "Low" })

    useEffect(() => { setIsClient(true) }, [])

    const handleAdd = () => {
        if (activeTab === "statuses") {
            if (!newItem.name) { toast({ title: "Name required" }); return }
            setStatuses([...statuses, { id: `LS${Date.now()}`, name: newItem.name, color: newItem.color, leadCount: 0, active: true }])
            toast({ title: "✅ Status Added", description: `"${newItem.name}" added.` })
        } else if (activeTab === "tags") {
            if (!newItem.name) { toast({ title: "Name required" }); return }
            setTags([...tags, { id: `T${Date.now()}`, name: newItem.name, color: newItem.color, usageCount: 0 }])
            toast({ title: "✅ Tag Added", description: `"${newItem.name}" created.` })
        } else {
            if (!newItem.reason) { toast({ title: "Reason required" }); return }
            setReasons([...reasons, { id: `R${Date.now()}`, reason: newItem.reason, frequency: 0, impactLevel: newItem.impactLevel }])
            toast({ title: "✅ Reason Added", description: `"${newItem.reason}" added.` })
        }
        setShowModal(false)
        setNewItem({ name: "", reason: "", color: "bg-blue-500", impactLevel: "Medium" })
    }

    const handleDelete = () => {
        if (!deleteConfirm) return
        if (activeTab === "statuses") setStatuses(statuses.filter(s => s.id !== deleteConfirm.id))
        else if (activeTab === "tags") setTags(tags.filter(t => t.id !== deleteConfirm.id))
        else setReasons(reasons.filter(r => r.id !== deleteConfirm.id))
        toast({ title: "Removed successfully" })
        setDeleteConfirm(null)
    }

    const handleToggleStatus = (id: string) => {
        setStatuses(statuses.map(s => s.id === id ? { ...s, active: !s.active } : s))
    }

    if (!isClient) return null

    const tabConfig = [
        { key: "statuses" as TabType, label: "Lead Statuses", count: statuses.length },
        { key: "tags" as TabType, label: "Global Tags", count: tags.length },
        { key: "reasons" as TabType, label: "Loss Reasons", count: reasons.length },
    ]

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-amber-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100"><Tags className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                            Lead Classification & Governance
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Standardize classification vocabulary across your entire pipeline.</p>
                </div>
                <Button onClick={() => setShowModal(true)} className="h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-amber-100">
                    <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content */}
                <Card className="lg:col-span-9 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                    {/* Tabs */}
                    <div className="flex rounded-xl bg-slate-50 p-1 gap-1 w-fit">
                        {tabConfig.map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[12px] font-black uppercase tracking-wide transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>
                                {t.label}
                                <Badge className={`border-none text-[9px] font-black px-1.5 h-4 ${activeTab === t.key ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>{t.count}</Badge>
                            </button>
                        ))}
                    </div>

                    {/* Statuses */}
                    {activeTab === "statuses" && (
                        <div className="space-y-3">
                            {statuses.map((s) => (
                                <div key={s.id} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 transition-all group">
                                    <div className={`h-4 w-4 rounded-full ${s.color} shrink-0`} />
                                    <div className="flex-1">
                                        <p className="text-[14px] font-bold text-slate-900">{s.name}</p>
                                        <p className="text-[11px] text-slate-400">{s.leadCount} active leads</p>
                                    </div>
                                    <Switch checked={s.active} onCheckedChange={() => handleToggleStatus(s.id)} className="data-[state=checked]:bg-emerald-500" />
                                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(s)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 size={14} /></Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tags */}
                    {activeTab === "tags" && (
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <div key={tag.id} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-100 bg-white hover:shadow-md transition-all group">
                                    <div className={`h-2.5 w-2.5 rounded-full ${tag.color} shrink-0`} />
                                    <span className="text-[13px] font-bold text-slate-900">{tag.name}</span>
                                    <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-black">{tag.usageCount}</Badge>
                                    <button onClick={() => setDeleteConfirm(tag)} className="text-slate-300 hover:text-rose-500 transition-colors ml-1">
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Loss Reasons */}
                    {activeTab === "reasons" && (
                        <div className="space-y-3">
                            {reasons.map((r) => (
                                <div key={r.id} className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 hover:border-rose-100 transition-all group">
                                    <div className={`h-2 w-full max-w-[60px] rounded-full ${r.impactLevel === 'High' ? 'bg-rose-400' : r.impactLevel === 'Medium' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                                    <div className="flex-1">
                                        <p className="text-[14px] font-bold text-slate-900">{r.reason}</p>
                                        <p className="text-[11px] text-slate-400">{r.frequency} occurrences</p>
                                    </div>
                                    <Badge className={`border-none text-[9px] font-black uppercase ${r.impactLevel === 'High' ? 'bg-rose-50 text-rose-600' : r.impactLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {r.impactLevel} Impact
                                    </Badge>
                                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(r)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 size={14} /></Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Governance Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-7 space-y-6">
                        <h4 className="text-[14px] font-black">Classification Guard</h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold">Enforce Loss Reason</span>
                                    <Switch checked={enforceRoR} onCheckedChange={setEnforceRoR} className="data-[state=checked]:bg-amber-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Require a reason when moving to "Lost".</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold">Restrict Custom Tags</span>
                                    <Switch checked={enforceTag} onCheckedChange={setEnforceTag} className="data-[state=checked]:bg-amber-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Only allow tags from the approved list.</p>
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "Guard Settings Saved" })} className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl border-none text-[11px] uppercase tracking-widest">
                            Save Guard Rules
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">
                                Add {activeTab === "statuses" ? "Status" : activeTab === "tags" ? "Tag" : "Loss Reason"}
                            </h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            {activeTab !== "reasons" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Name</Label>
                                    <Input placeholder={activeTab === "statuses" ? "e.g. Demo Scheduled" : "e.g. VIP Client"}
                                        value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                                </div>
                            )}
                            {activeTab === "reasons" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Reason Text</Label>
                                    <Input placeholder="e.g. Timing Not Right"
                                        value={newItem.reason} onChange={e => setNewItem({ ...newItem, reason: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                                </div>
                            )}
                            {activeTab !== "reasons" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Color</Label>
                                    <div className="flex gap-3 flex-wrap">
                                        {COLORS.map(c => (
                                            <button key={c} onClick={() => setNewItem({ ...newItem, color: c })}
                                                className={`h-8 w-8 rounded-full ${c} transition-all ${newItem.color === c ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-50 hover:opacity-100'}`} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === "reasons" && (
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Impact Level</Label>
                                    <div className="flex gap-3">
                                        {(["High", "Medium", "Low"] as const).map(level => (
                                            <button key={level} onClick={() => setNewItem({ ...newItem, impactLevel: level })}
                                                className={`flex-1 py-2.5 rounded-xl text-[12px] font-black uppercase border transition-all ${newItem.impactLevel === level ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleAdd} className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl border-none">Add</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600"><Trash2 size={26} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Remove Item?</h2>
                            <p className="text-[13px] text-slate-500 font-medium">"{deleteConfirm.name || deleteConfirm.reason}" will be deleted permanently.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={handleDelete} className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none">Remove</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
