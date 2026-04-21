"use client"

import { useState, useEffect, useCallback } from "react"
import { Target, Plus, Calendar, Star, TrendingUp, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
        { score: 4, label: "Exceeds Expectations", color: "bg-blue-500" },
        { score: 3, label: "Meets Expectations", color: "bg-amber-500" },
        { score: 2, label: "Needs Improvement", color: "bg-orange-500" },
        { score: 1, label: "Unsatisfactory", color: "bg-rose-500" },
    ],
}

export default function AppraisalConfigPage() {
    const [pageLoading, setPageLoading] = useState(true)
    const [cycles, setCycles] = useState<AppraisalCycle[]>([])
    const [scales, setScales] = useState<RatingScale[]>([DEFAULT_SCALE])
    const [isCreateCycle, setIsCreateCycle] = useState(false)
    const [newCycle, setNewCycle] = useState({
        employee: "",
        period: "",
        rating: 3,
        comments: "",
        recommendation: "None" as string,
    })
    const [employees, setEmployees] = useState<{ _id: string; firstName?: string; lastName?: string; employeeId?: string }[]>([])
    const [saving, setSaving] = useState(false)

    const fetchAppraisals = useCallback(async () => {
        try {
            const response = await getAllAppraisals()
            const data = response?.data?.data || response?.data?.appraisals || []
            if (Array.isArray(data)) {
                const mapped: AppraisalCycle[] = data.map((item: any) => ({
                    id: item.id || item._id,
                    name: item.employee?.employeeId
                        ? `${item.employee.employeeId} - ${item.period}`
                        : item.period,
                    period: item.period || "",
                    rating: item.rating || 0,
                    status: item.status || "Pending",
                    employee: item.employee || {},
                    reviewedBy: item.reviewedBy || "",
                    recommendation: item.recommendation || "None",
                    criteria: item.criteria || [],
                }))
                setCycles(mapped)

                // Derive rating scales from criteria across all appraisals
                const allCriteria = data.flatMap((item: any) => item.criteria || [])
                if (allCriteria.length > 0) {
                    const uniqueLabels = new Map<string, number>()
                    allCriteria.forEach((c: any) => {
                        if (c.label && c.score) {
                            uniqueLabels.set(c.label, c.score)
                        }
                    })
                    if (uniqueLabels.size > 0) {
                        const colors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-orange-500", "bg-rose-500"]
                        const sortedEntries = Array.from(uniqueLabels.entries()).sort((a, b) => b[1] - a[1])
                        const derivedScale: RatingScale = {
                            id: "derived-criteria",
                            name: "Criteria-Based Scale",
                            levels: sortedEntries.map(([label, score], i) => ({
                                score,
                                label,
                                color: colors[i % colors.length],
                            })),
                        }
                        setScales([DEFAULT_SCALE, derivedScale])
                    } else {
                        setScales([DEFAULT_SCALE])
                    }
                } else {
                    setScales([DEFAULT_SCALE])
                }
            }
        } catch {
            // Error handled in hook
        } finally {
            setPageLoading(false)
        }
    }, [])

    const fetchEmployees = useCallback(async () => {
        try {
            const response = await getAllEmployees()
            const data = response?.data?.data || response?.data?.employees || response?.data || []
            if (Array.isArray(data)) {
                setEmployees(data)
            }
        } catch {
            // Employees fetch is optional for the dropdown
        }
    }, [])

    useEffect(() => {
        fetchAppraisals()
        fetchEmployees()
    }, [fetchAppraisals, fetchEmployees])

    const activeCycles = cycles.filter((c) => c.status === "Pending").length
    const completedCycles = cycles.filter((c) => c.status === "Completed").length
    const avgRating = cycles.length > 0
        ? (cycles.reduce((sum, c) => sum + c.rating, 0) / cycles.length).toFixed(1)
        : "0"

    const handleCreateCycle = async () => {
        if (!newCycle.employee) return toast.error("Employee is required")
        if (!newCycle.period) return toast.error("Period is required")
        if (!newCycle.rating) return toast.error("Rating is required")

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
            setNewCycle({ employee: "", period: "", rating: 3, comments: "", recommendation: "None" })
            toast.success("Appraisal created successfully")
            await fetchAppraisals()
        } catch {
            // Error handled in hook
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
            toast.success(`Appraisal marked as ${newStatus}`)
            await fetchAppraisals()
        } catch {
            // Error handled in hook
        }
    }

    const deleteCycleHandler = async (id: string) => {
        try {
            await deleteAppraisal(id)
            toast.success("Appraisal removed")
            await fetchAppraisals()
        } catch {
            // Error handled in hook
        }
    }

    if (pageLoading) {
        return (
            <div className="font-outfit flex items-center justify-center min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400"><span>HR Governance</span><span>/</span><span className="text-gray-900 font-semibold">Appraisal Config</span></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Appraisal & Performance Config</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure review cycles, rating scales, and performance frameworks.</p>
                    </div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5" onClick={() => setIsCreateCycle(true)}>
                        <Plus className="w-4 h-4" />New Appraisal
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">Total Appraisals</p><p className="text-xl font-semibold text-white tracking-tight">{cycles.length}</p><p className="text-[10px] text-white/70">Review records</p></div><Target className="w-5 h-5 text-white/80" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Pending</p><p className="text-xl font-semibold text-gray-900">{activeCycles}</p><p className="text-[10px] text-gray-500">Awaiting completion</p></div><Calendar className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Rating Scales</p><p className="text-xl font-semibold text-gray-900">{scales.length}</p><p className="text-[10px] text-gray-500">Templates</p></div><Star className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Avg Rating</p><p className="text-xl font-semibold text-gray-900">{avgRating}</p><p className="text-[10px] text-gray-500">Across all appraisals</p></div><TrendingUp className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
            </div>

            {/* Appraisal Cycles */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b"><h3 className="text-sm font-semibold text-gray-900">Appraisals</h3><p className="text-xs text-gray-500 mt-0.5">Performance appraisal records.</p></div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Employee / Period</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Period</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Rating</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Recommendation</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cycles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-xs text-gray-400">No appraisals found. Create one to get started.</TableCell>
                            </TableRow>
                        )}
                        {cycles.map((c) => (
                            <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><Target className="w-4 h-4" /></div><div><span className="text-xs font-semibold text-gray-900 block">{c.employee?.employeeId || c.employee?.email || "N/A"}</span><span className="text-[10px] text-gray-400">{c.period}</span></div></div></TableCell>
                                <TableCell className="py-3 text-center"><Badge className="text-[10px] rounded-full px-2 py-0.5 font-semibold bg-blue-50 text-blue-600 border-none">{c.period}</Badge></TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-3 h-3 ${star <= c.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                        ))}
                                        <span className="text-[10px] text-gray-500 ml-1">({c.rating})</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[8px] px-1.5 py-0.5 rounded-full border-none font-semibold ${
                                        c.recommendation === "Promotion" ? "bg-emerald-50 text-emerald-600" :
                                        c.recommendation === "Salary Hike" ? "bg-blue-50 text-blue-600" :
                                        c.recommendation === "Warning" ? "bg-rose-50 text-rose-600" :
                                        c.recommendation === "Training" ? "bg-amber-50 text-amber-600" :
                                        "bg-gray-100 text-gray-600"
                                    }`}>{c.recommendation || "None"}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Switch checked={c.status === "Completed"} onCheckedChange={() => toggleCycle(c.id)} className="scale-90" />
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50 rounded-lg" onClick={() => deleteCycleHandler(c.id)}>
                                        <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Rating Scales */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Rating Scales</h3>
                {scales.map((scale) => (
                    <div key={scale.id} className="border border-gray-200 rounded-lg p-4 mb-3 last:mb-0">
                        <p className="text-xs font-semibold text-gray-900 mb-3">{scale.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {scale.levels.map((l) => (
                                <div key={l.score} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className={`w-3 h-3 rounded-full ${l.color}`} />
                                    <span className="text-[10px] font-semibold text-gray-700">{l.score}</span>
                                    <span className="text-[10px] text-gray-500">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isCreateCycle} onOpenChange={setIsCreateCycle}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">New Appraisal</DialogTitle></DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Employee</Label>
                            <Select value={newCycle.employee} onValueChange={(v) => setNewCycle({ ...newCycle, employee: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Select employee" /></SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp._id} value={emp._id} className="text-xs">
                                            {emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.employeeId || emp._id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Period</Label><Input className="h-9 rounded-lg text-xs" value={newCycle.period} onChange={(e) => setNewCycle({ ...newCycle, period: e.target.value })} placeholder="e.g. 2025-Q1, 2025-Annual" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Rating (1-5)</Label>
                            <Select value={String(newCycle.rating)} onValueChange={(v) => setNewCycle({ ...newCycle, rating: Number(v) })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{[1, 2, 3, 4, 5].map((r) => (<SelectItem key={r} value={String(r)} className="text-xs">{r} - {r === 5 ? "Exceptional" : r === 4 ? "Exceeds Expectations" : r === 3 ? "Meets Expectations" : r === 2 ? "Needs Improvement" : "Unsatisfactory"}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Recommendation</Label>
                            <Select value={newCycle.recommendation} onValueChange={(v) => setNewCycle({ ...newCycle, recommendation: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["None", "Promotion", "Salary Hike", "Warning", "Training"].map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Comments</Label><Input className="h-9 rounded-lg text-xs" value={newCycle.comments} onChange={(e) => setNewCycle({ ...newCycle, comments: e.target.value })} placeholder="Optional comments" /></div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreateCycle} disabled={saving} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                        {saving && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                        Create Appraisal
                    </Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
