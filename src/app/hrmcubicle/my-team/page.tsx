"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { useTeamStore } from "@/shared/data/team-store";
import Link from "next/link";
import { useToast } from "@/shared/components/ui/use-toast";

const TeamOverviewPage = () => {
  const { toast } = useToast();
  const { members, attendance, leaves, approveLeave, rejectLeave } = useTeamStore();

  const activeMembersCount = members.filter(m => m.status === 'Active').length;
  const onLeaveCount = members.filter(m => m.status === 'On Leave').length;
  // Dynamic Attendance Calculation
  const presentTodayCount = attendance.filter(a => a.status === 'Present').length;
  const absentTodayCount = members.length - presentTodayCount - onLeaveCount;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const stats = [
    { label: "Team Size", value: members.length, color: "bg-[#CB9DF0]", icon: <Users className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "Present Today", value: presentTodayCount, color: "bg-emerald-100", icon: <UserCheck className="text-emerald-600" />, textColor: "text-emerald-900" },
    { label: "On Leave", value: onLeaveCount, color: "bg-amber-100", icon: <Calendar className="text-amber-600" />, textColor: "text-amber-900" },
    { label: "Absent Today", value: absentTodayCount, color: "bg-rose-100", icon: <UserX className="text-rose-600" />, textColor: "text-rose-900" },
  ];

  const quickLinks = [
    { title: "Team Members", url: "/hrmcubicle/my-team/members", icon: Users, color: "text-blue-600", iconBg: "bg-blue-200/50", bgColor: "bg-blue-50" },
    { title: "Team Attendance", url: "/hrmcubicle/my-team/attendance", icon: Clock, color: "text-emerald-600", iconBg: "bg-emerald-200/50", bgColor: "bg-emerald-50" },
    { title: "Team Leave", url: "/hrmcubicle/my-team/leave", icon: Calendar, color: "text-amber-600", iconBg: "bg-amber-200/50", bgColor: "bg-amber-50" },
    { title: "Team Performance", url: "/hrmcubicle/my-team/performance", icon: TrendingUp, color: "text-purple-600", iconBg: "bg-purple-200/50", bgColor: "bg-purple-50" },
  ];

  const handleApprove = (id: string, name: string) => {
    approveLeave(id);
    toast({ title: "Leave Approved", description: `Request from ${name} has been approved.` });
  };

  const handleReject = (id: string, name: string) => {
    rejectLeave(id);
    toast({ title: "Leave Rejected", description: `Request from ${name} has been rejected.`, variant: "destructive" });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Team Overview</h1>
          <p className="text-slate-500 font-semibold text-xs mt-2">Manage and monitor your team's performance and activities in real-time.</p>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-none shadow-sm rounded-2xl ${stat.color} p-4 flex items-center gap-3 border border-white/20`}>
              <div className="h-10 w-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
              </div>
              <div>
                <p className={`text-[10px] font-bold tracking-widest ${stat.textColor} opacity-80 mb-1`}>{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.textColor} tracking-tight leading-none`}>{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickLinks.map((link, i) => (
          <Link key={i} href={link.url}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Card className={`border-none shadow-sm hover:shadow-md transition-all rounded-2xl ${link.bgColor} p-5 cursor-pointer group hover:bg-white border border-white/50 h-full`}>
                <div className={`h-11 w-11 ${link.iconBg} ${link.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  <link.icon size={18} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-800 tracking-tight leading-none">{link.title}</h3>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[10px] text-slate-400 mt-2.5 font-medium">Deep dive into {link.title.split(' ')[1].toLowerCase()}</p>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Team Members (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-indigo-50 p-6 border border-indigo-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Team Members</h2>
                <p className="text-[11px] font-bold text-slate-400 tracking-tight leading-none">Overview of current personnel</p>
              </div>
              <Link href="/hrmcubicle/my-team/members">
                <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold cursor-pointer hover:bg-indigo-100 text-[10px] tracking-tight px-3 py-1 transition-colors">
                  View All Personnel
                </Badge>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {members.slice(0, 4).map((member, i) => (
                <motion.div key={member.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-none bg-white p-4 rounded-xl group hover:shadow-lg transition-all border border-white/50">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm bg-indigo-50 text-indigo-600 font-bold text-xs uppercase">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-[14px] font-bold text-slate-900 leading-tight">{member.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">{member.designation}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-slate-400">Department</span>
                        <span className="font-bold text-slate-700">{member.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-slate-400 tracking-tight">Status</span>
                        <Badge className={`${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} border-none font-bold text-[11px] px-2.5 py-0.5 shadow-none`}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Operations (1/3) */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <Card className="border-none shadow-sm rounded-2xl bg-rose-50 p-5 border border-rose-100">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Pending Approvals</h2>
                <p className="text-[10px] font-bold text-slate-400 tracking-tight leading-none">Employee requests</p>
              </div>
              <Badge className="bg-rose-50 text-rose-600 font-bold border-none px-3 py-1 text-[9px] tracking-tight shadow-none">{pendingLeaves.length} Pending</Badge>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {pendingLeaves.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 opacity-40">
                      <Clock size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 tracking-widest">No Action items</p>
                  </motion.div>
                ) : (
                  pendingLeaves.slice(0, 3).map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3.5 bg-slate-50/80 rounded-xl group border border-transparent hover:border-slate-100 transition-all hover:bg-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-50 uppercase">
                            {item.empName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-[13px] leading-none">{item.empName}</h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">{item.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400">{item.days} Day(s)</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-7 px-3 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold text-[10px]" onClick={() => handleReject(item.id, item.empName)}>Reject</Button>
                          <Button size="sm" className="h-7 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px]" onClick={() => handleApprove(item.id, item.empName)}>Approve</Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Alerts Widget */}
          <Card className="border-none shadow-sm rounded-2xl bg-amber-50 p-5 border-t-4 border-t-amber-400 border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="text-amber-500" size={16} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Quick Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <Award className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="font-bold text-indigo-700 text-[12px]">Appraisal Due</h4>
                  <p className="text-[11px] font-medium text-indigo-600 mt-1 opacity-80 leading-relaxed">2 members have upcoming performance reviews.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Clock className="text-slate-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="font-bold text-slate-700 text-[12px]">Work Trend</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 opacity-80 leading-relaxed">Team working hours improved by 12% this week.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamOverviewPage;
