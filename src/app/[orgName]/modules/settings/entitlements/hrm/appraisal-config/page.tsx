"use client"

import { useState, useEffect, useCallback } from "react"
import { Target, Plus, Calendar, Star, TrendingUp, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    getAllAppraisals,
    createAppraisal,
    updateAppraisal,
    deleteAppraisal,
    getAllEmployees,
} from "@/modules/hrm/hooks/hrmHooks"

interface AppraisalCycle {
    id: string
    name: string
    period: string
    rating: number
    status: "Pending" | "Completed"
    employee: { id?: string; email?: string; employeeId?: string }
    reviewedBy?: string
    recommendation?: string
    criteria?: { label: string; score: number; comments?: string }[]
}

interface RatingScale {
    id: string
    name: string
    levels: { score: number; label: string; color: string }[]
}

const DEFAULT_SCALE: RatingScale = {
    id: "default-5pt",
    name: "Standard 5-Point",
    levels: [
        { score: 5, label: "Exceptional", color: "bg-emerald-500" },
        { score: 4, label: "Exceeds Expectations", color: "bg-primary" },
        { score: 3, label: "Meets Expectations", color: "bg-amber-500" },
        { score: 2, label: "Needs Improvement", color: "bg-orange-500" },
        { score: 1, label: "Unsatisfactory", color: "bg-rose-500" },
    ],
}

const DEFAULT_NEW = {
    employee: "",
    period: "",
    rating: 3,
    comments: "",
    recommendation: "None" as string,
}

export default function AppraisalConfigPage() {
    const [pageLoading, setPageLoading] = useState(true)
    const [cycles, setCycles] = useState<AppraisalCycle[]>([])
    const [scales, setScales] = useState<RatingScale[]>([DEFAULT_SCALE])
    const [isCreateCycle, setIsCreateCycle] = useState(false)
    const [newCycle, setNewCycle] = useState(DEFAULT_NEW)
    const [employees, setEmployees] = useState<{ _id: string; firstName?: string; lastName?: string; employeeId?: string }[]>([])
    const [saving, setSaving] = useState(false)

    const fetchAppraisals = useCallback(async () => {
        try {
            const response = await getAllAppraisals()
            const data = response?.data?.data || response?.data?.appraisals || []
            if (Array.isArray(data)) {
                const mapped: AppraisalCycle[] = data.map((item: any) => ({
                    id: item.id || item._id,
                    name: item.employee?.employeeId ? `${item.employee.employeeId} - ${item.period}` : item.period,
                    period: item.period || "",
                    rating: item.rating || 0,
                    status: item.status || "Pending",
                    employee: item.employee || {},
                    reviewedBy: item.reviewedBy || "",
                    recommendation: item.recommendation || "None",
                    criteria: item.criteria || [],
                }))
                setCycles(mapped)

                const allCriteria = data.flatMap((item: any) => item.criteria || [])
                if (allCriteria.length > 0) {
                    const uniqueLabels = new Map<string, number>()
                    allCriteria.forEach((c: any) => {
                        if (c.label && c.score) uniqueLabels.set(c.label, c.score)
                    })
                    if (uniqueLabels.size > 0) {
                        const colors = ["bg-emerald-500", "bg-primary", "bg-amber-500", "bg-orange-500", "bg-rose-500"]
                        const sortedEntries = Array.from(uniqueLabels.entries()).sort((a, b) => b[1] - a[1])
                        setScales([DEFAULT_SCALE, {
                            id: "derived-criteria",
                            name: "Criteria-Based Scale",
                            levels: sortedEntries.map(([label, score], i) => ({ score, label, color: colors[i % colors.length] })),
                        }])
                    } else {
                        setScales([DEFAULT_SCALE])
                    }
                } else {
                    setScales([DEFAULT_SCALE])
                }
            }
        } catch {
            // handled
        } finally {
            setPageLoading(false)
        }
    }, [])

    const fetchEmployees = useCallback(async () => {
        try {
            const response = await getAllEmployees()
            const data = response?.data?.data || response?.data?.employees || response?.data || []
            if (Array.isArray(data)) setEmployees(data)
        } catch {}
    }, [])

    useEffect(() => {
        fetchAppraisals()
        fetchEmployees()
    }, [fetchAppraisals, fetchEmployees])

    const activeCycles = cycles.filter((c) => c.status === "Pending").length
    const completedCycles = cycles.filter((c) => c.status === "Completed").length
    const avgRating = cycles.length > 0 ? (cycles.reduce((sum, c) => sum + c.rating, 0) / cycles.length).toFixed(1) : "0"

    const handleCreateCycle = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCycle.employee) return showWarning("Employee is required")
        if (!newCycle.period) return showWarning("Period is required")
        if (!newCycle.rating) return showWarning("Rating is required")

        setSaving(true)
        try {
            await createAppraisal({
                employee: newCycle.employee,
                period: newCycle.period,
                rating: newCycle.rating,
                comments: newCycle.comments || undefined,
                recommendation: newCycle.recommendation || undefined,
            })
            setIsCreateCycle(false)
            setNewCycle(DEFAULT_NEW)
            showSuccess("Appraisal created successfully")
            await fetchAppraisals()
        } finally {
            setSaving(false)
        }
    }

    const toggleCycle = async (id: string) => {
        const cycle = cycles.find((c) => c.id === id)
        if (!cycle) return
        const newStatus = cycle.status === "Pending" ? "Completed" : "Pending"
        try {
            await updateAppraisal(id, { status: newStatus })
            showSuccess(`Appraisal marked as ${newStatus}`)
            await fetchAppraisals()
        } catch {}
    }

    const deleteCycleHandler = async (id: string) => {
        const confirmed = window.confirm("Remove this appraisal?")
        if (!confirmed) return
        try {
            await deleteAppraisal(id)
            showSuccess("Appraisal removed")
            await fetchAppraisals()
        } catch {}
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Appraisal & Performance</h1>
                        <p className="text-sm text-zinc-500 mt-1">Configure review cycles, rating scales, and performance frameworks.</p>
                    </div>
                    <Button
                        onClick={() => { setNewCycle(DEFAULT_NEW); setIsCreateCycle(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Appraisal
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Appraisals</p>
                        <p className="text-white text-xl font-semibold mt-1">{cycles.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Review records</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Pending</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{activeCycles}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Awaiting completion</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Completed</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{completedCycles}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Finalized reviews</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg Rating</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgRating}</p>
                        <p className="text-primary text-[10px] mt-1">Across all appraisals</p>
                    </div>
                </div>

                {/* Appraisals */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h3 className="text-sm font-semibold text-zinc-900">Appraisals</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Performance appraisal records.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Employee</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Period</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Rating</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Recommendation</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Completed</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {cycles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Target className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No appraisals yet — create one to get started</p>
                                        </td>
                                    </tr>
                                ) : (
                                    cycles.map((c) => (
                                        <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        <Target size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-900 block">{c.employee?.employeeId || c.employee?.email || "Unknown"}</span>
                                                        <span className="text-[10px] text-gray-400">{c.period}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className="text-[10px] rounded-none px-2 py-0.5 font-medium bg-primary/10 text-primary">{c.period}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`w-3 h-3 ${star <= c.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`} />
                                                    ))}
                                                    <span className="text-[10px] text-zinc-500 ml-1">({c.rating})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-none font-medium ${
                                                    c.recommendation === "Promotion" ? "bg-emerald-50 text-emerald-600" :
                                                    c.recommendation === "Salary Hike" ? "bg-primary/10 text-primary" :
                                                    c.recommendation === "Warning" ? "bg-rose-50 text-rose-600" :
                                                    c.recommendation === "Training" ? "bg-amber-50 text-amber-600" :
                                                    "bg-zinc-100 text-zinc-600"
                                                }`}>{c.recommendation || "None"}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <Switch checked={c.status === "Completed"} onCheckedChange={() => toggleCycle(c.id)} className="scale-90" />
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50 rounded-none" onClick={() => deleteCycleHandler(c.id)}>
                                                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Rating Scales */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                    <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                        <Star className="w-4 h-4 text-zinc-500" />
                        <h3 className="text-sm font-semibold text-zinc-900">Rating Scales</h3>
                    </div>
                    <div className="p-5 space-y-3">
                        {scales.map((scale) => (
                            <div key={scale.id} className="border border-zinc-200 rounded-none p-4">
                                <p className="text-xs font-semibold text-zinc-900 mb-3">{scale.name}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {scale.levels.map((l) => (
                                        <div key={l.score} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none bg-zinc-50 border border-zinc-100">
                                            <div className={`w-3 h-3 ${l.color}`} />
                                            <span className="text-[10px] font-semibold text-zinc-700">{l.score}</span>
                                            <span className="text-[10px] text-zinc-500">{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create appraisal sheet */}
            <SideFormSheet
                open={isCreateCycle}
                onOpenChange={(o) => { setIsCreateCycle(o); if (!o) setNewCycle(DEFAULT_NEW) }}
                title="New Appraisal"
                description="Create a performance appraisal record for an employee."
                icon={<Target className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreateCycle}
                submitLabel={saving ? "Creating..." : "Create Appraisal"}
                loading={saving}
                submitDisabled={!newCycle.employee || !newCycle.period}
            >
                <div className="space-y-4">
                    <Field label="Employee" required>
                        <Select value={newCycle.employee} onValueChange={(v) => setNewCycle({ ...newCycle, employee: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue placeholder="Select employee" /></SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem key={emp._id} value={emp._id}>
                                        {emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.employeeId || emp._id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Period" required hint="e.g. 2025-Q1, 2025-Annual">
                        <Input
                            placeholder="e.g. 2025-Q1"
                            value={newCycle.period}
                            onChange={(e) => setNewCycle({ ...newCycle, period: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Rating" required>
                        <Select value={String(newCycle.rating)} onValueChange={(v) => setNewCycle({ ...newCycle, rating: Number(v) })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <SelectItem key={r} value={String(r)}>
                                        {r} - {r === 5 ? "Exceptional" : r === 4 ? "Exceeds Expectations" : r === 3 ? "Meets Expectations" : r === 2 ? "Needs Improvement" : "Unsatisfactory"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Recommendation">
                        <Select value={newCycle.recommendation} onValueChange={(v) => setNewCycle({ ...newCycle, recommendation: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["None", "Promotion", "Salary Hike", "Warning", "Training"].map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Comments" hint="Optional notes from the reviewer">
                        <Textarea
                            placeholder="Strengths, areas for growth..."
                            value={newCycle.comments}
                            onChange={(e) => setNewCycle({ ...newCycle, comments: e.target.value })}
                            className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary min-h-[90px] text-sm"
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}
