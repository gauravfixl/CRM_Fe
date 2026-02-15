"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { useHireStore } from "@/shared/data/hire-store";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Briefcase,
  Users,
  Calendar,
  Plus,
  ArrowRight,
  Search,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const HireDashboardPage = () => {
  const router = useRouter();
  const { jobs, candidates, interviews } = useHireStore();

  // Stats
  const activeJobs = jobs.filter(j => j.workflowStatus === 'Active');
  const newCandidates = candidates.filter(c => c.stage === 'New');
  const upcomingInterviews = interviews.filter(i => i.status === 'Scheduled');
  const todayInterviews = upcomingInterviews.filter(i => new Date(i.date).toDateString() === new Date().toDateString());

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-black tracking-tighter">Recruitment Hub</h1>
          <p className="font-medium text-indigo-100 max-w-xl text-lg">
            You have <span className="text-white font-black underline decoration-amber-400 decoration-4 underline-offset-4">{activeJobs.length} active roles</span> and <span className="text-white font-black underline decoration-emerald-400 decoration-4 underline-offset-4">{newCandidates.length} new applicants</span> to review today.
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10 mt-4 md:mt-0">
          <Button
            onClick={() => router.push('/hrmcubicle/hire/jobs')}
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl h-14 px-8 shadow-lg border-2 border-transparent transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Post Job
          </Button>
          <Button
            onClick={() => router.push('/hrmcubicle/hire/candidates')}
            className="bg-indigo-500 text-white hover:bg-indigo-400 font-black rounded-2xl h-14 px-8 border-2 border-indigo-400 transition-all"
          >
            View Pipeline
          </Button>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-10 bottom-0 h-32 w-32 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            onClick={() => router.push('/hrmcubicle/hire/jobs')}
            className="group rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-slate-100 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900">{activeJobs.length}</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Open Positions</p>
            </div>
          </Card>

          <Card
            onClick={() => router.push('/hrmcubicle/hire/candidates')}
            className="group rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-slate-100 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900">{newCandidates.length}</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">New Applicants</p>
            </div>
          </Card>

          <Card
            onClick={() => router.push('/hrmcubicle/hire/interviews')}
            className="group rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-slate-100 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900">{upcomingInterviews.length}</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Scheduled Interviews</p>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col justify-center items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
              <Search className="h-6 w-6" />
            </div>
            <p className="font-bold text-slate-900">Talent Search</p>
            <p className="text-xs text-slate-400 font-bold mt-1 max-w-[140px]">Search across your entire database</p>
          </Card>
        </div>

        {/* Today's Agenda */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 ring-1 ring-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900">Today's Interviews</h3>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold rounded-lg px-2">{todayInterviews.length}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 space-y-4">
            {todayInterviews.length > 0 ? (
              todayInterviews.map((interview) => (
                <div key={interview.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-white shadow-sm text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(interview.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-black text-slate-900 leading-none">{new Date(interview.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 line-clamp-1">{interview.title}</h4>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{interview.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
                      {interview.mode} • 1 Candidate
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2 min-h-[150px]">
                <CheckCircle2 className="h-10 w-10 text-emerald-200" />
                <div>
                  <p className="font-bold text-slate-600">No interviews for today</p>
                  <p className="text-xs font-medium">Enjoy your day!</p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => router.push('/hrmcubicle/hire/interviews')}
            variant="ghost"
            className="w-full mt-6 rounded-xl font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            View Full Schedule
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default HireDashboardPage;
