"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    Plus,
    Filter,
    Settings2,
    Save,
    Trash2,
    ChevronLeft,
    GripVertical,
    CheckCircle2,
    Info,
    LayoutGrid,
    Target,
    Zap,
    Scale
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Qualification Criteria ---
const INITIAL_CRITERIA = [
    { id: "1", name: "Budget Availability", type: "BANT", weight: 25, requiredAt: "SQL", fieldType: "Currency" },
    { id: "2", name: "Authority Level", type: "BANT", weight: 20, requiredAt: "SQL", fieldType: "Dropdown" },
    { id: "3", name: "Business Need", type: "BANT", weight: 30, requiredAt: "MQL", fieldType: "Text" },
    { id: "4", name: "Implementation Timeline", type: "BANT", weight: 15, requiredAt: "SQL", fieldType: "Date" },
    { id: "5", name: "Employee Count", type: "Firmographic", weight: 5, requiredAt: "Discovery", fieldType: "Number" },
    { id: "6", name: "Industry Relevance", type: "Firmographic", weight: 5, requiredAt: "Discovery", fieldType: "Dropdown" },
]

export default function QualificationFrameworkPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [criteria, setCriteria] = useState(INITIAL_CRITERIA)
    const [isSaving, setIsSaving] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [newItem, setNewItem] = useState({ name: "", type: "BANT", weight: 0, requiredAt: "SQL", fieldType: "Text" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0)

    const handleUpdateWeight = (id: string, newWeight: number) => {
        setCriteria(prev => prev.map(c => c.id === id ? { ...c, weight: Math.min(100, Math.max(0, newWeight)) } : c))
    }

    const handleDelete = (id: string) => {
        setCriteria(prev => prev.filter(c => c.id !== id))
        toast({ title: "Field Removed", description: "Qualification criteria has been deleted." })
    }

    const handleAddOrUpdate = () => {
        if (!newItem.name || newItem.weight <= 0) {
            toast({ title: "Incomplete Data", description: "Please provide a name and weight.", variant: "destructive" })
            return
        }
        if (editingItem) {
            setCriteria(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...newItem } : c))
            toast({ title: "Updated", description: "Criteria updated successfully." })
        } else {
            setCriteria([...criteria, { ...newItem, id: Math.random().toString(36).substr(2, 9) }])
            toast({ title: "Added", description: "New criteria added to the framework." })
        }
        setIsAddOpen(false)
        setEditingItem(null)
        setNewItem({ name: "", type: "BANT", weight: 0, requiredAt: "SQL", fieldType: "Text" })
    }

    const startEdit = (item: any) => {
        setEditingItem(item)
        setNewItem({ ...item })
        setIsAddOpen(true)
    }

    const handleSave = () => {
        if (totalWeight !== 100) {
            toast({
                title: "Invalid Weightage",
                description: "Total criteria weight must equal exactly 100%.",
                variant: "destructive"
            })
            return
        }
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Framework Updated",
                description: "Qualification model has been synchronized across the pipeline.",
            })
        }, 1200)
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Qualification Framework
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Standardize how leads are evaluated. Configure BANT fields and weighted criteria for MQL/SQL governance.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Advanced Config
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Save Framework</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Weightage Analytics */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-stretch min-h-[100px]">
                                <div className="p-6 md:w-64 bg-indigo-50 flex flex-col justify-center border-r border-slate-100">
                                    <span className="text-[10px] font-semibold text-indigo-400 tracking-wider leading-none">Total Model Weight</span>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <h3 className={`text-[32px] font-bold tracking-tighter ${totalWeight === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {totalWeight}%
                                        </h3>
                                        <span className="text-[14px] font-semibold text-slate-300">/ 100%</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-center gap-4">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                                <span className="text-[12px] font-semibold text-slate-600">BANT (90%)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-400" />
                                                <span className="text-[12px] font-semibold text-slate-600">Firmographic (10%)</span>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="h-6 border-slate-100 text-slate-400 font-semibold text-[10px]">
                                            Status: {totalWeight === 100 ? 'Balanced' : 'Imbalanced - Action Required'}
                                        </Badge>
                                    </div>
                                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden flex border border-slate-100">
                                        <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: '90%' }} />
                                        <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: '10%' }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Criteria Editor */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                            Criteria Definition <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-semibold text-[10px] h-5">{criteria.length}</Badge>
                        </h2>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 text-indigo-600 font-semibold text-[12px] hover:bg-indigo-50"
                                    onClick={() => { setEditingItem(null); setNewItem({ name: "", type: "BANT", weight: 0, requiredAt: "SQL", fieldType: "Text" }) }}
                                >
                                    <Plus size={14} className="mr-1.5" /> Add New Field
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-3xl p-6">
                                <DialogHeader>
                                    <DialogTitle>{editingItem ? 'Edit Criteria' : 'Add New Criteria'}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold">Field Name</Label>
                                        <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Implementation Timeline" className="h-11 rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[12px] font-semibold">Category</Label>
                                            <Select value={newItem.type} onValueChange={v => setNewItem({ ...newItem, type: v })}>
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="BANT">BANT</SelectItem>
                                                    <SelectItem value="Firmographic">Firmographic</SelectItem>
                                                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[12px] font-semibold">Weight (%)</Label>
                                            <Input type="number" value={newItem.weight} onChange={e => setNewItem({ ...newItem, weight: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[12px] font-semibold">Required at</Label>
                                            <Select value={newItem.requiredAt} onValueChange={v => setNewItem({ ...newItem, requiredAt: v })}>
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Discovery">Discovery</SelectItem>
                                                    <SelectItem value="MQL">MQL</SelectItem>
                                                    <SelectItem value="SQL">SQL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[12px] font-semibold">Field Type</Label>
                                            <Select value={newItem.fieldType} onValueChange={v => setNewItem({ ...newItem, fieldType: v })}>
                                                <SelectTrigger className="h-11 rounded-xl">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Text">Text</SelectItem>
                                                    <SelectItem value="Dropdown">Dropdown</SelectItem>
                                                    <SelectItem value="Number">Number</SelectItem>
                                                    <SelectItem value="Date">Date</SelectItem>
                                                    <SelectItem value="Currency">Currency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleAddOrUpdate}>
                                    {editingItem ? 'Update Field' : 'Add to Framework'}
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-3">
                        {criteria.map((item) => (
                            <Card key={item.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex items-stretch">
                                        <div className="w-10 flex flex-col items-center justify-center border-r border-slate-50 group-hover:bg-indigo-50/30 transition-colors">
                                            <GripVertical size={16} className="text-slate-300 group-hover:text-indigo-300" />
                                        </div>
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-[15px] font-semibold text-slate-900 truncate">{item.name}</h4>
                                                    <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-100 border-none font-semibold text-[9px] uppercase tracking-wider">{item.type}</Badge>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-medium text-slate-400">Field: <span className="font-semibold text-slate-600">{item.fieldType}</span></span>
                                                    <span className="text-slate-200">•</span>
                                                    <span className="text-[11px] font-medium text-slate-400">Required at: <span className="font-semibold text-indigo-500">{item.requiredAt}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider">Weight (%)</span>
                                                    <div className="flex items-center gap-3">
                                                        <Input
                                                            type="number"
                                                            value={item.weight}
                                                            onChange={(e) => handleUpdateWeight(item.id, parseInt(e.target.value) || 0)}
                                                            className="w-16 h-8 text-right font-semibold tabular-nums border-slate-100 bg-slate-50 focus-visible:ring-indigo-500 rounded-lg text-[13px]"
                                                        />
                                                        <div className="w-16 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{ width: `${item.weight}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                        <Settings2 size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Governance Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Stage Enforcement</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-500">Automatically block stage movement if fields are missing.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {[
                                { stage: "MQL Movement", desc: "Require Need & Fit scores", active: true },
                                { stage: "SQL Movement", desc: "Require Budget & Authority", active: true },
                                { stage: "Discovery Done", desc: "Require Company Profile", active: false },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-semibold text-slate-700">{s.stage}</p>
                                        <p className="text-[10px] font-medium text-slate-400">{s.desc}</p>
                                    </div>
                                    <Switch checked={s.active} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-50 text-slate-900 border border-slate-100 p-1">
                        <CardContent className="p-6 space-y-4">
                            <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-indigo-600 shadow-sm w-fit">
                                <Target size={20} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[16px] font-semibold text-slate-900">Predictive Model Active</h4>
                                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                                    System is currently weighting historical wins (3.2k deals) to validate your criteria weights.
                                </p>
                            </div>
                            <div className="pt-2">
                                <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-slate-400 tracking-wider">
                                    <span>Model Confidence</span>
                                    <span className="text-emerald-500">94%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                                    <div className="h-full bg-emerald-500 w-[94%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    )
}
