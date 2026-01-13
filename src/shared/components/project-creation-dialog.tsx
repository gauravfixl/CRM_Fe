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
import { Kanban, GitBranch, Bug, Layout, Building2 } from "lucide-react"

import { createProject, type Project } from "@/modules/project-management/project/hooks/projectHooks"
import { listTemplates, type ProjectTemplate } from "@/modules/project-management/template/hooks/templateHooks"
import { getMyWorkspaces, type Workspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { Permission } from "./custom/Permission"

interface ProjectCreationDialogProps {
  workspaceId?: string // Optional: if provided, we default to this workspace
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated?: (newProject: Project) => void
}

const defaultTemplates = [
  {
    id: "kanban",
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
]

export function ProjectCreationDialog({ workspaceId: propWorkspaceId, open, onOpenChange, onProjectCreated }: ProjectCreationDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<"template" | "details">("template")
  const [dbTemplates, setDbTemplates] = useState<ProjectTemplate[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(propWorkspaceId || "")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  const [projectNameError, setProjectNameError] = useState(false)
  const [workspaceError, setWorkspaceError] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data on open
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const [templateRes, workspaceRes] = await Promise.all([
            listTemplates(),
            getMyWorkspaces()
          ])
          setDbTemplates(templateRes.data.templates || [])
          const wsList = workspaceRes.data?.data || workspaceRes.data?.workspaces || []
          setWorkspaces(wsList)

          // If no workspace selected yet and we have list, pick pehla wala
          if (!selectedWorkspace && wsList.length > 0) {
            setSelectedWorkspace(wsList[0]._id)
          }
        } catch (err) {
          console.error("Failed to fetch initial dialog data:", err)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
      setStep("template")
      setSelectedTemplate("")
      setProjectName("")
      setProjectDescription("")
      setVisibility("public")
      setProjectNameError(false)
      setWorkspaceError(false)
    }
  }, [open])

  // Reset selected workspace if prop changes
  useEffect(() => {
    if (propWorkspaceId) {
      setSelectedWorkspace(propWorkspaceId)
    }
  }, [propWorkspaceId])

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setStep("details")
  }

  const handleCreateProject = async () => {
    let hasError = false
    if (!projectName.trim()) {
      setProjectNameError(true)
      hasError = true
    } else {
      setProjectNameError(false)
    }

    if (!selectedWorkspace) {
      setWorkspaceError(true)
      hasError = true
    } else {
      setWorkspaceError(false)
    }

    if (hasError) return

    setIsLoading(true)
    const formData = {
      name: projectName,
      templateId: selectedTemplate,
      description: projectDescription,
      visibility,
    }

    try {
      const res = await createProject(selectedWorkspace, formData)
      const newProject = res?.data?.project || res?.data?.data

      if (newProject?._id) {
        if (onProjectCreated) {
          onProjectCreated(newProject)
        } else {
          router.push(`/${orgName}/modules/workspaces/boards?projectId=${newProject._id}`)
        }
        onOpenChange(false)
      }
    } catch (err) {
      console.error("Error creating project:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const allTemplates = [
    ...dbTemplates.map((t: ProjectTemplate) => ({
      id: t._id,
      name: t.name,
      description: t.description || "Project template",
      icon: Layout,
      columns: t.defaultColumns?.map((c: any) => c.name) || ["To Do", "Done"],
      color: "bg-slate-500",
    })),
    ...defaultTemplates
  ]

  const selectedTemplateData = allTemplates.find((t) => t.id === selectedTemplate)
  const currentWorkspaceName = workspaces.find(w => w._id === selectedWorkspace)?.name || "Select Workspace"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-sans p-0">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Layout className="w-5 h-5" />
              </div>
              {step === "template" ? "Choose Project Blueprint" : "Project Particulars"}
            </DialogTitle>
          </DialogHeader>

          {step === "template" ? (
            <div className="space-y-6">
              <p className="text-zinc-500 font-medium">Select a methodology to get started with your project structure.</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allTemplates.map((template) => {
                  const Icon = template.icon
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all hover:ring-2 hover:ring-blue-500 hover:shadow-xl group"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${template.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-zinc-900">{template.name}</h3>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed">{template.description}</p>
                          <div className="pt-2">
                            <div className="flex flex-wrap gap-1">
                              {template.columns.slice(0, 3).map((column: string) => (
                                <Badge key={column} variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-zinc-100 text-zinc-500">
                                  {column}
                                </Badge>
                              ))}
                              {template.columns.length > 3 && <Badge variant="secondary" className="text-[9px] font-black bg-zinc-100 text-zinc-500">+{template.columns.length - 3}</Badge>}
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                {/* WORKSPACE SELECTION - NEW ADDITION */}
                <div>
                  <label className="block mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                    Target Workspace <span className="text-red-500">*</span>
                  </label>
                  <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                    <SelectTrigger className={`h-11 ${workspaceError ? "border-red-500 bg-red-50/20" : "bg-white border-zinc-200"}`}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <SelectValue placeholder="Select a workspace" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {workspaces.map(ws => (
                        <SelectItem key={ws._id} value={ws._id}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{ws.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {workspaceError && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Please select a workspace</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Q1 Marketing Campaign"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (e.target.value.trim()) setProjectNameError(false);
                    }}
                    className={`h-11 ${projectNameError ? "border-red-500 bg-red-50/20" : "bg-white border-zinc-200"}`}
                  />
                  {projectNameError && (
                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Project name is required</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">Description</label>
                  <Textarea
                    placeholder="What is this project about?"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="min-h-[100px] bg-white border-zinc-200"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">Visibility</label>
                  <Select value={visibility} onValueChange={(value: "public" | "private") => setVisibility(value)}>
                    <SelectTrigger className="h-11 bg-white border-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex flex-col">
                          <span className="font-bold">Public</span>
                          <span className="text-[10px] text-zinc-500">Anyone in workspace can view</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex flex-col">
                          <span className="font-bold">Private</span>
                          <span className="text-[10px] text-zinc-500">Only invited members can view</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                  <Button variant="ghost" onClick={() => setStep("template")} className="font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-600">
                    Back to Templates
                  </Button>
                  <Permission module="project" action="CREATE_PROJECT">
                    <Button
                      disabled={isLoading}
                      type="button"
                      onClick={handleCreateProject}
                      className="bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-8 shadow-lg shadow-blue-100 rounded-xl h-11"
                    >
                      {isLoading ? "Creating..." : "Launch Project"}
                    </Button>
                  </Permission>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="sticky top-0">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Project Preview</h3>
                  <div className="bg-zinc-50 rounded-[2rem] border border-zinc-100 p-8 shadow-inner">
                    <div className="space-y-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                          <Badge variant="secondary" className="bg-blue-600 text-white border-none px-3 py-1 text-[10px] font-black uppercase rounded-lg">
                            {selectedTemplateData?.name || "KANBAN"}
                          </Badge>
                          <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <Building2 className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{currentWorkspaceName}</span>
                          </div>
                          <h4 className="font-black text-2xl text-zinc-900 break-words line-clamp-2">
                            {projectName || "Untitled Project"}
                          </h4>
                          <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">
                            {projectDescription || "No description provided yet."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-dashed border-zinc-200">
                        <div className="flex flex-wrap gap-1">
                          {selectedTemplateData?.columns.map((column: string) => (
                            <Badge key={column} variant="outline" className="text-[9px] font-bold text-zinc-400 border-zinc-200">
                              {column}
                            </Badge>
                          ))}
                        </div>
                        <Badge className={`${visibility === "public" ? "bg-zinc-900" : "bg-orange-600"} text-white text-[9px] font-black uppercase border-none`}>
                          {visibility}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
