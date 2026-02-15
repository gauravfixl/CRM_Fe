"use client"

import { useState, useEffect, useMemo } from "react"
import {
    ShieldCheck,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Shield,
    Loader2,
    RefreshCw,
    UserCheck,
    Building2,
    ArrowRight,
    Info,
    Zap
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { getAllUsers } from "@/modules/crm/users/hooks/userHooks"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function AdministratorsPage() {
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
            toast.error("Failed to load administrators")
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const admins = useMemo(() => {
        return users.filter(user => {
            const isSearchMatch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const isAdmin = user.role?.toLowerCase().includes('admin');
            return isSearchMatch && isAdmin;
        })
    }, [users, searchQuery])

    const getInitials = (name: string) => {
        if (!name) return "A"
        const parts = name.split(' ')
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        return name[0].toUpperCase()
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Administrators"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Administrators", href: "#" }
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
                            Sync
                        </CustomButton>
                        <CustomButton size="sm" className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20 text-white">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Assign Admin Role
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Security Warning Card */}
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-2xl p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5 text-orange-600 shadow-sm" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100">Privileged Access Review</h4>
                        <p className="text-xs text-orange-700/80 dark:text-orange-300/70 leading-relaxed">
                            Administrators have elevated permissions to modify organization settings and data.
                            We recommend conducting weekly audits of this list to maintain zero-trust security compliance.
                        </p>
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
                            placeholder="Search through elevated identities..."
                        />
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Active Admins: {admins.length}
                    </div>
                </div>

                {/* Admin List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">

                    {loading && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Validating Privileges...</p>
                        </div>
                    )}

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">identity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">administrative role</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">access status</th>
                                    <th className="p-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {admins.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Shield className="w-12 h-12 text-zinc-200" />
                                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No matching admins found</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    admins.map((user) => (
                                        <tr key={user._id || user.id} className="hover:bg-orange-50/20 dark:hover:bg-orange-900/5 transition-all group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-xs border border-orange-200 transition-all group-hover:scale-105">
                                                        {getInitials(user.name || user.email)}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{user.name || 'Unnamed Admin'}</span>
                                                        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 font-black text-[9px] uppercase tracking-wider">
                                                        {user.role}
                                                    </Badge>
                                                    {user.role?.toLowerCase() === 'super admin' && (
                                                        <div className="bg-red-100 text-red-600 p-1 rounded-md" title="Critical Access">
                                                            <Zap className="w-3 h-3 fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-0 text-[10px] font-bold">
                                                    <UserCheck className="w-3 h-3 mr-1.5" /> Verified
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

                {/* Global Access Config Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Global Roles</h4>
                                <p className="text-xs text-zinc-500">Configure directory-wide administrative hierarchies.</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-500/50 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Access Packages</h4>
                                <p className="text-xs text-zinc-500">Bundle roles for automated departmental provisioning.</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}
