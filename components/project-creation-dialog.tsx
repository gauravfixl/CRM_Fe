"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Kanban, GitBranch, Bug, CheckSquare } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { createProject } from "@/hooks/projectHooks"
import type { Project } from "@/types"
import { Permission } from "./custom/Permission"

interface ProjectCreationDialogProps {
  workspaceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated?: (newProject: Project) => void
}

const templates = [
  {
    id: "686b75e45c48532b2a1601be",
    name: "Kanban",
    description: "Visualize work with cards and columns",
    icon: Kanban,
    columns: ["To Do", "In Progress", "Review", "Done"],
    color: "bg-blue-500",
  },
  {
    id: "scrum",
    name: "Scrum",
    description: "Agile development with sprints",
    icon: GitBranch,
    columns: ["Backlog", "Sprint", "In Progress", "Review", "Done"],
    color: "bg-green-500",
  },
  {
    id: "bug-tracking",
    name: "Bug Tracking",
    description: "Track and resolve issues",
    icon: Bug,
    columns: ["Reported", "Investigating", "In Progress", "Testing", "Resolved"],
    color: "bg-red-500",
  },
  {
    id: "todo",
    name: "To-Do",
    description: "Simple task management",
    icon: CheckSquare,
    columns: ["To Do", "Doing", "Done"],
    color: "bg-purple-500",
  },
]

export function ProjectCreationDialog({ workspaceId, open, onOpenChange }: ProjectCreationDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<"template" | "details">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [projectNameError, setProjectNameError] = useState(false);
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setStep("details")
  }

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setProjectNameError(true)
      return
    }
    setProjectNameError(false)
    const template = templates.find((t) => t.id === selectedTemplate)
    if (!template) return

    const formData = {
      name: projectName,
      templateId: template.id,
      description: projectDescription,
      visibility,
    }

    try {
      const res = await createProject(formData, workspaceId)
      if (res?.data.project._id) {
        const projectId = res.data.project?._id
        router.push(`/${orgName}/modules/workspaces/${workspaceId}/projects/${projectId}/board`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const selectedTemplateData = templates.find((t) => t.id === selectedTemplate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === "template" ? "Choose a Template" : "Create Project"}</DialogTitle>
        </DialogHeader>

        {step === "template" ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">Select a template to get started with your project structure</p>
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => {
                const Icon = template.icon
                const isDisabled = template.name.toLowerCase() !== "kanban"
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md hover:scale-105 
                      ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                    onClick={() => {
                      if (!isDisabled) handleTemplateSelect(template.id)
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${template.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Columns:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.columns.map((column) => (
                              <Badge key={column} variant="outline" className="text-xs">
                                {column}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (e.target.value.trim()) setProjectNameError(false);
                  }}
                  className={projectNameError ? "border-red-500" : ""}
                />
                {projectNameError && (
                  <p className="text-red-500 text-xs mt-1">Project name is required</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Visibility</label>
                <Select value={visibility} onValueChange={(value: "public" | "private") => setVisibility(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone in workspace can view</SelectItem>
                    <SelectItem value="private">Private - Only invited members can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("template")}>
                  Back
                </Button>
                <Permission module="project" action="CREATE_PROJECT">
                  <Button type="button" onClick={handleCreateProject}>Create Project</Button>
                </Permission>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Preview</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {selectedTemplateData && (
                          <div className={`p-2 rounded-lg ${selectedTemplateData.color} text-white`}>
                            <selectedTemplateData.icon className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{projectName || "Project Name"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {projectDescription || "Project description will appear here"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Template: {selectedTemplateData?.name}</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedTemplateData?.columns.map((column) => (
                            <Badge key={column} variant="outline" className="text-xs">
                              {column}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={visibility === "public" ? "default" : "secondary"}>{visibility}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
