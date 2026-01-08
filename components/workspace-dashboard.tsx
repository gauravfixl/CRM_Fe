"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { SmallCard, SmallCardContent, SmallCardDescription, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { CustomButton } from "@/components/custom/CustomButton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomProgress } from "@/components/custom/CustomProgress"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger } from "@/components/custom/CustomDialog"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { ProjectCreationDialog } from "@/components/project-creation-dialog"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { TeamTaskPieChart } from "./TeamTaskPieChart"
import { getWorkspaceById, updateWorkspace } from "@/hooks/workspaceHooks"
import { getMyProjects, deleteProject } from "@/hooks/projectHooks"
import { showError, showSuccess } from "@/utils/toast"
import { getAllTeams, createTeam } from "@/hooks/teamHooks"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import CreateTeamCustomDialog from "./create-team-dialog"
import useRolesStore from "@/lib/roleStore"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "./custom/Permission"

interface WorkspaceDashboardProps {
  workspaceId: string
  analytics: AnalyticsData
}

interface AnalyticsData {
  projectsCount: number
  membersCount: number
  activeTasks: number
  completedTasks: number
  totalTeams: number
  workloadPerMember: {
    memberId: string
    name: string
    taskCount: number
  }[]
  teamsPerProject: any[]
  projectWiseTaskDistribution: {
    totalTasks: number
    activeTasks: number
    completedTasks: number
    projectId: string
    projectName: string
  }[]
  teamWiseTaskDistribution: any[]
  tasksPerTeam: any[]
}

export function WorkspaceDashboard({ workspaceId, analytics }: WorkspaceDashboardProps) {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const { toast } = useToast()
  const [isProjectCustomDialogOpen, setIsProjectCustomDialogOpen] = useState(false)
  const [isTeamCustomDialogOpen, setIsTeamCustomDialogOpen] = useState(false)
  const [isEditWorkspaceOpen, setIsEditWorkspaceOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [workspace, setWorkspace] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const { showLoader, hideLoader } = useLoaderStore()
  const setRoles = useRolesStore((state) => state.setRoles);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceDescription, setWorkspaceDescription] = useState("")
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    const fetchData = async () => {
      try {
        showLoader()
        const res = await getWorkspaceById(workspaceId);
        setWorkspace(res.data.workspace);
        setWorkspaceName(res.data.workspace.name || "");
        setWorkspaceDescription(res.data.workspace.description || "");

        const projectRes = await getMyProjects(res.data.workspace._id);
        setProjects(projectRes.data.projects);
      } catch (err) {
        console.error("Error fetching workspace or projects:", err);
      } finally {
        hideLoader()
      }
    };
    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const resp = await getAllRolesNPermissions({ scope: "sc-prj" });
        if (resp?.data?.permissions && resp?.data?.iv) {
          const decrypted = decryptData(resp.data.permissions, resp.data.iv);
          setRoles((prev: any) => ({ ...prev, project: decrypted }));
        }
      } catch (err) {
        console.error("Project roles fetch error:", err);
      }
    };
    fetchRoles();
  }, [setRoles]);

  const projectsCount = analytics?.projectsCount || 0;
  const members = workspace?.members ?? []
  const activeProjects = projects.filter((p) => p.status === "active").length

  const handleProjectClick = (projectId: string) => {
    router.push(`/${orgName}/modules/workspaces/${workspaceId}/projects/${projectId}/board`)
  }

  const handleDeleteProjectConfirmed = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id, workspaceId);
      setProjects(prev => prev.filter(p => p._id !== projectToDelete.id));
      dispatch({ type: "SOFT_DELETE_PROJECT", payload: projectToDelete.id });
      showSuccess("Project deleted successfully");
    } catch (err) {
      console.error("Failed to delete project:", err);
      showError("Could not delete project");
    } finally {
      setProjectToDelete(null);
    }
  };

  const openProjectSettings = (projectId: string) => {
    router.push(`/${orgName}/modules/workspaces/${workspaceId}/projects/${projectId}/settings`)
  }

  const handleUpdateWorkspace = async () => {
    try {
      const response = await updateWorkspace(workspaceId, {
        name: workspaceName,
        description: workspaceDescription,
      });
      const updated = response.workspace;
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { id: workspaceId, updates: { name: updated.name, description: updated.description } },
      });
      setWorkspace((prev: any) => ({ ...prev, ...updated }));
      setIsEditWorkspaceOpen(false);
      showSuccess("Workspace updated successfully");
    } catch (err) {
      console.error("Failed to update workspace:", err);
      showError("Failed to update workspace");
    }
  };

  const handleCreateTeam = useCallback(
    async (formData: { name: string; description: string }, boardType?: string | null) => {
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Team name is required", variant: "destructive" });
        return;
      }
      try {
        const response = await createTeam({
          name: formData.name.trim(),
          description: formData.description,
          useTeamBoard: true,
          templateId: "686b75e45c48532b2a1601be",
          projectId: "",
          workspaceId,
        });
        dispatch({ type: "CREATE_TEAM", payload: response.data });
        toast({ title: "Success", description: "Team created successfully" });
        setIsTeamCustomDialogOpen(false);
      } catch (error) {
        console.error("Failed to create team:", error);
        toast({ title: "Error", description: "Failed to create team", variant: "destructive" });
      }
    },
    [dispatch, toast, workspaceId]
  )

  if (!workspace) return <div>Workspace not found</div>

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">{workspace.name}</h1>
          <Permission module="project" action="EDIT_WORKSPACE">
            <CustomDialog open={isEditWorkspaceOpen} onOpenChange={setIsEditWorkspaceOpen}>
              <CustomDialogTrigger asChild>
                <CustomButton variant="ghost" size="sm" className="p-1"><Pencil className="h-4 w-4" /></CustomButton>
              </CustomDialogTrigger>
              <CustomDialogContent>
                <CustomDialogHeader><CustomDialogTitle>Edit Workspace</CustomDialogTitle></CustomDialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Workspace Name</label>
                    <CustomInput value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} placeholder="Enter workspace name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <CustomTextarea value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)} placeholder="Enter workspace description" rows={3} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <CustomButton variant="outline" onClick={() => setIsEditWorkspaceOpen(false)}>Cancel</CustomButton>
                    <CustomButton onClick={handleUpdateWorkspace}>Save Changes</CustomButton>
                  </div>
                </div>
              </CustomDialogContent>
            </CustomDialog>
          </Permission>
          <p className="text-gray-600 dark:text-muted-foreground">{workspace.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <CustomButton onClick={() => setIsProjectCustomDialogOpen(true)}>New Project</CustomButton>
          <CreateTeamCustomDialog open={isTeamCustomDialogOpen} onOpenChange={setIsTeamCustomDialogOpen} handleCreateTeam={handleCreateTeam} />
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
            <SmallCardTitle className="text-sm font-medium">Total Projects</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-lg font-bold">{projectsCount}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} active</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
            <SmallCardTitle className="text-sm font-medium">Workspace Members</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-lg font-bold">{analytics?.membersCount || 0}</div>
            <p className="text-xs text-muted-foreground">{analytics?.totalTeams || 0} teams</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
            <SmallCardTitle className="text-sm font-medium">Active Tasks</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-lg font-bold">{analytics?.activeTasks || 0}</div>
          </SmallCardContent>
        </SmallCard>

        <SmallCard>
          <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
            <SmallCardTitle className="text-sm font-medium">Completed Tasks</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent>
            <div className="text-lg font-bold">{analytics?.completedTasks || 0}</div>
          </SmallCardContent>
        </SmallCard>
      </div>

      <SmallCard>
        <SmallCardHeader>
          <SmallCardTitle>Team workload</SmallCardTitle>
        </SmallCardHeader>
        <SmallCardContent className="space-y-4">
          {analytics?.workloadPerMember?.map((member) => (
            <div key={member.memberId} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 text-xs">
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name}</span>
                </div>
                <span className="text-sm font-medium">{member.taskCount} tasks</span>
              </div>
            </div>
          ))}
        </SmallCardContent>
      </SmallCard>

      <div className="flex flex-col lg:flex-row gap-4">
        <SmallCard className="w-full">
          <SmallCardHeader>
            <SmallCardTitle>Project Progress</SmallCardTitle>
          </SmallCardHeader>
          <SmallCardContent className="space-y-4">
            {analytics?.projectWiseTaskDistribution?.map((project) => {
              const compPercent = project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;
              const activePercent = project.totalTasks > 0 ? Math.round((project.activeTasks / project.totalTasks) * 100) : 0;
              return (
                <div key={project.projectId}>
                  <p className="text-sm font-medium">{project.projectName}</p>
                  <div className="relative w-full h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div className="absolute h-full bg-blue-600" style={{ width: `${compPercent}%` }}></div>
                    <div className="absolute h-full bg-yellow-400" style={{ width: `${activePercent}%`, left: `${compPercent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{compPercent}% Comp</span>
                    <span>{activePercent}% Active</span>
                  </div>
                </div>
              );
            })}
          </SmallCardContent>
        </SmallCard>
      </div>

      {analytics?.teamWiseTaskDistribution && analytics?.teamWiseTaskDistribution.length > 0 && (
        <TeamTaskPieChart analytics={analytics} />
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects</h2>
          <div className="flex border rounded-lg">
            <CustomButton variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>Grid</CustomButton>
            <CustomButton variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")}>Table</CustomButton>
          </div>
        </div>

        {projectsCount === 0 ? (
          <SmallCard><SmallCardContent className="py-12 text-center text-muted-foreground">No projects yet</SmallCardContent></SmallCard>
        ) : viewMode === "grid" ? (
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <SmallCard key={p._id} className="hover:shadow-md cursor-pointer" onClick={() => handleProjectClick(p._id)}>
                <SmallCardHeader>
                  <div className="flex justify-between">
                    <div><SmallCardTitle>{p.name}</SmallCardTitle><SmallCardDescription>{p.description}</SmallCardDescription></div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><CustomButton variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></CustomButton></DropdownMenuTrigger>
                        <DropdownMenuContent><DropdownMenuItem onClick={() => openProjectSettings(p._id)}>Settings</DropdownMenuItem></DropdownMenuContent>
                      </DropdownMenu>
                      <Permission module="project" action="DELETE_PROJECT">
                        <CustomButton variant="ghost" size="sm" onClick={() => setProjectToDelete({ id: p._id, name: p.name })}><Trash2 className="h-4 w-4 text-red-500" /></CustomButton>
                      </Permission>
                    </div>
                  </div>
                </SmallCardHeader>
              </SmallCard>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50"><tr><th className="px-4 py-2 text-left">Project</th><th className="px-4 py-2 text-left">Actions</th></tr></thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => handleProjectClick(p._id)}>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                      <CustomButton variant="ghost" size="sm" onClick={() => setProjectToDelete({ id: p._id, name: p.name })}><Trash2 className="h-4 w-4 text-red-500" /></CustomButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectCreationDialog workspaceId={workspaceId} open={isProjectCustomDialogOpen} onOpenChange={setIsProjectCustomDialogOpen} />
      <CustomDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Delete Project</CustomDialogTitle></CustomDialogHeader>
          <p>Delete <span className="font-semibold">{projectToDelete?.name}</span>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CustomButton variant="outline" onClick={() => setProjectToDelete(null)}>Cancel</CustomButton>
            <CustomButton variant="destructive" onClick={handleDeleteProjectConfirmed}>Delete</CustomButton>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  )
}
