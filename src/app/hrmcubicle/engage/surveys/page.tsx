"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Plus,
    BarChart3,
    Clock,
    Users,
    ChevronRight,
    Search,
    Filter,
    Trash2,
    Send,
    MessageSquare,
    Target,
    Zap,
    PieChart,
    ArrowUpRight,
    CheckSquare,
    SearchX,
    Sparkles,
    Flame,
    Activity,
    Lock,
    Eye,
    Star,
    Rocket,
    MoreHorizontal,
    Edit
} from "lucide-react";
import { useEngageStore, type Survey, type SurveyQuestion } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const SurveysEngagePage = () => {
    const { surveys, addSurvey, updateSurvey, deleteSurvey, addPoints } = useEngageStore();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<Survey["status"]>("Active");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<Partial<Survey>>({
        title: "",
        description: "",
        status: "Active",
        anonymous: true,
        category: "Engagement",
        endDate: "",
        questions: [{ id: "1", type: "MCQ", question: "", required: true, options: ["Option 1", "Option 2"] }],
        targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] }
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", status: "Active", anonymous: true, category: "Engagement", endDate: "", questions: [{ id: "1", type: "MCQ", question: "", required: true, options: ["Option 1", "Option 2"] }], targetAudience: { departments: ["All"], locations: ["All"], roles: ["All"] } });
        setSelectedSurvey(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.endDate) {
            toast({ title: "Incomplete Pulse", description: "Every story needs a headline and a deadline!", variant: "destructive" });
            return;
        }

        if (selectedSurvey) {
            updateSurvey(selectedSurvey.id, formData);
            toast({ title: "Pulse Updated" });
        } else {
            addSurvey(formData as Omit<Survey, "id" | "responses">);
            toast({
                title: "Pulse Launched! 🚀",
                description: "The organization's voice is ready to be heard.",
                className: "bg-emerald-600 text-white font-black"
            });
        }
        setIsCreateDialogOpen(false);
        resetForm();
    };

    const handleAddQuestion = () => {
        const newQuestion: SurveyQuestion = {
            id: String(formData.questions!.length + 1),
            type: "MCQ",
            question: "",
            required: true,
            options: ["Option 1", "Option 2"]
        };
        setFormData({ ...formData, questions: [...formData.questions!, newQuestion] });
    };

    const filteredSurveys = surveys.filter(s =>
        s.status === activeTab &&
        (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-[#fcfdff] overflow-hidden text-start" style={{ zoom: "80%" }}>
            {/* Vibrant Informal Header */}
            <div className="px-8 py-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Activity size={180} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-emerald-300 fill-emerald-300 h-5 w-5" />
                            <span className="text-[10px] font-bold tracking-[0.3em] text-white/80">Voice of the People</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter leading-none mb-3">The Pulse Hub &<br />Sentiment Studio</h1>
                        <p className="text-white/70 font-bold text-sm max-w-md italic">Transforming raw feedback into a better tomorrow, one vote at a time.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[120px]">
                            <p className="text-[10px] font-bold uppercase text-white/60 mb-1">Response rate</p>
                            <p className="text-2xl font-bold text-emerald-300">84% ✨</p>
                        </div>
                        <Button
                            onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}
                            className="bg-white text-emerald-600 hover:bg-white/90 rounded-2xl h-14 px-8 font-bold text-xs tracking-widest shadow-2xl transition-all active:scale-95 border-none"
                        >
                            <Plus className="mr-2 h-5 w-5" /> Launch Poll
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Horizontal Insights Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Sentiment Health Row */}
                        <Card className="p-5 rounded-[2.5rem] border-2 border-emerald-200 shadow-sm flex flex-col justify-center gap-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest capitalize">Sentiment Score</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tighter">4.8</p>
                                </div>
                                <Activity className="text-emerald-500 h-10 w-10" />
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500" />
                            </div>
                        </Card>

                        {/* Hot Pulse Row */}
                        <Card className="p-5 rounded-[2.5rem] border-2 border-teal-200 shadow-sm flex flex-col justify-center">
                            <h2 className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-2 mb-2 capitalize">
                                <Rocket className="text-emerald-600" size={14} /> Hot Pulse
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-200/50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-300">
                                    <Zap size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{surveys[0]?.title || "Monthly Vibe Check"}</p>
                                    <p className="text-[9px] text-emerald-600 font-bold capitalize">Trending Now</p>
                                </div>
                            </div>
                        </Card>

                        {/* Response Metrics Row */}
                        <Card className="p-5 rounded-[2.5rem] border-2 border-indigo-200 shadow-sm flex flex-col justify-center text-center">
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 capitalize">Response Rate</p>
                            <p className="text-2xl font-bold text-indigo-600">84% ✨</p>
                        </Card>

                        {/* Build a Pulse Row */}
                        <Card className="bg-slate-900 rounded-[2.5rem] p-5 text-white relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold mb-1">Build a Pulse</h3>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full bg-white text-slate-900 rounded-xl h-9 font-bold text-[10px] tracking-widest border-none hover:bg-white/95 transition-all capitalize">Start Builder</Button>
                            </div>
                            <Rocket size={60} className="absolute bottom-[-10px] right-[-10px] text-white/5 rotate-[-20deg]" />
                        </Card>
                    </div>

                    {/* Filter & Search Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <Tabs defaultValue="Active" value={activeTab} onValueChange={(v) => setActiveTab(v as Survey["status"])} className="h-12 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 flex">
                            <TabsList className="bg-transparent border-none gap-2">
                                <TabsTrigger value="Active" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg">Live Now 🔥</TabsTrigger>
                                <TabsTrigger value="Draft" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg">Drafting ✍️</TabsTrigger>
                                <TabsTrigger value="Closed" className="rounded-xl px-6 h-full font-black text-[10px] tracking-widest transition-all capitalize data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-lg">Vault ❄️</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative group w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <Input
                                placeholder="Find a pulse..."
                                className="h-12 pl-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-900 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Survey Grid - Full Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                        <AnimatePresence mode="popLayout">
                            {filteredSurveys.map((survey, idx) => (
                                <motion.div
                                    key={survey.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group relative rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-0 h-full flex flex-col">
                                        <div className="bg-emerald-50/50 px-6 py-3 border-b border-emerald-100/20 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Flame size={14} className="text-emerald-600" />
                                                <span className="text-[10px] font-black capitalize tracking-[0.2em] text-emerald-600">{survey.category}</span>
                                            </div>
                                            <Badge className="bg-indigo-500 text-white border-none font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg">+20 Pts</Badge>
                                        </div>

                                        <CardContent className="p-6 flex-col flex-1 flex">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-black text-slate-900 leading-[1.2] group-hover:text-emerald-600 transition-colors italic line-clamp-1">{survey.title}</h3>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-all">
                                                            <MoreHorizontal size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl p-1 border-slate-100 shadow-xl font-bold min-w-[140px]">
                                                        <DropdownMenuItem onClick={() => { setSelectedSurvey(survey); setIsCreateDialogOpen(true); setFormData(survey); }} className="text-slate-600 cursor-pointer rounded-lg">
                                                            <Edit size={14} className="mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateSurvey(survey.id, { status: survey.status === 'Active' ? 'Closed' : 'Active' })} className="text-slate-600 cursor-pointer rounded-lg">
                                                            <Clock size={14} className="mr-2" /> {survey.status === 'Active' ? 'Close' : 'Reactivate'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteSurvey(survey.id)} className="text-rose-500 cursor-pointer rounded-lg focus:text-rose-600 focus:bg-rose-50">
                                                            <Trash2 size={14} className="mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <p className="text-xs font-bold text-slate-400 mb-6 line-clamp-2 leading-relaxed italic">
                                                &ldquo;{survey.description}&rdquo;
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                <div className="flex items-center gap-3 text-slate-500 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <Users size={14} className="text-emerald-500" />
                                                    <span className="text-[11px] text-slate-900 leading-none">{survey.responses} Responses</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-500 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <Clock size={14} className="text-indigo-500" />
                                                    <span className="text-[11px] text-slate-900 leading-none">{new Date(survey.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-center">
                                                <Button onClick={() => { setSelectedSurvey(survey); setIsAnalyticsOpen(true); }} className="w-full rounded-xl h-10 bg-slate-900 text-white font-black text-[10px] capitalize tracking-[0.2em] transition-all hover:bg-slate-800 shadow-md">
                                                    View Insights <ChevronRight size={14} className="ml-1" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Builder Modal - Vibrant */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(val) => { if (!val) resetForm(); setIsCreateDialogOpen(val); }}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden border-2 border-slate-300 rounded-[3rem] shadow-3xl bg-white text-start" style={{ zoom: "67%" }}>
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 text-white">
                        <DialogHeader>
                            <div className="flex items-center gap-6 mb-2">
                                <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                                    <Rocket size={32} />
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-bold tracking-tighter text-white">The Pulse Builder</DialogTitle>
                                    <DialogDescription className="text-white/40 font-medium text-xs tracking-widest mt-2 capitalize">Data-driven, human-focused pulse station</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-10 space-y-10">
                            {/* Horizontal Grid for Survey Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Branding & Timeline */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">The Headline</Label>
                                        <Input
                                            placeholder="Make it snap! e.g. Friday Lunch Poll 🥗"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="h-16 border-slate-300 bg-slate-50/50 rounded-2xl px-6 font-black text-lg text-slate-900 focus:ring-4 focus:ring-emerald-50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Category</Label>
                                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                                <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                    {["Engagement", "Wellness", "Pulse", "Custom"].map(cat => (
                                                        <SelectItem key={cat} value={cat} className="rounded-xl my-1">{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Expires On</Label>
                                            <Input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                                className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: The Context */}
                                <div className="space-y-4 flex flex-col h-full">
                                    <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1">Context</Label>
                                    <Textarea
                                        placeholder="Describe why we are polling..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="flex-1 min-h-[160px] border-slate-300 bg-slate-50/50 rounded-[2rem] p-6 font-bold text-sm leading-relaxed focus:ring-4 focus:ring-emerald-50 resize-none shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Anonymous Security Section */}
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-300 flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                                        <Lock size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900 leading-none">Identity Shield Active</p>
                                        <p className="text-[10px] font-bold text-slate-400">All responses are 100% anonymous by default</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-2 rounded-xl text-[10px] capitalize tracking-widest">Global Security</Badge>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                        <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="h-14 px-8 font-black text-slate-400 text-[10px] capitalize tracking-[0.2em] hover:text-slate-600">Cancel</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] h-14 px-12 font-black text-xs tracking-widest shadow-xl flex-1">
                            Cast the Net 🌐
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Insights Side Drawer */}
            <Sheet open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
                <SheetContent side="right" className="w-[520px] p-0 border-none shadow-3xl bg-white flex flex-col overflow-hidden text-start">
                    <div className="bg-gradient-to-br from-indigo-900 to-emerald-900 p-10 text-white shadow-2xl">
                        <SheetTitle className="text-2xl font-bold tracking-tighter leading-none mb-3 text-white">{selectedSurvey?.title}</SheetTitle>
                        <SheetDescription className="text-white/40 font-medium text-[10px] capitalize tracking-[0.3em]">Snapshot of current sentiment</SheetDescription>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-6 bg-emerald-50/50 border-emerald-100 rounded-[2rem] shadow-sm text-center">
                                    <p className="text-[10px] font-black text-emerald-600 tracking-widest mb-2 capitalize">Positivity Score</p>
                                    <p className="text-3xl font-black text-emerald-700 leading-none">88% ✨</p>
                                </Card>
                                <Card className="p-6 bg-indigo-50/50 border-indigo-100 rounded-[2rem] shadow-sm text-center">
                                    <p className="text-[10px] font-black text-indigo-600 tracking-widest mb-2 capitalize">Time Impact</p>
                                    <p className="text-3xl font-black text-indigo-700 leading-none">2m <span className="text-xs">avg</span></p>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-300 capitalize tracking-[0.3em] ml-1 text-start">Department Split</h4>
                                {[
                                    { d: "Engineering", v: 94 },
                                    { d: "Operations", v: 72 },
                                    { d: "Marketing", v: 88 }
                                ].map((row, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black text-slate-800">{row.d}</span>
                                            <span className="text-[10px] font-black text-emerald-600">{row.v}% Participation</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${row.v}%` }} className="h-full bg-emerald-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="opacity-50" />

                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
                                <h4 className="text-sm font-black flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-500" /> Key Insight
                                </h4>
                                <p className="text-sm font-bold text-white/60 leading-relaxed italic">
                                    &ldquo;Engagement has spiked in the last 24 hours. The team is particularly interested in better documentation tools.&rdquo;
                                </p>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default SurveysEngagePage;
