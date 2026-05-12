"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Package, Zap, Shield, Star, Check, Plus, Target, Layers, Activity, Trash2, PencilLine, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"

interface Plan {
    id: number
    name: string
    price: string
    billing: string
    activeClients: number
    revenue: string
    features: string[]
    color: string
    isPopular?: boolean
    iconKey: 'zap' | 'package' | 'shield'
}

const iconMap = { zap: Zap, package: Package, shield: Shield }

const initialPlans: Plan[] = [
    { id: 1, name: 'Starter', price: '$49', billing: 'per month', activeClients: 124, revenue: '$6,076', features: ['Up to 5 Projects', 'Basic CRM', 'Email Support'], color: 'bg-indigo-50 text-indigo-600 border-indigo-100', iconKey: 'zap' },
    { id: 2, name: 'Professional', price: '$199', billing: 'per month', activeClients: 420, revenue: '$83,580', features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'API Access'], color: 'bg-purple-50 text-purple-600 border-purple-100', iconKey: 'package', isPopular: true },
    { id: 3, name: 'Enterprise', price: '$999', billing: 'per month', activeClients: 86, revenue: '$85,914', features: ['Custom Contracts', 'Dedicated Account Manager', '24/7 Phone Support', 'SLA Guarantee'], color: 'bg-emerald-50 text-emerald-600 border-emerald-100', iconKey: 'shield' },
]

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    price: (v: string) => !v ? "" : !/^\$?\d+(\.\d{1,2})?$/.test(v.trim()) ? "Enter a valid price (e.g., $49 or 49.99)" : "",
}

export default function PlansPricing() {
    const router = useRouter()
    const [plans, setPlans] = React.useState<Plan[]>(initialPlans)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Plan | null>(null)

    const [form, setForm] = React.useState({ name: "", price: "", billing: "per month", features: "", iconKey: "package" as Plan['iconKey'] })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.price = validators.required(form.price) || validators.price(form.price)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", price: "", billing: "per month", features: "", iconKey: "package" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (p: Plan) => {
        setEditingId(p.id)
        setForm({ name: p.name, price: p.price, billing: p.billing, features: p.features.join("\n"), iconKey: p.iconKey })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const features = form.features.split("\n").map(f => f.trim()).filter(Boolean)
        const price = form.price.startsWith("$") ? form.price : `$${form.price}`
        if (editingId) {
            setPlans(plans.map(p => p.id === editingId ? { ...p, name: form.name.trim(), price, billing: form.billing, features, iconKey: form.iconKey } : p))
            toast.success("Plan updated")
        } else {
            setPlans([...plans, { id: Date.now(), name: form.name.trim(), price, billing: form.billing, features, color: 'bg-cyan-50 text-cyan-600 border-cyan-100', iconKey: form.iconKey, activeClients: 0, revenue: "$0" }])
            toast.success("Plan created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setPlans(plans.filter(p => p.id !== id))
        toast.success("Plan removed")
    }

    const openDetail = (p: Plan) => { setSelected(p); setIsDetailOpen(true) }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plans & <span className="text-indigo-600">Pricing</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Manage product monetization logic, feature gating and billing tiers.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />Add Plan
                </Button>
            </header>

            {/* KPI metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-none cursor-pointer hover:shadow-md transition bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200/50 border" onClick={() => router.push('/client-management/subscriptions/active')}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"><Target className="h-4 w-4" />Best Performing Plan</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">Professional</span>
                            <Badge className="rounded-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50">+12% growth</Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-none cursor-pointer hover:shadow-md transition bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200/50 border" onClick={() => toast.success("Showing all price variants")}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"><Layers className="h-4 w-4" />Active Price Points</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">{plans.length * 4} Variants</span>
                            <span className="text-[11px] font-bold text-slate-500">Across {plans.length} tiers</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-none cursor-pointer hover:shadow-md transition bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 border" onClick={() => router.push('/client-management/analytics/revenue')}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"><Activity className="h-4 w-4" />Avg Revenue / Plan</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">$58.4k</span>
                            <span className="text-[11px] font-bold text-slate-500">Monthly Avg</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const Icon = iconMap[plan.iconKey]
                    return (
                        <Card key={plan.id} className={`rounded-none relative flex flex-col bg-white p-6 transition hover:shadow-xl cursor-pointer group ${plan.isPopular ? "border-indigo-200" : "border-slate-200"}`} onClick={() => openDetail(plan)}>
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5">
                                        <Star className="h-3 w-3 fill-white" /> Popular
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-12 w-12 rounded-none flex items-center justify-center border ${plan.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-xs font-medium text-slate-500">/{plan.billing}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 pb-2">
                                    <span>Platform Metrics</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-none border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">Active Clients</span>
                                    <span className="text-xs font-bold text-slate-900">{plan.activeClients}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-none border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">Plan Revenue (MRR)</span>
                                    <span className="text-xs font-bold text-indigo-600">{plan.revenue}</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Features</h4>
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <div className="h-4 w-4 shrink-0 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5">
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-none text-xs font-bold uppercase tracking-widest" onClick={() => openEdit(plan)}>
                                    Edit Plan
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-none border-slate-200">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none">
                                        <DropdownMenuItem onClick={() => openDetail(plan)}>View Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEdit(plan)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-rose-500" onClick={() => handleDelete(plan.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Plan" : "Add Plan"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure a new pricing tier.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Plan Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Starter" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Price <span className="text-rose-500">*</span></Label>
                                <Input value={form.price} onChange={e => setField("price", e.target.value)} placeholder="$49" className={`h-10 rounded-none ${errors.price ? "border-rose-500" : ""}`} />
                                {errors.price && <p className="text-[11px] text-rose-500">{errors.price}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Billing</Label>
                                <Input value={form.billing} onChange={e => setField("billing", e.target.value)} placeholder="per month" className="h-10 rounded-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Features (one per line)</Label>
                            <Textarea value={form.features} onChange={e => setField("features", e.target.value)} placeholder="Up to 5 Projects&#10;Basic CRM&#10;Email Support" className="rounded-none min-h-[100px]" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save Changes" : "Add Plan"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Plan Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Plan</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.price} / {selected.billing}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Active Clients</p><p className="font-semibold text-slate-900">{selected.activeClients}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">MRR</p><p className="font-semibold text-indigo-600">{selected.revenue}</p></div>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Features</p>
                                    <div className="space-y-2">
                                        {selected.features.map((f, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-slate-700"><Check className="h-4 w-4 text-emerald-600 mt-0.5" />{f}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
