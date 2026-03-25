"use client"

import React from 'react'
import {
    MoreVertical,
    UserPlus,
    MessageSquare,
    Phone,
    Mail,
    Clock,
    AlertCircle,
    TrendingUp,
    ExternalLink,
    ShieldAlert,
    Zap,
    History,
    RotateCcw,
    AlertTriangle,
    ShieldCheck,
    Gem,
    UserCheck,
    Bell,
    MessageSquarePlus,
    Tag,
    Settings2,
    CalendarPlus,
    UserCircle
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Checkbox } from "@/shared/components/ui/checkbox"

export interface Lead {
    id: string
    name: string
    email: string
    company: string
    source: string
    score: number
    status: string
    stage: string
    assignedTo?: string
    lastActivity: string
    slaStatus: 'healthy' | 'warning' | 'breached'
    slaTimeRemaining?: string
    value: string
    tags: string[]
    lostReason?: string
    ownerName?: string
}

interface LeadTableProps {
    leads: Lead[]
    category: string
    selectedIds: string[]
    onSelectionChange: (ids: string[]) => void
    onLeadAction: (lead: Lead, action: string) => void
}

export function LeadInboxTable({ leads, category, selectedIds, onSelectionChange, onLeadAction }: LeadTableProps) {

    const toggleAll = () => {
        if (selectedIds.length === leads.length && leads.length > 0) {
            onSelectionChange([])
        } else {
            onSelectionChange(leads.map(l => l.id))
        }
    }

    const toggleOne = (id: string) => {
        onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id])
    }

    return (
        <TooltipProvider>
            <div className="w-full overflow-hidden bg-white rounded-xl border border-slate-200/60 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-4 py-3.5 w-10">
                                    <Checkbox
                                        checked={selectedIds.length === leads.length && leads.length > 0}
                                        onCheckedChange={toggleAll}
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                </th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Lead Detail</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Pipeline & Value</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Status & SLA</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Engagement</th>
                                {category === 'owners' && (
                                    <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Owner</th>
                                )}
                                {category === 'lost' && (
                                    <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">Resolution</th>
                                )}
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <History className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
                                            <p className="text-[13px] font-medium text-slate-500 italic">No data matching your current segment.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className={`group transition-colors duration-150 ${selectedIds.includes(lead.id) ? 'bg-indigo-50/40' : 'hover:bg-slate-50/60'
                                            }`}
                                    >
                                        <td className="px-4 py-4.5">
                                            <Checkbox
                                                checked={selectedIds.includes(lead.id)}
                                                onCheckedChange={() => toggleOne(lead.id)}
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-5 py-4.5">
                                            <div className="flex items-center gap-3.5">
                                                <div className="relative shrink-0">
                                                    <Avatar className="h-10 w-10 border border-slate-200/60 shadow-sm ring-2 ring-white">
                                                        <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                                                            {lead.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {lead.score > 85 && (
                                                        <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm ring-1 ring-white">
                                                            <Zap className="h-2.5 w-2.5 fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-semibold text-slate-900 truncate">
                                                            {lead.name}
                                                        </span>
                                                        <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 text-[9px] h-4.5 px-1.5 font-medium">
                                                            {lead.stage}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[11px] font-medium text-slate-500 truncate opacity-70">{lead.company}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4.5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-bold text-slate-800">{lead.value}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{lead.source}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 overflow-hidden">
                                                    {lead.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[9px] font-medium text-indigo-500 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/50">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {lead.tags.length > 3 && (
                                                        <span className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                                            +{lead.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                        </td>
                                        <td className="px-5 py-4.5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    {lead.slaStatus === 'breached' ? (
                                                        <Badge className="bg-rose-50 text-rose-600 border-rose-100 shadow-none text-[9px] font-medium h-5 px-1.5">
                                                            <ShieldAlert className="h-3 w-3 mr-1" /> Breached
                                                        </Badge>
                                                    ) : lead.slaStatus === 'warning' ? (
                                                        <Badge className="bg-amber-50 text-amber-600 border-amber-100 shadow-none text-[9px] font-medium h-5 px-1.5">
                                                            <AlertCircle className="h-3 w-3 mr-1" /> Expires soon
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none text-[9px] font-medium h-5 px-1.5">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" /> On target
                                                        </Badge>
                                                    )}
                                                </div>
                                                {lead.slaTimeRemaining && (
                                                    <span className="text-[10px] font-semibold text-slate-400 italic">Remaining: {lead.slaTimeRemaining}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4.5">
                                            <div className="flex flex-col gap-2 w-32">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-medium text-slate-400">Engagement</span>
                                                    <span className={`text-[11px] font-semibold ${lead.score > 75 ? 'text-indigo-600' : 'text-slate-500'}`}>{lead.score}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${lead.score > 80 ? 'bg-indigo-500' :
                                                            lead.score > 50 ? 'bg-indigo-300' : 'bg-slate-300'
                                                            }`}
                                                        style={{ width: `${lead.score}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400 justify-end">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    <span>Seen {lead.lastActivity}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {category === 'owners' && (
                                            <td className="px-5 py-4.5">
                                                <div className="flex items-center gap-2.5 py-1 px-2.5 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                                                    <Avatar className="h-5 w-5 ring-1 ring-white">
                                                        <AvatarFallback className="text-[8px] font-bold bg-white text-slate-500 uppercase">
                                                            {lead.ownerName?.split(' ').map(n => n[0]).join('') || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-[11.5px] font-semibold text-slate-600">{lead.ownerName || 'Unassigned'}</span>
                                                </div>
                                            </td>
                                        )}
                                        {category === 'lost' && (
                                            <td className="px-5 py-4.5 max-w-[140px]">
                                                <span className="text-[10px] font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded block truncate">
                                                    {lead.lostReason || 'N/A'}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-5 py-4.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onLeadAction(lead, 'Click to Call')}
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 transition-all"
                                                        >
                                                            <Phone className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-slate-900 border-none text-[10px] font-bold"><p>Dial</p></TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onLeadAction(lead, 'Send Email')}
                                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 transition-all"
                                                        >
                                                            <Mail className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="bg-slate-900 border-none text-[10px] font-bold"><p>Email</p></TooltipContent>
                                                </Tooltip>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[220px] p-1.5 rounded-xl shadow-xl border-slate-100 animate-in fade-in zoom-in-95 duration-200">

                                                        <DropdownMenuItem
                                                            onClick={() => onLeadAction(lead, 'Open Full Profile')}
                                                            className="text-[12.5px] font-semibold py-2.5 rounded-lg cursor-pointer text-indigo-600 focus:bg-indigo-50 focus:text-indigo-700"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2.5 opacity-80" /> View Full Profile
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-50 my-1.5" />

                                                        {/* Contextual Actions based on Category */}
                                                        {category === 'new' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Acknowledge')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <UserCheck className="h-3.5 w-3.5 mr-2.5 opacity-60 text-blue-500" /> Acknowledge Lead
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Move to Qualification')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <TrendingUp className="h-3.5 w-3.5 mr-2.5 opacity-60 text-emerald-500" /> Move to Qualification
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {category === 'unassigned' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Manual Assignment')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <UserPlus className="h-3.5 w-3.5 mr-2.5 opacity-60 text-indigo-500" /> Manual Assign
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Apply Routing Rule')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <Settings2 className="h-3.5 w-3.5 mr-2.5 opacity-60 text-slate-500" /> Apply Routing Rule
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {category === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Nudge Owner')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <Bell className="h-3.5 w-3.5 mr-2.5 opacity-60 text-amber-500" /> Nudge Owner
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Force Reassign')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <RotateCcw className="h-3.5 w-3.5 mr-2.5 opacity-60 text-rose-500" /> Reassign Immediate
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {category === 'at-risk' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Executive Escalation')} className="text-[12px] font-bold py-2 rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50">
                                                                    <AlertTriangle className="h-3.5 w-3.5 mr-2.5" /> High Priority Escalate
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'SLA Override')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <ShieldCheck className="h-3.5 w-3.5 mr-2.5 opacity-60 text-indigo-500" /> Override SLA Timer
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {category === 'inactive' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Re-engagement Email')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <MessageSquarePlus className="h-3.5 w-3.5 mr-2.5 opacity-60 text-blue-500" /> Send Re-Engagement
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Archive')} className="text-[12px] font-bold py-2 rounded-lg cursor-pointer text-slate-400 focus:bg-slate-100">
                                                                    <History className="h-3.5 w-3.5 mr-2.5" /> Archive Record
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        {category === 'high-value' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'Strategic Assign')} className="text-[12px] font-bold py-2 rounded-lg cursor-pointer text-violet-600 focus:bg-violet-50">
                                                                    <Gem className="h-3.5 w-3.5 mr-2.5" /> Assign Strategic Rep
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => onLeadAction(lead, 'VIP Tagging')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                                    <Tag className="h-3.5 w-3.5 mr-2.5 opacity-60 text-amber-500" /> Add VIP Tag
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        <div className="h-px bg-slate-50 my-1.5" />
                                                        <DropdownMenuItem onClick={() => onLeadAction(lead, 'Schedule Task')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                            <CalendarPlus className="h-3.5 w-3.5 mr-2.5 opacity-60 text-slate-500" /> Schedule Task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onLeadAction(lead, 'Log Conversation')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer focus:bg-slate-50">
                                                            <MessageSquare className="h-3.5 w-3.5 mr-2.5 opacity-60 text-slate-500" /> Log Activity
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TooltipProvider>
    )
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
