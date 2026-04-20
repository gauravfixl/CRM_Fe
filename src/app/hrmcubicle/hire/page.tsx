"use client"

import React, { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Rocket, Briefcase, Users, Calendar, FileSignature, Award, TrendingUp,
    Activity, Clock, ArrowUpRight, ArrowDownRight, Plus, UserPlus, CalendarPlus,
    Upload, ChevronRight, CheckCircle2, AlertTriangle, Target, Star, Sparkles,
    Globe, Video, Phone, Trophy, FileText, Eye, BarChart3, MapPin, RefreshCw,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useHireStore } from "@/shared/data/hire-store"
import { cn } from "@/lib/utils"

const HireDashboardPage = () => {
    const router = useRouter()
    const { jobs, candidates, interviews, offers, parsedResumes, careerSubmissions } = useHireStore()
    const loadAllRecruitment = useHireStore((s) => s.loadAllRecruitment)
    const loading = useHireStore((s) => s.loading)
    const hasLoaded = useHireStore((s) => s.hasLoaded)

    useEffect(() => {
        if (!hasLoaded.jobs || !hasLoaded.candidates || !hasLoaded.interviews || !hasLoaded.offers) {
            loadAllRecruitment()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isAnyLoading = loading.jobs || loading.candidates || loading.interviews || loading.offers

    const today = new Date()
    const todayISO = today.toISOString().split("T")[0]
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const fourteenDaysAgo = new Date(today); fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    // ─────────── KPIs ───────────
    const kpis = useMemo(() => {
        const activeJobs = jobs.filter(j => j.workflowStatus === "Active")
        const pendingApprovalJobs = jobs.filter(j => j.workflowStatus === "Pending Approval")
        const activePipeline = candidates.filter(c => c.stage !== "Hired" && c.stage !== "Rejected")
        const todayInt = interviews.filter(i => i.date === todayISO)
        const pendingOffers = offers.filter(o => o.approvalStatus === "Sent" && o.signatureStatus !== "Signed")
        const hiredThisMonth = candidates.filter(c => c.stage === "Hired" && new Date(c.stageEnteredDate) >= startOfMonth)
        return {
            activeJobs: activeJobs.length,
            pendingApprovalJobs: pendingApprovalJobs.length,
            activePipeline: activePipeline.length,
            todayInt: todayInt.length,
            pendingOffers: pendingOffers.length,
            hiredThisMonth: hiredThisMonth.length,
            avgTimeToHire: 32,
        }
    }, [jobs, candidates, interviews, offers, startOfMonth, todayISO])

    // ─────────── Funnel ───────────
    const funnel = useMemo(() => {
        const stages = [
            { key: "Applied", label: "Applied", count: candidates.length, color: "#8B5CF6" },
            { key: "Screening", label: "Screening", count: candidates.filter(c => c.stage === "Screening" || c.stage === "New").length, color: "#6366F1" },
            { key: "Interview", label: "Interview", count: candidates.filter(c => c.stage === "Interview").length, color: "#3B82F6" },
            { key: "Offer", label: "Offer", count: candidates.filter(c => c.stage === "Offer").length, color: "#0EA5E9" },
            { key: "Hired", label: "Hired", count: candidates.filter(c => c.stage === "Hired").length, color: "#10B981" },
        ]
        const max = Math.max(...stages.map(s => s.count), 1)
        return stages.map((s, i) => {
            const prev = stages[i - 1]?.count ?? 0
            const conversion = prev > 0 ? Math.round((s.count / prev) * 100) : null
            return { ...s, widthPct: (s.count / max) * 100, conversion }
        })
    }, [candidates])

    // ─────────── Source + Department breakdown ───────────
    const sourceBreakdown = useMemo(() => {
        const byKey: Record<string, number> = {}
        candidates.forEach(c => { byKey[c.source] = (byKey[c.source] ?? 0) + 1 })
        const sorted = Object.entries(byKey).sort((a, b) => b[1] - a[1])
        const total = candidates.length || 1
        return sorted.map(([label, count], idx) => ({ label, count, pct: Math.round((count / total) * 100), rank: idx + 1 }))
    }, [candidates])

    const deptBreakdown = useMemo(() => {
        const byDept: Record<string, { open: number; pipeline: number }> = {}
        jobs.forEach(j => {
            if (!byDept[j.department]) byDept[j.department] = { open: 0, pipeline: 0 }
            if (j.workflowStatus === "Active") byDept[j.department].open += 1
            byDept[j.department].pipeline += candidates.filter(c => c.jobId === j.id && c.stage !== "Hired" && c.stage !== "Rejected").length
        })
        return Object.entries(byDept).sort((a, b) => b[1].pipeline - a[1].pipeline)
    }, [jobs, candidates])

    // ─────────── Activity feed ───────────
    const activityFeed = useMemo(() => {
        type Entry = { id: string; type: "candidate" | "interview" | "offer"; icon: React.ElementType; color: string; desc: string; ts: string; link: string }
        const entries: Entry[] = []
        candidates.forEach(c => {
            (c.communicationLog ?? []).forEach(log => {
                entries.push({
                    id: `${c.id}-${log.id}`,
                    type: "candidate",
                    icon: Users,
                    color: "text-violet-600 bg-violet-50",
                    desc: `${c.firstName} ${c.lastName} — ${log.action}`,
                    ts: log.timestamp,
                    link: "/hrmcubicle/hire/candidates",
                })
            })
        })
        interviews.forEach(i => {
            entries.push({
                id: `i-${i.id}`,
                type: "interview",
                icon: Calendar,
                color: "text-blue-600 bg-blue-50",
                desc: `Interview ${i.status?.toLowerCase()}: ${i.title}`,
                ts: (i.date ?? new Date().toISOString()) + "T00:00:00Z",
                link: "/hrmcubicle/hire/interviews",
            })
        })
        offers.forEach(o => {
            (o.history ?? []).forEach(h => {
                entries.push({
                    id: `o-${o.id}-${h.id}`,
                    type: "offer",
                    icon: FileSignature,
                    color: "text-emerald-600 bg-emerald-50",
                    desc: `${o.candidateName}: ${h.action}`,
                    ts: h.timestamp,
                    link: "/hrmcubicle/hire/offers",
                })
            })
        })
        return entries.sort((a, b) => (b.ts ?? "").localeCompare(a.ts ?? "")).slice(0, 20)
    }, [candidates, interviews, offers])

    const groupedActivity = useMemo(() => {
        const groups: Record<string, typeof activityFeed> = { Today: [], Yesterday: [], Earlier: [] }
        const y = new Date(today); y.setDate(y.getDate() - 1)
        const yISO = y.toISOString().split("T")[0]
        activityFeed.forEach(e => {
            const d = (e.ts ?? "").split("T")[0]
            if (d === todayISO) groups.Today.push(e)
            else if (d === yISO) groups.Yesterday.push(e)
            else groups.Earlier.push(e)
        })
        return groups
    }, [activityFeed, todayISO])

    // ─────────── Upcoming interviews (next 5) ───────────
    const upcomingInterviews = useMemo(() => {
        return [...interviews]
            .filter(i => i.status === "Scheduled" || i.status === "Rescheduled")
            .filter(i => i.date >= todayISO)
            .sort((a, b) => (a.date + " " + a.time).localeCompare(b.date + " " + b.time))
            .slice(0, 5)
    }, [interviews, todayISO])

    // ─────────── Pending actions ───────────
    const pendingActions = useMemo(() => {
        return {
            jobsToApprove: jobs.filter(j => j.workflowStatus === "Pending Approval"),
            offersToApprove: offers.filter(o => o.approvalStatus === "Pending Approval"),
            stuckInterviews: candidates.filter(c => c.stage === "Interview" && new Date(c.stageEnteredDate) < fourteenDaysAgo),
            resumesToConvert: parsedResumes.filter(r => r.status === "Parsed"),
        }
    }, [jobs, offers, candidates, parsedResumes, fourteenDaysAgo])

    // ─────────── Quick access tiles ───────────
    const tiles = [
        { label: "Job Openings", icon: Briefcase, color: "#8B5CF6", href: "/hrmcubicle/hire/jobs", count: jobs.length, desc: "Post & manage requisitions" },
        { label: "Candidates", icon: Users, color: "#3B82F6", href: "/hrmcubicle/hire/candidates", count: candidates.length, desc: "Talent pipeline" },
        { label: "Interviews", icon: Calendar, color: "#0EA5E9", href: "/hrmcubicle/hire/interviews", count: interviews.length, desc: "Schedule & track rounds" },
        { label: "Offer Letters", icon: FileSignature, color: "#10B981", href: "/hrmcubicle/hire/offers", count: offers.length, desc: "Generate & send offers" },
        { label: "Hiring Reports", icon: BarChart3, color: "#F59E0B", href: "/hrmcubicle/hire/reports", count: 0, desc: "Analytics & insights" },
        { label: "Career Page", icon: Globe, color: "#EC4899", href: "/hrmcubicle/hire/career-page", count: careerSubmissions.length, desc: "Public applications" },
        { label: "Referrals", icon: Sparkles, color: "#6366F1", href: "/hrmcubicle/hire/referrals", count: 0, desc: "Employee referrals" },
        { label: "Resume Parser", icon: Upload, color: "#14B8A6", href: "/hrmcubicle/hire/resume-parser", count: parsedResumes.length, desc: "AI-powered parsing" },
        { label: "Scorecards", icon: Award, color: "#F97316", href: "/hrmcubicle/hire/scorecards", count: 0, desc: "Interview evaluations" },
    ]

    const formatRelative = (iso: string) => {
        if (!iso) return ""
        const d = new Date(iso)
        const diff = today.getTime() - d.getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return "just now"
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        return d.toLocaleDateString()
    }

    return (
        <div className="flex-1 p-6 lg:p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto font-sans space-y-6">
            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7c3aed] to-[#6366F1] p-8 text-white shadow-lg">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Rocket size={18} className="text-white/80" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Hiring Hub</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
                        <p className="text-sm text-white/80 max-w-xl">
                            You have <span className="font-bold text-white">{kpis.todayInt} interviews today</span>,{" "}
                            <span className="font-bold text-white">{kpis.pendingApprovalJobs + kpis.pendingOffers} pending approvals</span>, and{" "}
                            <span className="font-bold text-white">{kpis.activeJobs} open roles</span>.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => router.push("/hrmcubicle/hire/jobs")} className="bg-white text-[#8B5CF6] hover:bg-white/90 h-10 font-bold text-xs rounded-lg px-4 gap-1.5"><Plus size={14} /> Post Job</Button>
                        <Button onClick={() => router.push("/hrmcubicle/hire/candidates")} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 font-semibold text-xs rounded-lg px-4 gap-1.5"><UserPlus size={14} /> Add Candidate</Button>
                        <Button onClick={() => router.push("/hrmcubicle/hire/interviews")} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 font-semibold text-xs rounded-lg px-4 gap-1.5"><CalendarPlus size={14} /> Schedule</Button>
                        <Button onClick={() => router.push("/hrmcubicle/hire/resume-parser")} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 font-semibold text-xs rounded-lg px-4 gap-1.5"><Upload size={14} /> Parse Resume</Button>
                        <Button onClick={() => loadAllRecruitment()} disabled={isAnyLoading} variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-10 font-semibold text-xs rounded-lg px-4 gap-1.5"><RefreshCw size={14} className={isAnyLoading ? "animate-spin" : ""} /> Refresh</Button>
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 h-72 w-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute right-40 bottom-0 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* ── KPI row (6 cards) ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <KpiCard label="Open Positions" value={kpis.activeJobs} delta={8} icon={Briefcase} color="#8B5CF6" i={0} />
                <KpiCard label="Active Pipeline" value={kpis.activePipeline} delta={12} icon={Users} color="#3B82F6" i={1} />
                <KpiCard label="Today's Interviews" value={kpis.todayInt} delta={0} icon={Calendar} color="#0EA5E9" i={2} />
                <KpiCard label="Pending Offers" value={kpis.pendingOffers} delta={-5} icon={FileSignature} color="#10B981" i={3} />
                <KpiCard label="Hired This Month" value={kpis.hiredThisMonth} delta={25} icon={Trophy} color="#F59E0B" i={4} />
                <KpiCard label="Avg Time-to-Hire" value={`${kpis.avgTimeToHire}d`} delta={-4} icon={Clock} color="#EC4899" i={5} />
            </div>

            {/* ── Funnel + Today's schedule ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Funnel */}
                <Card className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Hiring Funnel</h3>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Candidate progression across stages</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push("/hrmcubicle/hire/reports")} className="h-8 text-[11px] font-semibold text-[#8B5CF6] hover:bg-violet-50">
                                View report <ChevronRight size={12} className="ml-1" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {funnel.map((s, i) => (
                                <div key={s.key}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-slate-700">{s.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 tabular-nums">{s.count}</span>
                                            {s.conversion !== null && (
                                                <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-bold px-1.5 py-0 h-4">{s.conversion}%</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(5, s.widthPct)}%` }}
                                            transition={{ duration: 0.6, delay: i * 0.08 }}
                                            className="h-full rounded-full"
                                            style={{ background: s.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Today's schedule */}
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Today's Schedule</h3>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p>
                            </div>
                            <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none font-bold text-xs">{kpis.todayInt}</Badge>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {interviews.filter(i => i.date === todayISO).length === 0 && (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <CheckCircle2 size={32} className="text-emerald-300 mb-2" />
                                    <p className="text-xs font-semibold text-slate-600">All clear for today</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Enjoy your day!</p>
                                </div>
                            )}
                            {interviews.filter(i => i.date === todayISO).map(iv => {
                                const cand = candidates.find(c => c.id === iv.candidateId)
                                const Icon = iv.mode === "Video" ? Video : iv.mode === "Phone" ? Phone : MapPin
                                return (
                                    <div key={iv.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => router.push("/hrmcubicle/hire/interviews")}>
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Icon size={16} className="text-slate-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-900 truncate">{cand ? `${cand.firstName} ${cand.lastName}` : iv.title}</p>
                                            <p className="text-[10px] font-medium text-slate-500 truncate">{iv.title} • {iv.time}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <Button variant="ghost" onClick={() => router.push("/hrmcubicle/hire/interviews")} className="w-full mt-2 h-9 text-xs font-semibold text-[#8B5CF6] hover:bg-violet-50">View full schedule</Button>
                    </CardContent>
                </Card>
            </div>

            {/* ── Source + Department breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Source Breakdown</h3>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Where candidates come from</p>
                            </div>
                            <Target size={16} className="text-slate-400" />
                        </div>
                        <div className="space-y-2.5">
                            {sourceBreakdown.length === 0 && <p className="text-xs text-slate-400 italic">No candidate data yet</p>}
                            {sourceBreakdown.slice(0, 8).map(s => (
                                <div key={s.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            {s.rank <= 3 && (
                                                <Badge className={cn("text-[9px] font-bold border-none h-4 px-1.5", s.rank === 1 ? "bg-emerald-100 text-emerald-700" : s.rank === 2 ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700")}>#{s.rank}</Badge>
                                            )}
                                            <span className="text-xs font-semibold text-slate-700">{s.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 tabular-nums">{s.count} <span className="text-[10px] font-medium text-slate-400">({s.pct}%)</span></span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] rounded-full" style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Department Demand</h3>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Open roles + active pipeline per dept</p>
                            </div>
                            <BarChart3 size={16} className="text-slate-400" />
                        </div>
                        <div className="space-y-2.5">
                            {deptBreakdown.length === 0 && <p className="text-xs text-slate-400 italic">No department data yet</p>}
                            {deptBreakdown.slice(0, 8).map(([dept, data]) => {
                                const max = Math.max(...deptBreakdown.map(([, d]) => d.pipeline), 1)
                                const pct = (data.pipeline / max) * 100
                                return (
                                    <div key={dept}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-slate-700">{dept}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-violet-50 text-[#8B5CF6] border-none text-[10px] font-bold px-1.5 py-0 h-4">{data.open} open</Badge>
                                                <span className="text-xs font-bold text-slate-900 tabular-nums">{data.pipeline}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Activity + Upcoming + Pending actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Activity feed */}
                <Card className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Last 20 events</p>
                            </div>
                            <Activity size={16} className="text-slate-400" />
                        </div>
                        <div className="space-y-4 max-h-[420px] overflow-y-auto">
                            {(["Today", "Yesterday", "Earlier"] as const).map(group => {
                                const items = groupedActivity[group] ?? []
                                if (items.length === 0) return null
                                return (
                                    <div key={group}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{group}</span>
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </div>
                                        <div className="space-y-2 pl-2">
                                            {items.map(e => {
                                                const Icon = e.icon
                                                return (
                                                    <div key={e.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => router.push(e.link)}>
                                                        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", e.color)}>
                                                            <Icon size={13} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-semibold text-slate-800 truncate">{e.desc}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{formatRelative(e.ts)}</p>
                                                        </div>
                                                        <ChevronRight size={12} className="text-slate-300 mt-2" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            {activityFeed.length === 0 && (
                                <div className="flex flex-col items-center py-10">
                                    <Activity size={28} className="text-slate-300 mb-2" />
                                    <p className="text-xs font-semibold text-slate-500">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Actions + Upcoming */}
                <div className="space-y-4">
                    {/* Pending actions */}
                    <Card className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle size={15} className="text-amber-500" />
                                <h3 className="text-sm font-bold text-slate-900">Pending Actions</h3>
                            </div>
                            <div className="space-y-2">
                                {pendingActions.jobsToApprove.length > 0 && (
                                    <PendingRow
                                        icon={Briefcase}
                                        label={`${pendingActions.jobsToApprove.length} job${pendingActions.jobsToApprove.length > 1 ? "s" : ""} awaiting approval`}
                                        onClick={() => router.push("/hrmcubicle/hire/jobs")}
                                    />
                                )}
                                {pendingActions.offersToApprove.length > 0 && (
                                    <PendingRow
                                        icon={FileSignature}
                                        label={`${pendingActions.offersToApprove.length} offer${pendingActions.offersToApprove.length > 1 ? "s" : ""} need approval`}
                                        onClick={() => router.push("/hrmcubicle/hire/offers")}
                                    />
                                )}
                                {pendingActions.stuckInterviews.length > 0 && (
                                    <PendingRow
                                        icon={Clock}
                                        label={`${pendingActions.stuckInterviews.length} candidate${pendingActions.stuckInterviews.length > 1 ? "s" : ""} stuck > 14 days`}
                                        onClick={() => router.push("/hrmcubicle/hire/candidates")}
                                    />
                                )}
                                {pendingActions.resumesToConvert.length > 0 && (
                                    <PendingRow
                                        icon={Upload}
                                        label={`${pendingActions.resumesToConvert.length} parsed resume${pendingActions.resumesToConvert.length > 1 ? "s" : ""} ready`}
                                        onClick={() => router.push("/hrmcubicle/hire/resume-parser")}
                                    />
                                )}
                                {(pendingActions.jobsToApprove.length + pendingActions.offersToApprove.length + pendingActions.stuckInterviews.length + pendingActions.resumesToConvert.length) === 0 && (
                                    <div className="flex flex-col items-center py-4 text-center">
                                        <CheckCircle2 size={24} className="text-emerald-400 mb-1" />
                                        <p className="text-xs font-semibold text-slate-600">All caught up!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming interviews */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={15} className="text-[#8B5CF6]" />
                                    <h3 className="text-sm font-bold text-slate-900">Upcoming</h3>
                                </div>
                                <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-bold">{upcomingInterviews.length}</Badge>
                            </div>
                            <div className="space-y-2">
                                {upcomingInterviews.length === 0 && (
                                    <p className="text-xs text-slate-400 italic text-center py-3">No upcoming interviews</p>
                                )}
                                {upcomingInterviews.map(iv => {
                                    const cand = candidates.find(c => c.id === iv.candidateId)
                                    return (
                                        <div key={iv.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => router.push("/hrmcubicle/hire/interviews")}>
                                            <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-violet-50 shrink-0">
                                                <span className="text-[9px] font-bold text-[#8B5CF6] uppercase">{new Date(iv.date).toLocaleString("default", { month: "short" })}</span>
                                                <span className="text-sm font-bold text-[#8B5CF6] leading-none">{new Date(iv.date).getDate()}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-slate-900 truncate">{cand ? `${cand.firstName} ${cand.lastName}` : iv.title}</p>
                                                <p className="text-[10px] font-medium text-slate-500 truncate">{iv.time} • {iv.title}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Quick Access Grid ── */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Quick Access</h3>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Jump to any hiring module</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
                        {tiles.map(t => {
                            const Icon = t.icon
                            return (
                                <motion.button
                                    key={t.href}
                                    whileHover={{ y: -2 }}
                                    onClick={() => router.push(t.href)}
                                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all text-left group bg-white"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: t.color }}>
                                            <Icon size={16} />
                                        </div>
                                        {t.count > 0 && (
                                            <Badge className="bg-slate-100 text-slate-700 border-none text-[9px] font-bold h-4 px-1.5">{t.count}</Badge>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 truncate">{t.label}</div>
                                        <div className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{t.desc}</div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ────────────────────────── Helper Components ──────────────────────────

const KpiCard = ({ label, value, delta, icon: Icon, color, i }: { label: string; value: string | number; delta: number; icon: React.ElementType; color: string; i: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
    >
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-3.5">
                <div className="flex items-start justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ background: color }}>
                        <Icon size={14} />
                    </div>
                    {delta !== 0 && (
                        <div className={cn("flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                            delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                            {delta > 0 ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                            {Math.abs(delta)}%
                        </div>
                    )}
                </div>
                <div className="text-xl font-bold text-slate-900 tabular-nums">{value}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5 truncate">{label}</div>
            </CardContent>
        </Card>
    </motion.div>
)

const PendingRow = ({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50/50 text-left group transition-colors">
        <div className="h-7 w-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Icon size={12} />
        </div>
        <span className="text-xs font-semibold text-slate-700 flex-1">{label}</span>
        <ChevronRight size={12} className="text-slate-400 group-hover:text-[#8B5CF6]" />
    </button>
)

export default HireDashboardPage
