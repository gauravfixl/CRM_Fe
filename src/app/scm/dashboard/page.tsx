"use client"

import * as React from "react"
import { useMemo } from "react"
import Link from "next/link"
import {
    Boxes,
    ClipboardList,
    AlertTriangle,
    ShoppingCart,
    Truck,
    Users,
    Plus,
    PackagePlus,
    UserPlus,
    FilePlus2,
    ArrowRight,
} from "lucide-react"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"

import { KpiCard } from "@/shared/components/scm/shared/KpiCard"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { Button } from "@/shared/components/ui/button"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"

const inventoryByCategory = [
    { name: "Stationery", value: 320 },
    { name: "Electronics", value: 180 },
    { name: "Packaging", value: 950 },
    { name: "Merchandise", value: 240 },
    { name: "Raw Material", value: 510 },
]

const procurementTrend = [
    { month: "Dec", spend: 240000 },
    { month: "Jan", spend: 285000 },
    { month: "Feb", spend: 310000 },
    { month: "Mar", spend: 268000 },
    { month: "Apr", spend: 332000 },
    { month: "May", spend: 358000 },
]

const fulfillmentSplit = [
    { name: "Delivered", value: 184, color: "#10b981" },
    { name: "In Transit", value: 47, color: "#3b82f6" },
    { name: "Pending", value: 23, color: "#f59e0b" },
    { name: "Delayed", value: 6, color: "#ef4444" },
]

const recentPOs = [
    { id: "PO-2087", vendor: "PaperCo Industries", amount: "₹ 1,24,500", status: "Approved", date: "2026-05-04" },
    { id: "PO-2086", vendor: "ClickPro Devices", amount: "₹ 86,200", status: "Pending", date: "2026-05-03" },
    { id: "PO-2085", vendor: "BoxIt Pvt Ltd", amount: "₹ 42,000", status: "Approved", date: "2026-05-02" },
    { id: "PO-2084", vendor: "HydroX Mfg.", amount: "₹ 1,67,800", status: "Rejected", date: "2026-04-30" },
]

const recentShipments = [
    { id: "SH-9043", customer: "Acme Corp", courier: "Delhivery", status: "In Transit", eta: "2026-05-08" },
    { id: "SH-9042", customer: "BlueWave Ltd", courier: "FedEx", status: "Delivered", eta: "2026-05-05" },
    { id: "SH-9041", customer: "Tech Innovate", courier: "DHL", status: "Delayed", eta: "2026-05-04" },
    { id: "SH-9040", customer: "GreenFields", courier: "Shiprocket", status: "Pending", eta: "2026-05-09" },
]

export default function ScmDashboardPage() {
    const products = useScmProductsStore((s) => s.products)

    const kpis = useMemo(() => {
        const totalValue = products.reduce(
            (sum, p) => sum + p.currentStock * p.purchasePrice,
            0
        )
        const lowStock = products.filter(
            (p) => p.currentStock > 0 && p.currentStock <= p.reorderLevel
        ).length
        const outOfStock = products.filter((p) => p.currentStock === 0).length
        return { totalValue, lowStock, outOfStock, totalProducts: products.length }
    }, [products])

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(n)

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#0F172A] leading-tight">
                        Supply Chain Dashboard
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Inventory, procurement, fulfillment and logistics at a glance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/scm/inventory/products">
                        <Button
                            variant="outline"
                            className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]"
                        >
                            <PackagePlus className="w-4 h-4 mr-1.5" />
                            Add Product
                        </Button>
                    </Link>
                    <Link href="/scm/procurement/purchase-orders">
                        <Button
                            className="h-9 px-3 rounded-lg text-white text-[13px]"
                            style={{
                                backgroundColor: "#10b981",
                                boxShadow: "0 4px 12px #10b98133",
                            }}
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            New Purchase Order
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    tinted
                    label="Total Inventory Value"
                    value={formatINR(kpis.totalValue)}
                    icon={<Boxes className="w-5 h-5" />}
                    accentColor="#2563eb"
                    delta={{ value: "8.4%", trend: "up" }}
                    helperText="vs last month"
                />
                <KpiCard
                    tinted
                    label="Pending Orders"
                    value={23}
                    icon={<ClipboardList className="w-5 h-5" />}
                    accentColor="#f59e0b"
                    delta={{ value: "3", trend: "down" }}
                    helperText="vs yesterday"
                />
                <KpiCard
                    tinted
                    label="Low Stock Products"
                    value={kpis.lowStock}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    accentColor="#ef4444"
                    helperText={`${kpis.outOfStock} out of stock`}
                />
                <KpiCard
                    tinted
                    label="Open Purchase Orders"
                    value={12}
                    icon={<ShoppingCart className="w-5 h-5" />}
                    accentColor="#10b981"
                    delta={{ value: "2", trend: "up" }}
                    helperText="awaiting delivery"
                />
                <KpiCard
                    tinted
                    label="Today's Shipments"
                    value={47}
                    icon={<Truck className="w-5 h-5" />}
                    accentColor="#8b5cf6"
                    helperText="6 delayed"
                />
                <KpiCard
                    tinted
                    label="Total Vendors"
                    value={84}
                    icon={<Users className="w-5 h-5" />}
                    accentColor="#0ea5e9"
                    helperText="78 active"
                />
                <KpiCard
                    tinted
                    label="Total Products"
                    value={kpis.totalProducts}
                    icon={<Boxes className="w-5 h-5" />}
                    accentColor="#14b8a6"
                />
                <KpiCard
                    tinted
                    label="Warehouses"
                    value={5}
                    icon={<Boxes className="w-5 h-5" />}
                    accentColor="#f97316"
                    helperText="68% avg utilization"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Inventory by Category" subtitle="Stock units across categories" accentColor="#2563eb">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={inventoryByCategory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F6" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <ReTooltip
                                contentStyle={{
                                    background: "white",
                                    border: "1px solid #EEF1F6",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Procurement Trend" subtitle="Monthly purchase spend (₹)" accentColor="#10b981">
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={procurementTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <ReTooltip
                                contentStyle={{
                                    background: "white",
                                    border: "1px solid #EEF1F6",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                                formatter={(v: any) =>
                                    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v)
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="spend"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#10b981" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ChartCard title="Order Fulfillment" subtitle="Current status split" accentColor="#8b5cf6">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={fulfillmentSplit}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={50}
                                outerRadius={85}
                                paddingAngle={3}
                            >
                                {fulfillmentSplit.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <ReTooltip
                                contentStyle={{
                                    background: "white",
                                    border: "1px solid #EEF1F6",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Recent Purchase Orders */}
                <div
                    className="rounded-xl border shadow-sm overflow-hidden"
                    style={{
                        background: "linear-gradient(180deg, #10b9810d 0%, #ffffff 50%)",
                        borderColor: "#10b98126",
                    }}
                >
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#10b98126" }}>
                        <div className="flex items-start gap-2">
                            <span className="w-1 h-9 rounded-full shrink-0 bg-emerald-500" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">Recent Purchase Orders</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Last 4 entries</p>
                            </div>
                        </div>
                        <Link
                            href="/scm/procurement/purchase-orders"
                            className="text-[12px] font-medium text-emerald-700 hover:underline inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-[#F1F5F9]">
                        {recentPOs.map((po) => (
                            <li
                                key={po.id}
                                className="px-4 py-2.5 flex items-center justify-between hover:bg-[#FAFBFC] transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-[#0F172A] truncate">{po.id}</p>
                                    <p className="text-[12px] text-[#64748B] truncate">{po.vendor}</p>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="text-[13px] font-semibold text-[#0F172A] tabular-nums">{po.amount}</p>
                                    <StatusBadge status={po.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Recent Shipments */}
                <div
                    className="rounded-xl border shadow-sm overflow-hidden"
                    style={{
                        background: "linear-gradient(180deg, #8b5cf60d 0%, #ffffff 50%)",
                        borderColor: "#8b5cf626",
                    }}
                >
                    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#8b5cf626" }}>
                        <div className="flex items-start gap-2">
                            <span className="w-1 h-9 rounded-full shrink-0 bg-violet-500" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">Recent Shipments</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Last 4 entries</p>
                            </div>
                        </div>
                        <Link
                            href="/scm/shipments/list"
                            className="text-[12px] font-medium text-violet-700 hover:underline inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <ul className="divide-y divide-[#F1F5F9]">
                        {recentShipments.map((s) => (
                            <li
                                key={s.id}
                                className="px-4 py-2.5 flex items-center justify-between hover:bg-[#FAFBFC] transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-[#0F172A] truncate">{s.id}</p>
                                    <p className="text-[12px] text-[#64748B] truncate">
                                        {s.customer} • {s.courier}
                                    </p>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="text-[12px] text-[#64748B] tabular-nums">ETA {s.eta}</p>
                                    <StatusBadge status={s.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Quick Actions */}
            <div
                className="rounded-xl border shadow-sm p-4"
                style={{
                    background: "linear-gradient(135deg, #0ea5e90d 0%, #2563eb08 50%, #ffffff 100%)",
                    borderColor: "#0ea5e926",
                }}
            >
                <div className="flex items-start gap-2">
                    <span className="w-1 h-9 rounded-full shrink-0 bg-sky-500" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Quick Actions</h3>
                        <p className="text-[12px] text-[#64748B] mt-0.5">Frequently used SCM operations</p>
                    </div>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <QuickAction
                        href="/scm/inventory/products"
                        icon={<PackagePlus className="w-4 h-4" />}
                        label="Add Product"
                        accent="#2563eb"
                    />
                    <QuickAction
                        href="/scm/procurement/purchase-orders"
                        icon={<FilePlus2 className="w-4 h-4" />}
                        label="Create PO"
                        accent="#10b981"
                    />
                    <QuickAction
                        href="/scm/shipments/create"
                        icon={<Truck className="w-4 h-4" />}
                        label="Create Shipment"
                        accent="#8b5cf6"
                    />
                    <QuickAction
                        href="/scm/vendors/create"
                        icon={<UserPlus className="w-4 h-4" />}
                        label="Add Vendor"
                        accent="#0ea5e9"
                    />
                    <QuickAction
                        href="/scm/inventory/stock-adjustment"
                        icon={<Boxes className="w-4 h-4" />}
                        label="Stock Adjustment"
                        accent="#f59e0b"
                    />
                </div>
            </div>
        </div>
    )
}

function ChartCard({
    title,
    subtitle,
    children,
    accentColor = "#2563eb",
}: {
    title: string
    subtitle?: string
    children: React.ReactNode
    accentColor?: string
}) {
    return (
        <div
            className="rounded-xl border shadow-sm p-4 overflow-hidden"
            style={{
                background: `linear-gradient(180deg, ${accentColor}0d 0%, #ffffff 50%)`,
                borderColor: `${accentColor}26`,
            }}
        >
            <div className="mb-3 flex items-start gap-2">
                <span
                    className="w-1 h-9 rounded-full shrink-0"
                    style={{ backgroundColor: accentColor }}
                />
                <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
                    {subtitle && <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    )
}

function QuickAction({
    href,
    icon,
    label,
    accent,
}: {
    href: string
    icon: React.ReactNode
    label: string
    accent: string
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{
                background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}33` }}
            >
                {icon}
            </span>
            <span className="text-[13px] font-semibold truncate" style={{ color: accent }}>{label}</span>
        </Link>
    )
}
