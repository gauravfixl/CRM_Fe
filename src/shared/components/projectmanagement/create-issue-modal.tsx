"use client"

import React, { useState, useEffect } from "react"
import {
    Plus,
    X,
    Layout,
    CheckCircle2,
    BookOpen,
    Bug,
    Flag,
    Zap,
    Calendar,
    UserCircle,
    ChevronDown,
    Type,
    Maximize2,
    Minimize2,
    HelpCircle,
    MoreHorizontal,
    Paperclip,
    Upload,
    Link2,
    Info,
    AlertCircle,
    Folder
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useIssueStore, IssueType, IssuePriority } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useProjectMemberStore } from "@/shared/data/project-member-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CreateIssueModalProps {
    projectId?: string
    isOpen: boolean
    onClose: () => void
}

export function CreateIssueModal({ projectId: initialProjectId, isOpen, onClose }: CreateIssueModalProps) {
    const { addIssue } = useIssueStore()
    const { getSprintsByProject, getEpicsByProject } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { getAllProjectMembers } = useProjectMemberStore()

    // Form State
    const [projectId, setProjectId] = useState<string>(initialProjectId || projects[0]?.id || "")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<IssueType>("TASK")
    const [priority, setPriority] = useState<IssuePriority>("MEDIUM")
    const [status, setStatus] = useState("TODO")
    const [assigneeId, setAssigneeId] = useState<string>("automatic")
    const [parentId, setParentId] = useState<string>("none")
    const [dueDate, setDueDate] = useState("")
    const [startDate, setStartDate] = useState("")
    const [labels, setLabels] = useState("")
    const [teamId, setTeamId] = useState("none")
    const [isFlagged, setIsFlagged] = useState(false)
    const [linkType, setLinkType] = useState("blocks")
    const [linkedIssueUrl, setLinkedIssueUrl] = useState("")
    const [createAnother, setCreateAnother] = useState(false)

    // Derived Data
    const sprints = getSprintsByProject(projectId)
    const epics = getEpicsByProject(projectId)
    const members = getAllProjectMembers(projectId)
    const activeProject = projects.find(p => p.id === projectId)

    useEffect(() => {
        if (initialProjectId) setProjectId(initialProjectId)
    }, [initialProjectId])

    const handleCreate = () => {
        if (!title.trim() || !projectId) return

        addIssue({
            id: `${projectId.toUpperCase()}-${Date.now().toString().slice(-4)}`,
            projectId,
            title,
            description,
            status,
            priority,
            type,
            assigneeId: assigneeId === "automatic" ? "u1" : assigneeId,
            reporterId: "u1",
            createdAt: new Date().toISOString()
        })

        if (!createAnother) {
            onClose()
            resetFields()
        } else {
            setTitle("")
            setDescription("")
        }
    }

    const resetFields = () => {
        setTitle("")
        setDescription("")
        setAssigneeId("automatic")
        setPriority("MEDIUM")
        setParentId("none")
        setDueDate("")
        setStartDate("")
        setLabels("")
        setIsFlagged(false)
    }

    const handleAssignToMe = () => setAssigneeId("u1") // Assuming u1 is current user

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-w-[800px] p-0 overflow-hidden border-slate-200 shadow-2xl bg-white rounded-xl flex flex-col max-h-[95vh] outline-none [&>button]:hidden"
                style={{ zoom: 0.9 } as React.CSSProperties}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                    <h2 className="text-xl font-semibold text-slate-800">Create Task</h2>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-md"><Minimize2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-md"><Maximize2 size={16} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-md"><MoreHorizontal size={16} /></Button>
                        <div className="h-6 w-[1px] bg-slate-100 mx-1" />
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-rose-50 hover:text-rose-500 rounded-md" onClick={onClose}><X size={20} /></Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 bg-white custom-scrollbar">
                    <p className="text-[12px] text-slate-500">Required fields are marked with an asterisk <span className="text-rose-500 font-bold">*</span></p>

                    {/* 1. Project / Space Selection */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Project <span className="text-rose-500">*</span></label>
                        <Select value={projectId} onValueChange={setProjectId}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center shadow-sm">
                                        <Folder size={14} className="text-white" />
                                    </div>
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id} className="p-3 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer">
                                        <div className="flex items-center gap-3 italic">
                                            <div className="h-5 w-5 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white not-italic">{p.name[0]}</div>
                                            {p.name} ({p.key})
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 2. Work Type */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Work type <span className="text-rose-500">*</span></label>
                        <Select value={type} onValueChange={(v) => setType(v as IssueType)}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <div className="flex items-center gap-2.5">
                                    {type === 'TASK' && <CheckCircle2 size={16} className="text-blue-500 fill-blue-50 shadow-sm" />}
                                    {type === 'BUG' && <Bug size={16} className="text-rose-500 fill-rose-50 shadow-sm" />}
                                    {type === 'STORY' && <BookOpen size={16} className="text-emerald-500 fill-emerald-50 shadow-sm" />}
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                <SelectItem value="TASK" className="p-3 rounded-lg font-bold"><div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500" /> Task</div></SelectItem>
                                <SelectItem value="STORY" className="p-3 rounded-lg font-bold"><div className="flex items-center gap-3"><BookOpen size={16} className="text-emerald-500" /> Story</div></SelectItem>
                                <SelectItem value="BUG" className="p-3 rounded-lg font-bold"><div className="flex items-center gap-3"><Bug size={16} className="text-rose-500" /> Bug</div></SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-blue-600 hover:underline cursor-pointer font-bold flex items-center gap-1 mt-1 transition-all">Learn about work types <Maximize2 size={10} /></p>
                    </div>

                    {/* 3. Status */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-fit min-w-[120px] h-9 border-none bg-slate-100 hover:bg-slate-200 rounded-md font-black text-slate-700 text-[11px] uppercase tracking-wider transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-xl border-slate-100">
                                <SelectItem value="TODO" className="font-bold text-slate-600">TO DO</SelectItem>
                                <SelectItem value="IN_PROGRESS" className="font-bold text-blue-600">IN PROGRESS</SelectItem>
                                <SelectItem value="DONE" className="font-bold text-emerald-600">DONE</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-slate-400 font-medium">This is the initial status upon creation</p>
                    </div>

                    {/* 4. Summary */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Summary <span className="text-rose-500">*</span></label>
                        <Input
                            placeholder="Enter short task summary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`h-11 border-slate-200 rounded-md text-[15px] font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20 ${!title.trim() && 'border-rose-400 focus:border-rose-400 bg-rose-50/10'}`}
                        />
                        {!title.trim() && <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1.5 mt-1.5 ml-0.5 animate-in slide-in-from-left-2 duration-300">
                            <AlertCircle size={14} /> Summary is required
                        </p>}
                    </div>

                    {/* 5. Description */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Description</label>
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                            {/* Jira Toolbar Mockup */}
                            <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-2 flex items-center gap-5 text-slate-400 overflow-x-auto no-scrollbar">
                                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <Button variant="ghost" className="h-8 px-2 text-[13px] font-bold text-slate-600 hover:bg-slate-200 rounded-md">Tt <ChevronDown size={12} /></Button>
                                    <Button variant="ghost" className="h-8 w-8 hover:bg-slate-200 rounded-md font-black text-slate-600">B</Button>
                                    <Button variant="ghost" className="h-8 w-8 hover:bg-slate-200 rounded-md italic font-serif text-slate-600">I</Button>
                                    <Button variant="ghost" className="h-8 w-8 hover:bg-slate-200 rounded-md text-slate-600">⋯</Button>
                                </div>
                                <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md">
                                        <span className="text-slate-600 font-bold text-[14px]">A</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md">
                                        <div className="flex flex-col gap-0.5 items-start">
                                            <div className="h-[2px] w-3 bg-slate-600 rounded-full" />
                                            <div className="h-[2px] w-2 bg-slate-600 rounded-full" />
                                            <div className="h-[2px] w-3 bg-slate-600 rounded-full" />
                                        </div>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md"><Link2 size={16} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md"><Paperclip size={16} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md font-bold">@</Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 rounded-md"><Plus size={16} /></Button>
                                </div>
                            </div>
                            <Textarea
                                placeholder="Type @ to mention a teammate and notify them about this issue."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border-none min-h-[160px] focus:ring-0 text-[15px] p-5 text-slate-700 leading-relaxed placeholder:text-slate-400 resize-none transition-all"
                            />
                        </div>
                    </div>

                    {/* 6. Assignee */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[13px] font-bold text-slate-700">Assignee</label>
                            <button onClick={handleAssignToMe} className="text-[11px] font-bold text-blue-600 hover:underline">Assign to me</button>
                        </div>
                        <Select value={assigneeId} onValueChange={setAssigneeId}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <div className="flex items-center gap-3">
                                    {assigneeId === "automatic" ? (
                                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 animate-in fade-in zoom-in duration-300">
                                            <UserCircle size={18} className="text-slate-400" />
                                        </div>
                                    ) : (
                                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100 animate-in fade-in zoom-in duration-300">
                                            <AvatarImage src={members.find(m => m.userId === assigneeId)?.userAvatar} />
                                            <AvatarFallback className="bg-indigo-600 text-white text-[11px] font-black uppercase">
                                                {members.find(m => m.userId === assigneeId)?.userName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <span className={`font-semibold text-[14px] ${assigneeId === 'automatic' ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {assigneeId === 'automatic' ? 'Automatic' : members.find(m => m.userId === assigneeId)?.userName}
                                    </span>
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                <SelectItem value="automatic" className="p-3 rounded-lg"><div className="flex items-center gap-3 opacity-60">Automatic</div></SelectItem>
                                {members.map(m => (
                                    <SelectItem key={m.userId} value={m.userId} className="p-3 rounded-lg">
                                        <div className="flex items-center gap-3 font-bold">
                                            <Avatar className="h-6 w-6"><AvatarImage src={m.userAvatar} /><AvatarFallback>{m.userName[0]}</AvatarFallback></Avatar>
                                            {m.userName}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 7. Priority */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Priority</label>
                        <Select value={priority} onValueChange={(v) => setPriority(v as IssuePriority)}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <div className="flex items-center gap-3">
                                    <Flag size={16} className={
                                        priority === 'URGENT' ? 'text-rose-600 fill-rose-600' :
                                            priority === 'HIGH' ? 'text-orange-500 fill-orange-500' :
                                                priority === 'MEDIUM' ? 'text-blue-500 fill-blue-500' : 'text-slate-400 fill-slate-400'
                                    } />
                                    <span className="font-semibold text-[14px]">{priority}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
                                    <SelectItem key={p} value={p} className="p-3 rounded-lg font-bold">{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-blue-600 hover:underline cursor-pointer font-bold mt-1">Learn about priority levels</p>
                    </div>

                    {/* 8. Parent */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Parent</label>
                        <Select value={parentId} onValueChange={setParentId}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                <SelectItem value="none" className="p-3 rounded-lg font-bold text-slate-400">None</SelectItem>
                                {epics.map(e => <SelectItem key={e.id} value={e.id} className="p-3 rounded-lg font-bold">{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 9. Due Date & Start Date */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-700">Due date</label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="h-11 border-slate-200 rounded-md pl-10 pr-4 font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                <Folder size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-bold text-slate-700">Start date</label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-11 border-slate-200 rounded-md pl-10 pr-4 font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* 10. Labels */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Labels</label>
                        <Select value={labels} onValueChange={setLabels}>
                            <SelectTrigger className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-500/20">
                                <SelectValue placeholder="Select label" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl p-1">
                                {['Bug', 'Frontend', 'Backend', 'Refactor', 'High-Impact'].map(l => (
                                    <SelectItem key={l} value={l} className="p-3 rounded-lg font-bold">{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 11. Team */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Team</label>
                        <Button variant="outline" className="w-full h-11 border-slate-200 bg-white hover:bg-slate-50 rounded-md shadow-sm justify-start gap-3 text-slate-400 font-medium">
                            <Layout size={18} className="text-slate-300" />
                            <span>Choose a team</span>
                        </Button>
                        <p className="text-[11px] text-slate-400 font-medium">Associates a team to an issue. You can use this field to search and filter issues by team.</p>
                    </div>

                    {/* 12. Reporter */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Reporter <span className="text-rose-500">*</span></label>
                        <div className="w-full h-11 bg-slate-50 border border-slate-100 rounded-md px-4 flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[11px] uppercase shadow-sm">
                                {members[0]?.userName[0] || 'S'}
                            </div>
                            <span className="font-bold text-[14px] text-slate-700">{members[0]?.userName || 'Sahil S.'}</span>
                        </div>
                    </div>

                    {/* 13. Attachment Dropzone */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Attachment</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group">
                            <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={22} className="text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <p className="text-[14px] font-semibold text-slate-500 group-hover:text-slate-700">
                                Drop files to attach or <span className="p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm mx-2 text-slate-800 hover:bg-slate-100 transition-all">Browse</span>
                            </p>
                        </div>
                    </div>

                    {/* 14. Linked Work Items */}
                    <div className="space-y-4">
                        <label className="text-[13px] font-bold text-slate-700">Linked Work items</label>
                        <div className="space-y-3">
                            <Select value={linkType} onValueChange={setLinkType}>
                                <SelectTrigger className="w-full h-11 border-slate-200 bg-white rounded-md shadow-sm transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 p-1">
                                    {['blocks', 'is blocked by', 'clones', 'is cloned by', 'duplicates', 'relates to'].map(l => (
                                        <SelectItem key={l} value={l} className="p-3 rounded-lg font-bold">{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={linkedIssueUrl} onValueChange={setLinkedIssueUrl}>
                                <SelectTrigger className="w-full h-11 border-slate-200 bg-white rounded-md shadow-sm transition-all">
                                    <SelectValue placeholder="Type, search or paste URL" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 p-1">
                                    <SelectItem value="none" className="p-3 rounded-lg italic text-slate-400">No issues found</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 15. Flagged */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-700">Flagged</label>
                        <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 transition-all hover:bg-amber-50/30">
                            <Checkbox id="flagged" checked={isFlagged} onCheckedChange={(checked) => setIsFlagged(!!checked)} className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" />
                            <label htmlFor="flagged" className="text-[14px] font-bold text-slate-700 cursor-pointer select-none">Impediment</label>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium ml-1">Allows to flag issues with impediments.</p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-10 py-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 group cursor-pointer select-none" onClick={() => setCreateAnother(!createAnother)}>
                        <div className={`h-5 w-5 border-2 rounded flex items-center justify-center transition-all ${createAnother ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                            {createAnother && <Plus size={14} className="text-white font-black" />}
                        </div>
                        <span className={`text-[13px] font-bold transition-colors ${createAnother ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>Create another</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={onClose} className="text-[14px] font-bold text-slate-600 hover:bg-slate-100 h-11 px-6 rounded-md transition-all">Cancel</Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!title.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold h-11 px-8 rounded-md shadow-[0_4px_14px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2"
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
