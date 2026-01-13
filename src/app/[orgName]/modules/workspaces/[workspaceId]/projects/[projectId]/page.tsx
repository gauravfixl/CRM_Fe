"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectById, getProjectAnalytics, type Project, type ProjectAnalytics } from "@/modules/project-management/project/hooks/projectHooks"
import { ArrowLeft, Users, CheckCircle2, Clock, AlertCircle, Settings, BarChart3, Kanban } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectDetailsPage() {
    const [project, setProject] = useState<Project | null>(null)
    const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                showLoader()
                const [projectRes, analyticsRes] = await Promise.all([
                    getProjectById(params.projectId, params.workspaceId),
                    getProjectAnalytics(params.projectId)
                ])
                setProject(projectRes?.data?.data)
                setAnalytics(analyticsRes?.data?.data)
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch project:", err)
                }
            } finally {
                hideLoader()
            }
        }

        if (params.projectId && params.workspaceId) {
            fetchProjectData()
        }
    }, [params.projectId, params.workspaceId, showLoader, hideLoader])

    if (!project) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <>
            <SubHeader
                title={project.name}
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: project.name, href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects`}>
                            <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </CustomButton>
                        </Link>
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}>
                            <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                                <Kanban className="w-4 h-4" /> Open Board
                            </CustomButton>
                        </Link>
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}>
                            <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                                <Settings className="w-4 h-4" /> Settings
                            </CustomButton>
                        </Link>
                    </div>
                }
            />

            <div className="p-4 space-y-4">
                {/* Analytics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Tasks</SmallCardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{analytics?.totalTasks || 0}</div>
                            <p className="text-xs text-muted-foreground">All tasks</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Completed</SmallCardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{analytics?.completedTasks || 0}</div>
                            <p className="text-xs text-muted-foreground">Finished tasks</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Pending</SmallCardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-orange-600">{analytics?.pendingTasks || 0}</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Overdue</SmallCardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-red-600">{analytics?.overdueTasks || 0}</div>
                            <p className="text-xs text-muted-foreground">Past deadline</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <FlatCard>
                            <FlatCardHeader>
                                <FlatCardTitle>Project Information</FlatCardTitle>
                                <FlatCardDescription>Basic details about this project</FlatCardDescription>
                            </FlatCardHeader>
                            <FlatCardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="text-base">{project.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="text-base">{project.description || "No description provided"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Visibility</label>
                                    <p className="text-base capitalize">{project.visibility}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <p className="text-base">{project.isArchived ? "Archived" : "Active"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created By</label>
                                    <p className="text-base">{project.createdBy?.email || "Unknown"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                    <p className="text-base">{new Date(project.createdAt).toLocaleString()}</p>
                                </div>
                            </FlatCardContent>
                        </FlatCard>
                    </TabsContent>

                    <TabsContent value="tasks">
                        <FlatCard>
                            <FlatCardHeader>
                                <FlatCardTitle>Tasks</FlatCardTitle>
                                <FlatCardDescription>All tasks in this project</FlatCardDescription>
                            </FlatCardHeader>
                            <FlatCardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <CheckCircle2 className="mx-auto h-12 w-12 mb-4" />
                                    <p>No tasks yet. Create your first task to get started.</p>
                                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}>
                                        <CustomButton className="mt-4">Go to Board</CustomButton>
                                    </Link>
                                </div>
                            </FlatCardContent>
                        </FlatCard>
                    </TabsContent>

                    <TabsContent value="members">
                        <FlatCard>
                            <FlatCardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <FlatCardTitle>Members</FlatCardTitle>
                                        <FlatCardDescription>Manage project members and permissions</FlatCardDescription>
                                    </div>
                                    <CustomButton size="sm">Add Member</CustomButton>
                                </div>
                            </FlatCardHeader>
                            <FlatCardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="mx-auto h-12 w-12 mb-4" />
                                    <p>View and manage all project members</p>
                                </div>
                            </FlatCardContent>
                        </FlatCard>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <FlatCard>
                            <FlatCardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <FlatCardTitle>Analytics</FlatCardTitle>
                                        <FlatCardDescription>Detailed project analytics and insights</FlatCardDescription>
                                    </div>
                                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/analytics`}>
                                        <CustomButton size="sm">
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            View Full Analytics
                                        </CustomButton>
                                    </Link>
                                </div>
                            </FlatCardHeader>
                            <FlatCardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Quick Stats</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border rounded-lg p-3">
                                                <p className="text-xs text-muted-foreground">Completion Rate</p>
                                                <p className="text-2xl font-bold">
                                                    {analytics?.totalTasks && analytics?.completedTasks
                                                        ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
                                                        : 0}%
                                                </p>
                                            </div>
                                            <div className="border rounded-lg p-3">
                                                <p className="text-xs text-muted-foreground">Tasks per Member</p>
                                                <p className="text-2xl font-bold">
                                                    {analytics?.tasksPerMember?.length
                                                        ? Math.round(analytics.totalTasks / analytics.tasksPerMember.length)
                                                        : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FlatCardContent>
                        </FlatCard>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
