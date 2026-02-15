"use client"

import React from "react";
import { motion } from "framer-motion";
import {
    Laptop,
    Smartphone,
    Monitor,
    Cpu,
    ShieldCheck,
    Calendar,
    FileText,
    History,
    ChevronRight,
    AlertCircle,
    HardDrive,
    Zap,
    MousePointer2,
    Settings,
    Plus
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";

const MyAssetsPage = () => {
    const { toast } = useToast();

    const assets = [
        {
            id: "ASSET-001",
            name: "MacBook Pro M2",
            type: "Laptop",
            serial: "MVNJ2LL/A - 2025",
            status: "Allocated",
            date: "Jan 12, 2026",
            specs: "16GB RAM, 512GB SSD",
            icon: <Laptop className="text-indigo-500" />,
            color: "from-indigo-50/50 to-white"
        },
        {
            id: "ASSET-042",
            name: "Dell UltraSharp 27\"",
            type: "Monitor",
            serial: "DELL-U2723QE",
            status: "Allocated",
            date: "Jan 15, 2026",
            specs: "4K UHD, USB-C Hub",
            icon: <Monitor className="text-blue-500" />,
            color: "from-blue-50/50 to-white"
        },
        {
            id: "ASSET-108",
            name: "Logitech MX Master 3S",
            type: "Peripheral",
            serial: "LOGI-MX3S-GR",
            status: "Allocated",
            date: "Jan 12, 2026",
            specs: "Silent Clicks, 8K DPI",
            icon: <HardDrive className="text-slate-500" />,
            color: "from-slate-100/50 to-white"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-start">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workstation Assets</h1>
                    <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#6366f1]" />
                        Official company-provided hardware and professional equipment
                    </p>
                </div>
                <Button
                    className="bg-[#6366f1] text-white hover:bg-[#5558e6] rounded-xl h-12 px-8 font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 group"
                    onClick={() => toast({ title: "Asset Request", description: "Loading the asset request portal and inventory catalog..." })}
                >
                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                    NEW ASSET REQUEST
                </Button>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {assets.map((asset, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className={`border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all rounded-[2.5rem] overflow-hidden group bg-gradient-to-br ${asset.color}`}>
                            <CardContent className="p-10 text-start space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-lg shadow-slate-200/50 border border-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                        {asset.icon}
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 shadow-lg shadow-emerald-500/20">
                                        {asset.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans">{asset.id}</p>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#6366f1] transition-colors">{asset.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold max-w-[200px] leading-relaxed">{asset.specs}</p>
                                </div>
                                <div className="pt-6 border-t border-slate-200/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Serial Number</span>
                                        <span className="text-sm text-slate-900 font-black">{asset.serial}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Allocation Date</span>
                                        <span className="text-sm text-slate-900 font-black">{asset.date}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between h-14 px-6 rounded-2xl bg-white/50 hover:bg-[#6366f1] hover:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-sm group/btn"
                                    onClick={() => toast({ title: "Asset Compliance", description: `Loading policy documents for ${asset.name}.` })}
                                >
                                    POLICIES & DOCS
                                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions / Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white text-start group">
                    <CardHeader className="p-10 bg-slate-50/30 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Maintenance Ledger</CardTitle>
                            <CardDescription className="text-xs font-medium text-slate-500">History of repairs, upgrades and workstation health checks.</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl border-slate-100 bg-white shadow-sm hover:rotate-90 transition-transform"
                            onClick={() => toast({ title: "Ledger Update", description: "Syncing maintenance logs with the central repository..." })}
                        >
                            <History size={16} className="text-[#6366f1]" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-20 text-center space-y-8 flex flex-col items-center justify-center">
                            <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                <History className="text-slate-200" size={48} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Lifecycle Empty</p>
                                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">This hardware is relatively new. No maintenance history has been recorded yet.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-2xl h-14 px-10 font-black text-[11px] uppercase tracking-[0.2em] border-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                                onClick={() => toast({ title: "Report Engine", description: "Issue reporting wizard is loading..." })}
                            >
                                <AlertCircle size={16} className="mr-3" /> Report a Malfunction
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl bg-[#0f172a] rounded-[3rem] p-12 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none grayscale">
                        <Cpu className="h-80 w-80 -mr-20 -mt-20" />
                    </div>
                    <div className="relative z-10 text-start h-full flex flex-col justify-between">
                        <div className="space-y-6">
                            <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-black text-[10px] px-4 py-1 uppercase tracking-widest">IT COMMAND CENTER</Badge>
                            <h3 className="text-3xl font-black leading-tight tracking-tight">Concierge Tech Support</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Experience enterprise-grade support. Our IT specialists are standing by to help with your complex workstation configurations.
                            </p>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                                    <Zap size={14} className="text-amber-500" /> Average Response: 15 Mins
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                                    <Settings size={14} className="text-indigo-500" /> Priority: Executive Standard
                                </div>
                            </div>
                        </div>
                        <div className="pt-10">
                            <Button
                                className="w-full h-16 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-950 transition-all active:scale-95 group/btn"
                                onClick={() => toast({ title: "Triage Initiated", description: "Our IT support team has been notified. They will contact you shortly." })}
                            >
                                RAISE PRIORITY TICKET <MousePointer2 size={18} className="ml-3 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyAssetsPage;
