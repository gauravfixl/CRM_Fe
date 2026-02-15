"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Star,
  Megaphone,
  Plus,
  Search,
  Heart,
  CheckCircle2,
  CalendarCheck,
  Coffee,
  ChevronRight,
  Bell,
  DollarSign,
  FileText,
  Zap,
  Smile,
  MoreHorizontal,
  ArrowUpRight,
  Command,
  X,
  LayoutDashboard,
  PieChart,
  MessageCircle,
  Target,
  LogOut,
  Award,
  Plane
} from "lucide-react";
import {
  PieChart as RePie,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";

import { ME_DATA } from "@/shared/data/me-store";

const chartData = [
  { name: "Mon", hours: 8.5 },
  { name: "Tue", hours: 7.8 },
  { name: "Wed", hours: 9.2 },
  { name: "Thu", hours: 8.0 },
  { name: "Fri", hours: 8.4 },
];

const teamData = [
  { name: "Engineering", value: 45, color: "#6366f1" },
  { name: "Design", value: 20, color: "#a855f7" },
  { name: "Sales", value: 25, color: "#ec4899" },
  { name: "Other", value: 10, color: "#94a3b8" },
];

const HRMDashboardHome = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("Not Clocked In");
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [moodValue, setMoodValue] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize mount to prevent hydration error
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClockToggle = () => {
    const timeStr = formatTime(new Date());
    if (attendanceStatus === "Not Clocked In") {
      setAttendanceStatus("Clocked In");
      setPunchTime(timeStr);
      toast({ title: "Lucky Morning! ☀️", description: `You clocked in at ${timeStr}. Let's make it productive!` });
    } else {
      setAttendanceStatus("Not Clocked In");
      setPunchTime(null);
      toast({ title: "Workday Ended ✨", description: `You clocked out at ${timeStr}. Enjoy your evening!` });
    }
  };

  const navigateTo = (url: string) => {
    setIsGlobalSearchOpen(false);
    router.push(url);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] text-slate-900 relative overflow-hidden pb-12">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-slate-200 px-8 py-4">
        <div className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.refresh()}>
            <div className="h-10 w-10 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <LayoutDashboard className="text-white h-5 w-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">Workspace Hub</h2>
          </div>

          <div className="flex items-center gap-6">
            <div
              className="hidden lg:flex items-center gap-3 px-6 py-2 bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-200 transition-all group"
              onClick={() => setIsGlobalSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-slate-400 group-hover:text-[#6366f1]" />
              <span className="text-sm text-slate-500 font-medium">Type <span className="text-slate-900 font-bold">⌘ K</span> to jump anywhere...</span>
            </div>
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{formatTime(currentTime)}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentTime.toDateString()}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full bg-white border-slate-200" onClick={() => toast({ title: "No new activity", description: "You are all caught up!" })}>
                <Bell className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto p-8 space-y-8"
      >
        {/* Hero Feature */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-2xl bg-[#0f172a] rounded-[3rem] overflow-hidden text-white p-12 relative group h-[340px] flex items-center">
            <div className="relative z-10 max-w-2xl space-y-6 text-start">
              <Badge className="bg-[#6366f1] text-white border-none px-4 py-1.5 font-black text-[10px] tracking-widest uppercase">Management 🏢</Badge>
              <h1 className="text-5xl font-black leading-tight tracking-tighter">
                Good Morning, <span className="text-[#6366f1]">{ME_DATA.user.name.split(' ')[0]}</span>! ☕
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                You have <span className="text-white font-bold">12 Action items</span> across HR modules today. Your team's attendance is at <span className="text-emerald-400 font-bold">94%</span>.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className="bg-[#6366f1] hover:bg-[#5558e6] px-10 py-7 rounded-[1.5rem] font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20" onClick={() => router.push('/hrmcubicle/timeattend/approvals')}>
                  GO TO APPROVALS
                </Button>
                <Button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-10 py-7 rounded-[1.5rem] font-black text-lg transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm" onClick={() => setIsLeaveModalOpen(true)}>
                  APPLY LEAVE
                </Button>
              </div>
            </div>
            {/* 3D-like Icon Decoration */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 h-64 w-64 bg-[#6366f1]/20 rounded-full blur-[100px] group-hover:bg-[#6366f1]/30 transition-colors" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-24 hidden xl:block"
            >
              <div className="h-48 w-48 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 flex flex-col items-center justify-center text-center shadow-inner">
                <TrendingUp className="h-12 w-12 text-[#6366f1] mb-4" />
                <p className="text-3xl font-black">92%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Mood</p>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 items-start">

          {/* Left Column (Activities & Charts) */}
          <div className="lg:col-span-8 space-y-8">

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Present", val: "22", icon: <Users />, color: "text-indigo-600", bg: "bg-indigo-50", url: "/hrmcubicle/timeattend/attendance" },
                { label: "On Leave", val: "03", icon: <Plane />, color: "text-amber-600", bg: "bg-amber-50", url: "/hrmcubicle/timeattend/leave" },
                { label: "Approvals", val: "12", icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50", url: "/hrmcubicle/timeattend/approvals" },
                { label: "Rewards", val: "450", icon: <Award />, color: "text-purple-600", bg: "bg-purple-50", url: "/hrmcubicle/engage/rewards" }
              ].map((kpi, i) => (
                <motion.div key={i} variants={itemVariants} onClick={() => router.push(kpi.url)}>
                  <Card className="border-none shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer group">
                    <CardContent className="p-6 text-start">
                      <div className={`h-12 w-12 rounded-2xl mb-4 flex items-center justify-center ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                        {React.cloneElement(kpi.icon as React.ReactElement, { className: "h-6 w-6" })}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.val}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Attendance Chart */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm h-[320px] p-8">
                <div className="flex justify-between items-center mb-6 text-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black">My Work Hours</CardTitle>
                    <CardDescription className="text-xs font-medium">Tracking your logged hours vs targets for current week.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-slate-200">WEEKLY</Badge>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity Feed (Consolidated Record) */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm overflow-hidden text-start">
                <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center justify-between text-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black">Pulse Record</CardTitle>
                    <CardDescription className="text-xs">Summary of your workspace interactions.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#6366f1] font-bold uppercase text-[10px] tracking-widest">View History</Button>
                </CardHeader>
                <CardContent className="p-0">
                  {[
                    { title: "Shift Logged", meta: "Today, 09:15 AM", type: "Time", icon: <Clock className="text-blue-600" />, desc: "Successfully punched in through Workspace Hub web component." },
                    { title: "Leave Approved", meta: "Yesterday, 04:30 PM", type: "Me", icon: <Heart className="text-rose-600" />, desc: `Your request for 2 days Casual Leave (Feb 12-14) was approved by ${ME_DATA.user.reportingTo.name}.` },
                    { title: "Praise Received", meta: "2 Days ago", type: "Engage", icon: <Star className="text-amber-600" />, desc: "Sana Khan mentioned you: 'Excellent work on the payroll automation flow!'" }
                  ].map((act, i) => (
                    <div key={i} className="flex gap-6 p-8 border-b border-slate-50 last:border-none group cursor-pointer hover:bg-slate-50/30 transition-all text-start" onClick={() => toast({ title: act.title, description: "Viewing record details..." })}>
                      <div className="h-10 w-10 shrink-0 rounded-full border border-slate-100 bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {act.icon}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h4 className="font-black text-slate-800 tracking-tight">{act.title}</h4>
                          <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-full bg-slate-900 group-hover:bg-[#6366f1] transition-colors">{act.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{act.desc}</p>
                        <p className="text-[10px] text-slate-400 font-bold italic">{act.meta}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column (Widgets) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Attendance Clock Widget */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm bg-white p-8 group relative overflow-hidden text-start">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-0 transition-transform group-hover:scale-110" />
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <Badge className={`${attendanceStatus === 'Clocked In' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border-none font-black px-4`}>
                      {attendanceStatus}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900">
                      {punchTime || "--:--"}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                      Shift Start: 09:00 AM
                    </p>
                  </div>

                  <Button
                    onClick={handleClockToggle}
                    className={`w-full h-14 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95 ${attendanceStatus === 'Clocked In'
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-100'
                        : 'bg-[#6366f1] hover:bg-[#5558e6] text-white shadow-indigo-100'
                      }`}
                  >
                    {attendanceStatus === 'Clocked In' ? 'PUNCH OUT' : 'PUNCH IN'}
                  </Button>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div className="text-start">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Avg Daily</p>
                      <p className="text-sm font-black text-slate-900">8h 45m</p>
                    </div>
                    <div className="text-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Punctuality</p>
                      <p className="text-sm font-black text-emerald-600">94%</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Celebrations */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative group text-start">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-45">
                  <Smile className="h-40 w-40" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4 text-start">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Coffee className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight leading-none">Celebrations</h3>
                      <p className="text-xs text-white/60 font-medium">Coming up this week</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Rahul Sharma", event: "Work Anniversary (4Y)", date: "Today", icon: "🎊" },
                      { name: "Sana Khan", event: "Birthday", date: "Jan 22", icon: "🎂" }
                    ].map((cel, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-4 rounded-2xl hover:bg-white/20 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cel.icon}</span>
                          <div className="text-start">
                            <p className="text-xs font-black">{cel.name}</p>
                            <p className="text-[10px] text-white/50">{cel.event}</p>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-none font-bold text-[10px]">{cel.date}</Badge>
                      </div>
                    ))}
                  </div>

                  <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/10 font-bold gap-2">
                    GREET WITH A CARD <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Teams", icon: <Users />, url: "/hrmcubicle/my-team" },
                { title: "Payroll", icon: <DollarSign />, url: "/hrmcubicle/payroll/dashboard" },
                { title: "Files", icon: <FileText />, url: "/hrmcubicle/documents/hr-docs" },
                { title: "Help", icon: <Zap />, url: "/hrmcubicle/helpdesk" }
              ].map((nav, i) => (
                <Card key={i} className="border-none shadow-sm p-5 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => router.push(nav.url)}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center bg-slate-100 rounded-xl group-hover:scale-110 transition-transform text-slate-400 group-hover:text-[#6366f1]">
                      {React.cloneElement(nav.icon as React.ReactElement, { className: "h-5 w-5" })}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{nav.title}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Feedback Widget */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm p-8 bg-indigo-50 text-start">
                <h4 className="font-black text-slate-800 text-sm mb-2">How's your mood today?</h4>
                <p className="text-xs font-medium text-slate-500 mb-6">Your anonymous feedback helps us improve.</p>
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                  {[
                    { v: 1, e: "😞" },
                    { v: 2, e: "😐" },
                    { v: 3, e: "😊" },
                    { v: 4, e: "🤩" }
                  ].map(mood => (
                    <button
                      key={mood.v}
                      onClick={() => {
                        setMoodValue(mood.v);
                        toast({ title: "Feedback Captured", description: "Your daily mood has been shared anonymously." });
                      }}
                      className={`text-2xl hover:scale-125 transition-transform ${moodValue === mood.v ? 'grayscale-0 scale-125' : 'grayscale opacity-50'}`}
                    >
                      {mood.e}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* Global Search Dialog */}
      <Dialog open={isGlobalSearchOpen} onOpenChange={setIsGlobalSearchOpen}>
        <DialogContent className="max-w-2xl bg-white/90 backdrop-blur-xl border-none shadow-2xl p-0 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <Input
                placeholder="Jump to modules, employees or records..."
                className="h-16 pl-14 text-xl font-bold bg-slate-100/50 border-none rounded-3xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="bg-white px-2 py-1 rounded-lg text-xs font-black shadow-sm text-slate-400">ESC</kbd>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Top Suggestions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "My Performance", url: "/hrmcubicle/performance", color: "bg-indigo-50 text-indigo-600" },
                  { name: "Team Attendance", url: "/hrmcubicle/my-team/attendance", color: "bg-emerald-50 text-emerald-600" },
                  { name: "Salary Processing", url: "/hrmcubicle/payroll/processing", color: "bg-amber-50 text-amber-600" },
                  { name: "Org Chart", url: "/hrmcubicle/organization/chart", color: "bg-purple-50 text-purple-600" }
                ].filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                  <div key={i} onClick={() => navigateTo(item.url)} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-pointer group">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black ${item.color}`}>
                      {item.name.charAt(0)}
                    </div>
                    <span className="font-black text-slate-700 tracking-tight group-hover:text-indigo-600 transition-colors">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-6 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Command className="h-4 w-4 text-slate-300" />
                <span className="text-[10px] font-black text-slate-400">COMMANDS</span>
              </div>
            </div>
            <Button variant="ghost" className="rounded-xl font-bold text-slate-400">VIEW HELP</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-[3rem] p-10">
          <DialogHeader className="text-start space-y-2">
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Request Time Off</DialogTitle>
            <DialogDescription className="font-bold text-slate-500">
              Apply for a leave and wait for manager's approval.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8 py-8">
            <div className="space-y-3">
              <Label className="font-black text-slate-900 text-sm ml-1">Type of Leave</Label>
              <Select defaultValue="casual">
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                  <SelectItem value="casual" className="rounded-xl h-11">Casual Leave (12 left)</SelectItem>
                  <SelectItem value="sick" className="rounded-xl h-11">Sick Leave (10 left)</SelectItem>
                  <SelectItem value="earned" className="rounded-xl h-11">Earned Leave (15 left)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-black text-slate-900 text-sm ml-1">From Date</Label>
                <Input type="date" className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6" />
              </div>
              <div className="space-y-3">
                <Label className="font-black text-slate-900 text-sm ml-1">To Date</Label>
                <Input type="date" className="h-14 rounded-2xl bg-slate-50 border-none font-bold px-6" />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-4 sm:justify-start pt-4">
            <Button className="flex-1 h-14 bg-[#6366f1] hover:bg-[#5558e6] rounded-2xl font-black text-lg transition-transform hover:scale-105" onClick={() => {
              setIsLeaveModalOpen(false);
              toast({ title: "Leave Request Submitted", description: "Your request has been sent for approval." });
            }}>SUBMIT</Button>
            <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-lg text-slate-400" onClick={() => setIsLeaveModalOpen(false)}>CANCEL</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRMDashboardHome;
