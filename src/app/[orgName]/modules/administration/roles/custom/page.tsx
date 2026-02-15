"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Shield,
    Plus,
    Search,
    Edit,
    Trash2,
    Zap,
    ChevronRight,
    MoreVertical,
    Settings2,
    Lock,
    ExternalLink,
    History,
    AlertTriangle,
    RefreshCw
} from "lucide-react"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import useRolesStore from "@/lib/roleStore"
import { deleteRole, getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import { Separator } from "@/components/ui/separator"

export default function CustomRolesPage() {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [orgName, setOrgName] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const orgRoles = useRolesStore(state => state.roles?.organization) || []
    const customRoles = useMemo(() => orgRoles.filter((r: any) => r.isCustom), [orgRoles])

    useEffect(() => {
        const org = params.orgName as string || localStorage.getItem("orgName") || ""
        setOrgName(org)
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const scopeParams = { scope: "sc-org" as const }
            const res = await getAllRolesNPermissions(scopeParams)

            if (res?.data?.permissions && res?.data?.iv) {
                const decrypted = decryptData(res.data.permissions, res.data.iv)
                useRolesStore.getState().setRoles(prev => ({
                    ...prev,
                    organization: decrypted
                }))
            }
        } catch (error) {
            console.error("Error fetching roles:", error)
            toast.error("Failed to load custom extensions")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (roleId: string) => {
        try {
            await deleteRole(roleId)
            useRolesStore.getState().setRoles(prev => ({
                ...prev,
                organization: (prev.organization || []).filter((r: any) => r._id !== roleId)
            }))
            toast.success("Custom identity extension removed")
        } catch (error) {
            toast.error("Failed to release role")
        }
    }

    const filteredCustomRoles = customRoles.filter(
        (role: any) =>
            (role.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (isLoading && orgRoles.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Syncing Custom Extensions...</span>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Custom Roles"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Access Management", href: "#" },
                    { label: "Custom Roles", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            onClick={fetchData}
                            variant="outline"
                            className="rounded-none h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Sync Directory
                        </CustomButton>
                        <Link href={`/${orgName}/modules/administration/roles/create`}>
                            <CustomButton className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-6 font-bold shadow-xl border-0 uppercase text-[10px] tracking-widest">
                                <Plus className="w-4 h-4 mr-2" /> Define Custom Role
                            </CustomButton>
                        </Link>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Custom Extensions HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-zinc-900 rounded-none p-10 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2">
                        <div className="relative z-10 space-y-6">
                            <Badge className="bg-emerald-500 text-white rounded-none border-0 text-[10px] font-black px-2 tracking-widest">CUSTOM DIRECTORY</Badge>
                            <h4 className="text-4xl font-black tracking-tighter italic uppercase text-white">Identity Extensions</h4>
                            <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-sm italic opacity-90">
                                Extend your organization's security baseline by defining granular roles for specific departmental needs.
                            </p>
                            <div className="flex items-center gap-10 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black italic text-white uppercase">{customRoles.length}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Roles</span>
                                </div>
                                <div className="h-10 w-px bg-zinc-800"></div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black italic text-emerald-500">PRO</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Directory Tier</span>
                                </div>
                            </div>
                        </div>
                        <Zap className="absolute -bottom-10 -right-10 h-64 w-64 text-emerald-500 opacity-5 group-hover:scale-110 transition-transform" />
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm flex flex-col justify-center p-8 space-y-4 border-b-4 border-b-indigo-500">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center rounded-none">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Compliance Check</span>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Verified</div>
                        </div>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm flex flex-col justify-center p-8 space-y-4 border-b-4 border-b-blue-500">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center rounded-none">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Security Depth</span>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter italic">GRANULAR</div>
                        </div>
                    </Card>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find custom identity extensions by name, tag, or attribute..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-bold italic"
                        />
                    </div>
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    <CustomButton variant="ghost" className="rounded-none h-10 px-4 font-black text-[10px] uppercase tracking-widest text-zinc-500">
                        <Settings2 className="w-4 h-4 mr-2" /> Policy Filters
                    </CustomButton>
                </div>

                {/* Roles List */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">Connected Extensions</h4>
                        <Badge className="bg-zinc-900 text-white rounded-none border-0 text-[10px] font-black px-4 py-1">READ-WRITE</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                                    <TableHead className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Extension Identity</TableHead>
                                    <TableHead className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Permissions Scope</TableHead>
                                    <TableHead className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">System Status</TableHead>
                                    <TableHead className="p-6 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredCustomRoles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="p-32 text-center space-y-6">
                                            <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center rounded-none mx-auto opacity-30 border-4 border-dashed border-zinc-200">
                                                <AlertTriangle className="w-10 h-10" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xl font-black text-zinc-400 uppercase tracking-widest italic">Identity void detected</p>
                                                <p className="text-xs text-zinc-400 font-medium italic">No custom extensions are currently mapped to this organization.</p>
                                            </div>
                                            <Link href={`/${orgName}/modules/administration/roles/create`}>
                                                <CustomButton className="bg-zinc-900 text-white rounded-none h-12 px-10 font-black uppercase text-[10px] tracking-widest shadow-xl">
                                                    Initialize Custom Extension
                                                </CustomButton>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomRoles.map((role: any) => (
                                        <TableRow key={role._id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all group">
                                            <TableCell className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center rounded-none border border-emerald-100 dark:border-emerald-800 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                        {role.name ? role.name.charAt(0).toUpperCase() : 'C'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">{role.name}</span>
                                                        <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold">DIRECTORY_ID: {role._id ? role._id.slice(-8).toUpperCase() : 'UNKNOWN'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-3">
                                                        {(role.permissions || []).slice(0, 3).map((p: any, idx: number) => (
                                                            <div key={idx} className="h-10 w-10 bg-zinc-900 text-white border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-black uppercase shadow-lg">
                                                                {p.module ? p.module.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                        ))}
                                                        {(role.permissions || []).length > 3 && (
                                                            <div className="h-10 w-10 bg-emerald-500 text-white border-2 border-white flex items-center justify-center text-[10px] font-black shadow-lg">
                                                                +{(role.permissions || []).length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{(role.permissions || []).length} MODULES</span>
                                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">ACTIVE SCOPE</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <div className="flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 px-3 py-1 bg-zinc-50/50 dark:bg-zinc-900/50 w-fit">
                                                    <div className="h-1.5 w-1.5 rounded-none bg-emerald-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 italic">Live in Directory</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                    <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                                                        <CustomButton variant="ghost" size="icon" className="h-11 w-11 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-none border border-transparent hover:border-zinc-200">
                                                            <Edit className="w-5 h-5" />
                                                        </CustomButton>
                                                    </Link>
                                                    <CustomButton
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(role._id)}
                                                        className="h-11 w-11 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-none border border-transparent hover:border-red-100"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </CustomButton>
                                                    <CustomButton variant="ghost" size="icon" className="h-11 w-11 text-zinc-400 hover:text-zinc-600 rounded-none">
                                                        <ExternalLink className="w-5 h-5" />
                                                    </CustomButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Documentation Banner */}
                <div className="p-10 bg-zinc-950 text-white rounded-none flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
                    <Shield className="absolute -bottom-10 -left-10 h-64 w-64 opacity-5 pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-none shadow-inner group">
                            <Shield className="h-10 w-10 text-indigo-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-center md:text-left">
                            <h5 className="text-3xl font-black tracking-tighter uppercase italic text-white">Directory Hardening</h5>
                            <p className="text-zinc-300 text-sm font-medium mt-1 max-w-lg italic opacity-90 leading-relaxed">
                                Custom roles are audited every 24 hours. Ensure you are following the <span className="text-white underline decoration-emerald-500/50">principle of least privilege</span> when defining new identity extensions.
                            </p>
                        </div>
                    </div>
                    <CustomButton variant="outline" className="relative z-10 rounded-none border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[10px] uppercase tracking-widest h-14 px-12 italic border-2">
                        Read Security Protocol
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}
