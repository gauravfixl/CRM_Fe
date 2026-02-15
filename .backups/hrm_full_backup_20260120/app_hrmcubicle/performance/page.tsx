"use client"

import React, { useState } from "react";
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
  Trash2,
  MoreVertical,
  Calendar,
  Edit,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { usePerformanceStore, type Goal } from "@/shared/data/performance-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

const MyPerformancePage = () => {
  const { toast } = useToast();
  const { goals, addGoal, deleteGoal, updateGoal } = usePerformanceStore();
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    dueDate: '',
    description: '',
    progress: 0,
    status: 'On Track' as Goal['status']
  });

  const reviews = [
    { period: 'H2 2025', rating: 4.5, reviewer: 'Drashi Garg', feedback: 'Excellent performance, consistently exceeding expectations.' },
    { period: 'H1 2025', rating: 4.2, reviewer: 'Drashi Garg', feedback: 'Strong technical skills and great team collaboration.' },
  ];

  const stats = [
    { label: "Overall Rating", value: "4.5/5", color: "bg-[#CB9DF0]", icon: <Star className="text-slate-800 h-5 w-5" />, textColor: "text-slate-900" },
    { label: "Goals Completed", value: `${goals.filter(g => g.status === 'Completed').length}/${goals.length}`, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600 h-5 w-5" />, textColor: "text-emerald-900" },
    { label: "Active Goals", value: goals.filter(g => g.status !== 'Completed').length.toString(), color: "bg-[#FFF9BF]", icon: <Target className="text-slate-800 h-5 w-5" />, textColor: "text-slate-900" },
    { label: "Awards", value: "5", color: "bg-[#F0C1E1]", icon: <Award className="text-slate-800 h-5 w-5" />, textColor: "text-slate-900" },
  ];

  const handleAddGoal = () => {
    if (!goalForm.title || !goalForm.dueDate) {
      toast({ title: "Error", description: "Title and Due Date are required", variant: "destructive" });
      return;
    }

    addGoal({
      title: goalForm.title,
      progress: goalForm.progress,
      status: goalForm.status,
      dueDate: goalForm.dueDate,
      description: goalForm.description
    });

    setIsGoalOpen(false);
    setGoalForm({ title: '', dueDate: '', description: '', progress: 0, status: 'On Track' });
    toast({ title: "Goal Added", description: "Commit to your new professional milestone!" });
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Remove this goal?")) {
      deleteGoal(id);
      toast({ title: "Goal Removed" });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Performance</h1>
          <p className="text-slate-500 font-bold italic mt-1">Growth is the only evidence of life.</p>
        </div>

        <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-14 px-10 shadow-xl shadow-purple-100 font-black border-none transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> Define New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter">New Objective</DialogTitle>
              <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                What do you want to achieve this quarter?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-8 py-6">
              <div className="space-y-3">
                <Label className="font-black text-slate-900 text-sm ml-1">Goal Title</Label>
                <Input
                  placeholder="e.g. Master Next.js 14 Server Components"
                  className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                  value={goalForm.title}
                  onChange={e => setGoalForm({ ...goalForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-black text-slate-900 text-sm ml-1">Due Date</Label>
                  <Input
                    type="date"
                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                    value={goalForm.dueDate}
                    onChange={e => setGoalForm({ ...goalForm, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-slate-900 text-sm ml-1">Initial Status</Label>
                  <Select onValueChange={(val) => setGoalForm({ ...goalForm, status: val as any })} defaultValue="On Track">
                    <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                      <SelectItem value="On Track">On Track</SelectItem>
                      <SelectItem value="Ahead">Ahead</SelectItem>
                      <SelectItem value="At Risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="font-black text-slate-900 text-sm ml-1">Description (Optional)</Label>
                <Textarea
                  placeholder="Details about your target..."
                  className="rounded-[1.25rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold p-6 min-h-[120px]"
                  value={goalForm.description}
                  onChange={e => setGoalForm({ ...goalForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
              <Button
                onClick={handleAddGoal}
                className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
              >
                Set Objective
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsGoalOpen(false)}
                className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
              >
                Discard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`rounded-[2.5rem] border-none shadow-sm ${stat.color} p-8 hover:scale-105 transition-all cursor-pointer group`}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/40 rounded-2xl backdrop-blur-md">
                  {stat.icon}
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                <h3 className={`text-4xl font-black ${stat.textColor}`}>{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 pb-10">
        {/* Goals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Target className="h-6 w-6 text-purple-400" /> Current Objectives
            </h2>
            <Badge className="bg-slate-100 text-slate-500 font-bold rounded-lg border-none px-3 h-7">{goals.length}</Badge>
          </div>

          <div className="space-y-4">
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-[2.5rem] border border-slate-50 shadow-sm p-8 hover:bg-slate-50/50 transition-all group relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-xl text-slate-900 group-hover:text-purple-600 transition-colors">{goal.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className={`rounded-xl px-4 h-8 border-none font-black text-[10px] uppercase tracking-widest ${goal.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                goal.status === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {goal.status}
                            </Badge>
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                              <Calendar className="h-3.5 w-3.5" /> Due {goal.dueDate}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 rounded-2xl p-0 transition-opacity">
                              <MoreVertical className="h-5 w-5 text-slate-300" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                            <DropdownMenuItem className="rounded-xl h-11"><Edit className="h-4 w-4 mr-2" /> Update Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="rounded-xl h-11 text-red-600 focus:bg-red-50 focus:text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete Goal</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Execution Progress</span>
                          <span className="text-sm font-black text-slate-900 italic">{goal.progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-indigo-500 rounded-full shadow-lg shadow-indigo-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 px-4">
            <BarChart3 className="h-6 w-6 text-indigo-400" /> Recent Appraisals
          </h2>
          <div className="space-y-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-[2.5rem] border border-slate-50 shadow-sm p-8 bg-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <Badge className="bg-indigo-50 text-indigo-600 border-none font-black px-4 rounded-xl h-9 italic">{review.period}</Badge>
                      <div className="flex items-center gap-1.5 font-black text-xl text-slate-900">
                        {review.rating} <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                    <p className="text-slate-600 font-bold leading-relaxed mb-6 italic text-sm">"{review.feedback}"</p>
                    <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                        {review.reviewer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Reviewer</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight">{review.reviewer}</p>
                      </div>
                    </div>
                  </div>
                  {/* Background decoration */}
                  <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors duration-700"></div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" className="w-full rounded-2xl h-14 font-black text-indigo-600 hover:bg-indigo-50 tracking-tight group">
            View Review History <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Simple Select for the dialog since it was missing in the previous context for this specific file
const Select = ({ children, onValueChange, defaultValue }: any) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        className="w-full rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6 flex justify-between items-center"
      >
        {selected}
      </Button>
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-2xl border-none p-2 z-50 font-bold">
          {React.Children.map(children, child => {
            if (child.type === SelectContent) {
              return React.Children.map(child.props.children, item => (
                <div
                  className="rounded-xl h-11 flex items-center px-4 hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    setSelected(item.props.value);
                    onValueChange(item.props.value);
                    setOpen(false);
                  }}
                >
                  {item.props.children}
                </div>
              ));
            }
          })}
        </div>
      )}
    </div>
  );
};
const SelectTrigger = ({ children }: any) => <>{children}</>;
const SelectValue = ({ children }: any) => <>{children}</>;
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ children, value }: any) => <div value={value}>{children}</div>;
const ChevronRight = ({ className }: any) => <ArrowUpRight className={className} />;

export default MyPerformancePage;
