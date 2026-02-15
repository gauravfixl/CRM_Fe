"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getWorkspaceAnalytics, type WorkspaceAnalytics } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { ArrowLeft, Users, FolderKanban, CheckCircle2, Clock, TrendingUp, BarChart3 } from "lucide-react"
import {
    CustomTable,
    CustomTableBody,
    CustomTableCell,
    CustomTableHead,
    CustomTableHeader,
    CustomTableRow,
} from "@/components/custom/CustomTable"

export default function WorkspaceAnalyticsPage() {
    const [analytics, setAnalytics] = useState<WorkspaceAnalytics | null>(null)

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string }
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
                const res = await getWorkspaceAnalytics(params.workspaceId)
                setAnalytics(res?.data?.data)
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch analytics:", err)
                }
            } finally {
                hideLoader()
            }
        }

        if (params.workspaceId) {
            fetchAnalytics()
        }
    }, [params.workspaceId, showLoader, hideLoader])

    if (!analytics) {
        return <div className="p-4">Loading analytics...</div>
    }

    const completionRate = analytics.activeTasks + analytics.completedTasks > 0
        ? Math.round((analytics.completedTasks / (analytics.activeTasks + analytics.completedTasks)) * 100)
        : 0

    return (
        <>
            <SubHeader
                title="Workspace Analytics"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Analytics", href: `/${orgName}/modules/workspaces/${params.workspaceId}/analytics` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}`}>
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
                            <SmallCardTitle className="text-sm font-medium">Total Projects</SmallCardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                            <p className="text-xs text-muted-foreground">Active projects</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Team Members</SmallCardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{analytics.totalMembers}</div>
                            <p className="text-xs text-muted-foreground">Workspace members</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Active Tasks</SmallCardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-orange-600">{analytics.activeTasks}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Completion Rate</SmallCardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                            <p className="text-xs text-muted-foreground">Tasks completed</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* Workload Per Member */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Workload Distribution</FlatCardTitle>
                        <FlatCardDescription>
                            Task distribution across team members
                        </FlatCardDescription>
                    </FlatCardHeader>
                    <FlatCardContent>
                        {analytics.workloadPerMember && analytics.workloadPerMember.length > 0 ? (
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
                                    {analytics.workloadPerMember.map((member, index) => {
                                        const totalTasks = analytics.activeTasks + analytics.completedTasks
                                        const percentage = totalTasks > 0 ? Math.round((member.taskCount / totalTasks) * 100) : 0
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

                {/* Project-wise Task Distribution */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Project Task Distribution</FlatCardTitle>
                        <FlatCardDescription>
                            Number of tasks per project
                        </FlatCardDescription>
                    </FlatCardHeader>
                    <FlatCardContent>
                        {analytics.projectWiseTaskDistribution && analytics.projectWiseTaskDistribution.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Project Name</CustomTableHead>
                                        <CustomTableHead>Task Count</CustomTableHead>
                                        <CustomTableHead>Distribution</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {analytics.projectWiseTaskDistribution.map((project, index) => {
                                        const totalTasks = analytics.activeTasks + analytics.completedTasks
                                        const percentage = totalTasks > 0 ? Math.round((project.taskCount / totalTasks) * 100) : 0
                                        return (
                                            <CustomTableRow key={index}>
                                                <CustomTableCell className="font-medium">{project.projectName}</CustomTableCell>
                                                <CustomTableCell>{project.taskCount}</CustomTableCell>
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
                                <FolderKanban className="mx-auto h-12 w-12 mb-4" />
                                <p>No project data available</p>
                            </div>
                        )}
                    </FlatCardContent>
                </FlatCard>

                {/* Teams Per Project */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Teams Overview</FlatCardTitle>
                        <FlatCardDescription>
                            Team distribution across projects
                        </FlatCardDescription>
                    </FlatCardHeader>
                    <FlatCardContent>
                        {analytics.teamsPerProject && analytics.teamsPerProject.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Project Name</CustomTableHead>
                                        <CustomTableHead>Team Count</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {analytics.teamsPerProject.map((project, index) => (
                                        <CustomTableRow key={index}>
                                            <CustomTableCell className="font-medium">{project.projectName}</CustomTableCell>
                                            <CustomTableCell>{project.teamCount}</CustomTableCell>
                                        </CustomTableRow>
                                    ))}
                                </CustomTableBody>
                            </CustomTable>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                                <p>No team data available</p>
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
                                <span className="font-bold">{analytics.activeTasks + analytics.completedTasks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Active Tasks</span>
                                <span className="font-bold text-orange-600">{analytics.activeTasks}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Completed Tasks</span>
                                <span className="font-bold text-green-600">{analytics.completedTasks}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-muted-foreground">Completion Rate</span>
                                <span className="font-bold text-blue-600">{completionRate}%</span>
                            </div>
                        </FlatCardContent>
                    </FlatCard>

                    <FlatCard>
                        <FlatCardHeader>
                            <FlatCardTitle>Workspace Summary</FlatCardTitle>
                        </FlatCardHeader>
                        <FlatCardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Projects</span>
                                <span className="font-bold">{analytics.totalProjects}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Teams</span>
                                <span className="font-bold">{analytics.totalTeams}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Members</span>
                                <span className="font-bold">{analytics.totalMembers}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm text-muted-foreground">Avg Tasks per Member</span>
                                <span className="font-bold text-blue-600">
                                    {analytics.totalMembers > 0
                                        ? Math.round((analytics.activeTasks + analytics.completedTasks) / analytics.totalMembers)
                                        : 0}
                                </span>
                            </div>
                        </FlatCardContent>
                    </FlatCard>
                </div>
            </div>
        </>
    )
}
