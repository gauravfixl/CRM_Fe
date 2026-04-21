"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Megaphone,
    Bell,
    Star,
    PartyPopper,
    Calendar,
    Filter,
    Pin,
    PinOff,
    Clock,
    Building2,
    Users,
    Award,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    CheckCheck,
    X,
    Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { useToast } from "@/shared/components/ui/use-toast";

type Announcement = {
    id: number;
    title: string;
    category: string;
    priority: string;
    date: string;
    author: string;
    pinned: boolean;
    read: boolean;
    bookmarked: boolean;
    preview: string;
    body: string;
};

const initialAnnouncements: Announcement[] = [
    { id: 1, title: "Annual Company Offsite — Goa 2026", category: "Event", priority: "High", date: "2026-04-19", author: "HR Team", pinned: true, read: false, bookmarked: false,
        preview: "Save the date — July 18-20, 2026. Bookings open next week with full travel & stay covered by the company.",
        body: "Save the date — July 18-20, 2026. Bookings open next week with full travel & stay covered by the company.\n\nAgenda includes team-building activities, strategy sessions with leadership, cultural performances, and the annual awards ceremony. Registration link will be shared by HR on Monday.\n\nDietary preferences and accessibility needs can be noted during registration. Spouses are welcome on day 3 (optional, self-funded travel).\n\nFor any queries, reach out to hr-offsite@company.com." },
    { id: 2, title: "Q1 Results & All-Hands Meeting", category: "Company", priority: "High", date: "2026-04-18", author: "CEO Office", pinned: true, read: false, bookmarked: false,
        preview: "Join us this Friday at 4 PM IST for the Q1 review and strategic roadmap for Q2. Attendance mandatory.",
        body: "Join us this Friday at 4 PM IST for the Q1 review and strategic roadmap for Q2. Attendance mandatory.\n\nAgenda:\n• Q1 financial performance\n• Product & engineering updates\n• People & culture highlights\n• Q2 strategic priorities\n• Open Q&A with leadership\n\nLink to the Zoom webinar will be emailed 30 minutes before the session. If you are on PTO or in a conflicting meeting, the recording will be available on the intranet by Monday." },
    { id: 3, title: "New Hybrid Work Policy Effective May 1", category: "Policy", priority: "High", date: "2026-04-15", author: "People Ops", pinned: false, read: true, bookmarked: true,
        preview: "Updated hybrid policy rolls out May 1. Review the new flexibility framework and team-day guidelines.",
        body: "Updated hybrid policy rolls out May 1. Review the new flexibility framework and team-day guidelines.\n\nKey changes:\n• Minimum 3 days in office per week\n• Wednesdays are mandatory team-days for all functions\n• Remote-first roles unaffected\n• WFH cap extended to 10 days/quarter for emergencies\n\nPolicy document is available in Documents → Company Policies. Acknowledge the policy via the HR portal by April 30." },
    { id: 4, title: "Employee Appreciation Week — April 25-30", category: "Event", priority: "Medium", date: "2026-04-14", author: "Culture Team", pinned: false, read: false, bookmarked: false,
        preview: "A week full of games, rewards, and surprises. Nominate your peers for Spotlight Awards.",
        body: "A week full of games, rewards, and surprises. Nominate your peers for Spotlight Awards.\n\nEvents:\n• Monday — Treasure hunt (floor-wise)\n• Tuesday — Potluck lunch\n• Wednesday — Talent show\n• Thursday — Mental health workshop\n• Friday — Awards night + DJ\n\nNominations for Spotlight Awards open today. Submit via the culture portal." },
    { id: 5, title: "Medical Insurance Renewal", category: "Benefits", priority: "Medium", date: "2026-04-10", author: "HR Ops", pinned: false, read: true, bookmarked: false,
        preview: "Group medical cover renewed with ₹5L family floater. New cards arriving by email by month-end.",
        body: "Group medical cover renewed with ₹5L family floater. New cards arriving by email by month-end.\n\nCoverage highlights:\n• Base sum insured: ₹5L family floater\n• Top-up option: ₹10L additional (self-paid)\n• Pre-existing diseases covered from day 1\n• OPD limit: ₹20,000/year\n• Maternity: ₹75,000\n\nE-cards will be issued via the insurer portal. A walkthrough session is scheduled for April 22." },
    { id: 6, title: "Diwali Bonus Announcement", category: "Payroll", priority: "Medium", date: "2026-04-05", author: "Finance", pinned: false, read: true, bookmarked: false,
        preview: "Festive bonus confirmed for all full-time employees. Payout in October payroll cycle.",
        body: "Festive bonus confirmed for all full-time employees. Payout in October payroll cycle.\n\nBonus structure: One month's basic salary, pro-rated based on joining date (minimum 6 months of service required).\n\nTax implications: Bonus is fully taxable. TDS will be deducted in the October payroll. For tax planning, consider additional 80C investments before September 30." },
    { id: 7, title: "Office Renovation — Floor 3", category: "Facilities", priority: "Low", date: "2026-04-02", author: "Admin", pinned: false, read: true, bookmarked: false,
        preview: "Floor 3 will be under renovation April 22-28. Affected teams relocate to Floor 5 temporarily.",
        body: "Floor 3 will be under renovation April 22-28. Affected teams relocate to Floor 5 temporarily.\n\nRenovation scope: New workstations, collaborative zones, and upgraded AV. Noise and dust expected — teams can opt for WFH during this period (exception to hybrid policy).\n\nLogistics: Please pack personal items by April 21 evening. Labels will be provided. Admin team will handle movement." },
];

const categoryColors: Record<string, string> = {
    Company: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Policy: "bg-rose-50 text-rose-700 border-rose-200",
    Event: "bg-amber-50 text-amber-700 border-amber-200",
    Benefits: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Payroll: "bg-blue-50 text-blue-700 border-blue-200",
    Facilities: "bg-slate-100 text-slate-600 border-slate-200",
};

const categoryIcons: Record<string, any> = {
    Company: Building2,
    Policy: Award,
    Event: PartyPopper,
    Benefits: Star,
    Payroll: Award,
    Facilities: Users,
};

const priorityDot: Record<string, string> = {
    High: "bg-rose-500",
    Medium: "bg-amber-500",
    Low: "bg-slate-400",
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

type ViewTab = "all" | "unread" | "bookmarked";

export default function MyAnnouncementsPage() {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [filter, setFilter] = useState("all");
    const [tab, setTab] = useState<ViewTab>("all");
    const [detailOpen, setDetailOpen] = useState<Announcement | null>(null);

    const unreadCount = announcements.filter(a => !a.read).length;
    const bookmarkedCount = announcements.filter(a => a.bookmarked).length;

    let filtered = announcements;
    if (tab === "unread") filtered = filtered.filter(a => !a.read);
    if (tab === "bookmarked") filtered = filtered.filter(a => a.bookmarked);
    if (filter !== "all") filtered = filtered.filter(a => a.category === filter);

    const pinned = filtered.filter(a => a.pinned);
    const regular = filtered.filter(a => !a.pinned);

    const openDetail = (a: Announcement) => {
        setAnnouncements(prev => prev.map(x => x.id === a.id ? { ...x, read: true } : x));
        setDetailOpen({ ...a, read: true });
    };

    const toggleBookmark = (id: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const item = announcements.find(a => a.id === id);
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
        toast({ title: item?.bookmarked ? "Bookmark removed" : "Bookmarked", description: item?.title || "" });
        if (detailOpen?.id === id) setDetailOpen({ ...detailOpen, bookmarked: !detailOpen.bookmarked });
    };

    const togglePin = (id: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
        toast({ title: "Updated", description: "Pin status changed." });
    };

    const markAllRead = () => {
        setAnnouncements(announcements.map(a => ({ ...a, read: true })));
        toast({ title: "All caught up", description: `${unreadCount} announcement${unreadCount !== 1 ? "s" : ""} marked as read.` });
    };

    const shareAnnouncement = (a: Announcement) => {
        toast({ title: "Link copied", description: "Announcement link copied to clipboard." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 flex-wrap">
                            My Announcements
                            {unreadCount > 0 && <Badge className="bg-rose-50 text-rose-700 border-rose-200 border">{unreadCount} unread</Badge>}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Company updates, events, and policy changes</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {unreadCount > 0 && (
                            <Button onClick={markAllRead} variant="outline" className="rounded-lg h-10"><CheckCheck size={14} className="mr-2" />Mark all read</Button>
                        )}
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-slate-400" />
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[160px] h-10 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.keys(categoryColors).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total", value: announcements.length, icon: Megaphone, color: "indigo" },
                        { label: "Unread", value: unreadCount, icon: Bell, color: "rose" },
                        { label: "Bookmarked", value: bookmarkedCount, icon: Bookmark, color: "amber" },
                        { label: "This Week", value: announcements.filter(a => new Date(a.date) > new Date(Date.now() - 7 * 86400000)).length, icon: Calendar, color: "emerald" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <CardContent className="p-2 flex gap-1">
                        {([
                            { id: "all" as ViewTab, label: "All", count: announcements.length },
                            { id: "unread" as ViewTab, label: "Unread", count: unreadCount },
                            { id: "bookmarked" as ViewTab, label: "Bookmarked", count: bookmarkedCount },
                        ]).map(t => (
                            <Button key={t.id} variant={tab === t.id ? "default" : "ghost"} onClick={() => setTab(t.id)} className={tab === t.id ? "bg-indigo-600 text-white rounded-lg" : "text-slate-600 rounded-lg"}>
                                {t.label} <Badge className={`ml-2 ${tab === t.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"} border-none text-[10px]`}>{t.count}</Badge>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                {pinned.length > 0 && (
                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Pin className="text-amber-500" size={18} />
                                Pinned
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                                {pinned.map(a => {
                                    const CatIcon = categoryIcons[a.category] || Megaphone;
                                    return (
                                        <motion.div key={a.id} variants={itemVariants}>
                                            <div onClick={() => openDetail(a)} className="group p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md transition-all cursor-pointer">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                                                        <CatIcon className="text-amber-600" size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {!a.read && <span className={`w-2 h-2 rounded-full ${priorityDot[a.priority]}`} />}
                                                                <h3 className="font-bold text-slate-900">{a.title}</h3>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Badge className={`${categoryColors[a.category]} border text-[10px] font-semibold`}>{a.category}</Badge>
                                                                <Button size="sm" variant="ghost" onClick={(e) => toggleBookmark(a.id, e)} className="h-7 w-7 p-0">
                                                                    {a.bookmarked ? <BookmarkCheck size={14} className="text-amber-600 fill-amber-500" /> : <Bookmark size={14} className="text-slate-400" />}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{a.preview}</p>
                                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                                                            <span className="flex items-center gap-1"><Users size={10} /> {a.author}</span>
                                                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="text-slate-400 group-hover:text-indigo-600 transition-all shrink-0" size={16} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Megaphone className="text-indigo-600" size={18} />
                            All Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-slate-100">
                            {regular.map(a => {
                                const CatIcon = categoryIcons[a.category] || Megaphone;
                                return (
                                    <motion.div key={a.id} variants={itemVariants}>
                                        <div onClick={() => openDetail(a)} className={`group p-5 hover:bg-slate-50 transition-all cursor-pointer ${!a.read ? "bg-indigo-50/30" : ""}`}>
                                            <div className="flex items-start gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                    <CatIcon className="text-indigo-600" size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {!a.read && <span className={`w-2 h-2 rounded-full ${priorityDot[a.priority]}`} />}
                                                            <h3 className={`${a.read ? "font-semibold" : "font-bold"} text-slate-900`}>{a.title}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Badge className={`${categoryColors[a.category]} border text-[10px] font-semibold`}>{a.category}</Badge>
                                                            <Button size="sm" variant="ghost" onClick={(e) => toggleBookmark(a.id, e)} className="h-7 w-7 p-0">
                                                                {a.bookmarked ? <BookmarkCheck size={14} className="text-amber-600 fill-amber-500" /> : <Bookmark size={14} className="text-slate-400" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{a.preview}</p>
                                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                                                        <span className="flex items-center gap-1"><Users size={10} /> {a.author}</span>
                                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="text-slate-400 group-hover:text-indigo-600 transition-all shrink-0" size={16} />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {regular.length === 0 && pinned.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <Megaphone size={40} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">
                                        {tab === "unread" ? "All caught up! 🎉" : tab === "bookmarked" ? "No bookmarked announcements yet" : "No announcements in this category"}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!detailOpen} onOpenChange={v => !v && setDetailOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                    {detailOpen && (() => {
                        const CatIcon = categoryIcons[detailOpen.category] || Megaphone;
                        return (
                            <>
                                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                <CatIcon className="text-indigo-600" size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge className={`${categoryColors[detailOpen.category]} border text-[10px] font-semibold`}>{detailOpen.category}</Badge>
                                                    <Badge className={`border text-[10px] font-semibold ${detailOpen.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : detailOpen.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>{detailOpen.priority} Priority</Badge>
                                                    {detailOpen.pinned && <Badge className="bg-amber-50 text-amber-700 border-amber-200 border text-[10px] font-semibold"><Pin size={9} className="mr-1" />Pinned</Badge>}
                                                </div>
                                                <h2 className="text-xl font-bold text-slate-900">{detailOpen.title}</h2>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                                                    <span className="flex items-center gap-1"><Users size={11} /> {detailOpen.author}</span>
                                                    <span className="flex items-center gap-1"><Clock size={11} /> {new Date(detailOpen.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => setDetailOpen(null)} className="h-8 w-8 p-0 shrink-0"><X size={16} /></Button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="prose prose-sm max-w-none">
                                        {detailOpen.body.split("\n\n").map((para, i) => (
                                            <p key={i} className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3">{para}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 p-4 flex items-center gap-2 flex-wrap">
                                    <Button onClick={(e) => toggleBookmark(detailOpen.id, e)} variant="outline" className="rounded-lg">
                                        {detailOpen.bookmarked ? <><BookmarkCheck size={14} className="mr-2 text-amber-600 fill-amber-500" />Bookmarked</> : <><Bookmark size={14} className="mr-2" />Bookmark</>}
                                    </Button>
                                    <Button onClick={(e) => togglePin(detailOpen.id, e)} variant="outline" className="rounded-lg">
                                        {detailOpen.pinned ? <><PinOff size={14} className="mr-2" />Unpin</> : <><Pin size={14} className="mr-2" />Pin</>}
                                    </Button>
                                    <Button onClick={() => shareAnnouncement(detailOpen)} variant="outline" className="rounded-lg">
                                        <Share2 size={14} className="mr-2" /> Share
                                    </Button>
                                    <Button onClick={() => setDetailOpen(null)} className="ml-auto bg-indigo-600 hover:bg-indigo-700 rounded-lg">Close</Button>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
