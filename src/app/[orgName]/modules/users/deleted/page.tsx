"use client"

import { useState } from "react"
import {
    Trash2,
    RefreshCcw,
    Search,
    Loader2,
    History,
    ShieldAlert,
    ArrowRight,
    Info,
    MoreVertical,
    UserX
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DeletedUsersPage() {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Mocking deleted users for the "Recycle Bin" premium feel
    const deletedUsers = [
        { id: "d1", name: "Alice Thompson", email: "alice.t@oldfirm.com", deletedBy: "Admin", deletedAt: "2 days ago", daysLeft: 28 },
        { id: "d2", name: "Kevin Varkey", email: "k.varkey@external.com", deletedBy: "Auto-Policy", deletedAt: "5 days ago", daysLeft: 25 },
    ]

    const filteredDeleted = deletedUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleRestore = (name: string) => {
        toast.success(`${name} has been restored to active directory`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Deleted Users"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Recycle Bin", href: "#" }
                ]}
                rightControls={
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Cache cleared")}
                        className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    >
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Sync Bin
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Retention Policy Banner */}
                <div className="bg-zinc-900 dark:bg-zinc-100 rounded-3xl p-6 text-white dark:text-zinc-900 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <History className="h-32 w-32" />
                    </div>
                    <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500 text-white border-0 text-[10px] font-black tracking-widest px-2 py-0.5">30 DAY RETENTION</Badge>
                            <Badge className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 border-0 text-[10px] font-black tracking-widest px-2 py-0.5 uppercase">governance policy</Badge>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter">Directory Recycle Bin</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium leading-relaxed">
                            Identity records here are in a "Soft-Deleted" state. You can restore them with full original permissions within 30 days. After this period, they will be permanently purged from the global directory.
                        </p>
                        <div className="pt-2">
                            <CustomButton size="sm" variant="secondary" className="rounded-xl font-bold text-xs h-10 px-6">
                                Configure Retention <ArrowRight className="ml-2 w-4 h-4" />
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Command Bar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                            placeholder="Search through recently purged identities..."
                        />
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Items in bin: {filteredDeleted.length}
                    </div>
                </div>

                {/* Deleted List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
                            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Fetching Purged Data...</p>
                        </div>
                    )}

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">purged identity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">deletion meta</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">auto-purge in</th>
                                    <th className="p-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredDeleted.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Trash2 className="w-12 h-12 text-zinc-200" />
                                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Recycle Bin is empty</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDeleted.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-black text-xs border border-zinc-200 dark:border-zinc-700 opacity-60">
                                                        {user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500 line-through tracking-tight">{user.name}</span>
                                                        <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-600 italic">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Deleted by {user.deletedBy}</span>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-zinc-400 ml-3.5">{user.deletedAt}</p>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-black text-[10px] px-3">
                                                        {user.daysLeft} DAYS REMAINING
                                                    </Badge>
                                                    <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${(user.daysLeft / 30) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <CustomButton
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRestore(user.name)}
                                                        className="h-9 rounded-xl hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest px-4"
                                                    >
                                                        <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Restore
                                                    </CustomButton>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <CustomButton variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-400">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </CustomButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-200 shadow-xl">
                                                            <DropdownMenuItem className="text-red-600 font-bold focus:bg-red-50 cursor-pointer">
                                                                <UserX className="w-4 h-4 mr-2" /> Purge Permanently
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Security Warning */}
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-800 animate-pulse">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p className="text-[11px] font-bold uppercase tracking-wider">
                        Warning: Permanent purging will remove all associated user metadata, files, and activity history from the primary database.
                    </p>
                </div>
            </div>
        </div>
    )
}
