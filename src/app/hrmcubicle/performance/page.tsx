"use client"

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Clock,
  BarChart3,
  Plus,
  ArrowUpRight,
  Search,
  ChevronRight,
  Zap,
  MessageSquare,
  ShieldCheck,
  Users,
  Activity,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useMeStore } from "@/shared/data/me-store";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import Link from "next/link";



const PerformanceOverviewPage = () => {
  const { toast } = useToast();
  const { user, performance, addPersonalGoal } = useMeStore();

  const [isNewObjectiveOpen, setIsNewObjectiveOpen] = React.useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = React.useState(false);
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [goalFilter, setGoalFilter] = React.useState('All');
  const [assessment, setAssessment] = React.useState({ reflections: "" });

  const [newGoal, setNewGoal] = React.useState<any>({
    title: "",
    description: "",
    priority: "Medium",
    category: "Technical",
    weightage: 10,
    dueDate: new Date().toISOString().split('T')[0]
  });

  const EmptyState = ({ message, desc, icon: Icon }: { message: string, desc: string, icon: any }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200"
    >
      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
        <Icon size={28} />
      </div>
      <h4 className="text-lg font-bold text-slate-900 tracking-tight">{message}</h4>
      <p className="text-xs text-slate-500 font-semibold max-w-[250px] mt-1">{desc}</p>
    </motion.div>
  );

  const handleCreateGoal = () => {
    if (!newGoal.title) {
      toast({ title: "Error", description: "Goal title is required", variant: "destructive" });
      return;
    }
    addPersonalGoal({
      title: newGoal.title!,
      progress: 0,
      status: "Draft",
      priority: newGoal.priority,
      category: newGoal.category,
      weightage: newGoal.weightage || 10,
      dueDate: newGoal.dueDate!
    });
    setNewGoal({ title: "", description: "", priority: "Medium", category: "Technical", weightage: 10, dueDate: new Date().toISOString().split('T')[0] });
    setIsNewObjectiveOpen(false);
    toast({ title: "Objective Created", description: "Your performance goal has been set." });
  };

  const myGoals = performance?.goals || [];
  const filteredGoals = myGoals.filter((g: any) => {
    if (goalFilter === 'All') return true;
    if (goalFilter === 'Active') return g.status !== 'Completed';
    return g.status === goalFilter;
  });

  const avgProgress = myGoals.length > 0
    ? Math.round(myGoals.reduce((acc: number, g: any) => acc + (g.progress || 0), 0) / myGoals.length)
    : 0;

  const stats = [
    { label: "Overall Score", value: performance.score, trend: "+0.3", icon: Star, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Goals Progress", value: `${avgProgress}%`, trend: "+12%", icon: Target, color: "text-indigo-700", bg: "bg-indigo-50" },
    { label: "Appraisal Status", value: "Ongoing", trend: "Q1 Cycle", icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Feedback Received", value: (performance?.praises || []).length.toString(), trend: "This Week", icon: MessageSquare, color: "text-rose-700", bg: "bg-rose-50" },
  ];

  const menuItems = [
    { id: "goals", title: "Goals & OKRs", desc: "Track objectives and key results", icon: Target, color: "bg-blue-500", path: "/hrmcubicle/performance/goals" },
    { id: "feedback", title: "Continuous Feedback", desc: "Share and receive real-time feedback", icon: MessageSquare, color: "bg-indigo-500", path: "/hrmcubicle/performance/feedback" },
    { id: "reviews", title: "Performance Reviews", desc: "Peer and manager assessment status", icon: Users, color: "bg-purple-500", path: "/hrmcubicle/performance/reviews" },
    { id: "reports", title: "Performance Reports", desc: "Data driven growth analysis", icon: BarChart3, color: "bg-emerald-500", path: "/hrmcubicle/performance/reports" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
      <header className="py-4 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Central</h1>
              <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] tracking-widest h-6 px-3">Growth Hub</Badge>
            </div>
            <p className="text-slate-500 text-sm font-semibold">Measuring excellence, tracking milestones, and enabling professional growth.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
              onClick={() => setIsNewObjectiveOpen(true)}
            >
              <Plus size={16} /> New Objective
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-none ${stat.bg} shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all h-36 flex flex-col justify-between`}>
                <CardContent className="p-7">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl bg-white ${stat.color} shadow-sm`}>
                      <stat.icon size={20} />
                    </div>
                    <Badge className="bg-white text-[9px] font-bold text-slate-500 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-slate-100/50 tracking-widest">
                      <TrendingUp size={11} className="text-emerald-500" /> {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-start">
                    <p className="text-[10px] font-bold text-slate-600 tracking-widest leading-none opacity-75">{stat.label}</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Navigation Hub */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {menuItems.map((item, i) => (
                <Link key={i} href={item.path}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer h-full"
                  >
                    <Card className="h-full border border-slate-100 shadow-sm rounded-3xl bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden text-start">
                      <CardContent className="p-7 space-y-4">
                        <div className={`h-11 w-11 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                          <item.icon size={22} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{item.title}</h3>
                          <p className="text-xs text-slate-500 font-semibold">{item.desc}</p>
                        </div>
                        <div className="pt-2 flex items-center text-indigo-400 font-bold text-[10px] tracking-widest gap-2 group-hover:text-indigo-600 transition-colors">
                          Explore Module <ChevronRight size={14} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Recent Highlights / Pulse */}
            <div className="space-y-6 text-start">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  <Zap className="text-amber-500 h-6 w-6" /> Performance Pulse
                </h2>
                <Link href="/hrmcubicle/performance/reports">
                  <Button
                    variant="ghost"
                    className="text-indigo-600 font-bold text-[10px] tracking-widest hover:bg-slate-50 px-4 h-9 rounded-xl border-none"
                  >
                    View Analytics
                  </Button>
                </Link>
              </div>

              <Card className="border border-slate-100 shadow-sm rounded-3xl bg-white overflow-hidden p-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {(performance?.praises || []).length > 0 ? (
                      (performance.praises).slice(0, 3).map((fb: any, i: number) => (
                        <div key={i} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-md font-bold rounded-xl overflow-hidden">
                            <AvatarFallback className="bg-indigo-50 text-indigo-700">{fb.from[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex justify-between items-center gap-4">
                              <h4 className="text-sm font-bold text-slate-900 font-sans">
                                {fb.from} <span className="text-slate-400 font-semibold">shared appreciation</span>
                              </h4>
                              <span className="text-[10px] text-slate-400 font-bold tracking-widest italic">{fb.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 font-semibold italic border-l-2 border-slate-100 pl-4 py-0.5">"{fb.msg}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10">
                        <EmptyState
                          message="No activity yet"
                          desc="Kudos and shared praises from your team will appear here."
                          icon={Activity}
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Showing latest activity from your professional network</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: Personal Milestones / Widgets */}
          <div className="space-y-8 text-start">
            {/* Rating Card */}
            <Card className="border-none shadow-2xl rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= Math.floor(parseFloat(performance.score)) ? "currentColor" : "none"} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Overall rating</p>
                    <h3 className="text-4xl font-black tracking-tight text-white leading-none">{performance.score} / 5.0</h3>
                  </div>
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{performance.ratingDesc}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Self Review progress</span>
                    <span className="text-lg font-black text-white leading-none">{performance.reviewsDone}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${performance.reviewsDone}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-white hover:text-slate-900 text-white rounded-xl h-12 font-bold transition-all shadow-xl border-none text-[10px] uppercase tracking-widest"
                  onClick={() => setIsAssessmentOpen(true)}
                >
                  Complete Assessment
                </Button>
              </div>
              <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
            </Card>

            {/* Recent Awards */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 italic">Recent recognition</h4>
              <div className="space-y-4">
                {[
                  { label: "Quarterly MVP", date: "Jan 2026", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Top Collaborator", date: "Dec 2025", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`h-11 w-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-inner`}>
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Widget Preview */}
            <div className="p-8 bg-white rounded-3xl border border-slate-100 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
                  <Calendar size={18} />
                </div>
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-widest">Upcoming deadlines</span>
              </div>
              <div className="space-y-5">
                {(performance?.goals || []).slice(0, 2).map((goal, i) => (
                  <div key={i} className="flex gap-4 pl-4 border-l-2 border-indigo-500 group">
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{goal.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Deadline: {goal.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🎯 Detailed Goals Modal */}
      <Dialog open={activeModal === 'goals'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-5xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl text-start font-sans">
          <DialogHeader className="mb-8 text-start">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100">
                <Target size={28} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">Active Objectives</DialogTitle>
                <DialogDescription className="text-slate-500 font-semibold text-base">You have {myGoals.length} key results in the current cycle.</DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl w-fit mt-8 border border-slate-100">
              {['All', 'Active', 'Completed', 'At Risk'].map((f) => (
                <button
                  key={f}
                  onClick={() => setGoalFilter(f)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all ${goalFilter === f
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal: any, i: number) => (
                <Card key={i} className="border-none bg-slate-50/50 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors tracking-tight">{goal.title}</h4>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-white text-slate-500 border-slate-100 font-bold text-[9px] tracking-widest">{goal.category}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest flex items-center gap-2">
                          <Clock size={12} className="text-slate-300" /> End: {goal.dueDate}
                        </span>
                      </div>
                    </div>
                    <Badge className={`${goal.status === 'Ahead' ? 'bg-emerald-50 text-emerald-600' : goal.status === 'At Risk' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'} border-none font-bold text-[10px] tracking-widest px-3 py-1.5`}>
                      {goal.status}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold tracking-widest">
                      <span className="text-slate-400">Completion Progress</span>
                      <span className="text-indigo-600 font-black">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2.5 bg-white rounded-full group-hover:shadow-inner transition-all shadow-sm" />
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-10">
                <EmptyState
                  message={`No ${goalFilter !== 'All' ? goalFilter.toLowerCase() : ''} goals found`}
                  desc="Focus on defining measurable objectives to track your professional growth journey."
                  icon={Target}
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-10 pt-8 border-t border-slate-50">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold border-none text-[11px] tracking-widest transition-all shadow-xl" onClick={() => { setActiveModal(null); setIsNewObjectiveOpen(true); }}>
              <Plus size={18} className="mr-2" /> Define New Objective
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 💬 Continuous Feedback Modal */}
      <Dialog open={activeModal === 'feedback'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-5xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl text-start font-sans">
          <DialogHeader className="mb-8 text-start">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-indigo-100">
                <MessageSquare size={28} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">Wall of Appreciation</DialogTitle>
                <DialogDescription className="text-slate-500 font-semibold text-base">Real-time professional recognition from your professional network.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(performance?.praises || []).length > 0 ? (
              (performance.praises || []).map((fb: any, i: number) => (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i}>
                  <div className="p-6 bg-slate-50/50 rounded-3xl flex items-start gap-5 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                    <Avatar className="h-14 w-14 border-4 border-white shadow-md font-bold text-lg rounded-xl overflow-hidden">
                      <AvatarFallback className="bg-indigo-50 text-indigo-700">{fb.from[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 text-sm">{fb.from}</h4>
                        <span className="text-[10px] text-indigo-400 font-bold tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg italic">{fb.time}</span>
                      </div>
                      <p className="text-slate-600 font-semibold leading-relaxed text-sm italic">
                        <span className="text-2xl opacity-20 mr-1">"</span>
                        {fb.msg}
                        <span className="text-2xl opacity-20 ml-1">"</span>
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge className="bg-white text-slate-400 border-none shadow-sm text-[9px] px-2.5 py-1 uppercase tracking-widest">{fb.icon} Skill Highlight</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-10">
                <EmptyState
                  message="No feedback yet"
                  desc="Collaborative wins and positive shouts will be celebrated here once they start coming in."
                  icon={MessageSquare}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 👥 Performance Reviews Modal */}
      <Dialog open={activeModal === 'reviews'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl text-start">
          <DialogHeader className="mb-8 text-start">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner border border-purple-100">
                <Users size={28} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight uppercase text-slate-900">Review calibration</DialogTitle>
                <DialogDescription className="text-slate-500 font-semibold text-sm">Status of your active 360° feedback and assessment cycles.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { role: "Manager", name: "Siddharth Malhotra", status: "Completed", date: "Jan 15", rating: "4.8" },
              { role: "Peer", name: "Rajesh Kumar", status: "Pending", date: "Jan 30" },
              { role: "Self", name: "Abhinav Singh", status: "In Progress", date: "Jan 25" },
            ].map((rev, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center font-black text-purple-600 shadow-sm border border-slate-100 text-sm">{rev.role[0]}</div>
                  <div className="text-start">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rev.role} review</p>
                    <h5 className="font-extrabold text-slate-900 text-sm uppercase">{rev.name}</h5>
                  </div>
                </div>
                <div className="text-end">
                  <Badge className={`${rev.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : rev.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'} border-none font-bold text-[10px] uppercase tracking-widest px-2.5 py-1`}>
                    {rev.status}
                  </Badge>
                  <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tight italic">Due {rev.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-8 bg-purple-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold shadow-lg shadow-purple-100 border-none uppercase text-[11px] tracking-widest" onClick={() => { setActiveModal(null); setIsAssessmentOpen(true); }}>
            Launch Self-Assessment
          </Button>
        </DialogContent>
      </Dialog>

      {/* 📈 Performance Reports Modal */}
      <Dialog open={activeModal === 'reports'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-3xl text-start">
          <DialogHeader className="mb-8 text-start">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
                <BarChart3 size={28} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight uppercase text-slate-900">Growth analytics</DialogTitle>
                <DialogDescription className="text-slate-500 font-semibold text-base">Long-term performance trends and skill maturation analysis.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 text-slate-900 space-y-3 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600/70">Annualized growth</p>
                <h4 className="text-4xl font-black text-indigo-700 leading-none">+14.2%</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold bg-indigo-600 text-white w-fit px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest">
                  <TrendingUp size={12} /> High Performer
                </div>
              </div>
              <div className="p-8 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 text-slate-900 space-y-3 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/70">Project velocity</p>
                <h4 className="text-4xl font-black text-emerald-700 leading-none">9.6/10</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold bg-emerald-600 text-white w-fit px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest">
                  <Zap size={12} /> Top 2% of Org
                </div>
              </div>
            </div>

            <div className="space-y-6 px-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Skill competency matrix</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "Strategic Leadership", score: 92, color: "bg-indigo-500" },
                  { name: "Operational Efficiency", score: 88, color: "bg-emerald-500" },
                  { name: "Team Mentorship", score: 95, color: "bg-amber-500" },
                  { name: "Crisis Management", score: 82, color: "bg-rose-500" },
                ].map((s, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-700">{s.name}</span>
                      <span className="text-slate-400">{s.score} / 100</span>
                    </div>
                    <Progress value={s.score} className="h-2 bg-slate-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-12 italic">Private & secure encrypted profile data</p>
        </DialogContent>
      </Dialog>

      {/* 🎯 New Objective Dialog */}
      <Dialog open={isNewObjectiveOpen} onOpenChange={setIsNewObjectiveOpen}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-lg shadow-3xl text-start font-sans">
          <DialogHeader className="space-y-5 text-start">
            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-100">
              <Plus size={28} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight uppercase text-slate-900">Define performance goal</DialogTitle>
              <DialogDescription className="font-semibold text-slate-500">Establish a new measurable objective for this cycle.</DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-8 space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Goal identification *</Label>
              <Input
                className="rounded-2xl bg-slate-50 border-none h-14 font-semibold px-5 shadow-sm focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
                placeholder="e.g. Lead the Q2 Security Audit"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Classification</Label>
                <Select value={newGoal.category} onValueChange={v => setNewGoal({ ...newGoal, category: v as any })}>
                  <SelectTrigger className="rounded-2xl bg-slate-50 border-none h-14 px-5 shadow-sm text-sm font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 rounded-xl">
                    <SelectItem value="Technical" className="font-semibold text-xs">TECHNICAL</SelectItem>
                    <SelectItem value="Leadership" className="font-semibold text-xs">LEADERSHIP</SelectItem>
                    <SelectItem value="Soft Skills" className="font-semibold text-xs">SOFT SKILLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Timeline</Label>
                <Input
                  type="date"
                  className="rounded-2xl bg-slate-50 border-none h-14 px-5 shadow-sm text-sm font-semibold"
                  value={newGoal.dueDate}
                  onChange={e => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Impact weightage (%)</Label>
              <Input
                type="number"
                className="rounded-2xl bg-slate-50 border-none h-14 px-5 shadow-sm text-sm font-semibold"
                value={newGoal.weightage}
                onChange={e => setNewGoal({ ...newGoal, weightage: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter className="gap-4 pt-4">
            <Button variant="ghost" className="rounded-xl h-12 font-bold px-8 text-slate-400 hover:text-rose-500 uppercase text-[10px] tracking-widest" onClick={() => { setIsNewObjectiveOpen(false); toast({ title: "Changes Discarded", description: "Goal creation aborted." }); }}>Discard</Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold shadow-xl shadow-indigo-100 border-none uppercase text-[10px] tracking-widest transition-all" onClick={handleCreateGoal}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ⭐ Complete Assessment Dialog */}
      <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
        <DialogContent style={{ zoom: "80%" }} className="bg-white rounded-[2.5rem] border-none p-10 max-w-xl shadow-3xl text-start font-sans">
          <DialogHeader className="space-y-5 text-start">
            <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-amber-100">
              <Star size={32} />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold tracking-tight uppercase text-slate-900">Self-assessment cycle</DialogTitle>
              <DialogDescription className="text-slate-500 font-semibold text-base">Your input is critical for performance calibration and professional growth trajectory.</DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-10 space-y-10">
            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Overall cycle progress</Label>
                <span className="text-xl font-black text-indigo-600">75%</span>
              </div>
              <Progress value={75} className="h-3 bg-slate-50 rounded-full shadow-inner" />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-start block">Reflections on Q1 achievements *</Label>
              <Textarea
                className="rounded-[2rem] bg-slate-50 border-none min-h-[200px] p-8 font-semibold placeholder:text-slate-300 resize-none shadow-inner focus:ring-2 focus:ring-indigo-100 transition-all text-sm leading-relaxed"
                placeholder="Highlight your key contributions, obstacles overcome, and areas where you’ve grown..."
                value={assessment.reflections}
                onChange={(e) => setAssessment({ ...assessment, reflections: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-5">
            <Button variant="outline" className="rounded-xl h-12 font-bold px-10 border-slate-100 text-slate-400 hover:bg-slate-50 uppercase text-[10px] tracking-widest" onClick={() => { setIsAssessmentOpen(false); toast({ title: "Draft Saved", description: "Your reflections are saved locally." }); }}>Save Draft</Button>
            <Button className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-12 font-bold shadow-xl border-none uppercase text-[10px] tracking-widest transition-all" onClick={() => {
              setIsAssessmentOpen(false);
              toast({ title: "Assessment Submitted", description: "Your self-review has been queued for manager calibration." });
            }}>Confirm Submission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default PerformanceOverviewPage;
