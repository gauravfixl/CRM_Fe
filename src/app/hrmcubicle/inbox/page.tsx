"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Bell,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  Star,
  Zap,
  Inbox as InboxIcon
} from 'lucide-react';
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import Link from 'next/link';
import { useInboxStore } from "@/shared/data/inbox-store";

const InboxOverviewPage = () => {
  const { approvals, notifications, requests } = useInboxStore();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const activeRequestsCount = requests.filter(r => r.status === 'Open' || r.status === 'In Progress').length;

  const sections = [
    {
      title: "Approvals",
      description: "Review and respond to team requests for leave, expenses, and more.",
      count: pendingApprovalsCount,
      href: "/hrmcubicle/inbox/approvals",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      borderColor: "border-emerald-100",
      gradient: "from-emerald-500 to-teal-600",
      badge: "Action Required"
    },
    {
      title: "Notifications",
      description: "Stay updated with important system alerts, announcements, and reminders.",
      count: unreadNotificationsCount,
      href: "/hrmcubicle/inbox/notifications",
      icon: Bell,
      color: "bg-indigo-50 text-indigo-600",
      borderColor: "border-indigo-100",
      gradient: "from-indigo-500 to-blue-600",
      badge: "Updates"
    },
    {
      title: "Requests",
      description: "Manage employee queries, document requests, and support tickets.",
      count: activeRequestsCount,
      href: "/hrmcubicle/inbox/requests",
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100",
      gradient: "from-amber-500 to-orange-600",
      badge: "Active"
    }
  ];

  return (
    <div className="p-8 space-y-10 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <InboxIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inbox Central</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-2">Simplify your workflow. Manage all team interactions in one unified workspace.</p>
        </div>
        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
          <Button variant="ghost" size="sm" className="rounded-lg font-bold text-xs h-9 px-4 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-none transition-all">Today</Button>
          <Button variant="ghost" size="sm" className="rounded-lg font-bold text-xs h-9 px-4 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-none transition-all">This Week</Button>
          <Button variant="secondary" size="sm" className="bg-white rounded-lg font-bold text-xs h-9 px-4 text-indigo-600 shadow-sm border border-slate-200">History</Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link href={section.href}>
              <Card className={`group relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl h-full`}>
                {/* Background Decorative Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.gradient} opacity-5 -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-700`} />

                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl ${section.color} shadow-sm border ${section.borderColor}`}>
                      <section.icon className="w-7 h-7" />
                    </div>
                    <Badge className={`bg-white/80 backdrop-blur-md border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-lg px-2 shadow-sm`}>
                      {section.badge}
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{section.title}</h2>
                      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{section.description}</p>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-slate-50 mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-bold text-slate-900">{section.count}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Items Pending</span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section: Efficiency & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        <div className="lg:col-span-8">
          <Card className="border-none bg-slate-50/50 rounded-3xl overflow-hidden group">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Zap className="w-3 h-3 fill-current" /> Smart Assistant
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Quick Action Hub</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    Your productivity has increased by <span className="text-emerald-600 font-bold italic">24%</span> this week. Resolve your remaining items to achieve "Inbox Zero".
                  </p>
                  <Button className="bg-slate-900 hover:bg-indigo-600 text-white gap-2 h-12 px-8 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-200">
                    Auto-Resolve Suggestions <Zap size={16} />
                  </Button>
                </div>
                <div className="bg-indigo-600 relative overflow-hidden flex items-center justify-center p-10 min-h-[300px]">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-transparent to-transparent scale-150" />
                  </div>
                  <div className="relative z-10 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12">
                        <Star className="w-10 h-10 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-indigo-100 font-bold text-sm tracking-wide px-6">Most approved category this month: <span className="text-white">Sick Leave</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <InboxIcon className="w-40 h-40 -mr-10 -mt-10" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <h4 className="text-xl font-bold tracking-tight">System Health</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Auto-Sync</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Last Audit</span>
                    <span className="text-slate-200 text-xs font-bold tabular-nums">2 mins ago</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8">
                <p className="text-xs text-slate-400 italic">All communications are encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxOverviewPage;
