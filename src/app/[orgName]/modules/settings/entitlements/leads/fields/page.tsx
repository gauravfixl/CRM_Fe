"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import {
    Settings,
    Plus,
    MoreVertical,
    Search,
    Filter,
    GripVertical,
    FileText,
    Layout,
    Eye,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    ChevronDown,
    ChevronUp,
    Columns,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { getLeadListByOrg } from "@/hooks/leadHooks"

// Lead model schema definition - mirrors backend Lead model fields
const LEAD_SCHEMA_FIELDS = [
    { id: "f-name", label: "Full Name", apiKey: "name", type: "Text", required: true, inConversion: true, system: true },
    { id: "f-email", label: "Work Email", apiKey: "email", type: "Email", required: true, inConversion: true, system: true },
    { id: "f-company", label: "Company Name", apiKey: "company", type: "Text", required: true, inConversion: true, system: true },
    { id: "f-phone", label: "Phone Number", apiKey: "phone", type: "Phone", required: false, inConversion: true, system: true },
    { id: "f-source", label: "Lead Source", apiKey: "source", type: "Select", required: false, inConversion: true, system: true },
    { id: "f-stage", label: "Stage", apiKey: "stage", type: "Select", required: true, inConversion: false, system: true },
    { id: "f-estimatedValue", label: "Estimated Value", apiKey: "estimatedValue", type: "Number", required: false, inConversion: false, system: false },
    { id: "f-probability", label: "Probability (%)", apiKey: "probability", type: "Number", required: false, inConversion: false, system: false },
    { id: "f-assignedTo", label: "Assigned To", apiKey: "assignedTo", type: "Text", required: false, inConversion: true, system: true },
    { id: "f-owner", label: "Owner", apiKey: "owner", type: "Text", required: false, inConversion: true, system: true },
    { id: "f-tags", label: "Tags", apiKey: "tags", type: "Text", required: false, inConversion: false, system: false },
]

export default function LeadFieldsLayoutsPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [isFieldOpen, setIsFieldOpen] = useState(false)
    const [editingField, setEditingField] = useState<any>(null)
    const [leads, setLeads] = useState<any[]>([])

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await getLeadListByOrg()
                setLeads(res?.data?.data || [])
            } catch (error) {
                console.error("Failed to fetch leads for fields:", error)
                toast.error("Failed to load lead field data")
            } finally {
                setIsFetching(false)
            }
        }
        fetchLeads()
    }, [])

    // Derive field fill rates from actual lead data
    const fieldFillRates = useMemo(() => {
        if (leads.length === 0) return {}
        const rates: Record<string, number> = {}
        LEAD_SCHEMA_FIELDS.forEach(f => {
            const filled = leads.filter(l => {
                const val = l[f.apiKey]
                return val !== undefined && val !== null && val !== ""
            }).length
            rates[f.apiKey] = Math.round((filled / leads.length) * 100)
        })
        return rates
    }, [leads])

    const systemFieldCount = LEAD_SCHEMA_FIELDS.filter(f => f.system).length
    const customFieldCount = LEAD_SCHEMA_FIELDS.filter(f => !f.system).length

    const [fields, setFields] = useState(
        LEAD_SCHEMA_FIELDS.map(f => ({ ...f, status: "ACTIVE" as string }))
    )

    const [behaviors, setBehaviors] = useState({
        stickyConversion: true,
        tooltips: true,
        compactMode: false
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const startAddField = () => {
        setEditingField({ id: Date.now().toString(), label: "", type: "Text", required: false, inConversion: false, status: "ACTIVE", system: false })
        setIsFieldOpen(true)
    }

    const startEditField = (field: any) => {
        setEditingField({ ...field })
        setIsFieldOpen(true)
    }

    const saveField = () => {
        if (!editingField.label) {
            toast.error("Label is required")
            return
        }
        setFields(prev => {
            const exists = prev.find(f => f.id === editingField.id)
            if (exists) return prev.map(f => f.id === editingField.id ? editingField : f)
            return [...prev, editingField]
        })
        setIsFieldOpen(false)
        toast.success(`Field configuration saved`)
    }

    const toggleFieldStatus = (id: string) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : f))
        toast.success("Field status updated")
    }

    const deleteField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id))
        toast.success("Field deleted from library")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-semibold text-gray-900">Fields and Layout Editor</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-medium">Master Schema</Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Standardize captured information and control visual lead layouts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Preview mode active")}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Form
                    </Button>
                    <Button
                        onClick={startAddField}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Custom Field
                    </Button>
                </div>
            </div>

            {/* SCHEMA INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-white text-xs opacity-80">Total Fields</p>
                            <p className="text-white text-xl font-semibold">{fields.length} Fields</p>
                            <p className="text-[10px] text-white opacity-80">{systemFieldCount} System / {customFieldCount} Custom</p>
                        </div>
                        <FileText className="w-5 h-5 text-white opacity-80" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Active Layouts</p>
                            <p className="text-xl font-semibold text-gray-900">03 Models</p>
                            <p className="text-[10px] text-zinc-400 font-medium">Standardized by Org</p>
                        </div>
                        <Layout className="w-5 h-5 text-blue-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Conversion Mapping</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : `${Math.round((fields.filter(f => f.inConversion).length / fields.length) * 100)}%`}</p>
                            <p className="text-[10px] text-emerald-600 font-medium">{fields.filter(f => f.inConversion).length} fields mapped to Client</p>
                        </div>
                        <Lock className="w-5 h-5 text-emerald-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Compliance</p>
                            <p className="text-xl font-semibold text-gray-900">Secured</p>
                            <p className="text-[10px] text-zinc-400 font-medium">Data masking active</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-zinc-300" />
                    </SmallCardContent>
                </SmallCard>
            </div>

            <Tabs defaultValue="library" className="w-full">
                <TabsList className="bg-zinc-100 p-1 rounded-xl h-11 mb-6 border border-zinc-200 shadow-sm flex-shrink-0 w-fit">
                    <TabsTrigger value="library" className="rounded-lg text-xs font-medium px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
                        Field Library
                    </TabsTrigger>
                    <TabsTrigger value="editor" className="rounded-lg text-xs font-medium px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
                        Layout Editor
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="mt-0">
                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Search library..."
                                    className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-medium text-zinc-500 hover:bg-zinc-100" onClick={() => toast.info("Field type manager opening...")}>
                                    <Columns className="w-3.5 h-3.5 mr-2" />
                                    Manage Types
                                </Button>
                            </div>
                        </div>

                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="hover:bg-transparent border-b-zinc-100">
                                    <TableHead className="py-4 px-6 text-[11px] font-medium text-gray-500">Field Label</TableHead>
                                    <TableHead className="py-4 text-[11px] font-medium text-gray-500">Type</TableHead>
                                    <TableHead className="py-4 text-[11px] font-medium text-gray-500 text-center">Required</TableHead>
                                    <TableHead className="py-4 text-[11px] font-medium text-gray-500 text-center">Conversion</TableHead>
                                    <TableHead className="py-4 text-[11px] font-medium text-gray-500">Status</TableHead>
                                    <TableHead className="py-4 text-right pr-6 text-[11px] font-medium text-gray-500">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field) => (
                                    <TableRow key={field.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${field.system ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{field.label}</span>
                                                    {field.system && <span className="text-[9px] font-medium text-zinc-400 mt-0.5">System Locked</span>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className="text-[10px] font-medium border-zinc-200 text-zinc-500 bg-white shadow-sm px-2 h-5 rounded-md">
                                                {field.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            {field.required ? <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" /> : <XCircle className="w-4 h-4 text-zinc-200 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            {field.inConversion ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-zinc-200 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${field.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}>
                                                {field.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 text-zinc-300">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={field.system}
                                                    onClick={() => startEditField(field)}
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-50 rounded-lg">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                        <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400 px-2 py-1.5">Configure Field</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer"
                                                            onClick={() => toggleFieldStatus(field.id)}
                                                        >
                                                            {field.status === 'ACTIVE' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                                            {field.status === 'ACTIVE' ? 'Deactivate Field' : 'Activate Field'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-50" />
                                                        <DropdownMenuItem
                                                            disabled={field.system}
                                                            className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer"
                                                            onClick={() => deleteField(field.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Delete Forever
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                            <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" />
                                Required fields marked with blue dot are system-locked and used for core logic.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium transition-colors" disabled>Prev</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors" onClick={() => toast.info("Loading next page...")}>Next</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="editor" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Default Layout Draft</h3>
                                    <p className="text-[11px] text-zinc-400 font-medium">Reorder sections and fields by dragging.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-medium border-zinc-200" onClick={() => toast.info("Layout reset to default")}>Reset</Button>
                                    <Button className="h-9 px-6 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100" onClick={() => handleAction("Layout published to all firms")}>Publish Layout</Button>
                                </div>
                            </div>

                            <div className="p-8 space-y-6 bg-zinc-50/30">
                                <LayoutSection title="Basic Information" icon={FileText} fields={["Full Name", "Work Email", "Phone Number"]} />
                                <LayoutSection title="Qualification and Leadership" icon={Edit3} fields={["Lead Source", "Estimated Value", "Urgency"]} />
                                <LayoutSection title="Company Data" icon={Layout} fields={["Company Name", "Industry", "Location"]} />
                                <Button variant="ghost" className="w-full h-12 border-2 border-dashed border-zinc-100 text-zinc-300 font-medium hover:border-blue-100 hover:bg-blue-50/50 hover:text-blue-400 rounded-xl transition-all" onClick={() => toast.info("New section appended")}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Append New Section
                                </Button>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-6">
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <h3 className="text-sm font-medium text-gray-900 mb-6 flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                                    Layout Behavior
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-zinc-800 transition-colors group-hover:text-blue-600">Sticky Conversion</span>
                                            <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Mandatory fields during conversion.</span>
                                        </div>
                                        <Switch
                                            checked={behaviors.stickyConversion}
                                            onCheckedChange={(v) => setBehaviors(p => ({ ...p, stickyConversion: v }))}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-zinc-800 transition-colors group-hover:text-blue-600">Dynamic Tooltips</span>
                                            <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Show field instructions on hover.</span>
                                        </div>
                                        <Switch
                                            checked={behaviors.tooltips}
                                            onCheckedChange={(v) => setBehaviors(p => ({ ...p, tooltips: v }))}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-zinc-800 transition-colors group-hover:text-blue-600">Compact Mode</span>
                                            <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Reduce spacing in layout preview.</span>
                                        </div>
                                        <Switch
                                            checked={behaviors.compactMode}
                                            onCheckedChange={(v) => setBehaviors(p => ({ ...p, compactMode: v }))}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 rounded-xl p-6 text-white shadow-xl shadow-blue-200 border-t border-white/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <Info className="w-5 h-5 text-white/60" />
                                    <h4 className="text-sm font-medium text-white">Admin Tip</h4>
                                </div>
                                <p className="text-[11px] font-medium leading-relaxed opacity-90">
                                    Reordering fields here updates the unified lead form for all sales reps in the organization. Changes are applied instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* FIELD CONFIGURATION DIALOG */}
            <Dialog open={isFieldOpen} onOpenChange={setIsFieldOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Columns className="w-5 h-5 text-blue-600" />
                            {editingField?.system ? 'View Field' : 'Field Schema Definition'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-zinc-400">
                            Configure how data is stored and validated for this lead attribute.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-medium text-zinc-400">Display Label</Label>
                            <Input
                                placeholder="e.g. Annual Revenue"
                                value={editingField?.label}
                                onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                disabled={editingField?.system}
                                className="rounded-xl bg-zinc-50 border-zinc-100 focus:ring-blue-100 h-11 text-sm font-medium disabled:opacity-50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-medium text-zinc-400">Data Type</Label>
                                <Select
                                    value={editingField?.type}
                                    onValueChange={(v) => setEditingField({ ...editingField, type: v })}
                                    disabled={editingField?.system}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-zinc-50 border-zinc-100 disabled:opacity-50">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Text">Text String</SelectItem>
                                        <SelectItem value="Number">Numeric</SelectItem>
                                        <SelectItem value="Email">Email Address</SelectItem>
                                        <SelectItem value="Phone">Phone Number</SelectItem>
                                        <SelectItem value="Select">Dropdown Menu</SelectItem>
                                        <SelectItem value="Date">Date Picker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-medium text-zinc-400">Default Value</Label>
                                <Input
                                    placeholder="Optional"
                                    className="rounded-xl bg-zinc-50 border-zinc-100 h-11 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="req"
                                    checked={editingField?.required}
                                    onCheckedChange={(v) => setEditingField({ ...editingField, required: v })}
                                    disabled={editingField?.system}
                                />
                                <Label htmlFor="req" className="text-xs font-medium text-zinc-700 cursor-pointer">Mark as Mandatory (Required)</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="conv"
                                    checked={editingField?.inConversion}
                                    onCheckedChange={(v) => setEditingField({ ...editingField, inConversion: v })}
                                    disabled={editingField?.system}
                                />
                                <Label htmlFor="conv" className="text-xs font-medium text-zinc-700 cursor-pointer">Include in Client Conversion Map</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsFieldOpen(false)} className="rounded-xl font-medium text-xs">Cancel</Button>
                        <Button
                            onClick={saveField}
                            disabled={editingField?.system}
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 font-medium text-xs shadow-lg shadow-blue-200"
                        >
                            Commit Schema
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function LayoutSection({ title, icon: Icon, fields }: { title: string, icon: any, fields: string[] }) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md hover:bg-zinc-100 text-zinc-400">
                        <GripVertical className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-md hover:bg-zinc-100 text-zinc-400">
                        <ChevronUp className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {fields.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-zinc-50/50 border border-zinc-100 rounded-lg hover:border-blue-100 hover:bg-white transition-all group/field">
                            <div className="flex items-center gap-3">
                                <GripVertical className="w-3 h-3 text-zinc-200 group-hover/field:text-blue-300 transition-colors" />
                                <span className="text-xs font-medium text-zinc-600">{f}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-zinc-200 hover:text-rose-500 hover:bg-rose-50">
                                <XCircle className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="ghost" className="h-full border-2 border-dashed border-zinc-50 rounded-lg text-zinc-200 font-medium text-[9px] hover:border-blue-50 hover:bg-blue-50/20 hover:text-blue-300 transition-all p-3" onClick={() => toast.info("Field selector opening...")}>
                        + Insert Field
                    </Button>
                </div>
            </div>
        </div>
    )
}
