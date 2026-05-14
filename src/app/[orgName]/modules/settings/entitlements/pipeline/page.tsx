"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Workflow,
    ArrowRight,
    Network,
    CheckCircle2,
    Settings,
    Timer,
    AlertCircle,
    History,
    Lock,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning } from "@/shared/utils/toast";

type StagnationRule = {
    stage: string;
    maxDays: string;
    alertTier: string;
    action: "Auto-Reassign" | "Notification" | "Manual Review" | "None";
};

export default function PipelineGovernancePage() {
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "";
    const router = useRouter();

    const [schemaOpen, setSchemaOpen] = useState(false);
    const [validating, setValidating] = useState(false);

    const stagnationRules: StagnationRule[] = [
        { stage: "Initial Capture", maxDays: "2 Days", alertTier: "L1 (Team)", action: "Auto-Reassign" },
        { stage: "Discovery Call", maxDays: "5 Days", alertTier: "L2 (Manager)", action: "Notification" },
        { stage: "Proposal Phase", maxDays: "10 Days", alertTier: "L3 (Executive)", action: "Manual Review" },
        { stage: "Closed Won", maxDays: "Indefinite", alertTier: "None", action: "None" },
    ];

    const metrics: Array<{
        label: string;
        value: string;
        sub: string;
        icon: any;
        color: string;
        isHighlight: boolean;
        progress?: number;
        target: string;
    }> = [
        {
            label: "Global Workflows",
            value: "124",
            sub: "Active Institutional Nodes",
            icon: Network,
            color: "text-white",
            isHighlight: true,
            target: "custom-stages",
        },
        {
            label: "Process Velocity",
            value: "14d",
            sub: "Avg. stage duration",
            icon: Timer,
            color: "text-primary",
            isHighlight: false,
            progress: 65,
            target: "process-automation",
        },
        {
            label: "Health State",
            value: "Optimal",
            sub: "0 Flow Deadlocks",
            icon: CheckCircle2,
            color: "text-emerald-600",
            isHighlight: false,
            target: "probability-rules",
        },
        {
            label: "Stagnation Alerts",
            value: "08",
            sub: "Review Required",
            icon: AlertCircle,
            color: "text-rose-500",
            isHighlight: false,
            target: "stagnation-alerts",
        },
    ];

    const automationProtocols = [
        { protocol: "Stage Probability Sync", ok: true },
        { protocol: "Trigger Validation", ok: true },
        { protocol: "Cross-Firm Stages", ok: true },
        { protocol: "Deadlock Detection", ok: true },
    ];

    const visibilityLinks = [
        { label: "Identity Scopes", target: "visibility-rules" as const },
        { label: "Stage Permissions", target: "visibility-rules" as const },
        { label: "Global Stage Mapping", target: "custom-stages" as const },
    ];

    const actionBadge = (action: StagnationRule["action"]) => {
        switch (action) {
            case "Auto-Reassign":
                return "bg-primary/10 text-primary border-primary/20";
            case "Notification":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "Manual Review":
                return "bg-indigo-50 text-indigo-600 border-indigo-100";
            default:
                return "bg-zinc-50 text-zinc-500 border-zinc-200";
        }
    };

    const handleValidate = async () => {
        if (validating) return;
        setValidating(true);
        try {
            await new Promise((r) => setTimeout(r, 900));
            const flawless = stagnationRules.every((r) => r.action !== "None" || r.maxDays === "Indefinite");
            if (flawless) showSuccess("All flows validated — no governance drift detected");
            else showWarning("Some stages lack guardrails — review required");
        } finally {
            setValidating(false);
        }
    };

    const goToSub = (sub: string) => {
        router.push(
            `/${orgName}/modules/settings/entitlements/pipeline/${sub}`
        );
    };

    const ledger = [
        { title: "Stage Compliance", val: "100%", meta: "All firms using master stages" },
        { title: "Avg. Bottleneck", val: "0.2 Days", meta: "Discovery to proposal" },
        { title: "Automation Sync", val: "Active", meta: "Propagated to 32 nodes" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-1">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary/80 to-primary rounded-none flex items-center justify-center text-white shadow-md shadow-primary/30">
                            <Workflow className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                                Pipeline & Process Governance
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                Standardize institutional workflow stages, stagnation alerts, and cross-firm
                                stage-probability rules.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-none border-zinc-200 font-medium text-xs h-9 gap-2"
                            onClick={() => setSchemaOpen(true)}
                        >
                            Flow Schema
                        </Button>
                        <Button
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-9 gap-2 shadow-md shadow-primary/20 px-5"
                            onClick={handleValidate}
                            disabled={validating}
                        >
                            {validating ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Validating...
                                </span>
                            ) : (
                                "Validate Flows"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m, idx) =>
                        m.isHighlight ? (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => goToSub(m.target)}
                                className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left hover:shadow-2xl transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-white text-xs opacity-80">{m.label}</p>
                                        <p className="text-white text-xl font-semibold mt-1">{m.value}</p>
                                        <p className="text-white text-[10px] mt-1 opacity-70">{m.sub}</p>
                                    </div>
                                    <m.icon className="w-5 h-5 text-white" />
                                </div>
                            </button>
                        ) : (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => goToSub(m.target)}
                                className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-zinc-500 text-xs">{m.label}</p>
                                        <p className="text-xl font-semibold text-zinc-900 mt-1">{m.value}</p>
                                        <p className={`text-[10px] mt-1 ${m.color}`}>{m.sub}</p>
                                        {typeof m.progress === "number" && (
                                            <Progress
                                                value={m.progress}
                                                className="h-1 mt-2 bg-zinc-100 [&>div]:bg-primary"
                                            />
                                        )}
                                    </div>
                                    <m.icon className={`w-5 h-5 ${m.color}`} />
                                </div>
                            </button>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div>
                                <h3 className="text-base font-medium text-zinc-900 tracking-tight">
                                    Stage Stagnation Guardrails
                                </h3>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Governing institutional time limits per lifecycle stage.
                                </p>
                            </div>
                            <Button
                                variant="link"
                                className="text-primary text-xs font-medium p-0 h-auto gap-1"
                                onClick={() => goToSub("stagnation-alerts")}
                            >
                                Manage Alerts <ArrowRight size={12} />
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                        <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Standard Stage</th>
                                        <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Max Hold Time</th>
                                        <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Alert Tier</th>
                                        <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Enforcement Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {stagnationRules.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-primary/5 transition-colors"
                                        >
                                            <td className="px-6 py-3">
                                                <p className="text-sm font-semibold text-zinc-900">
                                                    {item.stage}
                                                </p>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-zinc-600 font-medium">
                                                {item.maxDays}
                                            </td>
                                            <td className="px-6 py-3 text-xs text-zinc-500 font-medium">
                                                {item.alertTier}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-none border w-fit ${actionBadge(
                                                        item.action
                                                    )}`}
                                                >
                                                    <span className="text-[10px] font-medium">
                                                        {item.action}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                            <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                                <h3 className="text-base font-medium text-zinc-900 tracking-tight flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-primary" /> Automation Status
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {automationProtocols.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-xs font-medium text-zinc-600">
                                            {p.protocol}
                                        </span>
                                    </div>
                                ))}
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs font-medium text-primary mt-2 hover:no-underline"
                                    onClick={() => goToSub("process-automation")}
                                >
                                    Configure Protocols <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                            <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                                <h3 className="text-base font-medium text-zinc-900 tracking-tight flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" /> Visibility Guardrails
                                </h3>
                            </div>
                            <div className="p-3">
                                <div className="grid grid-cols-1 gap-1.5">
                                    {visibilityLinks.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => goToSub(item.target)}
                                            className="flex items-center justify-between p-2.5 rounded-none border border-transparent hover:border-zinc-200 hover:bg-zinc-50 group transition-all"
                                        >
                                            <span className="text-xs font-medium text-zinc-600 group-hover:text-primary">
                                                {item.label}
                                            </span>
                                            <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-primary" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg p-5">
                    <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
                        <History className="w-4 h-4 text-primary" />
                        <h3 className="text-base font-medium text-zinc-900 tracking-tight">
                            Institutional Flow Integrity Ledger
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ledger.map((log, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-xs text-zinc-500 font-medium">{log.title}</span>
                                <span className="text-lg font-semibold text-zinc-900 mt-1">
                                    {log.val}
                                </span>
                                <span className="text-[10px] text-primary font-medium mt-1">
                                    {log.meta}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <SideFormSheet
                open={schemaOpen}
                onOpenChange={setSchemaOpen}
                title="Global Flow Schema"
                description="Snapshot of institutional pipeline stages and governance guardrails."
                icon={<Workflow className="w-5 h-5" />}
                width="lg"
                hideFooter
            >
                <div className="space-y-5">
                    <div className="p-4 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-[#475569] leading-relaxed">
                                The schema below reflects the current master pipeline. Changes made in Custom
                                Stages propagate to all firms governed by this tenant.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {stagnationRules.map((rule, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 bg-white"
                            >
                                <div className="w-8 h-8 rounded-none bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-semibold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-zinc-900">
                                            {rule.stage}
                                        </p>
                                        <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                            {rule.maxDays}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[11px] text-zinc-500 font-medium">
                                            Alert Tier:
                                        </span>
                                        <span className="text-[11px] text-zinc-700 font-semibold">
                                            {rule.alertTier}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-none border w-fit mt-2 ${actionBadge(
                                            rule.action
                                        )}`}
                                    >
                                        <span className="text-[10px] font-medium">{rule.action}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-lg border-zinc-200 h-10 text-xs font-medium"
                            onClick={() => {
                                setSchemaOpen(false);
                                goToSub("custom-stages");
                            }}
                        >
                            Edit Stages
                        </Button>
                        <Button
                            className="flex-1 rounded-lg bg-primary hover:bg-primary/90 h-10 text-xs font-medium text-white"
                            onClick={() => {
                                setSchemaOpen(false);
                                goToSub("stagnation-alerts");
                            }}
                        >
                            Manage Alerts
                        </Button>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
