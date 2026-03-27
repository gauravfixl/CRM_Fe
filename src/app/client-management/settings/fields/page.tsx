"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Tag,
    List,
    Layers,
    Database,
    ShieldCheck,
    Filter,
    ArrowUpRight,
    FileText,
    Workflow,
    Table2,
    RefreshCw,
    Activity,
    Edit,
    Trash2,
    Sun,
    Moon,
    Monitor,
    Wind
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useBrandingStore } from '@/lib/useBrandingStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

// --- Types ---
interface Field {
    id: string;
    name: string;
    type: string;
    module: string;
    required: boolean;
    status: string;
    options: string[];
    color: string;
}

// --- Initial Mock Data ---
const INITIAL_FIELDS: Field[] = [
    { id: "CF-001", name: "Industry vertical", type: "Dropdown", module: "Clients", required: true, status: "Active", options: ["Technology", "Finance", "Healthcare", "Retail"], color: "blue" },
    { id: "CF-002", name: "Employee capacity", type: "Number", module: "Clients", required: false, status: "Active", options: [], color: "emerald" },
    { id: "CF-003", name: "Contractual valuation", type: "Currency", module: "Contracts", required: true, status: "Active", options: [], color: "indigo" },
    { id: "CF-004", name: "Incident criticality", type: "Dropdown", module: "Support", required: true, status: "Active", options: ["Low", "Medium", "High", "Critical"], color: "rose" }
]

export default function CustomizationArchitect() {
    const { theme } = useTheme()
    const { setBranding, themeMode } = useBrandingStore()
    const [mounted, setMounted] = useState(false)
    const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS)

    // Hydration check for next-themes
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const [searchQuery, setSearchQuery] = useState("")
    const [isReindexing, setIsReindexing] = useState(false)

    // Filter states
    const [moduleFilters, setModuleFilters] = useState<string[]>([])

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingField, setEditingField] = useState<Field | null>(null)
    const [formData, setFormData] = useState<Partial<Field>>({
        name: '',
        type: 'Text',
        module: 'Clients',
        required: false,
        status: 'Active',
        options: [],
        color: 'blue'
    })

    // Unique modules for filters
    const allModules = useMemo(() => Array.from(new Set(fields.map(f => f.module))), [fields])

    // Filtered fields
    const filteredFields = useMemo(() => {
        return fields.filter(field => {
            const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                field.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
                field.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesModule = moduleFilters.length === 0 || moduleFilters.includes(field.module);
            return matchesSearch && matchesModule;
        })
    }, [fields, searchQuery, moduleFilters])

    // Stats
    const stats = useMemo(() => {
        const total = fields.length;
        const active = fields.filter(f => f.status === 'Active').length;
        const required = fields.filter(f => f.required).length;

        return [
            { label: "Active Nodes", value: `${total} Fields`, icon: Layers, color: "blue", bg: "bg-blue-50/50 dark:bg-blue-900/10" },
            { label: "Status Logic", value: `${active} Active`, icon: Workflow, color: "emerald", bg: "bg-emerald-50/50 dark:bg-emerald-900/10" },
            { label: "Mandatory Nodes", value: `${required} Required`, icon: ShieldCheck, color: "indigo", bg: "bg-indigo-50/50 dark:bg-indigo-900/10" },
            { label: "Schema Health", value: "99.8%", icon: Activity, color: "orange", bg: "bg-orange-50/50 dark:bg-orange-900/10" }
        ]
    }, [fields])

    // Handlers
    const handleReindex = () => {
        setIsReindexing(true)
        const reindexPromise = new Promise(r => setTimeout(r, 1200))

        toast.promise(reindexPromise, {
            loading: 'Re-indexing schema metadata...',
            success: "Schema metadata successfully synchronized",
            error: 'Schema re-indexing failed'
        })

        reindexPromise.then(() => {
            setIsReindexing(false)
            setFields([...fields].sort(() => Math.random() - 0.5))
        })
    }

    const toggleModuleFilter = (module: string) => {
        setModuleFilters(prev =>
            prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
        )
    }

    const openCreateDialog = () => {
        setEditingField(null)
        setFormData({
            name: '',
            type: 'Text',
            module: 'Clients',
            required: false,
            status: 'Active',
            options: [],
            color: 'blue'
        })
        setIsDialogOpen(true)
    }

    const openEditDialog = (field: Field) => {
        setEditingField(field)
        setFormData(field)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!formData.name) {
            toast.error("Please provide a field designation")
            return
        }

        if (editingField) {
            setFields(fields.map(f => f.id === editingField.id ? { ...f, ...formData as Field } : f))
            toast.success("Schema node configuration synchronized")
        } else {
            const newField: Field = {
                id: `CF-${(fields.length + 1).toString().padStart(3, '0')}`,
                name: formData.name as string,
                type: formData.type as string,
                module: formData.module as string,
                required: formData.required as boolean,
                status: formData.status as string,
                options: formData.options || [],
                color: formData.color || 'indigo'
            }
            setFields([...fields, newField])
            toast.success("New schema node successfully provisioned")
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
        toast.success("Schema node purged from registry")
    }

    const toggleStatus = (id: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f))
        toast.success("Node operational status toggled asynchronously")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-outfit transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customization <span className="text-indigo-600">Architect</span></h1>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1 text-[15px]">Design bespoke schemas, orchestrate custom data nodes, and fine-tune platform-wide behavior and metadata</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold shadow-sm gap-2" onClick={() => toast.success("Schema documentation exported")}>
                        <FileText className="w-4 h-4 text-slate-400" /> Export blueprint
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 gap-2" onClick={openCreateDialog}>
                        <Plus className="w-4 h-4" /> Provision field
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="schema" className="space-y-8">
                <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl h-14 w-fit shadow-md">
                    <TabsTrigger value="schema" className="px-8 rounded-xl data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-600 font-bold text-sm h-full text-slate-500 transition-all">Schema architect</TabsTrigger>
                    <TabsTrigger value="aesthetics" className="px-8 rounded-xl data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-indigo-600 font-bold text-sm h-full text-slate-500 transition-all">System aesthetics</TabsTrigger>
                </TabsList>

                <TabsContent value="schema" className="space-y-8">
                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <Card key={i} className={`${stat.bg} py-6 px-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all flex items-center gap-4`}>
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${stat.color === 'blue' ? 'border-blue-100 dark:border-blue-900/50 text-blue-600' :
                                    stat.color === 'emerald' ? 'border-emerald-100 dark:border-emerald-900/50 text-emerald-600' :
                                        stat.color === 'indigo' ? 'border-indigo-100 dark:border-indigo-900/50 text-indigo-600' :
                                            'border-orange-100 dark:border-orange-900/50 text-orange-600'
                                    }`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-slate-400 tracking-widest leading-none mb-1.5">{stat.label}</p>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">{stat.value}</h4>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 hidden lg:flex">
                                    <ArrowUpRight className="w-2.5 h-2.5" /> 14%
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                placeholder="Filter global schema nodes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-12 w-full pl-11 pr-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={`h-12 px-5 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold text-[11px] shadow-sm gap-2 transition-colors ${moduleFilters.length > 0 ? 'text-indigo-600 border-indigo-200 bg-indigo-50/50' : 'text-slate-600'}`}>
                                        <Filter className="w-4 h-4" /> {moduleFilters.length > 0 ? `Filtered (${moduleFilters.length})` : 'Global filters'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-2xl p-2 font-outfit dark:bg-slate-900 dark:border-slate-800">
                                    <DropdownMenuLabel className="text-[10px] tracking-widest text-slate-400">Filter by Module</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {allModules.map(module => (
                                        <DropdownMenuCheckboxItem
                                            key={module}
                                            checked={moduleFilters.includes(module)}
                                            onCheckedChange={() => toggleModuleFilter(module)}
                                            className="rounded-xl"
                                        >
                                            {module}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    {moduleFilters.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 h-8 rounded-lg px-2"
                                                onClick={() => setModuleFilters([])}
                                            >
                                                Clear all filters
                                            </Button>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                variant="outline"
                                className={`h-12 px-5 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold text-[11px] text-slate-600 dark:text-slate-400 shadow-sm gap-2 ${isReindexing ? 'animate-pulse' : ''}`}
                                onClick={handleReindex}
                                disabled={isReindexing}
                            >
                                <RefreshCw className={`w-4 h-4 ${isReindexing ? 'animate-spin' : ''}`} /> {isReindexing ? 'Re-indexing...' : 'Re-index schema'}
                            </Button>
                        </div>
                    </div>

                    <div className="relative min-h-[400px]">
                        <AnimatePresence mode="popLayout">
                            {isReindexing ? (
                                <motion.div
                                    key="loader"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-[2px] z-10 rounded-3xl"
                                >
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 animate-spin" />
                                        <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white tracking-tight">Synchronizing schema matrix</p>
                                    <p className="text-xs text-slate-500 animate-pulse">Propagating entropy across nodes...</p>
                                </motion.div>
                            ) : null}

                            <motion.div
                                layout
                                className="grid grid-cols-1 gap-4"
                            >
                                {filteredFields.length > 0 ? (
                                    filteredFields.map((f, idx) => (
                                        <Card key={f.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-xl transition-all border-l-4 border-l-indigo-600">
                                            <div className="flex items-center gap-6 flex-1 min-w-[300px]">
                                                <div className={`h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm ${f.color === 'blue' ? 'text-blue-600' : f.color === 'emerald' ? 'text-emerald-600' : f.color === 'indigo' ? 'text-indigo-600' : 'text-rose-600'}`}>
                                                    <Table2 className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                                                </div>
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-md font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors leading-none">{f.name}</h4>
                                                        <Badge className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border-0 tracking-widest ${f.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{f.status}</Badge>
                                                        {f.required && <Badge className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border-0 tracking-widest bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">Required node</Badge>}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 tracking-widest">
                                                        <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-300 border-b-2 border-slate-100 dark:border-slate-800 pb-0.5"><Database className="w-3.5 h-3.5 text-indigo-500" /> Module: {f.module}</span>
                                                        <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Data type: {f.type}</span>
                                                        {f.options.length > 0 && <span className="flex items-center gap-1.5"><List className="w-3.5 h-3.5" /> Entropy: {f.options.length} Options</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="flex items-center gap-3 mr-4 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                                    <span className="text-[9px] font-bold text-slate-400 tracking-widest">Operational</span>
                                                    <Switch
                                                        checked={f.status === 'Active'}
                                                        onCheckedChange={() => toggleStatus(f.id)}
                                                        className="data-[state=checked]:bg-indigo-600 shadow-sm"
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-[10px] gap-2 bg-white dark:bg-slate-900 dark:text-white"
                                                    onClick={() => openEditDialog(f)}
                                                >
                                                    <Edit className="w-3.5 h-3.5" /> Edit logic
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-11 w-11 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                    onClick={() => handleDelete(f.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                        <Table2 className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-slate-400">No schema definitions found in logic registry</h3>
                                        <p className="text-sm text-slate-400 mt-1">Refine your search parameters or provision a new field node</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {!isReindexing && (
                            <Button
                                className="w-full mt-4 h-16 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-400 hover:text-indigo-600 transition-all font-bold text-xs tracking-widest text-slate-400 gap-2 shadow-sm"
                                onClick={openCreateDialog}
                            >
                                <Plus className="w-4 h-4" /> Provision new schema node
                            </Button>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="aesthetics" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                                    <Moon className="w-7 h-7 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Appearance mode</h3>
                                    <p className="text-sm text-slate-500 font-medium">Define your preferred platform look and feel</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', label: 'Light', icon: Sun },
                                    { id: 'dark', label: 'Dark', icon: Moon },
                                    { id: 'system', label: 'System', icon: Monitor }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setBranding({ themeMode: item.id as any })
                                            toast.success(`${item.label} mode activated`)
                                        }}
                                        className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all group ${mounted && themeMode === item.id
                                            ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-600'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-500'
                                            }`}
                                    >
                                        <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-bold tracking-widest">{item.label}</span>
                                        {mounted && themeMode === item.id && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                                    <Wind className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Motion graphics</h3>
                                    <p className="text-sm text-slate-500 font-medium">Optimize UI responsiveness and transitions</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-900 dark:text-white">Reduced Motion</Label>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Limit non-essential structural transitions</p>
                                    </div>
                                    <Switch
                                        className="data-[state=checked]:bg-emerald-600"
                                        onCheckedChange={(checked) => toast.success(`Reduced motion ${checked ? 'enabled' : 'disabled'}`)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-slate-900 dark:text-white">Glassmorphism Effects</Label>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Enable sophisticated backdrop filters</p>
                                    </div>
                                    <Switch
                                        defaultChecked
                                        className="data-[state=checked]:bg-emerald-600"
                                        onCheckedChange={(checked) => toast.success(`Glassmorphism ${checked ? 'enabled' : 'disabled'}`)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Field upsert dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl font-outfit dark:bg-slate-950 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                            {editingField ? "Configure node logic" : "Provision schema node"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">Field Designation</Label>
                            <Input
                                placeholder="e.g. Lead Qualification Rank"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-xl h-11 focus:ring-indigo-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">Data Type</Label>
                                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger className="rounded-xl h-11 focus:ring-indigo-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                        <SelectItem value="Text">Text node</SelectItem>
                                        <SelectItem value="Number">Numerical matrix</SelectItem>
                                        <SelectItem value="Dropdown">Dropdown selector</SelectItem>
                                        <SelectItem value="Currency">Financial value</SelectItem>
                                        <SelectItem value="Date">Chronological marker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest">Parent Module</Label>
                                <Select value={formData.module} onValueChange={v => setFormData({ ...formData, module: v })}>
                                    <SelectTrigger className="rounded-xl h-11 focus:ring-indigo-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                        <SelectItem value="Clients">Clients core</SelectItem>
                                        <SelectItem value="Contracts">Contracts layer</SelectItem>
                                        <SelectItem value="Support">Support desk</SelectItem>
                                        <SelectItem value="Marketing">Marketing hub</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-slate-900 dark:text-white">Mandatory schema requirement</Label>
                                <p className="text-[11px] text-slate-500 font-medium">Enforce data integrity for this node</p>
                            </div>
                            <Switch
                                checked={formData.required}
                                onCheckedChange={checked => setFormData({ ...formData, required: checked })}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold dark:border-slate-800 dark:text-white">Discard</Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20">
                            {editingField ? "Sync schema" : "Provision node"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
