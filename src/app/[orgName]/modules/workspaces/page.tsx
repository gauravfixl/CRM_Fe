"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Trello,
  Loader2,
  Settings,
  BarChart3
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
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
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

export default function ProjectsListPage() {
  const params = useParams() as { orgName?: string }
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<ProjectWithWorkspace[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

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

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.workspaceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => !p.isArchived).length
  const archivedProjects = projects.filter(p => p.isArchived).length

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
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Projects</p>
            <FolderKanban className="w-4 h-4 text-white" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-white drop-shadow-md">{totalProjects}</p>
            <p className="text-[10px] text-white">Across {workspaces.length} workspaces</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active</p>
            <CheckCircle2 className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">{activeProjects}</p>
            <p className="text-[10px] text-zinc-400">Currently active</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Archived</p>
            <LayoutDashboard className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">{archivedProjects}</p>
            <p className="text-[10px] text-zinc-400">Archived projects</p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
          <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Workspaces</p>
            <Clock className="w-4 h-4 text-zinc-300" />
          </SmallCardHeader>
          <SmallCardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-zinc-900">{workspaces.length}</p>
            <p className="text-[10px] text-zinc-400">Total workspaces</p>
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
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-sm text-zinc-500">Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm">
            {searchQuery ? "No projects match your search." : "No projects found across your workspaces."}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Project Name</TableHead>
                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Workspace</TableHead>
                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Visibility</TableHead>
                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Created</TableHead>
                <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((p) => (
                <TableRow
                  key={p._id}
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (p.workspaceId) router.push(`/${orgName}/modules/workspaces/${p.workspaceId}/projects/${p._id}/board`)
                  }}
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {p.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="bg-white text-zinc-600 border-zinc-200 text-[10px]">{p.workspaceName}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge className={`text-[10px] border-none px-2 py-0.5 ${p.visibility === 'public' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                      {p.visibility || "public"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge className={`text-[10px] uppercase font-bold border-none px-2 py-0.5 ${p.isArchived ? 'bg-zinc-100 text-zinc-500' : 'bg-emerald-50 text-emerald-600'}`}>
                      {p.isArchived ? "ARCHIVED" : "ACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-center text-xs text-zinc-500 font-medium">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="py-3 text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (p.workspaceId) router.push(`/${orgName}/modules/workspaces/${p.workspaceId}/projects/${p._id}/board`) }}>
                          <Trello className="w-3.5 h-3.5 mr-2" /> Board View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (p.workspaceId) router.push(`/${orgName}/modules/workspaces/${p.workspaceId}/projects/${p._id}/settings`) }}>
                          <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (p.workspaceId) router.push(`/${orgName}/modules/workspaces/${p.workspaceId}/projects/${p._id}/analytics`) }}>
                          <BarChart3 className="w-3.5 h-3.5 mr-2" /> Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
