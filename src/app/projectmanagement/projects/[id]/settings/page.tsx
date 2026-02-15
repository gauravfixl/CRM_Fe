"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Settings,
    Users,
    Lock,
    Bell,
    Layers,
    Cog,
    ChevronRight,
    MoreHorizontal,
    ShieldCheck,
    Plug,
    Workflow,
    Trash2,
    Plus,
    AlertCircle,
    GitBranch
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useProjectStore } from "@/shared/data/projects-store"
import { useTeamStore } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import ProjectMemberManagement from "@/shared/components/projectmanagement/project-member-management"
import BoardColumnManagement from "@/shared/components/projectmanagement/board-column-management"

export default function SettingsPage() {
    const { id } = useParams()
    const projectId = id as string
    const router = useRouter()

    const { getProjectById, deleteProject, updateProject } = useProjectStore()
    const { getMembersByWorkspace } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const project = getProjectById(projectId)
    const projectName = project?.name || (id === "p1" ? "Website Redesign" : "Project")
    const members = activeWorkspaceId ? getMembersByWorkspace(activeWorkspaceId) : []

    const [projectNameInput, setProjectNameInput] = useState(project?.name || "")
    const [projectDescInput, setProjectDescInput] = useState(project?.description || "")
    const [isSaving, setIsSaving] = useState(false)

    // Update state when project loads
    React.useEffect(() => {
        if (project) {
            setProjectNameInput(project.name)
            setProjectDescInput(project.description || "")
        }
    }, [project])

    const [showMemberSheet, setShowMemberSheet] = useState(false)
    const [showWorkflowSheet, setShowWorkflowSheet] = useState(false)

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this project? This cannot be undone.")) {
            deleteProject(projectId)
            router.push("/projectmanagement")
        }
    }

    const handleSaveGeneral = () => {
        if (!projectNameInput.trim()) return
        setIsSaving(true)
        updateProject(projectId, {
            name: projectNameInput,
            description: projectDescInput
        })
        // Simulate network delay for better UX
        setTimeout(() => setIsSaving(false), 500)
    }

    return (
        <div className="flex flex-col h-full font-sans bg-slate-50">
            {/* Member Management Sheet */}
            <Sheet open={showMemberSheet} onOpenChange={setShowMemberSheet}>
                <SheetContent className="w-[700px] sm:max-w-[700px] p-0">
                    <ProjectMemberManagement
                        projectId={projectId}
                        workspaceId={activeWorkspaceId || "ws-1"}
                        onClose={() => setShowMemberSheet(false)}
                    />
                </SheetContent>
            </Sheet>

            {/* Workflow Management Sheet */}
            <Sheet open={showWorkflowSheet} onOpenChange={setShowWorkflowSheet}>
                <SheetContent className="w-[700px] sm:max-w-[700px] p-0">
                    <BoardColumnManagement
                        projectId={projectId}
                        onClose={() => setShowWorkflowSheet(false)}
                    />
                </SheetContent>
            </Sheet>

            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl text-white shadow-lg shadow-slate-100">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">{projectName} Settings</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Manage project configuration and access</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 p-1 rounded-xl">
                            <TabsTrigger value="general" className="text-[13px] font-semibold rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                General
                            </TabsTrigger>
                            <TabsTrigger value="members" className="text-[13px] font-semibold rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                Members
                            </TabsTrigger>
                            <TabsTrigger value="workflow" className="text-[13px] font-semibold rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                Workflow
                            </TabsTrigger>
                            <TabsTrigger value="advanced" className="text-[13px] font-semibold rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                                Advanced
                            </TabsTrigger>
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-4 mt-6">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-[15px] font-bold text-slate-900">Project Details</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">Basic information about this project</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-600">Project Name</label>
                                            <input
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                                value={projectNameInput}
                                                onChange={(e) => setProjectNameInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-slate-600">Project Key</label>
                                            <input
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-slate-50 font-mono font-semibold text-slate-800 outline-none"
                                                defaultValue={project?.key || "PROJ"}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-600">Description</label>
                                        <textarea
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] bg-white font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                                            rows={3}
                                            placeholder="Describe your project..."
                                            value={projectDescInput}
                                            onChange={(e) => setProjectDescInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            onClick={handleSaveGeneral}
                                            disabled={isSaving}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-6 rounded-xl text-[13px]"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <p className="text-[13px] font-semibold text-slate-900">Project Status</p>
                                            <p className="text-[11px] text-slate-500 font-medium">Active projects are visible to all members</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-[15px] font-bold text-slate-900">Notifications</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">Configure project notification settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { label: "Task Updates", desc: "Get notified when tasks are updated" },
                                        { label: "New Comments", desc: "Receive alerts for new comments" },
                                        { label: "Member Changes", desc: "Alert when members join or leave" },
                                        { label: "Sprint Updates", desc: "Notifications for sprint changes" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div>
                                                <p className="text-[13px] font-semibold text-slate-900">{item.label}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                            </div>
                                            <Switch defaultChecked={i < 2} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Members Tab */}
                        <TabsContent value="members" className="space-y-4 mt-6">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-[15px] font-bold text-slate-900">Project Members</CardTitle>
                                            <CardDescription className="text-[12px] font-medium">Manage who has access to this project</CardDescription>
                                        </div>
                                        <Button
                                            onClick={() => setShowMemberSheet(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-4 rounded-xl text-[12px] shadow-md shadow-indigo-100"
                                        >
                                            <Users size={14} className="mr-2" />
                                            Manage Members
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 text-center">
                                        <div className="p-4 bg-white rounded-2xl w-fit mx-auto mb-4 shadow-sm">
                                            <ShieldCheck size={32} className="text-indigo-600" />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-2">Role-Based Access Control</h3>
                                        <p className="text-[12px] text-slate-600 font-medium mb-4 max-w-md mx-auto">
                                            Click "Manage Members" to add team members, assign roles, and configure custom permissions
                                        </p>
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            {["Owner", "Admin", "Member", "Viewer"].map((role) => (
                                                <Badge key={role} className="bg-white text-indigo-700 text-[10px] font-bold border border-indigo-200 px-3 py-1">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Workflow Tab */}
                        <TabsContent value="workflow" className="space-y-4 mt-6">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-[15px] font-bold text-slate-900">Board & Workflow</CardTitle>
                                            <CardDescription className="text-[12px] font-medium">Customize columns and workflow transitions</CardDescription>
                                        </div>
                                        <Button
                                            onClick={() => setShowWorkflowSheet(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-4 rounded-xl text-[12px] shadow-md shadow-indigo-100"
                                        >
                                            <GitBranch size={14} className="mr-2" />
                                            Manage Workflow
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-8 text-center">
                                        <div className="p-4 bg-white rounded-2xl w-fit mx-auto mb-4 shadow-sm">
                                            <Workflow size={32} className="text-blue-600" />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-2">Dynamic Board Configuration</h3>
                                        <p className="text-[12px] text-slate-600 font-medium mb-4 max-w-md mx-auto">
                                            Click "Manage Workflow" to add, edit, or delete board columns and configure workflow transitions
                                        </p>
                                        <div className="flex items-center justify-center gap-2">
                                            <Badge className="bg-white text-blue-700 text-[10px] font-bold border border-blue-200 px-3 py-1">
                                                Add Columns
                                            </Badge>
                                            <Badge className="bg-white text-blue-700 text-[10px] font-bold border border-blue-200 px-3 py-1">
                                                Color Picker
                                            </Badge>
                                            <Badge className="bg-white text-blue-700 text-[10px] font-bold border border-blue-200 px-3 py-1">
                                                Validation
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced Tab */}
                        <TabsContent value="advanced" className="space-y-4 mt-6">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-[15px] font-bold text-slate-900">Integrations</CardTitle>
                                    <CardDescription className="text-[12px] font-medium">Connect external tools and services</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { name: "GitHub", desc: "Link repositories and track commits", icon: "🔗" },
                                        { name: "Slack", desc: "Send notifications to Slack channels", icon: "💬" },
                                        { name: "Jira", desc: "Sync issues with Jira", icon: "📊" }
                                    ].map((integration, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{integration.icon}</div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-slate-900">{integration.name}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">{integration.desc}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-[11px] font-semibold rounded-lg">
                                                Connect
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-red-200 shadow-sm rounded-2xl bg-red-50/50">
                                <CardHeader>
                                    <CardTitle className="text-[15px] font-bold text-red-900 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        Danger Zone
                                    </CardTitle>
                                    <CardDescription className="text-[12px] font-medium text-red-700">Irreversible actions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl">
                                        <div>
                                            <p className="text-[13px] font-semibold text-slate-900">Delete Project</p>
                                            <p className="text-[11px] text-slate-500 font-medium">Permanently delete this project and all its data</p>
                                        </div>
                                        <Button
                                            onClick={handleDelete}
                                            variant="destructive"
                                            className="bg-red-600 hover:bg-red-700 text-white font-semibold h-9 px-4 rounded-xl text-[12px]"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
