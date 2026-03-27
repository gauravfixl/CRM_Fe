"use client"

import { useState } from "react"
import {
    ClipboardCheck,
    Calendar,
    Clock,
    Shield,
    RefreshCw,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    FileText,
    PlayCircle,
    BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export default function AccessReviewsPage() {
    const [loading, setLoading] = useState(false)

    const reviews = [
        { id: "r1", resource: "Global Admin Access", target: "5 Users", progress: 60, status: "In Progress", type: "Role Review", reviewer: "Admin Group", dueDate: "Jan 30, 2026" },
        { id: "r2", resource: "Azure Subscription", target: "12 Users", progress: 100, status: "Completed", type: "Resource Review", reviewer: "FinOps Leads", dueDate: "Jan 15, 2026" },
        { id: "r3", resource: "Salesforce Federated", target: "182 Users", progress: 0, status: "Scheduled", type: "Application Review", reviewer: "Auto-Review", dueDate: "Feb 01, 2026" },
    ]

    const totalReviews = reviews.length
    const inProgress = reviews.filter((r) => r.status === "In Progress").length
    const completed = reviews.filter((r) => r.status === "Completed").length
    const scheduled = reviews.filter((r) => r.status === "Scheduled").length

    const handleRefresh = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.info("Access reviews sync complete")
        }, 1000)
    }

    return (
        <div className="font-outfit relative min-h-screen bg-[#F8F9FC]">
            {/* Header */}
            <div className="px-4 md:px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-gray-400">Identity & Access</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-medium text-gray-400">Governance</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-semibold text-gray-900">Reviews</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Access Reviews</h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="rounded-xl font-semibold text-xs h-10 px-4"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} /> Sync Metrics
                    </Button>
                    <Button
                        className="rounded-xl font-semibold text-xs h-10 px-6"
                        onClick={() => toast.success("New review workflow started")}
                    >
                        <ClipboardCheck className="w-4 h-4 mr-2" /> Start New Review
                    </Button>
                </div>
            </div>

            <div className="p-4 md:px-8 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="rounded-xl bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <BarChart3 className="w-5 h-5 text-white/80" />
                            </div>
                            <p className="text-xl font-semibold">{totalReviews}</p>
                            <p className="text-xs text-white/80">Total Reviews</p>
                            <p className="text-[10px] text-white/60 mt-0.5">All review cycles</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <PlayCircle className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{inProgress}</p>
                            <p className="text-xs text-gray-600">In Progress</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Currently running</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{completed}</p>
                            <p className="text-xs text-gray-600">Completed</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Finished reviews</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{scheduled}</p>
                            <p className="text-xs text-gray-600">Scheduled</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Upcoming reviews</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Reviews Table */}
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h4 className="text-sm font-semibold text-gray-900">Active Reviews</h4>
                            <Badge className="rounded-full bg-zinc-100 text-zinc-600 border-0 text-[10px] font-semibold px-2.5">
                                {reviews.length} items
                            </Badge>
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-xl font-semibold text-xs h-9 px-4"
                            onClick={() => toast.info("Filtering all review types")}
                        >
                            All Review Types
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-zinc-100 hover:bg-transparent bg-zinc-50/50">
                                    <TableHead className="p-4 text-xs font-semibold text-gray-500">Resource Scope</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-gray-500">Review Cycle</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-gray-500">Status & Progress</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-gray-500">Expiration</TableHead>
                                    <TableHead className="p-4 text-right w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-50">
                                {reviews.map((r) => (
                                    <TableRow key={r.id} className="hover:bg-zinc-50/50 transition-all group">
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform">
                                                    {r.type === "Role Review" ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 tracking-tight">{r.resource}</span>
                                                    <span className="text-[10px] font-medium text-gray-400">{r.target} identified</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold text-gray-600">{r.type}</span>
                                                <p className="text-[10px] font-medium text-gray-400">Assigned: {r.reviewer}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 w-24">
                                                    <Progress value={r.progress} className={`h-1.5 rounded-full ${
                                                        r.status === "Completed" ? "bg-emerald-100" : "bg-zinc-100"
                                                    }`} />
                                                </div>
                                                <Badge className={`rounded-full border-0 text-[10px] font-semibold ${
                                                    r.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                    r.status === "In Progress" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-500"
                                                }`}>
                                                    {r.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-zinc-300" />
                                                <span className="text-xs font-medium text-gray-500">{r.dueDate}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-400 hover:text-indigo-600 h-8 w-8"
                                                onClick={() => toast.info(`Options for ${r.resource}`)}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Footer Info Cards */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h6 className="text-sm font-semibold text-emerald-900">Governance Recommendation</h6>
                            <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">
                                Your last administrative review was clean. We recommend scheduling an Automated Purge for guest accounts that haven't signed in for 90 days.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 p-5 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h6 className="text-sm font-semibold text-blue-900">Privileged Identity Review</h6>
                            <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                                Highly privileged roles (e.g. Org Admin) should be reviewed monthly to maintain zero-trust principles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
