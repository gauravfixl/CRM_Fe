"use client"

import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    Building2,
    MapPin,
    TrendingUp,
    TrendingDown,
    UserPlus,
    UserMinus,
    Briefcase,
    Target,
    Activity,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Clock,
    Award,
    ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore } from "@/shared/data/organisation-store";
import Link from "next/link";

const OrganisationDashboard = () => {
    const { toast } = useToast();
    const { employees, departments, designations, locations, getMetrics } = useOrganisationStore();
    const metrics = getMetrics();

    const quickStats = [
        {
            label: "Total Headcount",
            value: metrics.totalHeadcount,
            change: `+${metrics.newJoineesThisMonth} this month`,
            trend: "up",
            icon: Users,
            color: "text-indigo-700",
            bg: "bg-indigo-100/90",
            border: "border-indigo-200",
            href: "/hrmcubicle/organization/employees"
        },
        {
            label: "Active Employees",
            value: metrics.activeEmployees,
            change: `${metrics.onNotice} on notice`,
            trend: "neutral",
            icon: Activity,
            color: "text-emerald-700",
            bg: "bg-emerald-100/90",
            border: "border-emerald-200",
            href: "/hrmcubicle/organization/employees"
        },
        {
            label: "Departments",
            value: departments.filter(d => d.isActive).length,
            change: `${employees.filter(e => departments.find(d => d.id === e.departmentId)).length} total allocation`,
            trend: "up",
            icon: Building2,
            color: "text-purple-700",
            bg: "bg-purple-100/90",
            border: "border-purple-200",
            href: "/hrmcubicle/organization/departments"
        },
        {
            label: "Locations",
            value: locations.filter(l => l.isActive).length,
            change: `${employees.filter(e => locations.find(l => l.id === e.locationId)).length} distributed`,
            trend: "up",
            icon: MapPin,
            color: "text-amber-700",
            bg: "bg-amber-100/90",
            border: "border-amber-200",
            href: "/hrmcubicle/organization/locations"
        }
    ];

    const navigationCards = [
        {
            title: "Employee Directory",
            description: "Manage employee profiles and lifecycle",
            icon: Users,
            color: "text-indigo-700",
            iconBg: "bg-indigo-600",
            bg: "bg-white",
            border: "border-slate-100",
            hoverBg: "hover:bg-slate-50",
            href: "/hrmcubicle/organization/employees",
            count: employees.length
        },
        {
            title: "Departments",
            description: "Organizational structure and hierarchy",
            icon: Building2,
            color: "text-purple-700",
            iconBg: "bg-purple-600",
            bg: "bg-white",
            border: "border-slate-100",
            hoverBg: "hover:bg-slate-50",
            href: "/hrmcubicle/organization/departments",
            count: departments.length
        },
        {
            title: "Designations",
            description: "Role levels and career progression",
            icon: Briefcase,
            color: "text-emerald-700",
            iconBg: "bg-emerald-600",
            bg: "bg-white",
            border: "border-slate-100",
            hoverBg: "hover:bg-slate-50",
            href: "/hrmcubicle/organization/designations",
            count: designations.length
        },
        {
            title: "Locations",
            description: "Office and remote work setup",
            icon: MapPin,
            color: "text-amber-700",
            iconBg: "bg-amber-600",
            bg: "bg-white",
            border: "border-slate-100",
            hoverBg: "hover:bg-slate-50",
            href: "/hrmcubicle/organization/locations",
            count: locations.length
        },
        {
            title: "Org Chart",
            description: "Visual reporting structure",
            icon: Target,
            color: "text-rose-700",
            iconBg: "bg-rose-600",
            bg: "bg-white",
            border: "border-slate-100",
            hoverBg: "hover:bg-slate-50",
            href: "/hrmcubicle/organization/chart",
            count: null
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-2.5 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-0">
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Organisation Command</h1>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[9px] h-4.5 px-2.5">Master control</Badge>
                        </div>
                        <p className="text-slate-500 text-[10px] font-medium leading-none">Centralized workforce structure, hierarchy, and distribution analytics.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-9 px-5 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-[10px]"
                            onClick={() => toast({ title: "Generating Report", description: "The organizational summary is being compiled." })}
                        >
                            <BarChart3 size={14} /> Export Org Report
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-5 pt-6 max-w-[1440px] mx-auto w-full space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="w-full"
                        >
                            <Link href={stat.href}>
                                <Card className={`group border ${stat.border} shadow-sm rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all ${stat.bg} cursor-pointer`}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2.5">
                                            <div className={`p-2 rounded-xl bg-white ${stat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                                                <stat.icon size={16} />
                                            </div>
                                            <div className={`flex items-center gap-1 font-bold text-[10px] ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                                                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : stat.trend === 'down' ? <ArrowDownRight size={12} /> : <Activity size={12} />}
                                                {stat.trend === 'up' ? 'Growing' : stat.trend === 'down' ? 'Declining' : 'Stable'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-bold opacity-60 leading-none ${stat.color}`}>{stat.label}</p>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none tabular-nums">{stat.value}</h3>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold mt-2.5 leading-relaxed">{stat.change}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Navigation Hub */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {navigationCards.map((item, i) => (
                                <Link key={i} href={item.href}>
                                    <motion.div
                                        whileHover={{ y: -3 }}
                                        className="group cursor-pointer h-full"
                                    >
                                        <Card className={`h-full border ${item.border} shadow-sm rounded-[1.5rem] ${item.bg} ${item.hoverBg} hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                                            <CardContent className="p-4 space-y-3">
                                                <div className={`h-10 w-10 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                                                    <item.icon size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{item.title}</h3>
                                                    <p className="text-[10px] text-slate-500 font-bold opacity-80">{item.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-0.5">
                                                    {item.count !== null ? (
                                                        <Badge className="bg-slate-900 text-white border-none font-bold text-[8px] h-4.5 px-2 rounded-lg">
                                                            {item.count} active
                                                        </Badge>
                                                    ) : <div />}
                                                    <div className={`flex items-center ${item.color} font-bold text-[9px] uppercase gap-1.5 transition-colors`}>
                                                        Manage <ChevronRight size={12} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <div className={`absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity ${item.color}`}>
                                                <item.icon size={60} className="-mr-2 -mt-2 rotate-12" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Department Distribution */}
                        <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                                            <Building2 className="text-purple-600" size={18} /> Department distribution
                                        </h2>
                                        <p className="text-slate-400 text-[9px] font-bold">Headcount allocation across verticals</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                    {departments.slice(0, 4).map((dept, i) => {
                                        const deptCount = employees.filter(e => e.departmentId === dept.id).length;
                                        const percentage = metrics.totalHeadcount > 0 ? (deptCount / metrics.totalHeadcount) * 100 : 0;
                                        return (
                                            <div key={i} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black text-[9px]">
                                                            {dept.code}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-none">{dept.name}</h4>
                                                            <p className="text-[9px] text-slate-400 font-bold mt-1">{deptCount} Headcount</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-bold text-purple-600 tabular-nums">{percentage.toFixed(0)}%</span>
                                                </div>
                                                <Progress value={percentage} className="h-1.5 bg-slate-50" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar - Insights */}
                    <div className="space-y-6">
                        {/* Attrition & Growth */}
                        <Card className="border border-slate-100 shadow-sm rounded-[1.75rem] bg-white text-slate-900 p-5 relative overflow-hidden group">
                            <div className="relative z-10 space-y-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-indigo-600 mb-0.5">
                                        <TrendingUp size={16} />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tighter text-slate-900">Workforce Pulse</h3>
                                    <p className="text-slate-500 text-[9px] font-bold tracking-tight">Growth & attrition metrics</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-transform hover:scale-[1.02]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                                                <UserPlus size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700">New joinees</span>
                                        </div>
                                        <span className="text-lg font-bold text-emerald-600">+{metrics.newJoineesThisMonth}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-transform hover:scale-[1.02]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50">
                                                <UserMinus size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700">Exits</span>
                                        </div>
                                        <span className="text-lg font-bold text-rose-600">{metrics.exitsThisMonth}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-transform hover:scale-[1.02]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                                                <Activity size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-700">Attrition</span>
                                        </div>
                                        <span className="text-lg font-bold text-indigo-600">{metrics.attritionRate.toFixed(1)}%</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full bg-indigo-600 text-white hover:bg-slate-900 rounded-2xl h-11 font-bold text-xs shadow-xl shadow-indigo-100 transition-all font-medium"
                                    onClick={() => toast({ title: "Opening Analytics", description: "Redirecting to detailed workforce insights." })}
                                >
                                    Detailed Analytics
                                </Button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
                        </Card>

                        {/* Employment Type Breakdown */}
                        <Card className="rounded-[1.75rem] border border-slate-100 shadow-sm bg-white p-6 space-y-5">
                            <h4 className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                <PieChart size={12} className="text-indigo-500" /> Employment type
                            </h4>
                            <div className="space-y-4">
                                {metrics.employmentTypeDistribution.map((type, i) => {
                                    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
                                    const percentage = metrics.totalHeadcount > 0 ? (type.count / metrics.totalHeadcount) * 100 : 0;
                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                <span>{type.type}</span>
                                                <span>{type.count}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[i]} transition-all duration-1000 rounded-full`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="text-slate-400" size={18} />
                                <span className="font-bold text-slate-900 text-sm">Recent Activity</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { action: "New employee onboarded", time: "2h ago" },
                                    { action: "Department restructured", time: "5h ago" },
                                    { action: "Location added", time: "1d ago" }
                                ].map((activity, i) => (
                                    <div key={i} className="flex gap-3 pl-2 border-l-2 border-indigo-200">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-700 truncate">{activity.action}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrganisationDashboard;
