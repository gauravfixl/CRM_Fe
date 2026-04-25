"use client"

import React, { useState } from "react";
import {
    Plane,
    Plus,
    MapPin,
    Calendar,
    DollarSign,
    ChevronRight,
    Clock,
    CheckCircle2,
    Train,
    Car,
    Calculator,
    Wallet,
    Trash2,
    Edit3,
    Eye,
    X,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useExpenseStore, type TravelRequest, type TravelStatus } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

const travelStatusConfig: Record<TravelStatus, { color: string; bg: string; icon: React.ElementType }> = {
    Pending: { color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock },
    Approved: { color: 'text-blue-700', bg: 'bg-blue-50', icon: CheckCircle2 },
    InProgress: { color: 'text-purple-700', bg: 'bg-purple-50', icon: Plane },
    Completed: { color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2 },
    Settled: { color: 'text-slate-700', bg: 'bg-slate-100', icon: DollarSign },
};

const perDiemRates: Record<string, number> = {
    'Mumbai': 3500,
    'Delhi': 3000,
    'Bangalore': 3200,
    'Chennai': 2800,
    'Kolkata': 2500,
    'Hyderabad': 2800,
    'Pune': 2600,
    'Other': 2000,
};

const emptyForm = {
    purpose: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    estimatedBudget: '',
    advanceRequested: '',
    itinerary: [] as { from: string; to: string; date: string; mode: string; cost: string }[],
};

const TravelManagementPage = () => {
    const { toast } = useToast();
    const { travelRequests, claims, addTravelRequest, updateTravelRequest, deleteTravelRequest } = useExpenseStore();
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isPerDiemCalcOpen, setIsPerDiemCalcOpen] = useState(false);
    const [isMileageOpen, setIsMileageOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<TravelRequest | null>(null);
    const [editingRequest, setEditingRequest] = useState<TravelRequest | null>(null);
    const [pendingDelete, setPendingDelete] = useState<TravelRequest | null>(null);
    const [mileageKm, setMileageKm] = useState('');
    const [perDiemCity, setPerDiemCity] = useState('');
    const [perDiemDays, setPerDiemDays] = useState('');
    const [travelForm, setTravelForm] = useState<typeof emptyForm>(emptyForm);

    const openNewRequest = () => {
        setEditingRequest(null);
        setTravelForm(emptyForm);
        setIsRequestDialogOpen(true);
    };

    const openEditRequest = (req: TravelRequest) => {
        setEditingRequest(req);
        setTravelForm({
            purpose: req.purpose,
            destination: req.destination,
            departureDate: req.departureDate,
            returnDate: req.returnDate,
            estimatedBudget: String(req.estimatedBudget),
            advanceRequested: String(req.advanceRequested),
            itinerary: req.itinerary.map(i => ({ from: i.from, to: i.to, date: i.date, mode: i.mode, cost: String(i.cost) })),
        });
        setIsRequestDialogOpen(true);
    };

    const addItineraryRow = () => {
        setTravelForm(f => ({ ...f, itinerary: [...f.itinerary, { from: '', to: '', date: '', mode: 'Flight', cost: '' }] }));
    };

    const updateItineraryRow = (idx: number, field: string, value: string) => {
        setTravelForm(f => ({ ...f, itinerary: f.itinerary.map((item, i) => i === idx ? { ...item, [field]: value } : item) }));
    };

    const removeItineraryRow = (idx: number) => {
        setTravelForm(f => ({ ...f, itinerary: f.itinerary.filter((_, i) => i !== idx) }));
    };

    const handleSaveRequest = () => {
        if (!travelForm.purpose.trim() || !travelForm.destination.trim() || !travelForm.departureDate || !travelForm.returnDate) {
            toast({ title: "Validation Error", description: "Purpose, destination, and dates are required.", variant: "destructive" });
            return;
        }
        if (travelForm.purpose.trim().length < 5) {
            toast({ title: "Purpose too short", description: "Purpose must be at least 5 characters.", variant: "destructive" });
            return;
        }
        const dep = new Date(travelForm.departureDate);
        const ret = new Date(travelForm.returnDate);
        if (isNaN(dep.getTime()) || isNaN(ret.getTime())) {
            toast({ title: "Invalid dates", description: "Please enter valid departure and return dates.", variant: "destructive" });
            return;
        }
        if (ret < dep) {
            toast({ title: "Invalid dates", description: "Return date must be on or after departure.", variant: "destructive" });
            return;
        }
        if (!editingRequest) {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            if (dep < today) {
                toast({ title: "Past Date", description: "Departure date cannot be in the past.", variant: "destructive" });
                return;
            }
        }
        const budget = parseFloat(travelForm.estimatedBudget) || 0;
        const advance = parseFloat(travelForm.advanceRequested) || 0;
        if (budget < 0 || advance < 0) {
            toast({ title: "Invalid amount", description: "Budget and advance cannot be negative.", variant: "destructive" });
            return;
        }
        if (advance > 0 && budget > 0 && advance > budget) {
            toast({ title: "Advance too high", description: "Advance cannot exceed the estimated budget.", variant: "destructive" });
            return;
        }
        for (let i = 0; i < travelForm.itinerary.length; i++) {
            const leg = travelForm.itinerary[i];
            if (!leg.from.trim() || !leg.to.trim() || !leg.date) {
                toast({ title: `Itinerary leg ${i + 1} incomplete`, description: "From, To and Date are required for each leg.", variant: "destructive" });
                return;
            }
            const cost = parseFloat(leg.cost) || 0;
            if (cost < 0) {
                toast({ title: `Invalid cost on leg ${i + 1}`, description: "Cost cannot be negative.", variant: "destructive" });
                return;
            }
            const legDate = new Date(leg.date);
            if (legDate < dep || legDate > ret) {
                toast({ title: `Leg ${i + 1} out of range`, description: "Itinerary date must fall within departure and return dates.", variant: "destructive" });
                return;
            }
        }

        const itinerary = travelForm.itinerary.map((item, i) => ({
            id: `IT${String(Date.now() + i).slice(-4)}`,
            from: item.from.trim(),
            to: item.to.trim(),
            date: item.date,
            mode: item.mode,
            cost: parseFloat(item.cost) || 0,
        }));

        if (editingRequest) {
            updateTravelRequest(editingRequest.id, {
                purpose: travelForm.purpose,
                destination: travelForm.destination,
                departureDate: travelForm.departureDate,
                returnDate: travelForm.returnDate,
                estimatedBudget: parseFloat(travelForm.estimatedBudget) || 0,
                advanceRequested: parseFloat(travelForm.advanceRequested) || 0,
                itinerary,
            });
            toast({ title: "Travel Request Updated", description: `${editingRequest.id} has been updated.` });
        } else {
            const newReq: TravelRequest = {
                id: `TR${String(Date.now()).slice(-4)}`,
                employeeId: 'E001',
                employeeName: 'Rahul Sharma',
                purpose: travelForm.purpose,
                destination: travelForm.destination,
                departureDate: travelForm.departureDate,
                returnDate: travelForm.returnDate,
                estimatedBudget: parseFloat(travelForm.estimatedBudget) || 0,
                actualSpent: 0,
                advanceRequested: parseFloat(travelForm.advanceRequested) || 0,
                advanceApproved: 0,
                status: 'Pending',
                itinerary,
                expenses: [],
            };
            addTravelRequest(newReq);
            toast({ title: "Travel Request Created", description: `Request ${newReq.id} submitted for approval.` });
        }
        setIsRequestDialogOpen(false);
        setEditingRequest(null);
        setTravelForm(emptyForm);
    };

    const openDetail = (req: TravelRequest) => {
        setSelectedRequest(req);
        setIsDetailOpen(true);
    };

    const handleDelete = (req: TravelRequest) => {
        deleteTravelRequest(req.id);
        toast({ title: "Travel Request Deleted", description: `${req.id} has been removed.` });
        setPendingDelete(null);
        setIsDetailOpen(false);
    };

    const handleStatusChange = (req: TravelRequest, status: TravelStatus) => {
        updateTravelRequest(req.id, { status });
        setSelectedRequest({ ...req, status });
        toast({ title: "Status Updated", description: `${req.id} marked as ${status}.` });
    };

    const canEdit = (s: TravelStatus) => s === 'Pending' || s === 'Approved';
    const canDelete = (s: TravelStatus) => s === 'Pending' || s === 'Approved';

    const mileageRate = 12;
    const kmNum = parseFloat(mileageKm);
    const calculatedMileage = !isNaN(kmNum) && kmNum > 0 ? kmNum * mileageRate : 0;
    const daysNum = parseFloat(perDiemDays);
    const calculatedPerDiem = perDiemCity && !isNaN(daysNum) && daysNum > 0
        ? (perDiemRates[perDiemCity] || perDiemRates['Other']) * daysNum
        : 0;

    const activeRequests = travelRequests.filter(t => t.status === 'Pending' || t.status === 'Approved' || t.status === 'InProgress');
    const completedRequests = travelRequests.filter(t => t.status === 'Completed' || t.status === 'Settled');

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Travel Management</h1>
                        <p className="text-sm text-slate-500">Plan trips, request travel advances, and track expenses</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setIsPerDiemCalcOpen(true)}>
                        <Calculator className="h-4 w-4" /> Per Diem Calculator
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setIsMileageOpen(true)}>
                        <Car className="h-4 w-4" /> Mileage Tracker
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={openNewRequest}>
                        <Plus className="h-4 w-4" /> New Travel Request
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-none bg-[#CB9DF0] shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-700 uppercase">Active Requests</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activeRequests.length}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none bg-[#F0C1E1] shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-700 uppercase">Total Budget</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₹{travelRequests.reduce((s, t) => s + t.estimatedBudget, 0).toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none bg-[#FFF9BF] shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-700 uppercase">Advances Approved</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₹{travelRequests.reduce((s, t) => s + t.advanceApproved, 0).toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-none bg-[#FDDBBB] shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-xs font-bold text-slate-700 uppercase">Completed Trips</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{completedRequests.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Active Travel Requests */}
            <div>
                <h2 className="text-sm font-bold text-slate-900 mb-3">Active Travel Requests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeRequests.length === 0 ? (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm col-span-full">
                            <CardContent className="p-8 text-center text-slate-400">
                                No active travel requests. Create one to get started.
                            </CardContent>
                        </Card>
                    ) : (
                        activeRequests.map((req) => {
                            const StatusIcon = travelStatusConfig[req.status].icon;
                            return (
                                <Card key={req.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge variant="secondary" className={cn("text-xs", travelStatusConfig[req.status].bg, travelStatusConfig[req.status].color)}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {req.status}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-500" title="View" onClick={() => openDetail(req)}>
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                                {canEdit(req.status) && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" title="Edit" onClick={() => openEditRequest(req)}>
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {canDelete(req.status) && (
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" title="Delete" onClick={() => setPendingDelete(req)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="cursor-pointer" onClick={() => openDetail(req)}>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1">{req.purpose}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                                                <MapPin className="h-3 w-3" />
                                                <span>{req.destination}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-[10px] text-slate-400">{req.id}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{req.departureDate}</span>
                                                </div>
                                                <span>to</span>
                                                <span>{req.returnDate}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Budget</p>
                                                    <p className="text-sm font-bold text-slate-900">₹{req.estimatedBudget.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400">Advance</p>
                                                    <p className="text-sm font-bold text-green-600">₹{req.advanceApproved.toLocaleString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400">Employee</p>
                                                    <p className="text-xs font-medium text-slate-700">{req.employeeName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Completed / Settled */}
            {completedRequests.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold text-slate-900 mb-3">Completed & Settled</h2>
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {completedRequests.map((req) => (
                                    <div key={req.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openDetail(req)}>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{req.purpose}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-xs text-slate-500">{req.destination}</span>
                                                <span className="text-xs text-slate-400">{req.departureDate} - {req.returnDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">₹{req.actualSpent.toLocaleString()}</p>
                                            <p className="text-xs text-slate-400">of ₹{req.estimatedBudget.toLocaleString()}</p>
                                        </div>
                                        <Badge variant="secondary" className={cn("text-xs", travelStatusConfig[req.status].bg, travelStatusConfig[req.status].color)}>
                                            {req.status}
                                        </Badge>
                                        <ChevronRight className="h-4 w-4 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Travel Advance Settlement */}
            {travelRequests.some(t => t.advanceApproved > 0) && (
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="h-4 w-4 text-purple-600" />
                            <h3 className="text-sm font-bold text-slate-900">Advance Settlement Summary</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {travelRequests.filter(t => t.advanceApproved > 0).map((req) => {
                                const balance = req.advanceApproved - req.actualSpent;
                                return (
                                    <div key={req.id} className="border border-slate-200 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm font-medium text-slate-900">{req.purpose}</p>
                                            <Badge variant="secondary" className={cn("text-[10px]", travelStatusConfig[req.status].bg, travelStatusConfig[req.status].color)}>{req.status}</Badge>
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between"><span className="text-slate-500">Advance Given</span><span className="font-medium">₹{req.advanceApproved.toLocaleString()}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-500">Actual Spent</span><span className="font-medium">₹{req.actualSpent.toLocaleString()}</span></div>
                                            <div className="flex justify-between border-t border-slate-100 pt-1.5">
                                                <span className="text-slate-500 font-medium">Balance</span>
                                                <span className={cn("font-bold", balance >= 0 ? "text-green-600" : "text-red-600")}>
                                                    {balance >= 0 ? '+' : ''}₹{balance.toLocaleString()}
                                                </span>
                                            </div>
                                            {req.status === 'Completed' && (
                                                <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-xs" onClick={() => handleStatusChange(req, 'Settled')}>
                                                    Mark Settled
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* New / Edit Travel Request Sheet */}
            <SideFormSheet
                open={isRequestDialogOpen}
                onOpenChange={(o) => { setIsRequestDialogOpen(o); if (!o) { setEditingRequest(null); setTravelForm(emptyForm); } }}
                title={editingRequest ? `Edit Travel Request ${editingRequest.id}` : 'New Travel Request'}
                description={editingRequest ? 'Update the travel details below.' : 'Plan your trip and submit for approval.'}
                icon={editingRequest ? <Edit3 size={20} /> : <Plane size={20} />}
                accentColor={editingRequest ? "#7c3aed" : "#0ea5e9"}
                width="xl"
                submitLabel={editingRequest ? 'Update Request' : 'Submit Request'}
                onSubmit={(e) => { e.preventDefault(); handleSaveRequest(); }}
            >
                <div className="space-y-4">
                    <Field label="Purpose" required>
                        <Input placeholder="Purpose of travel" value={travelForm.purpose} onChange={(e) => setTravelForm({ ...travelForm, purpose: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Destination" required>
                            <Input placeholder="City" value={travelForm.destination} onChange={(e) => setTravelForm({ ...travelForm, destination: e.target.value })} />
                        </Field>
                        <Field label="Departure" required>
                            <Input type="date" value={travelForm.departureDate} onChange={(e) => setTravelForm({ ...travelForm, departureDate: e.target.value })} />
                        </Field>
                        <Field label="Return" required>
                            <Input type="date" value={travelForm.returnDate} onChange={(e) => setTravelForm({ ...travelForm, returnDate: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Estimated Budget (INR)">
                            <Input type="number" min="0" step="0.01" placeholder="0.00" value={travelForm.estimatedBudget} onChange={(e) => setTravelForm({ ...travelForm, estimatedBudget: e.target.value })} />
                        </Field>
                        <Field label="Advance Request (INR)">
                            <Input type="number" min="0" step="0.01" placeholder="0.00" value={travelForm.advanceRequested} onChange={(e) => setTravelForm({ ...travelForm, advanceRequested: e.target.value })} />
                        </Field>
                    </div>

                    {/* Itinerary Builder */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[13px] font-semibold text-[#374151]">Itinerary</label>
                            <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addItineraryRow}>
                                <Plus className="h-3 w-3" /> Add Leg
                            </Button>
                        </div>
                        {travelForm.itinerary.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                                No itinerary added. Click "Add Leg" to build your travel plan.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {travelForm.itinerary.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-2 items-end">
                                        <Input placeholder="From" value={item.from} onChange={(e) => updateItineraryRow(idx, 'from', e.target.value)} className="text-sm" />
                                        <Input placeholder="To" value={item.to} onChange={(e) => updateItineraryRow(idx, 'to', e.target.value)} className="text-sm" />
                                        <Input type="date" value={item.date} onChange={(e) => updateItineraryRow(idx, 'date', e.target.value)} className="text-sm w-[130px]" />
                                        <Select value={item.mode} onValueChange={(v) => updateItineraryRow(idx, 'mode', v)}>
                                            <SelectTrigger className="w-[100px] text-sm"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Flight">Flight</SelectItem>
                                                <SelectItem value="Train">Train</SelectItem>
                                                <SelectItem value="Bus">Bus</SelectItem>
                                                <SelectItem value="Cab">Cab</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input type="number" min="0" placeholder="Cost" value={item.cost} onChange={(e) => updateItineraryRow(idx, 'cost', e.target.value)} className="text-sm w-[90px]" />
                                        <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-400" onClick={() => removeItineraryRow(idx)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SideFormSheet>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Travel Request - {selectedRequest?.id}</DialogTitle>
                        <DialogDescription>{selectedRequest?.purpose}</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Destination</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedRequest.destination}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Status</p>
                                    <Badge variant="secondary" className={cn("text-xs mt-0.5", travelStatusConfig[selectedRequest.status].bg, travelStatusConfig[selectedRequest.status].color)}>
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Dates</p>
                                    <p className="text-sm font-medium text-slate-900">{selectedRequest.departureDate} - {selectedRequest.returnDate}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Budget</p>
                                    <p className="text-sm font-medium text-slate-900">₹{selectedRequest.estimatedBudget.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Advance Requested</p>
                                    <p className="text-sm font-medium text-slate-900">₹{selectedRequest.advanceRequested.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-400 uppercase">Advance Approved</p>
                                    <p className="text-sm font-medium text-green-700">₹{selectedRequest.advanceApproved.toLocaleString()}</p>
                                </div>
                            </div>
                            {selectedRequest.itinerary.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">Itinerary</p>
                                    <div className="space-y-2">
                                        {selectedRequest.itinerary.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                                                {item.mode === 'Flight' ? <Plane className="h-4 w-4 text-blue-500" /> : item.mode === 'Train' ? <Train className="h-4 w-4 text-green-500" /> : <Car className="h-4 w-4 text-amber-500" />}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900">{item.from} → {item.to}</p>
                                                    <p className="text-xs text-slate-400">{item.date} | {item.mode}</p>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">₹{item.cost.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedRequest.expenses.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-2">Attached Expenses</p>
                                    <div className="space-y-1">
                                        {selectedRequest.expenses.map(eid => {
                                            const claim = claims.find(c => c.id === eid);
                                            return claim ? (
                                                <div key={eid} className="flex items-center justify-between bg-slate-50 rounded-lg p-2.5 text-sm">
                                                    <span className="text-slate-700">{claim.id} - {claim.description}</span>
                                                    <span className="font-medium text-slate-900">₹{claim.amount.toLocaleString()}</span>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Status transition buttons */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                                {selectedRequest.status === 'Approved' && (
                                    <Button size="sm" className="gap-1.5 bg-purple-600 hover:bg-purple-700" onClick={() => handleStatusChange(selectedRequest, 'InProgress')}>
                                        <Plane className="h-3.5 w-3.5" /> Start Trip
                                    </Button>
                                )}
                                {selectedRequest.status === 'InProgress' && (
                                    <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(selectedRequest, 'Completed')}>
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                                    </Button>
                                )}
                                {selectedRequest.status === 'Completed' && (
                                    <Button size="sm" className="gap-1.5 bg-slate-600 hover:bg-slate-700" onClick={() => handleStatusChange(selectedRequest, 'Settled')}>
                                        <DollarSign className="h-3.5 w-3.5" /> Settle Advance
                                    </Button>
                                )}
                                {canEdit(selectedRequest.status) && (
                                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setIsDetailOpen(false); openEditRequest(selectedRequest); }}>
                                        <Edit3 className="h-3.5 w-3.5" /> Edit
                                    </Button>
                                )}
                                {canDelete(selectedRequest.status) && (
                                    <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200" onClick={() => setPendingDelete(selectedRequest)}>
                                        <Trash2 className="h-3.5 w-3.5" /> Delete
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Per Diem Calculator */}
            <Dialog open={isPerDiemCalcOpen} onOpenChange={setIsPerDiemCalcOpen}>
                <DialogContent className="max-w-sm border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Per Diem Calculator</DialogTitle>
                        <DialogDescription>Calculate per diem allowance based on destination</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Destination City</Label>
                            <Select value={perDiemCity || undefined} onValueChange={setPerDiemCity}>
                                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(perDiemRates).map(city => (
                                        <SelectItem key={city} value={city}>{city} - ₹{perDiemRates[city]}/day</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Number of Days</Label>
                            <Input type="number" min="0" placeholder="0" value={perDiemDays} onChange={(e) => setPerDiemDays(e.target.value)} />
                        </div>
                        {calculatedPerDiem > 0 && (
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-purple-600 mb-1">Total Per Diem Allowance</p>
                                <p className="text-2xl font-bold text-purple-700">₹{calculatedPerDiem.toLocaleString()}</p>
                                <p className="text-xs text-purple-500 mt-1">
                                    {perDiemDays} days x ₹{(perDiemRates[perDiemCity] || perDiemRates['Other']).toLocaleString()}/day
                                </p>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setPerDiemCity(''); setPerDiemDays(''); }}>
                                <X className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mileage Tracker */}
            <Dialog open={isMileageOpen} onOpenChange={setIsMileageOpen}>
                <DialogContent className="max-w-sm border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Mileage Tracker</DialogTitle>
                        <DialogDescription>Calculate reimbursement for km driven</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Distance (km)</Label>
                            <Input type="number" min="0" placeholder="0" value={mileageKm} onChange={(e) => setMileageKm(e.target.value)} />
                        </div>
                        <div className="text-xs text-slate-500">Rate: ₹{mileageRate}/km</div>
                        {calculatedMileage > 0 && (
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-green-600 mb-1">Mileage Reimbursement</p>
                                <p className="text-2xl font-bold text-green-700">₹{calculatedMileage.toLocaleString()}</p>
                                <p className="text-xs text-green-500 mt-1">{mileageKm} km x ₹{mileageRate}/km</p>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setMileageKm('')}>
                                <X className="h-3.5 w-3.5 mr-1" /> Reset
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!pendingDelete} onOpenChange={(o) => { if (!o) setPendingDelete(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete travel request?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete ? `This will permanently remove ${pendingDelete.id} — "${pendingDelete.purpose}".` : ''}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => pendingDelete && handleDelete(pendingDelete)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TravelManagementPage;
