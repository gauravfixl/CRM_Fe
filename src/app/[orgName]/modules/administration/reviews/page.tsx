"use client"

import { useState } from "react"
import {
    ClipboardCheck,
    Calendar,
    UserCheck,
    UserX,
    Clock,
    Shield,
    ChevronRight,
    Filter,
    RefreshCw,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    FileText
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export default function AccessReviewsPage() {
    const [loading, setLoading] = useState(false)

    const reviews = [
        { id: "r1", resource: "Global Admin Access", target: "5 Users", progress: 60, status: "In Progress", type: "Role Review", reviewer: "Admin Group", dueDate: "Jan 30, 2026" },
        { id: "r2", resource: "Azure Subscription", target: "12 Users", progress: 100, status: "Completed", type: "Resource Review", reviewer: "FinOps Leads", dueDate: "Jan 15, 2026" },
        { id: "r3", resource: "Salesforce Federated", target: "182 Users", progress: 0, status: "Scheduled", type: "Application Review", reviewer: "Auto-Review", dueDate: "Feb 01, 2026" },
    ]

    const handleRefresh = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.info("Access reviews sync complete")
        }, 1000)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Access Reviews"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Governance", href: "#" },
                    { label: "Reviews", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-10 px-4 font-bold"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync Metrics
                        </CustomButton>
                        <CustomButton className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-6 font-bold shadow-xl border-0">
                            <ClipboardCheck className="w-4 h-4 mr-2" /> Start New Review
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Compliance Meter */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-1 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-8 bg-zinc-950 text-white flex flex-col justify-between space-y-8 md:w-80 shrink-0">
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Compliance Status</h5>
                            <p className="text-3xl font-black tracking-tighter text-white italic uppercase">88% Healthy</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                    <span>Resolved</span>
                                    <span>142</span>
                                </div>
                                <Progress value={88} className="h-1 bg-zinc-800 rounded-none" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-orange-400">
                                    <span>Pending</span>
                                    <span>18</span>
                                </div>
                                <Progress value={12} className="h-1 bg-zinc-800 rounded-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 bg-white dark:bg-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Insights</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">12</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Critical Roles Scanned</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Auto-Remediation</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                                    <UserX className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">24</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stale Accounts Purged</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Upcoming Audit</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-orange-50 dark:bg-orange-900/10 text-orange-600 flex items-center justify-center border border-orange-100 dark:border-orange-800">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">In 4d</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quarterly IAM Review</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-zinc-900 text-white rounded-none border-0 text-[10px] font-black px-3 py-1">ACTIVE REVIEWS</Badge>
                            <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Identity Directory Lifecycle</h4>
                        </div>
                        <CustomButton variant="ghost" size="sm" className="text-zinc-400 rounded-none border border-zinc-200 h-9 px-4 font-bold text-[10px] uppercase">
                            <Filter className="w-3.5 h-3.5 mr-2" /> All Review Types
                        </CustomButton>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent bg-zinc-50/50">
                                    <TableHead className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Resource Scope</TableHead>
                                    <TableHead className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Review Cycle</TableHead>
                                    <TableHead className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Status & Progress</TableHead>
                                    <TableHead className="p-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Expiration</TableHead>
                                    <TableHead className="p-5 text-right w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {reviews.map((r) => (
                                    <TableRow key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                                                    {r.type === 'Role Review' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{r.resource}</span>
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{r.target} identified</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{r.type}</span>
                                                <p className="text-[10px] font-medium text-zinc-400">Assigned: {r.reviewer}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 w-24">
                                                    <Progress value={r.progress} className={`h-1.5 rounded-none ${r.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-zinc-100 dark:bg-zinc-800'
                                                        }`}>
                                                        <div className={`h-full ${r.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${r.progress}%` }}></div>
                                                    </Progress>
                                                </div>
                                                <Badge className={`rounded-none border-0 text-[10px] font-black uppercase tracking-widest ${r.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    r.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                                                    }`}>
                                                    {r.status}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-zinc-300" />
                                                <span className="text-xs font-bold text-zinc-500">{r.dueDate}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5 text-right">
                                            <CustomButton variant="ghost" size="icon" className="text-zinc-400 hover:text-indigo-600 rounded-none">
                                                <MoreVertical className="w-4 h-4" />
                                            </CustomButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Compliance Footer */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 p-6 bg-emerald-50/50 border border-emerald-100 rounded-none flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div className="space-y-1">
                            <h6 className="text-sm font-black text-emerald-900">Governance Recommendation</h6>
                            <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">
                                Your last administrative review was clean. We recommend scheduling an 'Automated Purge' for guest accounts that haven't signed in for 90 days.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 p-6 bg-blue-50/50 border border-blue-100 rounded-none flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                        <div className="space-y-1">
                            <h6 className="text-sm font-black text-blue-900">Privileged Identity Review</h6>
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
