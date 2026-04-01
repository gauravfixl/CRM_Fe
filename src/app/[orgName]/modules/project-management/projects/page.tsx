"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, Calendar, Users, Loader2, FolderKanban } from 'lucide-react'
import {
  getMyWorkspaces,
  type Workspace,
} from "@/modules/project-management/workspace/hooks/workspaceHooks"
import {
  getAllProjectsByWorkspace,
  type Project,
} from "@/modules/project-management/project/hooks/projectHooks"

interface ProjectWithWorkspace extends Project {
  workspaceName?: string
  workspaceId?: string
}

const getStatusColor = (isArchived: boolean) => {
  if (isArchived) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
}

export default function ProjectsPage() {
  const params = useParams() as { orgName?: string }
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<ProjectWithWorkspace[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isFetching, setIsFetching] = useState(true)

  const orgName = params.orgName || localStorage.getItem("orgName") || ""

  useEffect(() => {
    fetchAllProjects()
  }, [])

  const fetchAllProjects = async () => {
    setIsFetching(true)
    try {
      const wsRes = await getMyWorkspaces()
      const wsList: Workspace[] = wsRes?.data?.data?.workspaces || wsRes?.data?.workspaces || wsRes?.data?.data || wsRes?.data || []
      const workspacesArr = Array.isArray(wsList) ? wsList : []
      setWorkspaces(workspacesArr)

      const projectPromises = workspacesArr.map(async (ws) => {
        try {
          const res = await getAllProjectsByWorkspace(ws._id)
          const projectsData: Project[] = res?.data?.data?.projects || res?.data?.projects || res?.data?.data || []
          return (Array.isArray(projectsData) ? projectsData : []).map((p) => ({
            ...p,
            workspaceName: ws.name,
            workspaceId: ws._id,
          }))
        } catch {
          return []
        }
      })

      const results = await Promise.all(projectPromises)
      setProjects(results.flat())
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("Failed to fetch projects:", err)
      }
    } finally {
      setIsFetching(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.workspaceName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => !p.isArchived).length
  const archivedProjects = projects.filter(p => p.isArchived).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track your project portfolio
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Across {workspaces.length} workspaces
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{archivedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Archived projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces.length}</div>
            <p className="text-xs text-muted-foreground">
              Total workspaces
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {searchTerm ? "No projects match your search." : "No projects found. Create a project from a workspace to get started."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                if (project.workspaceId) {
                  router.push(`/${orgName}/modules/workspaces/${project.workspaceId}/projects/${project._id}/board`)
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.isArchived)}>
                    {project.isArchived ? "Archived" : "Active"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        if (project.workspaceId) router.push(`/${orgName}/modules/workspaces/${project.workspaceId}/projects/${project._id}`)
                      }}>View details</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        if (project.workspaceId) router.push(`/${orgName}/modules/workspaces/${project.workspaceId}/projects/${project._id}/board`)
                      }}>Open Board</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        if (project.workspaceId) router.push(`/${orgName}/modules/workspaces/${project.workspaceId}/projects/${project._id}/settings`)
                      }}>Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.visibility || "public"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{project.workspaceName}</span>
                  </div>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {project.createdBy?.fullName?.[0] || project.createdBy?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
