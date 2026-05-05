"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Check, Plus, Trash2, X, Send, Sparkles, Edit3 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
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

    // Contact sales form
    const [contactName, setContactName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactMessage, setContactMessage] = useState("")
    const [contactTouched, setContactTouched] = useState<Record<string, boolean>>({})
    const [submittingContact, setSubmittingContact] = useState(false)

    // Plan form (create/edit)
    const [formName, setFormName] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formMonthlyPrice, setFormMonthlyPrice] = useState("")
    const [formYearlyPrice, setFormYearlyPrice] = useState("")
    const [formFeatures, setFormFeatures] = useState<string[]>([""])
    const [formIsPopular, setFormIsPopular] = useState(false)
    const [formTouched, setFormTouched] = useState<Record<string, boolean>>({})
    const [submittingPlan, setSubmittingPlan] = useState(false)

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormMonthlyPrice("")
        setFormYearlyPrice("")
        setFormFeatures([""])
        setFormIsPopular(false)
        setFormTouched({})
    }

    const planErrors = useMemo(() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        const desc = formDescription.trim()
        const mp = formMonthlyPrice.trim()
        const yp = formYearlyPrice.trim()

        if (formTouched.name) {
            if (!name) e.name = "Plan name is required"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
            else if (name.length > 50) e.name = "Name is too long (max 50)"
            else if (!/^[A-Za-z0-9\s&+-]+$/.test(name))
                e.name = "Use letters, numbers, spaces, & + -"
        }
        if (formTouched.description && desc.length > 200) {
            e.description = "Description is too long (max 200 chars)"
        }
        if (formTouched.monthlyPrice) {
            if (!mp) e.monthlyPrice = "Monthly price is required"
            else {
                const n = Number(mp)
                if (isNaN(n)) e.monthlyPrice = "Must be a valid number"
                else if (n < 0) e.monthlyPrice = "Price cannot be negative"
                else if (n > 100000) e.monthlyPrice = "Price seems too high"
            }
        }
        if (formTouched.yearlyPrice && yp) {
            const n = Number(yp)
            const mpNum = Number(mp)
            if (isNaN(n)) e.yearlyPrice = "Must be a valid number"
            else if (n < 0) e.yearlyPrice = "Price cannot be negative"
            else if (!isNaN(mpNum) && n > mpNum * 12)
                e.yearlyPrice = "Yearly should be less than 12× monthly"
        }
        return e
    }, [formName, formDescription, formMonthlyPrice, formYearlyPrice, formTouched])

    const contactErrors = useMemo(() => {
        const e: Record<string, string> = {}
        const name = contactName.trim()
        const email = contactEmail.trim()
        const msg = contactMessage.trim()

        if (contactTouched.name) {
            if (!name) e.name = "Name is required"
            else if (!/^[A-Za-z\s.'-]+$/.test(name)) e.name = "Only letters allowed"
            else if (name.length < 2) e.name = "Name too short"
        }
        if (contactTouched.email) {
            if (!email) e.email = "Email is required"
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email"
        }
        if (contactTouched.message && msg.length > 1000) {
            e.message = "Message too long (max 1000 chars)"
        }
        return e
    }, [contactName, contactEmail, contactMessage, contactTouched])

    const addFeatureField = () => setFormFeatures((prev) => [...prev, ""])
    const updateFeature = (i: number, v: string) =>
        setFormFeatures((prev) => prev.map((f, idx) => (idx === i ? v : f)))
    const removeFeature = (i: number) => {
        if (formFeatures.length <= 1) return
        setFormFeatures((prev) => prev.filter((_, idx) => idx !== i))
    }

    const validatePlanSubmit = () => {
        setFormTouched({
            name: true,
            description: true,
            monthlyPrice: true,
            yearlyPrice: true,
        })
        const name = formName.trim()
        const mp = formMonthlyPrice.trim()
        if (!name) return "Plan name is required"
        if (name.length < 2) return "Plan name too short"
        if (!/^[A-Za-z0-9\s&+-]+$/.test(name)) return "Plan name contains invalid characters"
        if (!mp) return "Monthly price is required"
        const mpNum = Number(mp)
        if (isNaN(mpNum) || mpNum < 0) return "Enter a valid monthly price"
        const features = formFeatures.filter((f) => f.trim() !== "")
        if (features.length === 0) return "Add at least one feature"
        if (features.some((f) => f.length > 100)) return "Features must be under 100 chars each"
        return null
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validatePlanSubmit()
        if (err) {
            showWarning(err)
            return
        }

        const monthlyPrice = parseFloat(formMonthlyPrice)
        const yearlyPrice = formYearlyPrice
            ? parseFloat(formYearlyPrice)
            : Math.round(monthlyPrice * 0.8 * 12) / 12
        const features = formFeatures.filter((f) => f.trim() !== "").map((f) => f.trim())

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

        setSubmittingPlan(true)
        try {
            await axiosInstance.post("/billingplan/create", payload)
            setShowCreateModal(false)
            showSuccess(`${formName.trim()} plan created successfully`)
            resetForm()
            await fetchPlans()
        } catch {
            showWarning("Failed to create plan. Please try again.")
        } finally {
            setSubmittingPlan(false)
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
        setFormTouched({})
        setShowEditModal(true)
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingPlan) return
        const err = validatePlanSubmit()
        if (err) {
            showWarning(err)
            return
        }

        const monthlyPrice = parseFloat(formMonthlyPrice)
        const yearlyPrice = formYearlyPrice
            ? parseFloat(formYearlyPrice)
            : Math.round(monthlyPrice * 0.8 * 12) / 12
        const features = formFeatures.filter((f) => f.trim() !== "").map((f) => f.trim())

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

        setSubmittingPlan(true)
        try {
            await axiosInstance.patch(`/billingplan/update/${editingPlan.id}`, payload)
            setShowEditModal(false)
            setEditingPlan(null)
            showSuccess("Plan updated successfully")
            resetForm()
            await fetchPlans()
        } catch {
            showWarning("Failed to update plan. Please try again.")
        } finally {
            setSubmittingPlan(false)
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

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setContactTouched({ name: true, email: true, message: true })
        if (!contactName.trim()) return showWarning("Name is required")
        if (!/^[A-Za-z\s.'-]+$/.test(contactName.trim())) return showWarning("Name contains invalid characters")
        if (!contactEmail.trim()) return showWarning("Email is required")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) return showWarning("Enter a valid email")
        if (contactMessage.length > 1000) return showWarning("Message too long")

        setSubmittingContact(true)
        try {
            await new Promise((r) => setTimeout(r, 400))
            setShowContactModal(false)
            showSuccess("Your request has been submitted. Our sales team will contact you within 24 hours.")
            setContactName("")
            setContactEmail("")
            setContactMessage("")
            setContactTouched({})
        } finally {
            setSubmittingContact(false)
        }
    }

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Plan Name" required error={planErrors.name} hint="Letters, numbers, spaces, & + -">
                <Input
                    placeholder="e.g. Professional"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value.replace(/[^A-Za-z0-9\s&+-]/g, ""))}
                    onBlur={() => setFormTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={50}
                />
            </Field>

            <Field label="Description" error={planErrors.description} hint="A short tagline (max 200 chars)">
                <Input
                    placeholder="e.g. For growing businesses"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    onBlur={() => setFormTouched((t) => ({ ...t, description: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={200}
                />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Price ($)" required error={planErrors.monthlyPrice} hint="USD">
                    <Input
                        type="number"
                        placeholder="199"
                        value={formMonthlyPrice}
                        onChange={(e) => setFormMonthlyPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                        onBlur={() => setFormTouched((t) => ({ ...t, monthlyPrice: true }))}
                        className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        min={0}
                        step={0.01}
                    />
                </Field>

                <Field label="Yearly Price ($)" error={planErrors.yearlyPrice} hint="Auto 20% off if empty">
                    <Input
                        type="number"
                        placeholder="159"
                        value={formYearlyPrice}
                        onChange={(e) => setFormYearlyPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                        onBlur={() => setFormTouched((t) => ({ ...t, yearlyPrice: true }))}
                        className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        min={0}
                        step={0.01}
                    />
                </Field>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAFBFC] border border-[#EEF1F6] rounded-xl">
                <Switch
                    checked={formIsPopular}
                    onCheckedChange={setFormIsPopular}
                    className="data-[state=checked]:bg-primary"
                />
                <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#0F172A]">Mark as Popular</p>
                    <p className="text-[11.5px] text-[#64748B]">Shows a &quot;Popular&quot; badge on this plan</p>
                </div>
                <Sparkles size={16} className="text-primary/50" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-[13px] font-semibold text-[#374151] flex items-center gap-0.5">
                        Features
                        <span className="text-red-500">*</span>
                    </label>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[11px] text-primary gap-1 px-2 hover:bg-primary/5"
                        onClick={addFeatureField}
                    >
                        <Plus size={12} /> Add Feature
                    </Button>
                </div>
                <div className="space-y-2">
                    {formFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Check size={13} />
                            </div>
                            <Input
                                placeholder={`Feature ${index + 1}`}
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                                className="h-10 rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px] flex-1"
                                maxLength={100}
                            />
                            {formFeatures.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 p-0 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50"
                                    onClick={() => removeFeature(index)}
                                >
                                    <X size={14} />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-[11px] text-[#9CA3AF]">At least one feature, up to 100 characters each</p>
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
                        <span className={`text-sm font-medium ${!isYearly ? "text-zinc-900" : "text-zinc-400"}`}>Monthly</span>
                        <Switch
                            checked={isYearly}
                            onCheckedChange={setIsYearly}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className={`text-sm font-medium ${isYearly ? "text-zinc-900" : "text-zinc-400"}`}>Yearly</span>
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
                            className={`relative bg-white border rounded-none p-6 flex flex-col ${plan.isCurrent ? "border-primary bg-primary/5" : "border-zinc-200"}`}
                        >
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                {plan.isPopular && (
                                    <Badge className="bg-primary text-white rounded-none text-[10px] font-medium">Popular</Badge>
                                )}
                                {plan.isCurrent && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-medium">Current</Badge>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
                                <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                            </div>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-2xl font-semibold text-zinc-900">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                <span className="text-sm text-zinc-500">/mo</span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                                        <Check size={16} className="text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-2">
                                <Button
                                    disabled={plan.isCurrent}
                                    onClick={() => !plan.isCurrent && handleSelectPlan(plan.name)}
                                    className={`w-full rounded-none font-medium text-sm ${plan.isCurrent ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200" : "bg-primary hover:bg-primary/90 text-white"}`}
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
                        <h3 className="text-base font-semibold text-zinc-900">Need a custom solution?</h3>
                        <p className="text-sm text-zinc-500 mt-1">Get in touch with our sales team for a tailored plan that meets your specific requirements.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-none border-primary text-primary hover:bg-primary hover:text-white font-medium text-sm shrink-0"
                        onClick={() => {
                            setContactName("")
                            setContactEmail("")
                            setContactMessage("")
                            setContactTouched({})
                            setShowContactModal(true)
                        }}
                    >
                        Contact Sales
                    </Button>
                </div>
            </div>

            {/* Contact Sales — side sheet */}
            <SideFormSheet
                open={showContactModal}
                onOpenChange={(o) => {
                    setShowContactModal(o)
                    if (!o) {
                        setContactName("")
                        setContactEmail("")
                        setContactMessage("")
                        setContactTouched({})
                    }
                }}
                title="Contact Sales"
                description="Tell us about your requirements and we'll get back to you within 24 hours."
                icon={<Send className="w-5 h-5" />}
                onSubmit={handleContactSubmit}
                submitLabel="Send Request"
                loading={submittingContact}
                width="md"
            >
                <div className="space-y-4">
                    <Field label="Full Name" required error={contactErrors.name}>
                        <Input
                            placeholder="Your full name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ""))}
                            onBlur={() => setContactTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <Field label="Business Email" required error={contactErrors.email}>
                        <Input
                            type="email"
                            placeholder="you@company.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            onBlur={() => setContactTouched((t) => ({ ...t, email: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            autoComplete="email"
                        />
                    </Field>

                    <Field
                        label="Message"
                        error={contactErrors.message}
                        hint={`${contactMessage.length}/1000 characters`}
                    >
                        <Textarea
                            placeholder="Tell us about your team size, requirements, and any specific needs..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value.slice(0, 1000))}
                            onBlur={() => setContactTouched((t) => ({ ...t, message: true }))}
                            className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px] min-h-[120px]"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Create Plan — side sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o)
                    if (!o) resetForm()
                }}
                title="Create New Plan"
                description="Define a new pricing plan with features for your customers."
                icon={<Plus className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Plan"
                loading={submittingPlan}
                width="lg"
            >
                {renderFormFields()}
            </SideFormSheet>

            {/* Edit Plan — side sheet */}
            <SideFormSheet
                open={showEditModal}
                onOpenChange={(o) => {
                    setShowEditModal(o)
                    if (!o) {
                        setEditingPlan(null)
                        resetForm()
                    }
                }}
                title={`Edit Plan${editingPlan ? ` — ${editingPlan.name}` : ""}`}
                description="Update the plan details, pricing and features."
                icon={<Edit3 className="w-5 h-5" />}
                onSubmit={handleEdit}
                submitLabel="Save Changes"
                loading={submittingPlan}
                width="lg"
            >
                {renderFormFields()}
            </SideFormSheet>

            {/* Delete Confirmation — kept as small centered dialog (not a form) */}
            <Dialog
                open={!!deleteConfirmId}
                onOpenChange={() => setDeleteConfirmId(null)}
            >
                <DialogContent className="max-w-sm rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="px-5 py-5 border-b border-zinc-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-zinc-900">Delete Plan</h2>
                                <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">
                                    Are you sure? This action cannot be undone and the plan will no longer be available for new subscribers.
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-2 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded-lg text-sm text-zinc-600 h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                            className="rounded-lg text-sm h-9 px-5"
                        >
                            Delete Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
