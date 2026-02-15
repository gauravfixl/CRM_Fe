"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building, Users, Plus, Edit, Trash2, MoreVertical, Globe, Navigation } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganizationStore, type Location } from "@/shared/data/organization-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const LocationsPage = () => {
    const { toast } = useToast();
    const { locations, addLocation, updateLocation, deleteLocation } = useOrganizationStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [locationForm, setLocationForm] = useState({
        name: '',
        address: '',
        city: '',
        country: ''
    });

    const handleAdd = () => {
        if (!locationForm.name || !locationForm.city || !locationForm.country) {
            toast({ title: "Error", description: "Name, City and Country are required", variant: "destructive" });
            return;
        }

        addLocation({
            name: locationForm.name,
            address: locationForm.address,
            city: locationForm.city,
            country: locationForm.country
        });
        setIsAddOpen(false);
        setLocationForm({ name: '', address: '', city: '', country: '' });
        toast({ title: "Location Created", description: `${locationForm.name} has been created.` });
    };

    const handleEdit = (location: Location) => {
        setSelectedLocation(location);
        setLocationForm({
            name: location.name,
            address: location.address,
            city: location.city,
            country: location.country
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedLocation || !locationForm.name || !locationForm.city || !locationForm.country) return;

        updateLocation(selectedLocation.id, {
            name: locationForm.name,
            address: locationForm.address,
            city: locationForm.city,
            country: locationForm.country
        });
        setIsEditOpen(false);
        toast({ title: "Location Updated", description: "Changes saved successfully." });
    };

    const handleDelete = (location: Location) => {
        if (confirm(`Are you sure you want to delete ${location.name}?`)) {
            deleteLocation(location.id);
            toast({ title: "Location Deleted", description: `${location.name} has been removed.` });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Locations</h1>
                    <p className="text-slate-500 font-medium">Manage office locations and employee distribution.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Location
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Location</DialogTitle>
                            <DialogDescription>Add a new office branch to the organization.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Office Name *</Label>
                                <Input
                                    placeholder="e.g. Headquarters, Regional Office"
                                    value={locationForm.name}
                                    onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    placeholder="Street address city area"
                                    value={locationForm.address}
                                    onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City *</Label>
                                    <Input
                                        placeholder="Bangalore"
                                        value={locationForm.city}
                                        onChange={e => setLocationForm({ ...locationForm, city: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-none h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Country *</Label>
                                    <Input
                                        placeholder="India"
                                        value={locationForm.country}
                                        onChange={e => setLocationForm({ ...locationForm, country: e.target.value })}
                                        className="rounded-xl bg-slate-50 border-none h-12"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleAdd}>
                                Add Location
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((loc, i) => (
                    <motion.div key={loc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-8 group relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-amber-50 rounded-full opacity-50 -z-0 group-hover:scale-110 transition-transform duration-500" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                                        <MapPin className="text-amber-600" size={28} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <p className="font-black text-3xl text-amber-600">{loc.employeeCount}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Employees</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(loc)}>
                                                    <Edit size={14} className="mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(loc)} className="text-rose-600">
                                                    <Trash2 size={14} className="mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <h3 className="font-black text-2xl text-slate-900 mb-2">{loc.name}</h3>
                                <p className="text-sm text-slate-600 font-medium mb-6 min-h-[40px]">{loc.address}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Navigation size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600">City</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{loc.city}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600">Country</span>
                                        </div>
                                        <span className="font-bold text-slate-900">{loc.country}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Location</DialogTitle>
                        <DialogDescription>Update office location details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label>Office Name</Label>
                            <Input
                                value={locationForm.name}
                                onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                value={locationForm.address}
                                onChange={e => setLocationForm({ ...locationForm, address: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    value={locationForm.city}
                                    onChange={e => setLocationForm({ ...locationForm, city: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Input
                                    value={locationForm.country}
                                    onChange={e => setLocationForm({ ...locationForm, country: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LocationsPage;
