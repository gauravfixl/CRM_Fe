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
    const [securityGroup, setSecurityGroup] = useState("public")

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
        setSecurityGroup("public")
        setIsFieldOpen(true)
    }

    const startEditField = (field: any) => {
        setEditingField({ ...field })
        setSecurityGroup("public")
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
        <div className="flex flex-col gap-4 p-4 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white">
                        <Columns className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-sm font-semibold text-zinc-900">Client Master Schema</h1>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none text-[10px] font-medium rounded-md">Post-Conversion</Badge>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">Standardize account attributes and data collection models.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const totalFields = fields.length
                            const requiredCount = fields.filter(f => f.required).length
                            const systemCount = fields.filter(f => f.system).length
                            toast.info(`Entity Preview: ${totalFields} fields total, ${requiredCount} required, ${systemCount} system-locked`)
                        }}
                        className="h-8 border-zinc-200 text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Entity
                    </Button>
                    <Button
                        onClick={startAddField}
                        className="h-8 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 rounded-lg shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client Attribute
                    </Button>
                </div>
            </div>

            {/* SCHEMA INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white rounded-xl shadow-sm">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-white font-medium">Total Schema Fields</p>
                        <FileText className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-white">{fields.length} Attributes</p>
                        <p className="text-[10px] text-white/80">Global master layout</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Active Models</p>
                        <Layout className="w-4 h-4 text-indigo-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">02 Variations</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Standard vs Enterprise</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Security Check</p>
                        <Shield className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">PII Locked</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Data masking active</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Regulatory</p>
                        <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">GDPR Ready</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Compliance validated</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search client dictionary..."
                            className="pl-10 h-8 bg-white border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Field Attribute</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Data Type</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500 text-center">Required</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Protection</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500 text-center">Status</TableHead>
                            <TableHead className="px-4 py-3 text-right font-medium text-[10px] text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {fields.map((field, idx) => (
                                <TableRow key={field.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${field.system ? 'bg-indigo-600' : 'bg-emerald-500'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors">{field.label}</span>
                                                {field.system && <span className="text-[10px] font-medium text-zinc-400">System Fixed</span>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <Badge variant="outline" className="text-[10px] font-medium border-zinc-200 text-zinc-500 bg-white shadow-sm rounded-md px-2 h-5">
                                            {field.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        {field.required ? <CheckCircle2 className="w-4 h-4 text-indigo-600 mx-auto" /> : <XCircle className="w-4 h-4 text-zinc-200 mx-auto" />}
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {field.system ? <Lock className="w-3.5 h-3.5 text-zinc-300" /> : <Unlock className="w-3.5 h-3.5 text-zinc-300" />}
                                            <span className="text-[10px] font-medium text-zinc-400">{field.system ? 'Encrypted' : 'Standard'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <Switch
                                            checked={field.status === 'ACTIVE'}
                                            onCheckedChange={() => toggleFieldStatus(field.id)}
                                            className="scale-75 data-[state=checked]:bg-emerald-500"
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2 text-zinc-300">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                disabled={field.system}
                                                onClick={() => startEditField(field)}
                                                className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-50 rounded-lg">
                                                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 shadow-sm border-zinc-100 p-2 rounded-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400 px-2 py-1.5">Field Config</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium gap-2 focus:bg-indigo-50 focus:text-indigo-600 rounded-lg cursor-pointer"
                                                        onClick={() => toast.info(`Move "${field.label}" to a different section using the layout editor`)}
                                                    >
                                                        <LayoutGrid className="w-3.5 h-3.5" /> Move to Section
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-50" />
                                                    <DropdownMenuItem
                                                        disabled={field.system}
                                                        className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
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
                <DialogContent className="sm:max-w-[450px] rounded-xl p-5 border-none shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-600">
                            <Columns className="w-5 h-5" />
                            Attribute Definition
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-medium text-zinc-400">
                            Modify global client schema for all future account records.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-medium text-zinc-500">Display Label</Label>
                            <Input
                                placeholder="e.g. Contract Renewal Date"
                                value={editingField?.label}
                                onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                disabled={editingField?.system}
                                className="rounded-lg bg-zinc-50 border-zinc-100 focus:ring-indigo-100 h-9 text-xs font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-500">Data Type</Label>
                                <Select
                                    value={editingField?.type}
                                    onValueChange={(v) => setEditingField({ ...editingField, type: v })}
                                    disabled={editingField?.system}
                                >
                                    <SelectTrigger className="h-9 rounded-lg bg-zinc-50 border-zinc-100">
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
                                <Label className="text-xs font-medium text-zinc-500">Security Group</Label>
                                <Select
                                    disabled={editingField?.system}
                                    value={securityGroup}
                                    onValueChange={(v) => {
                                        setSecurityGroup(v)
                                        toast.info(`Security group set to "${v}"`)
                                    }}
                                >
                                    <SelectTrigger className="h-9 rounded-lg bg-zinc-50 border-zinc-100">
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
                                <Label htmlFor="req" className="text-xs font-medium text-zinc-700 cursor-pointer">Relationship Mandatory (Required for Save)</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsFieldOpen(false)} className="rounded-lg font-medium text-xs h-8">Cancel</Button>
                        <Button
                            onClick={saveField}
                            disabled={editingField?.system}
                            className="bg-primary hover:bg-primary/90 rounded-lg px-6 font-medium text-xs h-8 shadow-sm"
                        >
                            Commit Schema
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
