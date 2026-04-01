"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
    Trello,
    Search,
    MoreHorizontal,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {
    getAllBoards,
    type Board,
} from "@/modules/project-management/board/hooks/boardHooks"

interface BoardWithProject extends Board {
    projectName?: string
    projectId?: string
    workspaceId?: string
}

export default function BoardsOverviewPage() {
    const params = useParams() as { orgName?: string }
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isFetching, setIsFetching] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [boards, setBoards] = useState<BoardWithProject[]>([])

    const orgName = params.orgName || localStorage.getItem("orgName") || ""
    const filterProjectId = searchParams.get("projectId")

    useEffect(() => {
        fetchAllBoards()
    }, [])

    const fetchAllBoards = async () => {
        setIsFetching(true)
        try {
            // Step 1: Get all workspaces
            const wsRes = await getMyWorkspaces()
            const wsList: Workspace[] = wsRes?.data?.data?.workspaces || wsRes?.data?.workspaces || wsRes?.data?.data || wsRes?.data || []
            const workspacesArr = Array.isArray(wsList) ? wsList : []

            // Step 2: Get all projects from each workspace
            const allProjectsWithWs: Array<Project & { workspaceId: string }> = []
            for (const ws of workspacesArr) {
                try {
                    const res = await getAllProjectsByWorkspace(ws._id)
                    const projectsData: Project[] = res?.data?.data?.projects || res?.data?.projects || res?.data?.data || []
                    const arr = Array.isArray(projectsData) ? projectsData : []
                    arr.forEach(p => allProjectsWithWs.push({ ...p, workspaceId: ws._id }))
                } catch { /* skip */ }
            }

            // Step 3: Get boards from each project
            const allBoards: BoardWithProject[] = []
            for (const proj of allProjectsWithWs) {
                if (filterProjectId && proj._id !== filterProjectId) continue
                try {
                    const res = await getAllBoards(proj._id)
                    const boardsData = res?.data?.boards || res?.data?.data || []
                    const arr = Array.isArray(boardsData) ? boardsData : []
                    arr.forEach((b: Board) => allBoards.push({
                        ...b,
                        projectName: proj.name,
                        projectId: proj._id,
                        workspaceId: proj.workspaceId,
                    }))
                } catch { /* skip */ }
            }

            setBoards(allBoards)
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch boards:", err)
            }
        } finally {
            setIsFetching(false)
        }
    }

    const filteredBoards = boards.filter(b =>
        b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">BOARDS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Board Gallery</h1>
                        <p className="text-xs text-zinc-500 font-medium">Visual overview of all active project boards and workflows.</p>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-purple-500 to-purple-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(168,85,247,0.3)] hover:shadow-[0_20px_40px_rgba(147,51,234,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Boards</p>
                        <Trello className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{boards.length}</p>
                        <p className="text-[10px] text-white">Active workflows</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <Input
                    placeholder="Search boards..."
                    className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* BOARDS GRID */}
            {isFetching ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mr-2" />
                    <span className="text-sm text-zinc-500">Loading boards...</span>
                </div>
            ) : filteredBoards.length === 0 ? (
                <div className="text-center py-16 text-zinc-400 text-sm">
                    {searchQuery ? "No boards match your search." : "No boards found. Create a project to generate boards."}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBoards.map((board) => (
                        <div
                            key={board._id}
                            className="group bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer"
                            onClick={() => {
                                if (board.workspaceId && board.projectId) {
                                    router.push(`/${orgName}/modules/workspaces/${board.workspaceId}/projects/${board.projectId}/board`)
                                }
                            }}
                        >
                            <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 group-hover:text-purple-600 transition-colors">
                                        <Trello className="w-5 h-5" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-zinc-100 rounded-md" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                if (board.workspaceId && board.projectId) {
                                                    router.push(`/${orgName}/modules/workspaces/${board.workspaceId}/projects/${board.projectId}/board`)
                                                }
                                            }}>View Board</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">{board.name}</h3>
                                    <p className="text-[11px] text-zinc-500 font-medium mb-2">{board.projectName || "Unknown Project"}</p>
                                    <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-wider">{board.type || "KANBAN"}</Badge>
                                </div>

                                <div className="pt-4 mt-auto border-t border-zinc-100 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-medium uppercase">Columns</span>
                                        <span className="text-sm font-bold text-zinc-700">{board.columns?.length || 0}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-400 font-medium uppercase">Created</span>
                                        <span className="text-sm font-bold text-zinc-700">
                                            {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
