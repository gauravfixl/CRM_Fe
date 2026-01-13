"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, UserPlus, Settings, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Permission } from "./custom/Permission"

interface ProjectSettingsProps {
  workspaceId: string
  projectId: string
  project: any
}

export function ProjectSettings({ workspaceId, projectId, project }: ProjectSettingsProps) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const router = useRouter()

  const [projectName, setProjectName] = useState(project ? project.name : "")
  const [projectDescription, setProjectDescription] = useState(project ? project.description : "")
  const [visibility, setVisibility] = useState<"public" | "private">(
    project ? (project.visibility ?? "public") : "public",
  )

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          Project not found
        </p>
      </div>
    )
  }

  const handleSaveProject = () => {
    dispatch({
      type: "UPDATE_PROJECT",
      payload: {
        projectId,
        updates: {
          name: projectName,
          description: projectDescription,
          visibility,
        },
      },
    })

    toast({
      title: "Saved",
      description: "Project settings updated successfully",
    })
  }

  const handleDeleteProject = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action is irreversible."
    )

    if (!confirmed) return

    dispatch({ type: "SOFT_DELETE_PROJECT", payload: projectId })

    toast({
      title: "Project deleted",
      description: "The project was moved to trash",
      variant: "destructive",
    })

    setTimeout(() => {
      router.push(`/workspaces/${workspaceId}/dashboard`)
    }, 1500)
  }

  const handleRemoveMember = (memberId: string) => {
    dispatch({
      type: "REMOVE_PROJECT_MEMBER",
      payload: { projectId, memberId },
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground">Manage your project configuration and team access</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General
          </CardTitle>
          <CardDescription>Basic project information and configuration</CardDescription>
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
                    Public &mdash; anyone in workspace can view
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Private &mdash; only invited members can view
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Template</label>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline">{project.template}</Badge>
              <span className="text-sm text-muted-foreground">Project template cannot be changed</span>
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
          <CardDescription>Manage who has access to this project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-3">
            {project.members && project.members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={`${member.name} avatar`} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email ?? "member@example.com"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.role}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Remove member"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
              Deleting a project is irreversible. You can restore it from trash within 30&nbsp;days.
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
