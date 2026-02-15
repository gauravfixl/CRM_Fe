"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    GitBranch,
    Plus,
    Search,
    Trash2,
    Users,
    CheckCircle2,
    AlertCircle,
    Save,
    Clock,
    ArrowRight,
    Settings,
    UserCog,
    Zap,
    AlertTriangle,
    Bell,
    UserCheck,
    Settings2,
    ChevronRight,
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useApprovalMatrixStore, type ApprovalType, type ApprovalFlow, type ApprovalLevel, type EscalationRule } from "@/shared/data/approval-matrix-store";
import { useTeamStore } from "@/shared/data/team-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Textarea } from "@/shared/components/ui/textarea";

const ApprovalMatrixPage = () => {
    const { flows, createFlow, updateFlow, deleteFlow, toggleFlowStatus, roleMappings, updateRoleMapping } = useApprovalMatrixStore();
    const { members: teamMembers } = useTeamStore();
    const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // For Role Mapping Dialog
    const [mappingRole, setMappingRole] = useState<string | null>(null);

    const { toast } = useToast();

    // Editor State
    const [formData, setFormData] = useState<ApprovalFlow | null>(null);

    // Initialize selection
    useEffect(() => {
        if (flows.length > 0 && !selectedFlowId) {
            setSelectedFlowId(flows[0].id);
        }
    }, [flows, selectedFlowId]);

    // Sync form data
    useEffect(() => {
        if (selectedFlowId) {
            const flow = flows.find(f => f.id === selectedFlowId);
            if (flow) {
                // Ensure optional fields are initialized for UI
                const safeFlow = JSON.parse(JSON.stringify(flow));
                if (!safeFlow.escalationRule) safeFlow.escalationRule = { enabled: false, afterHours: 24, escalateTo: '', notifyVia: [] };
                if (!safeFlow.autoApprovalRules) safeFlow.autoApprovalRules = { enabled: false, conditions: [] };
                setFormData(safeFlow);
            }
        }
    }, [selectedFlowId, flows]);

    const handleSave = () => {
        if (!formData || !selectedFlowId) return;
        updateFlow(selectedFlowId, formData);
        toast({ title: "Configuration Saved", description: "Workflow settings have been updated successfully." });
    };

    const handleCreate = (name: string, type: ApprovalType) => {
        createFlow({
            name,
            type,
            description: "New workflow configuration",
            levels: [{ level: 1, approverRole: "Manager", isMandatory: true }],
            isActive: false,
            applicableTo: {},
            escalationRule: { enabled: false, afterHours: 48, escalateTo: 'HR Manager', notifyVia: ['Email'] },
            autoApprovalRules: { enabled: false, conditions: [] }
        });
        setIsCreateDialogOpen(false);
        toast({ title: "Workflow Created", description: "Start by defining your approval steps." });
    };

    const handleAddStep = () => {
        if (!formData) return;
        const newLevel: ApprovalLevel = {
            level: formData.levels.length + 1,
            approverRole: "HR Manager",
            isMandatory: true
        };
        setFormData({ ...formData, levels: [...formData.levels, newLevel] });
    };

    const handleRemoveStep = (idx: number) => {
        if (!formData) return;
        const newLevels = formData.levels.filter((_, i) => i !== idx).map((lvl, i) => ({ ...lvl, level: i + 1 }));
        setFormData({ ...formData, levels: newLevels });
    };

    const updateStep = (idx: number, field: keyof ApprovalLevel, value: any) => {
        if (!formData) return;
        const newLevels = [...formData.levels];
        newLevels[idx] = { ...newLevels[idx], [field]: value };
        setFormData({ ...formData, levels: newLevels });
    };

    // Mapping Logic
    const handleMapUser = (role: string, userId: string) => {
        const currentUsers = roleMappings[role] || [];
        if (!currentUsers.includes(userId)) {
            updateRoleMapping(role, [...currentUsers, userId]);
        }
    };

    const handleUnmapUser = (role: string, userId: string) => {
        const currentUsers = roleMappings[role] || [];
        updateRoleMapping(role, currentUsers.filter(id => id !== userId));
    };

    if (!formData) return null;

    return (
        <div className="flex h-full bg-[#f8fafc]">
            {/* Sidebar: Workflow List */}
            <div className="w-80 flex flex-col border-r border-slate-200 bg-white">
                <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Workflows</h2>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus size={18} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search workflows..."
                            className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-xl text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-1">
                        {flows.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((flow) => (
                            <div
                                key={flow.id}
                                onClick={() => setSelectedFlowId(flow.id)}
                                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedFlowId === flow.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={`text-[9px] px-1.5 h-4 border-slate-200 ${flow.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                                            {flow.type}
                                        </Badge>
                                        {flow.isActive && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                    </div>
                                    <p className={`text-sm font-semibold ${selectedFlowId === flow.id ? 'text-indigo-900' : 'text-slate-700'}`}>{flow.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{flow.levels.length} Step(s)</p>
                                </div>
                                {selectedFlowId === flow.id && <ChevronRight size={16} className="text-indigo-400" />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
                {/* Header */}
                <div className="h-16 px-8 flex justify-between items-center bg-white border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <GitBranch size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{formData.name}</h1>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className="scale-75"
                                />
                                <span className={`text-xs font-semibold ${formData.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {formData.isActive ? 'Active Workflow' : 'Draft Mode'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteFlow(formData.id)}>
                            <Trash2 size={16} className="mr-2" /> Delete
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100" onClick={handleSave}>
                            <Save size={16} className="mr-2" /> Save Config
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="chain" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-8 pt-6 pb-2">
                        <TabsList className="bg-white border border-slate-200 rounded-lg p-1 h-11 shadow-sm w-fit">
                            <TabsTrigger value="chain" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"><GitBranch size={14} className="mr-2" /> Approval Chain</TabsTrigger>
                            <TabsTrigger value="escalation" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"><Zap size={14} className="mr-2" /> Automation & Escalation</TabsTrigger>
                            <TabsTrigger value="mapping" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"><UserCog size={14} className="mr-2" /> Approver Mapping</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-8 pb-8">
                        <div className="max-w-5xl mx-auto py-4">

                            {/* Chain Tab */}
                            <TabsContent value="chain" className="space-y-6 m-0">
                                <div className="space-y-4">
                                    {formData.levels.map((level, idx) => (
                                        <div key={idx} className="relative flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-indigo-50 shrink-0">
                                                    {level.level}
                                                </div>
                                                {idx !== formData.levels.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                                            </div>

                                            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Approver Role</Label>
                                                        <Select value={level.approverRole} onValueChange={(val) => updateStep(idx, 'approverRole', val)}>
                                                            <SelectTrigger className="bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Manager">Reporting Manager</SelectItem>
                                                                <SelectItem value="HR Manager">HR Manager</SelectItem>
                                                                <SelectItem value="Department Head">Department Head</SelectItem>
                                                                <SelectItem value="Finance Head">Finance Head</SelectItem>
                                                                <SelectItem value="CFO">CFO</SelectItem>
                                                                <SelectItem value="Director">Director</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold text-slate-500 uppercase">Condition (Optional)</Label>
                                                        <Input
                                                            value={level.condition || ''}
                                                            onChange={(e) => updateStep(idx, 'condition', e.target.value)}
                                                            placeholder="e.g. amount > 50000"
                                                            className="bg-slate-50 border-slate-200"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={level.isMandatory}
                                                            onCheckedChange={(val) => updateStep(idx, 'isMandatory', val)}
                                                        />
                                                        <span className="text-xs font-medium text-slate-600">Mandatory Step</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(idx)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8">
                                                        Remove Step
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-center py-4">
                                        <Button onClick={handleAddStep} variant="outline" className="border-dashed border-2 border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600">
                                            <Plus size={16} className="mr-2" /> Add Approval Step
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Escalation Tab */}
                            <TabsContent value="escalation" className="space-y-6 m-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Auto Approval */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Zap size={20} /></div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Auto-Approval Rules</h3>
                                                <p className="text-xs text-slate-500">Automatically approve requests meeting strict criteria.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <Label className="font-medium text-slate-700">Enable Auto-Approval</Label>
                                                <Switch
                                                    checked={formData.autoApprovalRules?.enabled}
                                                    onCheckedChange={(val) => setFormData({ ...formData, autoApprovalRules: { ...formData.autoApprovalRules!, enabled: val } })}
                                                />
                                            </div>

                                            {formData.autoApprovalRules?.enabled && (
                                                <div className="space-y-2">
                                                    <Label>Conditions (One per line)</Label>
                                                    <Textarea
                                                        value={formData.autoApprovalRules.conditions.join('\n')}
                                                        onChange={(e) => setFormData({ ...formData, autoApprovalRules: { ...formData.autoApprovalRules!, conditions: e.target.value.split('\n') } })}
                                                        placeholder="amount < 500&#10;days <= 1"
                                                        className="min-h-[100px] bg-slate-50 border-slate-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Escalation Rule */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">Escalation Policy</h3>
                                                <p className="text-xs text-slate-500">Handle stagnant requests automatically.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <Label className="font-medium text-slate-700">Enable Escalation</Label>
                                                <Switch
                                                    checked={formData.escalationRule?.enabled}
                                                    onCheckedChange={(val) => setFormData({ ...formData, escalationRule: { ...formData.escalationRule!, enabled: val } })}
                                                />
                                            </div>

                                            {formData.escalationRule?.enabled && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Escalate After (Hours)</Label>
                                                        <Input
                                                            type="number"
                                                            value={formData.escalationRule!.afterHours}
                                                            onChange={(e) => setFormData({ ...formData, escalationRule: { ...formData.escalationRule!, afterHours: parseInt(e.target.value) } })}
                                                            className="bg-slate-50 border-slate-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Escalate To (Role)</Label>
                                                        <Select
                                                            value={formData.escalationRule!.escalateTo}
                                                            onValueChange={(val) => setFormData({ ...formData, escalationRule: { ...formData.escalationRule!, escalateTo: val } })}
                                                        >
                                                            <SelectTrigger className="bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="HR Manager">HR Manager</SelectItem>
                                                                <SelectItem value="HR Head">HR Head</SelectItem>
                                                                <SelectItem value="CFO">CFO</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Mapping Tab */}
                            <TabsContent value="mapping" className="space-y-6 m-0">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <div className="mb-6">
                                        <h3 className="font-bold text-slate-800 text-lg">Approver Matrix Mapping</h3>
                                        <p className="text-sm text-slate-500">Assign real users to the abstract roles used in your workflows.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {['HR Manager', 'Finance Head', 'HR Head', 'CFO', 'IT Head'].map(role => (
                                            <div key={role} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">{role}</Badge>
                                                    </div>
                                                    <Button size="sm" variant="ghost" onClick={() => setMappingRole(role)} className="h-6 w-6 p-0 rounded-full hover:bg-indigo-100 hover:text-indigo-600">
                                                        <Settings2 size={14} />
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    {(roleMappings[role] || []).length > 0 ? (
                                                        (roleMappings[role] || []).map(userId => {
                                                            const user = teamMembers.find(m => m.id === userId);
                                                            return (
                                                                <div key={userId} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600">{user?.avatar || 'U'}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-bold text-slate-700 truncate">{user?.name || userId}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    ) : (
                                                        <div className="text-center py-4 text-xs text-slate-400 italic">No users mapped</div>
                                                    )}
                                                </div>

                                                <Button
                                                    onClick={() => setMappingRole(role)}
                                                    variant="outline"
                                                    className="w-full mt-3 h-8 text-xs border-dashed border-slate-300 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
                                                >
                                                    Manage Users
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-6">
                    <DialogHeader>
                        <DialogTitle>Create Workflow</DialogTitle>
                        <DialogDescription>Initialize a new approval chain.</DialogDescription>
                    </DialogHeader>
                    {/* Simple creation inputs omitted for brevity, focusing on main logic */}
                    <div className="grid gap-4 py-4">
                        <Button onClick={() => handleCreate("New Leave Policy", "Leave")} className="bg-indigo-600 text-white">Initialize Standard Leave Flow</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* User Mapping Dialog */}
            <Dialog open={!!mappingRole} onOpenChange={(open) => !open && setMappingRole(null)}>
                <DialogContent className="max-w-md rounded-2xl border-none p-6">
                    <DialogHeader>
                        <DialogTitle>Assign Users to "{mappingRole}"</DialogTitle>
                        <DialogDescription>Select employees who satisfy this role requirement.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Add Employee</Label>
                            <Select onValueChange={(val) => mappingRole && handleMapUser(mappingRole, val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Search employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamMembers.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Assigned Users</Label>
                            <div className="space-y-2">
                                {mappingRole && (roleMappings[mappingRole] || []).map(userId => {
                                    const user = teamMembers.find(m => m.id === userId);
                                    return (
                                        <div key={userId} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8"><AvatarFallback>{user?.avatar}</AvatarFallback></Avatar>
                                                <div>
                                                    <p className="text-sm font-bold">{user?.name}</p>
                                                    <p className="text-xs text-slate-500">{user?.designation}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                                                onClick={() => handleUnmapUser(mappingRole!, userId)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Chevron/Icons helper components */}
            <div className="hidden">
                <p className="font-semibold"></p>
                <ArrowRight />
            </div>
        </div>
    );
};

export default ApprovalMatrixPage;
