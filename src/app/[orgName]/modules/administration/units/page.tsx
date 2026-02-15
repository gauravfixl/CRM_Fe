"use client"

import { useState } from "react"
import {
    Network,
    Plus,
    Search,
    MoreVertical,
    Users,
    Shield,
    Building,
    ChevronRight,
    Info,
    ShieldAlert
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AdministrativeUnitsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const units = [
        { id: "au1", name: "Engineering Unit", focus: "Technical Infrastructure", members: 42, admins: 3, status: "Active" },
        { id: "au2", name: "FinOps Global", focus: "Financial Operations", members: 12, admins: 2, status: "Active" },
        { id: "au3", name: "Human Capital", focus: "HR & Recruitment", members: 8, admins: 1, status: "Review Required" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Administrative Units"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Governance", href: "#" },
                    { label: "Units", href: "#" }
                ]}
                rightControls={
                    <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-10 px-6 font-bold shadow-xl">
                        <Plus className="w-4 h-4 mr-2" /> Create Admin Unit
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Unit HUD */}
                <div className="bg-zinc-900 text-white p-8 rounded-none flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Network className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <Badge className="bg-blue-600 text-white border-0 rounded-none px-3 py-1 font-black tracking-widest text-[10px]">DELEGATED ADMINISTRATION</Badge>
                        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Scoped Governance</h2>
                        <p className="text-zinc-300 font-medium leading-relaxed italic opacity-90">
                            Administrative Units allow you to subdivide your organization into specific groups for management.
                            Assign "Helpdesk Administrators" for specific departments without giving them global directory access.
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">{units.length}</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Units</span>
                            </div>
                            <Separator orientation="vertical" className="h-10 bg-zinc-800" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white italic">6</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Local Admins</span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 relative z-10 border border-zinc-800 p-8 bg-black/20 backdrop-blur-md rounded-none">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldAlert className="w-8 h-8 text-orange-500" />
                            <span className="text-xs font-bold text-zinc-300">Security Score</span>
                            <span className="text-4xl font-black text-emerald-500 italic uppercase">92%</span>
                        </div>
                    </div>
                </div>

                {/* Command Bar */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search scoped units by name or focus..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent"
                        />
                    </div>
                </div>

                {/* Unit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {units.map((unit) => (
                        <Card key={unit.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-xl transition-all group overflow-hidden border-t-4 border-t-zinc-900">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="h-12 w-12 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center rounded-none border border-zinc-100 dark:border-zinc-700">
                                    <Building className="w-6 h-6 text-zinc-400" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400">
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{unit.name}</h4>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{unit.focus}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-none border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Members</span>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span className="text-xl font-black">{unit.members}</span>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-none border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Admins</span>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-indigo-500" />
                                            <span className="text-xl font-black">{unit.admins}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Badge className={`rounded-none border-0 text-[10px] font-black uppercase tracking-widest ${unit.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {unit.status}
                                    </Badge>
                                    <CustomButton variant="ghost" className="text-[10px] font-black uppercase tracking-tighter group-hover:text-indigo-600">
                                        Manage Unit <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add New Unit Placeholder */}
                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                        <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <Plus className="w-8 h-8 text-zinc-300 group-hover:text-indigo-400" />
                        </div>
                        <div>
                            <h5 className="font-bold text-zinc-400 group-hover:text-zinc-600">Define Scope</h5>
                            <p className="text-xs text-zinc-400">Create a new container for delegated admins</p>
                        </div>
                    </div>
                </div>

                {/* Global Security Insight */}
                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-none flex items-center gap-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Note: Administrative Units do not affect standard user licensing. They are purely for permission scoping.
                    </p>
                </div>
            </div>
        </div>
    )
}
