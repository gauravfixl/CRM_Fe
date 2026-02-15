"use client"

import React from "react";
import { motion } from "framer-motion";
import { Users, Building2, MapPin, Briefcase, TrendingUp, UserPlus } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { useOrganizationStore } from "@/shared/data/organization-store";
import Link from "next/link";

const OrgDashboardPage = () => {
    const { employees, departments, locations } = useOrganizationStore();

    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const newJoinees = employees.filter(e => {
        const joinDate = new Date(e.joiningDate);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return joinDate > monthAgo;
    }).length;

    const stats = [
        { label: "Total Employees", value: employees.length, color: "bg-[#CB9DF0]", icon: <Users className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active", value: activeEmployees, color: "bg-emerald-100", icon: <UserPlus className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Departments", value: departments.length, color: "bg-[#F0C1E1]", icon: <Building2 className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Locations", value: locations.length, color: "bg-[#FFF9BF]", icon: <MapPin className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const quickLinks = [
        { title: "Employees", url: "/hrmcubicle/organization/employees", icon: Users, color: "bg-blue-100 text-blue-600" },
        { title: "Departments", url: "/hrmcubicle/organization/departments", icon: Building2, color: "bg-purple-100 text-purple-600" },
        { title: "Designations", url: "/hrmcubicle/organization/designations", icon: Briefcase, color: "bg-emerald-100 text-emerald-600" },
        { title: "Locations", url: "/hrmcubicle/organization/locations", icon: MapPin, color: "bg-amber-100 text-amber-600" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organization Dashboard</h1>
                <p className="text-slate-500 font-medium">Overview of your organization structure and workforce.</p>
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

            {/* Department Overview */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6">Department Distribution</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept, i) => (
                        <motion.div key={dept.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                            <div className="p-6 bg-slate-50 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-black text-lg text-slate-900">{dept.name}</h3>
                                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Building2 className="text-indigo-600" size={20} />
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium mb-3">{dept.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-bold uppercase">Head</span>
                                    <span className="font-bold text-slate-700 text-sm">{dept.headOfDepartment}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-slate-400 font-bold uppercase">Employees</span>
                                    <span className="font-black text-indigo-600 text-lg">{dept.employeeCount}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Location Overview */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8">
                <h2 className="text-xl font-black mb-6">Office Locations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {locations.map((loc, i) => (
                        <motion.div key={loc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin size={20} />
                                    <h3 className="font-black text-lg">{loc.name}</h3>
                                </div>
                                <p className="text-sm text-white/80 mb-3">{loc.address}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-white/60 font-bold uppercase">Employees</span>
                                    <span className="font-black text-2xl">{loc.employeeCount}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default OrgDashboardPage;
