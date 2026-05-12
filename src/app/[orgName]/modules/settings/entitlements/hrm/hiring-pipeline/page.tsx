"use client"

import { useState, useEffect } from "react"
import { GitBranch, Plus, Trash2, ArrowRight, CheckCircle, Users, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    getAllJobs,
    getAllCandidates,
    getAllInterviews,
    getAllOffers,
} from "@/modules/hrm/hooks/hrmHooks"

interface PipelineStage {
    id: string
    name: string
    order: number
    type: "Screening" | "Interview" | "Assessment" | "Decision" | "Offer"
    isMandatory: boolean
    autoAdvance: boolean
    daysLimit: number
    candidateCount?: number
}

interface ScorecardTemplate {
    id: string
    name: string
    criteria: { name: string; weight: number }[]
    ratingScale: number
}

const DEFAULT_STAGES: PipelineStage[] = [
    { id: "applied", name: "Applied", order: 1, type: "Screening", isMandatory: true, autoAdvance: false, daysLimit: 3, candidateCount: 0 },
    { id: "screening", name: "Screening", order: 2, type: "Screening", isMandatory: true, autoAdvance: false, daysLimit: 5, candidateCount: 0 },
    { id: "interview", name: "Interview", order: 3, type: "Interview", isMandatory: true, autoAdvance: false, daysLimit: 7, candidateCount: 0 },
    { id: "offer", name: "Offer", order: 4, type: "Offer", isMandatory: true, autoAdvance: false, daysLimit: 5, candidateCount: 0 },
    { id: "hired", name: "Hired", order: 5, type: "Decision", isMandatory: true, autoAdvance: false, daysLimit: 3, candidateCount: 0 },
    { id: "rejected", name: "Rejected", order: 6, type: "Assessment", isMandatory: false, autoAdvance: false, daysLimit: 0, candidateCount: 0 },
]

const STATUS_TO_STAGE: Record<string, string> = {
    "Applied": "applied", "New": "applied",
    "Screening": "screening", "Shortlisted": "screening",
    "Interview": "interview", "Interview Scheduled": "interview", "Interviewed": "interview",
    "Offer": "offer", "Offer Extended": "offer", "Offer Accepted": "offer",
    "Hired": "hired", "Onboarded": "hired",
    "Rejected": "rejected", "Disqualified": "rejected", "Withdrawn": "rejected",
}

const STAGE_COLORS: Record<string, string> = {
    Screening: "bg-sky-50 text-sky-600 border-sky-100",
    Interview: "bg-violet-50 text-violet-600 border-violet-100",
    Assessment: "bg-amber-50 text-amber-600 border-amber-100",
    Decision: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Offer: "bg-primary/10 text-primary border-primary/10",
}

export default function HiringPipelinePage() {
    const [pageLoading, setPageLoading] = useState(true)
    const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES)
    const [scorecards, setScorecards] = useState<ScorecardTemplate[]>([])
    const [isCreateStage, setIsCreateStage] = useState(false)
    const [isCreateScorecard, setIsCreateScorecard] = useState(false)
    const [newStage, setNewStage] = useState({ name: "", type: "Interview" as PipelineStage["type"], isMandatory: true, autoAdvance: false, daysLimit: 5 })
    const [newScorecard, setNewScorecard] = useState({ name: "", ratingScale: 5, criteria: [{ name: "", weight: 0 }] })
    const [jobCount, setJobCount] = useState(0)
    const [candidateCount, setCandidateCount] = useState(0)

    const fetchAllData = async () => {
        try {
            const [jobsRes, candidatesRes, interviewsRes] = await Promise.allSettled([
                getAllJobs(), getAllCandidates(), getAllInterviews(), getAllOffers(),
            ])

            let jobs: any[] = []
            if (jobsRes.status === "fulfilled") {
                jobs = jobsRes.value?.data?.data || jobsRes.value?.data?.jobs || []
                if (!Array.isArray(jobs)) jobs = []
                setJobCount(jobs.length)
            }

            let candidates: any[] = []
            if (candidatesRes.status === "fulfilled") {
                candidates = candidatesRes.value?.data?.data || candidatesRes.value?.data?.candidates || []
                if (!Array.isArray(candidates)) candidates = []
                setCandidateCount(candidates.length)
            }

            const stageCounts: Record<string, number> = {}
            candidates.forEach((c: any) => {
                const status = c.status || c.applicationStatus || "Applied"
                const stageId = STATUS_TO_STAGE[status] || "applied"
                stageCounts[stageId] = (stageCounts[stageId] || 0) + 1
            })

            setStages((prev) => prev.map((stage) => ({ ...stage, candidateCount: stageCounts[stage.id] || 0 })))

            let interviews: any[] = []
            if (interviewsRes.status === "fulfilled") {
                interviews = interviewsRes.value?.data?.data || interviewsRes.value?.data?.interviews || []
                if (!Array.isArray(interviews)) interviews = []
            }

            const scorecardMap: Record<string, ScorecardTemplate> = {}
            interviews.forEach((interview: any) => {
                const type = interview.interviewType || interview.type || "General"
                const key = type.toLowerCase()
                if (!scorecardMap[key]) {
                    scorecardMap[key] = { id: key, name: `${type} Evaluation`, criteria: [], ratingScale: 5 }
                }
                const feedback = interview.feedback || interview.feedbacks || []
                const feedbackArr = Array.isArray(feedback) ? feedback : [feedback]
                feedbackArr.forEach((fb: any) => {
                    if (fb?.criteria) {
                        const criteriaArr = Array.isArray(fb.criteria) ? fb.criteria : []
                        criteriaArr.forEach((cr: any) => {
                            const existing = scorecardMap[key].criteria.find((c) => c.name.toLowerCase() === (cr.name || cr.criterion || "").toLowerCase())
                            if (!existing && (cr.name || cr.criterion)) {
                                scorecardMap[key].criteria.push({ name: cr.name || cr.criterion, weight: cr.weight || Math.floor(100 / (feedbackArr.length || 1)) })
                            }
                        })
                    }
                })
            })

            const builtScorecards = Object.values(scorecardMap)
            if (builtScorecards.length === 0) {
                setScorecards([
                    { id: "technical", name: "Technical Evaluation", criteria: [{ name: "Problem Solving", weight: 30 }, { name: "System Design", weight: 25 }, { name: "Coding", weight: 25 }, { name: "Communication", weight: 20 }], ratingScale: 5 },
                    { id: "cultural", name: "Cultural Fit", criteria: [{ name: "Team Collaboration", weight: 30 }, { name: "Values Alignment", weight: 30 }, { name: "Growth Mindset", weight: 20 }, { name: "Leadership Potential", weight: 20 }], ratingScale: 5 },
                ])
            } else {
                builtScorecards.forEach((sc) => {
                    if (sc.criteria.length === 0) {
                        sc.criteria = [{ name: "Technical Skills", weight: 30 }, { name: "Communication", weight: 25 }, { name: "Problem Solving", weight: 25 }, { name: "Cultural Fit", weight: 20 }]
                    }
                })
                setScorecards(builtScorecards)
            }
        } catch {
            // silent
        } finally {
            setPageLoading(false)
        }
    }

    useEffect(() => { fetchAllData() }, [])

    const handleCreateStage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newStage.name.trim()) return showWarning("Stage name is required")
        setStages([...stages, { ...newStage, id: Date.now().toString(), order: stages.length + 1, candidateCount: 0 }])
        setIsCreateStage(false)
        setNewStage({ name: "", type: "Interview", isMandatory: true, autoAdvance: false, daysLimit: 5 })
        showSuccess("Pipeline stage added")
    }

    const deleteStage = (id: string) => {
        setStages(stages.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })))
        showSuccess("Stage removed")
    }

    const handleCreateScorecard = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newScorecard.name.trim()) return showWarning("Scorecard name is required")
        const validCriteria = newScorecard.criteria.filter((c) => c.name.trim())
        if (validCriteria.length === 0) return showWarning("Add at least one criterion")
        setScorecards([...scorecards, { id: Date.now().toString(), name: newScorecard.name, ratingScale: newScorecard.ratingScale, criteria: validCriteria }])
        setIsCreateScorecard(false)
        setNewScorecard({ name: "", ratingScale: 5, criteria: [{ name: "", weight: 0 }] })
        showSuccess("Scorecard template created")
    }

    const deleteScorecard = (id: string) => {
        setScorecards(scorecards.filter((s) => s.id !== id))
        showSuccess("Scorecard deleted")
    }

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Hiring Pipeline</h1>
                        <p className="text-sm text-zinc-500 mt-1">Configure recruitment stages and evaluation scorecards.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Pipeline Stages</p>
                        <p className="text-white text-xl font-semibold mt-1">{stages.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Recruitment steps</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Candidates</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{candidateCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">In pipeline</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Scorecards</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{scorecards.length}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Evaluation templates</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Open Jobs</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{jobCount}</p>
                        <p className="text-primary text-[10px] mt-1">Active postings</p>
                    </div>
                </div>

                {/* Stages */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                <GitBranch className="w-4 h-4 text-zinc-500" />
                                Recruitment Pipeline
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Candidates progress through these stages sequentially.</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateStage(true)}
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 px-4"
                        >
                            <Plus size={14} /> Add Stage
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {stages.map((stage, i) => (
                            <div key={stage.id} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-none border ${STAGE_COLORS[stage.type] || "bg-zinc-50 text-zinc-600 border-zinc-200"}`}>
                                    <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-[9px] font-bold">{stage.order}</div>
                                    <div>
                                        <p className="text-[11px] font-semibold">{stage.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[9px] font-medium opacity-70">{stage.type}</span>
                                            <span className="text-[9px] opacity-50">·</span>
                                            <span className="text-[9px] font-medium opacity-70">{stage.daysLimit > 0 ? `${stage.daysLimit}d` : "—"}</span>
                                            {stage.isMandatory && <span className="text-[8px] px-1 py-0 bg-white/70 font-bold rounded-none">REQ</span>}
                                            {(stage.candidateCount ?? 0) > 0 && <span className="text-[8px] px-1 py-0 bg-white/70 font-bold rounded-none">{stage.candidateCount}</span>}
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="h-5 w-5 p-0 hover:bg-white/50 rounded-none ml-1" onClick={() => deleteStage(stage.id)}>
                                        <Trash2 className="w-2.5 h-2.5 opacity-50" />
                                    </Button>
                                </div>
                                {i < stages.length - 1 && <ArrowRight className="w-4 h-4 text-zinc-300 shrink-0" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scorecards */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                <Star className="w-4 h-4 text-zinc-500" />
                                Scorecard Templates
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Evaluation criteria for interviewers to rate candidates.</p>
                        </div>
                        <Button
                            onClick={() => setIsCreateScorecard(true)}
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 px-4"
                        >
                            <Plus size={14} /> New Scorecard
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scorecards.map((sc) => (
                            <div key={sc.id} className="border border-zinc-200 rounded-none p-4 hover:border-primary/30 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-semibold text-zinc-900">{sc.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-none border border-zinc-200">{sc.ratingScale}-pt scale</span>
                                        <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-rose-50 rounded-none" onClick={() => deleteScorecard(sc.id)}>
                                            <Trash2 className="w-3 h-3 text-rose-400" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    {sc.criteria.map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-600 font-medium">{c.name}</span>
                                            <span className="text-zinc-900 font-semibold">{c.weight}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Stage sheet */}
            <SideFormSheet
                open={isCreateStage}
                onOpenChange={setIsCreateStage}
                title="Add Pipeline Stage"
                description="Add a new step to the recruitment process."
                icon={<GitBranch className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreateStage}
                submitLabel="Add Stage"
                submitDisabled={!newStage.name.trim()}
            >
                <div className="space-y-4">
                    <Field label="Stage Name" required>
                        <Input
                            placeholder="e.g. Coding Test"
                            value={newStage.name}
                            onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Type" required>
                        <Select value={newStage.type} onValueChange={(v: PipelineStage["type"]) => setNewStage({ ...newStage, type: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Screening", "Interview", "Assessment", "Decision", "Offer"].map((t) => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Days Limit" hint="Days allowed in this stage before escalation">
                        <Input
                            type="number"
                            value={newStage.daysLimit}
                            onChange={(e) => setNewStage({ ...newStage, daysLimit: parseInt(e.target.value) || 0 })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Mandatory Stage</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">All candidates must pass through</p>
                        </div>
                        <Switch checked={newStage.isMandatory} onCheckedChange={(v) => setNewStage({ ...newStage, isMandatory: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Create Scorecard sheet */}
            <SideFormSheet
                open={isCreateScorecard}
                onOpenChange={setIsCreateScorecard}
                title="New Scorecard Template"
                description="Create an evaluation scorecard with weighted criteria."
                icon={<Star className="w-5 h-5" />}
                width="lg"
                onSubmit={handleCreateScorecard}
                submitLabel="Create Scorecard"
                submitDisabled={!newScorecard.name.trim()}
            >
                <div className="space-y-4">
                    <Field label="Template Name" required>
                        <Input
                            placeholder="e.g. Leadership Assessment"
                            value={newScorecard.name}
                            onChange={(e) => setNewScorecard({ ...newScorecard, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Rating Scale">
                        <Select value={String(newScorecard.ratingScale)} onValueChange={(v) => setNewScorecard({ ...newScorecard, ratingScale: parseInt(v) })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">1-5</SelectItem>
                                <SelectItem value="10">1-10</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[13px] font-semibold text-[#374151]">Criteria</p>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-7 text-xs font-semibold text-primary gap-1 px-2"
                                onClick={() => setNewScorecard({ ...newScorecard, criteria: [...newScorecard.criteria, { name: "", weight: 0 }] })}
                            >
                                <Plus className="w-3 h-3" /> Add
                            </Button>
                        </div>
                        {newScorecard.criteria.map((c, i) => (
                            <div key={i} className="grid grid-cols-[1fr,100px,40px] gap-2 mb-2">
                                <Input
                                    className="h-10 rounded-lg text-xs border-[#E5E7EB]"
                                    placeholder="Criterion name"
                                    value={c.name}
                                    onChange={(e) => { const cr = [...newScorecard.criteria]; cr[i] = { ...cr[i], name: e.target.value }; setNewScorecard({ ...newScorecard, criteria: cr }) }}
                                />
                                <Input
                                    type="number"
                                    className="h-10 rounded-lg text-xs border-[#E5E7EB]"
                                    placeholder="%"
                                    value={c.weight}
                                    onChange={(e) => { const cr = [...newScorecard.criteria]; cr[i] = { ...cr[i], weight: parseInt(e.target.value) || 0 }; setNewScorecard({ ...newScorecard, criteria: cr }) }}
                                />
                                {newScorecard.criteria.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-10 w-10 p-0 hover:bg-rose-50 rounded-lg"
                                        onClick={() => setNewScorecard({ ...newScorecard, criteria: newScorecard.criteria.filter((_, j) => j !== i) })}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </SideFormSheet>
        </div>
    )
}
