"use client"

import React from "react"
import {
    ChevronDown,
    MoreHorizontal,
    Play,
    Calendar,
    GripVertical,
    Bug,
    BookOpen,
    CheckCircle2,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sprint } from "@/shared/data/sprint-epic-store"
import { Issue, IssueType, IssuePriority } from "@/shared/data/issue-store"

interface SprintItemProps {
    sprint: Sprint
    issues: Issue[]
    onIssueClick?: (issue: Issue) => void
    onStartSprint?: (sprintId: string) => void
}

export function SprintItem({ sprint, issues, onIssueClick, onStartSprint }: SprintItemProps) {
    const totalPoints = issues.reduce((acc, curr) => acc + (curr.storyPoints || 0), 0)

    const getTypeIcon = (type: IssueType) => {
        switch (type) {
            case "BUG": return <Bug size={14} className="text-rose-600" />
            case "STORY": return <BookOpen size={14} className="text-emerald-600" />
            default: return <CheckCircle2 size={14} className="text-blue-600" />
        }
    }

    const getPriorityColor = (priority: IssuePriority) => {
        switch (priority) {
            case "URGENT": return "bg-rose-500"
            case "HIGH": return "bg-orange-500"
            case "MEDIUM": return "bg-blue-500"
            default: return "bg-slate-400"
        }
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-[24px] overflow-hidden shadow-sm transition-all hover:bg-slate-50/80">
            {/* Sprint Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChevronDown className="h-5 w-5 text-slate-400 cursor-pointer" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[14px] font-black text-slate-800 tracking-tight uppercase">{sprint.name}</h3>
                            <Badge className={`${sprint.status === 'ACTIVE' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'} border-none text-[10px] h-5 font-black px-2 uppercase tracking-widest`}>
                                {sprint.status}
                            </Badge>
                            <span className="text-[12px] text-slate-400 font-bold ml-1">{issues.length} Issues</span>
                        </div>
                        {sprint.startDate && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold mt-1">
                                <Calendar size={12} />
                                <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate!).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm">
                        <Zap size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{totalPoints} Points</span>
                    </div>

                    {sprint.status === 'PLANNED' && (
                        <Button
                            onClick={() => onStartSprint?.(sprint.id)}
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 font-black text-indigo-600 border-indigo-200 bg-white hover:bg-indigo-50 rounded-xl px-4 text-[11px] uppercase tracking-widest"
                        >
                            <Play className="h-3 w-3 fill-indigo-600" />
                            Start Sprint
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-white hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Sprint Issues List */}
            <div className="bg-white border-t border-slate-200 divide-y divide-slate-100">
                {issues.length > 0 ? (
                    issues.map((issue) => (
                        <div
                            key={issue.id}
                            onClick={() => onIssueClick?.(issue)}
                            className="group flex items-center justify-between p-4 hover:bg-slate-50/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <GripVertical className="h-4 w-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`h-2.5 w-2.5 rounded-full ${getPriorityColor(issue.priority)} shrink-0 shadow-sm`} />
                                    <span className="text-[13px] font-bold text-slate-700 truncate tracking-tight group-hover:text-indigo-600 transition-colors">
                                        {issue.title}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        {getTypeIcon(issue.type)}
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{issue.type}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-black text-slate-400 border-slate-100 h-5 px-1.5 rounded-md min-w-[60px] justify-center">
                                        {issue.id.split('-').pop()}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${issue.assigneeId}`} />
                                            <AvatarFallback className="text-[9px] font-black uppercase tracking-tighter">US</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="h-5 w-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                                        {issue.storyPoints || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center flex flex-col items-center justify-center space-y-2 bg-slate-50/30">
                        <Clock className="h-10 w-10 text-slate-200" />
                        <p className="text-[12px] text-slate-400 font-bold italic">
                            This sprint has no issues. Plan your work by dragging issues here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function Zap(props: any) {
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
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4Z" />
        </svg>
    )
}
