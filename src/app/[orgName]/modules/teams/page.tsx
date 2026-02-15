"use client"

import { useState } from "react"
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ShieldCheck,
    Globe,
    UserPlus,
    Zap,
    Trash2,
    Edit3,
    ChevronRight,
    Info,
    Network,
    Terminal,
    Lock
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function GroupsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const groups = [
        { id: "1", name: "Executive Leadership", members: 12, type: "Security", description: "All C-suite and executive members", status: "Active" },
        { id: "2", name: "Engineering Team", members: 45, type: "M365", description: "Core product engineering and devops", status: "Active" },
        { id: "3", name: "Finance & Accounts", members: 8, type: "Security", description: "Access to payroll and treasury", status: "Active" },
        { id: "4", name: "Contractors (External)", members: 156, type: "Dynamic", description: "Automatically Includes all guest users", status: "Active" },
        { id: "5", name: "HR Operations", members: 5, type: "Security", description: "Personnel records and recruitment", status: "Active" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Groups & Teams"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Directory", href: "#" },
                    { label: "Groups", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-none h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold">
                            Bulk Import
                        </CustomButton>
                        <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-10 px-6 font-black uppercase text-xs tracking-widest shadow-xl border-0">
                            <Plus className="w-4 h-4 mr-2" /> New Group
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Directory Header HUD */}
                <div className="bg-zinc-950 text-white p-10 rounded-none flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl border-b-8 border-b-blue-600">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Users className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-6 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600 text-white border-0 rounded-none px-3 py-1 font-black tracking-widest text-[10px]">ORGANIZATIONAL DIRECTORY</Badge>
                            <Badge className="bg-zinc-800 text-zinc-400 border-0 rounded-none px-3 py-1 font-black tracking-widest text-[10px]">SC-200 COMPLIANT</Badge>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none text-white uppercase italic">Security & Collaboration Groups</h2>
                        <p className="text-zinc-300 font-medium leading-relaxed text-lg italic opacity-90">
                            Groups are the backbone of identity governance. Use "Security Groups" for permission assignment and "M365 Groups" for collaboration across modules.
                        </p>
                        <div className="flex items-center gap-10 pt-4">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-white italic tracking-tighter">24</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Total Containers</span>
                            </div>
                            <Separator orientation="vertical" className="h-12 bg-zinc-800" />
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-blue-500 italic tracking-tighter">12%</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">Dynamic Growth</span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 relative z-10 w-full md:w-80 space-y-4">
                        <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-none backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-none border border-indigo-500/30">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Policies</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tight italic">48 Automation Rules</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-none backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-none border border-emerald-500/30">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest opacity-80">Posture Check</p>
                                    <p className="text-sm font-black text-emerald-400 uppercase tracking-tight italic">No Orphaned Groups</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-bold"
                            placeholder="Find security groups by name, tag, or attribute..."
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <CustomButton variant="ghost" className="rounded-none h-10 px-4 font-black text-[10px] uppercase tracking-widest text-zinc-500">
                            <Filter className="w-3.5 h-3.5 mr-2" /> All Types
                        </CustomButton>
                        <CustomButton variant="ghost" className="rounded-none h-10 px-4 font-black text-[10px] uppercase tracking-widest text-zinc-500">
                            <Network className="w-3.5 h-3.5 mr-2" /> Membership
                        </CustomButton>
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <Card key={group.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-4 border-t-zinc-900 data-[type=Security]:border-t-indigo-600 data-[type=Dynamic]:border-t-emerald-600" data-type={group.type}>
                            <CardHeader className="flex flex-row items-center justify-between pb-6">
                                <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-700 rounded-none font-black text-xl group-hover:bg-zinc-900 group-hover:text-white group-hover:dark:bg-white group-hover:dark:text-zinc-900 transition-all uppercase">
                                    {group.name.substring(0, 2)}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 rounded-none">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </CustomButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none border-zinc-200 dark:border-zinc-800 shadow-2xl">
                                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</DropdownMenuLabel>
                                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-tight py-3"><Edit3 className="w-4 h-4 mr-2" /> Group Profile</DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-tight py-3"><UserPlus className="w-4 h-4 mr-2" /> Add Identities</DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-tight py-3"><Lock className="w-4 h-4 mr-2" /> Assign Access</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs font-bold uppercase tracking-tight py-3 text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Release Group</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">{group.name}</h3>
                                    <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">{group.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-none border-0 text-[10px] font-black uppercase tracking-widest py-1 px-3 ${group.type === 'Security' ? 'bg-indigo-50 text-indigo-600' :
                                        group.type === 'Dynamic' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                                        }`}>
                                        {group.type}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                        <Users className="w-4 h-4 text-zinc-300" />
                                        {group.members} Identities
                                    </div>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-none border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                <div className="bg-zinc-200 w-full h-full opacity-50"></div>
                                            </div>
                                        ))}
                                        <div className="h-8 w-8 rounded-none border-2 border-white dark:border-zinc-900 bg-zinc-900 text-white text-[10px] flex items-center justify-center font-black">+{group.members - 3}</div>
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-[10px] text-zinc-500 font-black uppercase tracking-widest hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        Manage Members <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create Action Card */}
                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-zinc-50/10">
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black text-zinc-400 uppercase tracking-widest">New Container</h4>
                            <p className="text-xs text-zinc-400 font-medium">Define a new security or collaboration context</p>
                        </div>
                    </div>
                </div>

                {/* System Insights Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div className="p-8 bg-indigo-600 text-white rounded-none flex items-start gap-6 shadow-2xl relative overflow-hidden group">
                        <Terminal className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-4">
                            <h5 className="text-2xl font-black tracking-tighter uppercase italic text-white">Automate Membership</h5>
                            <p className="text-zinc-100 text-sm font-medium leading-relaxed opacity-90 italic">
                                Connect your directory to your HR module to automatically populate teams based on department metadata.
                            </p>
                            <CustomButton className="bg-white text-indigo-600 hover:bg-zinc-100 rounded-none h-12 px-8 font-black uppercase text-[10px] tracking-widest border-0">
                                Configure Sync Engine
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none flex items-start gap-6 relative overflow-hidden group">
                        <Globe className="absolute -bottom-10 -right-10 h-48 w-48 opacity-5 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-4">
                            <h5 className="text-2xl font-black tracking-tighter uppercase italic">External Collaboration</h5>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed opacity-80">
                                Securely share resources with guest users by adding them to designated External Collaboration Groups.
                            </p>
                            <CustomButton variant="outline" className="rounded-none h-12 px-8 font-black uppercase text-[10px] tracking-widest border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950">
                                Review Guest Access
                            </CustomButton>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
