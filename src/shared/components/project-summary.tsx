"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { ProjectCreationDialog } from "@/components/project-creation-dialog"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import TaskPieChart from "./ui/task-piechart"
import { getProjectAnalytics } from "@/modules/project-management/project/hooks/projectHooks"
import { useLoaderStore } from "@/lib/loaderStore"

interface WorkspaceDashboardProps {
  workspaceId: string
  projectId: string
}

export function ProjectSummary({ workspaceId, projectId }: WorkspaceDashboardProps) {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null);
  const { showLoader, hideLoader } = useLoaderStore()

  useEffect(() => {
    if (!projectId) return;

    const fetchAnalytics = async () => {
      try {
        showLoader()
        const res = await getProjectAnalytics(projectId);
        setAnalytics(res.data.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        hideLoader()
      }
    };

    fetchAnalytics();
  }, [projectId]);

  const workspace = state.workspaces.find((w) => w.id === workspaceId)
  const projects = state.projects.filter((p) => p.workspaceId === workspaceId && !p.isDeleted)
  const teams = state.teams.filter((team) => {
    const project = state.projects.find((p) => p.id === team.projectId)
    return project?.workspaceId === workspaceId
  })

  const activeProjects = projects.filter((p) => p.status === "active").length

  const taskStatusColorMap: Record<string, string> = {
    todo: "#1F60C4",
    In_progress: "#C167F6",
    done: "#28A745",
    blocked: "#FFC107",
    review: "#00B8D9",
    default: "#8884d8",
  };

  const pieChartData = useMemo(() => {
    if (!analytics?.tasksPerState) return [];
    return analytics.tasksPerState.map((item: any) => ({
      name: item.state
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      value: item.taskCount,
      color: taskStatusColorMap[item.state] || taskStatusColorMap.default,
    }));
  }, [analytics]);

  return (
    <div className="space-y-6 h-[60vh] overflow-y-auto hide-scrollbar">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <SmallCardTitle className="text-sm font-medium">Total Tasks</SmallCardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-2xl font-bold">{analytics?.totalTasks}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} active</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <SmallCardTitle className="text-sm font-medium">Overdue Tasks</SmallCardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-2xl font-bold">{analytics?.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">{teams.length} teams</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <SmallCardTitle className="text-sm font-medium">Pending Tasks</SmallCardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.67 0 3.21.46 4.55 1.26" />
            </svg>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-2xl font-bold">{analytics?.pendingTasks}</div>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <SmallCardTitle className="text-sm font-medium">Completed Tasks</SmallCardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.67 0 3.21.46 4.55 1.26" />
            </svg>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-2xl font-bold">{analytics?.completedTasks}</div>
          </SmallCardContent>
        </SmallCard>
      </div>

      <TaskPieChart
        data={pieChartData}
        total={analytics?.totalTasks || 0}
      />

      <ProjectCreationDialog
        workspaceId={workspaceId}
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
      />
    </div>
  )
}
