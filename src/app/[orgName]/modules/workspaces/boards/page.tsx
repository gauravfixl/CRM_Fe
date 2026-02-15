"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Trello,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    LayoutDashboard,
    List,
    Users,
    Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function BoardsOverviewPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const boards = [
        { id: "B-01", name: "Main Development", project: "Backend Migration", type: "SCRUM", lists: 5, cards: 156 },
        { id: "B-02", name: "Design Review", project: "Website Redesign", type: "KANBAN", lists: 4, cards: 24 },
        { id: "B-03", name: "Marketing Pipeline", project: "Marketing", type: "KANBAN", lists: 6, cards: 45 },
        { id: "B-04", name: "App Beta Bugs", project: "Mobile App Beta", type: "BUG TRACKING", lists: 3, cards: 12 },
    ]

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

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
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Create Board Wizard")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            New Board
                        </Button>
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
                        <p className="text-2xl font-bold text-white drop-shadow-md">08</p>
                        <p className="text-[10px] text-white">Active workflows</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* BOARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <div key={board.id} className="group bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="h-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500" />
                        <div className="p-5 flex-1 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-zinc-50 rounded-lg text-zinc-500 group-hover:text-purple-600 transition-colors">
                                    <Trello className="w-5 h-5" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-6 w-6 p-0 hover:bg-zinc-100 rounded-md">
                                            <MoreHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 shadow-xl border-zinc-100">
                                        <DropdownMenuItem onClick={() => handleAction("Opening board...")}>View Board</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleAction("Board settings...")}>Settings</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">{board.name}</h3>
                                <p className="text-[11px] text-zinc-500 font-medium mb-2">{board.project}</p>
                                <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-wider">{board.type}</Badge>
                            </div>

                            <div className="pt-4 mt-auto border-t border-zinc-100 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-medium uppercase">Lists</span>
                                    <span className="text-sm font-bold text-zinc-700">{board.lists}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 font-medium uppercase">Cards</span>
                                    <span className="text-sm font-bold text-zinc-700">{board.cards}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
