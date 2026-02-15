"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Globe,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Loader2,
    RefreshCw,
    UserCheck,
    Building2,
    ArrowRight,
    ExternalLink,
    ShieldAlert
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { getAllUsers } from "@/modules/crm/users/hooks/userHooks"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function GuestUsersPage() {
    const params = useParams()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchUsers = async (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true)
        else setLoading(true)

        try {
            const res = await getAllUsers()
            if (res?.data?.users) {
                setUsers(res.data.users)
            } else if (res?.data?.data) {
                setUsers(res.data.data)
            }
        } catch (err) {
            console.error("Error fetching users:", err)
            toast.error("Failed to load guest users")
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const guests = useMemo(() => {
        return users.filter(user => {
            const isSearchMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            // Guest detection logic: Role includes 'guest' or email domain is external
            const isGuest = user.role?.toLowerCase().includes('guest') ||
                (user.email && !user.email.includes(params.orgName as string));
            return isSearchMatch && isGuest;
        })
    }, [users, searchQuery, params.orgName])

    const getInitials = (name: string) => {
        if (!name) return "G"
        const parts = name.split(' ')
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        return name[0].toUpperCase()
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Guest Users"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Guests", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => fetchUsers(true)}
                            disabled={isRefreshing}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Update
                        </CustomButton>
                        <CustomButton size="sm" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-white">
                            <Globe className="w-3.5 h-3.5 mr-2" /> Invite External User
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* External Access Insight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">active guests</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{guests.length}</h3>
                            <span className="text-xs font-bold text-zinc-400">identities</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">collab domains</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-blue-600 tracking-tight">
                                {new Set(guests.map(g => g.email?.split('@')[1])).size}
                            </h3>
                            <span className="text-xs font-bold text-zinc-400">external systems</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">security posture</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-2 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[100%]"></div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-600">OPTIMAL</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                            placeholder="Search external collaborators by name or domain..."
                        />
                    </div>
                </div>

                {/* Guests Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Scanning Directory...</p>
                        </div>
                    )}

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">external identity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">home directory</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">access status</th>
                                    <th className="p-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {guests.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Globe className="w-12 h-12 text-zinc-200" />
                                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No guest accounts identified</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    guests.map((user) => (
                                        <tr key={user._id || user.id} className="hover:bg-emerald-50/20 dark:hover:bg-emerald-900/5 transition-all group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-200 transition-all group-hover:scale-105">
                                                        {getInitials(user.name || user.email)}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{user.name || 'Vendor Identity'}</span>
                                                        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span className="text-xs text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-wider">
                                                        {user.email?.split('@')[1] || 'External'}
                                                    </span>
                                                    <ExternalLink className="w-3 h-3 text-zinc-300" />
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-0 text-[10px] font-bold">
                                                    <UserCheck className="w-3 h-3 mr-1.5" /> Collaboration Active
                                                </Badge>
                                            </td>
                                            <td className="p-5 text-right text-zinc-400">
                                                <MoreVertical className="w-5 h-5 cursor-pointer hover:text-zinc-600 transition-colors ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Guest Policy Alert */}
                <div className="p-6 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">B2B Collaboration Policy</h4>
                            <p className="text-xs text-zinc-500">Guest users are automatically restricted to only see their assigned projects and tasks.</p>
                        </div>
                    </div>
                    <CustomButton variant="outline" size="sm" className="rounded-xl font-bold text-xs">Review Terms</CustomButton>
                </div>
            </div>
        </div>
    )
}
