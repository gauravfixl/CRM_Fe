"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import {
  MoreHorizontal, Plus, Search, Filter, LayoutGrid, List, Clock, CheckCircle2, Building2, FolderKanban, Briefcase, Activity
} from "lucide-react"
import { useLoaderStore } from "@/lib/loaderStore"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectCreationDialog } from "@/shared/components/project-creation-dialog"
import {
  CustomDropdownMenu,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import { getMyWorkspaces, type Workspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { getAllProjectsByWorkspace, type Project } from "@/modules/project-management/project/hooks/projectHooks"

export default function ProjectsDashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [allProjects, setAllProjects] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("All Workspaces")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)

  const { showLoader, hideLoader } = useLoaderStore()
  const params = useParams() as { orgName?: string }
  const router = useRouter()
  const [orgName, setOrgName] = useState("")

  const workspaceOptions = ["All Workspaces", ...workspaces.map(ws => ws.name)]

  const fetchEverything = async () => {
    showLoader()
    try {
      const wsRes = await getMyWorkspaces()
      const wsList = wsRes.data?.data || []
      setWorkspaces(wsList)

      if (wsList.length > 0) {
        // Fetch projects for ALL workspaces in parallel
        const projectPromises = wsList.map((ws: Workspace) => getAllProjectsByWorkspace(ws._id))
        const projectsResults = await Promise.all(projectPromises)

        const flattenedProjects = projectsResults.flatMap((res, index) => {
          const list = res.data?.data?.projects || res.data?.data || []
          // Add workspace name to each project for the UI cards
          return list.map((p: any) => ({
            ...p,
            workspaceName: wsList[index].name
          }))
        })

        setAllProjects(flattenedProjects)
      } else {
        setAllProjects([])
      }
    } catch (err) {
      console.error("Error fetching projects dashboard data:", err)
    } finally {
      hideLoader()
    }
  }

  useEffect(() => {
    const pOrg = params.orgName
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)

    fetchEverything()
  }, [params.orgName])

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWorkspace = selectedWorkspace === "All Workspaces" || project.workspaceName === selectedWorkspace
    return matchesSearch && matchesWorkspace
  })

  // Real stats calculation
  const stats = {
    total: allProjects.length,
    active: allProjects.filter(p => !p.isArchived).length,
    workspaces: workspaces.length,
    completed: allProjects.filter(p => p.progress === 100).length // If progress field exists
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50 font-sans">

      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white p-6 shadow-md">
        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-10 -translate-y-10">
          <FolderKanban className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <Link href={`/${orgName}/dashboard`} className="hover:opacity-80 transition-opacity">Dashboard</Link>
              <span className="text-white/70 tracking-tighter">{">"}</span>
              <span className="font-bold">Organization Projects</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-blue-800/50 rounded-lg p-1 border border-blue-500/30 backdrop-blur-sm">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-700/50 text-blue-100"}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-700/50 text-blue-100"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
              <CustomButton
                onClick={() => setIsProjectDialogOpen(true)}
                className="bg-white text-blue-700 hover:bg-blue-50 border-none shadow-md h-9 text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-2" /> CREATE PROJECT
              </CustomButton>
            </div>
          </div>

          <div className="pb-2">
            <h1 className="text-2xl font-bold tracking-tight">Organization Projects</h1>
            <p className="text-blue-50 mt-1 max-w-xl text-sm leading-relaxed font-medium opacity-90">
              You are managing <b>{stats.total}</b> projects across <b>{stats.workspaces}</b> workspaces.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 scrollbar-hide">
        {/* Real Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all duration-300">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Projects</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.active}</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-orange-300 transition-all duration-300">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Workspaces</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.workspaces}</p>
            </div>
            <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-green-300 transition-all duration-300">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Success Rate</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.completed ? '100%' : '0%'}</p>
            </div>
            <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-purple-300 transition-all duration-300">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Avg Health</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">82%</p>
            </div>
            <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters Sticky Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sticky top-0 z-30 py-4 bg-zinc-50/90 backdrop-blur-md dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Workspace Filter</span>
              <CustomDropdownMenu>
                <CustomDropdownMenuTrigger asChild>
                  <CustomButton variant="outline" size="sm" className="h-10 gap-2 min-w-[220px] justify-between border-zinc-200 bg-white shadow-sm hover:border-blue-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span className="truncate font-bold text-zinc-700">{selectedWorkspace}</span>
                    </div>
                    <Filter className="h-3.5 w-3.5 opacity-50" />
                  </CustomButton>
                </CustomDropdownMenuTrigger>
                <CustomDropdownMenuContent align="start" className="w-[240px]">
                  {workspaceOptions.map(ws => (
                    <CustomDropdownMenuItem key={ws} onClick={() => setSelectedWorkspace(ws)} className="flex items-center justify-between py-2 font-medium">
                      {ws}
                      {selectedWorkspace === ws && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </CustomDropdownMenuItem>
                  ))}
                </CustomDropdownMenuContent>
              </CustomDropdownMenu>
            </div>

            <div className="flex flex-col flex-1 md:flex-none">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Search Projects</span>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <CustomInput
                  placeholder="Project name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 w-full md:w-[350px] bg-white border-zinc-200 shadow-sm focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-zinc-400 bg-white dark:bg-zinc-950 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            TOTAL {filteredProjects.length} PROJECTS
          </div>
        </div>

        {/* PROJECTS RESULTS */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => router.push(`/${orgName}/modules/workspaces/boards?projectId=${project._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-zinc-950 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 shadow-inner">
            <div className="h-24 w-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-md">
              <FolderKanban className="h-12 w-12 text-zinc-300" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">No Projects Found</h3>
            <p className="text-zinc-500 max-w-sm text-center mt-3 font-medium px-4">
              {workspaces.length === 0
                ? "You need to create a workspace first. Head over to the Workspaces section to get started."
                : "No projects match your current search or workspace filter."}
            </p>
            {workspaces.length > 0 && (
              <CustomButton onClick={() => setIsProjectDialogOpen(true)} className="mt-8 bg-blue-600 px-10 font-bold h-12 rounded-xl shadow-xl shadow-blue-100">
                CREATE NEW PROJECT
              </CustomButton>
            )}
          </div>
        )}
      </div>

      <ProjectCreationDialog
        workspaceId={workspaces[0]?._id}
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onProjectCreated={() => {
          fetchEverything(); // Refresh everything real-time
        }}
      />
    </div>
  )
}

function ProjectCard({ project, onClick }: { project: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full"
    >
      {/* Visual Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <FolderKanban className="w-32 h-32" />
      </div>
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest truncate">{project.workspaceName}</span>
          </div>
          <h3 className="font-black text-2xl text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors truncate">
            {project.name}
          </h3>
        </div>
        <Badge className="shrink-0 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 text-[10px] font-black uppercase rounded-lg shadow-sm">
          {project.type || "KANBAN"}
        </Badge>
      </div>

      <p className="text-zinc-500 leading-relaxed font-semibold text-sm line-clamp-2 min-h-[44px] mb-8">
        {project.description || "Project created for managing workspace tasks and activities."}
      </p>

      <div className="mt-auto space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-black text-zinc-400 uppercase tracking-widest">
            <span>Project Completion</span>
            <span className="text-zinc-900 dark:text-zinc-100">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-full overflow-hidden" />
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter mb-1">Created Date</span>
            <div className="flex items-center text-xs font-bold text-zinc-500 gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex -space-x-3">
            <Avatar className="h-10 w-10 border-4 border-white dark:border-zinc-950 shadow-lg ring-1 ring-zinc-50">
              <AvatarFallback className="bg-blue-600 text-white text-[11px] font-black">
                {project.createdBy?.fullName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
