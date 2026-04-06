"use client"

import React, { useState, useMemo } from "react";
import {
    Building2, Plus, Edit, Trash2, MapPin, Users, DollarSign, CheckCircle2,
    Settings, Eye, Download, Globe, ShieldCheck, ToggleLeft, ToggleRight, FileText
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import {
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useSalaryStore, type Entity } from "@/shared/data/salary-store";

const MultiEntityPage = () => {
    const { toast } = useToast();
    const { entities, addEntity, updateEntity, deleteEntity } = useSalaryStore();
    const [activeTab, setActiveTab] = useState("entities");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingEntity, setViewingEntity] = useState<Entity | null>(null);

    const [form, setForm] = useState({
        name: "", legalName: "", gstin: "", pan: "", address: "", state: "Maharashtra", isActive: true
    });

    // Mock location data per entity
    const [locations] = useState([
        { id: "loc1", entityId: "ent-1", name: "Mumbai HQ", address: "BKC, Mumbai", employees: 85, type: "Office" },
        { id: "loc2", entityId: "ent-1", name: "Pune Office", address: "Hinjawadi, Pune", employees: 42, type: "Branch" },
        { id: "loc3", entityId: "ent-2", name: "Bangalore Tech Park", address: "Electronic City, Bangalore", employees: 35, type: "Office" },
    ]);

    // Mock payroll run status per entity
    const [payrollStatus] = useState([
        { entityId: "ent-1", month: "March 2026", status: "Processed", employees: 127, totalCost: 18500000 },
        { entityId: "ent-2", month: "March 2026", status: "Pending", employees: 35, totalCost: 4200000 },
    ]);

    // Mock statutory registrations per entity
    const [registrations] = useState([
        { entityId: "ent-1", type: "PF Establishment Code", value: "MHBAN0012345000", status: "Active" },
        { entityId: "ent-1", type: "ESI Code", value: "31001234560000001", status: "Active" },
        { entityId: "ent-1", type: "PT Registration (MH)", value: "PTMH2024001234", status: "Active" },
        { entityId: "ent-2", type: "PF Establishment Code", value: "KABNG0023456000", status: "Active" },
        { entityId: "ent-2", type: "ESI Code", value: "53002345670000001", status: "Pending" },
    ]);

    const totalEmployees = useMemo(() => locations.reduce((s, l) => s + l.employees, 0), [locations]);
    const totalCost = useMemo(() => payrollStatus.reduce((s, p) => s + p.totalCost, 0), [payrollStatus]);

    const resetForm = () => setForm({ name: "", legalName: "", gstin: "", pan: "", address: "", state: "Maharashtra", isActive: true });

    const handleSave = () => {
        if (!form.name || !form.legalName) { toast({ title: "Validation Error", description: "Name and legal name are required.", variant: "destructive" }); return; }
        if (editingId) {
            updateEntity(editingId, form);
            toast({ title: "Entity Updated", description: `${form.name} has been updated.` });
        } else {
            addEntity(form);
            toast({ title: "Entity Created", description: `${form.name} has been added.` });
        }
        setIsCreateOpen(false); setEditingId(null); resetForm();
    };

    const handleToggleActive = (id: string, current: boolean) => {
        updateEntity(id, { isActive: !current });
        toast({ title: current ? "Entity Deactivated" : "Entity Activated" });
    };

    const handleExport = () => {
        const csv = ["Entity,Legal Name,GSTIN,PAN,State,Status", ...entities.map(e => `${e.name},${e.legalName},${e.gstin},${e.pan},${e.state},${e.isActive ? "Active" : "Inactive"}`)].join("\n");
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "entities.csv"; a.click(); URL.revokeObjectURL(url);
        toast({ title: "Exported" });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "90%" }}>
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Building2 size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Multi-Entity Payroll</h1>
                        <p className="text-xs font-semibold text-slate-500">Manage legal entities, locations & entity-wise payroll</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={handleExport}><Download size={14} /> Export</Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs" onClick={() => { resetForm(); setEditingId(null); setIsCreateOpen(true); }}><Plus size={14} className="mr-1.5" /> Add Entity</Button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 pb-32">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Entities", val: entities.length, icon: Building2, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/20", cardBg: "bg-[#CB9DF0]/15 border-[#CB9DF0]/30" },
                        { label: "Total Employees", val: totalEmployees, icon: Users, color: "text-blue-600", bg: "bg-blue-100", cardBg: "bg-blue-50 border-blue-200" },
                        { label: "Total Payroll Cost", val: `₹${(totalCost / 10000000).toFixed(2)}Cr`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50 border-emerald-200" },
                        { label: "Active Locations", val: locations.length, icon: MapPin, color: "text-amber-600", bg: "bg-amber-100", cardBg: "bg-amber-50 border-amber-200" },
                    ].map((s, i) => (
                        <Card key={i} className={cn("rounded-2xl border shadow-sm", s.cardBg)}>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}><s.icon size={20} /></div>
                                    <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{s.label}</p><p className="text-xl font-bold text-slate-900">{s.val}</p></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                        {[{ id: "entities", label: "Entities" }, { id: "locations", label: "Locations" }, { id: "payroll-status", label: "Payroll Status" }, { id: "registrations", label: "Statutory Registrations" }].map(t => (
                            <TabsTrigger key={t.id} value={t.id} className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">{t.label}</TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Entities Tab */}
                    <TabsContent value="entities" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {entities.map(entity => (
                                <Card key={entity.id} className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all", entity.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-70")}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Building2 size={24} /></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-base font-bold text-slate-900">{entity.name}</h3>
                                                        <Badge className={cn("text-[8px] font-bold border-none", entity.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>{entity.isActive ? "Active" : "Inactive"}</Badge>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400">{entity.legalName}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setViewingEntity(entity); setIsDetailOpen(true); }}><Eye size={13} className="text-slate-400" /></Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setForm({ name: entity.name, legalName: entity.legalName, gstin: entity.gstin, pan: entity.pan, address: entity.address, state: entity.state, isActive: entity.isActive }); setEditingId(entity.id); setIsCreateOpen(true); }}><Edit size={13} className="text-slate-400" /></Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleToggleActive(entity.id, entity.isActive)}>{entity.isActive ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-300" />}</Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">GSTIN</p><p className="text-xs font-bold text-slate-700 mt-0.5">{entity.gstin || "N/A"}</p></div>
                                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">PAN</p><p className="text-xs font-bold text-slate-700 mt-0.5">{entity.pan || "N/A"}</p></div>
                                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">State</p><p className="text-xs font-bold text-slate-700 mt-0.5">{entity.state}</p></div>
                                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Locations</p><p className="text-xs font-bold text-slate-700 mt-0.5">{locations.filter(l => l.entityId === entity.id).length}</p></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Locations Tab */}
                    <TabsContent value="locations" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Location</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Entity</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Address</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right pr-5">Employees</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {locations.map(loc => (
                                            <TableRow key={loc.id} className="border-slate-50 hover:bg-slate-50/50">
                                                <TableCell className="pl-5"><div className="flex items-center gap-2"><MapPin size={14} className="text-[#8B5CF6]" /><span className="font-bold text-sm text-slate-900">{loc.name}</span></div></TableCell>
                                                <TableCell className="font-bold text-xs text-slate-600">{entities.find(e => e.id === loc.entityId)?.name || "-"}</TableCell>
                                                <TableCell className="text-xs text-slate-500">{loc.address}</TableCell>
                                                <TableCell><Badge variant="outline" className="font-bold text-[9px] bg-slate-50 text-slate-500 border-slate-100">{loc.type}</Badge></TableCell>
                                                <TableCell className="text-right pr-5 font-bold text-sm text-slate-900">{loc.employees}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payroll Status Tab */}
                    <TabsContent value="payroll-status" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-900">Entity-wise Payroll Run Status</h3></div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Entity</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Month</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Employees</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Total Cost</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payrollStatus.map((ps, i) => (
                                            <TableRow key={i} className="border-slate-50">
                                                <TableCell className="pl-5 font-bold text-sm text-slate-900">{entities.find(e => e.id === ps.entityId)?.name || "-"}</TableCell>
                                                <TableCell className="font-bold text-xs text-slate-600">{ps.month}</TableCell>
                                                <TableCell className="font-bold text-xs text-slate-700">{ps.employees}</TableCell>
                                                <TableCell className="font-bold text-xs text-[#8B5CF6]">₹{(ps.totalCost / 100000).toFixed(1)}L</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("font-bold text-[9px]", ps.status === "Processed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>{ps.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Entity Comparison Chart */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-6">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-bold text-slate-900 mb-4">Entity Cost Distribution</h3>
                                <div className="flex items-end gap-8 h-40">
                                    {payrollStatus.map((ps, i) => {
                                        const maxCost = Math.max(...payrollStatus.map(p => p.totalCost));
                                        const heightPct = (ps.totalCost / maxCost) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                <span className="text-xs font-bold text-[#8B5CF6]">₹{(ps.totalCost / 100000).toFixed(1)}L</span>
                                                <div className="w-full bg-[#8B5CF6]/10 rounded-t-xl relative" style={{ height: `${heightPct}%` }}>
                                                    <div className="absolute inset-0 bg-[#8B5CF6] rounded-t-xl opacity-80" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">{entities.find(e => e.id === ps.entityId)?.name || "-"}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Statutory Registrations Tab */}
                    <TabsContent value="registrations" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Statutory Registrations per Entity</h3>
                                    <Button variant="outline" className="h-9 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={() => toast({ title: "Add Registration", description: "Statutory registration form would open here." })}><Plus size={14} /> Add Registration</Button>
                                </div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none">
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Entity</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Registration Type</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Registration Number</TableHead>
                                            <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registrations.map((reg, i) => (
                                            <TableRow key={i} className="border-slate-50">
                                                <TableCell className="pl-5 font-bold text-sm text-slate-900">{entities.find(e => e.id === reg.entityId)?.name || "-"}</TableCell>
                                                <TableCell className="font-bold text-xs text-slate-600">{reg.type}</TableCell>
                                                <TableCell className="font-mono text-xs text-slate-700">{reg.value}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("font-bold text-[9px]", reg.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>{reg.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create/Edit Entity Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editingId ? "Edit Entity" : "Add Legal Entity"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Configure legal entity for payroll processing.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Display Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. Cubicle India" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Legal Name</Label><Input value={form.legalName} onChange={e => setForm({ ...form, legalName: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. Cubicle Technologies Pvt. Ltd." /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">GSTIN</Label><Input value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="27AAACB1234F1Z5" /></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">PAN</Label><Input value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="AAACB1234F" /></div>
                        </div>
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">State</Label>
                            <Select value={form.state} onValueChange={v => setForm({ ...form, state: v })}><SelectTrigger className="h-9 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl font-bold"><SelectItem value="Maharashtra" className="text-xs">Maharashtra</SelectItem><SelectItem value="Karnataka" className="text-xs">Karnataka</SelectItem><SelectItem value="Tamil Nadu" className="text-xs">Tamil Nadu</SelectItem><SelectItem value="Delhi" className="text-xs">Delhi</SelectItem><SelectItem value="Gujarat" className="text-xs">Gujarat</SelectItem><SelectItem value="Telangana" className="text-xs">Telangana</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="Registered office address" /></div>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" /><span className="text-xs font-bold text-slate-600">Active Entity</span></label>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-lg h-9 px-6 font-bold text-xs">Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-6 font-bold text-xs" onClick={handleSave}>{editingId ? "Save Changes" : "Add Entity"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-lg shadow-2xl">
                    <DialogHeader><DialogTitle className="text-lg font-bold text-slate-900">Entity Details</DialogTitle></DialogHeader>
                    {viewingEntity && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Building2 size={28} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{viewingEntity.name}</h3>
                                    <p className="text-xs text-slate-500">{viewingEntity.legalName}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "GSTIN", val: viewingEntity.gstin },
                                    { label: "PAN", val: viewingEntity.pan },
                                    { label: "State", val: viewingEntity.state },
                                    { label: "Status", val: viewingEntity.isActive ? "Active" : "Inactive" },
                                ].map((item, i) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</p>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">{item.val || "N/A"}</p>
                                    </div>
                                ))}
                            </div>
                            <div><p className="text-[10px] font-bold text-slate-400 mb-1">Address</p><p className="text-xs font-medium text-slate-600">{viewingEntity.address || "Not specified"}</p></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 mb-2">Statutory Registrations</p>
                                <div className="space-y-2">
                                    {registrations.filter(r => r.entityId === viewingEntity.id).map((r, i) => (
                                        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                                            <span className="text-xs font-bold text-slate-600">{r.type}</span>
                                            <span className="text-xs font-mono text-slate-700">{r.value}</span>
                                        </div>
                                    ))}
                                    {registrations.filter(r => r.entityId === viewingEntity.id).length === 0 && <p className="text-xs text-slate-400">No registrations found</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MultiEntityPage;
