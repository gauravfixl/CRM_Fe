"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { useLoaderStore } from "@/lib/loaderStore"
import { getWorkspaceById, getWorkspaceAnalytics, type Workspace, type WorkspaceAnalytics } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { getAllProjectsByWorkspace, type Project } from "@/modules/project-management/project/hooks/projectHooks"
import { FolderKanban, Users, Clock, CheckCircle2, Settings, Plus, AlertCircle, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCreationDialog } from "@/shared/components/project-creation-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function WorkspaceDetailsPage() {
    const params = useParams() as { orgName: string, workspaceId: string }
    const router = useRouter()

    const [workspace, setWorkspace] = useState<Workspace | null>(null)
    const [analytics, setAnalytics] = useState<WorkspaceAnalytics | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("projects")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchWorkspaceData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // Step 1: Mandatory Workspace Info
            const wsRes = await getWorkspaceById(params.workspaceId)

            // Be very robust with data extraction as seen in settings page
            const wsData = wsRes?.data?.workspace || wsRes?.data?.data || wsRes?.data

            if (!wsData || Object.keys(wsData).length === 0) {
                throw new Error("Workspace not found")
            }
            setWorkspace(wsData)

            // Step 2: Try fetching optional data (Analytics & Projects)
            try {
                const [analyticsRes, projectsRes] = await Promise.allSettled([
                    getWorkspaceAnalytics(params.workspaceId),
                    getAllProjectsByWorkspace(params.workspaceId)
                ])

                if (analyticsRes.status === 'fulfilled') {
                    const analyticalData = analyticsRes.value.data?.analytics || analyticsRes.value.data?.data || analyticsRes.value.data
                    setAnalytics(analyticalData)
                }

                if (projectsRes.status === 'fulfilled') {
                    const projectRaw = projectsRes.value.data?.projects || projectsRes.value.data?.data || projectsRes.value.data
                    const projectsList = Array.isArray(projectRaw) ? projectRaw : projectRaw?.projects || []
                    setProjects(Array.isArray(projectsList) ? projectsList : [])
                }
            } catch (secondaryErr) {
                console.warn("Secondary data fetch failed:", secondaryErr)
            }

        } catch (err: any) {
            console.error("Error fetching workspace details:", err)
            setError(err.response?.data?.message || err.message || "Failed to load workspace")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (params.workspaceId) {
            fetchWorkspaceData()
        }
    }, [params.workspaceId])

    const orgName = params.orgName

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="font-bold text-sm tracking-widest uppercase animate-pulse">Loading Workspace...</p>
            </div>
        )
    }

    if (error || !workspace) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-6 p-6">
                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center shadow-inner">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-zinc-900 mb-2">Workspace Unavailable</h2>
                    <p className="text-zinc-500 font-medium max-w-sm">{error || "The workspace you are looking for does not exist or you don't have access."}</p>
                </div>
                <Link href={`/${orgName}/modules/workspaces/manage`}>
                    <CustomButton variant="outline" className="px-8 font-bold border-2">Return to Workspaces</CustomButton>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
            {/* Premium Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white p-6 shadow-md font-sans">
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
                    <FolderKanban className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Link href={`/${orgName}/dashboard`} className="text-white hover:opacity-80 transition-opacity">Dashboard</Link>
                            <span className="text-white/50">{">"}</span>
                            <Link href={`/${orgName}/modules/workspaces/manage`} className="text-white hover:opacity-80 transition-opacity">Workspaces</Link>
                            <span className="text-white/50">{">"}</span>
                            <span className="text-white font-bold">{workspace.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/settings`}>
                                <CustomButton variant="ghost" className="text-blue-100 hover:text-white hover:bg-white/10 h-9 font-bold text-xs uppercase tracking-wider">
                                    <Settings className="w-4 h-4 mr-2" /> Settings
                                </CustomButton>
                            </Link>
                            <CustomButton
                                onClick={() => setIsProjectDialogOpen(true)}
                                className="bg-white text-blue-700 hover:bg-blue-50 border-none shadow-md h-9 text-xs font-bold tracking-widest px-6"
                            >
                                <Plus className="w-4 h-4 mr-2" /> NEW PROJECT
                            </CustomButton>
                        </div>
                    </div>

                    <div className="pb-2">
                        <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
                        <p className="text-blue-50 mt-1 max-w-xl text-sm leading-relaxed font-medium opacity-90">
                            {workspace.description || "Manage your workspace projects, members, and settings from this dashboard."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 font-sans scrollbar-hide">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300">
                        <div>
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Projects</p>
                            <p className="text-3xl font-black text-zinc-900 group-hover:text-blue-600 transition-colors">{projects.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-orange-400 hover:shadow-xl hover:shadow-orange-50/50 transition-all duration-300">
                        <div>
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Members</p>
                            <p className="text-3xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors">{analytics?.totalMembers || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-50 dark:bg-orange-900/10 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-green-400 hover:shadow-xl hover:shadow-green-50/50 transition-all duration-300">
                        <div>
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Tasks</p>
                            <p className="text-3xl font-black text-zinc-900 group-hover:text-green-600 transition-colors">{analytics?.activeTasks || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-purple-400 hover:shadow-xl hover:shadow-purple-50/50 transition-all duration-300">
                        <div>
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Completed</p>
                            <p className="text-3xl font-black text-zinc-900 group-hover:text-purple-600 transition-colors">{analytics?.completedTasks || 0}</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/10 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 w-full justify-start rounded-none h-auto p-0 mb-8 gap-10 text-[11px] font-black tracking-widest">
                        <TabsTrigger value="projects" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-4 px-1 text-zinc-400 uppercase">
                            PROJECTS
                        </TabsTrigger>
                        <TabsTrigger value="overview" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-4 px-1 text-zinc-400 uppercase">
                            OVERVIEW
                        </TabsTrigger>
                        <TabsTrigger value="members" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-4 px-1 text-zinc-400 uppercase">
                            MEMBERS
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none pb-4 px-1 text-zinc-400 uppercase">
                            ANALYTICS
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project?._id || project?.id}
                                        project={project}
                                        onClick={() => router.push(`/${orgName}/modules/workspaces/boards?projectId=${project?._id || project?.id}`)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-zinc-950 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 shadow-inner">
                                <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-md">
                                    <FolderKanban className="h-10 w-10 text-zinc-300" />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Workspace Empty</h3>
                                <p className="text-zinc-500 max-w-sm text-center mt-3 font-semibold leading-relaxed">
                                    No projects found in this workspace. Let's create one to get started with your tasks.
                                </p>
                                <CustomButton
                                    onClick={() => setIsProjectDialogOpen(true)}
                                    className="mt-10 bg-blue-600 text-white font-black px-10 shadow-2xl shadow-blue-200 h-14 rounded-2xl hover:scale-105 transition-transform"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> CREATE NEW PROJECT
                                </CustomButton>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="overview">
                        <div className="p-20 text-center text-zinc-400 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm font-bold italic text-lg">
                            Activity stream and workspace summary coming soon.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <ProjectCreationDialog
                workspaceId={params.workspaceId}
                open={isProjectDialogOpen}
                onOpenChange={setIsProjectDialogOpen}
                onProjectCreated={() => {
                    fetchWorkspaceData(); // Refresh list on success
                }}
            />
        </div>
    )
}

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden relative flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-6">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none px-3 py-1 text-[10px] font-black uppercase rounded-lg shadow-sm">
                    {project?.type || "KANBAN"}
                </Badge>
                <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
            </div>

            <h3 className="font-black text-2xl text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors mb-3 truncate">
                {project?.name || "Untitled Project"}
            </h3>
            <p className="text-sm text-zinc-500 line-clamp-2 min-h-[44px] mb-8 font-bold leading-relaxed">
                {project?.description || "A new project created for managing workspace tasks and activities efficiently."}
            </p>

            <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter mb-1">DATE CREATED</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <Clock className="w-4 h-4 text-zinc-200" />
                        <span>{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Today"}</span>
                    </div>
                </div>
                <Avatar className="h-10 w-10 border-4 border-white dark:border-zinc-950 shadow-xl ring-1 ring-blue-50">
                    <AvatarFallback className="text-[11px] bg-blue-600 text-white font-black uppercase">
                        {project?.createdBy?.fullName?.[0] || project?.createdBy?.email?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
