"use client"

import { useState } from "react"
import { Target, Plus, MoreHorizontal, Calendar, Star, TrendingUp, BarChart3, Pencil, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AppraisalCycle {
    id: string
    name: string
    frequency: "Monthly" | "Quarterly" | "Half-Yearly" | "Annual"
    startMonth: string
    selfReview: boolean
    managerReview: boolean
    peerReview: boolean
    isActive: boolean
}

interface RatingScale {
    id: string
    name: string
    levels: { score: number; label: string; color: string }[]
}

const INITIAL_CYCLES: AppraisalCycle[] = [
    { id: "1", name: "Annual Performance Review", frequency: "Annual", startMonth: "April", selfReview: true, managerReview: true, peerReview: false, isActive: true },
    { id: "2", name: "Mid-Year Check-in", frequency: "Half-Yearly", startMonth: "October", selfReview: true, managerReview: true, peerReview: false, isActive: true },
    { id: "3", name: "Quarterly Goals Review", frequency: "Quarterly", startMonth: "January", selfReview: true, managerReview: true, peerReview: true, isActive: false },
]

const INITIAL_SCALES: RatingScale[] = [
    { id: "1", name: "Standard 5-Point", levels: [
        { score: 5, label: "Exceptional", color: "bg-emerald-500" },
        { score: 4, label: "Exceeds Expectations", color: "bg-blue-500" },
        { score: 3, label: "Meets Expectations", color: "bg-amber-500" },
        { score: 2, label: "Needs Improvement", color: "bg-orange-500" },
        { score: 1, label: "Unsatisfactory", color: "bg-rose-500" },
    ]},
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function AppraisalConfigPage() {
    const [cycles, setCycles] = useState<AppraisalCycle[]>(INITIAL_CYCLES)
    const [scales, setScales] = useState<RatingScale[]>(INITIAL_SCALES)
    const [isCreateCycle, setIsCreateCycle] = useState(false)
    const [newCycle, setNewCycle] = useState({ name: "", frequency: "Annual" as AppraisalCycle["frequency"], startMonth: "April", selfReview: true, managerReview: true, peerReview: false })

    const activeCycles = cycles.filter((c) => c.isActive).length

    const handleCreateCycle = () => {
        if (!newCycle.name) return toast.error("Cycle name is required")
        setCycles([...cycles, { ...newCycle, id: Date.now().toString(), isActive: true }])
        setIsCreateCycle(false)
        setNewCycle({ name: "", frequency: "Annual", startMonth: "April", selfReview: true, managerReview: true, peerReview: false })
        toast.success("Appraisal cycle created")
    }

    const toggleCycle = (id: string) => {
        setCycles(cycles.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
        toast.success("Cycle status updated")
    }

    const deleteCycle = (id: string) => {
        setCycles(cycles.filter((c) => c.id !== id))
        toast.success("Cycle removed")
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
                        <Plus className="w-4 h-4" />New Cycle
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">Total Cycles</p><p className="text-xl font-semibold text-white tracking-tight">{cycles.length}</p><p className="text-[10px] text-white/70">Review schedules</p></div><Target className="w-5 h-5 text-white/80" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Active</p><p className="text-xl font-semibold text-gray-900">{activeCycles}</p><p className="text-[10px] text-gray-500">Currently running</p></div><Calendar className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Rating Scales</p><p className="text-xl font-semibold text-gray-900">{scales.length}</p><p className="text-[10px] text-gray-500">Templates</p></div><Star className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Peer Reviews</p><p className="text-xl font-semibold text-gray-900">{cycles.filter((c) => c.peerReview).length}</p><p className="text-[10px] text-gray-500">360-degree enabled</p></div><TrendingUp className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
            </div>

            {/* Appraisal Cycles */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b"><h3 className="text-sm font-semibold text-gray-900">Appraisal Cycles</h3><p className="text-xs text-gray-500 mt-0.5">Scheduled performance review periods.</p></div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Cycle</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Frequency</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Starts</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Reviews</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cycles.map((c) => (
                            <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><Target className="w-4 h-4" /></div><span className="text-xs font-semibold text-gray-900">{c.name}</span></div></TableCell>
                                <TableCell className="py-3 text-center"><Badge className="text-[10px] rounded-full px-2 py-0.5 font-semibold bg-blue-50 text-blue-600 border-none">{c.frequency}</Badge></TableCell>
                                <TableCell className="py-3 text-center"><span className="text-xs text-gray-600">{c.startMonth}</span></TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {c.selfReview && <Badge className="text-[8px] px-1 py-0 rounded bg-gray-100 text-gray-600 border-none">Self</Badge>}
                                        {c.managerReview && <Badge className="text-[8px] px-1 py-0 rounded bg-gray-100 text-gray-600 border-none">Mgr</Badge>}
                                        {c.peerReview && <Badge className="text-[8px] px-1 py-0 rounded bg-gray-100 text-gray-600 border-none">Peer</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Switch checked={c.isActive} onCheckedChange={() => toggleCycle(c.id)} className="scale-90" />
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50 rounded-lg" onClick={() => deleteCycle(c.id)}>
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
                    <div key={scale.id} className="border border-gray-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-900 mb-3">{scale.name}</p>
                        <div className="flex items-center gap-2">
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
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">New Appraisal Cycle</DialogTitle></DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Cycle Name</Label><Input className="h-9 rounded-lg text-xs" value={newCycle.name} onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })} placeholder="e.g. Q1 Performance Review" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Frequency</Label>
                            <Select value={newCycle.frequency} onValueChange={(v: AppraisalCycle["frequency"]) => setNewCycle({ ...newCycle, frequency: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Monthly", "Quarterly", "Half-Yearly", "Annual"].map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Start Month</Label>
                            <Select value={newCycle.startMonth} onValueChange={(v) => setNewCycle({ ...newCycle, startMonth: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{MONTHS.map((m) => (<SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Self Review</Label><Switch checked={newCycle.selfReview} onCheckedChange={(v) => setNewCycle({ ...newCycle, selfReview: v })} /></div>
                            <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Manager Review</Label><Switch checked={newCycle.managerReview} onCheckedChange={(v) => setNewCycle({ ...newCycle, managerReview: v })} /></div>
                            <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Peer Review (360°)</Label><Switch checked={newCycle.peerReview} onCheckedChange={(v) => setNewCycle({ ...newCycle, peerReview: v })} /></div>
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreateCycle} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Create Cycle</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
