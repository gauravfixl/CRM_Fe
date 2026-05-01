"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { ShieldAlert, Zap, ShieldCheck, Lock, Plus, Search, Info, MoreHorizontal, ChevronRight, Ban, Globe, Clock, UserX, MonitorOff, Terminal, Cpu } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, LayoutGrid, ShieldAlert as ShieldIcon } from "lucide-react"
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks"

export default function LoginRestrictionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [active, setActive] = useState(true)
    const [savingActive, setSavingActive] = useState(false)
    const [isLogsOpen, setIsLogsOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRes, setSelectedRes] = useState<any>(null)

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s = res?.data?.settings || res?.data?.data || res?.data || {}
                const ipR = s?.security?.ipRestrictions
                if (typeof ipR?.enabled === "boolean") setActive(ipR.enabled)
            } catch (err) {
                // Silent fallback
            }
        })()
    }, [])

    const handleActiveChange = async (newVal: boolean) => {
        const prev = active
        setActive(newVal)
        setSavingActive(true)
        try {
            await updateOrgAdminSettings({
                security: { ipRestrictions: { enabled: newVal } },
            })
            toast.success(newVal ? "Smart lockout enabled" : "Smart lockout disabled")
        } catch (err: any) {
            console.error("Failed to update lockout:", err)
            setActive(prev)
            toast.error(err?.response?.data?.message || "Failed to update lockout")
        } finally {
            setSavingActive(false)
        }
    }

    const restrictions = [
        { id: "1", name: "IP range whitelist", type: "Network", status: "Active", icon: Globe, description: "Only allow logins from corporate HQ and trusted VPN ranges.", severity: "Critical" },
        { id: "2", name: "Time-based login", type: "Schedule", status: "Active", icon: Clock, description: "Block authentication for standard users during non-business hours.", severity: "Medium" },
        { id: "3", name: "Unmanaged device block", type: "Hardware", status: "Paused", icon: MonitorOff, description: "Prevent logins from personal laptops or unverified mobile devices.", severity: "High" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Login restrictions"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Login restrictions", href: "/modules/settings/auth/restrictions" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => setIsLogsOpen(true)}>
                            Restriction logs
                        </CustomButton>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-6 font-semibold text-xs tracking-wide shadow-xl border-0" onClick={() => setIsAddOpen(true)}>
                            Add restriction
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-2xl border-0">
                        <Ban className="absolute -bottom-10 -right-10 h-64 w-64 text-white opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Gated Entry</Badge>
                                <Badge className="bg-red-400 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Strict Mode</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Access boundaries</h2>
                            <p className="text-red-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Define where and when users can access your environment. Restrictions provide a defensive perimeter beyond basic credentials.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">4</span>
                                    <span className="text-xs font-semibold text-red-200 tracking-wide mt-1">Active Gates</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">99.9%</span>
                                    <span className="text-xs font-semibold text-red-200 tracking-wide mt-1">Block Accuracy</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center rounded-xl font-bold">
                            <UserX className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Global Lockout</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">Smart lockout</div>
                            </div>
                            <Switch checked={active} onCheckedChange={handleActiveChange} disabled={savingActive} className="data-[state=checked]:bg-red-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center rounded-xl font-bold">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Engine Status</span>
                            <div className="text-xl font-semibold text-emerald-600 leading-none">Operational</div>
                        </div>
                    </SmallCard>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm sticky top-[64px] z-20">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-medium"
                            placeholder="Find login restrictions by IP, time, or factor..."
                        />
                    </div>
                </div>

                {/* Restrictions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restrictions.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase())).map((res) => (
                        <Card key={res.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-2 border-t-zinc-50 dark:border-t-zinc-800 hover:border-t-red-600">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${res.status === 'Active' ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <res.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => { setSelectedRes(res); setIsEditOpen(true); }}>
                                    <MoreHorizontal className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{res.name}</h3>
                                    <p className="text-xs text-zinc-400 font-medium mt-1">{res.type}</p>
                                    <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-2">{res.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide py-1 px-3 ${res.status === 'Active' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {res.status}
                                    </Badge>
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide px-3 py-1 ${res.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                                        res.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {res.severity} priority
                                    </Badge>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <Globe className="h-5 w-5 text-zinc-300" />
                                        <Clock className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold tracking-wide hover:text-red-600 group-hover:translate-x-1 transition-transform" onClick={() => { setSelectedRes(res); setIsEditOpen(true); }}>
                                        Edit Boundary <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-red-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => setIsAddOpen(true)}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-semibold text-zinc-400 tracking-wide">New Boundary</h4>
                            <p className="text-xs text-zinc-400 font-medium">Create a new login gate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Sheets */}

            {/* Restriction Logs Sheet */}
            <Sheet open={isLogsOpen} onOpenChange={setIsLogsOpen}>
                <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic flex items-center gap-2">
                            <History className="w-6 h-6 text-red-600" />
                            Restriction Enforcement Logs
                        </SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">Recent events where access was restricted based on policies.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-4">
                        {[
                            { user: "j.doe@example.com", reason: "IP Range Mismatch", time: "2 min ago", location: "Mumbai, IN", status: "Blocked" },
                            { user: "admin@fixl.solutions", reason: "After Hours Access", time: "45 min ago", location: "San Francisco, US", status: "Blocked" },
                            { user: "m.smith@corp.com", reason: "Unmanaged Device", time: "3 hours ago", location: "London, UK", status: "Challenged" },
                        ].map((log, i) => (
                            <div key={i} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{log.user}</p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                        <span>{log.reason}</span>
                                        <span>•</span>
                                        <span>{log.location}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className="bg-red-50 text-red-600 border-0 mb-1">{log.status}</Badge>
                                    <p className="text-[10px] font-medium text-zinc-400">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            {/* New Boundary Sheet */}
            <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">New Login Gate</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">Establish a new access perimeter.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Boundary Name</Label>
                            <Input placeholder="e.g. Asia-Pacific Offices" className="rounded-xl h-11 border-zinc-200 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gate Type</Label>
                            <Select>
                                <SelectTrigger className="rounded-xl h-11 border-zinc-200 font-bold">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="ip">IP Range / CIDR</SelectItem>
                                    <SelectItem value="time">Time Window</SelectItem>
                                    <SelectItem value="geo">Geographic Region</SelectItem>
                                    <SelectItem value="device">Device Serial/ID</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-4">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <ShieldIcon className="w-3 h-3" /> Security Impact
                            </h4>
                            <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                                Adding an IP-based gate will immediately terminate all active sessions outside the specified ranges.
                            </p>
                            <CustomButton className="w-full bg-white text-zinc-900 hover:bg-zinc-200 rounded-xl font-bold text-xs tracking-widest h-10" onClick={() => { toast.success("Boundary established"); setIsAddOpen(false); }}>DEPLOY GATE</CustomButton>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Boundary Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight">{selectedRes?.name}</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">Adjust the enforcement logic for this perimeter.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6 text-left">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Enforcement Tier</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl border border-zinc-200 bg-white flex flex-col gap-1 cursor-pointer hover:border-red-500 transition-colors">
                                    <span className="text-xs font-bold">Block</span>
                                    <span className="text-[10px] text-zinc-400 italic">Disallow access</span>
                                </div>
                                <div className="p-3 rounded-xl border-2 border-zinc-900 bg-zinc-50 flex flex-col gap-1 cursor-pointer">
                                    <span className="text-xs font-bold">Challenge</span>
                                    <span className="text-[10px] text-zinc-400 italic">Step-up MFA</span>
                                </div>
                            </div>
                        </div>
                        <Separator className="bg-zinc-50 dark:bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Audit Mode Only</Label>
                                <p className="text-[10px] text-zinc-400 italic">Log violations without blocking</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
