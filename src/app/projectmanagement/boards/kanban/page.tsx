"use client"

import React, { useState } from "react"
import {
    Plus,
    MoreHorizontal,
    Calendar,
    MessageSquare,
    Paperclip,
    Filter,
    Search,
    Share2,
    Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const KANBAN_DATA = [
    {
        id: "todo",
        title: "To Do",
        count: 5,
        tasks: [
            { id: 1, title: "Design System Guidelines", priority: "High", comments: 12, files: 4, date: "Jan 30", category: "Design" },
            { id: 2, title: "API Integration - Auth Module", priority: "Medium", comments: 5, files: 2, date: "Feb 02", category: "Dev" },
        ]
    },
    {
        id: "inprogress",
        title: "In Progress",
        count: 3,
        tasks: [
            { id: 3, title: "Kanban Board Implementation", priority: "High", comments: 8, files: 1, date: "Jan 28", category: "Dev" },
            { id: 4, title: "Client Feedback Research", priority: "Low", comments: 22, files: 10, date: "Jan 29", category: "Research" },
        ]
    },
    {
        id: "review",
        title: "In Review",
        count: 2,
        tasks: [
            { id: 5, title: "Logo Refresh - Final Pass", priority: "Medium", comments: 2, files: 5, date: "Jan 27", category: "Design" },
        ]
    },
    {
        id: "done",
        title: "Done",
        count: 14,
        tasks: [
            { id: 6, title: "Project Setup", priority: "Low", comments: 1, files: 0, date: "Jan 25", category: "Management" },
        ]
    }
]

export default function KanbanBoardPage() {
    return (
        <div className="flex flex-col h-full gap-6">
            {/* Board Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Layout className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Product Development Board</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Internal Workplace / 2026 Roadmap</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 mr-4">
                        {[1, 2, 3, 4].map((m) => (
                            <Avatar key={m} className="h-8 w-8 border-2 border-white cursor-pointer hover:z-10 transition-all">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=kanban${m}`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Board Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search tasks..." className="pl-9 h-9 bg-white border-slate-200" />
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 gap-2 text-slate-600">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-500 font-medium">View:</span>
                    <Button variant="secondary" size="sm" className="h-8 text-[12px]">Board</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-[12px] text-slate-500">List</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-[12px] text-slate-500">Timeline</Button>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
                {KANBAN_DATA.map((column) => (
                    <div key={column.id} className="flex flex-col gap-4 min-w-[300px] w-[300px] flex-shrink-0">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{column.title}</h3>
                                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {column.count}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3 min-h-[500px] bg-slate-100/30 p-2 rounded-xl border-2 border-dashed border-slate-200/50">
                            {column.tasks.map((task) => (
                                <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-b-2 border-b-slate-200">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${task.category === 'Dev' ? 'bg-blue-100 text-blue-600' :
                                                    task.category === 'Design' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-amber-100 text-amber-600'
                                                }`}>
                                                {task.category}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase ${task.priority === 'High' ? 'text-rose-500' :
                                                    task.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <h4 className="text-[13.5px] font-semibold text-slate-800 leading-tight">
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    <span className="text-[10px]">{task.comments}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Paperclip className="h-3.5 w-3.5" />
                                                    <span className="text-[10px]">{task.files}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-medium">{task.date}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant="ghost" className="w-full h-10 border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 gap-2">
                                <Plus className="h-4 w-4" />
                                <span className="text-xs font-semibold">New Task</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
