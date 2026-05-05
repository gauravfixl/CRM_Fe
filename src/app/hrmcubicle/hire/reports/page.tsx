"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Briefcase,
    Target,
    Award,
    Clock,
    IndianRupee,
    Activity,
    Download,
    Send,
    Mail,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Globe,
    Trophy,
    LineChart,
    Layers,
    Building2,
    X,
    FileText,
    Plus,
    Check,
    Search,
    UserCheck,
    AlertTriangle,
    Star,
    Medal,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";

import { useHireStore } from "@/shared/data/hire-store";

/* ============================================================
   CONSTANTS / THEME
   ============================================================ */
const VIOLET = "#8B5CF6";
const EMERALD = "#10B981";
const ROSE = "#F43F5E";
const AMBER = "#F59E0B";
const INDIGO = "#6366F1";
const BLUE = "#3B82F6";
const SLATE = "#64748B";

const CARD = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const MICRO_LABEL = "text-[10px] uppercase tracking-wider font-semibold text-slate-500";
const MICRO_LABEL_11 = "text-[11px] uppercase tracking-wider font-semibold text-slate-500";
const BIG_NUM = "text-2xl font-bold tabular-nums text-slate-900";

const TIME_RANGES: { value: string; label: string }[] = [
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
];

const INDUSTRY_BENCHMARKS = {
    timeToHire: { industry: 38, topQuartile: 25, label: "Time-to-Hire (days)" },
    offerAcceptance: { industry: 72, topQuartile: 88, label: "Offer Acceptance (%)" },
    costPerHire: { industry: 52000, topQuartile: 38000, label: "Cost Per Hire (INR)" },
    withdrawalRate: { industry: 12, topQuartile: 5, label: "Withdrawal Rate (%)" },
    sourceDiversity: { industry: 0.22, topQuartile: 0.38, label: "Source Diversity Index" },
    applicationsPerHire: { industry: 28, topQuartile: 15, label: "Applications per Hire" },
};

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
interface DeltaPillProps {
    value: number;
    inverse?: boolean;
}
const DeltaPill: React.FC<DeltaPillProps> = ({ value, inverse = false }) => {
    const positive = inverse ? value < 0 : value >= 0;
    const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
    return (
        <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                positive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
            }`}
        >
            <Icon className="h-2.5 w-2.5" />
            {Math.abs(value).toFixed(1)}%
        </span>
    );
};

interface KpiCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    delta: number;
    tint: string;
    sub?: string;
    inverse?: boolean;
}
const KpiCard: React.FC<KpiCardProps> = ({
    icon: Icon,
    label,
    value,
    delta,
    tint,
    sub,
    inverse = false,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`${CARD} p-4 hover:shadow-md transition-shadow`}
    >
        <div className="flex items-start justify-between">
            <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center`}
                style={{ backgroundColor: `${tint}15` }}
            >
                <Icon className="h-4 w-4" style={{ color: tint }} />
            </div>
            <DeltaPill value={delta} inverse={inverse} />
        </div>
        <div className={`${MICRO_LABEL} mt-3`}>{label}</div>
        <div className={`${BIG_NUM} mt-1`}>{value}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </motion.div>
);

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
    <div className="flex items-start justify-between mb-4">
        <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            {subtitle && (
                <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>
            )}
        </div>
        {action}
    </div>
);

/* ============================================================
   CHART PRIMITIVES (SVG-BASED)
   ============================================================ */
interface LineChartProps {
    points: number[];
    labels: string[];
    color?: string;
    height?: number;
    onPointClick?: (i: number) => void;
}
const SvgLineChart: React.FC<LineChartProps> = ({
    points,
    labels,
    color = VIOLET,
    height = 180,
    onPointClick,
}) => {
    const width = 600;
    const padding = { top: 18, right: 20, bottom: 28, left: 34 };
    const max = Math.max(...points, 1);
    const min = 0;
    const w = width - padding.left - padding.right;
    const h = height - padding.top - padding.bottom;
    const step = points.length > 1 ? w / (points.length - 1) : 0;

    const coords = points.map((p, i) => ({
        x: padding.left + i * step,
        y: padding.top + h - ((p - min) / (max - min || 1)) * h,
    }));

    const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const fillPath = `M ${padding.left},${padding.top + h} L ${polyline
        .split(" ")
        .join(" L ")} L ${padding.left + (points.length - 1) * step},${
        padding.top + h
    } Z`;

    const gridLines = 4;
    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            {Array.from({ length: gridLines + 1 }).map((_, i) => {
                const y = padding.top + (h * i) / gridLines;
                return (
                    <line
                        key={i}
                        x1={padding.left}
                        x2={padding.left + w}
                        y1={y}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray="3 3"
                    />
                );
            })}

            {Array.from({ length: gridLines + 1 }).map((_, i) => {
                const v = Math.round((max * (gridLines - i)) / gridLines);
                const y = padding.top + (h * i) / gridLines;
                return (
                    <text
                        key={i}
                        x={padding.left - 6}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#94A3B8"
                    >
                        {v}
                    </text>
                );
            })}

            <motion.path
                d={fillPath}
                fill="url(#lineFill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            />

            <motion.polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />

            {coords.map((c, i) => (
                <motion.circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r={3.5}
                    fill="#FFFFFF"
                    stroke={color}
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => onPointClick?.(i)}
                />
            ))}

            {labels.map((lbl, i) => (
                <text
                    key={i}
                    x={padding.left + i * step}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#64748B"
                >
                    {lbl}
                </text>
            ))}
        </svg>
    );
};

interface BarDatum {
    label: string;
    value: number;
    color?: string;
}
interface SvgBarChartProps {
    data: BarDatum[];
    onBarClick?: (i: number) => void;
    unit?: string;
}
const SvgHorizontalBarChart: React.FC<SvgBarChartProps> = ({
    data,
    onBarClick,
    unit = "",
}) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="space-y-2.5">
            {data.map((d, i) => {
                const pct = (d.value / max) * 100;
                return (
                    <motion.div
                        key={`${d.label}-${i}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="cursor-pointer"
                        onClick={() => onBarClick?.(i)}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-medium text-slate-700">
                                {d.label}
                            </span>
                            <span className="text-[11px] tabular-nums font-semibold text-slate-900">
                                {d.value}
                                {unit}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: i * 0.05 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: d.color || VIOLET }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

interface RadialStage {
    label: string;
    value: number;
    max: number;
    color: string;
}
const RadialProgress: React.FC<{ stage: RadialStage; index: number }> = ({
    stage,
    index,
}) => {
    const size = 96;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = Math.min(stage.value / (stage.max || 1), 1);
    const dash = circ * pct;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="flex flex-col items-center"
        >
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth={stroke}
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={stage.color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circ}`}
                        initial={{ strokeDasharray: `0 ${circ}` }}
                        animate={{ strokeDasharray: `${dash} ${circ}` }}
                        transition={{ duration: 1, delay: index * 0.08 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold tabular-nums text-slate-900">
                        {stage.value}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-500">
                        of {stage.max}
                    </div>
                </div>
            </div>
            <div className="text-[11px] font-semibold text-slate-700 mt-2">
                {stage.label}
            </div>
            <div className="text-[10px] text-slate-500 tabular-nums">
                {Math.round(pct * 100)}%
            </div>
        </motion.div>
    );
};

interface FunnelDatum {
    label: string;
    value: number;
    color: string;
}
const SvgFunnel: React.FC<{
    data: FunnelDatum[];
    onStageClick?: (i: number) => void;
}> = ({ data, onStageClick }) => {
    const max = data[0]?.value || 1;
    return (
        <div className="space-y-1.5">
            {data.map((d, i) => {
                const pct = Math.max((d.value / max) * 100, 6);
                const prev = i > 0 ? data[i - 1].value : d.value;
                const drop =
                    i > 0 && prev > 0
                        ? Math.round(((prev - d.value) / prev) * 100)
                        : 0;
                return (
                    <div key={d.label}>
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0.6 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => onStageClick?.(i)}
                            className="relative mx-auto rounded-xl flex items-center justify-between px-4 py-3 cursor-pointer hover:shadow-md transition-shadow"
                            style={
                                {
                                    transformOrigin: "center",
                                    width: `${pct}%`,
                                    minWidth: 220,
                                    backgroundColor: d.color,
                                } as React.CSSProperties
                            }
                        >
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
                                {d.label}
                            </span>
                            <span className="text-lg font-bold tabular-nums text-white">
                                {d.value}
                            </span>
                        </motion.div>
                        {i > 0 && (
                            <div className="flex items-center justify-center my-0.5 text-[10px]">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                                        drop > 60
                                            ? "bg-rose-50 text-rose-700"
                                            : drop > 30
                                              ? "bg-amber-50 text-amber-700"
                                              : "bg-emerald-50 text-emerald-700"
                                    }`}
                                >
                                    <ArrowDownRight className="h-2.5 w-2.5" />
                                    {drop}% drop-off
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

interface BoxPlotDatum {
    label: string;
    min: number;
    avg: number;
    max: number;
}
const SvgBoxPlot: React.FC<{ data: BoxPlotDatum[] }> = ({ data }) => {
    const globalMax = Math.max(...data.map((d) => d.max), 1);
    const width = 540;
    const rowH = 36;
    const height = data.length * rowH + 28;
    const padLeft = 110;
    const padRight = 20;
    const innerW = width - padLeft - padRight;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            preserveAspectRatio="none"
        >
            {data.map((d, i) => {
                const y = i * rowH + 14;
                const xMin = padLeft + (d.min / globalMax) * innerW;
                const xAvg = padLeft + (d.avg / globalMax) * innerW;
                const xMax = padLeft + (d.max / globalMax) * innerW;
                return (
                    <g key={d.label}>
                        <text
                            x={padLeft - 8}
                            y={y + 5}
                            textAnchor="end"
                            fontSize="10"
                            fill="#475569"
                            fontWeight={600}
                        >
                            {d.label}
                        </text>
                        <line
                            x1={xMin}
                            x2={xMax}
                            y1={y}
                            y2={y}
                            stroke="#CBD5E1"
                            strokeWidth={2}
                        />
                        <line
                            x1={xMin}
                            x2={xMin}
                            y1={y - 6}
                            y2={y + 6}
                            stroke="#94A3B8"
                            strokeWidth={2}
                        />
                        <line
                            x1={xMax}
                            x2={xMax}
                            y1={y - 6}
                            y2={y + 6}
                            stroke="#94A3B8"
                            strokeWidth={2}
                        />
                        <motion.rect
                            initial={{ width: 0 }}
                            animate={{ width: xMax - xMin }}
                            transition={{ duration: 0.7, delay: i * 0.06 }}
                            x={xMin}
                            y={y - 6}
                            height={12}
                            fill={VIOLET}
                            fillOpacity={0.18}
                            rx={3}
                        />
                        <motion.circle
                            initial={{ r: 0 }}
                            animate={{ r: 5 }}
                            transition={{ delay: i * 0.06 + 0.4 }}
                            cx={xAvg}
                            cy={y}
                            fill={VIOLET}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                        />
                        <text
                            x={xMax + 6}
                            y={y + 4}
                            fontSize="9"
                            fill="#475569"
                            fontWeight={600}
                        >
                            {d.avg}d
                        </text>
                    </g>
                );
            })}
            <text
                x={padLeft}
                y={height - 4}
                fontSize="9"
                fill="#94A3B8"
            >
                0d
            </text>
            <text
                x={padLeft + innerW}
                y={height - 4}
                fontSize="9"
                fill="#94A3B8"
                textAnchor="end"
            >
                {globalMax}d
            </text>
        </svg>
    );
};

interface HeatmapProps {
    data: number[][]; // rows: days, cols: hours (e.g. 7 × 12)
    rowLabels: string[];
    colLabels: string[];
}
const SvgHeatmap: React.FC<HeatmapProps> = ({ data, rowLabels, colLabels }) => {
    const max = Math.max(...data.flat(), 1);
    return (
        <div className="overflow-x-auto">
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `auto repeat(${colLabels.length}, minmax(28px, 1fr))`,
                }}
            >
                <div />
                {colLabels.map((c) => (
                    <div
                        key={c}
                        className="text-[9px] text-slate-500 text-center font-medium"
                    >
                        {c}
                    </div>
                ))}
                {data.map((row, ri) => (
                    <React.Fragment key={ri}>
                        <div className="text-[10px] text-slate-600 font-semibold pr-2 text-right flex items-center justify-end">
                            {rowLabels[ri]}
                        </div>
                        {row.map((v, ci) => {
                            const intensity = v / max;
                            return (
                                <motion.div
                                    key={ci}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        delay: (ri * row.length + ci) * 0.008,
                                    }}
                                    title={`${rowLabels[ri]} ${colLabels[ci]}: ${v}`}
                                    className="rounded-md h-6"
                                    style={{
                                        backgroundColor:
                                            v === 0
                                                ? "#F1F5F9"
                                                : `rgba(139, 92, 246, ${0.15 + intensity * 0.85})`,
                                    }}
                                />
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

/* ============================================================
   PAGE COMPONENT
   ============================================================ */
const HiringReportsPage: React.FC = () => {
    const { jobs, candidates, interviews, offers } = useHireStore();
    const { toast } = useToast();

    /* ----- state ----- */
    const [timeRange, setTimeRange] = useState<string>("this_quarter");
    const [customStart, setCustomStart] = useState<string>("");
    const [customEnd, setCustomEnd] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("overview");

    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [builderOpen, setBuilderOpen] = useState(false);
    const [benchmarkOpen, setBenchmarkOpen] = useState(false);

    const [detailCtx, setDetailCtx] = useState<{
        title: string;
        subtitle?: string;
        candidates: typeof candidates;
    } | null>(null);

    /* ----- date window ----- */
    const dateWindow = useMemo(() => {
        const now = new Date();
        let start = new Date();
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        switch (timeRange) {
            case "this_week":
                start = new Date(now);
                start.setDate(start.getDate() - 7);
                break;
            case "this_month":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "this_quarter": {
                const q = Math.floor(now.getMonth() / 3);
                start = new Date(now.getFullYear(), q * 3, 1);
                break;
            }
            case "this_year":
                start = new Date(now.getFullYear(), 0, 1);
                break;
            case "custom":
                start = customStart ? new Date(customStart) : new Date(now.getFullYear(), 0, 1);
                if (customEnd) {
                    const e = new Date(customEnd);
                    e.setHours(23, 59, 59, 999);
                    return { start, end: e };
                }
                break;
            default:
                start = new Date(now.getFullYear(), 0, 1);
        }
        return { start, end };
    }, [timeRange, customStart, customEnd]);

    const prevWindow = useMemo(() => {
        const span =
            dateWindow.end.getTime() - dateWindow.start.getTime();
        return {
            start: new Date(dateWindow.start.getTime() - span),
            end: new Date(dateWindow.start.getTime() - 1),
        };
    }, [dateWindow]);

    /* ----- helpers ----- */
    const inWindow = (dateStr?: string, w = dateWindow) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return false;
        return d >= w.start && d <= w.end;
    };

    /* ----- derived slices ----- */
    const scopedCandidates = useMemo(
        () => candidates.filter((c) => inWindow(c.appliedDate)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [candidates, dateWindow]
    );
    const scopedOffers = useMemo(
        () => offers.filter((o) => inWindow(o.createdAt)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [offers, dateWindow]
    );
    const scopedInterviews = useMemo(
        () => interviews.filter((i) => inWindow(i.date)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [interviews, dateWindow]
    );

    /* ----- KPIs ----- */
    const kpis = useMemo(() => {
        const hired = candidates.filter(
            (c) => c.stage === "Hired" && inWindow(c.stageEnteredDate)
        );
        const hiredPrev = candidates.filter(
            (c) => c.stage === "Hired" && inWindow(c.stageEnteredDate, prevWindow)
        );
        const activeJobs = jobs.filter((j) => j.workflowStatus === "Active");
        const sentOffers = scopedOffers.filter(
            (o) => o.approvalStatus === "Sent" || o.approvalStatus === "Accepted" || o.approvalStatus === "Rejected"
        );
        const acceptedOffers = scopedOffers.filter(
            (o) => o.approvalStatus === "Accepted"
        );
        const acceptance =
            sentOffers.length > 0
                ? Math.round((acceptedOffers.length / sentOffers.length) * 100)
                : 0;

        // mock time-to-hire ~ variance per hire
        const timesToHire = hired.map((c) => {
            const applied = new Date(c.appliedDate).getTime();
            const hiredAt = new Date(c.stageEnteredDate).getTime();
            const days = Math.round((hiredAt - applied) / (1000 * 60 * 60 * 24));
            return isFinite(days) && days > 0 ? days : 32;
        });
        const avgTTH = timesToHire.length
            ? Math.round(timesToHire.reduce((a, b) => a + b, 0) / timesToHire.length)
            : 32;

        const withdrawn = candidates.filter(
            (c) => c.stage === "Rejected" && inWindow(c.stageEnteredDate)
        );
        const withdrawalRate =
            scopedCandidates.length > 0
                ? Math.round((withdrawn.length / scopedCandidates.length) * 100)
                : 0;

        const uniqueSources = new Set(scopedCandidates.map((c) => c.source)).size;
        const diversity =
            scopedCandidates.length > 0
                ? uniqueSources / scopedCandidates.length
                : 0;

        const costPerHire = Math.round(
            38000 + ((hired.length % 7) * 1200) + (avgTTH * 250)
        );

        const offerToAccept =
            scopedOffers.length > 0
                ? Math.round((acceptedOffers.length / scopedOffers.length) * 100)
                : 0;

        const delta = (cur: number, prev: number) => {
            if (prev === 0 && cur === 0) return 0;
            if (prev === 0) return cur > 0 ? 100 : 0;
            return ((cur - prev) / prev) * 100;
        };

        return {
            totalHired: hired.length,
            totalHiredDelta: delta(hired.length, hiredPrev.length),
            activeJobs: activeJobs.length,
            activeJobsDelta: 3.2,
            acceptance,
            acceptanceDelta: 4.8,
            avgTTH,
            avgTTHDelta: -6.4,
            costPerHire,
            costPerHireDelta: -2.1,
            offerToAccept,
            offerToAcceptDelta: 5.9,
            withdrawalRate,
            withdrawalRateDelta: -3.3,
            diversity: Number(diversity.toFixed(2)),
            diversityDelta: 4.2,
        };
    }, [candidates, jobs, scopedOffers, scopedCandidates, dateWindow, prevWindow]);

    /* ----- hiring velocity (week-over-week hires) ----- */
    const velocity = useMemo(() => {
        const weeks = 12;
        const now = dateWindow.end;
        const buckets: number[] = Array(weeks).fill(0);
        const labels: string[] = [];
        for (let i = 0; i < weeks; i++) {
            const end = new Date(now);
            end.setDate(now.getDate() - (weeks - 1 - i) * 7);
            labels.push(`W${weeks - i}`);
        }
        labels.reverse();
        candidates.forEach((c) => {
            if (c.stage !== "Hired") return;
            const t = new Date(c.stageEnteredDate).getTime();
            for (let i = 0; i < weeks; i++) {
                const end = new Date(now);
                end.setDate(now.getDate() - (weeks - 1 - i) * 7);
                const start = new Date(end);
                start.setDate(end.getDate() - 7);
                if (t >= start.getTime() && t <= end.getTime()) {
                    buckets[i] += 1;
                    break;
                }
            }
        });
        // seed a minimal curve if data is sparse
        if (buckets.reduce((a, b) => a + b, 0) === 0) {
            buckets.splice(0, buckets.length, 2, 3, 4, 3, 5, 6, 5, 7, 8, 6, 9, 8);
        }
        return { points: buckets, labels };
    }, [candidates, dateWindow]);

    /* ----- funnel ----- */
    const funnelData: FunnelDatum[] = useMemo(() => {
        const applied = scopedCandidates.length;
        const screening = scopedCandidates.filter(
            (c) => c.stage !== "New"
        ).length;
        const interview = scopedCandidates.filter((c) =>
            ["Interview", "Offer", "Hired"].includes(c.stage)
        ).length;
        const offer = scopedCandidates.filter((c) =>
            ["Offer", "Hired"].includes(c.stage)
        ).length;
        const hired = scopedCandidates.filter((c) => c.stage === "Hired").length;
        return [
            { label: "Applied", value: applied, color: INDIGO },
            { label: "Screening", value: screening, color: BLUE },
            { label: "Interview", value: interview, color: VIOLET },
            { label: "Offer", value: offer, color: AMBER },
            { label: "Hired", value: hired, color: EMERALD },
        ];
    }, [scopedCandidates]);

    const bottleneckStage = useMemo(() => {
        let worst = { idx: 0, drop: 0 };
        for (let i = 1; i < funnelData.length; i++) {
            const prev = funnelData[i - 1].value;
            const cur = funnelData[i].value;
            if (prev > 0) {
                const drop = ((prev - cur) / prev) * 100;
                if (drop > worst.drop) worst = { idx: i, drop };
            }
        }
        return { ...worst, stage: funnelData[worst.idx]?.label };
    }, [funnelData]);

    /* ----- pipeline health (radial) ----- */
    const pipelineRadials: RadialStage[] = useMemo(() => {
        const total = Math.max(scopedCandidates.length, 1);
        return [
            {
                label: "Applied",
                value: scopedCandidates.length,
                max: total,
                color: INDIGO,
            },
            {
                label: "Screening",
                value: scopedCandidates.filter((c) => c.stage === "Screening")
                    .length,
                max: total,
                color: BLUE,
            },
            {
                label: "Interview",
                value: scopedCandidates.filter((c) => c.stage === "Interview")
                    .length,
                max: total,
                color: VIOLET,
            },
            {
                label: "Offer",
                value: scopedCandidates.filter((c) => c.stage === "Offer").length,
                max: total,
                color: AMBER,
            },
            {
                label: "Hired",
                value: scopedCandidates.filter((c) => c.stage === "Hired").length,
                max: total,
                color: EMERALD,
            },
        ];
    }, [scopedCandidates]);

    /* ----- top jobs / stuck jobs ----- */
    const topJobs = useMemo(() => {
        return jobs
            .map((j) => {
                const jc = scopedCandidates.filter((c) => c.jobId === j.id);
                const hired = jc.filter((c) => c.stage === "Hired").length;
                return { ...j, applicants: jc.length, hired };
            })
            .sort((a, b) => b.hired - a.hired || b.applicants - a.applicants)
            .slice(0, 5);
    }, [jobs, scopedCandidates]);

    const stuckJobs = useMemo(() => {
        return jobs
            .filter((j) => j.workflowStatus === "Active")
            .map((j) => {
                const jc = scopedCandidates.filter((c) => c.jobId === j.id);
                const daysOpen = Math.max(
                    1,
                    Math.round(
                        (Date.now() - new Date(j.postedDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                    )
                );
                return { ...j, applicants: jc.length, daysOpen };
            })
            .sort((a, b) => b.daysOpen - a.daysOpen)
            .slice(0, 5);
    }, [jobs, scopedCandidates]);

    /* ----- sources ----- */
    const sourcesAnalytics = useMemo(() => {
        const groups: Record<string, { total: number; hired: number; tths: number[] }> = {};
        scopedCandidates.forEach((c) => {
            const key = c.source || "Other";
            if (!groups[key]) groups[key] = { total: 0, hired: 0, tths: [] };
            groups[key].total += 1;
            if (c.stage === "Hired") {
                groups[key].hired += 1;
                const days = Math.round(
                    (new Date(c.stageEnteredDate).getTime() -
                        new Date(c.appliedDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                if (isFinite(days) && days > 0) groups[key].tths.push(days);
            }
        });
        return Object.entries(groups)
            .map(([source, v]) => {
                const avgTTH = v.tths.length
                    ? Math.round(v.tths.reduce((a, b) => a + b, 0) / v.tths.length)
                    : 30 + (source.length % 10);
                const conv = v.total > 0 ? Math.round((v.hired / v.total) * 100) : 0;
                const cost = 25000 + ((source.length * 1300) % 30000);
                return {
                    source,
                    total: v.total,
                    hired: v.hired,
                    conv,
                    avgTTH,
                    cost,
                };
            })
            .sort((a, b) => b.total - a.total);
    }, [scopedCandidates]);

    /* ----- departments ----- */
    const departmentAnalytics = useMemo(() => {
        const groups: Record<
            string,
            { openRoles: number; applied: number; hired: number; tths: number[] }
        > = {};
        jobs.forEach((j) => {
            const key = j.department || "Unassigned";
            if (!groups[key])
                groups[key] = { openRoles: 0, applied: 0, hired: 0, tths: [] };
            if (j.workflowStatus === "Active") groups[key].openRoles += 1;
        });
        scopedCandidates.forEach((c) => {
            const job = jobs.find((j) => j.id === c.jobId);
            const key = job?.department || "Unassigned";
            if (!groups[key])
                groups[key] = { openRoles: 0, applied: 0, hired: 0, tths: [] };
            groups[key].applied += 1;
            if (c.stage === "Hired") {
                groups[key].hired += 1;
                const days = Math.round(
                    (new Date(c.stageEnteredDate).getTime() -
                        new Date(c.appliedDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                if (isFinite(days) && days > 0) groups[key].tths.push(days);
            }
        });
        return Object.entries(groups).map(([dept, v]) => ({
            dept,
            openRoles: v.openRoles,
            applied: v.applied,
            hired: v.hired,
            conv: v.applied > 0 ? Math.round((v.hired / v.applied) * 100) : 0,
            avgTTH: v.tths.length
                ? Math.round(v.tths.reduce((a, b) => a + b, 0) / v.tths.length)
                : 30,
        }));
    }, [jobs, scopedCandidates]);

    /* ----- time-to-hire per stage (box plot) ----- */
    const stageBoxPlot: BoxPlotDatum[] = useMemo(() => {
        const stageDays = [
            { label: "Applied -> Screening", min: 1, avg: 3, max: 8 },
            { label: "Screening -> Interview", min: 2, avg: 5, max: 14 },
            { label: "Interview -> Offer", min: 3, avg: 9, max: 22 },
            { label: "Offer -> Signed", min: 1, avg: 4, max: 12 },
            { label: "Signed -> Joined", min: 7, avg: 21, max: 60 },
        ];
        // blend candidate data into means
        const hired = candidates.filter((c) => c.stage === "Hired");
        if (hired.length > 0) {
            const adj = Math.min(
                8,
                Math.round(
                    hired.reduce((acc, c) => {
                        const t =
                            (new Date(c.stageEnteredDate).getTime() -
                                new Date(c.appliedDate).getTime()) /
                            (1000 * 60 * 60 * 24);
                        return acc + (isFinite(t) ? t : 30);
                    }, 0) / hired.length / 5
                )
            );
            return stageDays.map((s, i) => ({
                ...s,
                avg: s.avg + (i === 2 ? adj : 0),
            }));
        }
        return stageDays;
    }, [candidates]);

    const positionTTH: BoxPlotDatum[] = useMemo(() => {
        return jobs.slice(0, 8).map((j) => {
            const jc = candidates.filter(
                (c) => c.jobId === j.id && c.stage === "Hired"
            );
            const days = jc.map((c) =>
                Math.round(
                    (new Date(c.stageEnteredDate).getTime() -
                        new Date(c.appliedDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                )
            );
            const valid = days.filter((d) => isFinite(d) && d > 0);
            const min = valid.length ? Math.min(...valid) : 20;
            const max = valid.length ? Math.max(...valid) : 55;
            const avg = valid.length
                ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
                : 36;
            return { label: j.title, min, avg, max };
        });
    }, [jobs, candidates]);

    /* ----- interviewer performance ----- */
    const interviewerPerf = useMemo(() => {
        const agg: Record<
            string,
            {
                name: string;
                conducted: number;
                ratings: number[];
                recs: { hire: number; total: number };
                feedbackTimes: number[];
            }
        > = {};
        interviews.forEach((i) => {
            const panel = i.panel || [];
            const names: { id: string; name: string }[] = panel.length
                ? panel.map((p) => ({ id: p.employeeId, name: p.name }))
                : i.interviewers.map((id) => ({ id, name: id }));
            names.forEach(({ id, name }) => {
                if (!agg[id])
                    agg[id] = {
                        name,
                        conducted: 0,
                        ratings: [],
                        recs: { hire: 0, total: 0 },
                        feedbackTimes: [],
                    };
                agg[id].conducted += 1;
                const sc = i.scorecards.find(
                    (s) => s.interviewerId === id
                );
                if (sc) {
                    agg[id].ratings.push(sc.overallScore);
                    agg[id].recs.total += 1;
                    if (
                        sc.recommendation === "Hire" ||
                        sc.recommendation === "Strong Hire"
                    ) {
                        agg[id].recs.hire += 1;
                    }
                    const submitted = new Date(sc.submittedAt).getTime();
                    const interview = new Date(i.date).getTime();
                    const hrs = (submitted - interview) / (1000 * 60 * 60);
                    if (isFinite(hrs) && hrs > 0) agg[id].feedbackTimes.push(hrs);
                }
            });
        });
        return Object.entries(agg)
            .map(([id, v]) => ({
                id,
                name: v.name,
                conducted: v.conducted,
                avgRating: v.ratings.length
                    ? Number(
                          (
                              v.ratings.reduce((a, b) => a + b, 0) /
                              v.ratings.length
                          ).toFixed(1)
                      )
                    : 0,
                hireRate:
                    v.recs.total > 0
                        ? Math.round((v.recs.hire / v.recs.total) * 100)
                        : 0,
                feedbackHrs: v.feedbackTimes.length
                    ? Math.round(
                          v.feedbackTimes.reduce((a, b) => a + b, 0) /
                              v.feedbackTimes.length
                      )
                    : 24,
            }))
            .sort(
                (a, b) =>
                    b.avgRating - a.avgRating ||
                    b.conducted - a.conducted
            );
    }, [interviews]);

    /* ----- interview load heatmap (day × hour-slot) ----- */
    const heatmapData = useMemo(() => {
        const rows = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const cols = ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"];
        const grid: number[][] = rows.map(() => cols.map(() => 0));
        scopedInterviews.forEach((i) => {
            const d = new Date(i.date);
            if (isNaN(d.getTime())) return;
            const dayIdx = (d.getDay() + 6) % 7; // Mon=0
            const hr = parseInt((i.time || "10:00").split(":")[0], 10);
            const ci = Math.max(0, Math.min(cols.length - 1, hr - 9));
            grid[dayIdx][ci] += 1;
        });
        // seed pattern if empty
        if (grid.flat().reduce((a, b) => a + b, 0) === 0) {
            for (let r = 0; r < 5; r++)
                for (let c = 0; c < cols.length; c++)
                    grid[r][c] =
                        Math.max(0, Math.round(Math.sin((r + c) / 2) * 3 + 2));
        }
        return { grid, rows, cols };
    }, [scopedInterviews]);

    /* ----- sparkline for mini trend ----- */
    const applicationsTrend = useMemo(() => {
        const weeks = 8;
        const points = Array(weeks).fill(0);
        const labels = Array(weeks)
            .fill(0)
            .map((_, i) => `W${i + 1}`);
        const now = dateWindow.end;
        scopedCandidates.forEach((c) => {
            const t = new Date(c.appliedDate).getTime();
            for (let i = 0; i < weeks; i++) {
                const end = new Date(now);
                end.setDate(now.getDate() - (weeks - 1 - i) * 7);
                const start = new Date(end);
                start.setDate(end.getDate() - 7);
                if (t >= start.getTime() && t <= end.getTime()) {
                    points[i] += 1;
                    break;
                }
            }
        });
        if (points.reduce((a, b) => a + b, 0) === 0) {
            points.splice(0, points.length, 12, 18, 15, 24, 20, 32, 28, 38);
        }
        return { points, labels };
    }, [scopedCandidates, dateWindow]);

    /* ----- body overflow ----- */
    useEffect(() => {
        document.body.style.overflow = "auto";
    }, []);

    /* ----- handlers ----- */
    const handleExportCsv = () => {
        const lines: string[] = [];
        lines.push("HIRING REPORT");
        lines.push(`Generated,${new Date().toLocaleString()}`);
        lines.push(`Range,${timeRange}`);
        lines.push("");
        lines.push("KPI,Value");
        lines.push(`Total Hired,${kpis.totalHired}`);
        lines.push(`Active Jobs,${kpis.activeJobs}`);
        lines.push(`Offer Acceptance %,${kpis.acceptance}`);
        lines.push(`Avg Time-to-Hire,${kpis.avgTTH}d`);
        lines.push(`Cost Per Hire,INR ${kpis.costPerHire}`);
        lines.push(`Offer-to-Accept %,${kpis.offerToAccept}`);
        lines.push(`Withdrawal Rate %,${kpis.withdrawalRate}`);
        lines.push(`Source Diversity,${kpis.diversity}`);
        lines.push("");
        lines.push("Funnel Stage,Count");
        funnelData.forEach((f) => lines.push(`${f.label},${f.value}`));
        lines.push("");
        lines.push("Source,Total,Hired,Conv %,Avg TTH,Cost");
        sourcesAnalytics.forEach((s) =>
            lines.push(
                `${s.source},${s.total},${s.hired},${s.conv},${s.avgTTH},${s.cost}`
            )
        );
        const csv = lines.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hiring-report-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Export complete", description: "CSV downloaded." });
    };

    const handleExportPdf = () => {
        toast({
            title: "PDF export queued",
            description: "PDF rendering is queued; CSV recommended for now.",
        });
    };

    const openDrilldownForStage = (stageLabel: string) => {
        let list = scopedCandidates;
        if (stageLabel === "Applied") list = scopedCandidates;
        else if (stageLabel === "Screening")
            list = scopedCandidates.filter(
                (c) => c.stage !== "New"
            );
        else if (stageLabel === "Interview")
            list = scopedCandidates.filter((c) =>
                ["Interview", "Offer", "Hired"].includes(c.stage)
            );
        else if (stageLabel === "Offer")
            list = scopedCandidates.filter((c) =>
                ["Offer", "Hired"].includes(c.stage)
            );
        else if (stageLabel === "Hired")
            list = scopedCandidates.filter((c) => c.stage === "Hired");
        setDetailCtx({
            title: `${stageLabel} stage`,
            subtitle: `${list.length} candidates in scope`,
            candidates: list.slice(0, 40),
        });
        setDetailOpen(true);
    };

    const openDrilldownForSource = (source: string) => {
        const list = scopedCandidates.filter((c) => c.source === source);
        setDetailCtx({
            title: `Source: ${source}`,
            subtitle: `${list.length} candidates from ${source}`,
            candidates: list.slice(0, 40),
        });
        setDetailOpen(true);
    };

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <div className="font-sans min-h-screen bg-[#FAFAFB] p-5 space-y-5">
            {/* ========== Header ========== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Hiring Reports
                    </h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                        Analytics, funnel & trend insights
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white w-[160px] text-[12px]">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIME_RANGES.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {timeRange === "custom" && (
                        <div className="flex items-center gap-1.5">
                            <Input
                                type="date"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="h-9 w-[140px] rounded-xl border-slate-200 text-[12px]"
                            />
                            <span className="text-slate-400 text-[12px]">to</span>
                            <Input
                                type="date"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="h-9 w-[140px] rounded-xl border-slate-200 text-[12px]"
                            />
                        </div>
                    )}

                    <Button
                        variant="outline"
                        onClick={handleExportPdf}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Export PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setExportOpen(true)}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setScheduleOpen(true)}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Schedule report
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setBuilderOpen(true)}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        Custom report
                    </Button>
                    <Button
                        onClick={() => setBenchmarkOpen(true)}
                        className="h-9 rounded-xl text-[12px] text-white"
                        style={{ backgroundColor: VIOLET }}
                    >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Benchmarks
                    </Button>
                </div>
            </div>

            {/* ========== KPI Row (8 cards) ========== */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-3">
                <KpiCard
                    icon={Trophy}
                    label="Total Hired"
                    value={kpis.totalHired}
                    delta={kpis.totalHiredDelta}
                    tint={EMERALD}
                    sub="vs previous period"
                />
                <KpiCard
                    icon={Briefcase}
                    label="Active Jobs"
                    value={kpis.activeJobs}
                    delta={kpis.activeJobsDelta}
                    tint={INDIGO}
                    sub="currently open"
                />
                <KpiCard
                    icon={Target}
                    label="Offer Acceptance"
                    value={`${kpis.acceptance}%`}
                    delta={kpis.acceptanceDelta}
                    tint={VIOLET}
                    sub="accepted / sent"
                />
                <KpiCard
                    icon={Clock}
                    label="Avg Time-to-Hire"
                    value={`${kpis.avgTTH}d`}
                    delta={kpis.avgTTHDelta}
                    tint={AMBER}
                    sub="days per hire"
                    inverse
                />
                <KpiCard
                    icon={IndianRupee}
                    label="Cost Per Hire"
                    value={`INR ${Math.round(kpis.costPerHire / 1000)}k`}
                    delta={kpis.costPerHireDelta}
                    tint={ROSE}
                    sub="all-in cost"
                    inverse
                />
                <KpiCard
                    icon={UserCheck}
                    label="Offer-to-Accept"
                    value={`${kpis.offerToAccept}%`}
                    delta={kpis.offerToAcceptDelta}
                    tint={BLUE}
                    sub="all offers scope"
                />
                <KpiCard
                    icon={AlertTriangle}
                    label="Withdrawal Rate"
                    value={`${kpis.withdrawalRate}%`}
                    delta={kpis.withdrawalRateDelta}
                    tint={ROSE}
                    sub="candidate drop"
                    inverse
                />
                <KpiCard
                    icon={Globe}
                    label="Source Diversity"
                    value={kpis.diversity.toFixed(2)}
                    delta={kpis.diversityDelta}
                    tint={VIOLET}
                    sub="index 0-1"
                />
            </div>

            {/* ========== Tabs ========== */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
                    <TabsTrigger value="overview" className="text-[12px]">
                        <Activity className="h-3.5 w-3.5 mr-1.5" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="funnel" className="text-[12px]">
                        <LineChart className="h-3.5 w-3.5 mr-1.5" />
                        Funnel
                    </TabsTrigger>
                    <TabsTrigger value="sources" className="text-[12px]">
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                        Sources
                    </TabsTrigger>
                    <TabsTrigger value="departments" className="text-[12px]">
                        <Building2 className="h-3.5 w-3.5 mr-1.5" />
                        Departments
                    </TabsTrigger>
                    <TabsTrigger value="tth" className="text-[12px]">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Time-to-Hire
                    </TabsTrigger>
                    <TabsTrigger value="interviewers" className="text-[12px]">
                        <Award className="h-3.5 w-3.5 mr-1.5" />
                        Interviewer Performance
                    </TabsTrigger>
                </TabsList>

                {/* ---------- OVERVIEW ---------- */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Velocity line */}
                        <Card className={`${CARD} p-5 xl:col-span-2`}>
                            <SectionHeader
                                title="Hiring velocity"
                                subtitle="Hires per week over the last 12 weeks"
                                action={
                                    <Badge
                                        className="text-[10px] font-semibold"
                                        style={{
                                            backgroundColor: `${VIOLET}15`,
                                            color: VIOLET,
                                            border: `1px solid ${VIOLET}30`,
                                        }}
                                    >
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        week-over-week
                                    </Badge>
                                }
                            />
                            <SvgLineChart
                                points={velocity.points}
                                labels={velocity.labels}
                                color={VIOLET}
                                onPointClick={(i) =>
                                    toast({
                                        title: `Week ${i + 1}`,
                                        description: `${velocity.points[i]} hires`,
                                    })
                                }
                            />
                        </Card>

                        {/* Pipeline health */}
                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Pipeline health"
                                subtitle="Stage distribution"
                            />
                            <div className="grid grid-cols-3 gap-3">
                                {pipelineRadials.map((s, i) => (
                                    <RadialProgress key={s.label} stage={s} index={i} />
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Top performing jobs */}
                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Top 5 performing jobs"
                                subtitle="Highest hires in scope"
                                action={
                                    <Trophy
                                        className="h-4 w-4"
                                        style={{ color: AMBER }}
                                    />
                                }
                            />
                            <div className="space-y-2.5">
                                {topJobs.map((j, i) => (
                                    <motion.div
                                        key={j.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-8 w-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white"
                                                style={{
                                                    backgroundColor:
                                                        i === 0
                                                            ? AMBER
                                                            : i === 1
                                                              ? SLATE
                                                              : VIOLET,
                                                }}
                                            >
                                                #{i + 1}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-semibold text-slate-900">
                                                    {j.title}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    {j.department} · {j.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-right">
                                            <div>
                                                <div className="text-[11px] tabular-nums font-bold text-slate-900">
                                                    {j.hired}
                                                </div>
                                                <div className="text-[9px] uppercase tracking-wider text-slate-500">
                                                    hired
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] tabular-nums font-bold text-slate-900">
                                                    {j.applicants}
                                                </div>
                                                <div className="text-[9px] uppercase tracking-wider text-slate-500">
                                                    applied
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {topJobs.length === 0 && (
                                    <div className="text-[11px] text-slate-500 text-center py-8">
                                        No jobs in scope.
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Stuck roles */}
                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Top 5 stuck roles"
                                subtitle="Longest open with low movement"
                                action={
                                    <AlertTriangle
                                        className="h-4 w-4"
                                        style={{ color: ROSE }}
                                    />
                                }
                            />
                            <div className="space-y-2.5">
                                {stuckJobs.map((j, i) => (
                                    <motion.div
                                        key={j.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-2.5 rounded-xl border border-rose-100 bg-rose-50/30"
                                    >
                                        <div>
                                            <div className="text-[12px] font-semibold text-slate-900">
                                                {j.title}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                {j.department} · {j.applicants} applicants
                                            </div>
                                        </div>
                                        <Badge
                                            className="text-[10px] font-semibold bg-rose-100 text-rose-700 border-0"
                                        >
                                            {j.daysOpen} days open
                                        </Badge>
                                    </motion.div>
                                ))}
                                {stuckJobs.length === 0 && (
                                    <div className="text-[11px] text-slate-500 text-center py-8">
                                        No stuck roles.
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Interview load heatmap */}
                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Interview load heatmap"
                            subtitle="Day of week x time slot"
                        />
                        <SvgHeatmap
                            data={heatmapData.grid}
                            rowLabels={heatmapData.rows}
                            colLabels={heatmapData.cols}
                        />
                    </Card>

                    {/* Applications trend */}
                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Applications trend"
                            subtitle="New applications per week"
                            action={
                                <Badge className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">
                                    {scopedCandidates.length} in scope
                                </Badge>
                            }
                        />
                        <SvgLineChart
                            points={applicationsTrend.points}
                            labels={applicationsTrend.labels}
                            color={BLUE}
                        />
                    </Card>
                </TabsContent>

                {/* ---------- FUNNEL ---------- */}
                <TabsContent value="funnel" className="space-y-4 mt-4">
                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Conversion funnel"
                            subtitle="Applied -> Screening -> Interview -> Offer -> Hired"
                            action={
                                <Badge
                                    className="text-[10px] font-semibold"
                                    style={{
                                        backgroundColor:
                                            bottleneckStage.drop > 60
                                                ? "#FEE2E2"
                                                : bottleneckStage.drop > 30
                                                  ? "#FEF3C7"
                                                  : "#D1FAE5",
                                        color:
                                            bottleneckStage.drop > 60
                                                ? "#B91C1C"
                                                : bottleneckStage.drop > 30
                                                  ? "#B45309"
                                                  : "#047857",
                                    }}
                                >
                                    Bottleneck: {bottleneckStage.stage || "-"} (
                                    {Math.round(bottleneckStage.drop)}% drop)
                                </Badge>
                            }
                        />
                        <SvgFunnel
                            data={funnelData}
                            onStageClick={(i) =>
                                openDrilldownForStage(funnelData[i].label)
                            }
                        />
                    </Card>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Stage conversion metrics"
                            subtitle="Pass-through per stage"
                        />
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Stage
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Count
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Conversion %
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Drop-off %
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Signal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {funnelData.map((f, i) => {
                                        const prev =
                                            i > 0 ? funnelData[i - 1].value : f.value;
                                        const conv =
                                            prev > 0
                                                ? Math.round((f.value / prev) * 100)
                                                : 100;
                                        const drop = 100 - conv;
                                        return (
                                            <TableRow
                                                key={f.label}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    openDrilldownForStage(f.label)
                                                }
                                            >
                                                <TableCell className="text-[12px] font-semibold">
                                                    <span className="inline-flex items-center gap-2">
                                                        <span
                                                            className="h-2 w-2 rounded-full"
                                                            style={{
                                                                backgroundColor: f.color,
                                                            }}
                                                        />
                                                        {f.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-[12px] tabular-nums">
                                                    {f.value}
                                                </TableCell>
                                                <TableCell className="text-[12px] tabular-nums">
                                                    {i === 0 ? "-" : `${conv}%`}
                                                </TableCell>
                                                <TableCell className="text-[12px] tabular-nums">
                                                    {i === 0 ? "-" : `${drop}%`}
                                                </TableCell>
                                                <TableCell>
                                                    {i > 0 && drop > 60 && (
                                                        <Badge className="bg-rose-50 text-rose-700 text-[10px] border-rose-200">
                                                            High drop
                                                        </Badge>
                                                    )}
                                                    {i > 0 && drop > 30 && drop <= 60 && (
                                                        <Badge className="bg-amber-50 text-amber-700 text-[10px] border-amber-200">
                                                            Watch
                                                        </Badge>
                                                    )}
                                                    {i > 0 && drop <= 30 && (
                                                        <Badge className="bg-emerald-50 text-emerald-700 text-[10px] border-emerald-200">
                                                            Healthy
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Funnel efficiency breakdown"
                            subtitle="Applications needed per hire"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                                <div className={MICRO_LABEL}>Apps per Hire</div>
                                <div className={`${BIG_NUM} mt-1`}>
                                    {kpis.totalHired > 0
                                        ? Math.round(
                                              scopedCandidates.length /
                                                  kpis.totalHired
                                          )
                                        : scopedCandidates.length}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    Industry avg:{" "}
                                    {INDUSTRY_BENCHMARKS.applicationsPerHire.industry}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                                <div className={MICRO_LABEL}>Interviews per Hire</div>
                                <div className={`${BIG_NUM} mt-1`}>
                                    {kpis.totalHired > 0
                                        ? Math.round(
                                              scopedInterviews.length /
                                                  kpis.totalHired
                                          )
                                        : scopedInterviews.length}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    Lower is better
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                                <div className={MICRO_LABEL}>Offers per Hire</div>
                                <div className={`${BIG_NUM} mt-1`}>
                                    {kpis.totalHired > 0
                                        ? (
                                              scopedOffers.length /
                                              Math.max(kpis.totalHired, 1)
                                          ).toFixed(1)
                                        : scopedOffers.length.toFixed(1)}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    Target ~1.2
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* ---------- SOURCES ---------- */}
                <TabsContent value="sources" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <Card className={`${CARD} p-5 xl:col-span-2`}>
                            <SectionHeader
                                title="Source breakdown"
                                subtitle="Applications by channel"
                            />
                            <SvgHorizontalBarChart
                                data={sourcesAnalytics.map((s) => ({
                                    label: s.source,
                                    value: s.total,
                                    color:
                                        s.source === "LinkedIn"
                                            ? BLUE
                                            : s.source === "Referral"
                                              ? EMERALD
                                              : s.source === "CareerPage"
                                                ? VIOLET
                                                : s.source === "Agency"
                                                  ? AMBER
                                                  : INDIGO,
                                }))}
                                onBarClick={(i) =>
                                    openDrilldownForSource(
                                        sourcesAnalytics[i].source
                                    )
                                }
                            />
                        </Card>

                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Source ROI ranking"
                                subtitle="Sorted by conversion"
                            />
                            <div className="space-y-2.5">
                                {[...sourcesAnalytics]
                                    .sort((a, b) => b.conv - a.conv)
                                    .slice(0, 6)
                                    .map((s, i) => (
                                        <div
                                            key={s.source}
                                            className="flex items-center justify-between p-2 rounded-lg border border-slate-100"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                                                    style={{
                                                        backgroundColor:
                                                            i === 0
                                                                ? AMBER
                                                                : i === 1
                                                                  ? SLATE
                                                                  : VIOLET,
                                                    }}
                                                >
                                                    {i + 1}
                                                </span>
                                                <span className="text-[12px] font-medium text-slate-800">
                                                    {s.source}
                                                </span>
                                            </div>
                                            <div className="text-[11px] tabular-nums font-semibold">
                                                {s.conv}%
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                    </div>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Source performance"
                            subtitle="Per-source conversion, TTH and cost"
                        />
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Source
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Candidates
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Hires
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Conv %
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Avg TTH
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Cost / Hire
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sourcesAnalytics.map((s) => (
                                        <TableRow
                                            key={s.source}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                openDrilldownForSource(s.source)
                                            }
                                        >
                                            <TableCell className="text-[12px] font-semibold">
                                                {s.source}
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {s.total}
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {s.hired}
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {s.conv}%
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {s.avgTTH}d
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                INR {s.cost.toLocaleString("en-IN")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {sourcesAnalytics.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-[11px] text-slate-500"
                                            >
                                                No sources in scope.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* ---------- DEPARTMENTS ---------- */}
                <TabsContent value="departments" className="space-y-4 mt-4">
                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Department-wise hiring"
                            subtitle="Open roles, applications, hires & conversion"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            {departmentAnalytics.map((d, i) => (
                                <motion.div
                                    key={d.dept}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-[13px] font-semibold text-slate-900">
                                            {d.dept}
                                        </div>
                                        <Badge
                                            className="text-[10px]"
                                            style={{
                                                backgroundColor: `${VIOLET}15`,
                                                color: VIOLET,
                                                border: `1px solid ${VIOLET}30`,
                                            }}
                                        >
                                            {d.openRoles} open
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        <div>
                                            <div className={MICRO_LABEL}>Apps</div>
                                            <div className="text-sm font-bold tabular-nums text-slate-900">
                                                {d.applied}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={MICRO_LABEL}>Hired</div>
                                            <div className="text-sm font-bold tabular-nums text-slate-900">
                                                {d.hired}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={MICRO_LABEL}>Conv</div>
                                            <div className="text-sm font-bold tabular-nums text-slate-900">
                                                {d.conv}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                                            <span>Avg TTH</span>
                                            <span className="tabular-nums">
                                                {d.avgTTH}d
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${Math.min((d.avgTTH / 60) * 100, 100)}%`,
                                                }}
                                                transition={{
                                                    duration: 0.7,
                                                    delay: i * 0.05,
                                                }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: VIOLET }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {departmentAnalytics.length === 0 && (
                                <div className="col-span-full text-center text-[11px] text-slate-500 py-8">
                                    No departments in scope.
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Department comparison"
                            subtitle="Hires per department (in scope)"
                        />
                        <SvgHorizontalBarChart
                            data={departmentAnalytics.map((d, i) => ({
                                label: d.dept,
                                value: d.hired,
                                color: [VIOLET, INDIGO, EMERALD, AMBER, ROSE, BLUE][
                                    i % 6
                                ],
                            }))}
                        />
                    </Card>
                </TabsContent>

                {/* ---------- TIME-TO-HIRE ---------- */}
                <TabsContent value="tth" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Card className={`${CARD} p-4`}>
                            <div className={MICRO_LABEL}>Average TTH</div>
                            <div className={`${BIG_NUM} mt-1`}>{kpis.avgTTH}d</div>
                            <div className="text-[11px] text-slate-500 mt-1">
                                Across all scoped hires
                            </div>
                        </Card>
                        <Card className={`${CARD} p-4`}>
                            <div className={MICRO_LABEL}>Fastest hire</div>
                            <div className={`${BIG_NUM} mt-1`}>
                                {Math.min(
                                    ...positionTTH.map((p) => p.min).filter(Boolean),
                                    18
                                )}
                                d
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                                Top percentile
                            </div>
                        </Card>
                        <Card className={`${CARD} p-4`}>
                            <div className={MICRO_LABEL}>Slowest hire</div>
                            <div className={`${BIG_NUM} mt-1`}>
                                {Math.max(
                                    ...positionTTH.map((p) => p.max),
                                    65
                                )}
                                d
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                                Action needed
                            </div>
                        </Card>
                    </div>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Average days per stage"
                            subtitle="Min / Avg / Max box distribution"
                        />
                        <SvgBoxPlot data={stageBoxPlot} />
                    </Card>

                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Position-wise TTH comparison"
                            subtitle="By job"
                        />
                        <SvgBoxPlot data={positionTTH} />
                    </Card>
                </TabsContent>

                {/* ---------- INTERVIEWER PERFORMANCE ---------- */}
                <TabsContent value="interviewers" className="space-y-4 mt-4">
                    <Card className={`${CARD} p-5`}>
                        <SectionHeader
                            title="Interviewer leaderboard"
                            subtitle="Conducted, rating, hire rate & turnaround"
                            action={
                                <Badge
                                    className="text-[10px]"
                                    style={{
                                        backgroundColor: `${AMBER}15`,
                                        color: AMBER,
                                        border: `1px solid ${AMBER}40`,
                                    }}
                                >
                                    <Trophy className="h-3 w-3 mr-1" />
                                    Top 3 medalled
                                </Badge>
                            }
                        />
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Rank
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Interviewer
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Conducted
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Avg Rating
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Hire Rate
                                        </TableHead>
                                        <TableHead className={MICRO_LABEL_11}>
                                            Feedback TAT
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {interviewerPerf.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-[11px] text-slate-500"
                                            >
                                                No interviewer activity in scope.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {interviewerPerf.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell>
                                                {i < 3 ? (
                                                    <Medal
                                                        className="h-4 w-4"
                                                        style={{
                                                            color:
                                                                i === 0
                                                                    ? "#F59E0B"
                                                                    : i === 1
                                                                      ? "#94A3B8"
                                                                      : "#A16207",
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-[11px] text-slate-500">
                                                        #{i + 1}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-[12px] font-semibold">
                                                {p.name}
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {p.conducted}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-1 text-[12px] tabular-nums">
                                                    <Star
                                                        className="h-3 w-3"
                                                        style={{
                                                            color: AMBER,
                                                            fill: AMBER,
                                                        }}
                                                    />
                                                    {p.avgRating}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {p.hireRate}%
                                            </TableCell>
                                            <TableCell className="text-[12px] tabular-nums">
                                                {p.feedbackHrs}h
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Interviews conducted"
                                subtitle="Top 6 most active"
                            />
                            <SvgHorizontalBarChart
                                data={interviewerPerf.slice(0, 6).map((p, i) => ({
                                    label: p.name,
                                    value: p.conducted,
                                    color: [
                                        VIOLET,
                                        INDIGO,
                                        EMERALD,
                                        AMBER,
                                        ROSE,
                                        BLUE,
                                    ][i % 6],
                                }))}
                            />
                        </Card>
                        <Card className={`${CARD} p-5`}>
                            <SectionHeader
                                title="Feedback turnaround"
                                subtitle="Hours from interview to feedback"
                            />
                            <SvgHorizontalBarChart
                                data={interviewerPerf.slice(0, 6).map((p, i) => ({
                                    label: p.name,
                                    value: p.feedbackHrs,
                                    color:
                                        p.feedbackHrs < 24
                                            ? EMERALD
                                            : p.feedbackHrs < 48
                                              ? AMBER
                                              : ROSE,
                                }))}
                                unit="h"
                            />
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* ============================================================
                DIALOGS
                ============================================================ */}
            <ScheduleReportDialog
                open={scheduleOpen}
                onClose={() => setScheduleOpen(false)}
                onSave={(payload) => {
                    toast({
                        title: "Report scheduled",
                        description: `${payload.name} · ${payload.frequency}`,
                    });
                    setScheduleOpen(false);
                }}
            />
            <ExportOptionsDialog
                open={exportOpen}
                onClose={() => setExportOpen(false)}
                onExport={(opts) => {
                    handleExportCsv();
                    setExportOpen(false);
                    void opts;
                }}
            />
            <ReportDetailDialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                ctx={detailCtx}
                jobs={jobs}
            />
            <CustomReportBuilderDialog
                open={builderOpen}
                onClose={() => setBuilderOpen(false)}
                onSave={(payload) => {
                    toast({
                        title: "Custom report saved",
                        description: payload.name,
                    });
                    setBuilderOpen(false);
                }}
            />
            <BenchmarkDialog
                open={benchmarkOpen}
                onClose={() => setBenchmarkOpen(false)}
                kpis={kpis}
            />
        </div>
    );
};

/* ============================================================
   DIALOG COMPONENTS
   ============================================================ */

/* ---- Schedule report ---- */
const ScheduleReportDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onSave: (payload: {
        name: string;
        type: string;
        frequency: string;
        recipients: string[];
        format: string;
    }) => void;
}> = ({ open, onClose, onSave }) => {
    const [name, setName] = useState("Weekly Hiring Digest");
    const [type, setType] = useState("overview");
    const [frequency, setFrequency] = useState("Weekly");
    const [format, setFormat] = useState("PDF");
    const [recipients, setRecipients] = useState<string[]>([
        "hr-leads@fixlsolutions.com",
    ]);
    const [emailInput, setEmailInput] = useState("");

    const addEmail = () => {
        const v = emailInput.trim();
        if (!v) return;
        if (!/^\S+@\S+\.\S+$/.test(v)) return;
        if (recipients.includes(v)) return;
        setRecipients((p) => [...p, v]);
        setEmailInput("");
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[560px] rounded-2xl font-sans">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-4 w-4" style={{ color: VIOLET }} />
                        Schedule report
                    </DialogTitle>
                    <DialogDescription className="text-[12px]">
                        Automate delivery of this report to stakeholders.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">
                            Report name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-9 rounded-xl text-[12px]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Report type
                            </Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="overview">Overview</SelectItem>
                                    <SelectItem value="funnel">Funnel</SelectItem>
                                    <SelectItem value="sources">Sources</SelectItem>
                                    <SelectItem value="departments">
                                        Departments
                                    </SelectItem>
                                    <SelectItem value="tth">Time-to-Hire</SelectItem>
                                    <SelectItem value="interviewers">
                                        Interviewer performance
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Frequency
                            </Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">
                            Recipients
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="add@example.com"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addEmail();
                                    }
                                }}
                                className="h-9 rounded-xl text-[12px]"
                            />
                            <Button
                                variant="outline"
                                onClick={addEmail}
                                className="h-9 rounded-xl border-slate-200 text-[12px]"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {recipients.map((r) => (
                                <span
                                    key={r}
                                    className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[11px] bg-violet-50 text-violet-700 border border-violet-100"
                                >
                                    <Mail className="h-3 w-3" />
                                    {r}
                                    <button
                                        onClick={() =>
                                            setRecipients((p) =>
                                                p.filter((x) => x !== r)
                                            )
                                        }
                                        className="ml-1 text-violet-500 hover:text-violet-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PDF">PDF</SelectItem>
                                <SelectItem value="CSV">CSV</SelectItem>
                                <SelectItem value="Excel">Excel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            onSave({ name, type, frequency, recipients, format })
                        }
                        className="h-9 rounded-xl text-white text-[12px]"
                        style={{ backgroundColor: VIOLET }}
                    >
                        Save schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ---- Export options ---- */
const EXPORT_COLUMNS = [
    { key: "kpis", label: "KPI summary" },
    { key: "funnel", label: "Funnel metrics" },
    { key: "sources", label: "Source breakdown" },
    { key: "departments", label: "Department analysis" },
    { key: "tth", label: "Time-to-Hire stages" },
    { key: "interviewers", label: "Interviewer performance" },
    { key: "candidates", label: "Raw candidate list" },
];

const ExportOptionsDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onExport: (opts: { cols: string[]; format: string }) => void;
}> = ({ open, onClose, onExport }) => {
    const [cols, setCols] = useState<string[]>(
        EXPORT_COLUMNS.map((c) => c.key)
    );
    const [format, setFormat] = useState("CSV");

    const toggle = (k: string) =>
        setCols((p) =>
            p.includes(k) ? p.filter((x) => x !== k) : [...p, k]
        );

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[520px] rounded-2xl font-sans">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-4 w-4" style={{ color: VIOLET }} />
                        Export options
                    </DialogTitle>
                    <DialogDescription className="text-[12px]">
                        Choose sections and format
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">
                            Sections to include
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {EXPORT_COLUMNS.map((c) => (
                                <label
                                    key={c.key}
                                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={cols.includes(c.key)}
                                        onCheckedChange={() => toggle(c.key)}
                                    />
                                    <span className="text-[12px] font-medium text-slate-700">
                                        {c.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CSV">CSV</SelectItem>
                                <SelectItem value="Excel">Excel</SelectItem>
                                <SelectItem value="JSON">JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onExport({ cols, format })}
                        className="h-9 rounded-xl text-white text-[12px]"
                        style={{ backgroundColor: VIOLET }}
                    >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ---- Report detail (drill-down) ---- */
const ReportDetailDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    ctx: {
        title: string;
        subtitle?: string;
        candidates: any[];
    } | null;
    jobs: any[];
}> = ({ open, onClose, ctx, jobs }) => {
    const jobMap = useMemo(
        () =>
            jobs.reduce(
                (acc: Record<string, string>, j: any) => {
                    acc[j.id] = j.title;
                    return acc;
                },
                {} as Record<string, string>
            ),
        [jobs]
    );
    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[880px] rounded-2xl font-sans">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="h-4 w-4" style={{ color: VIOLET }} />
                        {ctx?.title || "Detail"}
                    </DialogTitle>
                    <DialogDescription className="text-[12px]">
                        {ctx?.subtitle || "Drill-down"}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[440px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[11px]">Name</TableHead>
                                <TableHead className="text-[11px]">Job</TableHead>
                                <TableHead className="text-[11px]">Stage</TableHead>
                                <TableHead className="text-[11px]">Source</TableHead>
                                <TableHead className="text-[11px]">Applied</TableHead>
                                <TableHead className="text-[11px]">Rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(ctx?.candidates || []).map((c: any) => (
                                <TableRow key={c.id}>
                                    <TableCell className="text-[12px] font-semibold">
                                        {c.firstName} {c.lastName}
                                    </TableCell>
                                    <TableCell className="text-[12px]">
                                        {jobMap[c.jobId] || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className="text-[10px] border-0"
                                            style={{
                                                backgroundColor: `${VIOLET}15`,
                                                color: VIOLET,
                                            }}
                                        >
                                            {c.stage}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[12px]">
                                        {c.source}
                                    </TableCell>
                                    <TableCell className="text-[12px] tabular-nums">
                                        {new Date(c.appliedDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center gap-1 text-[12px] tabular-nums">
                                            <Star
                                                className="h-3 w-3"
                                                style={{
                                                    color: AMBER,
                                                    fill: AMBER,
                                                }}
                                            />
                                            {c.rating || 0}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!ctx || ctx.candidates.length === 0) && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-[11px] text-slate-500"
                                    >
                                        No records in this slice.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ---- Custom report builder ---- */
const METRIC_OPTIONS = [
    { key: "hires", label: "Total Hired" },
    { key: "apps", label: "Applications" },
    { key: "conv", label: "Conversion %" },
    { key: "tth", label: "Time-to-Hire" },
    { key: "cost", label: "Cost per Hire" },
    { key: "acceptance", label: "Offer Acceptance %" },
    { key: "withdrawal", label: "Withdrawal Rate %" },
];
const GROUP_OPTIONS = [
    { key: "source", label: "Source" },
    { key: "department", label: "Department" },
    { key: "job", label: "Job" },
    { key: "stage", label: "Stage" },
    { key: "week", label: "Week" },
];

const CustomReportBuilderDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onSave: (payload: {
        name: string;
        metrics: string[];
        groupBy: string;
        sortBy: string;
        filters: { stage: string; source: string };
    }) => void;
}> = ({ open, onClose, onSave }) => {
    const [name, setName] = useState("My Hiring Report");
    const [metrics, setMetrics] = useState<string[]>(["hires", "apps", "conv"]);
    const [groupBy, setGroupBy] = useState("department");
    const [sortBy, setSortBy] = useState("hires");
    const [filterStage, setFilterStage] = useState("all");
    const [filterSource, setFilterSource] = useState("all");

    const toggleMetric = (k: string) =>
        setMetrics((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[720px] rounded-2xl font-sans">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Layers className="h-4 w-4" style={{ color: VIOLET }} />
                        Custom report builder
                    </DialogTitle>
                    <DialogDescription className="text-[12px]">
                        Assemble a report from metrics, filters and grouping.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">
                            Report name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-9 rounded-xl text-[12px]"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[11px] font-semibold">Metrics</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {METRIC_OPTIONS.map((m) => (
                                <label
                                    key={m.key}
                                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                >
                                    <Checkbox
                                        checked={metrics.includes(m.key)}
                                        onCheckedChange={() => toggleMetric(m.key)}
                                    />
                                    <span className="text-[12px] font-medium text-slate-700">
                                        {m.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Group by
                            </Label>
                            <Select value={groupBy} onValueChange={setGroupBy}>
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {GROUP_OPTIONS.map((g) => (
                                        <SelectItem key={g.key} value={g.key}>
                                            {g.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Sort by
                            </Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {METRIC_OPTIONS.map((m) => (
                                        <SelectItem key={m.key} value={m.key}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Filter: stage
                            </Label>
                            <Select
                                value={filterStage}
                                onValueChange={setFilterStage}
                            >
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All stages</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Screening">Screening</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold">
                                Filter: source
                            </Label>
                            <Select
                                value={filterSource}
                                onValueChange={setFilterSource}
                            >
                                <SelectTrigger className="h-9 rounded-xl text-[12px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All sources</SelectItem>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="Agency">Agency</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="CareerPage">
                                        Career Page
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                        <div className={MICRO_LABEL}>Preview</div>
                        <div className="text-[12px] text-slate-700 mt-2 leading-relaxed">
                            <strong>{name}</strong> &middot; grouped by{" "}
                            <strong>{groupBy}</strong>, sorted by{" "}
                            <strong>{sortBy}</strong> &middot;{" "}
                            {metrics.length} metric{metrics.length === 1 ? "" : "s"}{" "}
                            &middot; stage:{" "}
                            <strong>{filterStage}</strong>, source:{" "}
                            <strong>{filterSource}</strong>.
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            onSave({
                                name,
                                metrics,
                                groupBy,
                                sortBy,
                                filters: {
                                    stage: filterStage,
                                    source: filterSource,
                                },
                            })
                        }
                        className="h-9 rounded-xl text-white text-[12px]"
                        style={{ backgroundColor: VIOLET }}
                    >
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        Save report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

/* ---- Benchmark comparison ---- */
const BenchmarkDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    kpis: any;
}> = ({ open, onClose, kpis }) => {
    const rows = [
        {
            label: "Time-to-Hire (days)",
            yours: kpis.avgTTH,
            industry: INDUSTRY_BENCHMARKS.timeToHire.industry,
            top: INDUSTRY_BENCHMARKS.timeToHire.topQuartile,
            inverse: true,
        },
        {
            label: "Offer Acceptance (%)",
            yours: kpis.acceptance,
            industry: INDUSTRY_BENCHMARKS.offerAcceptance.industry,
            top: INDUSTRY_BENCHMARKS.offerAcceptance.topQuartile,
            inverse: false,
        },
        {
            label: "Cost Per Hire (INR)",
            yours: kpis.costPerHire,
            industry: INDUSTRY_BENCHMARKS.costPerHire.industry,
            top: INDUSTRY_BENCHMARKS.costPerHire.topQuartile,
            inverse: true,
        },
        {
            label: "Withdrawal Rate (%)",
            yours: kpis.withdrawalRate,
            industry: INDUSTRY_BENCHMARKS.withdrawalRate.industry,
            top: INDUSTRY_BENCHMARKS.withdrawalRate.topQuartile,
            inverse: true,
        },
        {
            label: "Source Diversity",
            yours: kpis.diversity,
            industry: INDUSTRY_BENCHMARKS.sourceDiversity.industry,
            top: INDUSTRY_BENCHMARKS.sourceDiversity.topQuartile,
            inverse: false,
        },
    ];

    const verdict = (
        yours: number,
        industry: number,
        top: number,
        inverse: boolean
    ) => {
        if (inverse) {
            if (yours <= top) return { label: "Top quartile", color: EMERALD };
            if (yours <= industry) return { label: "On par", color: AMBER };
            return { label: "Below avg", color: ROSE };
        }
        if (yours >= top) return { label: "Top quartile", color: EMERALD };
        if (yours >= industry) return { label: "On par", color: AMBER };
        return { label: "Below avg", color: ROSE };
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-[700px] rounded-2xl font-sans">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" style={{ color: VIOLET }} />
                        Industry benchmark comparison
                    </DialogTitle>
                    <DialogDescription className="text-[12px]">
                        Reference: 2025 tech-sector hiring benchmarks (mock).
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                    {rows.map((r) => {
                        const v = verdict(r.yours, r.industry, r.top, r.inverse);
                        return (
                            <div
                                key={r.label}
                                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50/50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-[12px] font-semibold text-slate-900">
                                        {r.label}
                                    </div>
                                    <Badge
                                        className="text-[10px] border-0 text-white"
                                        style={{ backgroundColor: v.color }}
                                    >
                                        {v.label}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className={MICRO_LABEL}>Yours</div>
                                        <div className="text-sm font-bold tabular-nums text-slate-900 mt-0.5">
                                            {typeof r.yours === "number" &&
                                            r.yours > 1000
                                                ? r.yours.toLocaleString()
                                                : r.yours}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={MICRO_LABEL}>Industry</div>
                                        <div className="text-sm font-bold tabular-nums text-slate-700 mt-0.5">
                                            {r.industry > 1000
                                                ? r.industry.toLocaleString()
                                                : r.industry}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={MICRO_LABEL}>Top quartile</div>
                                        <div className="text-sm font-bold tabular-nums text-emerald-700 mt-0.5">
                                            {r.top > 1000 ? r.top.toLocaleString() : r.top}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="rounded-xl bg-violet-50 border border-violet-100 p-3 text-[11px] text-violet-800 leading-relaxed">
                    <strong>How to read this:</strong> Values in "Top quartile" match
                    the best-performing 25% of organisations. "On par" means you
                    track the industry median. "Below avg" flags an area for
                    improvement - consider tightening the hiring loop, diversifying
                    sources or streamlining approvals.
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl border-slate-200 text-[12px]"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HiringReportsPage;
