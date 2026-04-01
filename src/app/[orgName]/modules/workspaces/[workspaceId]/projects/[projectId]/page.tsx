"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectById, getProjectAnalytics, getAssignableMembers, type Project, type ProjectAnalytics } from "@/modules/project-management/project/hooks/projectHooks"
import { getAllTasks, type Task } from "@/modules/project-management/task/hooks/taskHooks"
import { getAllProjectMembers, assignMemberToProject, removeProjectMember, type ProjectMember } from "@/modules/project-management/project-member/hooks/projectMemberHooks"
import { ArrowLeft, Users, CheckCircle2, Clock, AlertCircle, Settings, BarChart3, Kanban, Plus, Trash2, Flag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"
import { CustomInput } from "@/components/custom/CustomInput"
import { showSuccess, showError } from "@/utils/toast"

export default function ProjectDetailsPage() {
    const [project, setProject] = useState<Project | null>(null)
    const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [memberEmail, setMemberEmail] = useState("")
    const [assignableMembers, setAssignableMembers] = useState<any[]>([])

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    const fetchProjectData = async () => {
        try {
            showLoader()
            const [projectRes, analyticsRes, tasksRes, membersRes] = await Promise.allSettled([
                getProjectById(params.projectId, params.workspaceId),
                getProjectAnalytics(params.projectId),
                getAllTasks(params.projectId),
                getAllProjectMembers(params.projectId, { workspaceId: params.workspaceId })
            ])

            if (projectRes.status === 'fulfilled') setProject(projectRes.value?.data?.data)
            if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value?.data?.data)
            if (tasksRes.status === 'fulfilled') {
                const tasksData = tasksRes.value?.data?.data?.tasks || tasksRes.value?.data?.tasks || tasksRes.value?.data?.data || []
                setTasks(Array.isArray(tasksData) ? tasksData : [])
            }
            if (membersRes.status === 'fulfilled') {
                const membersData = membersRes.value?.data?.data?.members || membersRes.value?.data?.members || membersRes.value?.data?.data || []
                setProjectMembers(Array.isArray(membersData) ? membersData : [])
            }
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch project:", err)
            }
        } finally {
            hideLoader()
        }
    }

    useEffect(() => {
        if (params.projectId && params.workspaceId) {
            fetchProjectData()
        }
    }, [params.projectId, params.workspaceId])

    const handleAddMember = async () => {
        if (!memberEmail.trim()) { showError("Please enter member ID"); return }
        try {
            showLoader()
            await assignMemberToProject(params.projectId, {
                workspaceId: params.workspaceId,
                memberId: memberEmail,
                role: "member"
            })
            showSuccess("Member added successfully!")
            setIsAddMemberOpen(false)
            setMemberEmail("")
            fetchProjectData()
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to add member")
        } finally {
            hideLoader()
        }
    }

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
                                <div className="flex justify-between items-center">
                                    <div>
                                        <FlatCardTitle>Tasks ({tasks.length})</FlatCardTitle>
                                        <FlatCardDescription>All tasks in this project</FlatCardDescription>
                                    </div>
                                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}>
                                        <CustomButton size="sm"><Kanban className="w-4 h-4 mr-2" /> Open Board</CustomButton>
                                    </Link>
                                </div>
                            </FlatCardHeader>
                            <FlatCardContent>
                                {tasks.length > 0 ? (
                                    <div className="divide-y">
                                        {tasks.map((task) => (
                                            <Link
                                                key={task._id}
                                                href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/tasks/${task._id}`}
                                            >
                                                <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                                        <div>
                                                            <p className="text-sm font-medium">{task.name}</p>
                                                            <p className="text-xs text-muted-foreground">{task.taskCode || task.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs capitalize">{task.status}</Badge>
                                                        <Badge className={`text-[10px] ${task.priority === 'critical' ? 'bg-red-100 text-red-700' : task.priority === 'high' ? 'bg-orange-100 text-orange-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CheckCircle2 className="mx-auto h-12 w-12 mb-4" />
                                        <p>No tasks yet. Create your first task from the board.</p>
                                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}>
                                            <CustomButton className="mt-4">Go to Board</CustomButton>
                                        </Link>
                                    </div>
                                )}
                            </FlatCardContent>
                        </FlatCard>
                    </TabsContent>

                    <TabsContent value="members">
                        <FlatCard>
                            <FlatCardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <FlatCardTitle>Members ({projectMembers.length})</FlatCardTitle>
                                        <FlatCardDescription>Manage project members and permissions</FlatCardDescription>
                                    </div>
                                    <CustomButton size="sm" onClick={() => setIsAddMemberOpen(true)}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Member
                                    </CustomButton>
                                </div>
                            </FlatCardHeader>
                            <FlatCardContent>
                                {projectMembers.length > 0 ? (
                                    <div className="divide-y">
                                        {projectMembers.map((member) => (
                                            <div key={member._id} className="flex items-center justify-between py-3 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                                                        {member.userId?.fullName?.[0] || member.userId?.email?.[0] || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{member.userId?.fullName || "N/A"}</p>
                                                        <p className="text-xs text-muted-foreground">{member.userId?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">{member.role?.name || "Member"}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="mx-auto h-12 w-12 mb-4" />
                                        <p>No members yet. Add members to collaborate.</p>
                                    </div>
                                )}
                            </FlatCardContent>
                        </FlatCard>

                        {/* Add Member Dialog */}
                        <CustomDialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                            <CustomDialogContent>
                                <CustomDialogHeader>
                                    <CustomDialogTitle>Add Project Member</CustomDialogTitle>
                                    <CustomDialogDescription>
                                        Enter the workspace member ID to add them to this project.
                                    </CustomDialogDescription>
                                </CustomDialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Member ID</label>
                                        <CustomInput
                                            placeholder="Enter workspace member ID"
                                            value={memberEmail}
                                            onChange={(e) => setMemberEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <CustomDialogFooter>
                                    <CustomButton variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</CustomButton>
                                    <CustomButton onClick={handleAddMember}>Add Member</CustomButton>
                                </CustomDialogFooter>
                            </CustomDialogContent>
                        </CustomDialog>
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
