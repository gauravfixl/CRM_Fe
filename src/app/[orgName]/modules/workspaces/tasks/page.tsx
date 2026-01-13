"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import {
    CustomTable,
    CustomTableBody,
    CustomTableCell,
    CustomTableHead,
    CustomTableHeader,
    CustomTableRow,
} from "@/components/custom/CustomTable"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SubHeader from "@/components/custom/SubHeader"
import { Search, Filter, Plus, CheckCircle2, AlertCircle, Clock, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data Types
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done'

interface Task {
    id: string
    key: string
    title: string
    project: string
    status: TaskStatus
    priority: TaskPriority
    assignee: { name: string, avatar?: string, initials: string }
    dueDate: string
}

// Mock Data
const MOCK_TASKS: Task[] = [
    { id: '1', key: 'CRM-101', title: 'Fix Sidebar Navigation', project: 'CRM Frontend', status: 'In Progress', priority: 'High', assignee: { name: 'John Doe', initials: 'JD' }, dueDate: '2024-02-15' },
    { id: '2', key: 'CRM-102', title: 'Design Task Drawer', project: 'CRM Frontend', status: 'Todo', priority: 'Medium', assignee: { name: 'Sarah Smith', initials: 'SS' }, dueDate: '2024-02-16' },
    { id: '3', key: 'API-505', title: 'Backend Auth API', project: 'CRM Backend', status: 'Review', priority: 'Urgent', assignee: { name: 'Mike Ross', initials: 'MR' }, dueDate: '2024-02-14' },
    { id: '4', key: 'APP-22', title: 'Splash Screen Animation', project: 'Mobile App', status: 'Done', priority: 'Low', assignee: { name: 'Jane Doe', initials: 'JD' }, dueDate: '2024-01-20' },
    { id: '5', key: 'CRM-103', title: 'Unit Tests for Redux', project: 'CRM Frontend', status: 'Todo', priority: 'Medium', assignee: { name: 'John Doe', initials: 'JD' }, dueDate: '2024-02-20' },
]

export default function TasksPage() {
    const params = useParams() as { orgName: string }
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const isSheetOpen = !!selectedTask

    const filteredTasks = MOCK_TASKS.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case 'Urgent': return 'bg-red-100 text-red-700 border-red-200'
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200'
            default: return 'bg-zinc-100 text-zinc-700'
        }
    }

    const getStatusIcon = (s: TaskStatus) => {
        switch (s) {
            case 'Todo': return <CheckCircle2 className="w-4 h-4 text-zinc-400" />
            case 'In Progress': return <Clock className="w-4 h-4 text-blue-500" />
            case 'Review': return <AlertCircle className="w-4 h-4 text-purple-500" />
            case 'Done': return <CheckCircle2 className="w-4 h-4 text-green-500" />
        }
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
            <SubHeader
                title="All Tasks"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${params.orgName}/dashboard` },
                    { label: "Project Management", href: `/${params.orgName}/modules/workspaces` },
                    { label: "Tasks", href: `/${params.orgName}/modules/workspaces/tasks` },
                ]}
                rightControls={
                    <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                        <Plus className="w-4 h-4" /> Create Task
                    </CustomButton>
                }
            />

            <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                        <CustomInput
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 w-[300px] bg-white dark:bg-zinc-950"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <CustomButton variant="outline" size="sm" className="h-9 gap-2">
                            <Filter className="h-3.5 w-3.5" /> Filter
                        </CustomButton>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <CustomTable>
                        <CustomTableHeader>
                            <CustomTableRow className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <CustomTableHead className="w-[100px]">ID</CustomTableHead>
                                <CustomTableHead>Title</CustomTableHead>
                                <CustomTableHead>Project</CustomTableHead>
                                <CustomTableHead>Status</CustomTableHead>
                                <CustomTableHead>Priority</CustomTableHead>
                                <CustomTableHead>Assignee</CustomTableHead>
                                <CustomTableHead>Due Date</CustomTableHead>
                                <CustomTableHead className="w-[50px]"></CustomTableHead>
                            </CustomTableRow>
                        </CustomTableHeader>
                        <CustomTableBody>
                            {filteredTasks.length > 0 ? filteredTasks.map(task => (
                                <CustomTableRow
                                    key={task.id}
                                    className="cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <CustomTableCell className="font-mono text-xs text-zinc-500">{task.key}</CustomTableCell>
                                    <CustomTableCell className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {task.title}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <Badge variant="outline" className="font-normal text-zinc-500">
                                            {task.project}
                                        </Badge>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(task.status)}
                                            <span className="text-sm">{task.status}</span>
                                        </div>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <Badge className={`rounded-md font-normal text-xs px-2 py-0.5 border ${getPriorityColor(task.priority)} bg-opacity-50`}>
                                            {task.priority}
                                        </Badge>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{task.assignee.initials}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{task.assignee.name}</span>
                                        </div>
                                    </CustomTableCell>
                                    <CustomTableCell className="text-zinc-500">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </CustomTableCell>
                                    <CustomTableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100">
                                                    <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CustomTableCell>
                                </CustomTableRow>
                            )) : (
                                <CustomTableRow>
                                    <CustomTableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No tasks found matching your filters.
                                    </CustomTableCell>
                                </CustomTableRow>
                            )}
                        </CustomTableBody>
                    </CustomTable>
                </div>
            </div>

            {/* Task Detail Drawer */}
            <Sheet open={isSheetOpen} onOpenChange={(open) => !open && setSelectedTask(null)}>
                <SheetContent className="sm:max-w-2xl w-full">
                    {selectedTask ? (
                        <div className="h-full flex flex-col">
                            <SheetHeader className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono text-zinc-400">{selectedTask.key}</span>
                                    <Badge variant="outline">{selectedTask.project}</Badge>
                                </div>
                                <SheetTitle className="text-xl">{selectedTask.title}</SheetTitle>
                                <SheetDescription>
                                    Created by You • Last updated 2 days ago
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                                {/* Status & Properties */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500">Status</label>
                                        <div className="mt-1 flex items-center gap-2 font-medium">
                                            {getStatusIcon(selectedTask.status)} {selectedTask.status}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500">Priority</label>
                                        <div className="mt-1">
                                            <Badge className={`${getPriorityColor(selectedTask.priority)} border`}>
                                                {selectedTask.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500">Assignee</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">{selectedTask.assignee.initials}</AvatarFallback>
                                            </Avatar>
                                            <span>{selectedTask.assignee.name}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-500">Due Date</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-zinc-400" />
                                            <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Description</h3>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed min-h-[100px] p-4 border rounded-md">
                                        This is a placeholder description. In the real implementation, this would be a rich text editor content area.
                                        <br /><br />
                                        - Check navigation links
                                        <br />
                                        - Ensure active state is correct
                                        <br />
                                        - Verify mobile responsiveness
                                    </div>
                                </div>

                                {/* Activity / Comments Placeholder */}
                                <div>
                                    <h3 className="text-sm font-medium mb-4">Activity</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-md rounded-tl-none">
                                                    <p className="text-xs font-medium mb-1">John Doe</p>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">Working on this now. Should be done by EOD.</p>
                                                </div>
                                                <span className="text-xs text-zinc-400 mt-1 block">2 hours ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-4 mt-4 border-t flex justify-end gap-2">
                                <CustomButton variant="outline" onClick={() => setSelectedTask(null)}>Close</CustomButton>
                                <CustomButton>Save Changes</CustomButton>
                            </div>
                        </div>
                    ) : null}
                </SheetContent>
            </Sheet>
        </div>
    )
}
