"use client"

import { useState } from "react"
import { GitBranch, Plus, Search, MoreHorizontal, Pencil, Trash2, GripVertical, ArrowRight, CheckCircle, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PipelineStage {
    id: string
    name: string
    order: number
    type: "Screening" | "Interview" | "Assessment" | "Decision" | "Offer"
    isMandatory: boolean
    autoAdvance: boolean
    daysLimit: number
}

interface ScorecardTemplate {
    id: string
    name: string
    criteria: { name: string; weight: number }[]
    ratingScale: number
}

const INITIAL_STAGES: PipelineStage[] = [
    { id: "1", name: "Application Review", order: 1, type: "Screening", isMandatory: true, autoAdvance: false, daysLimit: 3 },
    { id: "2", name: "Phone Screening", order: 2, type: "Screening", isMandatory: true, autoAdvance: false, daysLimit: 5 },
    { id: "3", name: "Technical Round", order: 3, type: "Interview", isMandatory: true, autoAdvance: false, daysLimit: 7 },
    { id: "4", name: "Managerial Round", order: 4, type: "Interview", isMandatory: true, autoAdvance: false, daysLimit: 5 },
    { id: "5", name: "HR Round", order: 5, type: "Interview", isMandatory: false, autoAdvance: false, daysLimit: 3 },
    { id: "6", name: "Offer Approval", order: 6, type: "Decision", isMandatory: true, autoAdvance: false, daysLimit: 2 },
    { id: "7", name: "Offer Release", order: 7, type: "Offer", isMandatory: true, autoAdvance: false, daysLimit: 3 },
]

const INITIAL_SCORECARDS: ScorecardTemplate[] = [
    { id: "1", name: "Technical Evaluation", criteria: [{ name: "Problem Solving", weight: 30 }, { name: "System Design", weight: 25 }, { name: "Coding", weight: 25 }, { name: "Communication", weight: 20 }], ratingScale: 5 },
    { id: "2", name: "Cultural Fit", criteria: [{ name: "Team Collaboration", weight: 30 }, { name: "Values Alignment", weight: 30 }, { name: "Growth Mindset", weight: 20 }, { name: "Leadership Potential", weight: 20 }], ratingScale: 5 },
]

const STAGE_COLORS: Record<string, string> = {
    Screening: "bg-sky-50 text-sky-600 border-sky-100",
    Interview: "bg-violet-50 text-violet-600 border-violet-100",
    Assessment: "bg-amber-50 text-amber-600 border-amber-100",
    Decision: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Offer: "bg-blue-50 text-blue-600 border-blue-100",
}

export default function HiringPipelinePage() {
    const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES)
    const [scorecards, setScorecards] = useState<ScorecardTemplate[]>(INITIAL_SCORECARDS)
    const [isCreateStage, setIsCreateStage] = useState(false)
    const [isCreateScorecard, setIsCreateScorecard] = useState(false)
    const [newStage, setNewStage] = useState({ name: "", type: "Interview" as PipelineStage["type"], isMandatory: true, autoAdvance: false, daysLimit: 5 })
    const [newScorecard, setNewScorecard] = useState({ name: "", ratingScale: 5, criteria: [{ name: "", weight: 0 }] })

    const handleCreateStage = () => {
        if (!newStage.name) return toast.error("Stage name is required")
        setStages([...stages, { ...newStage, id: Date.now().toString(), order: stages.length + 1 }])
        setIsCreateStage(false)
        setNewStage({ name: "", type: "Interview", isMandatory: true, autoAdvance: false, daysLimit: 5 })
        toast.success("Pipeline stage added")
    }

    const deleteStage = (id: string) => {
        setStages(stages.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })))
        toast.success("Stage removed")
    }

    const handleCreateScorecard = () => {
        if (!newScorecard.name) return toast.error("Scorecard name is required")
        const validCriteria = newScorecard.criteria.filter((c) => c.name.trim())
        if (validCriteria.length === 0) return toast.error("Add at least one criteria")
        setScorecards([...scorecards, { id: Date.now().toString(), name: newScorecard.name, ratingScale: newScorecard.ratingScale, criteria: validCriteria }])
        setIsCreateScorecard(false)
        setNewScorecard({ name: "", ratingScale: 5, criteria: [{ name: "", weight: 0 }] })
        toast.success("Scorecard template created")
    }

    const deleteScorecard = (id: string) => {
        setScorecards(scorecards.filter((s) => s.id !== id))
        toast.success("Scorecard deleted")
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400"><span>HR Governance</span><span>/</span><span className="text-gray-900 font-semibold">Hiring Pipeline</span></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Hiring Pipeline & Scorecards</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure recruitment stages and evaluation criteria.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">Pipeline Stages</p><p className="text-xl font-semibold">{stages.length}</p><p className="text-[10px] text-white/70">Recruitment steps</p></div><GitBranch className="w-5 h-5 text-white/80" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Mandatory</p><p className="text-xl font-semibold text-gray-900">{stages.filter((s) => s.isMandatory).length}</p><p className="text-[10px] text-gray-500">Required stages</p></div><CheckCircle className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Scorecards</p><p className="text-xl font-semibold text-gray-900">{scorecards.length}</p><p className="text-[10px] text-gray-500">Evaluation templates</p></div><Star className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Avg Days</p><p className="text-xl font-semibold text-gray-900">{stages.reduce((s, st) => s + st.daysLimit, 0)}</p><p className="text-[10px] text-gray-500">Total pipeline time</p></div><Users className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
            </div>

            {/* Pipeline Stages */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-sm font-semibold text-gray-900">Recruitment Pipeline</h3><p className="text-xs text-gray-500 mt-0.5">Candidates progress through these stages sequentially.</p></div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-9 gap-2 px-4" onClick={() => setIsCreateStage(true)}><Plus className="w-3.5 h-3.5" />Add Stage</Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {stages.map((stage, i) => (
                        <div key={stage.id} className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${STAGE_COLORS[stage.type] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-[9px] font-bold">{stage.order}</div>
                                <div>
                                    <p className="text-[10px] font-semibold">{stage.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[9px] font-medium opacity-70">{stage.type}</span>
                                        <span className="text-[9px] opacity-50">·</span>
                                        <span className="text-[9px] font-medium opacity-70">{stage.daysLimit}d</span>
                                        {stage.isMandatory && <Badge className="text-[7px] px-1 py-0 rounded bg-white/50 border-none font-bold">REQ</Badge>}
                                    </div>
                                </div>
                                <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-white/50 rounded ml-1" onClick={() => deleteStage(stage.id)}>
                                    <Trash2 className="w-2.5 h-2.5 opacity-50" />
                                </Button>
                            </div>
                            {i < stages.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scorecards */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-sm font-semibold text-gray-900">Scorecard Templates</h3><p className="text-xs text-gray-500 mt-0.5">Evaluation criteria for interviewers to rate candidates.</p></div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-9 gap-2 px-4" onClick={() => setIsCreateScorecard(true)}><Plus className="w-3.5 h-3.5" />New Scorecard</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scorecards.map((sc) => (
                        <div key={sc.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-semibold text-gray-900">{sc.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-[9px] font-medium px-1.5 py-0 rounded-full">{sc.ratingScale}-point scale</Badge>
                                    <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-rose-50 rounded" onClick={() => deleteScorecard(sc.id)}><Trash2 className="w-3 h-3 text-rose-400" /></Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                {sc.criteria.map((c, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px]">
                                        <span className="text-gray-600 font-medium">{c.name}</span>
                                        <span className="text-gray-900 font-semibold">{c.weight}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Stage Dialog */}
            <Dialog open={isCreateStage} onOpenChange={setIsCreateStage}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">Add Pipeline Stage</DialogTitle></DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Stage Name</Label><Input className="h-9 rounded-lg text-xs" value={newStage.name} onChange={(e) => setNewStage({ ...newStage, name: e.target.value })} placeholder="e.g. Coding Test" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Type</Label>
                            <Select value={newStage.type} onValueChange={(v: PipelineStage["type"]) => setNewStage({ ...newStage, type: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Screening", "Interview", "Assessment", "Decision", "Offer"].map((t) => (<SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Days Limit</Label><Input type="number" className="h-9 rounded-lg text-xs" value={newStage.daysLimit} onChange={(e) => setNewStage({ ...newStage, daysLimit: parseInt(e.target.value) || 0 })} /></div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Mandatory Stage</Label><Switch checked={newStage.isMandatory} onCheckedChange={(v) => setNewStage({ ...newStage, isMandatory: v })} /></div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreateStage} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Add Stage</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Scorecard Dialog */}
            <Dialog open={isCreateScorecard} onOpenChange={setIsCreateScorecard}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">New Scorecard Template</DialogTitle></DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Template Name</Label><Input className="h-9 rounded-lg text-xs" value={newScorecard.name} onChange={(e) => setNewScorecard({ ...newScorecard, name: e.target.value })} placeholder="e.g. Leadership Assessment" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Rating Scale</Label>
                            <Select value={String(newScorecard.ratingScale)} onValueChange={(v) => setNewScorecard({ ...newScorecard, ratingScale: parseInt(v) })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="5" className="text-xs">1-5</SelectItem><SelectItem value="10" className="text-xs">1-10</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2"><Label className="text-xs font-semibold text-gray-700">Criteria</Label>
                                <Button type="button" variant="ghost" className="h-7 text-xs font-semibold text-blue-600 gap-1 px-2" onClick={() => setNewScorecard({ ...newScorecard, criteria: [...newScorecard.criteria, { name: "", weight: 0 }] })}><Plus className="w-3 h-3" />Add</Button>
                            </div>
                            {newScorecard.criteria.map((c, i) => (
                                <div key={i} className="grid grid-cols-[1fr,80px,32px] gap-2 mb-2">
                                    <Input className="h-8 rounded-md text-[11px]" placeholder="Criteria name" value={c.name} onChange={(e) => { const cr = [...newScorecard.criteria]; cr[i] = { ...cr[i], name: e.target.value }; setNewScorecard({ ...newScorecard, criteria: cr }) }} />
                                    <Input type="number" className="h-8 rounded-md text-[11px]" placeholder="%" value={c.weight} onChange={(e) => { const cr = [...newScorecard.criteria]; cr[i] = { ...cr[i], weight: parseInt(e.target.value) || 0 }; setNewScorecard({ ...newScorecard, criteria: cr }) }} />
                                    {newScorecard.criteria.length > 1 && <Button type="button" variant="ghost" className="h-8 w-8 p-0 hover:bg-rose-50" onClick={() => setNewScorecard({ ...newScorecard, criteria: newScorecard.criteria.filter((_, j) => j !== i) })}><Trash2 className="w-3 h-3 text-rose-400" /></Button>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreateScorecard} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Create Scorecard</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
