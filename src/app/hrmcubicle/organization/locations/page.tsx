"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Plus,
    Search,
    Users,
    Edit,
    Trash2,
    MoreVertical,
    Globe,
    Building,
    Home,
    Wifi,
    Clock,
    Phone,
    Mail,
    CheckCircle2,
    AlertCircle,
    Navigation
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Location } from "@/shared/data/organisation-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Progress } from "@/shared/components/ui/progress";

const LocationsPage = () => {
    const { toast } = useToast();
    const { locations, employees, addLocation, updateLocation, deleteLocation } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<Location>>({
        name: "",
        code: "",
        type: "Office",
        address: {
            street: "",
            city: "",
            state: "",
            country: "India",
            pincode: ""
        },
        hrContactId: "",
        timezone: "Asia/Kolkata",
        isActive: true
    });

    const handleAddLocation = () => {
        if (!formData.name || !formData.code || !formData.address?.city) {
            toast({ title: "Validation Error", description: "Name, Code, and City are required", variant: "destructive" });
            return;
        }

        addLocation({
            ...formData,
            isActive: true
        } as Omit<Location, 'id' | 'employeeCount' | 'createdAt'>);

        toast({ title: "Location Added", description: `${formData.name} has been added to the organization.` });
        setIsAddDialogOpen(false);
        setFormData({
            name: "",
            code: "",
            type: "Office",
            address: {
                street: "",
                city: "",
                state: "",
                country: "India",
                pincode: ""
            },
            hrContactId: "",
            timezone: "Asia/Kolkata",
            isActive: true
        });
    };

    const handleUpdateLocation = () => {
        if (!selectedLocation || !formData.name || !formData.code) {
            toast({ title: "Validation Error", description: "Name and Code are required", variant: "destructive" });
            return;
        }

        updateLocation(selectedLocation.id, formData);
        toast({ title: "Location Updated", description: "Changes have been saved successfully." });
        setIsEditDialogOpen(false);
        setSelectedLocation(null);
    };

    const handleDeleteLocation = (id: string) => {
        const locationEmployees = employees.filter(e => e.locationId === id);
        if (locationEmployees.length > 0) {
            toast({
                title: "Cannot Delete",
                description: `This location has ${locationEmployees.length} employees. Please reassign them first.`,
                variant: "destructive"
            });
            return;
        }

        deleteLocation(id);
        toast({ title: "Location Deleted", description: "Location has been removed from the system." });
    };

    const getTypeIcon = (type: Location['type']) => {
        switch (type) {
            case 'Office': return Building;
            case 'Remote': return Wifi;
            case 'Hybrid': return Home;
            default: return MapPin;
        }
    };

    const getTypeColor = (type: Location['type']) => {
        const colors = {
            'Office': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'Remote': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'Hybrid': 'bg-purple-50 text-purple-600 border-purple-100'
        };
        return colors[type] || colors['Office'];
    };

    const filteredLocations = locations.filter(loc => {
        const matchesSearch =
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loc.address.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || loc.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getLocationEmployees = (locId: string) => {
        return employees.filter(e => e.locationId === locId);
    };

    const getHRContact = (hrContactId?: string) => {
        if (!hrContactId) return null;
        return employees.find(e => e.id === hrContactId);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-3 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Locations</h1>
                            <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3">
                                {locations.filter(l => l.isActive).length} Active
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Manage office locations, remote workforce, and geographic distribution.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by name, code, or city..."
                                className="pl-11 h-10 rounded-xl bg-slate-50 border-none shadow-none font-medium text-xs focus-visible:ring-2 focus-visible:ring-slate-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-36 h-10 rounded-xl bg-slate-50 border-none font-bold text-xs shadow-none hover:bg-slate-100 transition-colors">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                <SelectItem value="All" className="rounded-lg h-9">All Types</SelectItem>
                                <SelectItem value="Office" className="rounded-lg h-9">Office</SelectItem>
                                <SelectItem value="Remote" className="rounded-lg h-9">Remote</SelectItem>
                                <SelectItem value="Hybrid" className="rounded-lg h-9">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> Add Location
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 pt-8 max-w-[1440px] mx-auto w-full space-y-6">

                {/* Location Type Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="rounded-[1.5rem] border-none bg-amber-100/70 text-amber-800 p-5 shadow-sm border border-amber-200">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 capitalize tracking-widest leading-none">Global Network</p>
                            <h3 className="text-xl font-bold tracking-tight mt-1">{locations.length}</h3>
                        </div>
                    </Card>

                    {(['Office', 'Remote', 'Hybrid'] as const).map((type, i) => {
                        const typeLocations = locations.filter(l => l.type === type);
                        const typeEmployees = employees.filter(e => {
                            const location = locations.find(l => l.id === e.locationId);
                            return location?.type === type;
                        });
                        const Icon = getTypeIcon(type);
                        const lightColors = {
                            'Office': 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
                            'Remote': 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
                            'Hybrid': 'bg-rose-100/80 text-rose-800 border-rose-200'
                        };
                        return (
                            <Card key={type} className={`rounded-[1.5rem] border p-5 shadow-sm ${lightColors[type]}`}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold capitalize tracking-widest opacity-60 leading-none">{type}</p>
                                        <Icon size={14} className="opacity-60" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-xl font-bold tracking-tight tabular-nums leading-none">{typeEmployees.length}</h3>
                                        <p className="text-[9px] font-bold opacity-60 leading-none">{typeLocations.length} loc</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Locations Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredLocations.map((location, i) => {
                            const locEmployees = getLocationEmployees(location.id);
                            const hrContact = getHRContact(location.hrContactId);
                            const totalEmployees = employees.length;
                            const percentage = totalEmployees > 0 ? (locEmployees.length / totalEmployees) * 100 : 0;
                            const TypeIcon = getTypeIcon(location.type);

                            return (
                                <motion.div
                                    key={location.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border-none shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden ring-1 ring-slate-100">
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-sm ${getTypeColor(location.type)}`}>
                                                        <TypeIcon size={18} />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                                                            {location.name}
                                                        </h3>
                                                        <p className="text-[9px] font-bold text-slate-400 capitalize tracking-widest">
                                                            {location.code}
                                                        </p>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 text-slate-300 hover:text-slate-600">
                                                            <MoreVertical size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-1.5 w-44 font-bold">
                                                        <DropdownMenuItem
                                                            className="rounded-lg h-9 gap-2 text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedLocation(location);
                                                                setFormData(location);
                                                                setIsEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit size={14} /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg h-9 text-rose-600 focus:bg-rose-50 gap-2 text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteLocation(location.id);
                                                            }}
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-2.5">
                                                <div className="flex items-start gap-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                                                    <Navigation size={14} className="text-indigo-600 mt-1 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-900 leading-relaxed truncate">
                                                            {location.address.city}, {location.address.state}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-medium truncate">
                                                            {location.address.street}
                                                        </p>
                                                    </div>
                                                </div>

                                                {hrContact && (
                                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                                        <Avatar className="h-8 w-8 border border-white shadow-sm shrink-0">
                                                            <AvatarFallback className="bg-indigo-600 text-white font-bold text-[10px]">
                                                                {hrContact.profileImage}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[8px] font-bold text-slate-400 capitalize tracking-widest leading-none mb-0.5">HR Contact</p>
                                                            <p className="text-[11px] font-bold text-slate-900 truncate">{hrContact.firstName} {hrContact.lastName}</p>
                                                        </div>
                                                        <Mail size={12} className="text-slate-300" />
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Users size={12} className="text-slate-400" />
                                                            <span className="text-[10px] font-bold text-slate-500 capitalize tracking-tight">Employees</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-indigo-600 tabular-nums">{locEmployees.length}</span>
                                                    </div>
                                                    <Progress value={percentage} className="h-1 bg-slate-50" />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="outline" className={`${getTypeColor(location.type)} border-none font-bold text-[9px] h-6 px-3 rounded-lg capitalize tracking-tight shadow-sm`}>
                                                    <TypeIcon size={12} className="mr-1" />
                                                    {location.type}
                                                </Badge>
                                                <Badge variant="outline" className={`${location.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'} border-none font-bold text-[9px] h-6 px-3 rounded-lg capitalize tracking-tight shadow-sm`}>
                                                    {location.isActive ? <CheckCircle2 size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                                    {location.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                                <Badge variant="outline" className="bg-slate-50 text-slate-500 border-none font-bold text-[9px] h-6 px-3 rounded-lg capitalize tracking-tight">
                                                    <Clock size={12} className="mr-1" />
                                                    {location.timezone.split('/')[1]}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filteredLocations.length === 0 && (
                    <Card className="rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-20">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <MapPin size={64} className="text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Locations Found</h3>
                                <p className="text-sm text-slate-500 font-medium">Try adjusting your filters or add a new location.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* Add Location Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-1 shadow-inner">
                            <MapPin size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Add Location</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Register a new office, remote, or hybrid work location.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location Name *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="e.g., Bangalore HQ"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="BLR-HQ"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location Type *</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                        <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                            <SelectItem value="Office" className="rounded-lg h-8 text-xs">Office</SelectItem>
                                            <SelectItem value="Remote" className="rounded-lg h-8 text-xs">Remote</SelectItem>
                                            <SelectItem value="Hybrid" className="rounded-lg h-8 text-xs">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">HR Contact</Label>
                                        <Select value={formData.hrContactId} onValueChange={(v) => setFormData({ ...formData, hrContactId: v })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold max-h-[200px]">
                                                <SelectItem value="none" className="rounded-lg h-8 text-xs">No Contact</SelectItem>
                                                {employees.filter(e => e.status === 'Active').map(emp => (
                                                    <SelectItem key={emp.id} value={emp.id} className="rounded-lg h-8 text-xs">
                                                        {emp.firstName} {emp.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Timezone</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.timezone}
                                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-300">
                                <h4 className="text-[10px] font-bold text-slate-500 capitalize tracking-widest ml-1 border-b border-slate-200 pb-2 mb-4">Address Details</h4>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Street Address</Label>
                                    <Input
                                        className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                        placeholder="Building, Street"
                                        value={formData.address?.street}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, street: e.target.value } })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">City *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="Bangalore"
                                            value={formData.address?.city}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, city: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">State</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="Karnataka"
                                            value={formData.address?.state}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, state: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Country</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.address?.country}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, country: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Pincode</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="560001"
                                            value={formData.address?.pincode}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, pincode: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-9 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleAddLocation}
                        >
                            Add Location
                        </Button>
                        <Button variant="outline" className="h-9 px-4 rounded-lg font-bold border-slate-200 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Location Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-1 shadow-inner">
                            <Edit size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Edit Location</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Update location details and configuration.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location Name *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location Type *</Label>
                                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                        <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                            <SelectItem value="Office" className="rounded-lg h-8 text-xs">Office</SelectItem>
                                            <SelectItem value="Remote" className="rounded-lg h-8 text-xs">Remote</SelectItem>
                                            <SelectItem value="Hybrid" className="rounded-lg h-8 text-xs">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">HR Contact</Label>
                                        <Select value={formData.hrContactId || "none"} onValueChange={(v) => setFormData({ ...formData, hrContactId: v === "none" ? undefined : v })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold max-h-[200px]">
                                                <SelectItem value="none" className="rounded-lg h-8 text-xs">No Contact</SelectItem>
                                                {employees.filter(e => e.status === 'Active').map(emp => (
                                                    <SelectItem key={emp.id} value={emp.id} className="rounded-lg h-8 text-xs">
                                                        {emp.firstName} {emp.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Timezone</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.timezone}
                                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-300">
                                <h4 className="text-[10px] font-bold text-slate-500 capitalize tracking-widest ml-1 border-b border-slate-200 pb-2 mb-4">Address Details</h4>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Street Address</Label>
                                    <Input
                                        className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                        value={formData.address?.street}
                                        onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, street: e.target.value } })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">City *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.address?.city}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, city: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">State</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.address?.state}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, state: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Country</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.address?.country}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, country: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Pincode</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-white border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.address?.pincode}
                                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address!, pincode: e.target.value } })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-9 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleUpdateLocation}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-9 px-4 rounded-lg font-bold border-slate-200 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LocationsPage;
