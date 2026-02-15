"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    CheckCircle,
    Plus,
    MoreVertical,
    Search,
    Filter,
    ArrowRight,
    Users,
    Briefcase,
    Layout,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Settings2,
    Database,
    Zap,
    History,
    FileSpreadsheet,
    Play,
    Save
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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function LeadConversionRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingMap, setEditingMap] = useState<any>(null)

    const [fieldMappings, setFieldMappings] = useState([
        { id: "1", leadField: "Full Name", clientField: "Contact Name", type: "STRING", status: "MAPPED", required: true },
        { id: "2", leadField: "Company Name", clientField: "Legal Name", type: "STRING", status: "MAPPED", required: true },
        { id: "3", leadField: "Work Email", clientField: "Primary Email", type: "EMAIL", status: "MAPPED", required: true },
        { id: "4", leadField: "Work Phone", clientField: "Business Phone", type: "PHONE", status: "MAPPED", required: false },
        { id: "5", leadField: "Estimated Value", clientField: "Expected Revenue", type: "NUMBER", status: "MAPPED", required: false },
        { id: "6", leadField: "Lead Source", clientField: "", type: "SELECT", status: "REVIEW", required: false },
    ])

    const [behaviors, setBehaviors] = useState({
        blockEdit: true,
        createContact: true,
        manualOverride: false
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const handleAutoMap = () => {
        setIsLoading(true)
        setTimeout(() => {
            setFieldMappings(prev => prev.map(m =>
                !m.clientField ? { ...m, clientField: `Auto_${m.leadField}`, status: "MAPPED" } : m
            ))
            setIsLoading(false)
            toast.success("Intelligence engine completed mapping")
        }, 1500)
    }

    const startEdit = (map: any) => {
        setEditingMap({ ...map })
        setIsEditOpen(true)
    }

    const saveEdit = () => {
        setFieldMappings(prev => prev.map(m =>
            m.id === editingMap.id ? { ...editingMap, status: editingMap.clientField ? "MAPPED" : "REVIEW" } : m
        ))
        setIsEditOpen(false)
        toast.success(`Mapping updated for ${editingMap.leadField}`)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead '-&gt;' Client Conversion</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Growth Engine</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Standardize the transition from prospecting to active relationship management.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Conversion simulation initiated")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Test Mapping
                    </Button>
                    <Button
                        onClick={() => handleAction("Settings published to all firms")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Publish Config
                    </Button>
                </div>
            </div>

            {/* CONVERSION INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Trigger Stage</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">Won</p>
                        <p className="text-[10px] text-white">Auto-converts instantly</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Mapped Fields</p>
                        <Database className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">24 / 24</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">100% Data integrity</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Manual Overrides</p>
                        <Briefcase className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Allowed</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Managers only</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Post-Conversion</p>
                        <Lock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Shielded</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Leads locked after Won</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* CONVERSION CONFIGURATION SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                {/* FIELD MAPPING BLOCK */}
                <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search field mapping..."
                                className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleAutoMap}
                            disabled={isLoading}
                            className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white shadow-sm active:scale-95 transition-all"
                        >
                            <FileSpreadsheet className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-bounce' : ''}`} />
                            Auto-Map All
                        </Button>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow className="hover:bg-transparent border-b-zinc-100">
                                <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Lead Field</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Logic</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Client Field</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fieldMappings.map((map) => (
                                <TableRow key={map.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">{map.leadField}</span>
                                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-tighter mt-0.5">{map.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <ArrowRight className="w-4 h-4 text-blue-400 mx-auto group-hover:translate-x-1 transition-transform" />
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 text-zinc-600 bg-zinc-50 px-3 py-1 rounded shadow-none">
                                                {map.clientField || 'Unmapped'}
                                            </Badge>
                                            {map.required && (
                                                <span title="Required mapping">
                                                    <Lock className="w-3 h-3 text-zinc-200" />
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <Badge className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${map.status === 'MAPPED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {map.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 text-right pr-6">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEdit(map)}
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100 text-zinc-300 hover:text-blue-600 transition-all active:scale-90"
                                        >
                                            <Settings2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* CONVERSION BEHAVIOR BLOCK */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            Behavior Policy
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">Block Lead Edit</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Lock lead profiles after Won conversion.</span>
                                </div>
                                <Switch
                                    checked={behaviors.blockEdit}
                                    onCheckedChange={(v) => setBehaviors(p => ({ ...p, blockEdit: v }))}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">Create Contact</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Auto-create primary contact from lead data.</span>
                                </div>
                                <Switch
                                    checked={behaviors.createContact}
                                    onCheckedChange={(v) => setBehaviors(p => ({ ...p, createContact: v }))}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">Manual Override</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Allow conversion before Won stage.</span>
                                </div>
                                <Switch
                                    checked={behaviors.manualOverride}
                                    onCheckedChange={(v) => setBehaviors(p => ({ ...p, manualOverride: v }))}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-xl p-8 text-white shadow-xl shadow-zinc-200 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Layout className="w-5 h-5 text-zinc-400" />
                            <h4 className="text-xs font-black uppercase tracking-widest italic">Default Client Status</h4>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed opacity-60 mb-6 italic">
                            Newly converted leads will be initialized with this status in the Client module.
                        </p>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer">
                            <span className="text-xs font-black uppercase italic tracking-widest">Onboarding</span>
                            <Badge className="bg-white/10 text-white/60 border-none text-[8px] font-black uppercase h-5 group-hover:bg-white/20 group-hover:text-white">Active</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MAPPING DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-blue-600" />
                            Configure Mapping
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-zinc-400">
                            Define which field in the Client module should receive data from Lead '{editingMap?.leadField}'.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Lead Source Field</Label>
                            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-between">
                                <span className="text-sm font-bold text-zinc-900">{editingMap?.leadField}</span>
                                <Badge className="bg-zinc-200 text-zinc-500 border-none text-[8px]">{editingMap?.type}</Badge>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Client Field</Label>
                            <Select
                                value={editingMap?.clientField}
                                onValueChange={(v) => setEditingMap({ ...editingMap, clientField: v })}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-zinc-200 shadow-sm font-medium">
                                    <SelectValue placeholder="Select target field" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                                    <SelectItem value="Contact Name">Contact Name</SelectItem>
                                    <SelectItem value="Legal Name">Legal Name</SelectItem>
                                    <SelectItem value="Primary Email">Primary Email</SelectItem>
                                    <SelectItem value="Business Phone">Business Phone</SelectItem>
                                    <SelectItem value="Expected Revenue">Expected Revenue</SelectItem>
                                    <SelectItem value="Acquisition Channel">Acquisition Channel</SelectItem>
                                    <SelectItem value="Custom Field 1">Custom Field 1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">Cancel</Button>
                        <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">
                            <Save className="w-4 h-4 mr-2" />
                            Apply Mapping
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
