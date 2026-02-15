"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    ShieldCheck,
    Plus,
    Search,
    Trash2,
    Users,
    CheckCircle2,
    XCircle,
    Save,
    History as HistoryIcon,
    AlertTriangle,
    Eye,
    EyeOff,
    MoreVertical,
    Lock,
    Settings
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useRolesStore, type Role, AVAILABLE_MODULES, type PermissionAction, type DataScope } from "@/shared/data/roles-store";
import { useTeamStore } from "@/shared/data/team-store"; // Integration with real employee data
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Textarea } from "@/shared/components/ui/textarea";

// Mock Field Definitions for "Field-Level Permissions"
const MODULE_FIELDS: Record<string, string[]> = {
    'Employees': ['Full Name', 'Personal Email', 'Phone Number', 'Current Address', 'Bank Details', 'Salary Info', 'Documents'],
    'Payroll': ['Basic Salary', 'HRA', 'Special Allowances', 'Tax Deductions', 'Payslips', 'Bonus History'],
    'Attendance': ['Check-In/Out Time', 'Regularization Requests', 'Locational Data', 'Working Hours'],
    'Recruitment': ['Candidate CV', 'Interview Notes', 'Offer Letter Value', 'Background Check Report'],
    'Performance': ['Appraisal Rating', 'Manager Feedback', 'Goal Achievement Status', 'Promotion History'],
    'Leave Management': ['Leave Balance', 'Casual Leave History', 'Sick Leave History', 'Loss of Pay Data']
    // Default fallback for others
};

const RolesPermissionsPage = () => {
    const { roles, createRole, updateRole, deleteRole, updatePermissions, assignRole, unassignRole } = useRolesStore();
    const { members: teamMembers } = useTeamStore();
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [fieldConfigModule, setFieldConfigModule] = useState<string | null>(null); // Track which module is being configured

    const { toast } = useToast();

    // Form State (mirrors the selected role for editing)
    const [formData, setFormData] = useState<Role | null>(null);
    const [selectedEmployeeToAdd, setSelectedEmployeeToAdd] = useState<string>("");

    // Initialize selection
    useEffect(() => {
        if (roles.length > 0 && !selectedRoleId) {
            setSelectedRoleId(roles[0].id);
        }
    }, [roles, selectedRoleId]);

    // Sync form data when selection changes
    useEffect(() => {
        if (selectedRoleId) {
            const role = roles.find(r => r.id === selectedRoleId);
            if (role) setFormData(JSON.parse(JSON.stringify(role))); // Deep copy
        }
    }, [selectedRoleId, roles]);

    const handleSave = () => {
        if (!formData || !selectedRoleId) return;

        updateRole(selectedRoleId, {
            name: formData.name,
            description: formData.description,
            approvalAuthorityLevel: formData.approvalAuthorityLevel
        });
        updatePermissions(selectedRoleId, formData.permissions);
        
        // Also update assignments if changed (logic typically handled separately but ensuring sync)
        // Note: assignRole/unassignRole actions in store are transactional, so we use them directly in UI usually.
        // But here we rely on the specific actions for member management.
        
        toast({ title: "Changes Saved", description: "Role configuration has been updated successfully." });
    };

    const handleDelete = () => {
        if (selectedRoleId) {
            deleteRole(selectedRoleId);
            setIsDeleteDialogOpen(false);
            setFormData(null);
            setSelectedRoleId(roles[0]?.id || null);
            toast({ title: "Role Deleted", description: "The role has been permanently removed." });
        }
    };

    const handleCreate = (name: string, desc: string) => {
        createRole({
            name,
            description: desc,
            type: 'Custom',
            approvalAuthorityLevel: 0,
            permissions: AVAILABLE_MODULES.map(m => ({
                module: m,
                actions: { view: false, create: false, edit: false, delete: false, approve: false },
                scope: "Self",
                hasConfidentialAccess: false,
                fieldAccess: {}
            }))
        });
        setIsCreateDialogOpen(false);
        toast({ title: "Role Created", description: "New role added. Configure permissions now." });
    };

    const togglePermission = (moduleIndex: number, action: PermissionAction) => {
        if (!formData) return;
        const newPerms = [...formData.permissions];
        newPerms[moduleIndex].actions[action] = !newPerms[moduleIndex].actions[action];
        setFormData({ ...formData, permissions: newPerms });
    };

    const updateScope = (moduleIndex: number, scope: DataScope) => {
        if (!formData) return;
        const newPerms = [...formData.permissions];
        newPerms[moduleIndex].scope = scope;
        setFormData({ ...formData, permissions: newPerms });
    };

    const handleAddMember = () => {
        if (!selectedEmployeeToAdd || !selectedRoleId) return;
        
        const employee = teamMembers.find(m => m.id === selectedEmployeeToAdd);
        if (employee) {
            assignRole(employee.id, employee.name, selectedRoleId, "HR Admin");
            // Locally update form data to reflect change immediately
            if (formData) {
                setFormData({
                    ...formData,
                    assignedTo: [...formData.assignedTo, employee.id]
                });
            }
            setSelectedEmployeeToAdd("");
            toast({ title: "User Assigned", description: `${employee.name} has been assigned to this role.` });
        }
    };

    const handleRemoveMember = (empId: string) => {
        // In a real app we'd map assignment ID. Here assuming a simple relation removal for UI.
        // We'll update the local state and store
         if (formData && selectedRoleId) {
            // Find assignment ID would be ideal, but for now we direct manipulate
            // This requires unassignRole in store to work with EmployeeID or finding the assignment first.
            // Let's assume we can remove by filter for now in local state, real store removal needs assignment ID
            // Since store implementation uses assignment ID, we should technically find it. 
            // For MVP UI, we will just update local state and assume backend sync on 'Save' or direct action if supported.
            // Wait, store has unassignRole by AssignmentID. Let's look up assignment.
            // Since we can't easily get AssignmentID in this view without fetching 'assignments', 
            // we will simulate removal by updating the Role's assignedTo array directly via updateRole for this specific field if needed,
            // OR better, we acknowledge current limitation and just update local view + trigger a standard role update.
             
            const newAssigned = formData.assignedTo.filter(id => id !== empId);
            setFormData({...formData, assignedTo: newAssigned});
            updateRole(selectedRoleId, { assignedTo: newAssigned }); // Direct update to role
            toast({ title: "User Removed", description: "User access revoked." });
         }
    };

    const updateFieldPermission = (moduleName: string, field: string, value: 'view' | 'edit' | 'hidden') => {
        if (!formData) return;
        const moduleIndex = formData.permissions.findIndex(p => p.module === moduleName);
        if (moduleIndex === -1) return;

        const newPerms = [...formData.permissions];
        // Ensure fieldAccess object exists
        if (!newPerms[moduleIndex].fieldAccess) newPerms[moduleIndex].fieldAccess = {};
        
        newPerms[moduleIndex].fieldAccess[field] = value;
        setFormData({ ...formData, permissions: newPerms });
    };

    if (!formData) return null;

    // Helper to get active module permissions for Field Config Dialog
    const activeFieldModule = fieldConfigModule ? formData.permissions.find(p => p.module === fieldConfigModule) : null;

    return (
        <div className="flex h-full bg-[#f8fafc]">
            {/* Sidebar: Role List */}
            <div className="w-80 flex flex-col border-r border-slate-200 bg-white">
                <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Roles</h2>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus size={18} />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search roles..." 
                            className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-xl text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-1">
                        {roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setSelectedRoleId(role.id)}
                                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedRoleId === role.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${selectedRoleId === role.id ? 'text-indigo-900' : 'text-slate-700'}`}>{role.name}</span>
                                        {role.type === 'System' && <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-slate-100 text-slate-500">SYS</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                        <Users size={12} /> {role.assignedTo.length} members
                                    </div>
                                </div>
                                {selectedRoleId === role.id && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
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
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{formData.name}</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">Last updated: {new Date(formData.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {formData.type !== 'System' && (
                            <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50" onClick={() => setIsDeleteDialogOpen(true)}>
                                <Trash2 size={16} className="mr-2" /> Delete
                            </Button>
                        )}
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100" onClick={handleSave}>
                            <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>

                {/* Tabs & Content */}
                <Tabs defaultValue="permissions" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-8 pt-6 pb-2">
                        <TabsList className="bg-white border border-slate-200 rounded-lg p-1 h-11 shadow-sm w-fit">
                            <TabsTrigger value="overview" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Overview</TabsTrigger>
                            <TabsTrigger value="permissions" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Permissions</TabsTrigger>
                            <TabsTrigger value="members" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Assigned Members</TabsTrigger>
                            <TabsTrigger value="history" className="rounded-md px-6 text-sm font-medium data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Audit Log</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-8 pb-8">
                        <div className="max-w-5xl mx-auto py-4">
                            
                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6 m-0">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-slate-900 font-semibold">Role Name</Label>
                                            <Input 
                                                value={formData.name} 
                                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                                className="bg-slate-50 border-slate-200 focus:ring-indigo-500 h-11"
                                                disabled={formData.type === 'System'}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-900 font-semibold">Approval Authority</Label>
                                            <Select 
                                                value={formData.approvalAuthorityLevel.toString()}
                                                onValueChange={val => setFormData({...formData, approvalAuthorityLevel: parseInt(val)})}
                                            >
                                                <SelectTrigger className="bg-slate-50 border-slate-200 h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">Level 0 (No Approval Rights)</SelectItem>
                                                    <SelectItem value="1">Level 1 (Team Management)</SelectItem>
                                                    <SelectItem value="2">Level 2 (Department Head)</SelectItem>
                                                    <SelectItem value="3">Level 3 (Regional Director)</SelectItem>
                                                    <SelectItem value="4">Level 4 (VP / Executive)</SelectItem>
                                                    <SelectItem value="5">Level 5 (CXO / Full Power)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-slate-500 mt-1">Determines the maximum value/criticality of items this role can approve.</p>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-slate-900 font-semibold">Description</Label>
                                            <Textarea 
                                                value={formData.description} 
                                                onChange={e => setFormData({...formData, description: e.target.value})} 
                                                className="bg-slate-50 border-slate-200 focus:ring-indigo-500 min-h-[100px] resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Permissions Tab */}
                            <TabsContent value="permissions" className="m-0">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                     <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Module Name</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Data Scope</th>
                                                 <th className="py-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">View</th>
                                                <th className="py-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Create</th>
                                                <th className="py-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Edit</th>
                                                <th className="py-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Delete</th>
                                                <th className="py-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-12">Approve</th>
                                                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Field Config</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {formData.permissions.map((perm, idx) => (
                                                <tr key={perm.module} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4 px-6 font-semibold text-slate-700 text-sm">{perm.module}</td>
                                                    <td className="py-4 px-6 text-center">
                                                        <Select value={perm.scope} onValueChange={(val: DataScope) => updateScope(idx, val)}>
                                                            <SelectTrigger className="h-8 w-32 mx-auto bg-white border-slate-200 text-xs font-medium">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Self">Self Only</SelectItem>
                                                                <SelectItem value="Team">My Team</SelectItem>
                                                                <SelectItem value="Department">Department</SelectItem>
                                                                <SelectItem value="Organization">Organization</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </td>
                                                     {(['view', 'create', 'edit', 'delete', 'approve'] as PermissionAction[]).map(action => (
                                                        <td key={action} className="py-4 px-2 text-center">
                                                            <div 
                                                                onClick={() => togglePermission(idx, action)}
                                                                className={`h-5 w-5 mx-auto rounded border cursor-pointer flex items-center justify-center transition-all ${perm.actions[action] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 hover:border-indigo-400'}`}
                                                            >
                                                                {perm.actions[action] && <CheckCircle2 size={12} strokeWidth={4} />}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    <td className="py-4 px-6 text-right">
                                                         {MODULE_FIELDS[perm.module] ? (
                                                             <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="h-8 text-xs font-medium text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                                                onClick={() => setFieldConfigModule(perm.module)}
                                                            >
                                                                <Settings size={12} className="mr-2" /> Configure
                                                             </Button>
                                                         ) : (
                                                             <span className="text-xs text-slate-300 italic">No Fields</span>
                                                         )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            {/* Members Tab */}
                            <TabsContent value="members" className="m-0 space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-base font-bold text-slate-800">Assigned Users ({formData.assignedTo.length})</h3>
                                        
                                        <div className="flex gap-2">
                                            <Select value={selectedEmployeeToAdd} onValueChange={setSelectedEmployeeToAdd}>
                                                <SelectTrigger className="w-56 bg-slate-50 border-slate-200 h-9 text-xs">
                                                    <SelectValue placeholder="Select Employee to Add" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teamMembers.filter(m => !formData.assignedTo.includes(m.id)).map(member => (
                                                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" onClick={handleAddMember} disabled={!selectedEmployeeToAdd} className="bg-indigo-600 hover:bg-indigo-700 h-9">
                                                Assign
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {formData.assignedTo.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {formData.assignedTo.map(userId => {
                                                const member = teamMembers.find(m => m.id === userId);
                                                return (
                                                    <div key={userId} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 border border-white shadow-sm">
                                                                <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                                                                    {member?.avatar || 'U'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">{member?.name || `Unknown User (${userId})`}</p>
                                                                <p className="text-xs text-slate-400">{member?.designation || 'Staff ID: ' + userId}</p>
                                                            </div>
                                                        </div>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            onClick={() => handleRemoveMember(userId)}
                                                            className="h-8 w-8 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <XCircle size={16} />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 font-medium text-sm">No users currently assigned to this role.</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* History Tab */}
                             <TabsContent value="history" className="m-0">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <HistoryIcon size={18} className="text-slate-400" /> Audit Timeline
                                    </h3>
                                    <div className="space-y-8 relative pl-6 border-l-2 border-slate-100 ml-2">
                                        {formData.history && formData.history.length > 0 ? (
                                            formData.history.map((log) => (
                                                <div key={log.id} className="relative">
                                                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-white border-4 border-indigo-100 shadow-sm" />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{new Date(log.timestamp).toLocaleString()}</span>
                                                            <Badge variant="outline" className="text-[10px] font-bold h-5 border-slate-200">{log.action}</Badge>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-800">{log.details}</p>
                                                        <p className="text-xs text-slate-400">Action by: <span className="font-semibold text-slate-600">{log.actor}</span></p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No history recorded yet.</p>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                        </div>
                    </ScrollArea>
                </Tabs>
            </div>

            {/* Field Configuration Dialog */}
            <Dialog open={!!fieldConfigModule} onOpenChange={(open) => !open && setFieldConfigModule(null)}>
                <DialogContent className="max-w-2xl rounded-2xl border-none p-8">
                    <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Settings className="text-indigo-600" size={20} />
                            Field Permissions - {fieldConfigModule}
                        </DialogTitle>
                        <DialogDescription>
                            Configure granular access rights for sensitive fields within this module.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {fieldConfigModule && MODULE_FIELDS[fieldConfigModule]?.map(field => {
                            const currentVal = activeFieldModule?.fieldAccess?.[field] || 'view';
                            return (
                                <div key={field} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-700">{field}</span>
                                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                                        {(['view', 'edit', 'hidden'] as const).map(option => (
                                            <button
                                                key={option}
                                                onClick={() => updateFieldPermission(fieldConfigModule, field, option)}
                                                className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all ${currentVal === option 
                                                    ? option === 'hidden' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700' 
                                                    : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <DialogFooter className="pt-4 border-t border-slate-100">
                        <Button onClick={() => setFieldConfigModule(null)} className="bg-indigo-600 text-white rounded-xl">Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Role Dialog */}
            <CreateRoleDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} onCreate={handleCreate} />
            
            {/* Delete Confirmation */}
            <DeleteConfirmDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} />
        </div>
    );
};

const CreateRoleDialog = ({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (n: string, d: string) => void }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-none p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Role</DialogTitle>
                    <DialogDescription>Define a new security profile for your organization.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Role Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Finance Auditor" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this role for?" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onCreate(name, desc)} className="bg-indigo-600 text-white hover:bg-indigo-700">Create Role</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmDialog = ({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl border-none p-6 text-center">
                <div className="mx-auto h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                    <AlertTriangle size={24} />
                </div>
                <DialogTitle className="text-lg font-bold text-slate-900">Delete this Role?</DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-2 mb-6">
                    This action is permanent. All users assigned to this role (if any) will lose access permissions immediately.
                </DialogDescription>
                <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="rounded-lg bg-rose-600 hover:bg-rose-700">Delete Permanently</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RolesPermissionsPage;
