"use client"

import { useState } from "react"
import {
    ShieldCheck,
    ShieldAlert,
    Search,
    Smartphone,
    Key,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Filter,
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

export default function MFAEnrollmentPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"All" | "Enabled" | "Disabled">("All")

    const users = [
        { id: "m1", name: "David Miller", email: "d.miller@enterprise.io", status: "Enabled", method: "Authenticator app", strength: "Strong" },
        { id: "m2", name: "Samantha Reed", email: "sreed@fixl.com", status: "Disabled", method: "None", strength: "Weak" },
        { id: "m3", name: "Liam Wilson", email: "liam.w@external.org", status: "Enabled", method: "Sms / text", strength: "Strong" },
    ]

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "All" || u.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalEnrolled = users.filter((u) => u.status === "Enabled").length

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Mfa enrollment"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Security", href: "#" },
                    { label: "Mfa status", href: "#" },
                ]}
                rightControls={
                    <CustomButton
                        className="bg-primary text-white text-xs rounded-none font-semibold"
                        onClick={() => showSuccess("Mfa policy enforced for all users")}
                    >
                        Enforce mfa policy
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Description */}
                <p className="text-xs text-gray-600">
                    Manage multi-factor authentication enrollment status and security policies for all users.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary text-white rounded-none p-5">
                        <p className="text-xs">Total enrolled</p>
                        <p className="text-xl font-semibold">{totalEnrolled}</p>
                        <p className="text-[10px] opacity-80">Active mfa users</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5">
                        <p className="text-xs text-gray-600">App authenticator</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-zinc-100">42</p>
                        <p className="text-[10px] text-gray-500">Using authenticator apps</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5">
                        <p className="text-xs text-gray-600">Security keys</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-zinc-100">12</p>
                        <p className="text-[10px] text-gray-500">Hardware key enrolled</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-none p-5">
                        <p className="text-xs text-red-600">Not enrolled</p>
                        <p className="text-xl font-semibold text-red-600">3</p>
                        <p className="text-[10px] text-red-400">Requires attention</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search users by name or email..."
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CustomButton variant="outline" className="rounded-none text-xs font-semibold gap-2">
                                <Filter className="w-3.5 h-3.5" />
                                {statusFilter}
                            </CustomButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none">
                            <DropdownMenuItem onClick={() => setStatusFilter("All")}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("Enabled")}>Enabled</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("Disabled")}>Disabled</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                    <th className="p-4 text-xs font-semibold text-gray-600">Name</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Enrollment status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Primary method</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Auth strength</th>
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
                                            <Badge
                                                className={`rounded-none text-xs font-medium border-0 ${
                                                    user.status === "Enabled"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-700"
                                                }`}
                                            >
                                                {user.status === "Enabled" ? (
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {user.method === "Authenticator app" && <Smartphone className="w-3.5 h-3.5 text-blue-500" />}
                                                {user.method === "Sms / text" && <Key className="w-3.5 h-3.5 text-orange-500" />}
                                                {user.method === "None" && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                                                <span className="text-xs text-gray-700 dark:text-zinc-300">{user.method}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                className={`rounded-none text-xs font-medium border-0 ${
                                                    user.strength === "Strong"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-orange-50 text-orange-700"
                                                }`}
                                            >
                                                {user.strength}
                                            </Badge>
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
                                                        onClick={() => showSuccess(`Mfa reset initiated for ${user.name}`)}
                                                    >
                                                        Reset mfa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => showWarning(`Mfa disabled for ${user.name}`)}
                                                    >
                                                        Disable mfa
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
