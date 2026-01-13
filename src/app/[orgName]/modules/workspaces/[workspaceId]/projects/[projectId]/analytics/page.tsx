"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectAnalytics, type ProjectAnalytics } from "@/modules/project-management/project/hooks/projectHooks"
import { ArrowLeft, Users, CheckCircle2, Clock, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import {
    CustomTable,
    CustomTableBody,
    CustomTableCell,
    CustomTableHead,
    CustomTableHeader,
    CustomTableRow,
} from "@/components/custom/CustomTable"

export default function ProjectAnalyticsPage() {
    const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string }
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                showLoader()
                const res = await getProjectAnalytics(params.projectId)
                setAnalytics(res?.data?.data)
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch analytics:", err)
                }
            } finally {
                hideLoader()
            }
        }

        if (params.projectId) {
            fetchAnalytics()
        }
    }, [params.projectId, showLoader, hideLoader])

    if (!analytics) {
        return <div className="p-4">Loading analytics...</div>
    }

    const completionRate = analytics.totalTasks > 0
        ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
        : 0

    return (
        <>
            <SubHeader
                title="Project Analytics"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: "Analytics", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/analytics` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}`}>
                        <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </CustomButton>
                    </Link>
                }
            />

            <div className="p-4 space-y-6">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Tasks</SmallCardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{analytics.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">All tasks</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Completed</SmallCardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{analytics.completedTasks}</div>
                            <p className="text-xs text-muted-foreground">Finished</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Pending</SmallCardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-orange-600">{analytics.pendingTasks}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Completion Rate</SmallCardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
                            <p className="text-xs text-muted-foreground">Success rate</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* Tasks Per Member */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Workload Distribution</FlatCardTitle>
                        <FlatCardDescription>
                            Task distribution across team members
                        </FlatCardDescription>
                    </FlatCardHeader>
                    <FlatCardContent>
                        {analytics.tasksPerMember && analytics.tasksPerMember.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Member</CustomTableHead>
                                        <CustomTableHead>Email</CustomTableHead>
                                        <CustomTableHead>Task Count</CustomTableHead>
                                        <CustomTableHead>Workload</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {analytics.tasksPerMember.map((member, index) => {
                                        const percentage = analytics.totalTasks > 0
                                            ? Math.round((member.taskCount / analytics.totalTasks) * 100)
                                            : 0
                                        return (
                                            <CustomTableRow key={index}>
                                                <CustomTableCell className="font-medium">{member.member}</CustomTableCell>
                                                <CustomTableCell>{member.email}</CustomTableCell>
                                                <CustomTableCell>{member.taskCount}</CustomTableCell>
                                                <CustomTableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[200px]">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                                                    </div>
                                                </CustomTableCell>
                                            </CustomTableRow>
                                        )
                                    })}
                                </CustomTableBody>
                            </CustomTable>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="mx-auto h-12 w-12 mb-4" />
                                <p>No workload data available</p>
                            </div>
                        )}
                    </FlatCardContent>
                </FlatCard>

                {/* Tasks Per State */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Task Status Distribution</FlatCardTitle>
                        <FlatCardDescription>
                            Number of tasks in each status
                        </FlatCardDescription>
                    </FlatCardHeader>
                    <FlatCardContent>
                        {analytics.tasksPerState && analytics.tasksPerState.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Status</CustomTableHead>
                                        <CustomTableHead>Task Count</CustomTableHead>
                                        <CustomTableHead>Distribution</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {analytics.tasksPerState.map((state, index) => {
                                        const percentage = analytics.totalTasks > 0
                                            ? Math.round((state.count / analytics.totalTasks) * 100)
                                            : 0
                                        return (
                                            <CustomTableRow key={index}>
                                                <CustomTableCell className="font-medium capitalize">{state.state}</CustomTableCell>
                                                <CustomTableCell>{state.count}</CustomTableCell>
                                                <CustomTableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[200px]">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">{percentage}%</span>
                                                    </div>
                                                </CustomTableCell>
                                            </CustomTableRow>
                                        )
                                    })}
                                </CustomTableBody>
                            </CustomTable>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                                <p>No status data available</p>
                            </div>
                        )}
                    </FlatCardContent>
                </FlatCard>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <FlatCard>
                        <FlatCardHeader>
                            <FlatCardTitle>Task Summary</FlatCardTitle>
                        </FlatCardHeader>
                        <FlatCardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Tasks</span>
                                <span className="font-bold">{analytics.totalTasks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Completed Tasks</span>
                                <span className="font-bold text-green-600">{analytics.completedTasks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Pending Tasks</span>
                                <span className="font-bold text-orange-600">{analytics.pendingTasks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Overdue Tasks</span>
                                <span className="font-bold text-red-600">{analytics.overdueTasks}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-muted-foreground">Completion Rate</span>
                                <span className="font-bold text-blue-600">{completionRate}%</span>
                            </div>
                        </FlatCardContent>
                    </FlatCard>

                    <FlatCard>
                        <FlatCardHeader>
                            <FlatCardTitle>Team Performance</FlatCardTitle>
                        </FlatCardHeader>
                        <FlatCardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Members</span>
                                <span className="font-bold">{analytics.tasksPerMember?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Avg Tasks per Member</span>
                                <span className="font-bold">
                                    {analytics.tasksPerMember?.length > 0
                                        ? Math.round(analytics.totalTasks / analytics.tasksPerMember.length)
                                        : 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Active Statuses</span>
                                <span className="font-bold">{analytics.tasksPerState?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                                <span className="font-bold text-green-600">
                                    {analytics.totalTasks > 0
                                        ? Math.round(((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100)
                                        : 0}%
                                </span>
                            </div>
                        </FlatCardContent>
                    </FlatCard>
                </div>
            </div>
        </>
    )
}
