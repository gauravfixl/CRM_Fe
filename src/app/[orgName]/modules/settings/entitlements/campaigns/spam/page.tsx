"use client"

import React, { useState } from "react"
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    Activity,
    Target,
    ShieldCheck,
    Plus,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function SpamProtectionPage() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [protections, setProtections] = useState([
        { id: "1", rule: "Unsubscribe Link Required", type: "Compliance", severity: "Critical", violations: 0, compliance: 100, status: "Active" },
        { id: "2", rule: "Spam Word Filter", type: "Content", severity: "High", violations: 12, compliance: 94, status: "Active" },
        { id: "3", rule: "Bounce Rate Monitor", type: "Deliverability", severity: "Medium", violations: 3, compliance: 98, status: "Active" },
    ])

    const toggleStatus = (id: string) => {
        setProtections(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Active" ? "Paused" : "Active" } : p))
        toast.success("Protection rule status updated.")
    }

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const rule = formData.get("ruleName") as string
        if (!rule) return toast.error("Rule name is required")
        setProtections(prev => [...prev, {
            id: String(Date.now()),
            rule,
            type: formData.get("ruleType") as string || "Content",
            severity: formData.get("severity") as string || "Medium",
            violations: 0,
            compliance: 100,
            status: "Active"
        }])
        setShowCreateModal(false)
        toast.success(`${rule} protection rule created.`)
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HERO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Spam Protection</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">Ensure compliance and protect sender reputation across all channels.</p>
                    </div>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="h-11 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold text-[11px] shadow-xl shadow-blue-500/20 px-6 rounded-2xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Add Rule
                </Button>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wider">Protection Rules</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">{protections.length}</p>
                        <p className="text-[10px] text-blue-100 font-bold flex items-center gap-1 mt-1">
                            <Shield className="w-3 h-3" /> Active
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Avg. Compliance</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">97%</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3" /> Excellent
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total Violations</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-amber-600">{protections.reduce((sum, p) => sum + p.violations, 0)}</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" /> This month
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Sender Score</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">98</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Excellent reputation
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Spam Protection Rules</h3>
                        <p className="text-xs text-slate-500 font-medium">Monitor and enforce compliance rules across your campaigns.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Rule Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Severity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Violations</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Compliance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {protections.map((protection) => (
                                <tr key={protection.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{protection.rule}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className="bg-blue-50 text-blue-700 border-none rounded-full text-[10px] font-bold px-3 py-1">{protection.type}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className={`${protection.severity === "Critical" ? "bg-red-600" :
                                                protection.severity === "High" ? "bg-amber-600" :
                                                    "bg-blue-600"
                                            } text-white border-none rounded-full text-[10px] font-bold px-3 py-1 flex items-center gap-1 w-fit`}>
                                            {protection.severity === "Critical" && <AlertTriangle className="w-2.5 h-2.5" />} {protection.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        {protection.violations === 0 ? (
                                            <Badge className="bg-emerald-600 text-white border-none rounded-full text-[10px] font-bold px-3 py-1 flex items-center gap-1 w-fit">
                                                <CheckCircle2 className="w-2.5 h-2.5" /> None
                                            </Badge>
                                        ) : (
                                            <span className="text-sm font-black text-amber-600">{protection.violations}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={protection.compliance} className="h-1.5 flex-1 bg-slate-100" />
                                            <span className={`text-xs font-black ${protection.compliance >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {protection.compliance}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={protection.status === "Active"} onCheckedChange={() => toggleStatus(protection.id)} />
                                            <Badge className={`${protection.status === "Active" ? "bg-emerald-600" : "bg-slate-400"} text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5`}>{protection.status}</Badge>
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
                    <div className="bg-gradient-to-br from-red-600 to-rose-700 p-8 text-white relative">
                        <Shield className="w-16 h-16 text-white/10 absolute right-4 top-4" />
                        <DialogTitle className="text-2xl font-black tracking-tight">Add Protection Rule</DialogTitle>
                        <p className="text-red-100 text-xs font-medium mt-2">Create a new spam protection rule for your campaigns.</p>
                    </div>
                    <form onSubmit={handleCreate} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">Rule Name</Label>
                            <Input name="ruleName" placeholder="e.g., Content Keyword Filter" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400">Rule Type</Label>
                                <Select name="ruleType">
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Compliance">Compliance</SelectItem>
                                        <SelectItem value="Content">Content</SelectItem>
                                        <SelectItem value="Deliverability">Deliverability</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-400">Severity</Label>
                                <Select name="severity">
                                    <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                                        <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-2xl text-sm text-slate-500 font-bold">Cancel</Button>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700 rounded-2xl text-sm px-8 h-12 shadow-xl shadow-red-500/20 font-bold transition-all active:scale-95">Add Rule</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
