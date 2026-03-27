"use client"

import React, { useState } from 'react'
import {
    Inbox,
    Clock,
    AlertCircle,
    UserPlus,
    MessageSquare,
    Filter,
    Search,
    MoreVertical,
    CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const mockInboxLeads = [
    { id: 1, name: "Rahul Sharma", company: "TechNova Solutions", type: "Unassigned", time: "15m ago", priority: "High", score: 85 },
    { id: 2, name: "Amit Patel", company: "Global Logistics", type: "SLA Breach", time: "4h ago", priority: "Critical", score: 92 },
    { id: 3, name: "Sneha Gupta", company: "Retail Hub", type: "Stale", time: "3 days ago", priority: "Medium", score: 65 },
    { id: 4, name: "Vikram Singh", company: "Infinite Loop Inc", type: "Unassigned", time: "1h ago", priority: "High", score: 78 }
]

export default function LeadInboxPage() {
    const [filter, setFilter] = useState('All')

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Inbox className="h-6 w-6 text-orange-500" />
                    Lead Inbox
                </h1>
                <p className="text-sm text-slate-500">Leads requiring immediate attention and intervention.</p>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2">
                    {['All', 'Unassigned', 'SLA Breaches', 'Stale'].map((item) => (
                        <Button
                            key={item}
                            variant={filter === item ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter(item)}
                            className={filter === item ? "bg-indigo-600 shadow-md" : "text-slate-500"}
                        >
                            {item}
                            <Badge className="ml-2 bg-slate-100 text-slate-600 hover:bg-slate-200" variant="secondary">
                                {item === 'All' ? '12' : item === 'Unassigned' ? '5' : '3'}
                            </Badge>
                        </Button>
                    ))}
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Find a lead..." className="pl-8 h-9 border-slate-200 focus:ring-indigo-500" />
                </div>
            </div>

            <div className="grid gap-4">
                {mockInboxLeads.map((lead) => (
                    <Card key={lead.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${lead.type === 'SLA Breach' ? 'bg-rose-100 text-rose-600' :
                                        lead.type === 'Unassigned' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{lead.name}</h3>
                                            <Badge variant="outline" className={`text-[10px] ${lead.priority === 'Critical' ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-slate-200'
                                                }`}>
                                                {lead.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">{lead.company}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-slate-700 flex items-center justify-end gap-1">
                                            <Clock className="h-3 w-3" /> {lead.time}
                                        </p>
                                        <p className={`text-[10px] font-medium ${lead.type === 'SLA Breach' ? 'text-rose-500' : 'text-slate-400'
                                            }`}>
                                            {lead.type}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="sm" className="h-8 text-xs border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                            <UserPlus className="h-3.5 w-3.5 mr-1" /> Assign
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 text-xs border-slate-100 text-slate-600 hover:bg-slate-50">
                                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Note
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                <DropdownMenuItem>Mark as Trash</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-600">Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
