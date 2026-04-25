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
    BarChart3,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Progress } from "@/shared/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { showSuccess } from "@/shared/utils/toast"

type Review = {
    id: string
    resource: string
    target: string
    progress: number
    status: "In Progress" | "Completed" | "Scheduled"
    type: "Role Review" | "Resource Review" | "Application Review"
    reviewer: string
    dueDate: string
}

export default function AccessReviewsPage() {
    const [loading, setLoading] = useState(false)

    const reviews: Review[] = [
        { id: "r1", resource: "Global Admin Access", target: "5 Users", progress: 60, status: "In Progress", type: "Role Review", reviewer: "Admin Group", dueDate: "Jan 30, 2026" },
        { id: "r2", resource: "Azure Subscription", target: "12 Users", progress: 100, status: "Completed", type: "Resource Review", reviewer: "FinOps Leads", dueDate: "Jan 15, 2026" },
        { id: "r3", resource: "Salesforce Federated", target: "182 Users", progress: 0, status: "Scheduled", type: "Application Review", reviewer: "Auto-Review", dueDate: "Feb 01, 2026" },
    ]

    const totalReviews = reviews.length
    const inProgress = reviews.filter((r) => r.status === "In Progress").length
    const completed = reviews.filter((r) => r.status === "Completed").length
    const scheduled = reviews.filter((r) => r.status === "Scheduled").length

    const handleRefresh = async () => {
        setLoading(true)
        try {
            await new Promise((r) => setTimeout(r, 600))
            showSuccess("Access reviews sync complete")
        } finally {
            setLoading(false)
        }
    }

    const renderStatus = (status: Review["status"]) => {
        if (status === "Completed") {
            return (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-medium">Completed</span>
                </div>
            )
        }
        if (status === "In Progress") {
            return (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-none">
                    <PlayCircle size={12} />
                    <span className="text-[10px] font-medium">In Progress</span>
                </div>
            )
        }
        return (
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-none">
                <Calendar size={12} />
                <span className="text-[10px] font-medium">Scheduled</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Access Reviews</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Periodically validate user access against your governance policies.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Sync Metrics
                        </Button>
                        <Button
                            onClick={() => showSuccess("New review workflow started")}
                            size="sm"
                            className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                        >
                            <ClipboardCheck size={14} />
                            Start New Review
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Reviews</p>
                        <p className="text-white text-xl font-semibold mt-1">{totalReviews}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">All review cycles</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">In Progress</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{inProgress}</p>
                        <p className="text-primary text-[10px] mt-1">Currently running</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Completed</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{completed}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Finished reviews</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Scheduled</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{scheduled}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Upcoming reviews</p>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">Active Reviews</h3>
                            <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-none">
                                {reviews.length} items
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-3"
                            onClick={() => showSuccess("Filtering all review types")}
                        >
                            All Review Types
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Resource Scope</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Review Cycle</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status &amp; Progress</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Expiration</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {reviews.map((r) => (
                                    <tr key={r.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                                                    {r.type === "Role Review" ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-900 block">{r.resource}</span>
                                                    <span className="text-[10px] font-medium text-zinc-500">{r.target} identified</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-zinc-700">{r.type}</span>
                                                <span className="text-[10px] font-medium text-zinc-500">Assigned: {r.reviewer}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24">
                                                    <Progress value={r.progress} className="h-1.5 rounded-none bg-zinc-100" />
                                                </div>
                                                {renderStatus(r.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                                <span className="text-xs font-medium text-zinc-600">{r.dueDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 mb-1">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => showSuccess(`Viewing ${r.resource}`)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => showSuccess(`Re-running ${r.resource}`)}>
                                                        Re-run Review
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => showSuccess(`Exporting ${r.resource}`)}>
                                                        Export Report
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing <span className="text-zinc-900 font-semibold">{reviews.length}</span> review cycles
                        </p>
                    </div>
                </div>

                {/* Footer info cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-emerald-50 rounded-none">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Governance Recommendation</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Your last administrative review was clean. Schedule an automated purge for guest accounts inactive for 90+ days.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <AlertCircle size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Privileged Identity Review</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Highly privileged roles (e.g. Org Admin) should be reviewed monthly to maintain zero-trust principles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
