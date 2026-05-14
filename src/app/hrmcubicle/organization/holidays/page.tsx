"use client"

import React, { useState, useEffect } from "react";
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
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

const HOLIDAY_NAME_RE = /^[A-Za-z][A-Za-z0-9 '&/\-()]{1,79}$/;

const mapHolidayTypeToBackend = (t: Holiday["type"]): "National" | "Optional" => {
    if (t === "Optional") return "Optional";
    return "National";
};

const HolidayCalendarPage = () => {
    const { toast } = useToast();
    const holidays = useOrganisationStore((s) => s.holidays);
    const locations = useOrganisationStore((s) => s.locations);
    const loadHolidaysFromApi = useOrganisationStore((s) => s.loadHolidaysFromApi);
    const createHolidayApi = useOrganisationStore((s) => s.createHolidayApi);
    const updateHolidayApi = useOrganisationStore((s) => s.updateHolidayApi);
    const deleteHolidayApi = useOrganisationStore((s) => s.deleteHolidayApi);

    useEffect(() => { loadHolidaysFromApi().catch(() => {}); }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
    const [locationFilter, setLocationFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [typeFilter, setTypeFilter] = useState<string>("All");
    const [monthFilter, setMonthFilter] = useState<string>("All");
    const [dayFilter, setDayFilter] = useState<string>("All");
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<Partial<Holiday>>({
        name: "",
        date: "",
        type: "Public",
        locationIds: ["All"],
        year: parseInt(yearFilter)
    });

    const resetForm = () => {
        setFormData({ name: "", date: "", type: "Public", locationIds: ["All"], year: parseInt(yearFilter) });
        setErrors({});
    };

    const validateForm = (mode: "add" | "edit"): boolean => {
        const errs: Record<string, string> = {};
        const name = (formData.name || "").trim();

        if (!name) errs.name = "Holiday name is required";
        else if (!HOLIDAY_NAME_RE.test(name)) errs.name = "2-80 chars, starts with a letter";

        if (!formData.date) errs.date = "Date is required";
        else {
            const d = new Date(formData.date);
            if (isNaN(d.getTime())) errs.date = "Invalid date";
            else {
                const dateStr = d.toISOString().split("T")[0];
                const duplicate = holidays.some((h) =>
                    h.date === dateStr &&
                    (mode === "add" || h.id !== selectedHoliday?.id)
                );
                if (duplicate) errs.date = "A holiday already exists on this date";
            }
        }

        if (!formData.type) errs.type = "Type is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddHoliday = async () => {
        if (!validateForm("add")) return;
        setIsSaving(true);
        try {
            await createHolidayApi({
                name: (formData.name || "").trim(),
                date: formData.date!,
                type: mapHolidayTypeToBackend((formData.type || "Public") as Holiday["type"]),
                isPaid: true,
                isMandatory: (formData.type || "Public") !== "Optional",
            });
            toast({ title: "Holiday Added", description: `${formData.name} has been added to the calendar.` });
            setIsAddDialogOpen(false);
            resetForm();
        } catch (err: any) {
            // error toast already shown by hook
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateHoliday = async () => {
        if (!selectedHoliday) return;
        if (!validateForm("edit")) return;
        setIsSaving(true);
        try {
            await updateHolidayApi(selectedHoliday.id, {
                name: (formData.name || "").trim(),
                date: formData.date,
                type: mapHolidayTypeToBackend((formData.type || "Public") as Holiday["type"]),
                isMandatory: (formData.type || "Public") !== "Optional",
            });
            toast({ title: "Holiday Updated", description: "Holiday details have been updated." });
            setIsEditDialogOpen(false);
            setSelectedHoliday(null);
            resetForm();
        } catch (err: any) {
            // error toast already shown by hook
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHoliday = async (id: string) => {
        if (!window.confirm("Remove this holiday from the calendar?")) return;
        try {
            await deleteHolidayApi(id);
            toast({ title: "Holiday Removed", description: "Holiday has been deleted." });
        } catch (err: any) {
            // error toast already shown by hook
        }
    };

    const activeAdvancedCount = [typeFilter !== "All", monthFilter !== "All", dayFilter !== "All"].filter(Boolean).length;

    const filteredHolidays = holidays.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesYear = h.year.toString() === yearFilter;
        const matchesLocation = locationFilter === 'All' || h.locationIds.includes('All') || h.locationIds.includes(locationFilter);
        const matchesType = typeFilter === 'All' || h.type === typeFilter;
        const holidayDate = new Date(h.date);
        const matchesMonth = monthFilter === 'All' || String(holidayDate.getMonth() + 1) === monthFilter;
        const matchesDay = dayFilter === 'All' || holidayDate.toLocaleString('default', { weekday: 'long' }) === dayFilter;
        return matchesSearch && matchesYear && matchesLocation && matchesType && matchesMonth && matchesDay;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const resetAdvancedFilters = () => {
        setTypeFilter("All");
        setMonthFilter("All");
        setDayFilter("All");
        toast({ title: "Filters Cleared", description: "All advanced filters have been reset." });
    };

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
                            onClick={() => {
                                const headers = ["Holiday Name", "Date", "Day", "Type", "Locations"];
                                const rows = filteredHolidays.map(h => [
                                    h.name,
                                    h.date,
                                    new Date(h.date).toLocaleString('default', { weekday: 'long' }),
                                    h.type,
                                    h.locationIds.includes('All') ? 'Global' : h.locationIds.join(', ')
                                ]);
                                const csvContent = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
                                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `holidays_${yearFilter}.csv`;
                                link.click();
                                URL.revokeObjectURL(url);
                                toast({ title: "Exported", description: `Holiday list for ${yearFilter} downloaded.` });
                            }}
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
                    <Card className="rounded-xl border-none bg-gradient-to-br from-indigo-50 to-indigo-100/60 p-6 shadow-sm ring-1 ring-indigo-100 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-2">Total Holidays</p>
                                <h3 className="text-2xl font-extrabold text-indigo-700 tracking-tight">{filteredHolidays.length}</h3>
                                <p className="text-[9px] font-bold text-indigo-400/60 mt-1 italic">Calendar year 2026</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Globe size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl border-none bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 shadow-sm ring-1 ring-emerald-100 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none mb-2">Public Holidays</p>
                                <h3 className="text-2xl font-extrabold text-emerald-700 tracking-tight">{filteredHolidays.filter(h => h.type === 'Public').length}</h3>
                                <p className="text-[9px] font-bold text-emerald-400/60 mt-1 italic">Standard gazetted days</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Calendar size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl border-none bg-gradient-to-br from-rose-50 to-rose-100/60 p-6 shadow-sm ring-1 ring-rose-100 group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-none mb-2">Company Specific</p>
                                <h3 className="text-2xl font-extrabold text-rose-700 tracking-tight">{filteredHolidays.filter(h => h.type === 'Company').length}</h3>
                                <p className="text-[9px] font-bold text-rose-400/60 mt-1 italic">Internal culture days</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
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
                                className="pl-11 h-9 rounded-xl bg-slate-50 border border-slate-200 shadow-none font-bold text-[10px] focus-visible:ring-2 focus-visible:ring-indigo-100 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="h-6 w-px bg-slate-100" />
                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-28 h-9 rounded-xl bg-white border border-slate-200 font-bold text-[10px]">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold text-[10px]">
                                {["2024", "2025", "2026"].map(year => (
                                    <SelectItem key={year} value={year} className="rounded-lg h-9 text-[10px]">{year} Calendar</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="w-32 h-9 rounded-xl bg-white border border-slate-200 font-bold text-[10px]">
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAdvancedOpen(true)}
                            className={`h-10 rounded-xl font-black text-[10px] uppercase tracking-widest ${activeAdvancedCount > 0 ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" : "text-slate-400"}`}
                        >
                            <Filter size={14} className="mr-2" /> Advanced Filter
                            {activeAdvancedCount > 0 && (
                                <Badge className="ml-2 bg-indigo-600 text-white border-none text-[9px] h-4 px-1.5">{activeAdvancedCount}</Badge>
                            )}
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
                                <Card
                                    onClick={() => { setSelectedHoliday(holiday); setFormData(holiday); setErrors({}); setIsEditDialogOpen(true); }}
                                    className="group relative border-none shadow-sm hover:shadow-2xl transition-all rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-slate-100 h-full flex flex-col cursor-pointer"
                                >
                                    <div className={`h-2 w-full ${getTypeStyles(holiday.type).split(' ')[0]}`} />
                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex flex-col items-center justify-center h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">{getMonthName(holiday.date).substring(0, 3)}</span>
                                                <span className="text-2xl font-black text-slate-900 leading-none mt-1">{getDayNum(holiday.date)}</span>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600 rounded-full" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                    <DropdownMenuItem
                                                        className="rounded-xl h-11 gap-2"
                                                        onClick={() => {
                                                            setSelectedHoliday(holiday);
                                                            setFormData(holiday);
                                                            setErrors({});
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

            {/* Add Holiday Sheet */}
            <SideFormSheet
                open={isAddDialogOpen}
                onOpenChange={(o) => { setIsAddDialogOpen(o); if (!o) resetForm(); }}
                title="Add Holiday"
                description="Define a new public or company holiday for your employees."
                icon={<Calendar size={20} />}
                accentColor="#4f46e5"
                width="md"
                loading={isSaving}
                submitLabel={isSaving ? "Saving..." : "Confirm Holiday"}
                onSubmit={(e) => { e.preventDefault(); handleAddHoliday(); }}
            >
                <div className="space-y-4">
                    <Field label="Holiday Name" required error={errors.name || undefined}>
                        <Input
                            placeholder="e.g. Independence Day"
                            maxLength={80}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" required error={errors.date || undefined}>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </Field>
                        <Field label="Holiday Type">
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Optional">Optional</SelectItem>
                                    <SelectItem value="Company">Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Applicable Locations">
                        <Select value={formData.locationIds?.[0]} onValueChange={(v) => setFormData({ ...formData, locationIds: [v] })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All (Global)</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Holiday Sheet */}
            <SideFormSheet
                open={isEditDialogOpen}
                onOpenChange={(o) => { setIsEditDialogOpen(o); if (!o) resetForm(); }}
                title="Edit Holiday"
                description="Update the details for the selected holiday."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                loading={isSaving}
                submitLabel={isSaving ? "Saving..." : "Save Changes"}
                onSubmit={(e) => { e.preventDefault(); handleUpdateHoliday(); }}
            >
                <div className="space-y-4">
                    <Field label="Holiday Name" required error={errors.name || undefined}>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" required error={errors.date || undefined}>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </Field>
                        <Field label="Holiday Type">
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Optional">Optional</SelectItem>
                                    <SelectItem value="Company">Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Applicable Locations">
                        <Select value={formData.locationIds?.[0]} onValueChange={(v) => setFormData({ ...formData, locationIds: [v] })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All (Global)</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Advanced Filter Sheet */}
            <SideFormSheet
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
                title="Advanced Filters"
                description="Narrow holidays by type, month, or weekday."
                icon={<Filter size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Apply Filters"
                onSubmit={(e) => { e.preventDefault(); setIsAdvancedOpen(false); }}
                footer={
                    <>
                        <Button type="button" variant="outline" onClick={resetAdvancedFilters} className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] mr-auto">
                            Reset All
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsAdvancedOpen(false)} className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">
                            Cancel
                        </Button>
                        <Button type="submit" className="h-10 px-5 rounded-lg text-white hover:brightness-110" style={{ backgroundColor: "#4f46e5", boxShadow: "0 4px 12px #4f46e533" }}>
                            Apply Filters
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Holiday Type">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Optional">Optional</SelectItem>
                                <SelectItem value="Company">Company</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Month">
                        <Select value={monthFilter} onValueChange={setMonthFilter}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent className="max-h-[240px]">
                                <SelectItem value="All">All Months</SelectItem>
                                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, idx) => (
                                    <SelectItem key={m} value={String(idx + 1)}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Weekday">
                        <Select value={dayFilter} onValueChange={setDayFilter}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">Any Day</SelectItem>
                                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
};

export default HolidayCalendarPage;
