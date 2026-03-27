"use client"

import { useState } from "react"
import {
    ShieldAlert,
    Search,
    UserX,
    AlertTriangle,
    Activity,
    ShieldCheck
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogFooter,
} from "@/shared/components/custom/CustomDialog"
import {
    CustomSelect,
    CustomSelectTrigger,
    CustomSelectValue,
    CustomSelectContent,
    CustomSelectItem,
} from "@/shared/components/custom/CustomSelect"
import { CustomLabel } from "@/shared/components/custom/CustomLabel"
import { showSuccess, showWarning } from "@/utils/toast"

interface BlockedUser {
    id: string
    name: string
    email: string
    riskLevel: "Critical" | "Medium" | "Low"
    reason: string
    blockedDate: string
    status: string
}

export default function BlockedRiskyUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [riskFilter, setRiskFilter] = useState("all")
    const [unblockTarget, setUnblockTarget] = useState<BlockedUser | null>(null)

    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
        {
            id: "r1",
            name: "James Bond",
            email: "007@mi6.gov",
            riskLevel: "Critical",
            reason: "Impossible travel detected",
            blockedDate: "2026-03-20",
            status: "Blocked",
        },
        {
            id: "r2",
            name: "Unknown Entity",
            email: "guest_82@proxy.net",
            riskLevel: "Medium",
            reason: "Multiple failed mfa attempts",
            blockedDate: "2026-03-18",
            status: "Blocked",
        },
        {
            id: "r3",
            name: "Sarah Connor",
            email: "s.connor@skynet.io",
            riskLevel: "Critical",
            reason: "Suspicious api access pattern",
            blockedDate: "2026-03-15",
            status: "Blocked",
        },
        {
            id: "r4",
            name: "Alex Morgan",
            email: "a.morgan@external.com",
            riskLevel: "Low",
            reason: "Outdated credentials",
            blockedDate: "2026-03-22",
            status: "Blocked",
        },
    ])

    const filtered = blockedUsers.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRisk = riskFilter === "all" || u.riskLevel.toLowerCase() === riskFilter
        return matchesSearch && matchesRisk
    })

    const criticalCount = blockedUsers.filter((u) => u.riskLevel === "Critical").length
    const mediumCount = blockedUsers.filter((u) => u.riskLevel === "Medium").length

    const handleUnblock = () => {
        if (!unblockTarget) return
        setBlockedUsers((prev) => prev.filter((u) => u.id !== unblockTarget.id))
        showSuccess(`${unblockTarget.name} has been unblocked successfully`)
        setUnblockTarget(null)
    }

    const riskBadge = (level: string) => {
        switch (level) {
            case "Critical":
                return <Badge className="bg-red-50 text-red-600 border border-red-200 rounded-none text-[10px] font-medium">{level}</Badge>
            case "Medium":
                return <Badge className="bg-amber-50 text-amber-600 border border-amber-200 rounded-none text-[10px] font-medium">{level}</Badge>
            default:
                return <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-none text-[10px] font-medium">{level}</Badge>
        }
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Blocked & Risky Users"
                breadcrumbItems={[
                    { label: "Users", href: "#" },
                    { label: "Blocked & risky", href: "#" },
                ]}
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Blocked & risky users</h1>
                    <p className="text-xs text-gray-600 mt-1">Manage blocked accounts and monitor users flagged for suspicious activity</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Total blocked</p>
                        <p className="text-xl font-semibold text-primary mt-1">{blockedUsers.length}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">All blocked accounts</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Critical risk</p>
                        <p className="text-xl font-semibold text-red-600 mt-1">{criticalCount}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Immediate attention needed</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Medium risk</p>
                        <p className="text-xl font-semibold text-amber-600 mt-1">{mediumCount}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Under review</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Threat level</p>
                        <p className="text-xl font-semibold text-green-600 mt-1">Low</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Overall assessment</p>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search by name or email..."
                        />
                    </div>
                    <CustomSelect value={riskFilter} onValueChange={setRiskFilter}>
                        <CustomSelectTrigger className="w-[160px] rounded-none">
                            <CustomSelectValue placeholder="Filter by risk" />
                        </CustomSelectTrigger>
                        <CustomSelectContent className="rounded-none">
                            <CustomSelectItem value="all">All levels</CustomSelectItem>
                            <CustomSelectItem value="critical">Critical</CustomSelectItem>
                            <CustomSelectItem value="medium">Medium</CustomSelectItem>
                            <CustomSelectItem value="low">Low</CustomSelectItem>
                        </CustomSelectContent>
                    </CustomSelect>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Risk level</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Reason</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Blocked date</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">No blocked users found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{riskBadge(user.riskLevel)}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600 max-w-[200px] truncate">{user.reason}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600">{user.blockedDate}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className="bg-red-50 text-red-600 border border-red-200 rounded-none text-[10px] font-medium">
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <CustomButton
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-none text-xs"
                                                    onClick={() => setUnblockTarget(user)}
                                                >
                                                    Unblock
                                                </CustomButton>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Unblock confirmation dialog */}
            <CustomDialog open={!!unblockTarget} onOpenChange={(open) => !open && setUnblockTarget(null)}>
                <CustomDialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-5 py-4">
                        <CustomDialogTitle className="text-white text-sm font-semibold">Confirm unblock</CustomDialogTitle>
                    </div>
                    <div className="px-5 py-4">
                        <CustomDialogDescription className="text-sm text-gray-600">
                            Are you sure you want to unblock <span className="font-semibold text-gray-900">{unblockTarget?.name}</span>? This will restore their access to the system.
                        </CustomDialogDescription>
                    </div>
                    <CustomDialogFooter className="px-5 pb-4">
                        <CustomButton variant="outline" size="sm" className="rounded-none" onClick={() => setUnblockTarget(null)}>
                            Cancel
                        </CustomButton>
                        <CustomButton size="sm" className="rounded-none bg-primary text-white" onClick={handleUnblock}>
                            Unblock user
                        </CustomButton>
                    </CustomDialogFooter>
                </CustomDialogContent>
            </CustomDialog>
        </div>
    )
}
