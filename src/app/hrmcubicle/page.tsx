"use client"

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  DollarSign,
  Heart,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Bell,
  Calendar,
  ArrowUpRight,
  Search,
  AlertCircle,
  Clock,
  UserPlus,
  FileCheck,
  ChevronRight,
  Activity,
  ArrowRight,
  CreditCard,
  Target,
  Smile,
  Zap,
  LayoutDashboard,
  Check,
  X,
  Sparkles,
  Megaphone,
  UserCheck
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

// ZUSTAND STORES
import { useTeamStore } from "@/shared/data/team-store";
import { useHireStore } from "@/shared/data/hire-store";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { useEngageStore } from "@/shared/data/engage-store";
import { useInboxStore } from "@/shared/data/inbox-store";
import { useMeStore } from "@/shared/data/me-store";
import { useAttendanceStore } from "@/shared/data/attendance-store";

// Professional UI Constants
const CARD_RADIUS = "rounded-2xl";

const HRAdminDashboard = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Dialog States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // --- 1. DATA HOOKS ---
  const { members, addMember } = useTeamStore();
  const { logs: attendance } = useAttendanceStore();
  const { jobs, candidates } = useHireStore();
  const { payRuns } = usePayrollStore();
  const { surveys, recognitions, announcements } = useEngageStore();
  const { approvals, approveRequest, rejectRequest } = useInboxStore();
  const { user } = useMeStore();

  // --- 2. DERIVED ANALYTICS ---
  const metrics = useMemo(() => {
    const headcount = (members || []).length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = (attendance || []).filter(a => a.date === todayStr);

    const presentToday = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late' || a.status === 'Half Day').length;
    const onLeaveToday = todayAttendance.filter(a => a.status === 'On Leave').length;
    const absentToday = headcount > 0 ? Math.max(0, headcount - presentToday - onLeaveToday) : 0;

    // Mock data for ERP specifics
    const newJoinersThisMonth = 4;
    const exitsThisMonth = 1;
    const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;

    const latestPayRun = payRuns.find(r => r.status === 'Draft' || r.status === 'Processing') || payRuns[0];
    const openRoles = jobs.filter(j => j.workflowStatus === 'Active').length;

    return {
      headcount,
      presentToday,
      onLeaveToday,
      absentToday,
      newJoinersThisMonth,
      exitsThisMonth,
      openRoles,
      payrollSpend: latestPayRun?.totalNetPay || 0,
      engagementScore: 8.4,
      pendingApprovals
    };
  }, [members, attendance, payRuns, jobs, approvals]);

  // Chart Data
  const funnelData = useMemo(() => [
    { name: 'Applied', value: candidates.length, fill: '#6366f1' },
    { name: 'Screen', value: candidates.filter(c => c.stage === 'Screening').length, fill: '#818cf8' },
    { name: 'Interview', value: candidates.filter(c => c.stage === 'Interview').length, fill: '#a5b4fc' },
    { name: 'Offer', value: candidates.filter(c => c.stage === 'Offer').length, fill: '#c7d2fe' },
    { name: 'Hired', value: candidates.filter(c => c.stage === 'Hired').length, fill: '#10b981' },
  ], [candidates]);

  // --- 3. DYNAMIC DATA HELPERS ---
  const currentMonth = new Date().getMonth();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentDay = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const YEARLY_HOLIDAYS: Record<number, any[]> = {
    0: [ // January
      { date: "Jan 01", name: "New Year Celebration", emoji: "✨", type: "Full Day", color: "bg-blue-500" },
      { date: "Jan 14", name: "Makar Sankranti", emoji: "🪁", type: "Culture", color: "bg-amber-500" },
      { date: "Jan 26", name: "Republic Day", emoji: "🇮🇳", type: "Gazetted", color: "bg-orange-500" },
    ],
    1: [ // February (Upcoming)
      { date: "Feb 14", name: "Valentine's Day", emoji: "💝", type: "Event", color: "bg-rose-500" },
      { date: "Feb 19", name: "Chhatrapati Shivaji Jayanti", emoji: "🚩", type: "Regional", color: "bg-orange-500" },
    ],
    2: [ // March
      { date: "Mar 14", name: "Holi Festival", emoji: "🎨", type: "Cultural", color: "bg-pink-500" },
      { date: "Mar 31", name: "Eid-ul-Fitr", emoji: "🌙", type: "Gazetted", color: "bg-emerald-500" },
    ],
    7: [ // August
      { date: "Aug 15", name: "Independence Day", emoji: "🇮🇳", type: "Gazetted", color: "bg-orange-500" },
      { date: "Aug 25", name: "Janmashtami", emoji: "🦚", type: "Optional", color: "bg-indigo-500" },
    ],
    9: [ // October
      { date: "Oct 02", name: "Gandhi Jayanti", emoji: "👓", type: "Gazetted", color: "bg-blue-500" },
      { date: "Oct 20", name: "Dussehra", emoji: "🏹", type: "Full Day", color: "bg-red-500" },
    ],
    10: [ // November
      { date: "Nov 01", name: "Diwali", emoji: "🪔", type: "Gazetted", color: "bg-amber-500" },
      { date: "Nov 15", name: "Guru Nanak Jayanti", emoji: "🙏", type: "Optional", color: "bg-orange-500" },
    ],
    11: [ // December
      { date: "Dec 25", name: "Christmas", emoji: "🎄", type: "Gazetted", color: "bg-rose-500" },
    ]
  };

  const currentMonthHolidays = YEARLY_HOLIDAYS[currentMonth] || [
    { date: "N/A", name: "No Holidays Scheduled", emoji: "📅", type: "Rest Month", color: "bg-slate-400" }
  ];

  const payrollHistory = [
    { month: 'Sep', amount: 3800000 },
    { month: 'Oct', amount: 4100000 },
    { month: 'Nov', amount: 3950000 },
    { month: 'Dec', amount: 4500000 },
    { month: 'Jan', amount: metrics.payrollSpend },
  ];

  const attendanceTrends = [
    { day: 'Mon', present: 88, late: 5 },
    { day: 'Tue', present: 94, late: 2 },
    { day: 'Wed', present: 92, late: 4 },
    { day: 'Thu', present: 95, late: 1 },
    { day: 'Fri', present: 85, late: 8 },
  ];

  const deptData = [
    { name: 'Engineering', value: 35, fill: '#6366f1' },
    { name: 'Product', value: 20, fill: '#10b981' },
    { name: 'Marketing', value: 25, fill: '#f59e0b' },
    { name: 'Sales', value: 20, fill: '#f43f5e' },
  ];

  const bdays = [
    { name: "Aditya Singh", date: "Jan 25", avatar: "AS", dept: "Engineering", color: "bg-blue-100 text-blue-600" },
    { name: "Sneha Kapoor", date: "Jan 28", avatar: "SK", dept: "HR", color: "bg-rose-100 text-rose-600" },
    { name: "Rohan Gupta", date: "Feb 02", avatar: "RG", dept: "Sales", color: "bg-emerald-100 text-emerald-600" },
  ];

  // --- Dynamic Filtering for Smart Alerts ---
  const { todayEvents, upcomingEvents } = useMemo(() => {
    const today = new Date();
    const currentDayNum = today.getDate();
    const currentMonthNum = today.getMonth();

    const todayEventsList: any[] = [];
    const upcomingEventsList: any[] = [];

    // Filter Holidays
    const monthHolidays = YEARLY_HOLIDAYS[currentMonthNum] || [];
    monthHolidays.forEach(h => {
      const hDay = parseInt(h.date.split(' ')[1]);
      if (hDay === currentDayNum) {
        todayEventsList.push({ ...h, type: 'Holiday' });
      } else if (hDay > currentDayNum) {
        upcomingEventsList.push({ ...h, type: 'Holiday' });
      }
    });

    // Filter Birthdays
    bdays.forEach(b => {
      const bMonth = b.date.split(' ')[0];
      const bDay = parseInt(b.date.split(' ')[1]);
      const monthShort = today.toLocaleString('default', { month: 'short' });

      if (bMonth === monthShort) {
        if (bDay === currentDayNum) {
          todayEventsList.push({ ...b, type: 'Birthday' });
        } else if (bDay > currentDayNum) {
          upcomingEventsList.push({ ...b, type: 'Birthday' });
        }
      } else if (upcomingEventsList.length < 5) {
        // Simple logic for next month bdays if needed
        upcomingEventsList.push({ ...b, type: 'Birthday' });
      }
    });

    return {
      todayEvents: todayEventsList,
      upcomingEvents: upcomingEventsList.sort((a, b) => parseInt(a.date.split(' ')[1]) - parseInt(b.date.split(' ')[1]))
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- 3. ACTIONS ---
  const handleApprove = (id: string, name: string) => {
    approveRequest(id, "Admin");
    toast.success(`Request from ${name} successfully approved.`);
  };

  const handleReject = (id: string) => {
    rejectRequest(id, "Rejected via Dashboard");
    toast.error("Request has been declined.");
  };

  const handleSendWishes = () => {
    toast.success("Greetings Sent! Your wishes have been broadcasted.");
  };

  const handleAcknowledge = () => {
    toast.success("Notice Sent! You have acknowledged the celebration.");
  };

  const closeModal = () => setActiveModal(null);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'employee': setActiveModal('add-employee'); break;
      case 'job': setActiveModal('add-job'); break;
      case 'announcement': setActiveModal('add-announcement'); break;
      case 'payroll': setActiveModal('run-payroll'); break;
      default: break;
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc] p-6 pb-12 space-y-7 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 capitalize tracking-wide">
            <LayoutDashboard size={12} />
            <span>Dashboard</span>
            <ChevronRight size={10} />
            <span className="text-indigo-600">Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 font-medium text-xs">Management hub for <span className="text-slate-900 font-bold">{metrics.headcount} team members</span> and HR operations.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl border-none shadow-sm font-bold text-[11px] bg-white px-5 text-slate-600 hidden sm:flex">
            <Calendar size={14} className="mr-2 text-slate-400" />
            {currentDay}
          </Button>
          <Button
            onClick={() => setActiveModal('quick-menu')}
            className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md border-none px-6 gap-2.5 transition-all active:scale-95 group"
          >
            <UserPlus size={16} className="group-hover:translate-x-0.5 transition-transform" /> Quick Action
          </Button>
        </div>
      </header>

      {/* 🎊 SMART CELEBRATION BANNER (Dynamic Today) */}
      <AnimatePresence>
        {todayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 p-[1px] shadow-xl shadow-indigo-100/50"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-[23px] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 animate-bounce">
                  <Sparkles size={24} />
                </div>
                <div className="text-start">
                  <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] mb-1.5 uppercase tracking-widest">Happening Today</Badge>
                  <div className="flex flex-wrap gap-3">
                    {todayEvents.map((ev, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {ev.type === 'Birthday' ? (
                          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                            <span className="text-lg">🎂</span>
                            <span className="text-[13px] font-bold text-slate-800">It's {ev.name}'s Birthday!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                            <span className="text-lg">{ev.emoji}</span>
                            <span className="text-[13px] font-bold text-slate-800">{ev.name} ({ev.type})</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-slate-200 font-bold text-[11px] text-slate-600 hover:bg-slate-50 relative z-20 pointer-events-auto"
                  onClick={handleSendWishes}
                >
                  Send Wishes
                </Button>
                <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
                <p className="text-[10px] font-bold text-slate-400 capitalize bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  Celebrate the moments that matter.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📊 ERP KEY METRICS (Top Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Employees", value: metrics.headcount, sub: "Total workforce", icon: Users, theme: "indigo", color: "bg-indigo-100/50 border-indigo-200", iconBg: "bg-white", iconColor: "text-indigo-700", url: "/hrmcubicle/organization/employees" },
          { label: "Present Today", value: metrics.presentToday, sub: `${Math.round((metrics.presentToday / metrics.headcount) * 100)}% Capacity`, icon: UserCheck, theme: "emerald", color: "bg-emerald-100/50 border-emerald-200", iconBg: "bg-white", iconColor: "text-emerald-700", url: "/hrmcubicle/time-attendance/attendance" },
          { label: "On Leave", value: metrics.onLeaveToday, sub: "Scheduled absences", icon: Calendar, theme: "amber", color: "bg-amber-100/50 border-amber-200", iconBg: "bg-white", iconColor: "text-amber-700", url: "/hrmcubicle/time-attendance/leave" },
          { label: "New Joiners", value: metrics.newJoinersThisMonth, sub: "This month", icon: UserPlus, theme: "blue", color: "bg-blue-100/50 border-blue-200", iconBg: "bg-white", iconColor: "text-blue-700", url: "/hrmcubicle/my-team/members" },
          { label: "Pending Approvals", value: metrics.pendingApprovals, sub: "Action required", icon: Activity, theme: "rose", color: "bg-rose-100/50 border-rose-200", iconBg: "bg-white", iconColor: "text-rose-700", url: "/hrmcubicle/my-team/requests" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(stat.url)}
            className="cursor-pointer"
          >
            <Card className={`${CARD_RADIUS} shadow-sm border ${stat.color} hover:shadow-md transition-all group overflow-hidden`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${stat.iconBg} ${stat.iconColor} group-hover:scale-110 shadow-sm border border-slate-50`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-start">
                  <p className={`text-[11px] font-bold ${stat.iconColor} tracking-wide`}>{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none my-1">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-slate-400 opacity-80">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* 📈 GROWTH ANALYTICS (Full Width to fill horizontal space) */}
      <Card className={`${CARD_RADIUS} shadow-md border border-slate-200 bg-white overflow-hidden`}>
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={18} />
            </div>
            <div className="text-start">
              <CardTitle className="text-base font-bold text-slate-900 tracking-tight">Organization Growth</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400">Monthly headcount & retention trends</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-bold">+12% Headcount</Badge>
            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold">94% Retention</Badge>
          </div>
        </div>
        <CardContent className="p-0 h-[220px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: 'Jul', count: 320, retention: 91 },
              { month: 'Aug', count: 335, retention: 93 },
              { month: 'Sep', count: 350, retention: 92 },
              { month: 'Oct', count: 362, retention: 95 },
              { month: 'Nov', count: 380, retention: 94 },
              { month: 'Dec', count: 410, retention: 96 },
              { month: 'Jan', count: 442, retention: 94 },
            ]}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
              <ReTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🧭 MAIN INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN (8) */}
        <div className="lg:col-span-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ⏱ Attendance Snapshot (ERP Layer) */}
            <Card className={`${CARD_RADIUS} shadow-md overflow-hidden bg-white group h-full flex flex-col border border-slate-200`}>
              <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div className="text-start">
                      <CardTitle className="text-base font-bold text-slate-900 tracking-tight">Attendance Snapshot</CardTitle>
                      <CardDescription className="text-[10px] font-medium text-slate-400">Real-time daily status</CardDescription>
                    </div>
                  </div>
                  <Select defaultValue="all" onValueChange={() => toast.success("Filter Applied: Displaying department-specific metrics.")}>
                    <SelectTrigger className="w-[110px] h-8 text-[10px] font-bold border-slate-200 bg-white shadow-none">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Global</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="prod">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p className="text-[9px] font-bold text-emerald-600 tracking-wider mb-1">Check-ins</p>
                    <h4 className="text-xl font-bold text-emerald-700">{metrics.presentToday}</h4>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                    <p className="text-[9px] font-bold text-amber-600 tracking-wider mb-1">Late</p>
                    <h4 className="text-xl font-bold text-amber-700">4</h4>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                    <p className="text-[9px] font-bold text-rose-600 tracking-wider mb-1">Absent</p>
                    <h4 className="text-xl font-bold text-rose-700">{metrics.absentToday}</h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500">Employee Turnout</span>
                    <span className="text-[11px] font-bold text-indigo-600">{Math.round((metrics.presentToday / metrics.headcount) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(metrics.presentToday / metrics.headcount) * 100}%` }} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-indigo-600 font-bold text-[10px] h-9 border border-indigo-50 hover:bg-indigo-50 rounded-xl"
                  onClick={() => router.push('/hrmcubicle/time-attendance/attendance')}
                >
                  VIEW FULL SUMMARY
                </Button>
              </CardContent>
            </Card>

            {/* 🌴 Leave Overview (ERP Layer) */}
            <Card className={`${CARD_RADIUS} shadow-md overflow-hidden bg-white group h-full flex flex-col border border-slate-200`}>
              <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                      <Heart size={18} />
                    </div>
                    <div className="text-start">
                      <CardTitle className="text-base font-bold text-slate-900 tracking-tight">Leave Overview</CardTitle>
                      <CardDescription className="text-[10px] font-medium text-slate-400">Request pipeline & balances</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-600 border-none text-[9px] font-bold h-6">8 Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col gap-5">
                <div className="space-y-4">
                  {[
                    { label: "Approved Leaves", value: 12, color: "bg-emerald-500", total: 20 },
                    { label: "Rejected Requests", value: 2, color: "bg-rose-500", total: 20 },
                    { label: "Pending Review", value: 6, color: "bg-amber-500", total: 20 },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500">{stat.label}</span>
                        <span className="text-[11px] font-bold text-slate-900">{stat.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.value / stat.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                  <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-amber-700 leading-relaxed">
                    Leave balance alerts: 4 employees have less than 2 days of SL remaining for this quarter.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Departmental Performance Matrix & Composition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`${CARD_RADIUS} shadow-md bg-[#f1f5f9] overflow-hidden border border-slate-200`}>
              <div className="p-2 px-4 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 tracking-tight text-start">Workforce Health</CardTitle>
                  <CardDescription className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5 text-start">Departmental Productivity</CardDescription>
                </div>
              </div>
              <div className="p-0 divide-y divide-slate-50">
                {[
                  { name: 'Engineering', lead: 'Sarah Jenkins', health: 92, count: 18, color: 'bg-indigo-500' },
                  { name: 'Product', lead: 'Mike Chen', health: 88, count: 12, color: 'bg-emerald-500' },
                  { name: 'Marketing', lead: 'Emily Davis', health: 95, count: 15, color: 'bg-amber-500' },
                  { name: 'Sales', lead: 'Rahul Gupta', health: 85, count: 24, color: 'bg-rose-500' },
                ].map((dept, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 px-4 hover:bg-slate-50/50 transition-all group/row cursor-pointer"
                    onClick={() => router.push('/hrmcubicle/my-team/members')}
                  >
                    <div className="flex items-center gap-3 text-start">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover/row:bg-indigo-600 group-hover/row:text-white transition-all text-xs">
                        {dept.name[0]}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-800 tracking-tight">{dept.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 tracking-tight">Staff: {dept.count}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.health}%` }} />
                      </div>
                      <span className="text-[9px] font-bold text-slate-900">{dept.health}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className={`${CARD_RADIUS} shadow-md bg-[#f1f5f9] overflow-hidden border border-slate-200`}>
              <div className="p-3 px-4 border-b border-white/50 flex items-center justify-between bg-white/30">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 tracking-tight text-start">Staff Metrics</CardTitle>
                  <CardDescription className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5 text-start">Live Distribution & OKRs</CardDescription>
                </div>
              </div>
              <CardContent className="p-3 space-y-4">
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ReTooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 🎯 HR OKRs / GOALS */}
                <div className="space-y-3 pt-2 border-t border-slate-200/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-start">Quarterly Goals</span>
                  {[
                    { label: "Talent Acquisition", val: 82, color: "bg-indigo-600" },
                    { label: "Culture Score", val: 94, color: "bg-emerald-600" },
                  ].map((goal, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-600">{goal.label}</span>
                        <span className="text-slate-900">{goal.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${goal.color}`} style={{ width: `${goal.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${CARD_RADIUS} shadow-md bg-white overflow-hidden border border-slate-200`}>
              <div className="p-3 px-4 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 tracking-tight text-start">Recruitment Funnel</CardTitle>
                  <CardDescription className="text-[10px] font-medium text-slate-400 tracking-tight mt-0.5 text-start">Active Pipeline Overview</CardDescription>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-bold">87% Efficiency</Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {funnelData.map((stage, i) => (stage.value > 0 &&
                    <div key={stage.name} className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-slate-500">{stage.name}</span>
                        <span className="text-[10px] font-black text-slate-900">{stage.value}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-md overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stage.value / candidates.length) * 100}%` }}
                          className="h-full rounded-md"
                          style={{ backgroundColor: stage.fill }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingUp size={12} className="text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-700">Hiring velocity is up by 12%</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold leading-tight">Average time to hire this month is reduced to 18 days.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🎭 CULTURE & CELEBRATIONS MOVED HERE TO FILL SPACE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-100 transition-transform hover:scale-110">
                  <Smile size={16} />
                </div>
                <div className="text-start">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">Culture & Celebrations</h2>
                  <p className="text-[9px] text-slate-400 font-bold capitalize tracking-wide mt-1 leading-none">{currentMonthName} Festival Calendar & Team Birthdays</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 tracking-wide capitalize px-0 h-auto"
                onClick={() => router.push('/hrmcubicle/engage/events')}
              >
                View Full Calendar <ChevronRight size={12} className="ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Recognitions (Filling Space) */}
              <Card className={`${CARD_RADIUS} shadow-sm border border-slate-200 bg-white overflow-hidden`}>
                <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                  <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Recognitions</h3>
                    <p className="text-[9px] font-bold text-slate-400">Team shoutouts</p>
                  </div>
                </div>
                <div className="p-0 divide-y divide-slate-50">
                  {recognitions.slice(0, 2).map((rec, i) => (
                    <div key={i} className="p-4 flex gap-4 items-start hover:bg-slate-50/50 transition-all">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-[10px]">{rec.recipient[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-start">
                        <p className="text-[11px] font-bold text-slate-800 leading-snug">
                          <span className="text-indigo-600">{rec.recipient}</span> received <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-md ring-1 ring-amber-100/50">{rec.awardType}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium italic mt-1.5 line-clamp-2">"{rec.reason}"</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                  <button
                    className="text-[10px] font-bold text-indigo-600 flex items-center gap-1.5 hover:underline"
                    onClick={() => router.push('/hrmcubicle/engage/recognitions')}
                  >
                    View Wall of Fame <ArrowRight size={12} />
                  </button>
                </div>
              </Card>

              {/* Monthly Holidays Card */}
              <Card className="border-none shadow-sm bg-indigo-200/40 rounded-3xl overflow-hidden relative group border border-indigo-200/50">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                  <Calendar size={120} />
                </div>
                <CardHeader className="pb-1.5 p-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white text-indigo-600 border border-indigo-100 font-bold text-[9px] px-2.5 py-0.5 tracking-tight shadow-sm capitalize">
                      Upcoming Holidays
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 relative z-10 px-4 pb-4 pt-1">
                  {upcomingEvents.filter(e => e.type === 'Holiday').slice(0, 2).map((holiday, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-indigo-100/30 hover:bg-white transition-all group/item hover:shadow-lg hover:shadow-indigo-500/5">
                      <div className="flex items-center gap-3.5">
                        <div className="h-8 w-8 bg-white text-base flex items-center justify-center rounded-lg shadow-sm border border-indigo-50 transition-transform group-hover/item:scale-110">
                          {holiday.emoji}
                        </div>
                        <div className="text-start">
                          <p className="text-[13px] font-bold text-slate-800 leading-none">{holiday.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-1.5 capitalize tracking-tight">{holiday.date} • Upcoming</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.filter(e => e.type === 'Holiday').length === 0 && (
                    <p className="text-[10px] font-bold text-slate-400 text-center py-4">No upcoming holidays.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Birthdays Card */}
            <Card className="border-none shadow-sm bg-rose-200/40 rounded-3xl overflow-hidden relative group border border-rose-200/50">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Smile size={120} />
              </div>
              <CardHeader className="pb-1.5 p-5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-white text-rose-600 border border-rose-100 font-bold text-[9px] px-2.5 py-0.5 tracking-tight shadow-sm capitalize">
                    Upcoming Birthdays
                  </Badge>
                  <span className="text-[9px] font-bold text-rose-400 capitalize">Next 7 Days</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5 relative z-10 px-5 pb-5 pt-1.5">
                {upcomingEvents.filter(e => e.type === 'Birthday').map((bday, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/60 rounded-xl border border-rose-100/30 hover:bg-white transition-all hover:shadow-lg hover:shadow-rose-500/5 group/bday">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-8 w-8 border-2 border-white shadow-sm transition-transform group-hover/bday:scale-105">
                        <AvatarFallback className={`${bday.color} font-bold text-[10px]`}>{bday.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="text-start">
                        <p className="text-[13px] font-bold text-slate-800 leading-none">{bday.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-1.5 capitalize tracking-tight">{bday.dept} • {bday.date}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-rose-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100">
                      <Sparkles
                        size={14}
                        className="cursor-pointer"
                        onClick={handleAcknowledge}
                      />
                    </Button>
                  </div>
                ))}

                {upcomingEvents.filter(e => e.type === 'Birthday').length === 0 && (
                  <p className="text-[10px] font-bold text-slate-400 text-center py-4">No upcoming birthdays.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN (4) */}
        <div className="lg:col-span-4 space-y-6">

          {/* executive Action Inbox */}
          <Card className={`${CARD_RADIUS} shadow-md flex flex-col bg-[#f1f5f9] overflow-hidden border border-slate-200 min-h-[400px]`}>
            <div className="p-4 bg-indigo-100/40 relative overflow-hidden flex flex-col gap-3 border-b border-slate-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl -mr-12 -mt-12" />

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-indigo-100/50">
                    <Bell size={18} className="text-indigo-600" />
                  </div>
                  <div className="text-start">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-none">Action Inbox</h3>
                    <p className="text-[10px] font-medium text-slate-400 tracking-tight mt-1.5 text-start">Pending approvals</p>
                  </div>
                </div>
                <Badge className="bg-rose-500 text-white border-none font-bold text-[9px] px-2.5 py-1 rounded-lg shadow-md">
                  {metrics.pendingApprovals} Actions
                </Badge>
              </div>

              <div className="flex gap-2.5 relative z-10">
                <button
                  className="text-[10px] font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg transition-all"
                  onClick={() => router.push('/hrmcubicle/my-team/requests')}
                >
                  All Tasks
                </button>
                <button
                  className="text-[10px] font-bold px-4 py-2 bg-white text-slate-400 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all font-sans"
                  onClick={() => router.push('/hrmcubicle/my-team/requests')}
                >
                  View All
                </button>
              </div>
            </div>

            <ScrollArea className="flex-1 bg-slate-50/30">
              <div className="p-4 space-y-4">
                {approvals.filter(a => a.status === 'Pending').length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight text-center">You're All Clear</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 capitalize tracking-tight text-center">No strategic actions required right now.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {approvals.filter(a => a.status === 'Pending').map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-all group/item text-start relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <Badge variant="outline" className={`text-[7px] font-bold py-0.5 px-2 border-none rounded-md 
                              ${item.category === 'Leave' ? 'bg-amber-50 text-amber-600' :
                              item.category === 'Expense' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-indigo-50 text-indigo-600'}`}>
                            {item.category} Request
                          </Badge>
                          <span className="text-[8px] font-bold text-slate-300">12:30 PM</span>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 mb-2 group-hover/item:text-indigo-600 transition-colors leading-relaxed tracking-tight">{item.details.title}</h4>
                        <div className="flex items-center gap-2.5 mb-4">
                          <Avatar className="h-7 w-7 ring-2 ring-slate-50 shadow-sm">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${item.requestedBy.id}`} />
                            <AvatarFallback className="text-[7px] font-bold bg-indigo-50 text-indigo-600">{item.requestedBy.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="text-start">
                            <span className="block text-[9px] font-bold text-slate-700 leading-none">{item.requestedBy.name}</span>
                            <span className="block text-[8px] font-bold text-slate-400 tracking-tight mt-0.5">Direct Report</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold rounded-lg transition-all shadow-md border-none"
                            onClick={() => handleApprove(item.id, item.requestedBy.name)}
                          >
                            <Check size={12} className="mr-1" /> Confirm
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 h-8 border-none bg-slate-50 text-slate-500 hover:text-rose-600 text-[9px] font-bold rounded-lg transition-all"
                            onClick={() => handleReject(item.id)}
                          >
                            <X size={12} className="mr-1" /> Dismiss
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* 🚨 HR Alerts / ERP Control Hub */}
          <Card className={`${CARD_RADIUS} shadow-md bg-white border border-slate-200 overflow-hidden`}>
            <div className="p-4 bg-indigo-50/50 border-b border-indigo-100/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">HR Control Hub</h3>
                <p className="text-[9px] text-indigo-600 font-bold tracking-widest mt-0.5 uppercase">Automated Intelligence</p>
              </div>
              <Activity size={18} className="text-indigo-600" />
            </div>
            <div className="p-4 space-y-3 bg-[#f8fafc]/50">
              <div
                className="bg-indigo-600 rounded-xl p-3 text-white flex items-center justify-between cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                onClick={() => router.push('/hrmcubicle/admin/rules')}
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest">Automation Active</span>
                </div>
                <ChevronRight size={14} />
              </div>

              {[
                { label: "Probation Ending", count: 3, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                { label: "Document Expiry", count: 5, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
                { label: "Birthday Today", count: 1, icon: Smile, color: "text-indigo-500", bg: "bg-indigo-50" },
                { label: "Payroll Lock Date", count: "Feb 05", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                  onClick={() => {
                    const paths: Record<string, string> = {
                      "Probation Ending": "/hrmcubicle/my-team/members",
                      "Document Expiry": "/hrmcubicle/documents",
                      "Birthday Today": "/hrmcubicle/engage/events",
                      "Payroll Lock Date": "/hrmcubicle/payroll/run"
                    };
                    if (paths[alert.label]) router.push(paths[alert.label]);
                    else toast.success(`${alert.label}: View details for ${alert.label}`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${alert.bg} ${alert.color} flex items-center justify-center`}>
                      <alert.icon size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{alert.label}</span>
                  </div>
                  <Badge className="bg-white border text-[10px] font-bold text-slate-600 px-2 py-0.5">{alert.count}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            {/* 🗓 TODAY'S SCHEDULE & INTERVIEWS (Filling Sidebar Space) */}
            <Card className={`${CARD_RADIUS} shadow-md bg-white border border-slate-200 overflow-hidden`}>
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-600" />
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Today's Schedule</span>
                </div>
                <Badge className="bg-indigo-600 text-white text-[8px] font-black rounded-md border-none px-1.5 py-0.5 animate-pulse">LIVE</Badge>
              </div>
              <div className="p-0 divide-y divide-slate-50">
                {[
                  { time: "11:00 AM", title: "Product Sync", dept: "Product", type: "Internal", url: "/hrmcubicle/engage/events" },
                  { time: "02:30 PM", title: "Technical Interview", candidate: "Amit R.", dept: "Engineering", url: "/hrmcubicle/hire/interviews" },
                  { time: "04:00 PM", title: "Budget Review", dept: "Finance", type: "Strategic", url: "/hrmcubicle/payroll" },
                ].map((event, i) => (
                  <div
                    key={i}
                    className="p-3.5 hover:bg-slate-50/50 transition-all flex gap-4 items-center group/evt cursor-pointer"
                    onClick={() => router.push(event.url)}
                  >
                    <div className="text-center w-12 border-r border-slate-100 pr-3">
                      <p className="text-[9px] font-black text-slate-900 leading-none">{event.time.split(' ')[0]}</p>
                      <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">{event.time.split(' ')[1]}</p>
                    </div>
                    <div className="text-start flex-1">
                      <h4 className="text-[11px] font-bold text-slate-800 group-hover/evt:text-indigo-600 transition-colors">{event.title}</h4>
                      <p className="text-[8px] font-bold text-slate-400 mt-0.5">{event.candidate || event.type} • {event.dept}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-200 group-hover/evt:text-indigo-300 transition-all" />
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50/50 flex justify-center border-t border-slate-100">
                <button
                  className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest"
                  onClick={() => router.push('/hrmcubicle/engage/events')}
                >
                  Manage Schedule
                </button>
              </div>
            </Card>

            <div className="space-y-3.5">
              {[
                { name: "Team Overview", desc: "Manage reports & productivity", icon: Users, color: "bg-indigo-600", url: "/hrmcubicle/my-team" },
                { name: "Support Tickets", desc: "Track active helpdesk queries", icon: Zap, color: "bg-emerald-600", url: "/hrmcubicle/helpdesk" },
              ].map((link, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  onClick={() => router.push(link.url)}
                  className="p-3.5 rounded-2xl border border-slate-200 cursor-pointer flex items-center gap-4 transition-all hover:bg-white hover:shadow-lg bg-slate-50 group shadow-sm shadow-slate-200/50"
                >
                  <div className={`h-10 w-10 rounded-xl ${link.color} flex items-center justify-center shadow-lg text-white group-hover:scale-105 transition-transform`}>
                    <link.icon size={18} />
                  </div>
                  <div className="text-start flex-1">
                    <span className="block text-sm font-bold text-slate-800">{link.name}</span>
                    <span className="block text-[10px] text-slate-400 font-bold leading-tight mt-0.5 tracking-wide">{link.desc}</span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center group-hover:shadow-md transition-all">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </motion.div>
              ))}

              {/* 🆕 SYSTEM INTELLIGENCE FEED */}
              <Card className={`${CARD_RADIUS} shadow-md bg-white border border-slate-200 overflow-hidden`}>
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">System Feed</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="p-0 divide-y divide-slate-50">
                  {[
                    { msg: "Payroll period for Jan '26 is now locked.", time: "10m ago", icon: FileCheck, color: "text-emerald-500", url: "/hrmcubicle/payroll" },
                    { msg: "New policy: Work from Anywhere (Summer '26)", time: "1h ago", icon: Megaphone, color: "text-indigo-500", url: "/hrmcubicle/documents" },
                    { msg: "Candidate 'Rohan' moved to Interview stage.", time: "2h ago", icon: UserPlus, color: "text-blue-500", url: "/hrmcubicle/hire/candidates" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-slate-50/50 transition-colors flex gap-3 items-start cursor-pointer group/feed"
                      onClick={() => router.push(item.url)}
                    >
                      <div className={`mt-0.5 ${item.color} group-hover/feed:scale-110 transition-transform`}><item.icon size={12} /></div>
                      <div className="text-start">
                        <p className="text-[10px] font-bold text-slate-700 leading-snug group-hover/feed:text-indigo-600">{item.msg}</p>
                        <span className="text-[8px] font-bold text-slate-400 mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={activeModal === 'quick-menu'} onOpenChange={closeModal}>
        <DialogContent className="rounded-2xl border-none shadow-2xl p-6 bg-white max-w-sm text-start">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Administrative Actions</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">Choose a strategic task to initiate.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              variant="outline"
              className="h-14 justify-start gap-4 px-4 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 group transition-all"
              onClick={() => handleQuickAction('employee')}
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserPlus size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">Onboard Employee</p>
                <p className="text-[10px] text-slate-400 mt-1">Add a new member to the team</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-14 justify-start gap-4 px-4 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 group transition-all"
              onClick={() => handleQuickAction('job')}
            >
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Briefcase size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">Post New Job</p>
                <p className="text-[10px] text-slate-400 mt-1">Start a new recruitment cycle</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-14 justify-start gap-4 px-4 rounded-2xl border border-slate-100 hover:bg-amber-50 hover:border-amber-100 group transition-all"
              onClick={() => handleQuickAction('payroll')}
            >
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <DollarSign size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">Run Payroll</p>
                <p className="text-[10px] text-slate-400 mt-1">Initiate compensation outflow</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-14 justify-start gap-4 px-4 rounded-2xl border border-slate-100 hover:bg-purple-50 hover:border-purple-100 group transition-all"
              onClick={() => handleQuickAction('announcement')}
            >
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Megaphone size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 leading-none">Broadcast Update</p>
                <p className="text-[10px] text-slate-400 mt-1">Share an update with the org</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Form */}
      <Dialog open={activeModal === 'add-employee'} onOpenChange={closeModal}>
        <DialogContent className="rounded-2xl border-none shadow-2xl p-6 bg-white max-w-lg text-start flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Onboard New Team Member</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">Fill in the primary details to start the onboarding flow.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Full Name</Label>
              <Input placeholder="e.g. Rahul Verma" className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Official Email</Label>
              <Input placeholder="rahul.v@company.com" className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Department</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner">
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="prod">Product</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Designation</Label>
              <Input placeholder="Senior Developer" className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs px-8 shadow-md border-none"
              onClick={() => {
                toast.success("Employee onboarding initiated successfully.");
                closeModal();
              }}
            >
              Complete Onboarding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Payroll Dialog */}
      <Dialog open={activeModal === 'run-payroll'} onOpenChange={closeModal}>
        <DialogContent className="rounded-2xl border-none shadow-2xl p-6 bg-white max-w-sm text-start flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Execute Pay Run</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">This will initiate the disbursement for the current cycle.</DialogDescription>
          </DialogHeader>
          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 leading-tight">Attention Required</p>
              <p className="text-[10px] font-medium text-amber-700 mt-1">3 members have pending attendance regularizations. Proceed with current data?</p>
            </div>
          </div>
          <div className="bg-slate-50/80 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 capitalize">Total Net Pay</span>
              <span className="text-lg font-bold text-slate-900 leading-none">₹125.0L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 capitalize">Beneficiaries</span>
              <span className="text-xs font-bold text-slate-700 leading-none">42 Employees</span>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button
              className="w-full bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs h-11 shadow-lg border-none"
              onClick={() => {
                toast.success("Payroll Started: The disbursement process has been initiated.");
                closeModal();
              }}
            >
              Confirm & Execute Disbursement
            </Button>
            <Button variant="ghost" className="w-full rounded-xl font-bold text-xs text-slate-400" onClick={closeModal}>Go Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Job Dialog */}
      <Dialog open={activeModal === 'add-job'} onOpenChange={closeModal}>
        <DialogContent className="rounded-2xl border-none shadow-2xl p-6 bg-white max-w-lg text-start flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create Job Opening</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">Post a new position to attract top talent.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Job Title</Label>
              <Input placeholder="e.g. Senior UX Designer" className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Department</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner">
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="prod">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Employment Type</Label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="full">Full Time</SelectItem>
                  <SelectItem value="part">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Job Description</Label>
              <Textarea placeholder="Key responsibilities and requirements..." className="min-h-[100px] rounded-2xl bg-slate-50 border-none p-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs px-8 shadow-md border-none"
              onClick={() => {
                toast.success("Job Posted: The listing is now live on the careers portal.");
                closeModal();
              }}
            >
              Publish Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Broadcast Dialog */}
      <Dialog open={activeModal === 'add-announcement'} onOpenChange={closeModal}>
        <DialogContent className="rounded-2xl border-none shadow-2xl p-6 bg-white max-w-md text-start flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Organization Broadcast</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">Post an update to the company news feed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Subject</Label>
              <Input placeholder="e.g. Office Holiday Notice" className="h-10 rounded-xl bg-slate-50 border-none px-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 capitalize tracking-wide ml-1">Message Body</Label>
              <Textarea placeholder="Share details here..." className="min-h-[120px] rounded-2xl bg-slate-50 border-none p-4 text-xs font-bold focus:bg-white shadow-inner" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={closeModal}>Discard</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs px-8 shadow-md border-none"
              onClick={() => {
                toast.success("Announcement Posted: Message broadcasted to all employees.");
                closeModal();
              }}
            >
              Broadcast Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default HRAdminDashboard;
