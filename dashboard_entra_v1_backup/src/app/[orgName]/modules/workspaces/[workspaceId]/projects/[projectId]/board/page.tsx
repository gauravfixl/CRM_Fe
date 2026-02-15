"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectById, type Project } from "@/modules/project-management/project/hooks/projectHooks"
import { getTasksByBoardColumn, type Task } from "@/modules/project-management/task/hooks/taskHooks"
import { ArrowLeft, Kanban } from "lucide-react"
import { ProjectBoard } from "@/shared/components/project-board"

export default function BoardPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [teams, setTeams] = useState<any[]>([])

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
    const fetchPageData = async () => {
      try {
        showLoader()

        // Fetch project to get boardId
        const projectRes = await getProjectById(params.projectId, params.workspaceId)
        const projectData = projectRes?.data?.data || projectRes?.data?.project
        setProject(projectData)

        // Fetch tasks if needed or let ProjectBoard handle it
        // ProjectBoard uses getTasksByColumn(boardId) internally

        // Fetch teams for assignment
        // Using dynamic import to avoid potential circular deps if any
        const teamHooks = await import("@/modules/project-management/team/hooks/teamHooks")
        const teamsRes = await teamHooks.getTeamsByWorkspace({ workspaceId: params.workspaceId })
        setTeams(teamsRes?.data?.teams || [])

      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error("Failed to fetch board data:", err)
        }
      } finally {
        hideLoader()
      }
    }

    if (params.projectId && params.workspaceId) {
      fetchPageData()
    }
  }, [params.projectId, params.workspaceId, showLoader, hideLoader])

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground animate-pulse">Loading board configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SubHeader
        title={`${project.name} Board`}
        breadcrumbItems={[
          { label: "Dashboard", href: `/${orgName}/dashboard` },
          { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
          { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
          { label: project.name, href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}` },
          { label: "Board", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board` },
        ]}
        rightControls={
          <div className="flex space-x-2">
            <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}`}>
              <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                <ArrowLeft className="w-4 h-4" /> Project Details
              </CustomButton>
            </Link>
          </div>
        }
      />

      <div className="bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-120px)]">
        <ProjectBoard
          projectId={params.projectId}
          workspaceId={params.workspaceId}
          project={project}
          teams={teams}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
    </>
  )
}
