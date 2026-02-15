"use client"

import React from "react"
import {
    TrendingUp,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    Target,
    Zap,
    BarChart3,
    PieChart,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAnalyticsStore } from "@/shared/data/analytics-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectMemberStore } from "@/shared/data/project-member-store"

interface ProjectAnalyticsDashboardProps {
    projectId: string
}

const PRIORITY_COLORS: Record<string, string> = {
    URGENT: "bg-red-500",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500"
}

const TYPE_COLORS: Record<string, string> = {
    BUG: "bg-red-100 text-red-700 border-red-200",
    TASK: "bg-blue-100 text-blue-700 border-blue-200",
    STORY: "bg-purple-100 text-purple-700 border-purple-200",
    EPIC: "bg-indigo-100 text-indigo-700 border-indigo-200",
    SUBTASK: "bg-slate-100 text-slate-700 border-slate-200"
}

export default function ProjectAnalyticsDashboard({ projectId }: ProjectAnalyticsDashboardProps) {
    const { getProjectAnalytics } = useAnalyticsStore()
    const { issues } = useIssueStore()
    const { projectMembers } = useProjectMemberStore()

    React.useEffect(() => {
        useIssueStore.persist.rehydrate()
        useProjectMemberStore.persist.rehydrate()
    }, [])

    const analytics = React.useMemo(() => getProjectAnalytics(projectId), [projectId, issues, projectMembers, getProjectAnalytics])

    return (
        <div className="space-y-6 font-sans">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
                                <Target size={18} />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 text-[10px] font-bold border-none">
                                {analytics.taskMetrics.completionRate.toFixed(1)}%
                            </Badge>
                        </div>
                        <h3 className="text-[13px] font-bold text-slate-600 mb-1">Total Tasks</h3>
                        <p className="text-2xl font-bold text-slate-900">{analytics.taskMetrics.total}</p>
                        <Progress value={analytics.taskMetrics.completionRate} className="h-1.5 mt-3" />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-green-600 rounded-xl text-white shadow-lg shadow-green-100">
                                <CheckCircle2 size={18} />
                            </div>
                            <TrendingUp size={16} className="text-green-600" />
                        </div>
                        <h3 className="text-[13px] font-bold text-slate-600 mb-1">Completed</h3>
                        <p className="text-2xl font-bold text-slate-900">{analytics.taskMetrics.completed}</p>
                        <p className="text-[11px] text-green-600 font-semibold mt-2">
                            {analytics.taskMetrics.inProgress} in progress
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-amber-50 to-white">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-amber-600 rounded-xl text-white shadow-lg shadow-amber-100">
                                <Clock size={18} />
                            </div>
                            <Activity size={16} className="text-amber-600" />
                        </div>
                        <h3 className="text-[13px] font-bold text-slate-600 mb-1">Avg. Completion</h3>
                        <p className="text-2xl font-bold text-slate-900">{analytics.averageCompletionTime}d</p>
                        <p className="text-[11px] text-amber-600 font-semibold mt-2">
                            {analytics.teamProductivity} tasks/week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-red-50 to-white">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-red-600 rounded-xl text-white shadow-lg shadow-red-100">
                                <AlertCircle size={18} />
                            </div>
                            <Badge className="bg-red-100 text-red-700 text-[10px] font-bold border-none">
                                Urgent
                            </Badge>
                        </div>
                        <h3 className="text-[13px] font-bold text-slate-600 mb-1">Overdue</h3>
                        <p className="text-2xl font-bold text-slate-900">{analytics.taskMetrics.overdue}</p>
                        <p className="text-[11px] text-red-600 font-semibold mt-2">
                            {analytics.taskMetrics.pending} pending
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Member Workload */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" />
                            <CardTitle className="text-[15px] font-bold text-slate-900">Member Workload</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {analytics.memberWorkload.slice(0, 5).map((member) => (
                            <div key={member.memberId} className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={member.memberAvatar} />
                                    <AvatarFallback className="text-[11px] font-bold bg-indigo-100 text-indigo-700">
                                        {member.memberName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[13px] font-semibold text-slate-900 truncate">
                                            {member.memberName}
                                        </p>
                                        <span className="text-[11px] font-bold text-slate-600">
                                            {member.totalTasks} tasks
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Progress
                                            value={(member.completedTasks / member.totalTasks) * 100}
                                            className="h-1.5 flex-1"
                                        />
                                        <span className="text-[10px] font-bold text-green-600">
                                            {member.completedTasks}/{member.totalTasks}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Tasks by Priority */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-600" />
                            <CardTitle className="text-[15px] font-bold text-slate-900">Priority Breakdown</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {analytics.tasksByPriority.map((priority) => (
                            <div key={priority.priority} className="flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${PRIORITY_COLORS[priority.priority]}`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[13px] font-semibold text-slate-900">
                                            {priority.priority}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-600">
                                            {priority.count} ({priority.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <Progress value={priority.percentage} className="h-1.5" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Type */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <PieChart size={18} className="text-indigo-600" />
                            <CardTitle className="text-[15px] font-bold text-slate-900">Task Types</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {analytics.tasksByType.map((type) => (
                                <div key={type.type} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Badge className={`text-[10px] font-bold mb-2 ${TYPE_COLORS[type.type]}`}>
                                        {type.type}
                                    </Badge>
                                    <p className="text-xl font-bold text-slate-900">{type.count}</p>
                                    <p className="text-[11px] text-slate-500 font-semibold">
                                        {type.percentage.toFixed(1)}% of total
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks by State */}
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-indigo-600" />
                            <CardTitle className="text-[15px] font-bold text-slate-900">Workflow States</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {analytics.tasksByState.slice(0, 6).map((state) => (
                            <div key={state.state} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <span className="text-[12px] font-semibold text-slate-700">
                                    {state.state.replace(/_/g, " ")}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-600">
                                        {state.count}
                                    </span>
                                    <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600 rounded-full"
                                            style={{ width: `${state.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Sprint Velocity */}
            <Card className="border-none shadow-sm rounded-2xl bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-600 mb-1">Sprint Velocity</h3>
                            <p className="text-3xl font-bold text-slate-900">{analytics.sprintVelocity}</p>
                            <p className="text-[12px] text-slate-500 font-medium mt-1">Story points completed</p>
                        </div>
                        <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-100">
                            <TrendingUp size={32} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
