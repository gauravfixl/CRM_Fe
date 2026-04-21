"use client"

import React, { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Cake,
    Star,
    Gift,
    PartyPopper,
    Edit,
    Send,
    Heart,
    Sparkles,
    Trophy,
    Plus,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
    Search
} from "lucide-react";
import { useEngageStore, type EmployeeCelebration, type WishTemplate } from "@/shared/data/engage-store";
import { required, minLength, maxLength, rangeNumber, isValidDate, hasPlaceholder, runValidators } from "@/shared/utils/engage-validation";

const cardTemplates = [
    { id: "c1", name: "Classic", gradient: "from-pink-400 to-purple-500" },
    { id: "c2", name: "Festive", gradient: "from-amber-400 to-orange-500" },
    { id: "c3", name: "Elegant", gradient: "from-slate-700 to-slate-900" },
    { id: "c4", name: "Tropical", gradient: "from-emerald-400 to-teal-500" },
];

const departments = ["Engineering", "Sales", "Design", "Marketing", "HR", "Finance", "Product", "QA", "Ops", "Legal"];

// Fixed "today" for consistent demo. Matches MEMORY date.
const TODAY_ISO = "2026-04-20";

const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const toFullDate = (mmdd: string) => {
    if (mmdd.length === 10) return mmdd; // already YYYY-MM-DD
    return `2026-${mmdd}`;
};

const CelebrationsPage = () => {
    const { toast } = useToast();
    const {
        celebrations,
        wishedCelebrations,
        wishTemplates,
        autoWishEnabled,
        selectedCardTemplateId,
        userPoints,
        addCelebration,
        updateCelebration,
        deleteCelebration,
        sendWish,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        setAutoWishEnabled,
        setSelectedCardTemplate
    } = useEngageStore();

    // Dialogs
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isCardDesigner, setIsCardDesigner] = useState(false);
    const [isCelebrationDialogOpen, setIsCelebrationDialogOpen] = useState(false);
    const [isTemplateEditOpen, setIsTemplateEditOpen] = useState(false);
    const [isWishDialogOpen, setIsWishDialogOpen] = useState(false);

    // Editing state
    const [editingCelebration, setEditingCelebration] = useState<EmployeeCelebration | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<WishTemplate | null>(null);
    const [wishingCelebration, setWishingCelebration] = useState<EmployeeCelebration | null>(null);

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Forms
    const [celebrationForm, setCelebrationForm] = useState<Omit<EmployeeCelebration, 'id'>>({
        employeeName: "",
        department: "Engineering",
        type: "Birthday",
        date: TODAY_ISO,
        years: undefined
    });
    const [templateForm, setTemplateForm] = useState<Omit<WishTemplate, 'id'>>({
        name: "",
        message: "",
        type: "Birthday"
    });
    const [wishMessage, setWishMessage] = useState("");

    const resetCelebrationForm = () => {
        setCelebrationForm({ employeeName: "", department: "Engineering", type: "Birthday", date: TODAY_ISO, years: undefined });
        setEditingCelebration(null);
    };

    const resetTemplateForm = () => {
        setTemplateForm({ name: "", message: "", type: "Birthday" });
        setEditingTemplate(null);
    };

    const openCreateCelebration = () => {
        resetCelebrationForm();
        setIsCelebrationDialogOpen(true);
    };

    const openEditCelebration = (c: EmployeeCelebration) => {
        setEditingCelebration(c);
        setCelebrationForm({
            employeeName: c.employeeName,
            department: c.department,
            type: c.type,
            date: toFullDate(c.date),
            years: c.years
        });
        setIsCelebrationDialogOpen(true);
    };

    const handleSaveCelebration = () => {
        const nameError = runValidators(
            required(celebrationForm.employeeName, "employeeName", "Employee name"),
            minLength(celebrationForm.employeeName, 2, "employeeName", "Employee name"),
            maxLength(celebrationForm.employeeName, 80, "employeeName", "Employee name")
        );
        if (nameError) {
            toast({ title: "Invalid Name", description: nameError.message, variant: "destructive" });
            return;
        }
        const dateError = isValidDate(celebrationForm.date, "date", "Date");
        if (dateError) {
            toast({ title: "Invalid Date", description: dateError.message, variant: "destructive" });
            return;
        }
        if (celebrationForm.type === "Work Anniversary") {
            const yearsError = rangeNumber(celebrationForm.years ?? 0, 1, 50, "years", "Years");
            if (yearsError) {
                toast({ title: "Invalid Years", description: yearsError.message, variant: "destructive" });
                return;
            }
        }
        // Store date as MM-DD for consistency with the original seed format
        const mmdd = celebrationForm.date.length === 10
            ? celebrationForm.date.slice(5)
            : celebrationForm.date;
        const payload = { ...celebrationForm, date: mmdd };

        if (editingCelebration) {
            updateCelebration(editingCelebration.id, payload);
            toast({ title: "Updated", description: `${payload.employeeName}'s celebration updated.` });
        } else {
            addCelebration(payload);
            toast({ title: "Celebration Added", description: `${payload.employeeName} added to the calendar.` });
        }
        setIsCelebrationDialogOpen(false);
        resetCelebrationForm();
    };

    const handleDeleteCelebration = (id: string, name: string) => {
        deleteCelebration(id);
        toast({ title: "Removed", description: `${name}'s celebration removed.` });
    };

    const openCreateTemplate = () => {
        resetTemplateForm();
        setIsTemplateEditOpen(true);
    };

    const openEditTemplate = (t: WishTemplate) => {
        setEditingTemplate(t);
        setTemplateForm({ name: t.name, message: t.message, type: t.type });
        setIsTemplateEditOpen(true);
    };

    const handleSaveTemplate = () => {
        const nameError = runValidators(
            required(templateForm.name, "name", "Template name"),
            minLength(templateForm.name, 3, "name", "Template name"),
            maxLength(templateForm.name, 80, "name", "Template name")
        );
        if (nameError) {
            toast({ title: "Invalid Name", description: nameError.message, variant: "destructive" });
            return;
        }
        const messageError = runValidators(
            required(templateForm.message, "message", "Message"),
            minLength(templateForm.message, 10, "message", "Message"),
            maxLength(templateForm.message, 500, "message", "Message"),
            hasPlaceholder(templateForm.message, "{{name}}", "message", "Message")
        );
        if (messageError) {
            toast({ title: "Invalid Message", description: messageError.message, variant: "destructive" });
            return;
        }
        if (editingTemplate) {
            updateTemplate(editingTemplate.id, templateForm);
            toast({ title: "Template Updated" });
        } else {
            addTemplate(templateForm);
            toast({ title: "Template Added" });
        }
        setIsTemplateEditOpen(false);
        resetTemplateForm();
    };

    const handleDeleteTemplate = (id: string) => {
        deleteTemplate(id);
        toast({ title: "Template Removed" });
    };

    const openWishDialog = (c: EmployeeCelebration) => {
        setWishingCelebration(c);
        const matchingTemplate = wishTemplates.find(t =>
            (c.type === "Birthday" && t.type === "Birthday") ||
            (c.type === "Work Anniversary" && t.type === "Anniversary")
        );
        setWishMessage(
            matchingTemplate
                ? matchingTemplate.message.replace(/\{\{name\}\}/g, c.employeeName)
                : `Happy ${c.type === "Birthday" ? "Birthday" : "Work Anniversary"}, ${c.employeeName}!`
        );
        setIsWishDialogOpen(true);
    };

    const handleSendWish = () => {
        if (!wishingCelebration) return;
        if (wishedCelebrations.includes(wishingCelebration.id)) {
            toast({ title: "Already Wished", description: "You've already sent a wish to this person.", variant: "destructive" });
            return;
        }
        const msgError = runValidators(
            required(wishMessage, "wishMessage", "Wish message"),
            minLength(wishMessage, 5, "wishMessage", "Wish message"),
            maxLength(wishMessage, 500, "wishMessage", "Wish message")
        );
        if (msgError) {
            toast({ title: "Invalid Wish", description: msgError.message, variant: "destructive" });
            return;
        }
        sendWish(wishingCelebration.id);
        toast({
            title: "Wish Sent! 🎉",
            description: `Your wish for ${wishingCelebration.employeeName} has been delivered. +5 culture points!`
        });
        setIsWishDialogOpen(false);
        setWishingCelebration(null);
        setWishMessage("");
    };

    // Derived data
    const filteredCelebrations = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return celebrations.filter(c =>
            c.employeeName.toLowerCase().includes(term) || c.department.toLowerCase().includes(term)
        );
    }, [celebrations, searchTerm]);

    const todayKey = TODAY_ISO.slice(5); // MM-DD
    const todayCelebrations = filteredCelebrations.filter(c => c.date.slice(-5) === todayKey);

    const upcomingCelebrations = useMemo(() => {
        const today = new Date(TODAY_ISO);
        return filteredCelebrations
            .map(c => {
                const dateStr = c.date.length === 10 ? c.date : `2026-${c.date}`;
                const d = new Date(dateStr);
                const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                return { c, diff, dateStr };
            })
            .filter(x => x.diff > 0 && x.diff <= 7)
            .sort((a, b) => a.diff - b.diff);
    }, [filteredCelebrations]);

    const birthdaysThisMonth = celebrations.filter(c => c.type === "Birthday").length;
    const anniversariesThisMonth = celebrations.filter(c => c.type === "Work Anniversary").length;
    const milestones = celebrations.filter(c => c.type === "Work Anniversary" && c.years && c.years >= 5).length;

    // Calendar (April 2026 starts on Wednesday; 0=Sun so offset=3)
    const daysInMonth = 30;
    const firstDayOffset = 3;
    const calendarCells = Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDayOffset + 1;
        if (day < 1 || day > daysInMonth) return null;
        return day;
    });

    const getCelebsForDay = (day: number) => {
        const dd = String(day).padStart(2, "0");
        return celebrations.filter(c => c.date.slice(-2) === dd && c.date.slice(-5, -3) === "04");
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-pink-500 rounded-xl flex items-center justify-center text-white">
                        <PartyPopper size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Celebrations</h1>
                        <p className="text-sm font-medium text-slate-500">Birthdays, work anniversaries, and milestone celebrations.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold">
                        <Sparkles size={12} className="mr-1" /> {userPoints} pts
                    </Badge>
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsCardDesigner(true)}>
                        <Sparkles size={16} className="mr-2 text-pink-500" /> Card Designer
                    </Button>
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsTemplateOpen(true)}>
                        <Edit size={16} className="mr-2 text-slate-400" /> Templates
                    </Button>
                    <Button
                        variant={autoWishEnabled ? "default" : "outline"}
                        className={autoWishEnabled ? "bg-emerald-500 hover:bg-emerald-600 text-white font-bold" : "font-bold border-slate-200"}
                        onClick={() => {
                            setAutoWishEnabled(!autoWishEnabled);
                            toast({ title: autoWishEnabled ? "Auto-Wish Disabled" : "Auto-Wish Enabled" });
                        }}
                    >
                        <Send size={16} className="mr-2" /> Auto-Wish {autoWishEnabled ? "ON" : "OFF"}
                    </Button>
                    <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={openCreateCelebration}>
                        <Plus size={16} className="mr-2" /> Add Celebration
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-8 py-6 grid grid-cols-3 gap-6">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-pink-50 rounded-xl flex items-center justify-center"><Cake size={24} className="text-pink-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Birthdays This Month</p><p className="text-2xl font-bold text-slate-900">{birthdaysThisMonth}</p></div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center"><Star size={24} className="text-amber-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Anniversaries This Month</p><p className="text-2xl font-bold text-slate-900">{anniversariesThisMonth}</p></div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center"><Trophy size={24} className="text-purple-600" /></div>
                        <div><p className="text-sm text-slate-500 font-medium">Milestone Anniversaries (5yr+)</p><p className="text-2xl font-bold text-slate-900">{milestones}</p></div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex-1 overflow-auto px-8 pb-8">
                <Tabs defaultValue="today" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="today" className="font-bold">Today</TabsTrigger>
                            <TabsTrigger value="upcoming" className="font-bold">Upcoming (7 days)</TabsTrigger>
                            <TabsTrigger value="all" className="font-bold">All Celebrations</TabsTrigger>
                            <TabsTrigger value="calendar" className="font-bold">Calendar View</TabsTrigger>
                        </TabsList>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                placeholder="Search by name or department..."
                                className="pl-9 bg-white"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value="today" className="space-y-6">
                        {todayCelebrations.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No celebrations today.</p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {todayCelebrations.map(c => {
                                    const wished = wishedCelebrations.includes(c.id);
                                    return (
                                        <Card key={c.id} className="rounded-2xl overflow-hidden shadow-sm border-2 relative" style={{ borderColor: c.type === "Birthday" ? "#f9a8d4" : "#fbbf24" }}>
                                            <div className={`h-3 ${c.type === "Birthday" ? "bg-gradient-to-r from-pink-400 to-purple-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`} />
                                            <div className="absolute top-2 right-2 z-10">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/80 hover:bg-white">
                                                            <MoreHorizontal size={14} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditCelebration(c)}>
                                                            <Edit size={12} className="mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteCelebration(c.id, c.employeeName)} className="text-rose-500">
                                                            <Trash2 size={12} className="mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <CardContent className="p-6 text-center">
                                                <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg ${c.type === "Birthday" ? "bg-gradient-to-br from-pink-400 to-purple-500" : "bg-gradient-to-br from-amber-400 to-orange-500"}`}>
                                                    {getInitials(c.employeeName)}
                                                </div>
                                                <div className="mb-2">
                                                    {c.type === "Birthday" ? <Cake size={20} className="inline text-pink-500 mr-1" /> : <Star size={20} className="inline text-amber-500 mr-1" />}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900">{c.employeeName}</h3>
                                                <p className="text-sm text-slate-500">{c.department}</p>
                                                <Badge className={`mt-3 ${c.type === "Birthday" ? "bg-pink-100 text-pink-700 border-pink-200" : "bg-amber-100 text-amber-700 border-amber-200"}`} variant="outline">
                                                    {c.type === "Birthday" ? "Birthday" : `${c.years ?? 1} Year${c.years !== 1 ? "s" : ""} Anniversary`}
                                                </Badge>
                                                <div className="mt-4 flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openWishDialog(c)}
                                                        disabled={wished}
                                                        className={wished ? "bg-emerald-500 text-white text-xs font-bold cursor-default" : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold"}
                                                    >
                                                        {wished ? <><CheckCircle2 size={12} className="mr-1" /> Wished</> : <><Heart size={12} className="mr-1" /> Send Wish</>}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcomingCelebrations.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No upcoming celebrations in the next 7 days.</p>
                            </Card>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                                {upcomingCelebrations.map(({ c, dateStr }) => {
                                    const wished = wishedCelebrations.includes(c.id);
                                    return (
                                        <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${c.type === "Birthday" ? "bg-pink-500" : "bg-amber-500"}`}>
                                                {getInitials(c.employeeName)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{c.employeeName}</p>
                                                <p className="text-xs text-slate-500">{c.department}</p>
                                            </div>
                                            <Badge variant="outline" className={c.type === "Birthday" ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                                                {c.type === "Birthday" ? <Cake size={12} className="mr-1" /> : <Star size={12} className="mr-1" />}
                                                {c.type === "Birthday" ? "Birthday" : `${c.years ?? 1}yr`}
                                            </Badge>
                                            <p className="text-xs text-slate-400 min-w-[100px] text-right">{new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                                            <Button
                                                size="sm"
                                                onClick={() => openWishDialog(c)}
                                                disabled={wished}
                                                className={wished ? "bg-emerald-500 text-white text-xs font-bold cursor-default" : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold"}
                                            >
                                                {wished ? "Wished" : "Wish"}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditCelebration(c)}>
                                                        <Edit size={12} className="mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCelebration(c.id, c.employeeName)} className="text-rose-500">
                                                        <Trash2 size={12} className="mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="all" className="space-y-4">
                        {filteredCelebrations.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No celebrations match your search.</p>
                            </Card>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                                {filteredCelebrations.map(c => {
                                    const wished = wishedCelebrations.includes(c.id);
                                    const dateStr = toFullDate(c.date);
                                    return (
                                        <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${c.type === "Birthday" ? "bg-pink-500" : "bg-amber-500"}`}>
                                                {getInitials(c.employeeName)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{c.employeeName}</p>
                                                <p className="text-xs text-slate-500">{c.department}</p>
                                            </div>
                                            <Badge variant="outline" className={c.type === "Birthday" ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                                                {c.type === "Birthday" ? <Cake size={12} className="mr-1" /> : <Star size={12} className="mr-1" />}
                                                {c.type === "Birthday" ? "Birthday" : `${c.years ?? 1}yr`}
                                            </Badge>
                                            <p className="text-xs text-slate-400 min-w-[100px] text-right">{new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                            <Button
                                                size="sm"
                                                onClick={() => openWishDialog(c)}
                                                disabled={wished}
                                                className={wished ? "bg-emerald-500 text-white text-xs font-bold cursor-default" : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold"}
                                            >
                                                {wished ? "Wished" : "Wish"}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditCelebration(c)}>
                                                        <Edit size={12} className="mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCelebration(c.id, c.employeeName)} className="text-rose-500">
                                                        <Trash2 size={12} className="mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="calendar">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">April 2026</h3>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                        <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {calendarCells.map((day, i) => {
                                        if (day === null) return <div key={i} className="h-20" />;
                                        const celebs = getCelebsForDay(day);
                                        const isToday = day === 20;
                                        return (
                                            <div key={i} className={`h-20 rounded-lg p-1.5 border ${isToday ? "border-[#8B5CF6] bg-purple-50" : "border-slate-100 hover:bg-slate-50"}`}>
                                                <p className={`text-xs font-bold ${isToday ? "text-[#8B5CF6]" : "text-slate-600"}`}>{day}</p>
                                                <div className="mt-1 space-y-0.5">
                                                    {celebs.slice(0, 2).map(c => (
                                                        <div key={c.id} className="flex items-center gap-1 text-[10px] truncate">
                                                            {c.type === "Birthday" ? <Cake size={10} className="text-pink-500 shrink-0" /> : <Star size={10} className="text-amber-500 shrink-0" />}
                                                            <span className="truncate font-medium text-slate-600">{c.employeeName.split(" ")[0]}</span>
                                                        </div>
                                                    ))}
                                                    {celebs.length > 2 && <p className="text-[9px] text-slate-400">+{celebs.length - 2} more</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add/Edit Celebration Dialog */}
            <Dialog open={isCelebrationDialogOpen} onOpenChange={(val) => { if (!val) resetCelebrationForm(); setIsCelebrationDialogOpen(val); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCelebration ? "Edit Celebration" : "Add Celebration"}</DialogTitle>
                        <DialogDescription>Track a birthday or work anniversary.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Employee Name</Label>
                            <Input
                                value={celebrationForm.employeeName}
                                maxLength={80}
                                onChange={e => setCelebrationForm({ ...celebrationForm, employeeName: e.target.value })}
                                placeholder="e.g. Priya Sharma"
                            />
                            <p className="text-[10px] text-slate-400">{celebrationForm.employeeName.length}/80 • min 2</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={celebrationForm.department} onValueChange={v => setCelebrationForm({ ...celebrationForm, department: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={celebrationForm.type} onValueChange={v => setCelebrationForm({ ...celebrationForm, type: v as "Birthday" | "Work Anniversary" })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Birthday">Birthday</SelectItem>
                                        <SelectItem value="Work Anniversary">Work Anniversary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={celebrationForm.date.length === 10 ? celebrationForm.date : `2026-${celebrationForm.date}`}
                                    onChange={e => setCelebrationForm({ ...celebrationForm, date: e.target.value })}
                                />
                            </div>
                            {celebrationForm.type === "Work Anniversary" && (
                                <div className="space-y-2">
                                    <Label>Years</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={celebrationForm.years ?? ""}
                                        onChange={e => setCelebrationForm({ ...celebrationForm, years: Number(e.target.value) || undefined })}
                                        placeholder="e.g. 5"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCelebrationDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSaveCelebration}>
                            {editingCelebration ? "Save Changes" : "Add Celebration"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Templates Library Dialog */}
            <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Message Templates</span>
                            <Button size="sm" variant="outline" onClick={openCreateTemplate}>
                                <Plus size={14} className="mr-1" /> New
                            </Button>
                        </DialogTitle>
                        <DialogDescription>Custom message templates for auto-wishes. Use {`{{name}}`} for the recipient's name.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[400px] overflow-auto">
                        {wishTemplates.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-8">No templates yet. Create one!</p>
                        ) : wishTemplates.map(t => (
                            <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">{t.name}</p>
                                        <Badge variant="outline" className="text-[9px] mt-1">{t.type}</Badge>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditTemplate(t)}>
                                            <Edit size={12} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-500 hover:text-rose-600" onClick={() => handleDeleteTemplate(t.id)}>
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700">{t.message}</p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Template Add/Edit Dialog */}
            <Dialog open={isTemplateEditOpen} onOpenChange={(val) => { if (!val) resetTemplateForm(); setIsTemplateEditOpen(val); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingTemplate ? "Edit Template" : "New Template"}</DialogTitle>
                        <DialogDescription>Use {`{{name}}`} as a placeholder for the recipient.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                                value={templateForm.name}
                                maxLength={80}
                                onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })}
                                placeholder="e.g. Birthday - Warm"
                            />
                            <p className="text-[10px] text-slate-400">{templateForm.name.length}/80 • min 3</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={templateForm.type} onValueChange={v => setTemplateForm({ ...templateForm, type: v as "Birthday" | "Anniversary" })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Birthday">Birthday</SelectItem>
                                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={templateForm.message}
                                maxLength={500}
                                onChange={e => setTemplateForm({ ...templateForm, message: e.target.value })}
                                placeholder="Happy Birthday, {{name}}!"
                                rows={4}
                            />
                            <p className="text-[10px] text-slate-400">{templateForm.message.length}/500 • must include {`{{name}}`}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTemplateEditOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSaveTemplate}>
                            {editingTemplate ? "Save" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send Wish Dialog */}
            <Dialog open={isWishDialogOpen} onOpenChange={setIsWishDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send a Wish</DialogTitle>
                        <DialogDescription>
                            {wishingCelebration && `To ${wishingCelebration.employeeName} · ${wishingCelebration.type}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className={`h-20 rounded-xl bg-gradient-to-br ${cardTemplates.find(c => c.id === selectedCardTemplateId)?.gradient} flex items-center justify-center`}>
                            <Gift size={32} className="text-white/90" />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={wishMessage}
                                maxLength={500}
                                onChange={e => setWishMessage(e.target.value)}
                                rows={4}
                            />
                            <p className="text-[10px] text-slate-400">{wishMessage.length}/500 • min 5</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWishDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleSendWish}>
                            <Send size={14} className="mr-1" /> Send Wish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Card Designer Dialog */}
            <Dialog open={isCardDesigner} onOpenChange={setIsCardDesigner}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Sparkles size={20} className="text-pink-500" /> Wish Card Designer</DialogTitle>
                        <DialogDescription>Choose a template for celebration cards.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {cardTemplates.map(ct => (
                            <div
                                key={ct.id}
                                onClick={() => setSelectedCardTemplate(ct.id)}
                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedCardTemplateId === ct.id ? "border-[#8B5CF6] ring-2 ring-purple-200" : "border-slate-200"}`}
                            >
                                <div className={`h-24 bg-gradient-to-br ${ct.gradient} flex items-center justify-center`}>
                                    <PartyPopper size={32} className="text-white/80" />
                                </div>
                                <div className="p-3 bg-white text-center">
                                    <p className="text-sm font-bold text-slate-700">{ct.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => { setIsCardDesigner(false); toast({ title: "Template Selected", description: `"${cardTemplates.find(c => c.id === selectedCardTemplateId)?.name}" template applied.` }); }}>
                            Apply Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CelebrationsPage;
