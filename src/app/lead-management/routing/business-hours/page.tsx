"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Calendar,
    Clock,
    Globe,
    Plus,
    Settings2,
    ChevronLeft,
    CheckCircle2,
    Save,
    Trash2,
    MapPin,
    AlertCircle,
    Info,
    Coffee,
    Moon,
    Sun,
    Zap
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data: Regions ---
const WORKING_SCHEMES = [
    {
        id: "1",
        name: "US East (Headquarters)",
        timezone: "EST (UTC-5)",
        hours: "09:00 - 18:00",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        active: true,
        region: "North America"
    },
    {
        id: "2",
        name: "EMEA Region",
        timezone: "GMT (UTC+0)",
        hours: "08:30 - 17:30",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        active: true,
        region: "Europe / ME"
    },
    {
        id: "3",
        name: "APAC Hub",
        timezone: "SGT (UTC+8)",
        hours: "09:00 - 18:00",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        active: false,
        region: "Asia Pacific"
    },
]

export default function BusinessHoursPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [schemes, setSchemes] = useState(WORKING_SCHEMES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newScheme, setNewScheme] = useState({ name: "", timezone: "EST (UTC-5)", region: "North America", hours: "09:00 - 17:00" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const toggleSchemeStatus = (id: string) => {
        setSchemes(schemes.map(s => s.id === id ? { ...s, active: !s.active } : s))
        toast({ title: "Scheme Updated", description: "Operational status has been dynamically adjusted." })
    }

    const handleDelete = (id: string) => {
        setSchemes(schemes.filter(s => s.id !== id))
        toast({ title: "Region Removed", description: "Business hour scheme successfully deleted." })
    }

    const handleAddScheme = () => {
        if (!newScheme.name) {
            toast({ title: "Missing Details", description: "A region name must be specified.", variant: "destructive" })
            return
        }
        setSchemes([...schemes, {
            ...newScheme,
            id: Math.random().toString(36).substr(2, 9),
            active: true,
            days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
        }])
        toast({ title: "Region Created", description: "New global hours scheme defined." })
        setIsAddOpen(false)
        setNewScheme({ name: "", timezone: "EST (UTC-5)", region: "North America", hours: "09:00 - 17:00" })
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Calendar Synced",
                description: "SLA calculation logic updated for all global regions.",
            })
        }, 1200)
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Working Hours & Calendars
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Ensure SLA accuracy by defining when teams are active. Leads received outside these hours will have their SLA timer paused.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ title: "Holiday Database", description: "Loading regional exclusion dates." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" /> Holidays
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Schedules</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Working Schemes List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Global Working Schemes</h2>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="h-8 text-indigo-600 hover:bg-white border-transparent hover:border-slate-100 border shadow-sm font-semibold text-[11px] uppercase tracking-widest flex items-center gap-2">
                                    <Plus size={14} /> Add Region
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-3xl p-6">
                                <DialogHeader>
                                    <DialogTitle>Define New Scheme</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Scheme Name</Label>
                                        <Input value={newScheme.name} onChange={e => setNewScheme({ ...newScheme, name: e.target.value })} placeholder="e.g., US West Coast" className="h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Region</Label>
                                        <Select value={newScheme.region} onValueChange={v => setNewScheme({ ...newScheme, region: v })}>
                                            <SelectTrigger className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="North America">North America</SelectItem>
                                                <SelectItem value="Europe / ME">Europe / ME</SelectItem>
                                                <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                                                <SelectItem value="South America">South America</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Timezone</Label>
                                        <Select value={newScheme.timezone} onValueChange={v => setNewScheme({ ...newScheme, timezone: v })}>
                                            <SelectTrigger className="h-11 rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="EST (UTC-5)">EST (UTC-5)</SelectItem>
                                                <SelectItem value="PST (UTC-8)">PST (UTC-8)</SelectItem>
                                                <SelectItem value="GMT (UTC+0)">GMT (UTC+0)</SelectItem>
                                                <SelectItem value="SGT (UTC+8)">SGT (UTC+8)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddScheme}>Initialize Calendar</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {schemes.map((scheme) => (
                            <Card key={scheme.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden transition-all hover:ring-amber-200 group">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                                    <Globe size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h4 className="text-[17px] font-semibold text-slate-900 tracking-tight">{scheme.name}</h4>
                                                    <p className="text-[12px] font-semibold text-slate-400 flex items-center gap-1.5"><MapPin size={12} /> {scheme.region}</p>
                                                </div>
                                                <Badge className={`border-none font-semibold text-[8px] h-4.5 px-1.5 uppercase tracking-widest ${scheme.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {scheme.active ? 'Operational' : 'Paused / Off-Season'}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {scheme.days.map((day, d) => (
                                                    <Badge key={d} variant="outline" className="h-7 border-slate-100 font-semibold text-[11px] px-3 bg-slate-50 text-slate-600">{day}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="space-y-2 text-right">
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Active Hours</span>
                                                <div className="flex items-center gap-3 justify-end">
                                                    <Clock size={16} className="text-amber-500" />
                                                    <h3 className="text-[20px] font-semibold text-slate-900 tabular-nums">{scheme.hours}</h3>
                                                </div>
                                                <p className="text-[11px] font-semibold text-slate-400 uppercase">{scheme.timezone}</p>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Switch checked={scheme.active} onCheckedChange={() => toggleSchemeStatus(scheme.id)} className="data-[state=checked]:bg-amber-600" />
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(scheme.id)} className="h-9 w-9 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Global Governance Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6 overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                            <Clock size={200} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold">SLA Pause Logic</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Defines global behaviors for clocks when teams are offline.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50 relative z-10">
                            <div className="space-y-4">
                                {[
                                    { label: "Automatic Clock Pause", desc: "SLA stops immediately at 18:00 local.", active: true, icon: Moon },
                                    { label: "Holiday Exemption", desc: "Pause timer during regional holidays.", active: true, icon: Sun },
                                    { label: "Break-time Grace", desc: "Allow 60m daily for team lunch.", active: false, icon: Coffee },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                <p.icon size={14} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-semibold text-slate-700">{p.label}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{p.desc}</p>
                                            </div>
                                        </div>
                                        <Switch checked={p.active} onCheckedChange={() => toast({ title: "Logic Switch", description: "Global engine instructions altered." })} className="data-[state=checked]:bg-indigo-600 scale-75" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-amber-50 text-amber-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-semibold tracking-tight">Shift Planning Hub</h4>
                            <p className="text-[12px] text-amber-600/80 font-medium leading-relaxed">
                                Need 24/7 coverage? Set up rotating shifts to overlap regional coverage areas.
                            </p>
                        </div>
                        <Button onClick={() => toast({ title: "Shift Modules", description: "Launching shift architecture dashboard." })} className="w-full h-10 bg-white shadow-sm border-transparent text-amber-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest relative z-10">
                            Explore Shifts
                        </Button>
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-amber-500">
                            <Sun size={120} />
                        </div>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Platform Insight</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "92% of your leads are currently correctly mapped to Business Hours. 4% lack timezone data."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
