"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    UserCheck,
    Plus,
    MoreVertical,
    GripVertical,
    Search,
    RefreshCcw,
    Edit3,
    Trash2,
    Users,
    ShieldCheck,
    Target,
    Activity,
    Settings,
    Zap,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ClientOwnershipRulesPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showRuleDialog, setShowRuleDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentRuleId, setCurrentRuleId] = useState<string | null>(null)

    const [rules, setRules] = useState([
        { id: "1", name: "Enterprise Account Manager", criteria: "Tier = Enterprise", assignTo: "Senior AM Team", priority: 1, status: "ACTIVE" },
        { id: "2", name: "Regional Distribution", criteria: "Location = North America", assignTo: "NA Sales Team", priority: 2, status: "ACTIVE" },
        { id: "3", name: "Revenue-Based Assignment", criteria: "Annual Revenue > $100K", assignTo: "Key Account Managers", priority: 3, status: "ACTIVE" },
        { id: "4", name: "Industry Specialist", criteria: "Industry = Technology", assignTo: "Tech Vertical Team", priority: 4, status: "INACTIVE" },
    ])

    const [formData, setFormData] = useState({
        name: "",
        criteria: "",
        assignTo: "",
        priority: "",
        status: "ACTIVE"
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const toggleRuleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
        toast.success("Ownership rule status updated")
    }

    const handleOpenCreate = () => {
        setIsEditing(false)
        setFormData({ name: "", criteria: "", assignTo: "", priority: "", status: "ACTIVE" })
        setShowRuleDialog(true)
    }

    const handleOpenEdit = (rule: any) => {
        setIsEditing(true)
        setCurrentRuleId(rule.id)
        setFormData({
            name: rule.name,
            criteria: rule.criteria,
            assignTo: rule.assignTo,
            priority: rule.priority.toString(),
            status: rule.status
        })
        setShowRuleDialog(true)
    }

    const handleSaveRule = () => {
        if (!formData.name || !formData.criteria || !formData.assignTo) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            if (isEditing && currentRuleId) {
                setRules(prev => prev.map(r => r.id === currentRuleId ? {
                    ...r,
                    name: formData.name,
                    criteria: formData.criteria,
                    assignTo: formData.assignTo,
                    priority: parseInt(formData.priority) || 1,
                    status: formData.status
                } : r))
                toast.success("Rule updated successfully")
            } else {
                const newRule = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: formData.name,
                    criteria: formData.criteria,
                    assignTo: formData.assignTo,
                    priority: parseInt(formData.priority) || (rules.length + 1),
                    status: formData.status
                }
                setRules(prev => [...prev, newRule])
                toast.success("New rule created successfully")
            }
            setIsLoading(false)
            setShowRuleDialog(false)
        }, 800)
    }

    const handleDeleteClick = (id: string) => {
        setCurrentRuleId(id)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (currentRuleId) {
            setRules(prev => prev.filter(r => r.id !== currentRuleId))
            toast.success("Rule deleted successfully")
            setShowDeleteDialog(false)
            setCurrentRuleId(null)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Client Ownership Rules</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3">AUTO-ASSIGNMENT</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define automated rules for client account manager assignment.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Rules validated successfully")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Test All Rules
                    </Button>
                    <Button
                        onClick={handleOpenCreate}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Define New Rule
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* ... existing cards ... */}
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Rules</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">{rules.filter(r => r.status === 'ACTIVE').length} Rules</p>
                        <p className="text-[10px] text-white">Automated assignment</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Assigned Today</p>
                        <Users className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">24 Clients</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Via automation</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Unassigned</p>
                        <Target className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">8 Accounts</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Pending assignment</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Success Rate</p>
                        <Activity className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">98.5%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Last 30 days</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* RULES TABLE */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search ownership rules..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest w-12"></TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Rule Name</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Criteria</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Assign To</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule, idx) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab active:cursor-grabbing" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-zinc-900 italic tracking-tight group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter italic">Priority #{rule.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <code className="text-[11px] font-mono text-zinc-600 bg-zinc-50 px-2 py-1 rounded border border-zinc-200">{rule.criteria}</code>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-xs font-bold text-zinc-700">{rule.assignTo}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <Switch
                                        checked={rule.status === 'ACTIVE'}
                                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                                        className="scale-75 data-[state=checked]:bg-blue-600"
                                    />
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => handleOpenEdit(rule)}
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
                                                <DropdownMenuItem
                                                    onClick={() => handleOpenEdit(rule)}
                                                    className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Settings className="w-3.5 h-3.5" /> Configure Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleAction(`Simulating assignment for ${rule.name}...`)}
                                                    className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Activity className="w-3.5 h-3.5" /> Test Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
                                                    onClick={() => handleDeleteClick(rule.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Rule
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* RULES TABLE */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search ownership rules..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest w-12"></TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Rule Name</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Criteria</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Assign To</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule, idx) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab active:cursor-grabbing" />
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-zinc-900 italic tracking-tight group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter italic">Priority #{rule.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <code className="text-[11px] font-mono text-zinc-600 bg-zinc-50 px-2 py-1 rounded border border-zinc-200">{rule.criteria}</code>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-xs font-bold text-zinc-700">{rule.assignTo}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <Switch
                                        checked={rule.status === 'ACTIVE'}
                                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                                        className="scale-75 data-[state=checked]:bg-blue-600"
                                    />
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => handleOpenEdit(rule)}
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
                                                <DropdownMenuItem
                                                    onClick={() => handleOpenEdit(rule)}
                                                    className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Settings className="w-3.5 h-3.5" /> Configure Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleAction(`Simulating assignment for ${rule.name}...`)}
                                                    className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Activity className="w-3.5 h-3.5" /> Test Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
                                                    onClick={() => handleDeleteClick(rule.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Rule
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* CREATE/EDIT DIALOG */}
            <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden gap-0 rounded-2xl">
                    <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100">
                        <DialogTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                            {isEditing ? <Edit3 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                            {isEditing ? "Configure Rule" : "Create Ownership Rule"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500 font-medium">
                            {isEditing ? "Modify existing assignment logic and criteria." : "Define new logic for automated account distribution."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 grid gap-5">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Rule Name</Label>
                            <Input
                                placeholder="e.g. Enterprise North Allocation"
                                className="h-10 bg-zinc-50/50 border-zinc-200 focus:ring-blue-100 transition-all font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Assign To Team/User</Label>
                                <Select value={formData.assignTo} onValueChange={(val) => setFormData({ ...formData, assignTo: val })}>
                                    <SelectTrigger className="h-10 bg-zinc-50/50">
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Senior AM Team">Senior AM Team</SelectItem>
                                        <SelectItem value="NA Sales Team">NA Sales Team</SelectItem>
                                        <SelectItem value="Key Account Managers">Key Account Managers</SelectItem>
                                        <SelectItem value="Tech Vertical Team">Tech Vertical Team</SelectItem>
                                        <SelectItem value="Support Team">Support Team</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Priority Order</Label>
                                <Input
                                    type="number"
                                    placeholder="1"
                                    className="h-10 bg-zinc-50/50"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Assignment Criteria (Logic)</Label>
                            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                                <Input
                                    placeholder="e.g. Tier = Enterprise AND Revenue > 50000"
                                    className="h-10 border-zinc-200 font-mono text-xs bg-white mb-2"
                                    value={formData.criteria}
                                    onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[10px] bg-white cursor-pointer hover:bg-blue-50 transition-colors">Tier =</Badge>
                                    <Badge variant="outline" className="text-[10px] bg-white cursor-pointer hover:bg-blue-50 transition-colors">Region =</Badge>
                                    <Badge variant="outline" className="text-[10px] bg-white cursor-pointer hover:bg-blue-50 transition-colors">Revenue &gt;</Badge>
                                    <Badge variant="outline" className="text-[10px] bg-white cursor-pointer hover:bg-blue-50 transition-colors">Employees &gt;</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200/60">
                            <div>
                                <Label className="text-xs font-bold text-zinc-900">Activate Rule Immediately</Label>
                                <p className="text-[10px] text-zinc-500 font-medium">New clients will be processed by this rule upon creation.</p>
                            </div>
                            <Switch
                                checked={formData.status === 'ACTIVE'}
                                onCheckedChange={(c) => setFormData({ ...formData, status: c ? 'ACTIVE' : 'INACTIVE' })}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-4 bg-zinc-50/50 border-t border-zinc-100 gap-2">
                        <Button variant="ghost" onClick={() => setShowRuleDialog(false)} className="h-9 text-xs font-bold">Cancel</Button>
                        <Button
                            onClick={handleSaveRule}
                            disabled={isLoading}
                            className="h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-100 px-6"
                        >
                            {isLoading ? (
                                <>Processing...</>
                            ) : (
                                <>{isEditing ? 'Update Rule' : 'Create Rule'}</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" />
                            Delete Ownership Rule?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-600 font-medium text-xs">
                            This action cannot be undone. This rule will effectively stop processing new client assignments immediately. Active clients assigned by this rule will NOT be reassigned automatically.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-bold rounded-lg border-none bg-zinc-100 hover:bg-zinc-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100"
                        >
                            Yes, Delete Rule
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


