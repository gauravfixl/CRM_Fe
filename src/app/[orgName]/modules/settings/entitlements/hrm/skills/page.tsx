"use client"

import { useState } from "react"
import {
    Award,
    Search,
    Plus,
    MoreHorizontal,
    Star,
    Tag,
    Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

    const createSkill = () => {
        if (!newItem.name || !newItem.category) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setSkills([
                ...skills,
                {
                    id: Date.now().toString(),
                    name: newItem.name,
                    category: newItem.category,
                    endorsements: 0,
                },
            ])
            setIsCreateOpen(false)
            setNewItem({ name: "", category: "" })
            setIsLoading(false)
            toast.success("Skill added")
        }, 800)
    }

    const updateSkill = () => {
        if (!editItem || !editItem.name || !editItem.category) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setSkills(skills.map((s) => (s.id === editItem.id ? editItem : s)))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            toast.success("Skill updated")
        }, 800)
    }

    const deleteSkill = (id: string) => {
        setSkills(skills.filter((s) => s.id !== id))
        toast.success("Skill deleted")
    }

    const openEdit = (s: Skill) => {
        setEditItem({ ...s })
        setIsEditOpen(true)
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Skills</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Skills Library</h1>
                        <p className="text-xs text-gray-500 font-medium">Competency database for employee profiles.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                                <Plus className="w-4 h-4" />
                                New skill
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                            <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                <DialogTitle className="text-white font-semibold">Add skill</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Skill name</Label>
                                    <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Public Speaking" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Category</Label>
                                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                                        <SelectTrigger className="h-9 rounded-lg">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={createSkill} disabled={isLoading} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                                    {isLoading ? "Creating..." : "Add skill"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total skills</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{skills.length}</p>
                                <p className="text-[10px] text-white/80">In library</p>
                            </div>
                            <Award className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Technical skills</p>
                                <p className="text-xl font-semibold text-gray-900">{technicalSkills}</p>
                                <p className="text-[10px] text-gray-500">Hard skills</p>
                            </div>
                            <Tag className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Soft skills</p>
                                <p className="text-xl font-semibold text-gray-900">{softSkills}</p>
                                <p className="text-[10px] text-gray-500">Interpersonal</p>
                            </div>
                            <Heart className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total endorsements</p>
                                <p className="text-xl font-semibold text-gray-900">{totalEndorsements}</p>
                                <p className="text-[10px] text-gray-500">Across all skills</p>
                            </div>
                            <Star className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            placeholder="Search skills..."
                            className="pl-9 h-9 rounded-lg text-xs font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Skill name</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Category</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Endorsements</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((s) => (
                            <TableRow key={s.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-gray-600">{s.category}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        {s.endorsements}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                            <DropdownMenuItem onClick={() => openEdit(s)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteSkill(s.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Edit skill</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Skill name</Label>
                                    <Input className="h-9 rounded-lg" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Category</Label>
                                    <Select value={editItem.category} onValueChange={(v) => setEditItem({ ...editItem, category: v })}>
                                        <SelectTrigger className="h-9 rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Endorsements</Label>
                                    <Input className="h-9 rounded-lg" type="number" value={editItem.endorsements} onChange={(e) => setEditItem({ ...editItem, endorsements: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={updateSkill} disabled={isLoading} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
