"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    UserCheck,
    UserX,
    Clock,
    TrendingUp,
    Award,
    Calendar,
    Briefcase,
    ChevronRight,
    Search,
    Filter,
    ArrowRight,
    Plus,
    Users,
    Mail,
    Building2,
    Edit,
    Trash2,
    MoreVertical,
    FileText,
    Download
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import TeamDocumentsPanel from "@/shared/components/hrm/my-team/panels/team-documents-panel";
import { createEmployee, updateEmployee, deleteEmployee, getAllEmployees } from "@/modules/hrm/hooks/hrmHooks";
import { validateMemberForm, ValidationErrors } from "@/shared/utils/form-validation";

const mapBackendEmployee = (emp: any) => {
    const firstName = emp?.firstName || emp?.first_name || "";
    const lastName = emp?.lastName || emp?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || emp?.name || "Unknown";
    return {
        id: String(emp?._id || emp?.id || emp?.employeeId || ""),
        workspaceId: "ws-1",
        name: fullName,
        email: emp?.email || "",
        phone: emp?.phone || emp?.phoneNumber || "",
        avatar: fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
        role: "MEMBER" as const,
        joinedAt: emp?.createdAt || new Date().toISOString(),
        projectsCount: 0,
        designation: typeof emp?.position === "object" ? emp?.position?.title : (emp?.position || emp?.designation || ""),
        department: typeof emp?.department === "object" ? emp?.department?.name : (emp?.department || ""),
        status: emp?.status === "Active" || !emp?.status ? "Active" as const : emp?.status as any,
        joiningDate: emp?.joiningDate || emp?.createdAt,
        documents: [],
    };
};

const splitName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    return {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || parts[0] || "",
    };
};

const TeamMembersPage = () => {
    const { toast } = useToast();
    const { members, addMember, updateMember, removeMember } = useTeamStore();

    // Backend sync state
    const [apiSyncing, setApiSyncing] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState(true);

    // Load employees from backend API on mount, sync to local store
    React.useEffect(() => {
        const syncFromBackend = async () => {
            setApiSyncing(true);
            try {
                const res = await getAllEmployees();
                const rawEmployees = res?.data?.data ?? res?.data ?? [];
                if (Array.isArray(rawEmployees) && rawEmployees.length > 0) {
                    // Map and sync to local store — clear and re-add
                    const store = useTeamStore.getState();
                    const currentIds = new Set(store.members.map((m: any) => m.id));
                    rawEmployees.forEach((emp: any) => {
                        const mapped = mapBackendEmployee(emp);
                        if (!currentIds.has(mapped.id)) {
                            store.addMember(mapped as any);
                        } else {
                            store.updateMember(mapped.id, mapped as any);
                        }
                    });
                    setBackendAvailable(true);
                }
            } catch (err: any) {
                console.warn("Backend unavailable, using local store", err);
                setBackendAvailable(false);
            } finally {
                setApiSyncing(false);
            }
        };
        syncFromBackend();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'On Leave'>('All');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [detailMember, setDetailMember] = useState<any | null>(null);
    const [memberForm, setMemberForm] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
    });
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});
    const [showVault, setShowVault] = useState(false);
    const [activeTab, setActiveTab] = useState("members");
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const resetForm = () => {
        setMemberForm({ name: '', email: '', phone: '', designation: '', department: '' });
        setFormErrors({});
    };

    const filteredMembers = members.filter(m => {
        const matchesSearch = (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.email || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || m.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: "Total Members", value: members.length, color: "bg-[#CB9DF0]", icon: <Users className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active personnel", value: members.filter(m => m.status === 'Active').length, color: "bg-emerald-100", icon: <UserCheck className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "On Leave", value: members.filter(m => m.status === 'On Leave').length, color: "bg-amber-100", icon: <Calendar className="text-amber-600" />, textColor: "text-amber-900" },
    ];

    const handleAdd = async () => {
        const errors = validateMemberForm(memberForm);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast({ title: "Please fix form errors", description: "Some fields are invalid.", variant: "destructive" });
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);

        const avatar = memberForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const { firstName, lastName } = splitName(memberForm.name);

        try {
            if (backendAvailable) {
                const res = await createEmployee({
                    firstName,
                    lastName,
                    email: memberForm.email,
                    department: memberForm.department,
                    position: memberForm.designation,
                });
                const created = res?.data?.data ?? res?.data;
                if (created) {
                    addMember(mapBackendEmployee(created) as any);
                    toast({ title: "Team Member Added", description: `${memberForm.name} saved to backend.` });
                    setIsAddOpen(false);
                    resetForm();
                    return;
                }
            }
            // Fallback: local only
            addMember({
                ...memberForm,
                avatar,
                status: 'Active',
                joiningDate: new Date().toISOString()
            } as any);
            toast({ title: "Team Member Added", description: `${memberForm.name} added locally.` });
            setIsAddOpen(false);
            resetForm();
        } catch (err: any) {
            // Error toast is handled by hrmHooks; save locally as backup
            addMember({
                ...memberForm,
                avatar,
                status: 'Active',
                joiningDate: new Date().toISOString()
            } as any);
            toast({ title: "Saved Locally", description: "Backend failed; member added to local cache.", variant: "destructive" });
            setIsAddOpen(false);
            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (member: any) => {
        setSelectedMember(member);
        setMemberForm({
            name: member.name || '',
            email: member.email || '',
            phone: member.phone || '',
            designation: member.designation || '',
            department: member.department || '',
        });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedMember) return;
        const errors = validateMemberForm(memberForm);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast({ title: "Please fix form errors", description: "Some fields are invalid.", variant: "destructive" });
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);

        const { firstName, lastName } = splitName(memberForm.name);

        try {
            if (backendAvailable) {
                await updateEmployee(selectedMember.id, {
                    firstName,
                    lastName,
                    email: memberForm.email,
                    phone: memberForm.phone,
                    department: memberForm.department,
                    position: memberForm.designation,
                });
            }
            updateMember(selectedMember.id, memberForm as any);
            toast({ title: "Profile Updated", description: "Team member details saved." });
            setIsEditOpen(false);
            resetForm();
        } catch (err: any) {
            updateMember(selectedMember.id, memberForm as any);
            toast({ title: "Saved Locally", description: "Backend update failed; local cache updated.", variant: "destructive" });
            setIsEditOpen(false);
            resetForm();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (member: any) => {
        setDeleteTarget(member);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsSubmitting(true);
        try {
            if (backendAvailable) {
                await deleteEmployee(deleteTarget.id);
            }
            removeMember(deleteTarget.id);
            toast({ title: "Member Removed", description: `${deleteTarget.name} has been expelled from the team.`, variant: "destructive" });
        } catch (err) {
            removeMember(deleteTarget.id);
            toast({ title: "Removed Locally", description: "Backend delete failed; local cache updated.", variant: "destructive" });
        } finally {
            setDeleteTarget(null);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-5 space-y-5" style={{ zoom: "90%" }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Team Members</h1>
                    <p className="text-slate-500 font-medium text-[11px] mt-1.5">View and manage your team members.</p>
                </div>
                <TabsList className="bg-white border border-slate-200 rounded-xl p-1 h-auto">
                    <TabsTrigger value="members" className="rounded-lg font-bold text-xs px-5 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-2">
                        <Users size={14} /> Members
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-lg font-bold text-xs px-5 py-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-2">
                        <FileText size={14} /> Documents
                    </TabsTrigger>
                </TabsList>

                {activeTab === "members" && (
                <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 shadow-md font-bold transition-all border-none">
                            <Plus className="mr-2 h-4 w-4" /> Add Team Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gradient-to-br from-indigo-50/80 via-white to-white rounded-[2rem] border border-slate-200 shadow-2xl p-10 max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar !top-[10%] !translate-y-0">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add Team Member</DialogTitle>
                            <DialogDescription className="font-medium text-slate-500 text-sm mt-1">
                                Invite a new person to join your department.
                                {!backendAvailable && <span className="text-amber-600"> (Offline — saving locally)</span>}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-6 font-display">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Full Name *</Label>
                                <Input
                                    placeholder="Employee name"
                                    value={memberForm.name}
                                    onChange={e => { setMemberForm({ ...memberForm, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }}
                                    className={`rounded-xl bg-slate-50 border h-12 ${formErrors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200'}`}
                                />
                                {formErrors.name && <p className="text-[11px] font-medium text-rose-500">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Work Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="email@company.com"
                                    value={memberForm.email}
                                    onChange={e => { setMemberForm({ ...memberForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }}
                                    className={`rounded-xl bg-slate-50 border h-12 ${formErrors.email ? 'border-rose-400' : 'border-slate-200'}`}
                                />
                                {formErrors.email && <p className="text-[11px] font-medium text-rose-500">{formErrors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Phone</Label>
                                <Input
                                    placeholder="+91..."
                                    value={memberForm.phone}
                                    onChange={e => { setMemberForm({ ...memberForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }}
                                    className={`rounded-xl bg-slate-50 border h-12 ${formErrors.phone ? 'border-rose-400' : 'border-slate-200'}`}
                                />
                                {formErrors.phone && <p className="text-[11px] font-medium text-rose-500">{formErrors.phone}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Designation</Label>
                                <Input
                                    placeholder="e.g. UX Designer"
                                    value={memberForm.designation}
                                    onChange={e => { setMemberForm({ ...memberForm, designation: e.target.value }); if (formErrors.designation) setFormErrors({ ...formErrors, designation: "" }); }}
                                    className={`rounded-xl bg-slate-50 border h-12 ${formErrors.designation ? 'border-rose-400' : 'border-slate-200'}`}
                                />
                                {formErrors.designation && <p className="text-[11px] font-medium text-rose-500">{formErrors.designation}</p>}
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="font-bold text-slate-700">Department</Label>
                                <Input
                                    placeholder="e.g. Engineering"
                                    value={memberForm.department}
                                    onChange={e => setMemberForm({ ...memberForm, department: e.target.value })}
                                    className="rounded-xl bg-slate-50 border border-slate-200 h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={isSubmitting} className="w-full bg-slate-900 text-white rounded-xl h-11 font-bold text-sm shadow-lg hover:bg-slate-800 transition-all border-none disabled:opacity-50" onClick={handleAdd}>
                                {isSubmitting ? "Saving..." : "Confirm Admission"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                )}
            </div>

            <TabsContent value="members" className="space-y-5 mt-0">
            {/* Stats */}
            <div className="flex flex-wrap gap-5">
                {stats.map((stat, i) => (
                    <motion.div key={i} className="min-w-[200px] flex-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-4 flex items-center gap-3 border border-white/20 h-full`}>
                            <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                            </div>
                            <div>
                                <p className={`text-[10px] font-bold tracking-widest ${stat.textColor} opacity-80 mb-1`}>{stat.label}</p>
                                <h3 className={`text-xl font-bold ${stat.textColor} tracking-tight leading-none`}>{stat.value}</h3>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                        placeholder="Search by name, role or email..."
                        className="pl-12 h-10 rounded-xl bg-slate-50 border-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['All', 'Active', 'On Leave'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${filterStatus === status
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members Grid Container */}
            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMembers.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card
                                onClick={() => setDetailMember(member)}
                                className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white p-4 group relative overflow-hidden border border-white/50 cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="flex items-center gap-3 text-start">
                                        <Avatar className="h-11 w-11 ring-2 ring-slate-50 shadow-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                                            <AvatarFallback>{member.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-[15px] text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                                            <p className="text-[11px] text-slate-400 font-bold tracking-wider mt-0.5">{member.designation}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all border-none" onClick={(e) => e.stopPropagation()}>
                                                <MoreVertical size={14} className="text-slate-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl p-1.5 border-none shadow-xl bg-white min-w-[160px]">
                                            <DropdownMenuItem className="font-bold text-xs rounded-lg focus:bg-indigo-50 py-2 cursor-pointer" onClick={() => handleEdit(member)}>
                                                <Edit size={14} className="mr-2 text-indigo-600" /> Edit Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="font-bold text-xs rounded-lg focus:bg-indigo-50 py-2 cursor-pointer" onClick={() => {
                                                setSelectedMember(member);
                                                setShowVault(true);
                                            }}>
                                                <FileText size={14} className="mr-2 text-amber-600" /> View Documents
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="font-bold text-xs rounded-lg focus:bg-indigo-50 py-2 cursor-pointer" onClick={() => toast({ title: "Opening Chat", description: `You can now message ${member.name}.` })}>
                                                <Mail size={14} className="mr-2 text-blue-600" /> Send Message
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="font-bold text-xs rounded-lg focus:bg-rose-50 text-rose-600 py-2 cursor-pointer" onClick={() => handleDelete(member)}>
                                                <Trash2 size={14} className="mr-2" /> Expel From Team
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-3 relative z-10 mt-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50/50 px-2 py-1.5 rounded-lg">
                                            <Mail size={14} className="text-slate-400 shrink-0" />
                                            <span className="font-bold text-[12px] truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-slate-500 bg-slate-50/50 px-2 py-1.5 rounded-lg">
                                            <Building2 size={14} className="text-slate-400 shrink-0" />
                                            <span className="font-bold text-[12px] truncate">{member.department}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
                                        <Badge className={`${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} border-none font-bold px-2 py-0.5 rounded-md text-[10px] tracking-tight shadow-none`}>
                                            {member.status}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Calendar size={12} className="opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(member.joiningDate).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center p-16 bg-white rounded-3xl shadow-sm border border-slate-100 mt-6">
                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Users className="text-slate-200" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 tracking-tight">No Personnel Found</h3>
                        <p className="text-slate-400 font-medium text-xs mt-2">Try refining your search parameters.</p>
                    </div>
                )}
                {/* Member Vault Dialog */}
                <Dialog open={showVault} onOpenChange={setShowVault}>
                    <DialogContent className="rounded-2xl border-none shadow-xl p-0 bg-white max-w-2xl overflow-hidden text-start">
                        {selectedMember && (
                            <div className="relative">
                                <div className="h-24 bg-indigo-600 w-full" />
                                <div className="px-8 pb-8">
                                    <div className="flex justify-between items-end -mt-10 mb-8">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg bg-indigo-50 text-indigo-700 font-bold text-2xl">
                                            <AvatarFallback>{selectedMember.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex gap-2 pb-1">
                                            <Button className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 font-bold text-[9px] tracking-widest shadow-md border-none" onClick={() => { window.location.href = `mailto:${selectedMember.email}`; }}>Contact</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-6 text-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedMember.name}</h3>
                                            <p className="text-slate-400 font-bold tracking-widest text-[9px] mt-1">{selectedMember.designation} • {selectedMember.department}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1 uppercase">Personnel Vault</Label>
                                            <div className="grid gap-3">
                                                {selectedMember.documents && selectedMember.documents.length > 0 ? (
                                                    selectedMember.documents.map((doc: any) => (
                                                        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                                                                    <FileText size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-800 leading-tight">{doc.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold mt-1">{doc.type} • {doc.size}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[8px] px-2 py-0.5 rounded-md shadow-none">{doc.status}</Badge>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white text-slate-400 hover:text-indigo-600 border-none" onClick={() => toast({ title: "Accessing File", description: `Downloading ${doc.name}...` })}>
                                                                    <Download size={14} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                        <p className="text-xs font-bold text-slate-400 tracking-widest leading-none">No Personal Documents Uploaded</p>
                                                        <Button variant="link" className="text-indigo-600 text-[10px] font-bold mt-2" onClick={() => toast({ title: "Upload Request Sent", description: `A document upload request has been created and sent to ${selectedMember.name} at ${selectedMember.email}.` })}>Send Upload Request</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
                <TeamDocumentsPanel />
            </TabsContent>
          </Tabs>

          {/* Edit Member Dialog */}
          <Dialog open={isEditOpen} onOpenChange={(o) => { setIsEditOpen(o); if (!o) resetForm(); }}>
              <DialogContent className="bg-gradient-to-br from-indigo-50/80 via-white to-white rounded-[2rem] border border-slate-200 shadow-2xl p-10 max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar !top-[10%] !translate-y-0">
                  <DialogHeader>
                      <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Edit Team Member</DialogTitle>
                      <DialogDescription className="font-medium text-slate-500 text-sm mt-1">
                          Update {selectedMember?.name}'s details.
                          {!backendAvailable && <span className="text-amber-600"> (Offline — updating locally)</span>}
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6 py-6">
                      <div className="space-y-2">
                          <Label className="font-bold text-slate-700">Full Name *</Label>
                          <Input
                              value={memberForm.name}
                              onChange={e => { setMemberForm({ ...memberForm, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }}
                              className={`rounded-xl bg-slate-50 border h-12 ${formErrors.name ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                          {formErrors.name && <p className="text-[11px] font-medium text-rose-500">{formErrors.name}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label className="font-bold text-slate-700">Work Email *</Label>
                          <Input
                              type="email"
                              value={memberForm.email}
                              onChange={e => { setMemberForm({ ...memberForm, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }}
                              className={`rounded-xl bg-slate-50 border h-12 ${formErrors.email ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                          {formErrors.email && <p className="text-[11px] font-medium text-rose-500">{formErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label className="font-bold text-slate-700">Phone</Label>
                          <Input
                              value={memberForm.phone}
                              onChange={e => { setMemberForm({ ...memberForm, phone: e.target.value }); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }}
                              className={`rounded-xl bg-slate-50 border h-12 ${formErrors.phone ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                          {formErrors.phone && <p className="text-[11px] font-medium text-rose-500">{formErrors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label className="font-bold text-slate-700">Designation</Label>
                          <Input
                              value={memberForm.designation}
                              onChange={e => { setMemberForm({ ...memberForm, designation: e.target.value }); if (formErrors.designation) setFormErrors({ ...formErrors, designation: "" }); }}
                              className={`rounded-xl bg-slate-50 border h-12 ${formErrors.designation ? 'border-rose-400' : 'border-slate-200'}`}
                          />
                          {formErrors.designation && <p className="text-[11px] font-medium text-rose-500">{formErrors.designation}</p>}
                      </div>
                      <div className="space-y-2 col-span-2">
                          <Label className="font-bold text-slate-700">Department</Label>
                          <Input
                              value={memberForm.department}
                              onChange={e => setMemberForm({ ...memberForm, department: e.target.value })}
                              className="rounded-xl bg-slate-50 border border-slate-200 h-12"
                          />
                      </div>
                  </div>
                  <DialogFooter className="gap-2">
                      <Button variant="outline" className="rounded-xl h-11 font-bold" onClick={() => { setIsEditOpen(false); resetForm(); }}>Cancel</Button>
                      <Button disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold text-sm shadow-lg border-none disabled:opacity-50" onClick={handleUpdate}>
                          {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
              <DialogContent className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 max-w-md">
                  <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-slate-900">Expel Team Member</DialogTitle>
                      <DialogDescription className="text-slate-500 text-sm mt-2">
                          Are you sure you want to remove <span className="font-bold text-rose-600">{deleteTarget?.name}</span> from the team? This action will also remove their attendance, leave and performance records.
                          {!backendAvailable && <span className="block mt-2 text-amber-600">(Offline — will only remove locally)</span>}
                      </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 mt-4">
                      <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                      <Button disabled={isSubmitting} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-10 font-bold text-sm border-none disabled:opacity-50" onClick={confirmDelete}>
                          <Trash2 className="mr-2 h-4 w-4" /> {isSubmitting ? "Removing..." : "Remove Member"}
                      </Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>

          {/* 🪟 Slide-in: Member Quick Details */}
          <Sheet open={!!detailMember} onOpenChange={(open) => !open && setDetailMember(null)}>
              <SheetContent side="right" className="w-full sm:max-w-md bg-white rounded-none border-l border-slate-200 p-0 flex flex-col">
                  {detailMember && (
                      <>
                          <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                              <div className="flex items-center gap-3">
                                  <Avatar className="h-14 w-14 ring-2 ring-white shadow">
                                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{detailMember.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-start min-w-0">
                                      <SheetTitle className="text-base font-bold text-slate-900 tracking-tight truncate">{detailMember.name}</SheetTitle>
                                      <SheetDescription className="text-xs font-medium text-slate-500">{detailMember.designation}</SheetDescription>
                                  </div>
                              </div>
                          </SheetHeader>
                          <div className="flex-1 overflow-y-auto p-6 space-y-4">
                              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-none flex items-center justify-between">
                                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Status</p>
                                  <Badge className={`${detailMember.status === 'Active' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'} border-none text-[10px] font-bold`}>{detailMember.status}</Badge>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</p>
                                      <p className="text-xs font-bold text-slate-800 mt-1 break-all">{detailMember.email}</p>
                                  </div>
                                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Department</p>
                                      <p className="text-xs font-bold text-slate-800 mt-1">{detailMember.department}</p>
                                  </div>
                                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Designation</p>
                                      <p className="text-xs font-bold text-slate-800 mt-1">{detailMember.designation}</p>
                                  </div>
                                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Joined</p>
                                      <p className="text-xs font-bold text-slate-800 mt-1">{detailMember.joiningDate ? new Date(detailMember.joiningDate).toLocaleDateString() : '—'}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2">
                              <Button
                                  variant="outline"
                                  className="flex-1 h-10 rounded-none border-slate-200 text-slate-700 font-bold text-xs"
                                  onClick={() => { window.location.href = `mailto:${detailMember.email}`; }}
                              >
                                  <Mail size={14} className="mr-1.5" /> Message
                              </Button>
                              <Button
                                  className="flex-1 h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                                  onClick={() => { handleEdit(detailMember); setDetailMember(null); }}
                              >
                                  <Edit size={14} className="mr-1.5" /> Edit
                              </Button>
                              <Button
                                  variant="outline"
                                  className="w-full h-10 rounded-none border-amber-200 text-amber-700 hover:bg-amber-50 font-bold text-xs"
                                  onClick={() => { setSelectedMember(detailMember); setShowVault(true); setDetailMember(null); }}
                              >
                                  <FileText size={14} className="mr-1.5" /> Documents Vault
                              </Button>
                          </div>
                      </>
                  )}
              </SheetContent>
          </Sheet>
        </div>
    );
};

export default TeamMembersPage;
