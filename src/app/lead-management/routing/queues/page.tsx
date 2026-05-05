"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Plus,
    Users,
    ChevronLeft,
    MoreHorizontal,
    Search,
    Filter,
    ShieldCheck,
    Clock,
    Zap,
    AlertCircle,
    ArrowUpRight,
    ArrowRight,
    Trash2,
    Settings
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"

// --- Mock Data: Queues ---
const QUEUES = [
    {
        id: "1",
        name: "General Inbound Pool",
        type: "Unassigned Holding",
        leadCount: 142,
        avgHoldTime: "42 mins",
        members: ["AM", "JS", "RK", "EW"],
        health: 85,
        status: "Active"
    },
    {
        id: "2",
        name: "Enterprise VIP Queue",
        type: "Priority Tier",
        leadCount: 12,
        avgHoldTime: "8 mins",
        members: ["MC", "SJ", "BW"],
        health: 98,
        status: "High Priority"
    },
    {
        id: "3",
        name: "EMEA Region Hub",
        type: "Geography Pool",
        leadCount: 54,
        avgHoldTime: "1.2 hours",
        members: ["FR", "DE", "IT"],
        health: 62,
        status: "Warning"
    },
    {
        id: "4",
        name: "Nurture Overflow",
        type: "Low Intent Cache",
        leadCount: 850,
        avgHoldTime: "N/A",
        members: ["BOT"],
        health: 100,
        status: "Automated"
    },
]

export default function QueuesPoolsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [queues, setQueues] = useState(QUEUES)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [newItem, setNewItem] = useState({ name: "", type: "Unassigned Holding", status: "Active" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleDelete = (id: string) => {
        setQueues(prev => prev.filter(q => q.id !== id))
        toast({ title: "Queue Removed", description: "The queue has been successfully deleted." })
    }

    const startEdit = (queue: any) => {
        setEditingItem(queue)
        setNewItem({ name: queue.name, type: queue.type, status: queue.status })
        setIsAddOpen(true)
    }

    const handleAddOrUpdate = () => {
        if (!newItem.name) {
            toast({ title: "Incomplete Data", description: "Please provide a name.", variant: "destructive" })
            return
        }
        if (editingItem) {
            setQueues(prev => prev.map(q => q.id === editingItem.id ? { ...q, ...newItem } : q))
            toast({ title: "Queue Updated", description: "Queue settings applied." })
        } else {
            setQueues([...queues, {
                id: Math.random().toString(36).substr(2, 9),
                name: newItem.name,
                type: newItem.type,
                status: newItem.status,
                leadCount: 0,
                avgHoldTime: "N/A",
                members: [],
                health: 100
            }])
            toast({ title: "Queue Created", description: "New queue is now active." })
        }
        setIsAddOpen(false)
        setEditingItem(null)
        setNewItem({ name: "", type: "Unassigned Holding", status: "Active" })
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
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Queues & Shared Pools
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Manage collective holding areas for leads before they are claimed or auto-assigned. Set capacity limits and pickup policies.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Users className="h-4 w-4 mr-2 text-slate-400" /> Manage Team Access
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                                onClick={() => { setEditingItem(null); setNewItem({ name: "", type: "Unassigned Holding", status: "Active" }) }}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Create Queue
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit Queue' : 'Create New Queue'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Queue Name</Label>
                                    <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Enterprise VIP Queue" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Queue Type</Label>
                                    <Select value={newItem.type} onValueChange={v => setNewItem({ ...newItem, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Unassigned Holding">Unassigned Holding</SelectItem>
                                            <SelectItem value="Priority Tier">Priority Tier</SelectItem>
                                            <SelectItem value="Geography Pool">Geography Pool</SelectItem>
                                            <SelectItem value="Low Intent Cache">Low Intent Cache</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Status</Label>
                                    <Select value={newItem.status} onValueChange={v => setNewItem({ ...newItem, status: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="High Priority">High Priority</SelectItem>
                                            <SelectItem value="Warning">Warning</SelectItem>
                                            <SelectItem value="Automated">Automated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddOrUpdate}>
                                {editingItem ? 'Update Queue' : 'Create Queue'}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stats Row */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Total In-Queue</p>
                                <h3 className="text-[32px] font-semibold tracking-tighter text-slate-900 tabular-nums">1,058</h3>
                                <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mt-1">
                                    <ArrowUpRight size={14} /> +12.4% vs last week
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <LayoutGrid size={24} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Avg. Pickup Time</p>
                                <h3 className="text-[32px] font-semibold tracking-tighter text-slate-900 tabular-nums">22.5m</h3>
                                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                                    <ArrowRight size={14} className="rotate-90" /> Needs Improvement (EMEA)
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600">
                                <Clock size={24} />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Pool Saturation</p>
                                <h3 className="text-[32px] font-semibold tracking-tighter text-slate-900 tabular-nums">68%</h3>
                                <Progress value={68} className="h-2 w-32 mt-3 bg-slate-50 [&>div]:bg-emerald-500" />
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Queue Management Cards */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                            Global Queues <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none font-semibold px-2 h-5 text-[10px]">{queues.length}</Badge>
                        </h2>
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Filter className="h-4 w-4 text-slate-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {queues.map((queue) => (
                            <Card key={queue.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white transition-all hover:ring-indigo-100 group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-4 flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[16px] font-semibold text-slate-900 tracking-tight truncate">{queue.name}</h4>
                                                <Badge className={`
                                                    ${queue.status === 'High Priority' ? 'bg-indigo-600 text-white' :
                                                        queue.status === 'Warning' ? 'bg-rose-50 text-rose-600' :
                                                            'bg-slate-50 text-slate-500'} 
                                                    border-none text-[8px] font-semibold px-1.5 h-4.5 rounded uppercase
                                                `}>
                                                    {queue.status}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Leads</span>
                                                    <p className="text-[18px] font-semibold text-slate-900 tabular-nums">{queue.leadCount.toLocaleString()}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Avg Hold</span>
                                                    <p className="text-[16px] font-semibold text-slate-600 tabular-nums">{queue.avgHoldTime}</p>
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Queue Health Index</span>
                                                    <div className="flex items-center gap-3">
                                                        <Progress value={queue.health} className={`h-1.5 flex-1 bg-slate-50 ${queue.health < 70 ? '[&>div]:bg-rose-500' : '[&>div]:bg-emerald-500'}`} />
                                                        <span className={`text-[11px] font-semibold tabular-nums ${queue.health < 70 ? 'text-rose-600' : 'text-emerald-600'}`}>{queue.health}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-10 min-w-[200px]">
                                            <div className="flex items-center -space-x-2">
                                                {queue.members.map((m, i) => (
                                                    <Avatar key={i} className="h-8 w-8 ring-2 ring-white border-none bg-slate-100 text-[10px] font-semibold text-slate-500">
                                                        <AvatarFallback>{m}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {queue.members.length > 0 && <Badge variant="outline" className="h-8 w-8 rounded-full flex items-center justify-center p-0 border-slate-100 bg-white text-[10px] font-semibold text-slate-400">+{queue.members.length * 3}</Badge>}
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => startEdit(queue)} className="h-9 w-9 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900">
                                                    <Settings size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(queue.id)} className="h-9 w-9 bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Queue Policy Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600 w-fit shadow-sm">
                                <Zap size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold">Auto-Pickup Policy</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                    Current mode: **Push Hybrid**. System pushes to reps but allows manual claim from Pool.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <h5 className="text-[12px] font-semibold text-slate-400 tracking-wider">Pickup Rules</h5>
                            <div className="space-y-3">
                                {[
                                    { label: "Max Claim Per Rep", val: "5 leads/hr", active: true },
                                    { label: "Idle Purge", val: "24 hours", active: true },
                                    { label: "Pool Priority Lock", val: "30 mins", active: false },
                                ].map((r, i) => (
                                    <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[12px] font-semibold text-slate-700">{r.label}</span>
                                            <Badge variant="outline" className="border-slate-100 text-[10px] font-semibold text-indigo-600 px-1.5 h-5">{r.val}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-rose-50 text-slate-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-rose-500 group-hover:scale-110 transition-transform">
                            <AlertCircle size={80} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <h4 className="text-[16px] font-semibold tracking-tight text-rose-600">Congestion Alert</h4>
                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                <strong className="font-semibold text-slate-900">EMEA Region Hub</strong> has exceeded capacity (54 leads). SLA breach risk is High.
                            </p>
                        </div>
                        <Button className="w-full h-10 bg-white text-rose-600 border border-rose-100 hover:bg-rose-100/50 font-semibold text-[11px] uppercase tracking-wider relative z-10">
                            Redistribute Leads
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
