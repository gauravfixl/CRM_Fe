"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    ChevronLeft,
    GitBranch,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Scale,
    MousePointer2,
    Target,
    BarChart3,
    Settings2,
    GitCommit,
    Layers,
    Info,
    Search,
    X,
    Pencil,
    Trash2
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

interface AttributionModel {
    id: string
    name: string
    description: string
    useCase: string
    status: string
    popularity: number
}

const INITIAL_MODELS: AttributionModel[] = [
    { id: "1", name: "First-Touch Attribution", description: "Gives 100% of the credit to the first source the lead interacted with.", useCase: "Best for measuring Brand Awareness & Lead Gen efficiency.", status: "Active", popularity: 42 },
    { id: "2", name: "Last-Touch Attribution", description: "Gives 100% of the credit to the last source before conversion.", useCase: "Best for identifying high-intent closing channels.", status: "Inactive", popularity: 18 },
    { id: "3", name: "Linear Attribution", description: "Distributes credit equally across all touchpoints in the journey.", useCase: "Best for comprehensive journey mapping.", status: "Beta", popularity: 12 },
    { id: "4", name: "Time-Decay Attribution", description: "Credit increases as touchpoints get closer to the conversion moment.", useCase: "Best for short sales cycles and urgent promos.", status: "Enterprise Only", popularity: 28 },
]

interface FormState {
    name: string
    description: string
    useCase: string
    popularity: string
}

interface FormErrors {
    name?: string
    description?: string
    useCase?: string
    popularity?: string
}

const ATTR_WINDOWS = [
    { value: "24h", label: "24 Hours" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days (Standard)" },
    { value: "90", label: "90 Days (Enterprise)" },
]

export default function LeadAttributionPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [models, setModels] = useState<AttributionModel[]>(INITIAL_MODELS)
    const [activeModel, setActiveModel] = useState("1")
    const [attrWindow, setAttrWindow] = useState("30")
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>({ name: "", description: "", useCase: "", popularity: "10" })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.name.trim()) newErrors.name = "Model name is required"
        else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        else if (form.name.trim().length > 50) newErrors.name = "Name must be under 50 characters"
        else if (models.some(m => m.name.toLowerCase() === form.name.trim().toLowerCase() && m.id !== editingId)) {
            newErrors.name = "A model with this name already exists"
        }

        if (!form.description.trim()) newErrors.description = "Description is required"
        else if (form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters"

        if (!form.useCase.trim()) newErrors.useCase = "Use case is required"
        else if (form.useCase.trim().length < 5) newErrors.useCase = "Use case must be at least 5 characters"

        if (!form.popularity.trim()) newErrors.popularity = "Popularity is required"
        else if (!/^\d+$/.test(form.popularity.trim())) newErrors.popularity = "Must be a whole number"
        else if (parseInt(form.popularity) < 0 || parseInt(form.popularity) > 100) newErrors.popularity = "Must be between 0 and 100"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", description: "", useCase: "", popularity: "10" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (m: AttributionModel) => {
        setEditingId(m.id)
        setForm({ name: m.name, description: m.description, useCase: m.useCase, popularity: m.popularity.toString() })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        if (editingId) {
            setModels(models.map(m => m.id === editingId ? { ...m, name: form.name.trim(), description: form.description.trim(), useCase: form.useCase.trim(), popularity: parseInt(form.popularity) } : m))
            toast({ title: "Model Updated", description: "Attribution model saved." })
        } else {
            const newModel: AttributionModel = {
                id: Math.random().toString(36).substring(2, 11),
                name: form.name.trim(),
                description: form.description.trim(),
                useCase: form.useCase.trim(),
                status: "Beta",
                popularity: parseInt(form.popularity)
            }
            setModels([...models, newModel])
            toast({ title: "Model Created", description: "New attribution model added." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ name: "", description: "", useCase: "", popularity: "10" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        if (id === activeModel) {
            toast({ title: "Cannot Delete", description: "This model is currently active. Switch to another first.", variant: "destructive" })
            return
        }
        setModels(models.filter(m => m.id !== id))
        toast({ title: "Model Removed", description: "Attribution model deleted." })
    }

    const filteredModels = useMemo(() => {
        return models.filter(m => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [models, searchQuery])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-indigo-50 via-pink-50 to-amber-50 p-6 rounded-none border border-indigo-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm">
                                <GitBranch className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Lead Attribution Engine
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Decide which source gets credit for every conversion. Configure models to reflect your marketing strategy and sales cycle.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Loading attribution comparison lab..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Comparison Lab
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Custom Model
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Active Model & Configuration Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8 space-y-8">
                        <div className="flex justify-between items-start gap-3 flex-wrap">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Attribution Model Selection</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Changing this will recalculate results across all performance dashboards.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {showSearch ? (
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-none px-2 h-8">
                                        <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                        <Input
                                            autoFocus
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Filter models..."
                                            className="border-none h-6 px-0 text-[12px] focus-visible:ring-0 w-32 bg-transparent"
                                        />
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowSearch(false); setSearchQuery("") }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(true)}>
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </Button>
                                )}
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wider rounded-none">Syncing Live</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredModels.map((model) => (
                                <div
                                    key={model.id}
                                    onClick={() => { setActiveModel(model.id); toast({ description: `Attribution engine updated to ${model.name}.` }) }}
                                    className={`relative p-6 rounded-none border-2 transition-all cursor-pointer group ${activeModel === model.id
                                        ? 'border-indigo-600 bg-indigo-50/40 shadow-lg shadow-indigo-100'
                                        : 'border-slate-100 bg-slate-50/40 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2.5 rounded-none ${activeModel === model.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                            {model.id === "1" ? <Target size={18} /> :
                                                model.id === "2" ? <MousePointer2 size={18} /> :
                                                    model.id === "3" ? <Layers size={18} /> :
                                                        <Clock size={18} />}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {activeModel === model.id && (
                                                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); openEdit(model) }}>
                                                <Pencil size={12} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-rose-500" onClick={(e) => { e.stopPropagation(); handleDelete(model.id) }}>
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[15px] font-semibold text-slate-900">{model.name}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">{model.description}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center justify-between">
                                        <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase shrink-0">Usage</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-20 bg-slate-100 rounded-none overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${model.popularity}%` }} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-700">{model.popularity}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredModels.length === 0 && (
                                <div className="md:col-span-2 p-8 text-center text-slate-400 text-[12px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                    No models match your search.
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-none bg-indigo-50 text-indigo-900 space-y-4 shadow-sm border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[13px] font-semibold tracking-tight">Attribution Logic Preview</h4>
                                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-100 text-[9px] font-semibold uppercase rounded-none">MODE: {models.find(m => m.id === activeModel)?.name.split(' ')[0] ?? "—"}</Badge>
                            </div>
                            <div className="flex items-center gap-4 relative py-4">
                                <div className="absolute left-0 right-0 h-px bg-indigo-200 top-1/2 -z-0" />
                                {[
                                    { label: "Google Ad", val: "Credit: 100%", active: true },
                                    { label: "Direct", val: "Credit: 0%", active: false },
                                    { label: "Email", val: "Credit: 0%", active: false },
                                    { label: "Conversion", icon: CheckCircle2, active: true },
                                ].map((step, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10">
                                        {step.icon ? (
                                            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-indigo-50 shadow-md">
                                                <step.icon size={16} />
                                            </div>
                                        ) : (
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-semibold ring-4 ring-indigo-50 shadow-md ${step.active ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-400'}`}>
                                                0{i + 1}
                                            </div>
                                        )}
                                        <div className="text-center space-y-0.5">
                                            <p className="text-[11px] font-semibold">{step.label}</p>
                                            {step.val && <p className={`text-[9px] font-semibold uppercase tracking-wider ${step.active ? 'text-indigo-600' : 'text-slate-400'}`}>{step.val}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-none bg-cyan-50 text-cyan-600 border border-cyan-100">
                                    <Clock size={20} />
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">Attribution Window</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                    Define how long the platform remembers a touchpoint before it expires.
                                </p>
                                <Select value={attrWindow} onValueChange={(v) => { setAttrWindow(v); toast({ description: `Attribution window set to ${ATTR_WINDOWS.find(w => w.value === v)?.label}.` }) }}>
                                    <SelectTrigger className="rounded-none border-slate-200 font-semibold text-[13px] h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {ATTR_WINDOWS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-none bg-amber-50 text-amber-600 border border-amber-100">
                                    <Scale size={20} />
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">Custom Weighting</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                    Assign specific credit percentages to key events like "Demo Requested".
                                </p>
                                <Button variant="outline" onClick={openCreate} className="w-full h-10 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest hover:bg-slate-50">
                                    Build Custom Model
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Attribution Health Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-none bg-indigo-50 text-indigo-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Engine Integrity</h4>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            {[
                                { label: "Multi-Touch Visibility", val: 100, status: "Healthy" },
                                { label: "Cookie Integrity", val: 82, status: "Warning" },
                                { label: "Mobile Cross-Tracking", val: 64, status: "Action Required" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold">
                                        <span className="text-slate-500">{s.label}</span>
                                        <span className={s.status === 'Healthy' ? 'text-emerald-600' : s.status === 'Warning' ? 'text-amber-500' : 'text-rose-500'}>{s.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none overflow-hidden">
                                        <div className={`h-full ${s.status === 'Healthy' ? 'bg-indigo-600' : s.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-emerald-50 text-emerald-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500 transition-transform group-hover:scale-110">
                            <GitCommit size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold underline decoration-emerald-200 decoration-2 underline-offset-4 relative z-10">Identity Stitching</h4>
                        <p className="text-[12px] text-emerald-700 font-medium leading-relaxed relative z-10">
                            Merge and resolve identities across multiple devices (Desktop, Mobile) to ensure a single journey trace.
                        </p>
                        <Button onClick={() => toast({ description: "Stitching service compiling identity nodes..." })} className="w-full h-10 rounded-none bg-white text-emerald-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Setup Stitching
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-none bg-white text-indigo-600 border border-indigo-200 shadow-sm">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Model Impact</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Switching to Last-Touch will likely increase 'Meta Ads' attribution by 24% while decreasing 'Organic' by 12%."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit Attribution Model" : "Build Custom Attribution Model"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the model definition." : "Define a new attribution model with custom logic."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Model Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                                placeholder="e.g., Position-Based Attribution"
                                className={`h-11 rounded-none ${errors.name ? "border-rose-500" : ""}`}
                            />
                            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                            <Input
                                name="description"
                                value={form.description}
                                onChange={e => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: undefined }) }}
                                placeholder="How does this model distribute credit?"
                                className={`h-11 rounded-none ${errors.description ? "border-rose-500" : ""}`}
                            />
                            {errors.description && <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Use Case <span className="text-rose-500">*</span></Label>
                            <Input
                                name="useCase"
                                value={form.useCase}
                                onChange={e => { setForm({ ...form, useCase: e.target.value }); if (errors.useCase) setErrors({ ...errors, useCase: undefined }) }}
                                placeholder="e.g., Best for long sales cycles"
                                className={`h-11 rounded-none ${errors.useCase ? "border-rose-500" : ""}`}
                            />
                            {errors.useCase && <p className="text-[11px] text-rose-500 font-medium">{errors.useCase}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Initial Popularity (%) <span className="text-rose-500">*</span></Label>
                            <Input
                                name="popularity"
                                type="number"
                                min={0}
                                max={100}
                                value={form.popularity}
                                onChange={e => { setForm({ ...form, popularity: e.target.value }); if (errors.popularity) setErrors({ ...errors, popularity: undefined }) }}
                                placeholder="0-100"
                                className={`h-11 rounded-none ${errors.popularity ? "border-rose-500" : ""}`}
                            />
                            {errors.popularity && <p className="text-[11px] text-rose-500 font-medium">{errors.popularity}</p>}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Create Model"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
