"use client"

import { useState, useMemo } from "react"
import {
    Award,
    Search,
    Plus,
    MoreVertical,
    Star,
    Tag,
    Heart,
    Pencil,
    Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"

interface Skill {
    id: string
    name: string
    category: string
    endorsements: number
}

const CATEGORIES = ["Technical", "Soft Skill", "Marketing", "Finance", "Language"]

export default function SkillsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", category: "" })
    const [editItem, setEditItem] = useState<Skill | null>(null)
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [skills, setSkills] = useState<Skill[]>([
        { id: "1", name: "ReactJS", category: "Technical", endorsements: 12 },
        { id: "2", name: "Project Management", category: "Soft Skill", endorsements: 8 },
        { id: "3", name: "SEO Optimization", category: "Marketing", endorsements: 5 },
        { id: "4", name: "Financial Auditing", category: "Finance", endorsements: 3 },
    ])

    const technicalSkills = skills.filter((s) => s.category === "Technical").length
    const softSkills = skills.filter((s) => s.category === "Soft Skill").length
    const totalEndorsements = skills.reduce((sum, s) => sum + s.endorsements, 0)

    const filtered = skills.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const createErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.name && !newItem.name.trim()) e.name = "Skill name is required"
        if (touched.category && !newItem.category) e.category = "Category is required"
        return e
    }, [newItem, touched])

    const createSkill = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ name: true, category: true })
        if (!newItem.name.trim() || !newItem.category) {
            showWarning("Please fill all fields")
            return
        }
        setIsLoading(true)
        setTimeout(() => {
            setSkills([
                ...skills,
                {
                    id: Date.now().toString(),
                    name: newItem.name.trim(),
                    category: newItem.category,
                    endorsements: 0,
                },
            ])
            setIsCreateOpen(false)
            setNewItem({ name: "", category: "" })
            setTouched({})
            setIsLoading(false)
            showSuccess("Skill added")
        }, 400)
    }

    const updateSkill = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem || !editItem.name.trim() || !editItem.category) {
            showWarning("Please fill all fields")
            return
        }
        setIsLoading(true)
        setTimeout(() => {
            setSkills(skills.map((s) => (s.id === editItem.id ? editItem : s)))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            showSuccess("Skill updated")
        }, 400)
    }

    const deleteSkill = (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this skill?")
        if (!confirmed) return
        setSkills(skills.filter((s) => s.id !== id))
        showSuccess("Skill deleted")
    }

    const openEdit = (s: Skill) => {
        setEditItem({ ...s })
        setIsEditOpen(true)
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Skills Library</h1>
                        <p className="text-sm text-zinc-500 mt-1">Build a competency database for employee profiles and hiring.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem({ name: "", category: "" }); setTouched({}); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Skill
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Skills</p>
                        <p className="text-white text-xl font-semibold mt-1">{skills.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">In the library</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Technical Skills</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{technicalSkills}</p>
                        <p className="text-primary text-[10px] mt-1">Hard skills</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Soft Skills</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{softSkills}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Interpersonal</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Endorsements</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalEndorsements}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Across all skills</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search skills or categories..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Skill Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Category</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Endorsements</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <Award className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No skills found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((s) => (
                                        <tr key={s.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        <Tag size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-gray-600">{s.category}</td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    {s.endorsements}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => openEdit(s)} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => deleteSkill(s.id)}>
                                                            <Trash2 size={12} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) { setNewItem({ name: "", category: "" }); setTouched({}) } }}
                title="Add Skill"
                description="Register a new competency in the skills library."
                icon={<Award className="w-5 h-5" />}
                width="md"
                onSubmit={createSkill}
                submitLabel={isLoading ? "Adding..." : "Add Skill"}
                loading={isLoading}
                submitDisabled={!newItem.name.trim() || !newItem.category}
            >
                <div className="space-y-4">
                    <Field label="Skill Name" required error={createErrors.name}>
                        <Input
                            placeholder="e.g. Public Speaking"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Category" required error={createErrors.category}>
                        <Select
                            value={newItem.category}
                            onValueChange={(v) => { setNewItem({ ...newItem, category: v }); setTouched((t) => ({ ...t, category: true })) }}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditItem(null) }}
                title="Edit Skill"
                description="Update skill details and category."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={updateSkill}
                submitLabel={isLoading ? "Saving..." : "Save Changes"}
                loading={isLoading}
                submitDisabled={!editItem || !editItem.name.trim() || !editItem.category}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Skill Name" required>
                            <Input
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>

                        <Field label="Category" required>
                            <Select value={editItem.category} onValueChange={(v) => setEditItem({ ...editItem, category: v })}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Endorsements" hint="Number of endorsements from peers">
                            <Input
                                type="number"
                                value={editItem.endorsements}
                                onChange={(e) => setEditItem({ ...editItem, endorsements: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
