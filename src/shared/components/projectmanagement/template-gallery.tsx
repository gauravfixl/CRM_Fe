"use client"

import React, { useState } from "react"
import {
    Layout,
    Star,
    Search,
    Filter,
    Plus,
    Copy,
    Trash2,
    Eye,
    CheckCircle2,
    X,
    Upload,
    Palette
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useProjectTemplateStore, TemplateCategory, BoardType } from "@/shared/data/project-template-store"

interface TemplateGalleryProps {
    organizationId?: string
    onSelectTemplate?: (templateId: string) => void
    onClose?: () => void
}

export default function TemplateGallery({
    organizationId = "org-1",
    onSelectTemplate,
    onClose
}: TemplateGalleryProps) {
    const { listTemplates, getTemplate, duplicateTemplate, deleteTemplate, createTemplate } = useProjectTemplateStore()

    const [filterCategory, setFilterCategory] = useState<TemplateCategory | "ALL">("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [showRecommended, setShowRecommended] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    // Create template form state
    const [newTemplate, setNewTemplate] = useState({
        name: "",
        description: "",
        boardType: "kanban" as BoardType,
        category: "general" as TemplateCategory,
        recommended: false,
        columns: [
            { name: "To Do", key: "TODO", order: 0, color: "#3b82f6" },
            { name: "In Progress", key: "IN_PROGRESS", order: 1, color: "#f59e0b" },
            { name: "Done", key: "DONE", order: 2, color: "#10b981" }
        ]
    })

    const { system, organization: orgTemplates } = listTemplates({
        organizationId,
        ...(filterCategory !== "ALL" && { category: filterCategory }),
        ...(showRecommended && { recommended: true })
    })

    const allTemplates = [...system, ...orgTemplates].filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelect = (templateId: string) => {
        setSelectedId(templateId)
        if (onSelectTemplate) {
            onSelectTemplate(templateId)
        }
    }

    const handleDuplicate = (templateId: string, name: string) => {
        const newName = prompt("Enter name for duplicated template:", `${name} (Copy)`)
        if (newName) {
            duplicateTemplate(templateId, newName)
        }
    }

    const handleDelete = (templateId: string) => {
        if (confirm("Are you sure you want to delete this template?")) {
            deleteTemplate(templateId)
        }
    }

    const handleCreateTemplate = () => {
        if (!newTemplate.name.trim()) {
            alert("Please enter a template name")
            return
        }

        // Generate workflow states and transitions from columns
        const workflowStates = newTemplate.columns.map(col => ({
            name: col.name,
            key: col.key,
            order: col.order,
            color: col.color
        }))

        const workflowTransitions = newTemplate.columns.slice(0, -1).map((col, i) => ({
            from: col.key,
            to: newTemplate.columns[i + 1].key
        }))

        const template = createTemplate({
            name: newTemplate.name,
            description: newTemplate.description,
            boardType: newTemplate.boardType,
            category: newTemplate.category,
            recommended: newTemplate.recommended,
            isSystem: false,
            columns: newTemplate.columns,
            workflowStates,
            workflowTransitions,
            createdBy: "u1", // Replace with actual user ID
            creatorName: "Current User",
            organizationId
        })

        // Reset form
        setNewTemplate({
            name: "",
            description: "",
            boardType: "kanban",
            category: "general",
            recommended: false,
            columns: [
                { name: "To Do", key: "TODO", order: 0, color: "#3b82f6" },
                { name: "In Progress", key: "IN_PROGRESS", order: 1, color: "#f59e0b" },
                { name: "Done", key: "DONE", order: 2, color: "#10b981" }
            ]
        })

        setCreateDialogOpen(false)
    }

    const addColumn = () => {
        const newOrder = newTemplate.columns.length
        setNewTemplate({
            ...newTemplate,
            columns: [
                ...newTemplate.columns,
                {
                    name: `Column ${newOrder + 1}`,
                    key: `COL_${newOrder + 1}`,
                    order: newOrder,
                    color: "#94a3b8"
                }
            ]
        })
    }

    const updateColumn = (index: number, field: string, value: string) => {
        const updatedColumns = [...newTemplate.columns]
        updatedColumns[index] = { ...updatedColumns[index], [field]: value }
        setNewTemplate({ ...newTemplate, columns: updatedColumns })
    }

    const removeColumn = (index: number) => {
        if (newTemplate.columns.length <= 2) {
            alert("Template must have at least 2 columns")
            return
        }
        const updatedColumns = newTemplate.columns.filter((_, i) => i !== index)
        setNewTemplate({ ...newTemplate, columns: updatedColumns })
    }

    const getCategoryColor = (category: TemplateCategory) => {
        const colors: Record<TemplateCategory, string> = {
            software: "bg-blue-100 text-blue-700 border-blue-200",
            marketing: "bg-purple-100 text-purple-700 border-purple-200",
            design: "bg-pink-100 text-pink-700 border-pink-200",
            hr: "bg-green-100 text-green-700 border-green-200",
            sales: "bg-orange-100 text-orange-700 border-orange-200",
            general: "bg-slate-100 text-slate-700 border-slate-200"
        }
        return colors[category]
    }

    const getBoardTypeIcon = (boardType: string) => {
        return boardType === 'scrum' ? '🏃' : boardType === 'kanban' ? '📋' : '⚙️'
    }

    return (
        <div className="space-y-4 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layout size={18} className="text-indigo-600" />
                    <h3 className="text-[15px] font-bold text-slate-900">Project Templates</h3>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border-none">
                        {allTemplates.length} templates
                    </Badge>
                </div>

                {/* Create Template Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold shadow-md shadow-indigo-100">
                            <Plus size={14} className="mr-2" />
                            Create Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-[16px] font-bold">Create New Template</DialogTitle>
                            <DialogDescription className="text-[12px]">
                                Design a custom project template with workflow columns
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Basic Info */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold">Template Name *</Label>
                                <Input
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    placeholder="e.g., Marketing Campaign"
                                    className="text-[13px] font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold">Description</Label>
                                <Textarea
                                    value={newTemplate.description}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    placeholder="Describe this template..."
                                    className="text-[13px] font-medium resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Board Type</Label>
                                    <Select
                                        value={newTemplate.boardType}
                                        onValueChange={(v) => setNewTemplate({ ...newTemplate, boardType: v as BoardType })}
                                    >
                                        <SelectTrigger className="text-[12px] font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kanban" className="text-[12px]">📋 Kanban</SelectItem>
                                            <SelectItem value="scrum" className="text-[12px]">🏃 Scrum</SelectItem>
                                            <SelectItem value="custom" className="text-[12px]">⚙️ Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold">Category</Label>
                                    <Select
                                        value={newTemplate.category}
                                        onValueChange={(v) => setNewTemplate({ ...newTemplate, category: v as TemplateCategory })}
                                    >
                                        <SelectTrigger className="text-[12px] font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="software" className="text-[12px]">Software</SelectItem>
                                            <SelectItem value="marketing" className="text-[12px]">Marketing</SelectItem>
                                            <SelectItem value="design" className="text-[12px]">Design</SelectItem>
                                            <SelectItem value="hr" className="text-[12px]">HR</SelectItem>
                                            <SelectItem value="sales" className="text-[12px]">Sales</SelectItem>
                                            <SelectItem value="general" className="text-[12px]">General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Columns */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-bold">Workflow Columns</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addColumn}
                                        className="h-7 px-3 text-[10px] font-semibold"
                                    >
                                        <Plus size={12} className="mr-1" />
                                        Add Column
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {newTemplate.columns.map((col, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                <Input
                                                    value={col.name}
                                                    onChange={(e) => updateColumn(index, 'name', e.target.value)}
                                                    placeholder="Column name"
                                                    className="text-[12px] font-medium h-8"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={col.color}
                                                        onChange={(e) => updateColumn(index, 'color', e.target.value)}
                                                        className="h-8 w-12 rounded cursor-pointer"
                                                    />
                                                    <Input
                                                        value={col.key}
                                                        onChange={(e) => updateColumn(index, 'key', e.target.value.toUpperCase())}
                                                        placeholder="KEY"
                                                        className="text-[11px] font-mono font-bold h-8 uppercase"
                                                    />
                                                </div>
                                            </div>
                                            {newTemplate.columns.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeColumn(index)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                >
                                                    <X size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommended */}
                            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                                <input
                                    type="checkbox"
                                    id="recommended"
                                    checked={newTemplate.recommended}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, recommended: e.target.checked })}
                                    className="h-4 w-4 rounded border-amber-300"
                                />
                                <Label htmlFor="recommended" className="text-[12px] font-semibold text-amber-900 cursor-pointer">
                                    <Star size={12} className="inline mr-1" />
                                    Mark as recommended template
                                </Label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                                className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateTemplate}
                                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100"
                            >
                                Create Template
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 rounded-xl text-[12px] font-medium"
                    />
                </div>

                <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as any)}>
                    <SelectTrigger className="h-9 w-36 rounded-lg text-[11px] font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="ALL" className="text-[12px] font-medium">All Categories</SelectItem>
                        <SelectItem value="software" className="text-[12px] font-medium">Software</SelectItem>
                        <SelectItem value="marketing" className="text-[12px] font-medium">Marketing</SelectItem>
                        <SelectItem value="design" className="text-[12px] font-medium">Design</SelectItem>
                        <SelectItem value="hr" className="text-[12px] font-medium">HR</SelectItem>
                        <SelectItem value="sales" className="text-[12px] font-medium">Sales</SelectItem>
                        <SelectItem value="general" className="text-[12px] font-medium">General</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant={showRecommended ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowRecommended(!showRecommended)}
                    className={`h-9 px-3 rounded-xl text-[11px] font-semibold ${showRecommended
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'border-slate-200'
                        }`}
                >
                    <Star size={14} className={showRecommended ? "mr-2 fill-current" : "mr-2"} />
                    Recommended
                </Button>
            </div>

            {/* System Templates */}
            {system.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">System Templates</h4>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {system.map((template) => (
                            <Card
                                key={template.id}
                                className={`border-2 rounded-2xl transition-all cursor-pointer hover:shadow-md ${selectedId === template.id
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-slate-200 hover:border-indigo-300'
                                    }`}
                                onClick={() => handleSelect(template.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-100 shrink-0">
                                            <span className="text-xl">{getBoardTypeIcon(template.boardType)}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[13px] font-bold text-slate-900 truncate">
                                                        {template.name}
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">
                                                        {template.description}
                                                    </p>
                                                </div>
                                                {selectedId === template.id && (
                                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                                <Badge className={`text-[9px] font-bold px-2 py-0 border ${getCategoryColor(template.category)}`}>
                                                    {template.category}
                                                </Badge>
                                                <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-2 py-0">
                                                    {template.columns.length} columns
                                                </Badge>
                                                {template.recommended && (
                                                    <Badge className="bg-amber-100 text-amber-700 text-[9px] font-bold border-amber-200 border px-2 py-0">
                                                        <Star size={8} className="mr-1 fill-current" />
                                                        Recommended
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 mt-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDuplicate(template.id, template.name)
                                                    }}
                                                    className="h-7 px-2 text-[10px] font-semibold hover:bg-white"
                                                >
                                                    <Copy size={12} className="mr-1" />
                                                    Duplicate
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Organization Templates */}
            {orgTemplates.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Custom Templates</h4>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {orgTemplates.map((template) => (
                            <Card
                                key={template.id}
                                className={`border-2 rounded-2xl transition-all cursor-pointer hover:shadow-md ${selectedId === template.id
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-slate-200 hover:border-indigo-300'
                                    }`}
                                onClick={() => handleSelect(template.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white shadow-lg shadow-blue-100 shrink-0">
                                            <span className="text-xl">{getBoardTypeIcon(template.boardType)}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[13px] font-bold text-slate-900 truncate">
                                                        {template.name}
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">
                                                        {template.description}
                                                    </p>
                                                </div>
                                                {selectedId === template.id && (
                                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                                <Badge className={`text-[9px] font-bold px-2 py-0 border ${getCategoryColor(template.category)}`}>
                                                    {template.category}
                                                </Badge>
                                                <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-2 py-0">
                                                    {template.columns.length} columns
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-1 mt-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDuplicate(template.id, template.name)
                                                    }}
                                                    className="h-7 px-2 text-[10px] font-semibold hover:bg-white"
                                                >
                                                    <Copy size={12} className="mr-1" />
                                                    Duplicate
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete(template.id)
                                                    }}
                                                    className="h-7 px-2 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={12} className="mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {allTemplates.length === 0 && (
                <Card className="border-none shadow-sm rounded-2xl bg-slate-50">
                    <CardContent className="p-8 text-center">
                        <Layout size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-[13px] font-semibold text-slate-500">No templates found</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters</p>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            {onSelectTemplate && selectedId && (
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 px-4 rounded-xl text-[12px] font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onSelectTemplate(selectedId)}
                        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-semibold shadow-md shadow-indigo-100"
                    >
                        Use Template
                    </Button>
                </div>
            )}
        </div>
    )
}
