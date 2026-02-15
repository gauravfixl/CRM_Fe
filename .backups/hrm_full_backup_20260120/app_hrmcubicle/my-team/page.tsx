"use client"

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Briefcase
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { useTeamStore } from "@/shared/data/team-store";
import Link from "next/link";

const TeamOverviewPage = () => {
  const { members, attendance } = useTeamStore();

  const activeMembers = members.filter(m => m.status === 'Active').length;
  const onLeave = members.filter(m => m.status === 'On Leave').length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;

  const stats = [
    { label: "Team Size", value: members.length, color: "bg-[#CB9DF0]", icon: <Users className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "Present Today", value: presentToday, color: "bg-emerald-100", icon: <UserCheck className="text-emerald-600" />, textColor: "text-emerald-900" },
    { label: "On Leave", value: onLeave, color: "bg-amber-100", icon: <Calendar className="text-amber-600" />, textColor: "text-amber-900" },
    { label: "Active Members", value: activeMembers, color: "bg-[#F0C1E1]", icon: <Briefcase className="text-slate-800" />, textColor: "text-slate-900" },
  ];

  const quickLinks = [
    { title: "Team Members", url: "/hrmcubicle/my-team/members", icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Team Attendance", url: "/hrmcubicle/my-team/attendance", icon: Clock, color: "bg-emerald-100 text-emerald-600" },
    { title: "Team Leave", url: "/hrmcubicle/my-team/leave", icon: Calendar, color: "bg-amber-100 text-amber-600" },
    { title: "Team Performance", url: "/hrmcubicle/my-team/performance", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Overview</h1>
        <p className="text-slate-500 font-medium">Manage and monitor your team's performance and activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
              <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                {stat.icon}
              </div>
              <div>
                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, i) => (
          <Link key={i} href={link.url}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6 cursor-pointer group">
                <div className={`h-14 w-14 ${link.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <link.icon size={24} />
                </div>
                <h3 className="font-black text-lg text-slate-900">{link.title}</h3>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Team Members Grid */}
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Team Members</h2>
          <Link href="/hrmcubicle/my-team/members">
            <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold cursor-pointer hover:bg-indigo-200">
              View All →
            </Badge>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.slice(0, 6).map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-[2rem] bg-slate-50 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 bg-indigo-100 text-indigo-700 font-bold text-lg">
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{member.designation}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Department</span>
                    <span className="font-bold text-slate-700">{member.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase">Status</span>
                    <Badge className={`${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-bold text-xs`}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Today's Attendance */}
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
        <h2 className="text-xl font-black mb-6">Today's Attendance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="text-emerald-400" size={24} />
              <span className="font-bold text-white/70">Present</span>
            </div>
            <p className="text-4xl font-black">{presentToday}</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-amber-400" size={24} />
              <span className="font-bold text-white/70">On Leave</span>
            </div>
            <p className="text-4xl font-black">{onLeave}</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <UserX className="text-rose-400" size={24} />
              <span className="font-bold text-white/70">Absent</span>
            </div>
            <p className="text-4xl font-black">{members.length - presentToday - onLeave}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamOverviewPage;
