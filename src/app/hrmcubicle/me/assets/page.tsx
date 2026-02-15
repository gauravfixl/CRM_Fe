"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Laptop,
    Monitor,
    Cpu,
    ShieldCheck,
    History,
    ChevronRight,
    AlertCircle,
    HardDrive,
    Zap,
    MousePointer2,
    Settings,
    Plus,
    FileText,
    RefreshCcw,
    CheckCircle2,
    Clock,
    Wrench
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useMeStore } from "@/shared/data/me-store";

const MyAssetsPage = () => {
    const { toast } = useToast();
    const { assets: storeAssets } = useMeStore();

    const [isRequestOpen, setIsRequestOpen] = React.useState(false);
    const [isPoliciesOpen, setIsPoliciesOpen] = React.useState(false);
    const [isReportOpen, setIsReportOpen] = React.useState(false);
    const [isReturnOpen, setIsReturnOpen] = React.useState(false);
    const [selectedAsset, setSelectedAsset] = React.useState<any>(null);

    const [requestForm, setRequestForm] = React.useState({
        category: 'Laptop',
        reason: '',
        urgency: 'Medium'
    });

    const maintenanceLogs = [
        { id: 1, type: "Routine Sync", date: "Jan 15, 2026", status: "Completed", icon: <CheckCircle2 size={12} className="text-emerald-500" /> },
        { id: 2, type: "Security Patch 4.2", date: "Jan 08, 2026", status: "System Fix", icon: <Wrench size={12} className="text-indigo-500" /> },
        { id: 3, type: "Thermal Check", date: "Dec 20, 2025", status: "Optimized", icon: <Zap size={12} className="text-amber-500" /> },
    ];

    const getAssetIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'laptop': return <Laptop className="text-indigo-500" />;
            case 'monitors': return <Monitor className="text-blue-500" />;
            default: return <HardDrive className="text-slate-500" />;
        }
    };

    const assets = storeAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.category,
        serial: asset.serial,
        status: "Allocated",
        date: asset.assignedDate,
        specs: asset.category === 'Laptop' ? "16GB RAM, 512GB SSD" : "Professional Grade Equipment",
        icon: getAssetIcon(asset.category),
        color: asset.category === 'Laptop' ? "bg-indigo-50/50 border-indigo-100/50" : "bg-blue-50/50 border-blue-100/50"
    }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 text-start">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workstation Assets</h1>
                        <p className="text-slate-500 font-medium text-xs flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#6366f1]" />
                            Official company-provided hardware and professional equipment
                        </p>
                    </div>
                    <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-11 px-8 font-bold shadow-lg shadow-indigo-100/50 transition-all active:scale-95 group border-none"
                        onClick={() => setIsRequestOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        New Asset Request
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
                            <Card className={`border shadow-md shadow-slate-200/30 hover:shadow-lg transition-all rounded-2xl overflow-hidden group ${asset.color}`}>
                                <CardContent className="p-5 text-start space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="h-10 w-10 rounded-xl bg-white shadow-md shadow-slate-200/50 border border-slate-50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                                            {asset.icon}
                                        </div>
                                        <Badge className="bg-emerald-500 text-white border-none font-bold text-[8px] tracking-tight px-2.5 py-0.5 shadow-md shadow-emerald-500/10 capitalize">
                                            {asset.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-bold text-slate-400 tracking-tight font-sans">{asset.id}</p>
                                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{asset.name}</h3>
                                        <p className="text-[10px] text-slate-500 font-semibold max-w-[200px] leading-snug">{asset.specs}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200/50 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] text-slate-400 font-bold tracking-tight capitalize">Serial Number</span>
                                            <span className="text-[10px] text-slate-900 font-bold tracking-tight">{asset.serial}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] text-slate-400 font-bold tracking-tight capitalize">Allocation Date</span>
                                            <span className="text-[10px] text-slate-900 font-bold tracking-tight">{asset.date}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between h-9 px-4 rounded-xl bg-white/50 hover:bg-indigo-600 hover:text-white font-bold text-[8px] tracking-tight transition-all shadow-sm group/btn border-none capitalize"
                                            onClick={() => { setSelectedAsset(asset); setIsPoliciesOpen(true); }}
                                        >
                                            Policies
                                            <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between h-9 px-4 rounded-xl bg-rose-50/50 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-[8px] tracking-tight transition-all shadow-sm group/btn border-none capitalize"
                                            onClick={() => { setSelectedAsset(asset); setIsReturnOpen(true); }}
                                        >
                                            Return Asset
                                            <RefreshCcw size={12} className="group-hover/btn:rotate-180 transition-transform" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Filling the 3rd column with Insights Card - Light Theme */}
                    <motion.div variants={itemVariants}>
                        <Card className="border border-amber-100 shadow-md shadow-slate-200/30 bg-gradient-to-br from-amber-50 to-white rounded-2xl overflow-hidden group h-fit">
                            <CardContent className="p-5 text-start space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-9 w-9 rounded-xl bg-white shadow-sm border border-amber-100 flex items-center justify-center">
                                            <Zap size={18} className="text-amber-500" />
                                        </div>
                                        <Badge className="bg-amber-100/50 text-amber-700 border-none font-bold text-[8px] px-2.5 py-0.5 capitalize">Live Health</Badge>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-base font-bold text-slate-900 tracking-tight">System Insights</h4>
                                        <p className="text-[10px] text-slate-700 font-semibold leading-tight">Hardware performance monitoring.</p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {[
                                        { label: "Hardware Health", value: "98%", color: "text-emerald-700" },
                                        { label: "Warranty Period", value: "824 Days", color: "text-indigo-700" },
                                        { label: "Next Audit", value: "12 Mar", color: "text-amber-700" }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-[8px] font-bold text-slate-600 capitalize">{stat.label}</span>
                                            <span className={`text-[10px] font-bold ${stat.color}`}>{stat.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    className="w-full h-9 bg-white hover:bg-slate-900 text-slate-900 hover:text-white rounded-xl font-bold text-[9px] transition-all border border-slate-100 shadow-sm capitalize"
                                    onClick={() => toast({ title: "Audit Logged", description: "Your hardware self-audit has been recorded for Q1 2026." })}
                                >
                                    Verify Hardware Now
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Quick Actions / Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <Card className="lg:col-span-2 border-none shadow-md rounded-2xl overflow-hidden bg-white text-start group">
                        <CardHeader className="p-5 bg-slate-50/30 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Maintenance Ledger</CardTitle>
                                <CardDescription className="text-xs font-semibold text-slate-400 tracking-tight capitalize">History of repairs and workstation health checks.</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-lg h-9 w-9 border-slate-100 bg-white shadow-sm hover:rotate-90 transition-transform"
                                onClick={() => toast({ title: "Ledger Update", description: "Syncing maintenance logs..." })}
                            >
                                <History size={14} className="text-indigo-600" />
                            </Button>
                        </CardHeader>
                        <div className="p-5">
                            <div className="space-y-3">
                                {maintenanceLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group/log">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-slate-50">
                                                {log.icon}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-900">{log.type}</p>
                                                <p className="text-[9px] font-semibold text-slate-400">{log.date}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[8px] font-bold border-slate-100 bg-white text-slate-500 px-2 py-0.5">{log.status}</Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-9 px-6 font-bold text-[9px] tracking-tight border-slate-100 text-slate-500 hover:bg-rose-50/50 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm capitalize"
                                    onClick={() => { setIsReportOpen(true); }}
                                >
                                    <AlertCircle size={14} className="mr-2" /> Report a Malfunction
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-8">
                        <Card className="h-fit border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 text-slate-900 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none text-indigo-600">
                                <Cpu className="h-48 w-48 -mr-8 -mt-8" />
                            </div>
                            <div className="relative z-10 text-start space-y-4">
                                <div className="space-y-3">
                                    <Badge className="bg-white text-indigo-600 border border-indigo-100 font-bold text-[8px] px-2.5 py-0.5 tracking-tight shadow-sm capitalize">IT Command Center</Badge>
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900">Concierge Support</h3>
                                        <p className="text-slate-600 text-[10px] font-semibold leading-snug">
                                            Enterprise-grade assistance from our specialists.
                                        </p>
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 tracking-tight capitalize">
                                            <Zap size={10} className="text-amber-500" /> Response: 15 Mins
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 tracking-tight capitalize">
                                            <Settings size={10} className="text-indigo-500" /> Standard: Executive
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] tracking-tight shadow-lg shadow-indigo-200 transition-all active:scale-95 group/btn border-none capitalize"
                                        onClick={() => toast({ title: "Triage Initiated", description: "Our IT support team has been notified. They will contact you shortly." })}
                                    >
                                        Raise Ticket <MousePointer2 size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="h-fit border-none shadow-md rounded-2xl overflow-hidden bg-white text-start group">
                            <CardHeader className="p-5 bg-slate-50/30 border-b border-slate-100">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-base font-bold text-slate-900 tracking-tight">Active Requests</CardTitle>
                                    <CardDescription className="text-[10px] font-semibold text-slate-400 tracking-tight capitalize">Tracking your upgrade pipeline.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    {[
                                        { item: "Logitech MX Master 3S", status: "In Transit", date: "Exp. 29 Jan", color: "bg-indigo-500" },
                                        { item: "Vercel Hoodie (Welcome Kit)", status: "Approved", date: "Exp. 30 Jan", color: "bg-emerald-500" }
                                    ].map((req, i) => (
                                        <div key={i} className="flex gap-3 relative">
                                            {i === 0 && <div className="absolute left-1 top-5 bottom-[-18px] w-[1px] bg-slate-100"></div>}
                                            <div className="relative">
                                                <div className={`h-2.5 w-2.5 rounded-full ${req.color} ring-4 ring-white shadow-sm mt-1`}>
                                                    <div className={`absolute inset-0 rounded-full ${req.color} animate-ping opacity-20`}></div>
                                                </div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <h5 className="text-[11px] font-bold text-slate-900 tracking-tight">{req.item}</h5>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] font-bold text-slate-600 capitalize">{req.status}</span>
                                                    <span className="text-[9px] text-slate-400">•</span>
                                                    <span className="text-[9px] font-bold text-slate-600">{req.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        className="w-full h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 font-bold text-[9px] border-none capitalize mt-1"
                                        onClick={() => toast({ title: "Timeline Updated", description: "Fetching tracking data..." })}
                                    >
                                        Track Shipments
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Plus size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Request Hardware</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">Submit a request for new equipment or hardware upgrades.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2 text-start">
                            <Label className="text-xs font-bold text-slate-400 capitalize tracking-tight ml-1 block">Asset Category</Label>
                            <Select value={requestForm.category} onValueChange={v => setRequestForm({ ...requestForm, category: v })}>
                                <SelectTrigger className="rounded-xl bg-slate-50 border-none h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laptop">High Performance Laptop</SelectItem>
                                    <SelectItem value="Monitor">4K External Monitor</SelectItem>
                                    <SelectItem value="Peripherals">Ergonomic Peripherals</SelectItem>
                                    <SelectItem value="Other">Other Equipment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 text-start">
                            <Label className="text-xs font-bold text-slate-400 capitalize tracking-tight ml-1 block">Business Justification *</Label>
                            <Textarea
                                className="rounded-xl bg-slate-50 border-none min-h-[100px] font-medium p-4"
                                placeholder="Explain why this asset is required..."
                                value={requestForm.reason}
                                onChange={e => setRequestForm({ ...requestForm, reason: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-3 pt-4 border-t border-slate-50">
                        <Button variant="ghost" className="rounded-xl h-12 font-bold px-8 text-slate-500 capitalize" onClick={() => { setIsRequestOpen(false); }}>Cancel</Button>
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-100" onClick={() => {
                            if (!requestForm.reason) {
                                toast({ title: "Error", description: "Justification is required", variant: "destructive" });
                                return;
                            }
                            setIsRequestOpen(false);
                            toast({ title: "Submitted", description: "Request is now under review." });
                        }}>Submit Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPoliciesOpen} onOpenChange={setIsPoliciesOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <FileText size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">{selectedAsset?.name} Policies</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">Usage guidelines and compliance documents.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        {[
                            { title: "Acceptable Use Policy", size: "1.2 MB", date: "Jan 2026" },
                            { title: "Hardware Warranty Info", size: "840 KB", date: "Dec 2025" },
                            { title: "Security Protocols", size: "2.1 MB", date: "Feb 2026" }
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3 text-start">
                                    <FileText size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-none">{doc.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold capitalize tracking-tight mt-1">{doc.size} • {doc.date}</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold capitalize" onClick={() => setIsPoliciesOpen(false)}>Close Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                            <AlertCircle size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Report Issue</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">Log a malfunction for immediate triage.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-5 text-start">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 capitalize tracking-tight ml-1 block">Describe the Problem *</Label>
                            <Textarea
                                className="rounded-xl bg-slate-50 border-none min-h-[120px] font-medium p-4 focus:ring-2 focus:ring-rose-100 transition-all"
                                placeholder="e.g. Screen flickering, overheating..."
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                            <Zap size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
                                Critical issues receive attention within 15 minutes.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" className="rounded-xl h-12 font-bold px-8 text-slate-500 capitalize" onClick={() => setIsReportOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-rose-100" onClick={() => {
                            setIsReportOpen(false);
                            toast({ title: "Incident Logged", description: "IT Support ticket has been raised." });
                        }}>Report Incident</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <RefreshCcw size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Return Asset</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">Initiate the return process for <strong>{selectedAsset?.name}</strong>.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-5 text-start">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 capitalize tracking-tight ml-1 block">Reason for Return</Label>
                            <Select defaultValue="Upgrade">
                                <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11 text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Upgrade">Requesting Upgrade</SelectItem>
                                    <SelectItem value="Damaged">Device Damaged/Faulty</SelectItem>
                                    <SelectItem value="NotRequired">No longer required</SelectItem>
                                    <SelectItem value="Exit">Employee Exit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 capitalize tracking-tight ml-1 block">Additional Notes</Label>
                            <Textarea
                                className="rounded-xl bg-slate-50 border-none min-h-[100px] font-medium p-4 focus:ring-2 focus:ring-indigo-100 transition-all"
                                placeholder="Any specific details about the device condition..."
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                            <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
                                <strong>Next Step:</strong> Our IT courier will contact you within 24-48 hours to schedule the pickup once approved.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="ghost" className="rounded-xl h-12 font-bold px-8 text-slate-500 capitalize" onClick={() => setIsReturnOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-indigo-100" onClick={() => {
                            setIsReturnOpen(false);
                            toast({ title: "Return Initiated", description: "IT Logistics team has been notified for pickup." });
                        }}>Confirm Return</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyAssetsPage;