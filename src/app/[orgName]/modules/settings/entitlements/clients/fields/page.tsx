"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Settings,
    Plus,
    MoreVertical,
    Search,
    GripVertical,
    FileText,
    LayoutGrid,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    ChevronUp,
    Columns,
    Eye,
    Layout,
    Shield
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
import { motion, AnimatePresence } from "framer-motion"

export default function ClientFieldsLayoutsPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFieldOpen, setIsFieldOpen] = useState(false)
    const [editingField, setEditingField] = useState<any>(null)

    const [fields, setFields] = useState([
        { id: "1", label: "Legal Entity Name", type: "Text", required: true, system: true, status: "ACTIVE" },
        { id: "2", label: "Registration ID", type: "Text", required: true, system: true, status: "ACTIVE" },
        { id: "3", label: "SLA Tier", type: "Select", required: true, system: false, status: "ACTIVE" },
        { id: "4", label: "Billing Currency", type: "Select", required: true, system: true, status: "ACTIVE" },
        { id: "5", label: "Account Manager", type: "Select", required: false, system: false, status: "ACTIVE" },
        { id: "6", label: "Contract End Date", type: "Date", required: false, system: false, status: "ACTIVE" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const startAddField = () => {
        setEditingField({ id: Date.now().toString(), label: "", type: "Text", required: false, system: false, status: "ACTIVE" })
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
        toast.success(`Client schema updated`)
    }

    const toggleFieldStatus = (id: string) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : f))
        toast.success("Field status modified")
    }

    const deleteField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id))
        toast.success("Field purged from schema")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Columns className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Client Master Schema</h1>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-black uppercase tracking-widest">Post-Conversion</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Standardize account attributes and data collection models.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Schema preview active")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Entity
                    </Button>
                    <Button
                        onClick={startAddField}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client Attribute
                    </Button>
                </div>
            </div>

            {/* SCHEMA INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Schema Fields</p>
                        <FileText className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">{fields.length} Attributes</p>
                        <p className="text-[10px] text-white">Global master layout</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Active Models</p>
                        <Layout className="w-4 h-4 text-indigo-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">02 Variations</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Standard vs Enterprise</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Security Check</p>
                        <Shield className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">PII Locked</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Data masking active</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Regulatory</p>
                        <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">GDPR Ready</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Compliance validated</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search client dictionary..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Field Attribute</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Data Type</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Required</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Protection</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {fields.map((field, idx) => (
                                <TableRow key={field.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${field.system ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]' : 'bg-emerald-500'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-zinc-900 italic tracking-tight group-hover:text-indigo-600 transition-colors">{field.label}</span>
                                                {field.system && <span className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter italic">System Fixed</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 text-zinc-500 bg-white shadow-sm uppercase px-2 h-5 rounded-md">
                                            {field.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        {field.required ? <CheckCircle2 className="w-4 h-4 text-indigo-600 mx-auto" /> : <XCircle className="w-4 h-4 text-zinc-200 mx-auto" />}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            {field.system ? <Lock className="w-3.5 h-3.5 text-zinc-300" /> : <Unlock className="w-3.5 h-3.5 text-zinc-300" />}
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{field.system ? 'Encrypted' : 'Standard'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <Switch
                                            checked={field.status === 'ACTIVE'}
                                            onCheckedChange={() => toggleFieldStatus(field.id)}
                                            className="scale-75 data-[state=checked]:bg-emerald-500"
                                        />
                                    </TableCell>
                                    <TableCell className="py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 text-zinc-300">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                disabled={field.system}
                                                onClick={() => startEditField(field)}
                                                className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-50 rounded-lg">
                                                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 shadow-2xl border-zinc-100 p-2 rounded-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5 italic">Field Config</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-indigo-50 focus:text-indigo-600 rounded-lg cursor-pointer">
                                                        <LayoutGrid className="w-3.5 h-3.5" /> Move to Section
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-50" />
                                                    <DropdownMenuItem
                                                        disabled={field.system}
                                                        className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
                                                        onClick={() => deleteField(field.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Purge Attribute
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* FIELD CONFIGURATION DIALOG */}
            <Dialog open={isFieldOpen} onOpenChange={setIsFieldOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2 text-indigo-600">
                            <Columns className="w-5 h-5" />
                            Attribute Definition
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-zinc-400 italic">
                            Modify global client schema for all future account records.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Display Label</Label>
                            <Input
                                placeholder="e.g. Contract Renewal Date"
                                value={editingField?.label}
                                onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                disabled={editingField?.system}
                                className="rounded-xl bg-zinc-50 border-zinc-100 focus:ring-indigo-100 h-11 text-sm font-bold"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Data Type</Label>
                                <Select
                                    value={editingField?.type}
                                    onValueChange={(v) => setEditingField({ ...editingField, type: v })}
                                    disabled={editingField?.system}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-zinc-50 border-zinc-100">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Text">Text String</SelectItem>
                                        <SelectItem value="Number">Currency/Value</SelectItem>
                                        <SelectItem value="Select">Dropdown Menu</SelectItem>
                                        <SelectItem value="Date">Date Picker</SelectItem>
                                        <SelectItem value="Checkbox">True/False</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Group</Label>
                                <Select disabled={editingField?.system} defaultValue="public">
                                    <SelectTrigger className="h-11 rounded-xl bg-zinc-50 border-zinc-100">
                                        <SelectValue placeholder="Select group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Global (Any Agent)</SelectItem>
                                        <SelectItem value="pii">PII Protected</SelectItem>
                                        <SelectItem value="finance">Financial Only</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Label htmlFor="req" className="text-xs font-bold text-zinc-700 cursor-pointer italic">Relationship Mandatory (Required for Save)</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsFieldOpen(false)} className="rounded-xl font-bold uppercase text-[10px]">Cancel</Button>
                        <Button
                            onClick={saveField}
                            disabled={editingField?.system}
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-10 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100"
                        >
                            Commit Schema
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
