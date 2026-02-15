"use client"

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Megaphone,
    Pin,
    Clock,
    Eye,
    Send,
    MoreHorizontal,
    Plus,
    Trash2,
    Edit,
    X,
    MessageSquare,
    CheckCircle2,
    Target,
    Filter,
    ArrowUpRight,
    Building2,
    ShieldCheck,
    Cake,
    PartyPopper,
    Zap,
    ThumbsUp,
    Heart,
    Smile,
    Search,
    ChevronRight,
    Sparkles,
    Trophy,
    Flame,
    TrendingUp,
    Rocket
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore, type Announcement, type EmployeeCelebration } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

const AnnouncementsPage = () => {
    const { announcements, celebrations, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useEngageStore();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState("Active");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<any>({
        title: "",
        content: "",
        author: "HR Admin",
        priority: "Medium",
        pinned: false,
        type: "News",
        status: "Active",
        acknowledgementRequired: false,
        targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] },
    });

    const resetForm = () => {
        setFormData({ title: "", content: "", author: "HR Admin", priority: "Medium", pinned: false, type: "News", status: "Active", acknowledgementRequired: false, targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] } });
        setSelectedAnn(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.content) {
            toast({ title: "Keep it catchy!", description: "A headline and some buzz content is needed.", variant: "destructive" });
            return;
        }

        if (selectedAnn) {
            updateAnnouncement(selectedAnn.id, formData);
            toast({ title: "Pulse Updated", description: "The community will see the new version." });
        } else {
            addAnnouncement(formData);
            toast({
                title: "Live on the Wall!",
                description: "Broadcasted successfully. 🚀",
                className: "bg-indigo-600 text-white font-bold"
            });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleStatusUpdate = (id: string, status: "Active" | "Archived" | "Scheduled") => {
        updateAnnouncement(id, { status });
        toast({ title: `Moved to ${status}` });
    };

    const today = useMemo(() => {
        const d = new Date();
        return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }, []);

    const filteredAnnouncements = announcements
        .filter(a => a.status === activeTab && (a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.content.toLowerCase().includes(searchTerm.toLowerCase())))
        .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

    return (
        <div className="flex flex-col h-full bg-[#fcfdff] overflow-hidden" style={{ zoom: "80%" }}>
            {/* Social Style Header */}
            <div className="px-8 py-10 bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] text-white relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-5%] opacity-10 rotate-12">
                    <Megaphone size={300} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-white/10">Company Buzz</span>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter leading-none">The Pulse of<br />Our Community</h1>
                        <p className="text-white/60 font-medium text-sm max-w-sm">Stay looped in with the latest stories, updates, and wins from across the teams.</p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-2">
                            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-white text-indigo-900 hover:bg-white/90 rounded-2xl h-14 px-8 font-bold text-xs tracking-widest shadow-2xl border-none">
                                <Plus className="mr-2 h-5 w-5" /> Start a Post
                            </Button>
                        </div>
                        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-white/40">Impressions</p>
                                <p className="text-lg font-bold text-amber-400">2.4k+</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-white/40">Engagement</p>
                                <p className="text-lg font-bold text-emerald-400">88%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Insights Hub - Horizontal Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Hot Buzz Row */}
                        <Card className="p-5 rounded-[2.5rem] border-2 border-indigo-200 shadow-sm bg-indigo-50 overflow-hidden relative group">
                            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-2 mb-3 capitalize">
                                <Rocket className="text-orange-500" size={14} /> Hot Buzz
                            </h2>
                            <ScrollArea className="h-24">
                                <div className="space-y-2 pr-4">
                                    {celebrations.filter(c => c.date === today).map((c, i) => (
                                        <div key={i} className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl text-white flex items-center gap-3">
                                            <div className="h-7 w-7 bg-white/20 rounded-lg flex items-center justify-center">
                                                {c.type === 'Birthday' ? <Cake size={12} /> : <Trophy size={12} />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold truncate">{c.employeeName}</p>
                                                <p className="text-[8px] text-white/60 truncate">{c.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {celebrations.filter(c => c.date === today).length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-24 text-slate-300">
                                            <Smile size={32} strokeWidth={1} className="mb-2 opacity-20" />
                                            <p className="text-[10px] font-bold italic">No celebrations today</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>

                        {/* Culture Stats Row */}
                        <Card className="p-5 rounded-[2.5rem] border-2 border-purple-200 shadow-sm bg-purple-50 flex flex-col justify-center">
                            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-2 mb-3 capitalize">
                                <Sparkles className="text-purple-500" size={14} /> Culture Stats
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-rose-100/60 rounded-2xl text-center border border-rose-200/50 shadow-sm">
                                    <span className="text-lg font-bold text-rose-700 leading-none">12.8k</span>
                                    <p className="text-[8px] font-bold text-rose-400 tracking-widest mt-1 capitalize">Hearts</p>
                                </div>
                                <div className="p-3 bg-indigo-100/60 rounded-2xl text-center border border-indigo-200/50 shadow-sm">
                                    <span className="text-lg font-bold text-indigo-700 leading-none">442</span>
                                    <p className="text-[8px] font-bold text-indigo-400 tracking-widest mt-1 capitalize">Talks</p>
                                </div>
                            </div>
                        </Card>

                        {/* Lead the Buzz Row */}
                        <Card className="bg-[#1e1b4b] rounded-[2.5rem] p-5 text-white overflow-hidden relative group shadow-xl flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold mb-0.5">Lead the Buzz</h3>
                                <p className="text-[9px] text-white/40 mb-3 line-clamp-1 italic">Got something exciting to share?</p>
                                <Button onClick={() => setIsDialogOpen(true)} className="w-full bg-white text-indigo-900 font-bold text-[10px] tracking-widest rounded-xl h-9 hover:bg-white/90 transition-all active:scale-95 capitalize">Create Post</Button>
                            </div>
                            <Megaphone size={60} className="absolute bottom-[-10px] right-[-10px] text-white/5 rotate-[-20deg]" />
                        </Card>
                    </div>

                    {/* Main Feed Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <Tabs defaultValue="Active" value={activeTab} onValueChange={setActiveTab} className="h-10 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 flex">
                            <TabsList className="bg-transparent border-none gap-2">
                                <TabsTrigger value="Active" className="rounded-lg px-6 h-full font-black text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg">Feed</TabsTrigger>
                                <TabsTrigger value="Scheduled" className="rounded-lg px-6 h-full font-black text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg">Queue</TabsTrigger>
                                <TabsTrigger value="Archived" className="rounded-lg px-6 h-full font-black text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg">Vault</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative group w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <Input
                                placeholder="Search the buzz..."
                                className="h-10 pl-10 rounded-xl border-slate-200 bg-white font-bold text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Announcement Grid - Now 2 columns for better horizontal flow */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredAnnouncements.map((ann, idx) => (
                                <motion.div
                                    key={ann.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={`group relative rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden ${ann.status === 'Archived' ? 'opacity-70 bg-slate-50' : ''} ${ann.pinned ? 'border-indigo-200 ring-4 ring-indigo-50' : ''}`}>
                                        <CardContent className="p-4 px-5">
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-inner ${ann.type === 'Policy' ? 'bg-rose-50 text-rose-500' : ann.type === 'Celebration' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                                        {ann.type === 'Policy' ? <ShieldCheck size={20} /> : ann.type === 'Celebration' ? <PartyPopper size={20} /> : <TrendingUp size={20} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors italic">{ann.title}</h3>
                                                            {ann.pinned && <Pin size={10} className="text-indigo-600 fill-indigo-600" />}
                                                        </div>
                                                        <p className="text-[9px] font-bold text-slate-400 tracking-wider mt-1">{ann.author} • {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl p-1 shadow-xl border-none font-bold">
                                                        <DropdownMenuItem onClick={() => updateAnnouncement(ann.id, { pinned: !ann.pinned })}>
                                                            <Pin size={12} className="mr-2" /> {ann.pinned ? 'Unpin' : 'Pin'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateAnnouncement(ann.id, { status: ann.status === 'Active' ? 'Archived' : 'Active' })}>
                                                            <Clock size={12} className="mr-2" /> {ann.status === 'Active' ? 'Archive' : 'Restore'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteAnnouncement(ann.id)} className="text-rose-500">
                                                            <Trash2 size={12} className="mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 mb-4">
                                                <p className="text-xs font-bold text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
                                                    {ann.content}
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Eye size={10} />
                                                        <span className="text-[9px] font-bold">{ann.views}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Target size={10} />
                                                        <span className="text-[9px] font-bold">{ann.targetAudience.departments[0]}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                        <Heart size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50">
                                                        <Smile size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Post Creation Modal - Vibrant */}
            <Dialog open={isDialogOpen} onOpenChange={(val) => { if (!val) resetForm(); setIsDialogOpen(val); }}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden border-2 border-slate-300 rounded-[3rem] shadow-3xl bg-white" style={{ zoom: "67%" }}>
                    <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 p-10 text-white">
                        <DialogHeader>
                            <div className="flex items-center gap-6 mb-2">
                                <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                                    <Megaphone size={32} />
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-bold tracking-tighter text-white">Create a Splash</DialogTitle>
                                    <DialogDescription className="text-white/40 font-medium text-xs tracking-widest mt-2">&ldquo;Words that move the mission adelante&rdquo;</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-10 space-y-10">
                            {/* Main Form Fields - Horizontal Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Column: Meta Details */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">The Headline</Label>
                                        <Input
                                            placeholder="Make it bold. Make it buzz."
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="h-16 border-slate-300 bg-slate-50/50 rounded-2xl px-6 font-black text-lg text-slate-900 focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Buzz Category</Label>
                                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                                <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                    <SelectItem value="News" className="rounded-xl my-1">Corporate News</SelectItem>
                                                    <SelectItem value="Policy" className="rounded-xl my-1">Security Update</SelectItem>
                                                    <SelectItem value="Event" className="rounded-xl my-1">Event Note</SelectItem>
                                                    <SelectItem value="Celebration" className="rounded-xl my-1">Winning Moment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Urgency</Label>
                                            <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                                                <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                    <SelectItem value="Low">Standard</SelectItem>
                                                    <SelectItem value="Medium">Crucial</SelectItem>
                                                    <SelectItem value="High">Emergency</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Narrative */}
                                <div className="space-y-4 flex flex-col h-full">
                                    <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">The Narrative</Label>
                                    <Textarea
                                        placeholder="Tell the story..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="flex-1 min-h-[160px] border-slate-300 bg-slate-50/50 rounded-[2rem] p-6 font-bold text-sm leading-relaxed focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Bottom Section: Settings Switches */}
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-900 leading-none">Pin to Wall</p>
                                        <p className="text-[10px] font-bold text-slate-400">Keep it visible at the top</p>
                                    </div>
                                    <Switch checked={formData.pinned} onCheckedChange={(v) => setFormData({ ...formData, pinned: v })} />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-900 leading-none">Require Ack</p>
                                        <p className="text-[10px] font-bold text-slate-400">Employees must acknowledge</p>
                                    </div>
                                    <Switch checked={formData.acknowledgementRequired} onCheckedChange={(v) => setFormData({ ...formData, acknowledgementRequired: v })} />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 font-black text-slate-400 text-[10px] tracking-wider hover:text-slate-600">Discard</Button>
                        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] h-14 px-12 font-black text-xs tracking-widest shadow-xl flex-1">
                            Deploy Broadcast 🚀
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AnnouncementsPage;
