"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentPlan } from "@/hooks/billingHooks";
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
    UserPlus,
    Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning } from "@/utils/toast";

export default function PlanUsagePage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "";
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showAddSeatsModal, setShowAddSeatsModal] = useState(false);
    const [newSeats, setNewSeats] = useState("5");
    const [seatsTouched, setSeatsTouched] = useState(false);
    const [submittingSeats, setSubmittingSeats] = useState(false);
    const [apiPlan, setApiPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const seatsError = useMemo(() => {
        if (!seatsTouched) return "";
        const trimmed = newSeats.trim();
        if (!trimmed) return "Number of seats is required";
        const n = Number(trimmed);
        if (!Number.isInteger(n)) return "Must be a whole number";
        if (n < 1) return "At least 1 seat is required";
        if (n > 100) return "Maximum 100 seats per purchase";
        return "";
    }, [newSeats, seatsTouched]);

    const seatsCount = Math.max(0, parseInt(newSeats) || 0);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                setLoading(true);
                const response = await getCurrentPlan();
                setApiPlan(response?.data?.currentPlan || response?.data?.data || null);
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

            {/* Upgrade Subscription — side sheet */}
            <SideFormSheet
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                title="Scale Your Potential"
                description="Choose an infrastructure tier that matches your growth trajectory."
                icon={<Rocket className="w-5 h-5" />}
                width="lg"
                hideFooter
            >
                <div className="space-y-4">
                    <div className="border border-zinc-200 p-5 rounded-xl space-y-3 hover:border-primary hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-[15px] text-gray-900">Standard Desk</h4>
                                <p className="text-[11px] text-gray-500 mt-0.5">Perfect for growing teams</p>
                            </div>
                            <p className="text-2xl font-bold leading-none text-gray-900">
                                $199<span className="text-xs text-gray-400 font-medium">/mo</span>
                            </p>
                        </div>
                        <ul className="text-[12.5px] text-gray-600 space-y-1.5 pt-2 border-t border-zinc-100">
                            <li className="flex gap-2 items-center"><CheckCircle2 size={13} className="text-emerald-500" /> 25 Core Users</li>
                            <li className="flex gap-2 items-center"><CheckCircle2 size={13} className="text-emerald-500" /> 100GB Governance Storage</li>
                            <li className="flex gap-2 items-center"><CheckCircle2 size={13} className="text-emerald-500" /> Standard support</li>
                        </ul>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowUpgradeModal(false);
                                router.push(`/${orgName}/modules/billing/upgrade`);
                            }}
                            className="w-full rounded-lg font-medium text-[13px] h-10 border-zinc-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                        >
                            Select Tier
                        </Button>
                    </div>

                    <div className="border-2 border-primary p-5 rounded-xl space-y-3 relative shadow-md bg-primary/5">
                        <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] px-2.5 py-0.5 font-medium rounded">
                            Active Plan
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-[15px] text-gray-900">Enterprise Pro</h4>
                                <p className="text-[11px] text-gray-500 mt-0.5">Your current plan</p>
                            </div>
                            <p className="text-2xl font-bold leading-none text-primary">
                                $499<span className="text-xs text-primary/40 font-medium">/mo</span>
                            </p>
                        </div>
                        <ul className="text-[12.5px] text-gray-700 space-y-1.5 pt-2 border-t border-primary/20">
                            <li className="flex gap-2 items-center font-medium"><CheckCircle2 size={13} className="text-primary" /> Unlimited Global Users</li>
                            <li className="flex gap-2 items-center font-medium"><CheckCircle2 size={13} className="text-primary" /> 500GB Vault Storage</li>
                            <li className="flex gap-2 items-center font-medium"><CheckCircle2 size={13} className="text-primary" /> Priority support</li>
                            <li className="flex gap-2 items-center font-medium"><CheckCircle2 size={13} className="text-primary" /> Dedicated account manager</li>
                        </ul>
                        <Button disabled className="w-full rounded-lg bg-primary/15 text-primary/60 font-medium text-[13px] h-10 cursor-not-allowed">
                            Current Plan
                        </Button>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Need a custom enterprise plan? <button onClick={() => router.push(`/${orgName}/modules/billing/upgrade`)} className="text-primary font-medium hover:underline">Contact sales</button> for tailored solutions.
                        </p>
                    </div>
                </div>
            </SideFormSheet>

            {/* Buy Additional Seats — side sheet */}
            <SideFormSheet
                open={showAddSeatsModal}
                onOpenChange={(o) => {
                    setShowAddSeatsModal(o);
                    if (!o) {
                        setSeatsTouched(false);
                        setNewSeats("5");
                    }
                }}
                title="Buy Additional Seats"
                description="Add more user seats to your current plan."
                icon={<UserPlus className="w-5 h-5" />}
                width="sm"
                onSubmit={async (e) => {
                    e.preventDefault();
                    setSeatsTouched(true);
                    if (seatsError || !seatsCount) {
                        showWarning(seatsError || "Please enter number of seats");
                        return;
                    }
                    setSubmittingSeats(true);
                    try {
                        await new Promise((r) => setTimeout(r, 400));
                        setShowAddSeatsModal(false);
                        showSuccess(`${seatsCount} additional seats purchased successfully`);
                        setNewSeats("5");
                        setSeatsTouched(false);
                    } finally {
                        setSubmittingSeats(false);
                    }
                }}
                submitLabel={`Purchase ${seatsCount || ""} Seat${seatsCount === 1 ? "" : "s"}`.trim()}
                loading={submittingSeats}
                submitDisabled={!!seatsError || seatsCount < 1}
            >
                <div className="space-y-4">
                    <Field
                        label="Number of Seats"
                        required
                        error={seatsError}
                        hint="Between 1 and 100 seats"
                    >
                        <Input
                            type="number"
                            value={newSeats}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^0-9]/g, "");
                                setNewSeats(v);
                            }}
                            onBlur={() => setSeatsTouched(true)}
                            min={1}
                            max={100}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="p-4 bg-[#FAFBFC] border border-[#EEF1F6] rounded-xl space-y-2.5">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#64748B]">Price per seat</span>
                            <span className="font-semibold text-[#0F172A]">$15/mo</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#64748B]">Seats</span>
                            <span className="font-semibold text-[#0F172A]">× {seatsCount}</span>
                        </div>
                        <div className="h-px bg-[#EEF1F6]" />
                        <div className="flex justify-between items-baseline">
                            <span className="text-[13px] text-[#64748B]">Total monthly</span>
                            <span className="text-lg font-bold text-primary">
                                ${seatsCount * 15}
                                <span className="text-[11px] text-primary/60 font-medium">/mo</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Charge will be prorated to your current billing cycle. Next invoice will include the adjusted amount.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
            </div>
        </div>
    );
}
