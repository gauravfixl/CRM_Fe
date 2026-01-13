"use client"

import { useState, useEffect } from "react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { Badge } from "@/components/ui/badge"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle } from "@/components/custom/CustomDialog"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomDropdownMenu, CustomDropdownMenuContent, CustomDropdownMenuItem, CustomDropdownMenuTrigger } from "@/components/custom/CustomDropdownMenu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Trash2, Kanban, Globe, List, FileText, Archive, Code, Maximize2, Share, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProjectBoard } from "./project-board"
import { ProjectSummary } from "./project-summary"
import { TeamManagement } from "./team-management"
import ProjectSettingsPage from "@/app/[orgName]/modules/workspaces/[workspaceId]/projects/[projectId]/settings/page"
import { getAllTeams } from "@/modules/project-management/team/hooks/teamHooks"
import { getAllTasks } from "@/modules/project-management/task/hooks/taskHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "./custom/Permission"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface ProjectBoardProps {
  projectId: string
  workspaceId: string
  project: any
}

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  assignee: string
  status: string
  dueDate?: string
}

interface Column {
  id: string
  name: string
  tasks: Task[]
}

interface Board {
  id: string
  name: string
  columns: Column[]
}

export function ProjectDashBoard({ projectId, workspaceId, project }: ProjectBoardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBoard] = useState("board-1")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const router = useRouter();
  const { showLoader, hideLoader } = useLoaderStore()
  const [orgName, setOrgName] = useState("")
  const [selectedTab, setSelectedTab] = useState<"Board" | "Backlog">("Board")
  const [teams, setTeams] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  // Mock boards data (for initial structure)
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "board-1",
      name: "Board",
      columns: [
        {
          id: "col-1",
          name: "To Do",
          tasks: [],
        }
      ],
    }
  ])

  const boardId = project?.boardId?._id;
  const teamId = "";
  const currentBoard = boards.find((b) => b.id === selectedBoard)

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === selectedBoard
          ? {
            ...board,
            columns: board.columns.map((col) =>
              col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col,
            ),
          }
          : board,
      ),
    )
    setIsTaskDetailOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    if (!projectId) return;
    const fetchTeams = async () => {
      try {
        showLoader()
        const res = await getAllTeams(undefined, projectId);
        setTeams(res.data.teams);
      } catch (err) {
        console.error("Failed to fetch project teams:", err);
      } finally {
        hideLoader()
      }
    };
    fetchTeams();
  }, [projectId]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) return;
      try {
        const response = await getAllTasks(projectId, boardId, teamId);
        setTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [projectId, boardId, teamId]);

  return (
    <div className="flex flex-col p-4 h-[90vh] w-full overflow-hidden">
      <div>
        <div className="flex items-center justify-between p-4 border-b bg-background rounded-lg shadow-sm overflow-hidden" >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold mb-0">{project?.name}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-0">{project?.description}</p>
              <Avatar className="h-8 w-8">
                <AvatarImage src={project?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-white text-sm font-bold">
                  {project?.key}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project?.key}</h1>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {project?.members?.length ?? 0}
                </span>
              </div>
              <CustomButton variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </CustomButton>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-3 justify-end">
            <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
              <Maximize2 className="h-4 w-4" />
            </CustomButton>
            <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
              <Share className="h-4 w-4" />
            </CustomButton>

            <CustomButton
              onClick={() =>
                router.push(`/${orgName}/modules/workspaces/${workspaceId}/projects/${projectId}/allboards`)
              }
            >
              View All Boards
            </CustomButton>

            <div className="relative flex-1 max-w-xs">
              <CustomInput
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </div>

        <Tabs variant="custom" className="overflow-hidden" value={selectedTab} onValueChange={(val) => setSelectedTab(val as any)}>
          <TabsList className="h-10 bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none overflow-x-hidden justify-start p-0">
            <TabsTrigger
              value="Summary"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <Globe className="h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="Board"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <Kanban className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="Teams"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <FileText className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger
              value="all-work"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <Archive className="h-4 w-4" />
              All work
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <Archive className="h-4 w-4" />
              Archived work items
            </TabsTrigger>
            <TabsTrigger
              value="pages"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 gap-2"
            >
              <FileText className="h-4 w-4" />
              Pages
            </TabsTrigger>
            <CustomDropdownMenu>
              <CustomDropdownMenuTrigger asChild>
                <CustomButton variant="ghost" size="sm" className="px-4 py-2 gap-2">
                  More
                  <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded">1</span>
                </CustomButton>
              </CustomDropdownMenuTrigger>
              <CustomDropdownMenuContent>
                <CustomDropdownMenuItem>Teams</CustomDropdownMenuItem>
              </CustomDropdownMenuContent>
            </CustomDropdownMenu>
          </TabsList>

          <Permission module="project" action="VIEW_PROJECT_ACTIVITY">
            <TabsContent value="Summary">
              <ProjectSummary workspaceId={workspaceId} projectId={projectId} />
            </TabsContent>
          </Permission>
          <TabsContent value="Board">
            <ProjectBoard workspaceId={workspaceId} projectId={projectId} project={project} teams={teams} tasks={tasks} setTasks={setTasks} />
          </TabsContent>
          <TabsContent value="Teams">
            <TeamManagement workspaceId={workspaceId} projectId={projectId} teams={teams} setTeams={setTeams} />
          </TabsContent>
          <TabsContent value="Settings">
            <ProjectSettingsPage teams={teams} />
          </TabsContent>
        </Tabs>

        <CustomDialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <CustomDialogContent className="max-w-2xl">
            <CustomDialogHeader>
              <CustomDialogTitle>{selectedTask?.title}</CustomDialogTitle>
            </CustomDialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <CustomLabel>Description</CustomLabel>
                  <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <CustomLabel>Priority</CustomLabel>
                    <Badge className={getPriorityColor(selectedTask.priority)} variant="secondary">
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <CustomLabel>Assignee</CustomLabel>
                    <p className="text-sm">{selectedTask.assignee}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <CustomLabel>Status</CustomLabel>
                    <p className="text-sm">{selectedTask.status}</p>
                  </div>
                  {selectedTask.dueDate && (
                    <div>
                      <CustomLabel>Due Date</CustomLabel>
                      <p className="text-sm">{selectedTask.dueDate}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <CustomButton
                    variant="outline"
                    onClick={() => {
                      const col = currentBoard?.columns.find((c) =>
                        c.tasks.some((t) => t.id === selectedTask.id)
                      )
                      if (col) handleDeleteTask(selectedTask.id, col.id)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </CustomButton>
                  <CustomButton variant="outline">Edit Task</CustomButton>
                </div>
              </div>
            )}
          </CustomDialogContent>
        </CustomDialog>
      </div>
    </div>
  )
}
