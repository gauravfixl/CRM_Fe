"use client"

import React, { useState } from "react"
import { X, Plus, GripVertical, Trash2, Edit2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useWorkflowStore, Column } from "@/shared/data/workflow-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BoardColumnManagementProps {
    projectId: string
    onClose: () => void
}

const PRESET_COLORS = [
    { name: "Slate", value: "#64748b" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Green", value: "#10b981" },
    { name: "Emerald", value: "#10b981" },
]

export default function BoardColumnManagement({ projectId, onClose }: BoardColumnManagementProps) {
    const { getConfig, addColumn, updateColumn, deleteColumn } = useWorkflowStore()
    const { getTasksByColumn } = useIssueStore()

    const boardConfig = getConfig(projectId)
    const tasksByColumn = getTasksByColumn(projectId)

    const [isAddingColumn, setIsAddingColumn] = useState(false)
    const [newColumnName, setNewColumnName] = useState("")
    const [newColumnColor, setNewColumnColor] = useState(PRESET_COLORS[0].value)
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [editColor, setEditColor] = useState("")

    const handleAddColumn = () => {
        if (!newColumnName.trim()) return

        const key = newColumnName.toUpperCase().replace(/\s+/g, "_")
        addColumn(projectId, {
            name: newColumnName.trim(),
            key,
            color: newColumnColor
        })

        setNewColumnName("")
        setNewColumnColor(PRESET_COLORS[0].value)
        setIsAddingColumn(false)
    }

    const handleStartEdit = (column: Column) => {
        setEditingColumnId(column.id)
        setEditName(column.name)
        setEditColor(column.color)
    }

    const handleSaveEdit = (columnId: string) => {
        if (!editName.trim()) return

        const newKey = editName.toUpperCase().replace(/\s+/g, "_")
        updateColumn(projectId, columnId, {
            name: editName.trim(),
            key: newKey,
            color: editColor
        })

        setEditingColumnId(null)
    }

    const handleDeleteColumn = (columnId: string) => {
        const column = boardConfig.columns.find(c => c.id === columnId)
        if (!column) return

        const tasksInColumn = tasksByColumn[column.key]?.length || 0
        if (tasksInColumn > 0) {
            alert(`Cannot delete column "${column.name}" because it contains ${tasksInColumn} task(s). Please move or delete the tasks first.`)
            return
        }

        if (confirm(`Are you sure you want to delete the column "${column.name}"?`)) {
            deleteColumn(projectId, columnId)
        }
    }

    return (
        <div className="h-full flex flex-col bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Board Columns</h2>
                    <p className="text-[13px] text-slate-500 font-medium mt-1">Customize your workflow columns and states</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-xl">
                    <X size={18} />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Warning */}
                <Alert className="bg-amber-50 border-amber-200 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-[12px] font-medium text-amber-800 ml-2">
                        Changing column keys will update all tasks and workflow transitions. Proceed with caution.
                    </AlertDescription>
                </Alert>

                {/* Add Column */}
                {!isAddingColumn ? (
                    <Button
                        onClick={() => setIsAddingColumn(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-xl shadow-lg shadow-indigo-100 text-[13px]"
                    >
                        <Plus size={16} className="mr-2" />
                        Add New Column
                    </Button>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[14px] font-bold text-slate-800">Create Column</h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingColumn(false)} className="h-7 text-[12px]">
                                Cancel
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Column Name</label>
                                <Input
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    placeholder="e.g., In Testing"
                                    className="h-10 rounded-xl text-[13px] font-medium"
                                    onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Color</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewColumnColor(color.value)}
                                            className={`h-10 rounded-xl border-2 transition-all ${newColumnColor === color.value
                                                    ? "border-indigo-600 scale-105 shadow-md"
                                                    : "border-slate-200 hover:border-slate-300"
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleAddColumn}
                                disabled={!newColumnName.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl text-[13px]"
                            >
                                Create Column
                            </Button>
                        </div>
                    </div>
                )}

                <Separator />

                {/* Columns List */}
                <div className="space-y-3">
                    <h3 className="text-[13px] font-bold text-slate-700">Current Columns ({boardConfig.columns.length})</h3>

                    {boardConfig.columns
                        .sort((a, b) => a.order - b.order)
                        .map((column, index) => {
                            const isEditing = editingColumnId === column.id
                            const taskCount = tasksByColumn[column.key]?.length || 0

                            return (
                                <div
                                    key={column.id}
                                    className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-slate-400 cursor-grab">
                                            <GripVertical size={16} />
                                            <span className="text-[11px] font-bold text-slate-400">#{index + 1}</span>
                                        </div>

                                        <div
                                            className="h-10 w-10 rounded-xl border-2 border-white shadow-sm shrink-0"
                                            style={{ backgroundColor: isEditing ? editColor : column.color }}
                                        />

                                        {isEditing ? (
                                            <div className="flex-1 flex items-center gap-2">
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="h-9 rounded-lg text-[13px] font-semibold flex-1"
                                                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(column.id)}
                                                />
                                                <div className="grid grid-cols-5 gap-1">
                                                    {PRESET_COLORS.slice(0, 5).map((color) => (
                                                        <button
                                                            key={color.value}
                                                            onClick={() => setEditColor(color.value)}
                                                            className={`h-7 w-7 rounded-lg border ${editColor === color.value ? "border-indigo-600 ring-2 ring-indigo-200" : "border-slate-200"
                                                                }`}
                                                            style={{ backgroundColor: color.value }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-[14px] font-bold text-slate-900 truncate">{column.name}</h4>
                                                    <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 border-none">
                                                        {taskCount} {taskCount === 1 ? "task" : "tasks"}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-mono font-medium">{column.key}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSaveEdit(column.id)}
                                                        className="h-8 w-8 p-0 rounded-lg text-green-600 hover:bg-green-50"
                                                    >
                                                        <Check size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingColumnId(null)}
                                                        className="h-8 w-8 p-0 rounded-lg"
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStartEdit(column)}
                                                        className="h-8 w-8 p-0 rounded-lg"
                                                    >
                                                        <Edit2 size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteColumn(column.id)}
                                                        disabled={taskCount > 0}
                                                        className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}
