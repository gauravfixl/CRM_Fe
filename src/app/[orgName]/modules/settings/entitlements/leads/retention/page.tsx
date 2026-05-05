"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Clock,
    Plus,
    MoreVertical,
    Search,
    Filter,
    Archive,
    Trash2,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    History,
    Calendar,
    Database,
    AlertTriangle,
    FileSearch,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useEffect } from "react"
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks"

export default function LeadDataRetentionPage() {
    const params = useParams()
    const [retentionMonths, setRetentionMonths] = useState([24])
    const [isLoading, setIsLoading] = useState(false)
    const [recordsAtRisk, setRecordsAtRisk] = useState(124)

    const [policies, setPolicies] = useState({
        autoPurge: false,
        archiveBeforePurge: true,
        gdprHook: true
    })

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s: any = res?.data?.settings || res?.data?.data || res?.data || {}
                const days = s?.organizationPolicies?.retentionDays
                if (typeof days === "number" && days > 0) {
                    setRetentionMonths([Math.max(1, Math.round(days / 30))])
                }
            } catch {
                // Silent fallback
            }
        })()
    }, [])

    const handleAction = async (msg: string) => {
        setIsLoading(true)
        try {
            const days = Math.min(3650, Math.max(1, Math.round(retentionMonths[0] * 30)))
            await updateOrgAdminSettings({
                organizationPolicies: { retentionDays: days },
            })
            toast.success(msg)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to save retention policy")
        } finally {
            setIsLoading(false)
        }
    }

    const handleScan = () => {
        setIsLoading(true)
        setTimeout(() => {
            // Mock dynamic calculation based on slider
            const newVal = Math.floor(Math.random() * 500) + (60 - retentionMonths[0]) * 10
            setRecordsAtRisk(newVal)
            setIsLoading(false)
            toast.success("Impact scan complete: Found data for purge")
        }, 1500)
    }

    const impactData = [
        { id: "1", stage: "Lost Leads", count: 1240 - (retentionMonths[0] * 10), action: "Auto-Archive", status: "Pending" },
        { id: "2", stage: "Unqualified Leads", count: 842 - (retentionMonths[0] * 5), action: "Auto-Delete", status: "Active" },
        { id: "3", stage: "Contacted (Inactive > 1yr)", count: 312, action: "Auto-Archive", status: "Active" },
        { id: "4", stage: "Won Leads", count: 2847, action: "Exempt (Stay Forever)", status: "System" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-semibold text-gray-900">Lead Retention Policy</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-medium">Compliance</Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Define data lifecycle rules for archiving and permanent deletion of lead records.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleScan}
                        disabled={isLoading}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        <FileSearch className={`w-4 h-4 mr-2 ${isLoading ? 'animate-bounce' : ''}`} />
                        Scan Impact
                    </Button>
                    <Button
                        onClick={() => handleAction("Retention policy updated for Org")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Save & Apply
                    </Button>
                </div>
            </div>

            {/* Retention Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-white text-xs opacity-80">Storage Cap</p>
                            <p className="text-white text-xl font-semibold">{retentionMonths} Months</p>
                            <p className="text-[10px] text-white opacity-80">Global retention window</p>
                        </div>
                        <Database className="w-4 h-4 text-white" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Records at Risk</p>
                            <p className="text-xl font-semibold text-gray-900">{recordsAtRisk} Items</p>
                            <p className="text-[10px] text-gray-500">Pending purge cycle</p>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Archived Data</p>
                            <p className="text-xl font-semibold text-gray-900">1.2 GB</p>
                            <p className="text-[10px] text-gray-500">Cold storage utilized</p>
                        </div>
                        <Archive className="w-4 h-4 text-blue-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Compliance Score</p>
                            <p className="text-xl font-semibold text-emerald-600">GDPR Ready</p>
                            <p className="text-[10px] text-gray-500">Data lifecycle active</p>
                        </div>
                        <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Configuration Sections */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                        <div>
                            <h3 className="text-base font-medium text-gray-900">Global Retention Window</h3>
                            <p className="text-[11px] text-gray-500 font-medium mt-1">Adjust how long lead data persists after the last activity.</p>
                        </div>
                        <Badge className="bg-blue-600 text-white border-none font-semibold text-xs px-4 py-1">{retentionMonths} Months</Badge>
                    </div>

                    <div className="py-12 px-4">
                        <Slider
                            defaultValue={retentionMonths}
                            max={60}
                            min={6}
                            step={6}
                            onValueChange={setRetentionMonths}
                            className="w-full cursor-pointer"
                        />
                        <div className="flex justify-between mt-6 px-1">
                            <span className="text-[10px] font-medium text-gray-400">Min: 6 Months</span>
                            <span className="text-[10px] font-medium text-gray-400">Max: 5 Years</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-zinc-50/50 border border-dashed border-zinc-100 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <History className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-medium text-gray-600">Retention Impact Analysis</span>
                        </div>
                        <Table>
                            <TableHeader className="bg-transparent">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-[11px] font-medium text-gray-500">Leads Classification</TableHead>
                                    <TableHead className="text-[11px] font-medium text-gray-500 text-center">Record Count</TableHead>
                                    <TableHead className="text-[11px] font-medium text-gray-500">Planned Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {impactData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-transparent border-none">
                                        <TableCell className="py-2">
                                            <span className="text-[11px] font-medium text-gray-700">{item.stage}</span>
                                        </TableCell>
                                        <TableCell className="py-2 text-center">
                                            <span className="text-[11px] font-semibold text-gray-900">{item.count.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Badge variant="outline" className={`text-[8px] font-medium border-none px-2 h-5 rounded-full ${item.status === 'System' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                                {item.action}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-base font-medium text-gray-900 mb-6 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Auto-Cleanup Policy
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-900 transition-colors group-hover:text-blue-600">Enable Auto-Purge</span>
                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">Permanently delete data after archive window.</span>
                                </div>
                                <Switch
                                    checked={policies.autoPurge}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, autoPurge: v }))}
                                    className="data-[state=checked]:bg-rose-600 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-900 transition-colors group-hover:text-blue-600">Archive Before Purge</span>
                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">Move to cold storage for 6 months first.</span>
                                </div>
                                <Switch
                                    checked={policies.archiveBeforePurge}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, archiveBeforePurge: v }))}
                                    className="data-[state=checked]:bg-blue-600 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-900 transition-colors group-hover:text-blue-600">GDPR Deletion Hook</span>
                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">Trigger purge on user deletion request.</span>
                                </div>
                                <Switch
                                    checked={policies.gdprHook}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, gdprHook: v }))}
                                    className="data-[state=checked]:bg-blue-600 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-600 rounded-xl p-8 text-white shadow-xl shadow-rose-200 border-t border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-white/60" />
                            <h4 className="text-xs font-medium text-white">Compliance Lock</h4>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed opacity-90 mb-6">
                            Legal and regulatory 'Won' leads are automatically exempt from retention cycles and stored indefinitely for audit purposes.
                        </p>
                        <div className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl">
                            <span className="text-[10px] font-medium text-white">Won Lead Exemption</span>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
