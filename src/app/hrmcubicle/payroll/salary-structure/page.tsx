"use client"

import React, { useState, useMemo } from "react"
import {
    Layers, Plus, Edit, Trash2, Eye, Download, Search, CheckCircle2,
    DollarSign, Users, Percent, Settings, Copy
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table"
import {
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/shared/components/ui/tabs"

interface SalaryComponent {
    id: string
    name: string
    type: "Earning" | "Deduction" | "Employer Contribution"
    calculationType: "Fixed" | "Percentage of Basic" | "Percentage of CTC"
    value: number
    isTaxable: boolean
    isStatutory: boolean
}

interface SalaryTemplate {
    id: string
    name: string
    description: string
    level: string
    components: SalaryComponent[]
    assignedCount: number
    isActive: boolean
}

const defaultComponents: SalaryComponent[] = [
    { id: "c1", name: "Basic Salary", type: "Earning", calculationType: "Percentage of CTC", value: 40, isTaxable: true, isStatutory: true },
    { id: "c2", name: "HRA", type: "Earning", calculationType: "Percentage of Basic", value: 50, isTaxable: true, isStatutory: false },
    { id: "c3", name: "Special Allowance", type: "Earning", calculationType: "Fixed", value: 15000, isTaxable: true, isStatutory: false },
    { id: "c4", name: "Conveyance Allowance", type: "Earning", calculationType: "Fixed", value: 1600, isTaxable: false, isStatutory: false },
    { id: "c5", name: "Medical Allowance", type: "Earning", calculationType: "Fixed", value: 1250, isTaxable: false, isStatutory: false },
    { id: "c6", name: "PF (Employee)", type: "Deduction", calculationType: "Percentage of Basic", value: 12, isTaxable: false, isStatutory: true },
    { id: "c7", name: "Professional Tax", type: "Deduction", calculationType: "Fixed", value: 200, isTaxable: false, isStatutory: true },
    { id: "c8", name: "PF (Employer)", type: "Employer Contribution", calculationType: "Percentage of Basic", value: 12, isTaxable: false, isStatutory: true },
    { id: "c9", name: "ESI (Employer)", type: "Employer Contribution", calculationType: "Percentage of Basic", value: 3.25, isTaxable: false, isStatutory: true },
]

const mockTemplates: SalaryTemplate[] = [
    { id: "t1", name: "Standard - Junior", description: "For junior level employees (L1-L3)", level: "Junior", components: defaultComponents, assignedCount: 48, isActive: true },
    { id: "t2", name: "Standard - Mid Level", description: "For mid level employees (L4-L6)", level: "Mid", components: defaultComponents.map(c => c.id === "c3" ? { ...c, value: 25000 } : c), assignedCount: 62, isActive: true },
    { id: "t3", name: "Standard - Senior", description: "For senior level employees (L7-L9)", level: "Senior", components: defaultComponents.map(c => c.id === "c3" ? { ...c, value: 40000 } : c.id === "c5" ? { ...c, value: 2500 } : c), assignedCount: 25, isActive: true },
    { id: "t4", name: "Executive Package", description: "For CXO and VP level", level: "Executive", components: [...defaultComponents, { id: "c10", name: "Car Allowance", type: "Earning" as const, calculationType: "Fixed" as const, value: 25000, isTaxable: true, isStatutory: false }], assignedCount: 7, isActive: true },
    { id: "t5", name: "Intern Stipend", description: "For interns and trainees", level: "Intern", components: defaultComponents.filter(c => ["c1", "c3", "c7"].includes(c.id)), assignedCount: 12, isActive: false },
]

export default function SalaryStructurePage() {
    const { toast } = useToast()
    const [templates, setTemplates] = useState<SalaryTemplate[]>(mockTemplates)
    const [activeTab, setActiveTab] = useState("templates")
    const [searchTerm, setSearchTerm] = useState("")
    const [viewingTemplate, setViewingTemplate] = useState<SalaryTemplate | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const stats = useMemo(() => {
        const activeTemplates = templates.filter(t => t.isActive).length
        const totalAssigned = templates.reduce((s, t) => s + t.assignedCount, 0)
        const totalComponents = new Set(templates.flatMap(t => t.components.map(c => c.name))).size
        return { activeTemplates, totalAssigned, totalComponents }
    }, [templates])

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.level.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleExport = () => {
        const csv = ["Template,Level,Assigned,Status", ...templates.map(t => `${t.name},${t.level},${t.assignedCount},${t.isActive ? "Active" : "Inactive"}`)].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "salary_structures.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: "Salary structures exported." })
    }

    const handleDuplicate = (template: SalaryTemplate) => {
        const newTemplate: SalaryTemplate = {
            ...template,
            id: `t${templates.length + 1}`,
            name: `${template.name} (Copy)`,
            assignedCount: 0,
        }
        setTemplates([...templates, newTemplate])
        toast({ title: "Template Duplicated", description: `${newTemplate.name} created.` })
    }

    const handleDelete = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id))
        toast({ title: "Template Deleted" })
    }

    const handleToggle = (id: string) => {
        setTemplates(templates.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t))
        toast({ title: "Status Updated" })
    }

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "90%" }}>
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Layers size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Salary Structure</h1>
                        <p className="text-xs font-semibold text-slate-500">Manage salary templates, components & assignments</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={handleExport}><Download size={14} /> Export</Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs" onClick={() => toast({ title: "New Template", description: "Salary structure template creation form would open here." })}><Plus size={14} className="mr-1.5" /> New Template</Button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 pb-32">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Active Templates", val: stats.activeTemplates, icon: Layers, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/20", cardBg: "bg-[#CB9DF0]/15 border-[#CB9DF0]/30" },
                        { label: "Total Employees Assigned", val: stats.totalAssigned, icon: Users, color: "text-blue-600", bg: "bg-blue-100", cardBg: "bg-blue-50 border-blue-200" },
                        { label: "Salary Components", val: stats.totalComponents, icon: Settings, color: "text-amber-600", bg: "bg-amber-100", cardBg: "bg-amber-50 border-amber-200" },
                        { label: "Compliance Rate", val: "100%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50 border-emerald-200" },
                    ].map((s, i) => (
                        <Card key={i} className={cn("rounded-2xl border shadow-sm", s.cardBg)}>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", s.bg)}><s.icon size={20} className={s.color} /></div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-600 mb-1">{s.label}</p>
                                        <p className="text-xl font-bold text-slate-900">{s.val}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                        <TabsTrigger value="templates" className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">Templates</TabsTrigger>
                        <TabsTrigger value="components" className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">Components Master</TabsTrigger>
                    </TabsList>

                    <TabsContent value="templates" className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search templates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rounded-lg border-slate-200 h-10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredTemplates.map(template => (
                                <Card key={template.id} className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all", template.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-70")}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Layers size={22} /></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-bold text-slate-900">{template.name}</h3>
                                                        <Badge className={cn("text-[8px] font-bold border-none", template.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>{template.isActive ? "Active" : "Inactive"}</Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setViewingTemplate(template); setIsDetailOpen(true); }}><Eye size={13} className="text-slate-400" /></Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDuplicate(template)}><Copy size={13} className="text-slate-400" /></Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(template.id)}><Trash2 size={13} className="text-red-400" /></Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-xl">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Level</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5">{template.level}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Components</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5">{template.components.length}</p>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Assigned</p>
                                                <p className="text-xs font-bold text-slate-700 mt-0.5">{template.assignedCount} employees</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {template.components.slice(0, 5).map(c => (
                                                <Badge key={c.id} variant="outline" className="text-[9px] font-medium bg-slate-50 text-slate-500 border-slate-100">{c.name}</Badge>
                                            ))}
                                            {template.components.length > 5 && (
                                                <Badge variant="outline" className="text-[9px] font-medium bg-[#8B5CF6]/5 text-[#8B5CF6] border-[#8B5CF6]/20">+{template.components.length - 5} more</Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="components" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Salary Components Master List</h3>
                                    <Button variant="outline" className="h-9 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={() => toast({ title: "Add Component", description: "Component creation form would open here." })}><Plus size={14} /> Add Component</Button>
                                </div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Component</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Calculation</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right">Value</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-center">Taxable</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-center">Statutory</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {defaultComponents.map(c => (
                                            <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/50">
                                                <TableCell className="pl-5 font-bold text-sm text-slate-900">{c.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("font-bold text-[9px]",
                                                        c.type === "Earning" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            c.type === "Deduction" ? "bg-red-50 text-red-600 border-red-100" :
                                                                "bg-blue-50 text-blue-600 border-blue-100"
                                                    )}>{c.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-600">{c.calculationType}</TableCell>
                                                <TableCell className="text-right font-bold text-xs text-slate-900">
                                                    {c.calculationType === "Fixed" ? `₹${c.value.toLocaleString()}` : `${c.value}%`}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {c.isTaxable ? <CheckCircle2 size={14} className="text-amber-500 mx-auto" /> : <span className="text-slate-300 text-xs">-</span>}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {c.isStatutory ? <CheckCircle2 size={14} className="text-blue-500 mx-auto" /> : <span className="text-slate-300 text-xs">-</span>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Template Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{viewingTemplate?.name}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">{viewingTemplate?.description}</DialogDescription>
                    </DialogHeader>
                    {viewingTemplate && (
                        <div className="space-y-4 py-2">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Level</p><p className="text-sm font-bold text-slate-900 mt-0.5">{viewingTemplate.level}</p></div>
                                <div className="p-3 bg-[#8B5CF6]/5 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Assigned</p><p className="text-sm font-bold text-[#8B5CF6] mt-0.5">{viewingTemplate.assignedCount} employees</p></div>
                                <div className="p-3 bg-emerald-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Status</p><p className="text-sm font-bold text-emerald-600 mt-0.5">{viewingTemplate.isActive ? "Active" : "Inactive"}</p></div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700 mb-3">Salary Breakdown</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow><TableHead className="font-bold text-slate-300 text-[9px] uppercase">Component</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase">Type</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase text-right">Value</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase text-center">Taxable</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {viewingTemplate.components.map(c => (
                                            <TableRow key={c.id} className="border-slate-50">
                                                <TableCell className="font-bold text-xs text-slate-700">{c.name}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("text-[8px] font-bold", c.type === "Earning" ? "bg-emerald-50 text-emerald-600" : c.type === "Deduction" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>{c.type}</Badge></TableCell>
                                                <TableCell className="text-right font-bold text-xs">{c.calculationType === "Fixed" ? `₹${c.value.toLocaleString()}` : `${c.value}%`}</TableCell>
                                                <TableCell className="text-center text-xs">{c.isTaxable ? "Yes" : "No"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
