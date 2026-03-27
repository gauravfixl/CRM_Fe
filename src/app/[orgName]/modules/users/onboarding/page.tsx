"use client"

import { useState } from "react"
import {
    Clock,
    Search,
    MoreVertical,
    AlertTriangle,
    TrendingUp,
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function OnboardingStatusPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const onboardingUsers = [
        {
            id: "orb1",
            name: "Marcus Aurelius",
            email: "marcus@rome.inc",
            currentStep: "Org training",
            progress: 75,
            status: "In progress",
            started: "Mar 20, 2026",
        },
        {
            id: "orb2",
            name: "Seneca Young",
            email: "s.young@stoic.io",
            currentStep: "Profile setup",
            progress: 25,
            status: "Stalled",
            started: "Mar 15, 2026",
        },
    ]

    const filteredUsers = onboardingUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stalledCount = onboardingUsers.filter((u) => u.status === "Stalled").length

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Onboarding status"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Onboarding", href: "#" },
                ]}
                rightControls={
                    <CustomButton
                        className="bg-primary text-white text-xs rounded-none font-semibold"
                        onClick={() => showSuccess("Reminders sent to all pending users")}
                    >
                        Send reminders
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Description */}
                <p className="text-xs text-gray-600">
                    Track and manage new user onboarding progress across all active pipelines.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-primary text-white rounded-none p-5">
                        <p className="text-xs">In pipeline</p>
                        <p className="text-xl font-semibold">{onboardingUsers.length}</p>
                        <p className="text-[10px] opacity-80">Active onboarding users</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5">
                        <p className="text-xs text-gray-600">Avg setup time</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-zinc-100">2.4 days</p>
                        <p className="text-[10px] text-gray-500">Across all users</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 rounded-none p-5">
                        <p className="text-xs text-amber-600">Stalled</p>
                        <p className="text-xl font-semibold text-amber-600">{stalledCount}</p>
                        <p className="text-[10px] text-amber-400">Needs follow-up</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Search users by name or email..."
                    />
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                    <th className="p-4 text-xs font-semibold text-gray-600">Name</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Current step</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Progress</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Started</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 font-semibold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-gray-700 dark:text-zinc-300">{user.currentStep}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-none overflow-hidden min-w-[80px]">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${user.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                                                    {user.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                className={`rounded-none text-xs font-medium border-0 ${
                                                    user.status === "In progress"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "bg-amber-50 text-amber-700"
                                                }`}
                                            >
                                                {user.status === "Stalled" && <AlertTriangle className="w-3 h-3 mr-1" />}
                                                {user.status === "In progress" && <TrendingUp className="w-3 h-3 mr-1" />}
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {user.started}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none transition-colors">
                                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none">
                                                    <DropdownMenuItem
                                                        onClick={() => showSuccess(`Viewing details for ${user.name}`)}
                                                    >
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => showSuccess(`Reminder sent to ${user.name}`)}
                                                    >
                                                        Send reminder
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
