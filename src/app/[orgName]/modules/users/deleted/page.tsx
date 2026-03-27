"use client"

import { useState } from "react"
import {
    Trash2,
    RefreshCcw,
    Search,
    AlertTriangle,
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
import { showSuccess, showWarning } from "@/utils/toast"

interface DeletedUser {
    id: string
    name: string
    email: string
    deletedBy: string
    deletedAt: string
    daysLeft: number
}

export default function DeletedUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [restoreTarget, setRestoreTarget] = useState<DeletedUser | null>(null)
    const [purgeTarget, setPurgeTarget] = useState<DeletedUser | null>(null)

    const [deletedUsers, setDeletedUsers] = useState<DeletedUser[]>([
        { id: "d1", name: "Alice Thompson", email: "alice.t@oldfirm.com", deletedBy: "Admin", deletedAt: "2026-03-25", daysLeft: 28 },
        { id: "d2", name: "Kevin Varkey", email: "k.varkey@external.com", deletedBy: "Auto-policy", deletedAt: "2026-03-22", daysLeft: 25 },
    ])

    const filtered = deletedUsers.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRestore = () => {
        if (!restoreTarget) return
        setDeletedUsers((prev) => prev.filter((u) => u.id !== restoreTarget.id))
        showSuccess(`${restoreTarget.name} has been restored successfully`)
        setRestoreTarget(null)
    }

    const handlePurge = () => {
        if (!purgeTarget) return
        setDeletedUsers((prev) => prev.filter((u) => u.id !== purgeTarget.id))
        showWarning(`${purgeTarget.name} has been permanently purged`)
        setPurgeTarget(null)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Deleted Users"
                breadcrumbItems={[
                    { label: "Users", href: "#" },
                    { label: "Deleted", href: "#" },
                ]}
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Deleted users</h1>
                        <p className="text-xs text-gray-600 mt-1">Review and manage users in the recycle bin before permanent removal</p>
                    </div>
                    <CustomButton
                        variant="outline"
                        size="sm"
                        className="rounded-none text-xs"
                        onClick={() => showSuccess("Retention policy configuration opened")}
                    >
                        Configure retention
                    </CustomButton>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">In recycle bin</p>
                        <p className="text-xl font-semibold text-primary mt-1">{deletedUsers.length}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Soft-deleted accounts</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Retention policy</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">30 days</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Before auto-purge</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Auto-purge</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">Enabled</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Automatic cleanup active</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Search deleted users..."
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Deleted by</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Deleted date</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Days remaining</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center">
                                            <Trash2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Recycle bin is empty</p>
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
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600">{user.deletedBy}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600">{user.deletedAt}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className="bg-blue-50 text-blue-600 border border-blue-200 rounded-none text-[10px] font-medium">
                                                    {user.daysLeft} days
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <CustomButton
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-none text-xs"
                                                        onClick={() => setRestoreTarget(user)}
                                                    >
                                                        <RefreshCcw className="w-3 h-3 mr-1" />
                                                        Restore
                                                    </CustomButton>
                                                    <CustomButton
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-none text-xs"
                                                        onClick={() => setPurgeTarget(user)}
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" />
                                                        Purge
                                                    </CustomButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Restore confirmation dialog */}
            <CustomDialog open={!!restoreTarget} onOpenChange={(open) => !open && setRestoreTarget(null)}>
                <CustomDialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-5 py-4">
                        <CustomDialogTitle className="text-white text-sm font-semibold">Confirm restore</CustomDialogTitle>
                    </div>
                    <div className="px-5 py-4">
                        <CustomDialogDescription className="text-sm text-gray-600">
                            Are you sure you want to restore <span className="font-semibold text-gray-900">{restoreTarget?.name}</span>? They will be moved back to active users with their previous permissions.
                        </CustomDialogDescription>
                    </div>
                    <CustomDialogFooter className="px-5 pb-4">
                        <CustomButton variant="outline" size="sm" className="rounded-none" onClick={() => setRestoreTarget(null)}>
                            Cancel
                        </CustomButton>
                        <CustomButton size="sm" className="rounded-none bg-primary text-white" onClick={handleRestore}>
                            Restore user
                        </CustomButton>
                    </CustomDialogFooter>
                </CustomDialogContent>
            </CustomDialog>

            {/* Purge confirmation dialog */}
            <CustomDialog open={!!purgeTarget} onOpenChange={(open) => !open && setPurgeTarget(null)}>
                <CustomDialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-5 py-4">
                        <CustomDialogTitle className="text-white text-sm font-semibold">Confirm permanent deletion</CustomDialogTitle>
                    </div>
                    <div className="px-5 py-4">
                        <CustomDialogDescription className="text-sm text-gray-600">
                            <span className="flex items-center gap-2 text-amber-600 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                This action cannot be undone
                            </span>
                            Permanently purge <span className="font-semibold text-gray-900">{purgeTarget?.name}</span>? All associated data, files, and activity history will be removed.
                        </CustomDialogDescription>
                    </div>
                    <CustomDialogFooter className="px-5 pb-4">
                        <CustomButton variant="outline" size="sm" className="rounded-none" onClick={() => setPurgeTarget(null)}>
                            Cancel
                        </CustomButton>
                        <CustomButton variant="destructive" size="sm" className="rounded-none" onClick={handlePurge}>
                            Purge permanently
                        </CustomButton>
                    </CustomDialogFooter>
                </CustomDialogContent>
            </CustomDialog>
        </div>
    )
}
