"use client"

import React, { useState } from "react"
import {
    Activity,
    Filter,
    Calendar,
    User,
    FileText,
    GitBranch,
    Users,
    MessageSquare,
    Upload,
    Trash2,
    Edit,
    Plus,
    ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuditLogsStore, AuditEventType } from "@/shared/data/audit-logs-store"
import { formatDistanceToNow } from "date-fns"

interface ActivityFeedProps {
    projectId?: string
    workspaceId?: string
    userId?: string
    limit?: number
}

const EVENT_ICONS: Record<string, React.ReactNode> = {
    TASK_CREATED: <Plus size={14} className="text-green-600" />,
    TASK_UPDATED: <Edit size={14} className="text-blue-600" />,
    TASK_DELETED: <Trash2 size={14} className="text-red-600" />,
    TASK_MOVED: <ArrowRight size={14} className="text-purple-600" />,
    MEMBER_ADDED: <Users size={14} className="text-green-600" />,
    MEMBER_REMOVED: <Users size={14} className="text-red-600" />,
    MEMBER_ROLE_CHANGED: <User size={14} className="text-amber-600" />,
    WORKFLOW_UPDATED: <GitBranch size={14} className="text-indigo-600" />,
    COLUMN_ADDED: <Plus size={14} className="text-green-600" />,
    COLUMN_UPDATED: <Edit size={14} className="text-blue-600" />,
    COLUMN_DELETED: <Trash2 size={14} className="text-red-600" />,
    COMMENT_ADDED: <MessageSquare size={14} className="text-blue-600" />,
    DOCUMENT_UPLOADED: <Upload size={14} className="text-green-600" />,
    DOCUMENT_DELETED: <Trash2 size={14} className="text-red-600" />,
}

const EVENT_COLORS: Record<string, string> = {
    TASK_CREATED: "bg-green-50 border-green-200",
    TASK_UPDATED: "bg-blue-50 border-blue-200",
    TASK_DELETED: "bg-red-50 border-red-200",
    TASK_MOVED: "bg-purple-50 border-purple-200",
    MEMBER_ADDED: "bg-green-50 border-green-200",
    MEMBER_REMOVED: "bg-red-50 border-red-200",
    MEMBER_ROLE_CHANGED: "bg-amber-50 border-amber-200",
    WORKFLOW_UPDATED: "bg-indigo-50 border-indigo-200",
    COLUMN_ADDED: "bg-green-50 border-green-200",
    COLUMN_UPDATED: "bg-blue-50 border-blue-200",
    COLUMN_DELETED: "bg-red-50 border-red-200",
    COMMENT_ADDED: "bg-blue-50 border-blue-200",
    DOCUMENT_UPLOADED: "bg-green-50 border-green-200",
    DOCUMENT_DELETED: "bg-red-50 border-red-200",
}

export default function ActivityFeed({ projectId, workspaceId, userId, limit = 50 }: ActivityFeedProps) {
    const { getLogs } = useAuditLogsStore()

    const [filterEventType, setFilterEventType] = useState<AuditEventType | "ALL">("ALL")
    const [filterEntityType, setFilterEntityType] = useState<string>("ALL")

    const logs = getLogs({
        projectId,
        workspaceId,
        userId,
        ...(filterEventType !== "ALL" && { eventType: filterEventType }),
        ...(filterEntityType !== "ALL" && { entityType: filterEntityType as any })
    }).slice(0, limit)

    const formatTimeAgo = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        } catch {
            return "recently"
        }
    }

    return (
        <div className="space-y-4 font-sans">
            {/* Header with Filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" />
                    <h3 className="text-[15px] font-bold text-slate-900">Activity Feed</h3>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border-none">
                        {logs.length} events
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={filterEventType} onValueChange={(v) => setFilterEventType(v as any)}>
                        <SelectTrigger className="h-8 w-36 rounded-lg text-[11px] font-semibold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="ALL" className="text-[12px] font-medium">All Events</SelectItem>
                            <SelectItem value="TASK_CREATED" className="text-[12px] font-medium">Task Created</SelectItem>
                            <SelectItem value="TASK_UPDATED" className="text-[12px] font-medium">Task Updated</SelectItem>
                            <SelectItem value="TASK_MOVED" className="text-[12px] font-medium">Task Moved</SelectItem>
                            <SelectItem value="MEMBER_ADDED" className="text-[12px] font-medium">Member Added</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterEntityType} onValueChange={setFilterEntityType}>
                        <SelectTrigger className="h-8 w-32 rounded-lg text-[11px] font-semibold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="ALL" className="text-[12px] font-medium">All Types</SelectItem>
                            <SelectItem value="task" className="text-[12px] font-medium">Tasks</SelectItem>
                            <SelectItem value="member" className="text-[12px] font-medium">Members</SelectItem>
                            <SelectItem value="workflow" className="text-[12px] font-medium">Workflow</SelectItem>
                            <SelectItem value="team" className="text-[12px] font-medium">Teams</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Activity List */}
            <div className="space-y-2">
                {logs.length === 0 ? (
                    <Card className="border-none shadow-sm rounded-2xl bg-slate-50">
                        <CardContent className="p-8 text-center">
                            <Activity size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-[13px] font-semibold text-slate-500">No activity found</p>
                            <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters</p>
                        </CardContent>
                    </Card>
                ) : (
                    logs.map((log) => (
                        <Card
                            key={log.id}
                            className={`border rounded-xl transition-all hover:shadow-sm ${EVENT_COLORS[log.eventType] || "bg-slate-50 border-slate-200"}`}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
                                        {EVENT_ICONS[log.eventType] || <FileText size={14} className="text-slate-600" />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Avatar className="h-6 w-6 border border-white shadow-sm">
                                                    <AvatarImage src={log.userAvatar} />
                                                    <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                                        {log.userName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[13px] font-bold text-slate-900">
                                                    {log.userName}
                                                </span>
                                                <span className="text-[12px] text-slate-500 font-medium">
                                                    {log.details.action}
                                                </span>
                                                {log.entityName && (
                                                    <Badge className="bg-white text-slate-700 text-[10px] font-bold border border-slate-200">
                                                        {log.entityName}
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                                                {formatTimeAgo(log.timestamp)}
                                            </span>
                                        </div>

                                        {/* Changes */}
                                        {log.details.changes && log.details.changes.length > 0 && (
                                            <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
                                                {log.details.changes.map((change, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[11px]">
                                                        <span className="font-bold text-slate-600">
                                                            {change.field}:
                                                        </span>
                                                        <span className="text-red-600 font-mono line-through">
                                                            {String(change.oldValue)}
                                                        </span>
                                                        <ArrowRight size={10} className="text-slate-400" />
                                                        <span className="text-green-600 font-mono font-semibold">
                                                            {String(change.newValue)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        {log.details.metadata && Object.keys(log.details.metadata).length > 0 && (
                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                {Object.entries(log.details.metadata).map(([key, value]) => (
                                                    <Badge
                                                        key={key}
                                                        className="bg-white text-slate-600 text-[9px] font-semibold border border-slate-200"
                                                    >
                                                        {key}: {String(value)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
