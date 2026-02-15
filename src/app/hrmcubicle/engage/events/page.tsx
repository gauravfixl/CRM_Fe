"use client"

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    CalendarDays,
    MapPin,
    Users,
    Clock,
    Plus,
    Search,
    LayoutGrid,
    Calendar as CalendarIcon,
    Video,
    Edit,
    Users2,
    Heart,
    PartyPopper,
    Cake,
    Gift,
    Star,
    Share2,
    SearchX,
    Sparkles,
    ChevronRight,
    MessageCircleHeart,
    Smile,
    Check
} from "lucide-react";
import { useEngageStore, type Event, type EmployeeCelebration } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const EventsPage = () => {
    const { events, celebrations, addEvent, updateEvent, userPoints, addPoints, toggleRegistration } = useEngageStore();
    const { toast } = useToast();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isRSVPSheetOpen, setIsRSVPSheetOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState<Partial<Event>>({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        eventType: "Virtual",
        category: "Social",
    });

    const categories = ["Social", "Professional", "Wellness", "Training", "Team Building"];

    const resetForm = () => {
        setFormData({ title: "", description: "", date: "", time: "", location: "", eventType: "Virtual", category: "Social" });
        setSelectedEvent(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.date || !formData.time) {
            toast({ title: "Details Missing", description: "Event title and schedule are required.", variant: "destructive" });
            return;
        }

        if (selectedEvent) {
            updateEvent(selectedEvent.id, formData);
            toast({ title: "Update Success", description: "Event details synchronized." });
        } else {
            addEvent(formData as Omit<Event, "id" | "attendees" | "registered">);
            toast({ title: "Event Broadcasted", description: "Everyone has been notified!" });
        }
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const handleEdit = (event: Event) => {
        setSelectedEvent(event);
        setFormData(event);
        setIsCreateDialogOpen(true);
    };

    const handleLike = (id: string, name: string) => {
        if (!likedItems[id]) {
            setLikedItems(prev => ({ ...prev, [id]: true }));
            addPoints(5);
            toast({
                title: `Sent love to ${name}!`,
                description: "You earned +5 culture points ✨",
                className: "bg-rose-50 border-rose-100 text-rose-600 font-bold"
            });
        }
    };

    // Filter logic combining Events and Celebrations
    const allItems = [
        ...events.map(e => ({ ...e, itemType: 'event' })),
        ...celebrations.map(c => ({
            id: c.id,
            title: c.type === 'Birthday' ? `Happy Birthday, ${c.employeeName}! 🎂` : `${c.employeeName}'s Work Anniversary! 🎊`,
            description: c.type === 'Birthday' ? 'Let\'s celebrate another year of greatness!' : `Celebrating ${c.years} years of excellence with us.`,
            date: `2026-${c.date}`,
            category: c.type,
            employeeName: c.employeeName,
            itemType: 'celebration',
            location: 'Office / Lounge',
            time: 'All Day',
            attendees: 12 // Fixed number for hydration stability
        }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const filteredItems = allItems.filter(item => {
        const matchesTab = activeTab === "all" ||
            (activeTab === "official" && item.itemType === 'event') ||
            (activeTab === "people" && item.itemType === 'celebration');
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-[#fcfdff] overflow-hidden">
            {/* Informal Header */}
            <div className="px-8 py-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <PartyPopper size={180} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-amber-300 fill-amber-300 h-5 w-5" />
                            <span className="text-[10px] font-bold tracking-wider text-white/80">Org Culture Hub</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter leading-none mb-3">Happy Moments &amp;<br />Shared Goals</h1>
                        <p className="text-white/70 font-bold text-sm max-w-md italic">Building a workplace that celebrates every win, big or small.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[120px]">
                            <p className="text-[10px] font-bold text-white/60 mb-1">Your Karma</p>
                            <p className="text-xl font-bold text-amber-300">{userPoints} pts</p>
                        </div>
                        <Button
                            onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                            className="bg-white text-indigo-600 hover:bg-white/90 rounded-2xl h-14 px-8 font-bold text-xs tracking-widest shadow-2xl transition-all active:scale-95 border-none"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Create Event
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Horizontal Magic Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Upcoming Highlights */}
                        <Card className="p-5 bg-indigo-50/50 rounded-[2.5rem] border-2 border-indigo-200 shadow-sm flex flex-col justify-center gap-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest capitalize">Next Event In</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tighter">2 Days</p>
                                </div>
                                <Clock className="text-indigo-500 h-10 w-10" />
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} className="h-full bg-indigo-500" />
                            </div>
                        </Card>

                        {/* People & Joy Stats */}
                        <Card className="p-5 bg-purple-100/60 rounded-[2.5rem] border-2 border-purple-200 shadow-sm flex flex-col justify-center gap-3">
                            <h2 className="text-[10px] font-bold text-purple-400 tracking-widest flex items-center gap-2 mb-2 capitalize">
                                <PartyPopper className="text-purple-600" size={14} /> Culture Hub
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-purple-200/50 text-purple-600 border border-purple-200 flex items-center justify-center shadow-sm rounded-xl">
                                    <Smile size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">12 Birthdays</p>
                                    <p className="text-[9px] text-purple-600 font-bold capitalize">This Month</p>
                                </div>
                            </div>
                        </Card>

                        {/* Official Focus */}
                        <Card className="p-5 bg-blue-50/50 rounded-[2.5rem] border-2 border-blue-200 shadow-sm flex flex-col justify-center text-center">
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 capitalize">Official Work</p>
                            <p className="text-2xl font-bold text-blue-600">8 Deadlines 🔨</p>
                        </Card>

                        {/* Be the Spark */}
                        <Card className="bg-rose-500 rounded-[2.5rem] p-5 text-white relative overflow-hidden flex flex-col justify-center shadow-xl">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold mb-0.5">Host a Moment</h3>
                                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }} className="w-full bg-white text-rose-600 rounded-xl h-9 font-bold text-[10px] tracking-widest border-none hover:bg-white/95 transition-all active:scale-95 capitalize">Create Now</Button>
                            </div>
                            <Sparkles size={50} className="absolute bottom-[-10px] right-[-10px] text-white/5 rotate-[-20deg]" />
                        </Card>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Informal Tab Switcher */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="bg-slate-100/50 p-1.5 rounded-[2rem] flex gap-2 border border-slate-200/50">
                                {[
                                    { id: "all", label: "Everything", icon: <LayoutGrid size={16} /> },
                                    { id: "official", label: "Official Work", icon: <CalendarIcon size={16} /> },
                                    { id: "people", label: "People & Joy", icon: <PartyPopper size={16} /> }
                                ].map(tab => (
                                    <Button
                                        key={tab.id}
                                        variant="ghost"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`h-11 px-6 rounded-2xl font-black text-[10px] tracking-widest transition-all gap-2 capitalize ${activeTab === tab.id ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </Button>
                                ))}
                            </div>

                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-all" size={18} />
                                <Input
                                    placeholder="Find magic moments..."
                                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-900 focus:ring-4 focus:ring-purple-50 transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content Grid */}
                        <ScrollArea className="flex-1 -mx-4 px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.length === 0 ? (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center">
                                            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                <SearchX size={48} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-300 tracking-tight">No magic moments found</h3>
                                            <p className="text-slate-400 font-bold mt-2">Try searching for something else or create one!</p>
                                        </motion.div>
                                    ) : (
                                        filteredItems.map((item, idx) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <Card className={`group relative rounded-[2.5rem] border-none overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] h-full flex flex-col ${item.itemType === 'celebration' ? 'bg-gradient-to-br from-rose-50 to-amber-50' : 'bg-white border-2 border-slate-100 shadow-sm'
                                                    }`}>
                                                    {/* Top Accents */}
                                                    {item.itemType === 'celebration' ? (
                                                        <div className="absolute top-4 right-4 h-12 w-12 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-500 shadow-sm rotate-3 group-hover:rotate-12 transition-transform">
                                                            {item.category === 'Birthday' ? <Cake size={24} /> : <Gift size={24} />}
                                                        </div>
                                                    ) : (
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                                    )}

                                                    <CardContent className="p-8 flex flex-col h-full">
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <Badge className={`border-none font-black text-[10px] capitalize tracking-[0.2em] px-3 py-1 rounded-lg ${item.itemType === 'celebration' ? 'bg-rose-500 text-white' : 'bg-indigo-50 text-indigo-600'
                                                                }`}>
                                                                {item.category}
                                                            </Badge>
                                                            {item.itemType === 'event' && (
                                                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-lg">{(item as Event).eventType}</Badge>
                                                            )}
                                                        </div>

                                                        <h3 className="text-lg font-black text-slate-900 leading-[1.2] mb-3 group-hover:text-purple-600 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs font-bold text-slate-400 mb-8 line-clamp-3 leading-relaxed italic">
                                                            “{item.description}”
                                                        </p>

                                                        <div className="mt-auto space-y-4">
                                                            <div className="flex items-center gap-4 text-slate-500 font-bold bg-white/40 p-3 rounded-2xl border border-slate-100/50">
                                                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-500">
                                                                    <CalendarIcon size={18} />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span suppressHydrationWarning className="text-slate-900 leading-none mb-1">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                                                    <span className="text-[10px] tracking-widest">{item.time}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 text-slate-500 font-bold bg-white/40 p-3 rounded-2xl border border-slate-100/50">
                                                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-rose-500">
                                                                    {item.itemType === 'event' && (item as Event).eventType === 'Virtual' ? <Video size={18} /> : <MapPin size={18} />}
                                                                </div>
                                                                <span className="text-slate-900 leading-tight truncate">{item.location}</span>
                                                            </div>
                                                        </div>

                                                        {/* Interaction Footer */}
                                                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="flex -space-x-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                                                                        <Users size={14} className="text-slate-300" />
                                                                    </div>
                                                                ))}
                                                                <div className="h-9 w-9 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">
                                                                    +{item.attendees}
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                {item.itemType === 'celebration' ? (
                                                                    <Button
                                                                        onClick={() => handleLike(item.id, (item as any).employeeName)}
                                                                        className={`rounded-2xl h-11 px-5 border-none transition-all active:scale-90 font-black text-[10px] tracking-widest gap-2 ${likedItems[item.id] ? 'bg-rose-500 text-white shadow-lg' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                                                                    >
                                                                        {likedItems[item.id] ? <MessageCircleHeart size={16} /> : <Heart size={16} />}
                                                                        {likedItems[item.id] ? 'Wished!' : 'Send Wish'}
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        onClick={() => toggleRegistration(item.id)}
                                                                        className={`rounded-2xl h-11 px-5 border-none transition-all active:scale-90 font-black text-[10px] tracking-widest gap-2 ${(item as Event).registered ? 'bg-emerald-500 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                                                    >
                                                                        {(item as Event).registered ? <Check size={16} /> : <Plus size={16} />}
                                                                        {(item as Event).registered ? 'Joined' : 'Join'}
                                                                    </Button>
                                                                )}
                                                                {item.itemType === 'event' && (
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" className="h-11 w-11 rounded-2xl bg-slate-50 text-slate-400 hover:bg-white hover:shadow-md transition-all">
                                                                                <Edit size={16} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-xl p-2 font-bold min-w-[160px]">
                                                                            <DropdownMenuItem className="rounded-xl px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-600" onClick={() => handleEdit(item as Event)}>
                                                                                <Edit size={14} className="mr-3" /> Edit Event
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="rounded-xl px-4 py-3 hover:bg-emerald-50 cursor-pointer text-emerald-600" onClick={() => { setSelectedEvent(item as Event); setIsRSVPSheetOpen(true); }}>
                                                                                <Users2 size={14} className="mr-3" /> Manage RSVPs
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Event Form Modal - Vibrant Update */}
                    <Dialog open={isCreateDialogOpen} onOpenChange={(val) => { if (!val) resetForm(); setIsCreateDialogOpen(val); }}>
                        <DialogContent className="max-w-5xl p-0 overflow-hidden border-2 border-slate-300 rounded-[3rem] shadow-3xl bg-white" style={{ zoom: "67%" }}>
                            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-10 text-white">
                                <DialogHeader>
                                    <div className="flex items-center gap-6 mb-2">
                                        <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                                            <Plus size={32} />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-3xl font-bold tracking-tighter text-white">
                                                {selectedEvent ? "Transform Event" : "Birth a New Moment"}
                                            </DialogTitle>
                                            <DialogDescription className="text-white/40 font-medium text-xs tracking-widest mt-2 capitalize">Spread joy across the organization</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <ScrollArea className="max-h-[70vh]">
                                <div className="p-10 space-y-10">
                                    {/* Horizontal Grid for Metadata */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Left Side: Branding & Type */}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">The Headline</Label>
                                                <Input
                                                    placeholder="Make it catchy! e.g. Pizza Friday 🍕"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="h-16 border-slate-300 bg-slate-50/50 rounded-2xl px-6 font-black text-lg text-slate-900 focus:ring-4 focus:ring-purple-50 transition-all shadow-inner"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">Vibe Category</Label>
                                                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                                        <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                            {categories.map(cat => <SelectItem key={cat} value={cat} className="rounded-xl my-1">{cat}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">The Format</Label>
                                                    <Select value={formData.eventType} onValueChange={(v) => setFormData({ ...formData, eventType: v as any })}>
                                                        <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                            <SelectItem value="Virtual" className="rounded-xl my-1">Digital Hangout</SelectItem>
                                                            <SelectItem value="In-Person" className="rounded-xl my-1">IRL / Meatspace</SelectItem>
                                                            <SelectItem value="Hybrid" className="rounded-xl my-1">Mixed Reality</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Logistics */}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">The Spot (Link or Venue)</Label>
                                                <Input
                                                    placeholder="Where's the party at?"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    className="h-16 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">Launch Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={formData.date}
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                        className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">Countdown Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={formData.time}
                                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                                        className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Width Description Area */}
                                    <div className="space-y-4 border-t border-slate-300 pt-10">
                                        <Label className="text-xs font-black text-slate-400 tracking-widest ml-1">What's the hype about?</Label>
                                        <Textarea
                                            placeholder="Sell the experience..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="h-32 border-slate-300 bg-slate-50/50 rounded-[2rem] p-6 font-bold text-sm leading-relaxed focus:ring-4 focus:ring-purple-50 resize-none shadow-inner"
                                        />
                                    </div>
                                </div>
                            </ScrollArea>

                            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-14 px-8 font-black text-slate-400 text-[10px] capitalize tracking-[0.2em] hover:text-slate-600">Cancel</Button>
                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] h-14 px-12 font-black text-xs tracking-widest shadow-xl shadow-indigo-100 flex-1">
                                    Let's Go! 🚀
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Attendee Sheet - Vibrant Update */}
                    <Sheet open={isRSVPSheetOpen} onOpenChange={setIsRSVPSheetOpen}>
                        <SheetContent side="right" className="w-[520px] p-0 border-l-none shadow-3xl flex flex-col bg-white">
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 text-white">
                                <SheetHeader>
                                    <div className="h-14 w-14 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center text-amber-300 mb-6 border border-white/20 shadow-2xl">
                                        <Users2 size={24} />
                                    </div>
                                    <SheetTitle className="text-3xl font-bold text-white leading-none tracking-tighter">The Guest List</SheetTitle>
                                    <SheetDescription className="text-white/40 font-medium text-[10px] capitalize tracking-[0.3em] mt-2">Who's joining the hype train?</SheetDescription>
                                </SheetHeader>
                            </div>

                            <div className="p-10 flex-col flex-1">
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1 capitalize">Confirmed</p>
                                        <p className="text-3xl font-black text-indigo-600">{selectedEvent?.attendees || 0}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 text-center">
                                        <p className="text-[10px] font-black text-emerald-400 tracking-widest mb-1 capitalize">My Status</p>
                                        <p className="text-3xl font-black text-emerald-600">{selectedEvent?.registered ? "Going" : "Deciding"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Active RSVPs</h3>
                                    <ScrollArea className="h-[400px]">
                                        <div className="space-y-4 pr-4 pb-10">
                                            {["Aman Gupta", "Sneha Reddy", "Rajesh Kumar", "Priya Singh", "Vikram Shah"].map((at, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-indigo-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                            {at.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-base font-black text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{at}</span>
                                                            <span className="text-[10px] font-black text-slate-400 mt-2 tracking-widest">Excited to join! ✨</span>
                                                        </div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
                                                        <Share2 size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div >
        </div >
    );
};

export default EventsPage;
