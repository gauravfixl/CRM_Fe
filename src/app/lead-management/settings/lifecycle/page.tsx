"use client"

import React, { useState, useEffect } from "react"
import {
    GitCommitHorizontal, Plus, Pencil, Trash2, X, GripVertical,
    MoreHorizontal, Settings2, ShieldCheck, CheckCircle2, Circle,
    Zap, Layers, Target, TrendingUp, Activity
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"

interface Stage {
    id: string
    name: string
    probability: number
    required: boolean
    color: string
    description: string
}

const INITIAL_STAGES: Stage[] = [
    { id: "S1", name: "New Ingestion", probability: 10, required: true, color: "bg-slate-500", description: "Lead enters the system from any source." },
    { id: "S2", name: "Outreach", probability: 25, required: true, color: "bg-blue-500", description: "Initial contact attempted by rep." },
    { id: "S3", name: "Qualification", probability: 45, required: true, color: "bg-indigo-500", description: "Confirm budget, authority, need, timeline." },
    { id: "S4", name: "Proposal Sent", probability: 65, required: false, color: "bg-purple-500", description: "Formal proposal or demo scheduled." },
    { id: "S5", name: "Negotiation", probability: 80, required: false, color: "bg-amber-500", description: "Terms being discussed with decision maker." },
    { id: "S6", name: "Closed Won", probability: 100, required: true, color: "bg-emerald-500", description: "Deal is confirmed and signed." },
    { id: "S7", name: "Closed Lost", probability: 0, required: true, color: "bg-rose-500", description: "Lead disqualified or walk away." },
]

const STAT_CARDS = [
    { label: "Active Stages", value: "6", sub: "Pipeline flow", icon: Layers, bg: "bg-purple-50/10", text: "text-purple-600", border: "border-purple-100/20" },
    { label: "Avg Conversion", value: "24%", sub: "Stage-to-stage", icon: Zap, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
    { label: "Throughput", value: "1.2k", sub: "Monthly leads", icon: Activity, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Policy Health", value: "Locked", sub: "Strict progression", icon: ShieldCheck, bg: "bg-slate-900", text: "text-white", border: "border-slate-800" },
]

export default function LeadLifecyclePage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES)
    const [linearMode, setLinearMode] = useState(true)
    const [strictValidation, setStrictValidation] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingStage, setEditingStage] = useState<Stage | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<Stage | null>(null)
    const [dragId, setDragId] = useState<string | null>(null)
    const [newStage, setNewStage] = useState({ name: "", probability: 50, description: "", color: "bg-blue-500" })

    useEffect(() => { setIsClient(true) }, [])

    const handleAddStage = () => {
        if (!newStage.name) { toast({ title: "Stage name required" }); return }
        const entry: Stage = { id: `S${Date.now()}`, ...newStage, required: false }
        setStages([...stages.slice(0, -2), entry, ...stages.slice(-2)])
        setShowAddModal(false)
        setNewStage({ name: "", probability: 50, description: "", color: "bg-blue-500" })
        toast({ title: "✅ Stage Added", description: `"${entry.name}" added to your pipeline.` })
    }

    const handleDeleteStage = (s: Stage) => {
        if (s.required) { toast({ title: "Cannot remove required stage", description: "This stage is locked by the system." }); return }
        setStages(stages.filter(st => st.id !== s.id))
        setDeleteConfirm(null)
        toast({ title: "Stage Removed", description: `"${s.name}" removed from pipeline.` })
    }

    const handleSaveEdit = () => {
        if (!editingStage) return
        setStages(stages.map(s => s.id === editingStage.id ? editingStage : s))
        setEditingStage(null)
        toast({ title: "Stage Updated", description: `"${editingStage.name}" saved.` })
    }

    const handleSaveAll = () => {
        toast({ title: "✅ Pipeline Saved", description: "Stage configuration and enforcement rules updated." })
    }

    const handleDragStart = (id: string) => setDragId(id)
    const handleDragOver = (e: React.DragEvent) => e.preventDefault()
    const handleDrop = (targetId: string) => {
        if (!dragId || dragId === targetId) return
        const from = stages.findIndex(s => s.id === dragId)
        const to = stages.findIndex(s => s.id === targetId)
        const updated = [...stages]
        const [moved] = updated.splice(from, 1)
        updated.splice(to, 0, moved)
        setStages(updated)
        setDragId(null)
        toast({ title: "Stage Reordered", description: "Drag complete. Don't forget to save." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-purple-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100"><GitCommitHorizontal className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                            Lead Lifecycle & Pipelines
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Configure pipeline stages, ordering, and conversion enforcement rules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setShowAddModal(true)} className="h-10 border-slate-200 font-bold text-[12px] px-5">
                        <Plus className="h-4 w-4 mr-2" /> Add Stage
                    </Button>
                    <Button onClick={handleSaveAll} className="h-10 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-purple-100">
                        Save Pipeline
                    </Button>
                </div>
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

                {/* Stages List */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8">
                    <div className="mb-6">
                        <h3 className="text-[16px] font-black text-slate-900">Pipeline Stage Order</h3>
                        <p className="text-[12px] text-slate-500 font-medium">Drag to reorder. Click pencil to edit.</p>
                    </div>
                    <div className="space-y-3">
                        {stages.map((stage, idx) => (
                            <div key={stage.id}
                                draggable
                                onDragStart={() => handleDragStart(stage.id)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(stage.id)}
                                className={`flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 hover:border-purple-200 transition-all cursor-grab active:cursor-grabbing group ${dragId === stage.id ? 'opacity-50 scale-[0.98]' : ''}`}>
                                <GripVertical size={18} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                                <div className={`h-3 w-3 rounded-full ${stage.color} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-bold text-slate-900 leading-none">{stage.name}</span>
                                        {stage.required && <Badge className="bg-rose-50 text-rose-500 border-none text-[8px] font-black uppercase px-1.5 h-4">Required</Badge>}
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">{stage.description}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[11px] font-black text-slate-900">{stage.probability}%</p>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Win Prob</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button size="icon" variant="ghost" onClick={() => setEditingStage({ ...stage })} className="h-8 w-8 text-slate-300 hover:text-indigo-600 rounded-lg">
                                        <Pencil size={14} />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => stage.required ? toast({ title: "Locked stage" }) : setDeleteConfirm(stage)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Enforcement */}
                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-6">
                        <h4 className="text-[16px] font-black">Stage Enforcement</h4>
                        <div className="space-y-4">
                            {[
                                { label: "Linear Progression", desc: "Stages must be completed in order.", val: linearMode, fn: setLinearMode, color: "data-[state=checked]:bg-purple-500" },
                                { label: "Strict Validation", desc: "Required fields before advancing.", val: strictValidation, fn: setStrictValidation, color: "data-[state=checked]:bg-indigo-500" },
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-bold">{item.label}</span>
                                        <Switch checked={item.val} onCheckedChange={item.fn} className={item.color} />
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-7 space-y-4">
                        <h4 className="text-[14px] font-black text-slate-900">Conversion Benchmarks</h4>
                        {[
                            { from: "New → Outreach", rate: "72%", color: "bg-blue-500" },
                            { from: "Outreach → Qualified", rate: "45%", color: "bg-indigo-500" },
                            { from: "Proposal → Won", rate: "34%", color: "bg-emerald-500" },
                        ].map((b, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                    <span>{b.from}</span><span className="text-slate-900">{b.rate}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${b.color}`} style={{ width: b.rate }} />
                                </div>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>

            {/* Add Stage Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Add New Stage</h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stage Name</Label>
                                <Input placeholder="e.g. Contract Review" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</Label>
                                <Input placeholder="Brief description" value={newStage.description} onChange={e => setNewStage({ ...newStage, description: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Win Probability: {newStage.probability}%</Label>
                                <input type="range" min={0} max={100} value={newStage.probability} onChange={e => setNewStage({ ...newStage, probability: Number(e.target.value) })} className="w-full accent-purple-600" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stage Color</Label>
                                <div className="flex gap-3">
                                    {["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"].map(c => (
                                        <button key={c} onClick={() => setNewStage({ ...newStage, color: c })}
                                            className={`h-8 w-8 rounded-full ${c} transition-all ${newStage.color === c ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'opacity-60 hover:opacity-100'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleAddStage} className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none">Add Stage</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Stage Modal */}
            {editingStage && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Edit Stage</h2>
                            <Button size="icon" variant="ghost" onClick={() => setEditingStage(null)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stage Name</Label>
                                <Input value={editingStage.name} onChange={e => setEditingStage({ ...editingStage, name: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</Label>
                                <Input value={editingStage.description} onChange={e => setEditingStage({ ...editingStage, description: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Win Probability: {editingStage.probability}%</Label>
                                <input type="range" min={0} max={100} value={editingStage.probability} onChange={e => setEditingStage({ ...editingStage, probability: Number(e.target.value) })} className="w-full accent-purple-600" />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditingStage(null)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleSaveEdit} className="flex-1 h-11 bg-slate-900 text-white font-bold rounded-xl border-none">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 animate-in zoom-in-95 duration-200 text-center">
                        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600"><Trash2 size={26} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Delete Stage?</h2>
                            <p className="text-[13px] text-slate-500 font-medium">"{deleteConfirm.name}" will be permanently removed.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={() => handleDeleteStage(deleteConfirm)} className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
