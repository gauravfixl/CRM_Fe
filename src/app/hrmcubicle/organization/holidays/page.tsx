"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    MapPin,
    Tag,
    Clock,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Star,
    Globe
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Holiday } from "@/shared/data/organisation-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const HolidayCalendarPage = () => {
    const { toast } = useToast();
    const { holidays, locations, addHoliday, updateHoliday, deleteHoliday } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
    const [locationFilter, setLocationFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

    const [formData, setFormData] = useState<Partial<Holiday>>({
        name: "",
        date: "",
        type: "Public",
        locationIds: ["All"],
        year: parseInt(yearFilter)
    });

    const handleAddHoliday = () => {
        if (!formData.name || !formData.date) {
            toast({ title: "Validation Error", description: "Name and Date are required", variant: "destructive" });
            return;
        }
        addHoliday({
            ...formData,
            year: new Date(formData.date!).getFullYear()
        } as Omit<Holiday, 'id'>);
        toast({ title: "Holiday Added", description: `${formData.name} has been added to the calendar.` });
        setIsAddDialogOpen(false);
        setFormData({ name: "", date: "", type: "Public", locationIds: ["All"], year: parseInt(yearFilter) });
    };

    const handleUpdateHoliday = () => {
        if (!selectedHoliday || !formData.name || !formData.date) return;
        updateHoliday(selectedHoliday.id, {
            ...formData,
            year: new Date(formData.date!).getFullYear()
        });
        toast({ title: "Holiday Updated", description: "Holiday details have been updated." });
        setIsEditDialogOpen(false);
        setSelectedHoliday(null);
    };

    const handleDeleteHoliday = (id: string) => {
        deleteHoliday(id);
        toast({ title: "Holiday Removed", description: "Holiday has been deleted from the calendar." });
    };

    const filteredHolidays = holidays.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = h.year.toString() === yearFilter;
        const matchesLocation = locationFilter === 'All' || h.locationIds.includes('All') || h.locationIds.includes(locationFilter);
        return matchesSearch && matchesYear && matchesLocation;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const getTypeStyles = (type: Holiday['type']) => {
        switch (type) {
            case 'Public': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'Optional': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Company': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getMonthName = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('default', { month: 'long' });
    };

    const getDayName = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('default', { weekday: 'long' });
    };

    const getDayNum = (dateStr: string) => {
        return new Date(dateStr).getDate();
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-4 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Holiday Calendar</h1>
                            <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3 italic">
                                {yearFilter} Full List
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Global and location-specific holidays for your organization.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-xl font-bold border-slate-200 gap-2 text-xs"
                        >
                            <Download size={16} /> Export PDF
                        </Button>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-8 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> Add Holiday
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 pt-6 max-w-[1440px] mx-auto w-full space-y-8">
                {/* Stats Section - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <Card className="rounded-[2rem] border-none bg-indigo-50/80 text-indigo-900 p-6 shadow-sm ring-1 ring-indigo-100/50 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 capitalize tracking-widest leading-none mb-2">Total Holidays</p>
                                <h3 className="text-3xl font-black tracking-tight">{filteredHolidays.length}</h3>
                                <p className="text-[9px] font-bold text-indigo-400/60 mt-1 italic">Calendar year 2026</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                <Globe size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-[2rem] border-none bg-emerald-50/80 text-emerald-900 p-6 shadow-sm ring-1 ring-emerald-100/50 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-emerald-400 capitalize tracking-widest leading-none mb-2">Public Holidays</p>
                                <h3 className="text-3xl font-black tracking-tight">{filteredHolidays.filter(h => h.type === 'Public').length}</h3>
                                <p className="text-[9px] font-bold text-emerald-400/60 mt-1 italic">Standard gazetted days</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                <Calendar size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-[2rem] border-none bg-rose-50/80 text-rose-900 p-6 shadow-sm ring-1 ring-rose-100/50 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-rose-400 capitalize tracking-widest leading-none mb-2">Company Specific</p>
                                <h3 className="text-3xl font-black tracking-tight">{filteredHolidays.filter(h => h.type === 'Company').length}</h3>
                                <p className="text-[9px] font-bold text-rose-400/60 mt-1 italic">Internal culture days</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-rose-600">
                                <Star size={20} />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Search & Filter Row - Below Stats */}
                <div className="flex items-center justify-between gap-4">
                    <Card className="p-1.5 px-3 rounded-[1.5rem] bg-white border border-slate-100 flex items-center gap-3 w-full max-w-2xl shadow-sm h-12">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search holiday across the organization..."
                                className="pl-11 h-9 rounded-xl bg-slate-50 border-none shadow-none font-bold text-[10px] focus-visible:ring-2 focus-visible:ring-indigo-100 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-100" />
                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-28 h-9 rounded-xl bg-white border-none font-bold text-[10px] ring-1 ring-slate-100">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-[10px]">
                                {["2024", "2025", "2026"].map(year => (
                                    <SelectItem key={year} value={year} className="rounded-lg h-9 text-[10px]">{year} Calendar</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="w-32 h-9 rounded-xl bg-white border-none font-bold text-[10px] ring-1 ring-slate-100">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-[10px]">
                                <SelectItem value="All" className="rounded-lg h-9 text-[10px]">Global Office</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-9 text-[10px]">{loc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Card>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400">
                            <Filter size={14} className="mr-2" /> Advanced Filter
                        </Button>
                    </div>
                </div>

                {/* Holiday List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredHolidays.map((holiday, i) => (
                            <motion.div
                                key={holiday.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="group relative border-none shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-slate-100 h-full flex flex-col">
                                    <div className={`h-2 w-full ${getTypeStyles(holiday.type).split(' ')[0]}`} />
                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex flex-col items-center justify-center h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{getMonthName(holiday.date).substring(0, 3)}</span>
                                                <span className="text-2xl font-black text-slate-900 leading-none mt-1">{getDayNum(holiday.date)}</span>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600 rounded-full">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                    <DropdownMenuItem
                                                        className="rounded-xl h-11 gap-2"
                                                        onClick={() => {
                                                            setSelectedHoliday(holiday);
                                                            setFormData(holiday);
                                                            setIsEditDialogOpen(true);
                                                        }}
                                                    >
                                                        <Edit size={16} /> Edit Holiday
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-xl h-11 text-rose-600 focus:bg-rose-50 gap-2"
                                                        onClick={() => handleDeleteHoliday(holiday.id)}
                                                    >
                                                        <Trash2 size={16} /> Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-3 flex-1">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {holiday.name}
                                                </h3>
                                                <p className="text-[10px] font-bold text-slate-400 capitalize flex items-center gap-1.5">
                                                    <Clock size={12} /> {getDayName(holiday.date)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <Badge variant="outline" className={`${getTypeStyles(holiday.type)} border-none font-bold text-[8px] h-5 px-3 rounded-lg uppercase tracking-wider`}>
                                                    {holiday.type}
                                                </Badge>
                                                <div className="flex items-center gap-1 bg-slate-50 px-2 h-5 rounded-lg border border-slate-100">
                                                    <Globe size={10} className="text-slate-400" />
                                                    <span className="text-[8px] font-bold text-slate-600 capitalize">
                                                        {holiday.locationIds.includes('All') ? 'Global' : `${holiday.locationIds.length} Locations`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredHolidays.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 rounded-[4rem] border-2 border-dashed border-slate-100">
                            <Calendar size={64} className="text-slate-100" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">No Holidays Found</h3>
                                <p className="text-xs text-slate-400 font-medium">Try changing the filters or add a new holiday.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Holiday Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Calendar size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add Holiday</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Define a new public or company holiday for your employees.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Holiday Name *</Label>
                            <Input
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Independence Day"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Date *</Label>
                                <Input
                                    type="date"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Holiday Type</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Public" className="rounded-lg h-9">Public</SelectItem>
                                        <SelectItem value="Optional" className="rounded-lg h-9">Optional</SelectItem>
                                        <SelectItem value="Company" className="rounded-lg h-9">Company</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Applicable Locations</Label>
                            <Select value={formData.locationIds?.[0]} onValueChange={(v) => setFormData({ ...formData, locationIds: [v] })}>
                                <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="All" className="rounded-lg h-9 text-xs">All (Global)</SelectItem>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-9 text-xs">{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all font-outfit"
                            onClick={handleAddHoliday}
                        >
                            Confirm Holiday
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Holiday Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-lg shadow-3xl">
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                            <Edit size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Edit Holiday</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Update the details for the selected holiday.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Holiday Name *</Label>
                            <Input
                                className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Date *</Label>
                                <Input
                                    type="date"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Holiday Type</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Public" className="rounded-lg h-9">Public</SelectItem>
                                        <SelectItem value="Optional" className="rounded-lg h-9">Optional</SelectItem>
                                        <SelectItem value="Company" className="rounded-lg h-9">Company</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Applicable Locations</Label>
                            <Select value={formData.locationIds?.[0]} onValueChange={(v) => setFormData({ ...formData, locationIds: [v] })}>
                                <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="All" className="rounded-lg h-9 text-xs">All (Global)</SelectItem>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-9 text-xs">{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all font-outfit"
                            onClick={handleUpdateHoliday}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HolidayCalendarPage;
