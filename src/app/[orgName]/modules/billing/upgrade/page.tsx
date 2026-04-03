"use client"

import React, { useState, useEffect } from "react"
import { Check, Plus, Trash2, X, Send } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { showSuccess, showWarning } from "@/shared/utils/toast"
import { axiosInstance } from "@/lib/axios"

interface Plan {
    id: string
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
    isCurrent: boolean
    isPopular: boolean
}

const defaultPlans: Plan[] = [
    {
        id: "1",
        name: "Starter",
        description: "For small teams and startups",
        monthlyPrice: 99,
        yearlyPrice: 79,
        features: [
            "Up to 10 users",
            "50GB storage",
            "Standard CRM",
            "Email support",
            "Basic analytics",
        ],
        isCurrent: false,
        isPopular: false,
    },
    {
        id: "2",
        name: "Business",
        description: "Advanced tools for growing firms",
        monthlyPrice: 249,
        yearlyPrice: 199,
        features: [
            "Up to 50 users",
            "200GB storage",
            "Full sales suite",
            "Priority support",
            "Advanced reporting",
            "Custom workflows",
        ],
        isCurrent: false,
        isPopular: true,
    },
    {
        id: "3",
        name: "Enterprise Pro",
        description: "Corporate scale and governance",
        monthlyPrice: 599,
        yearlyPrice: 499,
        features: [
            "Unlimited users",
            "500GB storage",
            "Full HRM + CRM",
            "Account manager",
            "Custom integrations",
            "Audit logs & security",
            "SSO / SAML",
        ],
        isCurrent: true,
        isPopular: false,
    },
]

export default function UpgradeDowngradePage() {
    const [isYearly, setIsYearly] = useState(false)
    const [plans, setPlans] = useState<Plan[]>(defaultPlans)
    const [loading, setLoading] = useState(true)

    const fetchPlans = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get("/billingplan/all?currency=USD")
            if (res.data?.success && Array.isArray(res.data.plans)) {
                const mapped: Plan[] = res.data.plans.map((p: any) => {
                    const monthlyPricing = p.pricing?.find((pr: any) => pr.billingCycle === "monthly")
                    const yearlyPricing = p.pricing?.find((pr: any) => pr.billingCycle === "yearly")
                    const monthlyPrice = monthlyPricing?.price ?? 0
                    const yearlyPrice = yearlyPricing?.price ?? Math.round(monthlyPrice * 0.8)
                    return {
                        id: p._id,
                        name: p.name,
                        description: p.description || "",
                        monthlyPrice,
                        yearlyPrice,
                        features: (p.features || []).map((f: any) => f.title),
                        isCurrent: false,
                        isPopular: p.planType === "PRO",
                    }
                })
                setPlans(mapped.length > 0 ? mapped : defaultPlans)
            }
        } catch {
            setPlans(defaultPlans)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [showContactModal, setShowContactModal] = useState(false)
    const [contactName, setContactName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactMessage, setContactMessage] = useState("")

    // Form state
    const [formName, setFormName] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formMonthlyPrice, setFormMonthlyPrice] = useState("")
    const [formYearlyPrice, setFormYearlyPrice] = useState("")
    const [formFeatures, setFormFeatures] = useState<string[]>([""])
    const [formIsPopular, setFormIsPopular] = useState(false)

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormMonthlyPrice("")
        setFormYearlyPrice("")
        setFormFeatures([""])
        setFormIsPopular(false)
    }

    const addFeatureField = () => {
        setFormFeatures((prev) => [...prev, ""])
    }

    const updateFeature = (index: number, value: string) => {
        setFormFeatures((prev) => prev.map((f, i) => (i === index ? value : f)))
    }

    const removeFeature = (index: number) => {
        if (formFeatures.length <= 1) return
        setFormFeatures((prev) => prev.filter((_, i) => i !== index))
    }

    const handleCreate = async () => {
        if (!formName.trim() || !formMonthlyPrice.trim()) {
            showWarning("Plan name and monthly price are required")
            return
        }
        const features = formFeatures.filter((f) => f.trim() !== "")
        if (features.length === 0) {
            showWarning("Add at least one feature")
            return
        }

        const monthlyPrice = parseFloat(formMonthlyPrice)
        const yearlyPrice = formYearlyPrice ? parseFloat(formYearlyPrice) : Math.round(monthlyPrice * 0.8)

        const payload = {
            name: formName.trim(),
            code: formName.trim().toUpperCase().replace(/\s+/g, "_"),
            description: formDescription.trim(),
            planType: formIsPopular ? "PRO" : "BASIC",
            pricing: [
                { currency: "USD", price: monthlyPrice, billingCycle: "monthly" },
                { currency: "USD", price: yearlyPrice, billingCycle: "yearly" },
            ],
            features: features.map((f) => ({ title: f })),
            limits: { maxUsers: 10, maxProjects: 10, maxStorageGB: 50 },
        }

        try {
            await axiosInstance.post("/billingplan/create", payload)
            setShowCreateModal(false)
            resetForm()
            showSuccess(`${formName.trim()} plan created successfully`)
            await fetchPlans()
        } catch {
            showWarning("Failed to create plan")
        }
    }

    const openEditModal = (plan: Plan) => {
        setEditingPlan(plan)
        setFormName(plan.name)
        setFormDescription(plan.description)
        setFormMonthlyPrice(String(plan.monthlyPrice))
        setFormYearlyPrice(String(plan.yearlyPrice))
        setFormFeatures(plan.features.length > 0 ? [...plan.features] : [""])
        setFormIsPopular(plan.isPopular)
        setShowEditModal(true)
    }

    const handleEdit = async () => {
        if (!editingPlan) return
        if (!formName.trim() || !formMonthlyPrice.trim()) {
            showWarning("Plan name and monthly price are required")
            return
        }
        const features = formFeatures.filter((f) => f.trim() !== "")
        if (features.length === 0) {
            showWarning("Add at least one feature")
            return
        }

        const monthlyPrice = parseFloat(formMonthlyPrice)
        const yearlyPrice = formYearlyPrice ? parseFloat(formYearlyPrice) : Math.round(monthlyPrice * 0.8)

        const payload = {
            name: formName.trim(),
            description: formDescription.trim(),
            planType: formIsPopular ? "PRO" : "BASIC",
            pricing: [
                { currency: "USD", price: monthlyPrice, billingCycle: "monthly" },
                { currency: "USD", price: yearlyPrice, billingCycle: "yearly" },
            ],
            features: features.map((f) => ({ title: f })),
        }

        try {
            await axiosInstance.patch(`/billingplan/update/${editingPlan.id}`, payload)
            setShowEditModal(false)
            setEditingPlan(null)
            resetForm()
            showSuccess("Plan updated successfully")
            await fetchPlans()
        } catch {
            showWarning("Failed to update plan")
        }
    }

    const handleDelete = async (id: string) => {
        const plan = plans.find((p) => p.id === id)
        if (plan?.isCurrent) {
            showWarning("Cannot delete the current active plan")
            setDeleteConfirmId(null)
            return
        }

        try {
            await axiosInstance.patch(`/billingplan/deactivate/${id}`)
            setDeleteConfirmId(null)
            showSuccess("Plan deleted successfully")
            await fetchPlans()
        } catch {
            showWarning("Failed to delete plan")
            setDeleteConfirmId(null)
        }
    }

    const handleSelectPlan = (planName: string) => {
        showSuccess(`Plan change to ${planName} requested successfully`)
    }

    const renderFormFields = () => (
        <div className="p-5 space-y-4 bg-white max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">
                        Plan Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="e.g. Professional"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="rounded-none h-9 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">Description</Label>
                    <Input
                        placeholder="e.g. For growing businesses"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="rounded-none h-9 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">
                        Monthly Price ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        placeholder="e.g. 199"
                        value={formMonthlyPrice}
                        onChange={(e) => setFormMonthlyPrice(e.target.value)}
                        className="rounded-none h-9 text-sm"
                        min="0"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">
                        Yearly Price ($) <span className="text-zinc-400 text-[10px]">auto 20% off if empty</span>
                    </Label>
                    <Input
                        type="number"
                        placeholder="e.g. 159"
                        value={formYearlyPrice}
                        onChange={(e) => setFormYearlyPrice(e.target.value)}
                        className="rounded-none h-9 text-sm"
                        min="0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-none">
                <Switch
                    checked={formIsPopular}
                    onCheckedChange={setFormIsPopular}
                    className="data-[state=checked]:bg-primary"
                />
                <div>
                    <p className="text-xs font-medium text-zinc-900">Mark as Popular</p>
                    <p className="text-[10px] text-zinc-500">Shows a &quot;Popular&quot; badge on this plan</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-600">
                        Features <span className="text-red-500">*</span>
                    </Label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-primary gap-1 px-2"
                        onClick={addFeatureField}
                    >
                        <Plus size={10} /> Add Feature
                    </Button>
                </div>
                <div className="space-y-2">
                    {formFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-none bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Check size={10} />
                            </div>
                            <Input
                                placeholder={`Feature ${index + 1}`}
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                                className="rounded-none h-8 text-xs flex-1"
                            />
                            {formFeatures.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500"
                                    onClick={() => removeFeature(index)}
                                >
                                    <X size={14} />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Upgrade / Downgrade
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Choose the plan that best fits your organization&apos;s needs
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                            onClick={() => {
                                resetForm()
                                setShowCreateModal(true)
                            }}
                        >
                            <Plus size={14} />
                            Create Plan
                        </Button>
                        <span
                            className={`text-sm font-medium ${
                                !isYearly ? "text-zinc-900" : "text-zinc-400"
                            }`}
                        >
                            Monthly
                        </span>
                        <Switch
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span
                            className={`text-sm font-medium ${
                                isYearly ? "text-zinc-900" : "text-zinc-400"
                            }`}
                        >
                            Yearly
                        </span>
                        {isYearly && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 rounded-none text-xs font-medium">
                                Save 20%
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white border rounded-none p-6 flex flex-col ${
                                plan.isCurrent
                                    ? "border-primary bg-primary/5"
                                    : "border-zinc-200"
                            }`}
                        >
                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                {plan.isPopular && (
                                    <Badge className="bg-primary text-white rounded-none text-[10px] font-medium">
                                        Popular
                                    </Badge>
                                )}
                                {plan.isCurrent && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-medium">
                                        Current
                                    </Badge>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-zinc-900">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-zinc-500 mt-1">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-2xl font-semibold text-zinc-900">
                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-sm text-zinc-500">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 text-sm text-zinc-600"
                                    >
                                        <Check
                                            size={16}
                                            className="text-primary shrink-0"
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <Button
                                    disabled={plan.isCurrent}
                                    onClick={() =>
                                        !plan.isCurrent && handleSelectPlan(plan.name)
                                    }
                                    className={`w-full rounded-none font-medium text-sm ${
                                        plan.isCurrent
                                            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
                                            : "bg-primary hover:bg-primary/90 text-white"
                                    }`}
                                >
                                    {plan.isCurrent ? "Current Plan" : "Select Plan"}
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-none text-xs font-medium h-8 border-zinc-200"
                                        onClick={() => openEditModal(plan)}
                                    >
                                        Edit
                                    </Button>
                                    {!plan.isCurrent && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-none text-xs font-medium h-8 border-zinc-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => setDeleteConfirmId(plan.id)}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Sales */}
                <div className="bg-white border border-zinc-200 rounded-none p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                            Need a custom solution?
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">
                            Get in touch with our sales team for a tailored plan that
                            meets your specific requirements.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-none border-primary text-primary hover:bg-primary hover:text-white font-medium text-sm shrink-0"
                        onClick={() => {
                            setContactName("")
                            setContactEmail("")
                            setContactMessage("")
                            setShowContactModal(true)
                        }}
                    >
                        Contact Sales
                    </Button>
                </div>
            </div>

            {/* Contact Sales Modal */}
            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Send size={16} /> Contact Sales
                        </h2>
                        <p className="text-xs opacity-80 mt-1">
                            Tell us about your requirements and we&apos;ll get back to you within 24 hours.
                        </p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-zinc-600">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="Your full name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                className="rounded-none h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-zinc-600">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                placeholder="you@company.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="rounded-none h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-zinc-600">Message</Label>
                            <Textarea
                                placeholder="Tell us about your team size, requirements, and any specific needs..."
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                className="rounded-none text-sm min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowContactModal(false)}
                            className="rounded-none text-sm text-zinc-600 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (!contactName.trim() || !contactEmail.trim()) {
                                    showWarning("Please fill in name and email")
                                    return
                                }
                                setShowContactModal(false)
                                showSuccess("Your request has been submitted. Our sales team will contact you within 24 hours.")
                            }}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20 gap-2"
                        >
                            <Send size={14} /> Send Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Plan Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-lg rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Plus size={16} /> Create New Plan
                        </h2>
                        <p className="text-xs opacity-80 mt-1">
                            Define a new pricing plan with features for your customers.
                        </p>
                    </div>
                    {renderFormFields()}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowCreateModal(false)
                                resetForm()
                            }}
                            className="rounded-none text-sm text-zinc-600 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Create Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Plan Modal */}
            <Dialog
                open={showEditModal}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowEditModal(false)
                        setEditingPlan(null)
                        resetForm()
                    }
                }}
            >
                <DialogContent className="max-w-lg rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold">Edit Plan</h2>
                        <p className="text-xs opacity-80 mt-1">
                            Update the plan details and features.
                        </p>
                    </div>
                    {renderFormFields()}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowEditModal(false)
                                setEditingPlan(null)
                                resetForm()
                            }}
                            className="rounded-none text-sm text-zinc-600 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteConfirmId}
                onOpenChange={() => setDeleteConfirmId(null)}
            >
                <DialogContent className="max-w-sm rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <h2 className="text-sm font-semibold text-zinc-900">Delete Plan</h2>
                        <p className="text-xs text-zinc-500 mt-1">
                            Are you sure you want to delete this plan? This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-none text-sm text-zinc-600 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            className="rounded-none text-sm h-9 px-5"
                        >
                            Delete Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
