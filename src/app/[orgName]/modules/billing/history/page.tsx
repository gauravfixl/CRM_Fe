"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Search,
    Download,
    Receipt,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ArrowDownCircle,
    ArrowUpCircle,
    CreditCard,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import { showSuccess, showError } from "@/shared/utils/toast"
import { getBillingHistory } from "@/hooks/billingHooks"

interface Transaction {
    id: string
    date: string
    description: string
    amount: string
    type: "payment" | "refund" | "credit"
    method: string
    status: "Completed" | "Pending" | "Failed"
}


function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

function mapPaymentStatusToType(status: string): "payment" | "refund" | "credit" {
    switch (status) {
        case "canceled":
        case "refunded":
            return "refund"
        case "credited":
            return "credit"
        default:
            return "payment"
    }
}

function mapPaymentStatusToStatus(status: string): "Completed" | "Pending" | "Failed" {
    switch (status) {
        case "active":
        case "completed":
        case "refunded":
        case "credited":
            return "Completed"
        case "pending":
            return "Pending"
        case "failed":
        case "canceled":
            return "Failed"
        default:
            return "Completed"
    }
}

function mapApiToTransactions(billingHistories: any[]): Transaction[] {
    return billingHistories.map((item, index) => ({
        id: item._id || `TXN-${index + 1}`,
        date: formatDate(item.createdAt),
        description: `${item.planSnapshot?.name || "Plan"} - ${item.billingPlanId?.planType || "Subscription"}`,
        amount: `$${(item.planSnapshot?.price ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        type: mapPaymentStatusToType(item.paymentStatus),
        method: "Billing on file",
        status: mapPaymentStatusToStatus(item.paymentStatus),
    }))
}

const typeFilters = ["All", "Payment", "Refund", "Credit"] as const
type TypeFilter = (typeof typeFilters)[number]

export default function BillingHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("All")
    const [billingTransactions, setBillingTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBillingHistory = async () => {
            try {
                setLoading(true)
                const response = await getBillingHistory()
                const data = response?.data
                const histories =
                    data?.billingHistories || data?.history || data?.data || []
                setBillingTransactions(mapApiToTransactions(histories))
            } catch (error: any) {
                console.error("Failed to fetch billing history:", error)
                showError(error?.response?.data?.message || "Failed to load billing history")
                setBillingTransactions([])
            } finally {
                setLoading(false)
            }
        }
        fetchBillingHistory()
    }, [])

    const filteredTransactions = useMemo(() => {
        return billingTransactions.filter((t) => {
            const matchesSearch =
                searchQuery === "" ||
                t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesType =
                typeFilter === "All" || t.type === typeFilter.toLowerCase()
            return matchesSearch && matchesType
        })
    }, [searchQuery, typeFilter, billingTransactions])

    const totalPayments = billingTransactions
        .filter((t) => t.type === "payment" && t.status === "Completed")
        .reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "").replace(",", "")), 0)

    const totalRefunds = billingTransactions
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "").replace(",", "")), 0)

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Billing History
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Complete transaction history for your organization.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 rounded-none text-xs font-medium"
                        onClick={() => {
                            const csvContent = [
                                ["Transaction ID", "Date", "Description", "Amount", "Type", "Method", "Status"],
                                ...billingTransactions.map(t => [t.id, t.date, t.description, t.amount, t.type, t.method, t.status]),
                            ].map(row => row.join(",")).join("\n")
                            const blob = new Blob([csvContent], { type: "text/csv" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `billing-history-${new Date().toISOString().slice(0, 10)}.csv`
                            a.click()
                            URL.revokeObjectURL(url)
                            showSuccess("Billing history exported")
                        }}
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Paid</p>
                        <p className="text-white text-xl font-semibold mt-1">${totalPayments.toLocaleString()}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">All time payments</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Transactions</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{billingTransactions.length}</p>
                        <p className="text-primary text-[10px] mt-1">Total records</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Refunds</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">${totalRefunds.toFixed(2)}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Credits returned</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Payment Method</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">Visa 4242</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Primary method</p>
                    </div>
                </div>

                {/* Type Tabs */}
                <div className="flex items-center gap-1 border-b border-zinc-200">
                    {typeFilters.map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                                typeFilter === type
                                    ? "border-primary text-primary"
                                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search by transaction ID or description..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 rounded-none text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-none border border-zinc-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-zinc-200 bg-zinc-50">
                                <TableHead className="text-xs font-semibold text-zinc-600">Transaction ID</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Date</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Description</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Amount</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Type</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Method</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-zinc-50/50 border-zinc-100">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Receipt size={14} className="text-zinc-400" />
                                                <span className="text-sm font-medium text-zinc-900">{t.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {t.date}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-700">
                                            {t.description}
                                        </TableCell>
                                        <TableCell className={`text-sm font-semibold ${
                                            t.type === "refund" || t.type === "credit" ? "text-emerald-600" : "text-zinc-900"
                                        }`}>
                                            {t.type === "refund" || t.type === "credit" ? "+" : "-"}{t.amount}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`rounded-none text-[10px] font-medium px-2 py-0.5 border ${
                                                    t.type === "payment"
                                                        ? "bg-primary/10 text-primary border-primary/20"
                                                        : t.type === "refund"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}
                                            >
                                                {t.type === "payment" && <ArrowUpCircle size={10} className="mr-1" />}
                                                {t.type === "refund" && <ArrowDownCircle size={10} className="mr-1" />}
                                                {t.type === "credit" && <CreditCard size={10} className="mr-1" />}
                                                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-zinc-500">
                                            {t.method}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {t.status === "Completed" && <CheckCircle2 size={12} className="text-emerald-500" />}
                                                {t.status === "Pending" && <Clock size={12} className="text-amber-500" />}
                                                {t.status === "Failed" && <AlertTriangle size={12} className="text-red-500" />}
                                                <span className={`text-xs font-medium ${
                                                    t.status === "Completed" ? "text-emerald-600" :
                                                    t.status === "Pending" ? "text-amber-600" : "text-red-600"
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-sm text-zinc-400">
                                        No transactions found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50">
                        <p className="text-xs text-zinc-500">
                            Showing {filteredTransactions.length} of {billingTransactions.length} transactions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
