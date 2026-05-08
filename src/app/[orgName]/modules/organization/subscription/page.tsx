"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    CreditCard,
    Zap,
    ArrowUpCircle,
    ShieldCheck,
    Package,
    FileText,
    Receipt,
    Clock,
    Check,
    Download,
    Rocket,
    LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"

const availablePlans = [
    { name: "Starter", price: "$499.00", features: ["5 Business Units", "25 Users", "50GB Storage", "500k Api Calls"] },
    { name: "Professional", price: "$999.00", features: ["15 Business Units", "75 Users", "250GB Storage", "2M Api Calls"] },
    { name: "Enterprise Scale Plus", price: "$1,499.00", features: ["25 Business Units", "100 Users", "500GB Storage", "5M Api Calls"], current: true },
    { name: "Ultimate Scale", price: "$4,999.00", features: ["Unlimited Business Units", "Unlimited Users", "2TB Storage", "Unlimited Api Calls", "24/7 Priority Concierge"] },
]

export default function OrgSubscriptionPage() {
    const router = useRouter()
    const params = useParams() as { orgName: string }

    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isCompareOpen, setIsCompareOpen] = useState(false)
    const [cvv, setCvv] = useState("")
    const [cvvError, setCvvError] = useState("")
    const [selectedPlan, setSelectedPlan] = useState("Ultimate Scale")

    const [currentBilling, setCurrentBilling] = useState<any>(null)
    const [billingHistories, setBillingHistories] = useState<any[]>([])

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({ name: "", number: "", expiry: "", cvc: "" })
    const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const [planRes, historyRes] = await Promise.allSettled([
                    axiosInstance.get("/OrgBilling/current-plan"),
                    axiosInstance.get("/OrgBilling/history"),
                ])

                const planValue: any = planRes.status === "fulfilled" ? planRes.value?.data?.currentPlan : null
                const historyValue: any[] =
                    historyRes.status === "fulfilled" ? historyRes.value?.data?.billingHistories ?? [] : []

                setCurrentBilling(planValue)
                setBillingHistories(historyValue)

                const planName = planValue?.planSnapshot?.name
                if (planName) setSelectedPlan(planName)
            } catch {
                // keep existing mock UI while backend fails
            }
        }

        fetchBilling()
    }, [])

    const usageMetrics = [
        { label: "Active Firms", current: 3, limit: 10, variant: "blue" },
        { label: "Total Users", current: 48, limit: 100, variant: "blue" },
        { label: "Storage Capacity", current: 74, limit: 100, variant: "emerald", unit: "GB" },
        { label: "Api Monthly Calls", current: 1.2, limit: 5.0, variant: "amber", unit: "M" },
    ]

    const recentInvoices = (() => {
        if (billingHistories.length) {
            return billingHistories.slice(0, 3).map((h: any, idx: number) => {
                const createdAt = h?.createdAt ? new Date(h.createdAt) : null
                const planName = h?.planSnapshot?.name ?? "Plan"
                const price = h?.planSnapshot?.price
                const amount =
                    typeof price === "number" ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$â€”"

                return {
                    id: `#${planName}-${idx + 1}`,
                    date: createdAt ? createdAt.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "â€”",
                    amount,
                    status: h?.paymentStatus === "active" ? "Paid" : h?.paymentStatus === "trialing" ? "Trial" : "Updated",
                    method: "Billing on file",
                }
            })
        }

        // fallback
        return [
            { id: "#Inv-2026-001", date: "Jan 24, 2026", amount: "$1,499.00", status: "Paid", method: "Visa â€¢â€¢â€¢â€¢ 4242" },
            { id: "#Inv-2025-012", date: "Dec 24, 2025", amount: "$1,499.00", status: "Paid", method: "Visa â€¢â€¢â€¢â€¢ 4242" },
            { id: "#Inv-2025-011", date: "Nov 24, 2025", amount: "$1,499.00", status: "Paid", method: "Visa â€¢â€¢â€¢â€¢ 4242" },
        ]
    })()

    const handleUpgrade = () => {
        if (!cvv || cvv.length < 3) {
            setCvvError("Please enter a valid 3-digit CVV")
            return
        }
        setCvvError("")
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Processing upgrade to " + selectedPlan + "...",
            success: `Plan upgraded to ${selectedPlan}! Limits have been expanded.`,
            error: "Payment failed. Please check card balance."
        })
        setCvv("")
        setIsUpgradeOpen(false)
    }

    const validatePaymentForm = () => {
        const errors: Record<string, string> = {}
        if (!paymentForm.name.trim()) errors.name = "Cardholder name is required"
        if (!paymentForm.number.trim() || paymentForm.number.replace(/\s/g, "").length < 16) errors.number = "Enter a valid 16-digit card number"
        if (!paymentForm.expiry.trim() || !/^\d{2}\/\d{2}$/.test(paymentForm.expiry)) errors.expiry = "Enter valid MM/YY"
        if (!paymentForm.cvc.trim() || paymentForm.cvc.length < 3) errors.cvc = "Enter valid CVC"
        setPaymentErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSavePayment = () => {
        if (!validatePaymentForm()) return
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Validating with payment gateway...",
            success: "Payment method updated successfully.",
            error: "Card validation failed. Please try again."
        })
        setPaymentForm({ name: "", number: "", expiry: "", cvc: "" })
        setPaymentErrors({})
        setIsPaymentOpen(false)
    }

    const handleDownloadInvoice = (invoiceId: string) => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: `Generating PDF for ${invoiceId}...`,
            success: `Invoice ${invoiceId} downloaded successfully.`,
            error: "Failed to generate PDF."
        })
    }

    const navigateToHistory = () => {
        router.push(`/${params.orgName}/modules/organization/subscription/history`)
    }

    const navigateToInvoices = () => {
        router.push(`/${params.orgName}/modules/organization/subscription/invoices`)
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900">Subscription & Usage</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your enterprise plan, usage limits and billing information.</p>
                </div>
                <Button
                    className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-medium text-xs px-4 shadow-sm"
                    onClick={() => setIsUpgradeOpen(true)}
                >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    Upgrade Plan
                </Button>
            </div>

            {/* Plan Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-lg relative overflow-hidden rounded-xl">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Package className="w-48 h-48" />
                    </div>
                    <CardHeader className="pb-1 p-5">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-1.5 bg-blue-500 rounded-lg">
                                <Zap className="w-4 h-4 text-white fill-white" />
                            </div>
                            <Badge className="bg-blue-400 text-[10px] text-zinc-950 font-medium hover:bg-blue-400 border-none">Active Plan</Badge>
                        </div>
                        <CardTitle className="text-xl font-semibold tracking-tight">
                            {currentBilling?.planSnapshot?.name ?? "Enterprise Scale Plus"}
                        </CardTitle>
                        <CardDescription className="text-indigo-200 text-xs">
                            {currentBilling?.nextPaymentDate
                                ? `Auto-renewing on ${new Date(currentBilling.nextPaymentDate).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                  })}`
                                : "Auto-renewing on Oct 24, 2026"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 p-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-medium text-indigo-300">Monthly Price</p>
                                <p className="text-sm font-semibold text-white">
                                    {typeof currentBilling?.planSnapshot?.price === "number"
                                        ? `$${currentBilling.planSnapshot.price.toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })}`
                                        : "$1,499.00"}
                                </p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-medium text-indigo-300">Payment Method</p>
                                <p className="text-xs font-medium text-white flex items-center gap-1.5">â€¢â€¢â€¢â€¢ 4242 <CreditCard className="w-3 h-3" /></p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-medium text-indigo-300">Billing Logic</p>
                                <p className="text-xs font-medium text-white">Consumption Post-paid</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-medium text-indigo-300">Compliance</p>
                                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Fully Vetted</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-white/5 border-t border-white/10 mt-4 flex justify-between px-5 py-3">
                        <p className="text-[10px] text-indigo-200">Your organization is currently using <span className="text-white font-semibold text-xs">74%</span> of allocated infrastructure sources.</p>
                        <Button variant="link" className="text-blue-400 text-[10px] font-medium p-0" onClick={() => setIsCompareOpen(true)}>Compare Plans</Button>
                    </CardFooter>
                </Card>

                <Card className="border-slate-200 shadow-sm rounded-xl relative">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-semibold text-slate-800">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4 pt-2">
                        <Button variant="outline" className="w-full justify-start h-9 text-xs font-medium hover:bg-slate-50 border-slate-200 rounded-lg" onClick={() => handleDownloadInvoice("#Inv-2026-001")}>
                            <FileText className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                            Download Latest Invoice
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-start h-9 text-xs font-medium hover:bg-slate-50 border-slate-200 rounded-lg"
                            onClick={() => setIsPaymentOpen(true)}
                        >
                            <CreditCard className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                            Update Payment Details
                        </Button>

                        <Button variant="outline" className="w-full justify-start h-9 text-xs font-medium hover:bg-slate-50 border-slate-200 rounded-lg" onClick={navigateToHistory}>
                            <Receipt className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                            Billing History
                        </Button>
                        <div className="pt-3 mt-3 border-t border-slate-100">
                            <p className="text-[10px] text-slate-400">Next billing attempt: Feb 01, 2026</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Limits */}
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                    <CardTitle className="text-xs font-semibold text-slate-900">Consumption & Limits</CardTitle>
                    <CardDescription className="text-[10px]">Monitor your resource allocation and prevent overage charges.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {usageMetrics.map((metric, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400">{metric.label}</p>
                                        <p className="text-xl font-semibold text-slate-900 mt-0.5">{metric.current}{metric.unit} <span className="text-xs font-normal text-slate-400">/ {metric.limit}{metric.unit}</span></p>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] font-medium border-none ${metric.current > metric.limit * 0.8 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                        {Math.round((metric.current / metric.limit) * 100)}%
                                    </Badge>
                                </div>
                                <Progress
                                    value={(metric.current / metric.limit) * 100}
                                    className={`h-1.5 rounded-full bg-slate-100 [&>div]:${metric.current > metric.limit * 0.8 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
                    <div className="space-y-0.5">
                        <CardTitle className="text-xs font-semibold text-slate-900">Recent Billing Transactions</CardTitle>
                        <CardDescription className="text-[10px]">A log of your most recent plan charges and credits.</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-[10px] font-medium text-blue-600" onClick={navigateToHistory}>See All History</Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {recentInvoices.map((inv, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={navigateToInvoices}>{inv.id}</p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {inv.date}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-medium text-slate-400">{inv.method}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className="text-xs font-semibold text-slate-900">{inv.amount}</p>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-medium">Success</Badge>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-600 border border-slate-100 rounded-lg" onClick={() => handleDownloadInvoice(inv.id)}>
                                        <Download className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Plan â€” side sheet */}
            <SideFormSheet
                open={isUpgradeOpen}
                onOpenChange={(o) => {
                    setIsUpgradeOpen(o)
                    if (!o) {
                        setCvv("")
                        setCvvError("")
                    }
                }}
                title="Confirm Plan Upgrade"
                description="Review your new plan and confirm the upgrade."
                icon={<Rocket className="w-5 h-5" />}
                accentColor="#059669"
                width="lg"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleUpgrade()
                }}
                submitLabel="Commit Upgrade"
            >
                <div className="space-y-5">
                    {/* Plan summary â€” dark panel, explicit white text */}
                    <div className="relative bg-slate-900 rounded-none p-6 overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
                                backgroundSize: "18px 18px",
                            }}
                        />
                        <div className="relative space-y-4">
                            <Badge className="bg-emerald-500 text-slate-950 font-semibold text-[10px] px-2 py-0.5 rounded-full hover:bg-emerald-500">
                                Elite Tier
                            </Badge>
                            <div>
                                <h2 className="text-white text-xl font-bold tracking-tight leading-tight">
                                    {selectedPlan}
                                </h2>
                                <p className="text-slate-300 text-[12.5px] mt-1.5">
                                    Unlimited power for global giants.
                                </p>
                            </div>
                            <div className="space-y-2 pt-1">
                                {(availablePlans.find((p) => p.name === selectedPlan)?.features || []).map((f) => (
                                    <div key={f} className="flex items-center gap-2.5">
                                        <div className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                                        </div>
                                        <span className="text-[12.5px] text-white">{f}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <p className="text-white text-2xl font-bold">
                                    {availablePlans.find((p) => p.name === selectedPlan)?.price}
                                    <span className="text-[11px] text-slate-400 font-medium ml-1">/mo</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Current method */}
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Method</p>
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-10 h-6 bg-slate-900 rounded flex items-center justify-center text-[9px] font-bold italic text-white">
                                        VISA
                                    </div>
                                    <p className="text-[13px] font-semibold text-slate-900">â€¢â€¢â€¢â€¢ 4242</p>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-blue-600 text-[12px] font-medium p-0 h-auto"
                                    onClick={() => {
                                        setIsUpgradeOpen(false)
                                        setIsPaymentOpen(true)
                                    }}
                                >
                                    Change
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Field label="Security Code (CVV)" required error={cvvError} hint="3 digits on the back of your card">
                        <Input
                            type="password"
                            placeholder="â€¢â€¢â€¢"
                            value={cvv}
                            onChange={(e) => {
                                setCvv(e.target.value.replace(/\D/g, ""))
                                setCvvError("")
                            }}
                            className="h-11 rounded-lg bg-white border-slate-200 font-mono text-center text-base tracking-[0.5em]"
                            maxLength={4}
                            autoComplete="cc-csc"
                            inputMode="numeric"
                        />
                    </Field>

                    <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-emerald-800 leading-relaxed">
                            Billed immediately. Prorated credits from your current plan will be applied to the next invoice.
                        </p>
                    </div>
                </div>
            </SideFormSheet>

            {/* Update Payment Details â€” side sheet */}
            <SideFormSheet
                open={isPaymentOpen}
                onOpenChange={(o) => {
                    setIsPaymentOpen(o)
                    if (!o) {
                        setPaymentForm({ name: "", number: "", expiry: "", cvc: "" })
                        setPaymentErrors({})
                    }
                }}
                title="Update Payment Method"
                description="Your PCI-DSS compliant payment details are encrypted end-to-end."
                icon={<CreditCard className="w-5 h-5" />}
                width="md"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSavePayment()
                }}
                submitLabel="Save Securely"
            >
                <div className="space-y-4">
                    <Field label="Cardholder Name" required error={paymentErrors.name}>
                        <Input
                            placeholder="John Doe"
                            value={paymentForm.name}
                            onChange={(e) =>
                                setPaymentForm((prev) => ({
                                    ...prev,
                                    name: e.target.value.replace(/[^A-Za-z\s.'-]/g, ""),
                                }))
                            }
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <Field label="Card Number" required error={paymentErrors.number} hint="16-digit card number">
                        <Input
                            placeholder="0000 0000 0000 0000"
                            value={paymentForm.number}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 16)
                                const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
                                setPaymentForm((prev) => ({ ...prev, number: formatted }))
                            }}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono tracking-wider"
                            inputMode="numeric"
                            autoComplete="cc-number"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Expiry" required error={paymentErrors.expiry} hint="MM/YY">
                            <Input
                                placeholder="12/26"
                                value={paymentForm.expiry}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^\d]/g, "").slice(0, 4)
                                    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2)
                                    setPaymentForm((prev) => ({ ...prev, expiry: val }))
                                }}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono"
                                maxLength={5}
                                inputMode="numeric"
                                autoComplete="cc-exp"
                            />
                        </Field>
                        <Field label="CVC" required error={paymentErrors.cvc} hint="3 or 4 digits">
                            <Input
                                type="password"
                                placeholder="â€¢â€¢â€¢"
                                value={paymentForm.cvc}
                                onChange={(e) =>
                                    setPaymentForm((prev) => ({
                                        ...prev,
                                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                                    }))
                                }
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono"
                                maxLength={4}
                                inputMode="numeric"
                                autoComplete="cc-csc"
                            />
                        </Field>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-blue-800 leading-relaxed">
                            Your card information is encrypted and securely stored. We are PCI-DSS compliant.
                        </p>
                    </div>
                </div>
            </SideFormSheet>

            {/* Compare Plans â€” side sheet */}
            <SideFormSheet
                open={isCompareOpen}
                onOpenChange={setIsCompareOpen}
                title="Compare Plans"
                description="Choose the plan that best fits your organization."
                icon={<LayoutGrid className="w-5 h-5" />}
                width="xl"
                hideFooter
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availablePlans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`p-4 rounded-xl border ${plan.current ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-white hover:border-slate-300"} space-y-3 transition-colors`}
                        >
                            <div>
                                <p className="text-[13px] font-semibold text-slate-900">{plan.name}</p>
                                <p className="text-lg font-bold text-slate-900 mt-1">
                                    {plan.price}
                                    <span className="text-[11px] font-normal text-slate-400">/mo</span>
                                </p>
                            </div>
                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                {plan.features.map((f) => (
                                    <div key={f} className="flex items-center gap-1.5">
                                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <span className="text-[11.5px] text-slate-600">{f}</span>
                                    </div>
                                ))}
                            </div>
                            {plan.current ? (
                                <Badge className="bg-blue-100 text-blue-700 border-none text-[10px] font-medium w-full justify-center py-1">
                                    Current Plan
                                </Badge>
                            ) : (
                                <Button
                                    className="w-full h-9 bg-slate-900 hover:bg-blue-600 text-white font-medium text-[12px] rounded-lg shadow-sm transition-colors"
                                    onClick={() => {
                                        setSelectedPlan(plan.name)
                                        setIsCompareOpen(false)
                                        setIsUpgradeOpen(true)
                                    }}
                                >
                                    {parseInt(plan.price.replace(/\D/g, "")) > 1499 ? "Upgrade" : "Downgrade"}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </SideFormSheet>
        </div>
    )
}
