"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  UserPlus,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Permission } from "./custom/Permission"

interface Project {
  id: string
  name: string
  description?: string
  visibility?: "public" | "private"
  template?: string
  members: string[]
}

interface Workspace {
  id: string
  name: string
  members: {
    id: string
    name: string
    email?: string
    role: string
  }[]
}

interface ProjectSettingsDetailsFormProps {
  project: Project
  workspace: Workspace
  projectName: string
  setProjectName: (value: string) => void
  projectDescription: string
  setProjectDescription: (value: string) => void
  visibility: "public" | "private"
  setVisibility: (value: "public" | "private") => void
}

export function ProjectSettingsDetailsForm({
  project,
  workspace,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  visibility,
  setVisibility,
}: ProjectSettingsDetailsFormProps) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const router = useRouter()

  function handleSaveProject() {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: {
        ...project,
        name: projectName,
        description: projectDescription,
        visibility,
      },
    })
    toast({ title: "Project updated successfully" })
  }

  function handleDeleteProject() {
    dispatch({ type: "SOFT_DELETE_PROJECT", payload: project.id })
    toast({ title: "Project moved to trash" })
    router.push(`/workspaces/${workspace.id}`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage your project configuration and team access
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General
          </CardTitle>
          <CardDescription>
            Basic project information and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label htmlFor="project-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Visibility</label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Public — anyone in workspace can view
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Private — only invited members can view
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Template</label>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">
                {project.template || "default"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Project template cannot be changed
              </span>
            </div>
          </div>

          <Button onClick={handleSaveProject}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage who has access to this project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
          <div className="space-y-3">
            {/* Member list rendering can be implemented here if needed */}
          </div>
        </CardContent>
      </Card>

      <Permission module="project" action="DELETE_PROJECT">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Deleting a project is irreversible. You can restore it from trash
              within 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </CardContent>
        </Card>
      </Permission>
    </div>
  )
}
