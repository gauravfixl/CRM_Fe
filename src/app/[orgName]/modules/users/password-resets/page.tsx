"use client"

import { useState } from "react"
import {
    Search,
    RefreshCw,
    Clock,
    CheckCircle2,
    MoreVertical,
    Zap,
    Send,
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

export default function PasswordResetQueuePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [requests, setRequests] = useState([
        { id: "pr1", name: "Sofia Garcia", email: "sofia.g@designhub.com", requestedAt: "15 mins ago", urgency: "High", source: "Self-service" },
        { id: "pr2", name: "Ahmed Khan", email: "ahmed.k@ops.inc", requestedAt: "2 hours ago", urgency: "Medium", source: "Admin" },
        { id: "pr3", name: "Emma Watson", email: "e.watson@fixl.com", requestedAt: "Yesterday", urgency: "Low", source: "Periodic" },
    ])

    const filteredRequests = requests.filter(
        (r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleApproveAndReset = (id: string, name: string) => {
        setRequests((prev) => prev.filter((r) => r.id !== id))
        showSuccess(`Password reset approved and sent to ${name}`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Password reset queue"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Password resets", href: "#" },
                ]}
                rightControls={
                    <CustomButton
                        variant="outline"
                        className="rounded-none text-xs font-semibold gap-2"
                        onClick={() => showSuccess("Queue refreshed successfully")}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh queue
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Description */}
                <p className="text-xs text-gray-600">
                    Review and process pending password reset requests across the organization.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-primary text-white rounded-none p-5">
                        <p className="text-xs">Pending actions</p>
                        <p className="text-xl font-semibold">{requests.length}</p>
                        <p className="text-[10px] opacity-80">Awaiting review</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5">
                        <p className="text-xs text-gray-600">Resolved today</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-zinc-100">18</p>
                        <p className="text-[10px] text-gray-500">Completed resets</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5">
                        <p className="text-xs text-gray-600">Self-service usage</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-zinc-100">78%</p>
                        <p className="text-[10px] text-gray-500">Users resetting on their own</p>
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
                        placeholder="Search requests by name or email..."
                    />
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                    <th className="p-4 text-xs font-semibold text-gray-600">Name</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Request source</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Urgency</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600">Requested</th>
                                    <th className="p-4 text-xs font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {filteredRequests.map((r) => (
                                    <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 font-semibold text-xs">
                                                    {r.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{r.name}</p>
                                                    <p className="text-xs text-gray-500">{r.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                className={`rounded-none text-xs font-medium border-0 ${
                                                    r.source === "Self-service"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : r.source === "Admin"
                                                        ? "bg-purple-50 text-purple-700"
                                                        : "bg-zinc-100 text-zinc-600"
                                                }`}
                                            >
                                                {r.source}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                className={`rounded-none text-xs font-medium border-0 ${
                                                    r.urgency === "High"
                                                        ? "bg-red-50 text-red-700"
                                                        : r.urgency === "Medium"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-zinc-100 text-zinc-600"
                                                }`}
                                            >
                                                {r.urgency}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {r.requestedAt}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomButton
                                                    size="sm"
                                                    className="bg-primary text-white rounded-none text-xs font-semibold h-8 px-3"
                                                    onClick={() => handleApproveAndReset(r.id, r.name)}
                                                >
                                                    <Send className="w-3 h-3 mr-1.5" />
                                                    Approve & reset
                                                </CustomButton>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none transition-colors">
                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none">
                                                        <DropdownMenuItem
                                                            onClick={() => showWarning(`Request from ${r.name} rejected`)}
                                                        >
                                                            Reject request
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => showSuccess(`Viewing details for ${r.name}`)}
                                                        >
                                                            View details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
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
