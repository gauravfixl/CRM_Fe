"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
    BarChart3,
    Zap,
    Users,
    HardDrive,
    ArrowUpCircle,
    Clock,
    ShieldCheck,
    CheckCircle2,
    Info,
    ChevronRight,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
import { showSuccess } from "@/utils/toast";

export default function PlanUsagePage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "";
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showAddSeatsModal, setShowAddSeatsModal] = useState(false);
    const [newSeats, setNewSeats] = useState("5");
    const [apiPlan, setApiPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/OrgBilling/current-plan");
                setApiPlan(response.data?.currentPlan || null);
            } catch (error) {
                console.error("Failed to fetch current plan:", error);
                setApiPlan(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentPlan();
    }, []);

    const downloadBillingStatement = useCallback(() => {
        const csvContent = [
            ["Invoice ID", "Date", "Description", "Amount", "Status"],
            ["INV-2026-003", "Mar 01, 2026", "Enterprise Pro - Monthly", "$499.00", "Upcoming"],
            ["INV-2026-002", "Feb 01, 2026", "Enterprise Pro - Monthly", "$499.00", "Paid"],
            ["INV-2026-001", "Jan 01, 2026", "Enterprise Pro - Monthly", "$499.00", "Paid"],
            ["INV-2025-012", "Dec 01, 2025", "Enterprise Pro - Monthly + Storage", "$512.50", "Paid"],
            ["INV-2025-011", "Nov 01, 2025", "Enterprise Pro - Monthly", "$499.00", "Paid"],
        ].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `billing-statement-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Billing statement downloaded");
    }, []);

    const currentPlan = apiPlan
        ? {
            name: apiPlan.planSnapshot?.name || "Enterprise Pro",
            status: apiPlan.paymentStatus === "active" ? "Active" : apiPlan.paymentStatus || "Active",
            billingCycle: apiPlan.planSnapshot?.billingCycle
                ? apiPlan.planSnapshot.billingCycle.charAt(0).toUpperCase() + apiPlan.planSnapshot.billingCycle.slice(1)
                : "Yearly",
            nextBilling: apiPlan.nextPaymentDate
                ? new Date(apiPlan.nextPaymentDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                : "Oct 24, 2026",
            price: apiPlan.planSnapshot?.price
                ? `$${apiPlan.planSnapshot.price}/mo`
                : "$499/mo",
        }
        : {
            name: "Enterprise Pro",
            status: "Active",
            billingCycle: "Yearly",
            nextBilling: "Oct 24, 2026",
            price: "$499/mo",
        };

    const apiLimits = apiPlan?.planSnapshot?.limits;
    const usageStats = apiLimits
        ? [
            { title: "Active Users", value: "42", limit: String(apiLimits.maxUsers || 100), percentage: Math.round((42 / (apiLimits.maxUsers || 100)) * 100), icon: Users, color: "text-primary", bg: "bg-primary/10" },
            { title: "Cloud Storage", value: "156 GB", limit: `${apiLimits.maxStorageGB || 500} GB`, percentage: Math.round((156 / (apiLimits.maxStorageGB || 500)) * 100), icon: HardDrive, color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Api Monthly Calls", value: "850k", limit: "1M", percentage: 85, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            { title: "Total Workspaces", value: "8", limit: String(apiLimits.maxProjects || 25), percentage: Math.round((8 / (apiLimits.maxProjects || 25)) * 100), icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" }
        ]
        : [
            { title: "Active Users", value: "42", limit: "100", percentage: 42, icon: Users, color: "text-primary", bg: "bg-primary/10" },
            { title: "Cloud Storage", value: "156 GB", limit: "500 GB", percentage: 31, icon: HardDrive, color: "text-indigo-600", bg: "bg-indigo-50" },
            { title: "Api Monthly Calls", value: "850k", limit: "1M", percentage: 85, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
            { title: "Total Workspaces", value: "8", limit: "25", percentage: 32, icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" }
        ];

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="mb-1">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Plan & Usage</h1>
                    <p className="text-sm text-zinc-500 mt-1">Monitor your organization&apos;s resource consumption and subscription health.</p>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-primary/80 to-primary border-none rounded-none shadow-lg overflow-hidden text-white">
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <Badge className="bg-white text-primary hover:bg-white rounded-none px-2 py-0.5 text-[10px] font-medium shadow-sm">
                                    Subscription Tier
                                </Badge>
                                <div className="flex items-center gap-1.5 text-white text-xs opacity-80">
                                    <CheckCircle2 size={12} /> {currentPlan.status}
                                </div>
                            </div>
                            <h2 className="text-white text-xl font-semibold mb-1">
                                {currentPlan.name}
                            </h2>
                            <p className="text-white text-xs opacity-80">Billed {currentPlan.billingCycle}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white opacity-80 flex items-center gap-2">
                                    <Clock size={14} /> Next Billing Date
                                </span>
                                <span className="text-white font-semibold">{currentPlan.nextBilling}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white opacity-80 flex items-center gap-2">
                                    <ShieldCheck size={14} /> Secure Payments
                                </span>
                                <span className="text-white opacity-80">Visa •••• 4242</span>
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <Button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="w-full bg-white text-primary hover:bg-zinc-50 rounded-none font-medium text-xs h-10 shadow-md border-none"
                                >
                                    <ArrowUpCircle className="mr-2" size={16} /> Upgrade Subscription
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-white hover:bg-white/10 rounded-none font-medium text-xs h-10"
                                    onClick={downloadBillingStatement}
                                >
                                    <Download className="mr-2" size={14} /> Download Billing Statement
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-5 rounded-none shadow-lg">
                        <div className="flex gap-3">
                            <Info className="text-primary shrink-0" size={18} />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">Auto-Scaling</p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Plan configured to allow up to 10% overage for Api calls before restrictions apply.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                            <h3 className="text-base font-medium text-gray-900">Resource Utilization</h3>
                            <span className="text-[10px] text-gray-500 font-medium">Live Analytics</span>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {usageStats.map((stat, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-none border border-current/10`}>
                                                <stat.icon size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">
                                            {stat.value} <span className="text-gray-400 font-normal">/ {stat.limit}</span>
                                        </span>
                                    </div>

                                    <Progress
                                        value={stat.percentage}
                                        className={`h-[6px] rounded-none ${idx === 2 ? 'bg-amber-100' : 'bg-zinc-100'} [&>div]:${idx === 2 ? 'bg-amber-500' : 'bg-primary'}`}
                                    />

                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className={idx === 2 ? "text-amber-600 font-medium" : "text-gray-400 font-medium"}>
                                            {idx === 2 ? "Near Limit" : "Healthy"}
                                        </span>
                                        <span className="font-semibold text-gray-900">{stat.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">Scaling required for increasing team efficiency?</p>
                            <Button
                                onClick={() => setShowAddSeatsModal(true)}
                                variant="link"
                                className="text-primary font-medium text-xs p-0 h-auto gap-1"
                            >
                                Buy Extensions <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 bg-zinc-50/30">
                            <h3 className="text-base font-medium text-gray-900">Enterprise Feature Access</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                            {(apiPlan?.planSnapshot?.features && apiPlan.planSnapshot.features.length > 0
                                ? apiPlan.planSnapshot.features
                                : [
                                    "Unlimited Global Projects",
                                    "Advanced Sales Pipeline",
                                    "Client Lifecycle Graph",
                                    "Administrative Governance",
                                    "Direct Account Manager",
                                    "Gold Support Tier",
                                    "Global Currency Engine",
                                    "Api Management Core"
                                ]
                            ).map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-none" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Modal */}
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="max-w-2xl rounded-none border-none p-0 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-indigo-700 to-primary p-8 text-white text-center">
                        <h2 className="text-xl font-semibold mb-1">Scale Your Potential</h2>
                        <p className="text-primary/20 text-xs font-medium opacity-80">Choose an infrastructure tier that matches your growth trajectory.</p>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-6 bg-white">
                        <div className="border border-zinc-200 p-6 rounded-none space-y-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                            <h4 className="font-semibold text-sm text-gray-900">Standard Desk</h4>
                            <p className="text-2xl font-semibold leading-none text-gray-900">$199<span className="text-xs text-gray-400 font-medium">/mo</span></p>
                            <ul className="text-xs text-gray-500 space-y-2 pt-2 border-t border-zinc-100">
                                <li className="flex gap-2">✓ 25 Core Users</li>
                                <li className="flex gap-2">✓ 100GB Governance Storage</li>
                            </ul>
                            <Button variant="outline" onClick={() => { setShowUpgradeModal(false); router.push(`/${orgName}/modules/billing/upgrade`); }} className="w-full rounded-none font-medium text-xs border-zinc-200 group-hover:bg-primary group-hover:text-white transition-colors">Select Tier</Button>
                        </div>
                        <div className="border-2 border-primary p-6 rounded-none space-y-4 relative shadow-lg bg-primary/5">
                            <div className="absolute top-0 right-0 bg-primary text-white text-[9px] px-3 py-1 font-medium rounded-bl-xl translate-y-[-50%]">Active Setup</div>
                            <h4 className="font-semibold text-sm text-gray-900">Enterprise Pro</h4>
                            <p className="text-2xl font-semibold leading-none text-primary">$499<span className="text-xs text-primary/40 font-medium">/mo</span></p>
                            <ul className="text-xs text-gray-700 space-y-2 pt-2 border-t border-primary/20">
                                <li className="flex gap-2 font-medium">✓ Unlimited Global Users</li>
                                <li className="flex gap-2 font-medium">✓ 500GB Vault Storage</li>
                            </ul>
                            <Button disabled className="w-full rounded-none bg-primary/20 text-primary/60 font-medium text-xs">Current Plan</Button>
                        </div>
                    </div>
                    <DialogFooter className="p-6 border-t border-zinc-100 flex justify-center bg-zinc-50 rounded-b-xl sm:justify-center">
                        <Button variant="ghost" onClick={() => setShowUpgradeModal(false)} className="text-zinc-500 font-medium text-xs opacity-60 hover:opacity-100">Maintain Current Allocation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Seats Modal */}
            <Dialog open={showAddSeatsModal} onOpenChange={setShowAddSeatsModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold">Buy Additional Seats</h2>
                        <p className="text-xs opacity-80 mt-1">Add more user seats to your current plan.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">Number of seats</Label>
                            <Input type="number" value={newSeats} onChange={(e) => setNewSeats(e.target.value)} className="rounded-none border-zinc-200 h-9 text-sm" min="1" />
                        </div>
                        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-none">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Price per seat</span>
                                <span className="font-semibold text-gray-900">$15/mo</span>
                            </div>
                            <div className="flex justify-between text-xs mt-2">
                                <span className="text-gray-600">Total additional cost</span>
                                <span className="font-semibold text-primary">${(parseInt(newSeats) || 0) * 15}/mo</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowAddSeatsModal(false)} className="rounded-none text-sm text-gray-600 h-9">Cancel</Button>
                        <Button onClick={() => { setShowAddSeatsModal(false); showSuccess(`${newSeats} additional seats purchased successfully`); }} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">Purchase Seats</Button>
                    </div>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}
