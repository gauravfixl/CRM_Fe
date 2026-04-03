"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Cake,
    Star,
    Calendar,
    Gift,
    PartyPopper,
    Settings,
    Edit,
    Send,
    Heart,
    Sparkles,
    Award,
    Users,
    Trophy,
    Clock
} from "lucide-react";

type Celebration = {
    id: string;
    name: string;
    department: string;
    type: "birthday" | "anniversary";
    date: string;
    years?: number;
    avatarInitials: string;
};

const today = "2026-04-02";

const mockCelebrations: Celebration[] = [
    { id: "1", name: "Priya Sharma", department: "Engineering", type: "birthday", date: "2026-04-02", avatarInitials: "PS" },
    { id: "2", name: "Rajesh Kumar", department: "Sales", type: "anniversary", date: "2026-04-02", years: 5, avatarInitials: "RK" },
    { id: "3", name: "Sneha Rao", department: "Design", type: "birthday", date: "2026-04-02", avatarInitials: "SR" },
    { id: "4", name: "Vikram Singh", department: "Marketing", type: "anniversary", date: "2026-04-02", years: 1, avatarInitials: "VS" },
    { id: "5", name: "Amit Joshi", department: "Engineering", type: "birthday", date: "2026-04-03", avatarInitials: "AJ" },
    { id: "6", name: "Kavita Patel", department: "HR", type: "anniversary", date: "2026-04-04", years: 3, avatarInitials: "KP" },
    { id: "7", name: "Deepak Nair", department: "Finance", type: "birthday", date: "2026-04-05", avatarInitials: "DN" },
    { id: "8", name: "Meera Iyer", department: "Product", type: "anniversary", date: "2026-04-06", years: 10, avatarInitials: "MI" },
    { id: "9", name: "Arjun Reddy", department: "QA", type: "birthday", date: "2026-04-07", avatarInitials: "AR" },
    { id: "10", name: "Neha Gupta", department: "Engineering", type: "birthday", date: "2026-04-08", avatarInitials: "NG" },
    { id: "11", name: "Suresh Mehta", department: "Ops", type: "anniversary", date: "2026-04-12", years: 5, avatarInitials: "SM" },
    { id: "12", name: "Rahul Verma", department: "Sales", type: "birthday", date: "2026-04-15", avatarInitials: "RV" },
    { id: "13", name: "Anita Desai", department: "Legal", type: "anniversary", date: "2026-04-20", years: 10, avatarInitials: "AD" },
    { id: "14", name: "Karan Malhotra", department: "Engineering", type: "birthday", date: "2026-04-25", avatarInitials: "KM" },
];

const templates = [
    { id: "t1", name: "Birthday - Standard", message: "Happy Birthday, {{name}}! Wishing you a wonderful day filled with joy!" },
    { id: "t2", name: "Birthday - Fun", message: "It's party time! Happy Birthday {{name}}! Here's to an amazing year ahead!" },
    { id: "t3", name: "Anniversary - 1 Year", message: "Congratulations {{name}} on completing 1 year with us! Here's to many more!" },
    { id: "t4", name: "Anniversary - 3 Years", message: "3 amazing years, {{name}}! Your dedication and growth inspire us all!" },
    { id: "t5", name: "Anniversary - 5 Years", message: "Half a decade of excellence! Thank you {{name}} for your incredible 5-year journey with us!" },
    { id: "t6", name: "Anniversary - 10 Years", message: "A legendary milestone! {{name}}, your 10 years of commitment have shaped our organization. Thank you!" },
];

const cardTemplates = [
    { id: "c1", name: "Classic", gradient: "from-pink-400 to-purple-500" },
    { id: "c2", name: "Festive", gradient: "from-amber-400 to-orange-500" },
    { id: "c3", name: "Elegant", gradient: "from-slate-700 to-slate-900" },
    { id: "c4", name: "Tropical", gradient: "from-emerald-400 to-teal-500" },
];

const CelebrationsPage = () => {
    const { toast } = useToast();
    const [autoWish, setAutoWish] = useState(true);
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);
    const [isCardDesigner, setIsCardDesigner] = useState(false);
    const [selectedCard, setSelectedCard] = useState("c1");

    const todayCelebrations = mockCelebrations.filter(c => c.date === today);
    const upcoming = mockCelebrations.filter(c => {
        const d = new Date(c.date);
        const t = new Date(today);
        const diff = (d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 7;
    });

    const birthdaysThisMonth = mockCelebrations.filter(c => c.type === "birthday").length;
    const anniversariesThisMonth = mockCelebrations.filter(c => c.type === "anniversary").length;
    const milestones = mockCelebrations.filter(c => c.type === "anniversary" && c.years && c.years >= 5).length;

    // Calendar grid
    const daysInMonth = 30; // April
    const firstDayOffset = 2; // April 2026 starts on Wednesday (0=Sun)
    const calendarCells = Array.from({ length: 42 }, (_, i) => {
        const day = i - firstDayOffset + 1;
        if (day < 1 || day > daysInMonth) return null;
        return day;
    });

    const getCelebsForDay = (day: number) => {
        const dateStr = `2026-04-${String(day).padStart(2, "0")}`;
        return mockCelebrations.filter(c => c.date === dateStr);
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
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsCardDesigner(true)}>
                        <Sparkles size={16} className="mr-2 text-pink-500" /> Card Designer
                    </Button>
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setIsTemplateOpen(true)}>
                        <Edit size={16} className="mr-2 text-slate-400" /> Templates
                    </Button>
                    <Button variant={autoWish ? "default" : "outline"} className={autoWish ? "bg-emerald-500 hover:bg-emerald-600 text-white font-bold" : "font-bold border-slate-200"} onClick={() => { setAutoWish(!autoWish); toast({ title: autoWish ? "Auto-Wish Disabled" : "Auto-Wish Enabled" }); }}>
                        <Send size={16} className="mr-2" /> Auto-Wish {autoWish ? "ON" : "OFF"}
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
                    <TabsList className="bg-slate-100">
                        <TabsTrigger value="today" className="font-bold">Today</TabsTrigger>
                        <TabsTrigger value="upcoming" className="font-bold">Upcoming (7 days)</TabsTrigger>
                        <TabsTrigger value="calendar" className="font-bold">Calendar View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="today" className="space-y-6">
                        {todayCelebrations.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No celebrations today.</p>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {todayCelebrations.map(c => (
                                    <Card key={c.id} className="rounded-2xl overflow-hidden shadow-sm border-2" style={{ borderColor: c.type === "birthday" ? "#f9a8d4" : "#fbbf24" }}>
                                        <div className={`h-3 ${c.type === "birthday" ? "bg-gradient-to-r from-pink-400 to-purple-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`} />
                                        <CardContent className="p-6 text-center">
                                            <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg ${c.type === "birthday" ? "bg-gradient-to-br from-pink-400 to-purple-500" : "bg-gradient-to-br from-amber-400 to-orange-500"}`}>
                                                {c.avatarInitials}
                                            </div>
                                            <div className="mb-2">
                                                {c.type === "birthday" ? <Cake size={20} className="inline text-pink-500 mr-1" /> : <Star size={20} className="inline text-amber-500 mr-1" />}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                                            <p className="text-sm text-slate-500">{c.department}</p>
                                            <Badge className={`mt-3 ${c.type === "birthday" ? "bg-pink-100 text-pink-700 border-pink-200" : "bg-amber-100 text-amber-700 border-amber-200"}`} variant="outline">
                                                {c.type === "birthday" ? "Birthday" : `${c.years} Year${c.years !== 1 ? "s" : ""} Anniversary`}
                                            </Badge>
                                            <div className="mt-4 flex gap-2 justify-center">
                                                <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold">
                                                    <Heart size={12} className="mr-1" /> Send Wish
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming" className="space-y-4">
                        {upcoming.length === 0 ? (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                                <p className="text-slate-400 text-lg">No upcoming celebrations in the next 7 days.</p>
                            </Card>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                                {upcoming.map(c => (
                                    <div key={c.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${c.type === "birthday" ? "bg-pink-500" : "bg-amber-500"}`}>
                                            {c.avatarInitials}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900">{c.name}</p>
                                            <p className="text-xs text-slate-500">{c.department}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={c.type === "birthday" ? "bg-pink-50 text-pink-600 border-pink-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                                                {c.type === "birthday" ? <Cake size={12} className="mr-1" /> : <Star size={12} className="mr-1" />}
                                                {c.type === "birthday" ? "Birthday" : `${c.years}yr`}
                                            </Badge>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(c.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                                        </div>
                                    </div>
                                ))}
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
                                        const isToday = day === 2;
                                        return (
                                            <div key={i} className={`h-20 rounded-lg p-1.5 border ${isToday ? "border-[#8B5CF6] bg-purple-50" : "border-slate-100 hover:bg-slate-50"}`}>
                                                <p className={`text-xs font-bold ${isToday ? "text-[#8B5CF6]" : "text-slate-600"}`}>{day}</p>
                                                <div className="mt-1 space-y-0.5">
                                                    {celebs.slice(0, 2).map(c => (
                                                        <div key={c.id} className="flex items-center gap-1 text-[10px] truncate">
                                                            {c.type === "birthday" ? <Cake size={10} className="text-pink-500 shrink-0" /> : <Star size={10} className="text-amber-500 shrink-0" />}
                                                            <span className="truncate font-medium text-slate-600">{c.name.split(" ")[0]}</span>
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

            {/* Templates Dialog */}
            <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Message Templates</DialogTitle>
                        <DialogDescription>Custom message templates for auto-wishes.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[400px] overflow-auto">
                        {templates.map(t => (
                            <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 mb-1">{t.name}</p>
                                <p className="text-sm text-slate-700">{t.message}</p>
                            </div>
                        ))}
                    </div>
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
                                onClick={() => setSelectedCard(ct.id)}
                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedCard === ct.id ? "border-[#8B5CF6] ring-2 ring-purple-200" : "border-slate-200"}`}
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
                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => { setIsCardDesigner(false); toast({ title: "Template Selected", description: `"${cardTemplates.find(c => c.id === selectedCard)?.name}" template applied.` }); }}>
                            Apply Template
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CelebrationsPage;
