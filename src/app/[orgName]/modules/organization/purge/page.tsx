"use client"

import React, { useState } from "react"
import {
    Trash2,
    AlertTriangle,
    History,
    RotateCcw,
    ShieldAlert,
    Search,
    SearchX,
    Building2,
    Calendar,
    ArrowLeft,
    ChevronRight,
    Lock,
    Clock,
    UserX,
    Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const archivedEntities = [
    { id: "ARC-001", name: "Old Subsidiary LLC", type: "Business Unit", archivedAt: "12 Days ago", autoPurge: "18 Days left", size: "1.2 GB", dangerLevel: "critical" },
    { id: "ARC-002", name: "2023 Marketing Campaign", type: "Data Set", archivedAt: "28 Days ago", autoPurge: "2 Days left", size: "450 MB", dangerLevel: "low" },
    { id: "ARC-003", name: "Legacy HR Records", type: "Identity Archive", archivedAt: "5 Days ago", autoPurge: "25 Days left", size: "2.8 GB", dangerLevel: "medium" },
    { id: "ARC-004", name: "Deprioritized Pipeline", type: "CRM Data", archivedAt: "20 Days ago", autoPurge: "10 Days left", size: "15 MB", dangerLevel: "low" },
]

export default function PurgePage() {
    const [entities, setEntities] = useState(archivedEntities)
    const [searchQuery, setSearchQuery] = useState("")

    const handlePurge = (id: string, name: string) => {
        toast.error(`Permanent deletion initiated for ${name}...`, {
            description: "Compliance records will log this as an irreversible action."
        })
        setEntities(prev => prev.filter(e => e.id !== id))
    }

    const handleRestore = (name: string) => {
        toast.success(`${name} has been restored to active status.`)
    }

    const filteredEntities = entities.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-red-600 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8" />
                        Compliance Purge & Deletion
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Permanently remove archived entities and reclaim storage. This action is IRREVERSIBLE.</p>
                </div>
                <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Audit trail of deletions opened")}>
                    <History className="w-4 h-4" />
                    Deletion History
                </Button>
            </div>

            {/* DANGER BANNER */}
            <div className="p-5 bg-red-50/80 border border-red-100 rounded-2xl flex items-start gap-4 shadow-sm border-l-4 border-l-red-600">
                <div className="h-10 w-10 bg-red-100 flex items-center justify-center rounded-full shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-red-950 uppercase tracking-tighter">Immediate Attention Required</h4>
                    <p className="text-xs text-red-900/80 leading-relaxed font-bold">
                        Purging entities will permanently delete all associated relational data, files, and identity mappings from the production environment and all secondary backups.
                        Only "Export Logs" will remain for compliance history.
                    </p>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-b-4 border-b-red-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Archived Entities</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">{entities.length}</p>
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Awaiting disposal
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-b-4 border-b-amber-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Purge Imminent</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">1</p>
                        <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Expiring in 48 hours
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-b-4 border-b-blue-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Relieved Storage</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-blue-600 text-left">4.5 GB</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Estimated reclaim
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-b-4 border-b-emerald-500">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Regulatory Hold</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-emerald-600 text-left">Enabled</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 text-left uppercase tracking-tighter">
                            Compliance mode active
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search archived resources by name or type..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* PURGE CANDIDATES TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/50">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-900">Archive & Disposal Directory</CardTitle>
                        <CardDescription className="text-xs font-medium">Select entities to permanently purge from the system database.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Entity Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Resource Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Disposal Deadline</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Storage Footprint</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Emergency Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredEntities.length > 0 ? (
                                    filteredEntities.map((ent) => (
                                        <tr key={ent.id} className="hover:bg-red-50/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border font-bold text-xs ${ent.dangerLevel === 'critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            ent.dangerLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                        {ent.type === 'Business Unit' ? <Building2 className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 leading-none">{ent.name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Archived: {ent.archivedAt}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight">
                                                    {ent.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className={`w-3.5 h-3.5 ${ent.autoPurge.includes('Days') && parseInt(ent.autoPurge) < 5 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                                                    <span className={`text-xs font-black ${ent.autoPurge.includes('Days') && parseInt(ent.autoPurge) < 5 ? 'text-red-600' : 'text-slate-700'}`}>
                                                        {ent.autoPurge}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-600">{ent.size}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-tight border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 gap-1 px-3" onClick={() => handleRestore(ent.name)}>
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Restore
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-tight border-red-100 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all gap-1 px-3" onClick={() => handlePurge(ent.id, ent.name)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Purge
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="p-4 bg-slate-50 rounded-full">
                                                    <SearchX className="w-10 h-10 text-slate-200" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">No objects found in archive</h3>
                                                    <p className="text-xs text-slate-500 max-w-xs">Double check the resource name or filter by a different data type.</p>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Clear Search</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-3 flex justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Lock className="w-3 h-3" /> All operations are cryptographically signed & logged
                    </p>
                </CardFooter>
            </Card>

            {/* SECURITY WARNING */}
            <div className="flex items-start gap-4 p-5 bg-zinc-900 text-white rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                    <Trash2 className="w-32 h-32" />
                </div>
                <ShieldAlert className="w-10 h-10 text-red-500 shrink-0 mt-1 animate-pulse" />
                <div className="space-y-1 relative z-10">
                    <h4 className="text-base font-black uppercase tracking-tighter">Production Safety Lock Active</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-bold max-w-2xl">
                        A "Two-Key" authentication procedure is required for single entities larger than 10GB or bulk deletions exceeding 50 items.
                        Compliance officers will be notified immediately upon any purge request initiation.
                    </p>
                    <div className="pt-2">
                        <Button variant="link" className="text-red-500 p-0 h-auto text-[10px] font-black uppercase tracking-widest hover:text-red-400 gap-1">
                            Review Deletion Retention Policy <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
