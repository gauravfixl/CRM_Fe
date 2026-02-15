"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  Trello
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function ProjectsListPage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Form State
  const [newProject, setNewProject] = useState({
    name: "",
    workspaceId: "",
    templateId: "",
    description: ""
  })

  // Mock Data
  const [projects, setProjects] = useState([
    { id: "1", name: "Website Redesign", workspace: "Marketing", template: "Kanban", status: "IN_PROGRESS", tasks: 24, completed: 12, members: 5, dueDate: "2024-03-15" },
    { id: "2", name: "Q1 Campaign", workspace: "Marketing", template: "Scrum", status: "PLANNING", tasks: 10, completed: 0, members: 3, dueDate: "2024-02-28" },
    { id: "3", name: "Backend Migration", workspace: "Engineering", template: "Scrum", status: "IN_PROGRESS", tasks: 156, completed: 89, members: 12, dueDate: "2024-06-30" },
    { id: "4", name: "Mobile App Beta", workspace: "Engineering", template: "Bug Tracker", status: "REVIEW", tasks: 45, completed: 42, members: 8, dueDate: "2024-01-20" },
  ])

  const handleAction = (msg: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success(msg)
    }, 800)
  }

  const createProject = () => {
    if (!newProject.name || !newProject.workspaceId || !newProject.templateId) {
      return toast.error("Please fill in all required fields")
    }

    setIsLoading(true)
    setTimeout(() => {
      const workspaceName = newProject.workspaceId === "1" ? "Engineering" : "Marketing"
      const templateName = newProject.templateId === "1" ? "Kanban" : newProject.templateId === "2" ? "Scrum" : "Bug Tracker"

      const p = {
        id: Date.now().toString(),
        name: newProject.name,
        workspace: workspaceName,
        template: templateName,
        status: "PLANNING",
        tasks: 0,
        completed: 0,
        members: 1,
        dueDate: "TBD"
      }
      setProjects([...projects, p])
      setIsLoading(false)
      setIsCreateOpen(false)
      setNewProject({ name: "", workspaceId: "", templateId: "", description: "" })
      toast.success("Project initialized successfully")
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
          <span>PROJECTS</span>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">ALL PROJECTS</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Project Portfolio</h1>
            <p className="text-xs text-zinc-500 font-medium">Track progress across all active workspaces and initiatives.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                  <Plus className="w-3.5 h-3.5 mr-2" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Initialize New Project</DialogTitle>
                  <DialogDescription>
                    Select a workspace and template to generate the project board and workflow structure.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-zinc-500">Target Workspace</Label>
                    <Select
                      value={newProject.workspaceId}
                      onValueChange={(v) => setNewProject({ ...newProject, workspaceId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workspace..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Engineering</SelectItem>
                        <SelectItem value="2">Marketing</SelectItem>
                        <SelectItem value="3">Client Projects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-zinc-500">Project Template</Label>
                    <Select
                      value={newProject.templateId}
                      onValueChange={(v) => setNewProject({ ...newProject, templateId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blueprint..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Standard Kanban</SelectItem>
                        <SelectItem value="2">Agile Scrum (Sprints)</SelectItem>
                        <SelectItem value="3">Bug Tracking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-zinc-500">Project Name</Label>
                    <Input
                      placeholder="e.g. Q3 Roadmap"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-zinc-500">Description</Label>
                    <Input
                      placeholder="Key objectives..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createProject} disabled={isLoading}>
                    {isLoading ? "Provisioning..." : "Launch Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Projects</p>
            <FolderKanban className="w-4 h-4 text-white" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-white drop-shadow-md">{projects.length}</p>
            <p className="text-[10px] text-white">Across 3 workspaces</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Tasks</p>
            <ListTodo className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">235</p>
            <p className="text-[10px] text-zinc-400">Open items</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Avg. Progress</p>
            <LayoutDashboard className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">64%</p>
            <p className="text-[10px] text-zinc-400">On schedule</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Critical Issues</p>
            <Clock className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">12</p>
            <p className="text-[10px] text-zinc-400">Blocking release</p>
          </SmallCardContent>
        </SmallCard>
      </div>

      {/* PROJECT TABLE */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-[10px] font-bold uppercase transition-colors">
              <Filter className="w-3.5 h-3.5 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Project Name</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Workspace</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Progress</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Due Date</TableHead>
              <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                      <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                        <Trello className="w-3 h-3" /> {p.template}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="bg-white text-zinc-600 border-zinc-200 text-[10px]">{p.workspace}</Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="w-full max-w-[100px] flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-medium text-zinc-500">
                      <span>{Math.round((p.completed / (p.tasks || 1)) * 100)}%</span>
                      <span>{p.completed}/{p.tasks}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${(p.completed / (p.tasks || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge className={`text-[10px] uppercase font-bold border-none px-2 py-0.5 ${p.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-600' :
                      p.status === 'PLANNING' ? 'bg-amber-50 text-amber-600' :
                        p.status === 'REVIEW' ? 'bg-purple-50 text-purple-600' :
                          'bg-zinc-100 text-zinc-500'
                    }`}>
                    {p.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center text-xs text-zinc-500 font-medium">
                  {p.dueDate}
                </TableCell>
                <TableCell className="py-3 text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                      <DropdownMenuItem onClick={() => handleAction("Opening project board...")}>
                        <Trello className="w-3.5 h-3.5 mr-2" /> Board View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("Opening settings...")}>
                        <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Delete initiated...")}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Archive Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
