"use client"

import React, { useState } from "react"
import {
    Monitor,
    Smartphone,
    Tablet,
    Search,
    Filter,
    Info,
    CheckCircle2,
    XCircle,
    ShieldAlert,
    MapPin,
    Clock,
    Globe,
    MoreVertical,
    LogOut,
    ShieldCheck,
    SearchX,
    User,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const loginEvents = [
    { id: "LGN-001", user: "Sarah Jenkins", email: "sarah@fixl.io", device: "Desktop", browser: "Chrome 122", ip: "192.168.1.1", location: "New York, US", status: "Success", time: "2 mins ago", mfa: "Verified" },
    { id: "LGN-002", user: "Michael Chen", email: "m.chen@tech.io", device: "Mobile", browser: "Safari iOS", ip: "172.56.23.102", location: "San Francisco, US", status: "MFA Failed", time: "15 mins ago", mfa: "Attempted" },
    { id: "LGN-003", user: "Unknown Identity", email: "admin@global.io", device: "Desktop", browser: "Firefox (Linux)", ip: "45.12.98.24", location: "Moscow, RU", status: "Failed", time: "1 hour ago", mfa: "Blocked" },
    { id: "LGN-004", user: "Alex Rivera", email: "alex.r@hrm.io", device: "Tablet", browser: "Edge 121", ip: "192.168.1.45", location: "London, UK", status: "Success", time: "3 hours ago", mfa: "Verified" },
    { id: "LGN-005", user: "Sarah Jenkins", email: "sarah@fixl.io", device: "Mobile", browser: "Chrome Mobile", ip: "192.168.1.1", location: "New York, US", status: "Success", time: "Yesterday", mfa: "Verified" },
]

export default function LoginActivityPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredEvents = loginEvents.filter(ev =>
        ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Login Activity & Sessions</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitor authentication events and manage active security sessions.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Refreshing session data...")}>
                        <Clock className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Button className="h-9 bg-red-600 hover:bg-red-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest shadow-sm px-6" onClick={() => toast.error("Global session termination initiated")}>
                        <LogOut className="w-4 h-4" />
                        Revoke All Sessions
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Successful Logins</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-slate-900">1,482</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Past 24 hours
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Failed Attempts</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-red-600">14</p>
                        <p className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-1">
                            <ShieldAlert className="w-3 h-3" /> 2 IPs blocked
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-blue-600">42</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            Across all platforms
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MFA Adoption</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-indigo-600">100%</p>
                        <p className="text-[10px] text-indigo-400 font-bold flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3" /> Fully Enforced
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by user, email, IP or location..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                </Button>
            </div>

            {/* ACTIVITY STREAM */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-black text-slate-900">Authentication Event Log</CardTitle>
                        <CardDescription className="text-xs font-medium">Real-time chronicle of identity verification attempts.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((ev) => (
                                <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-colors ${ev.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                ev.status === 'Failed' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {ev.device === 'Desktop' ? <Monitor className="w-5 h-5" /> :
                                                ev.device === 'Mobile' ? <Smartphone className="w-5 h-5" /> :
                                                    <Tablet className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black text-slate-900">{ev.user === 'Unknown Identity' ? ev.email : ev.user}</p>
                                                <Badge className={`text-[9px] font-black uppercase tracking-tight rounded-full ${ev.status === 'Success' ? 'bg-emerald-100/50 text-emerald-700 border-none' :
                                                        ev.status === 'Failed' ? 'bg-red-100/50 text-red-700 border-none' :
                                                            'bg-amber-100/50 text-amber-700 border-none'
                                                    }`}>
                                                    {ev.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1 font-mono">{ev.ip}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="font-bold text-slate-400 uppercase tracking-tighter">{ev.browser}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-xs font-black text-slate-900 flex items-center gap-1">
                                                <ShieldCheck className={`w-3.5 h-3.5 ${ev.mfa === 'Verified' ? 'text-blue-500' : 'text-slate-300'}`} />
                                                {ev.mfa === 'Verified' ? 'MFA Confirmed' : 'No MFA'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{ev.time}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 rounded-xl p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Security Action</DropdownMenuLabel>
                                                <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer py-2 focus:bg-blue-50 text-xs font-bold" onClick={() => toast.info(`Viewing trace logs for ${ev.id}`)}>
                                                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                                    View Trace Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer py-2 focus:bg-red-50 text-red-600 text-xs font-black uppercase" onClick={() => toast.error(`Session for ${ev.user} has been revoked`)}>
                                                    <LogOut className="w-4 h-4" />
                                                    Revoke Session
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <SearchX className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">No events match your criteria</h3>
                                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Reset Search</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-center">
                    <Button variant="ghost" className="text-xs font-black uppercase text-blue-600 gap-2 h-9">
                        Download Comprehensive Audit CSV <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
