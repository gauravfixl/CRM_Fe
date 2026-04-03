"use client"

import React, { useState } from "react"
import {
    Package,
    Check,
    Zap,
    Shield,
    BarChart3,
    HardDrive,
    Users,
    Bot,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { showSuccess } from "@/shared/utils/toast"

interface Module {
    name: string
    description: string
    icon: React.ElementType
    status: "active" | "available" | "coming_soon"
    price: string
    features: string[]
}

const modules: Module[] = [
    {
        name: "Advanced Analytics",
        description: "Deep insights with custom dashboards and predictive analytics",
        icon: BarChart3,
        status: "active",
        price: "$49/mo",
        features: ["Custom dashboards", "Predictive analytics", "Data export"],
    },
    {
        name: "AI Copilot",
        description: "AI-powered assistant for automation and smart suggestions",
        icon: Bot,
        status: "active",
        price: "$79/mo",
        features: ["Smart automation", "Email drafting", "Lead scoring"],
    },
    {
        name: "Extended Storage",
        description: "Additional 500GB cloud storage for documents and files",
        icon: HardDrive,
        status: "available",
        price: "$29/mo",
        features: ["500GB extra storage", "File versioning", "Auto-backup"],
    },
    {
        name: "Extra User Pack",
        description: "Add 50 additional user seats to your plan",
        icon: Users,
        status: "available",
        price: "$99/mo",
        features: ["50 user seats", "Role assignment", "Bulk onboarding"],
    },
    {
        name: "Advanced Security",
        description: "Enterprise-grade security with SSO, SAML and audit controls",
        icon: Shield,
        status: "active",
        price: "$59/mo",
        features: ["SSO / SAML", "IP restrictions", "Advanced audit"],
    },
    {
        name: "API Pro",
        description: "Higher API limits and webhook management tools",
        icon: Zap,
        status: "available",
        price: "$39/mo",
        features: ["5M API calls/mo", "Webhook manager", "Rate limit controls"],
    },
]

export default function ModulesAddonsPage() {
    const [moduleList, setModuleList] = useState(modules)

    const activeCount = moduleList.filter((m) => m.status === "active").length
    const availableCount = moduleList.filter((m) => m.status === "available").length
    const totalCost = moduleList
        .filter((m) => m.status === "active")
        .reduce((sum, m) => sum + parseInt(m.price.replace(/[^0-9]/g, "")), 0)

    const handleToggle = (name: string) => {
        setModuleList((prev) =>
            prev.map((m) => {
                if (m.name !== name) return m
                const newStatus = m.status === "active" ? "available" : "active"
                showSuccess(
                    newStatus === "active"
                        ? `${m.name} activated successfully`
                        : `${m.name} deactivated`
                )
                return { ...m, status: newStatus }
            })
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Modules & Add-ons
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Manage your active modules and explore available add-ons for your plan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Active Modules</p>
                        <p className="text-white text-xl font-semibold mt-1">{activeCount}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Currently enabled</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Available Add-ons</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{availableCount}</p>
                        <p className="text-primary text-[10px] mt-1">Ready to activate</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Add-on Spend</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">${totalCost}/mo</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Monthly add-on cost</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Base Plan</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">Enterprise Pro</p>
                        <p className="text-zinc-400 text-[10px] mt-1">$499/mo base price</p>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {moduleList.map((mod) => (
                        <div
                            key={mod.name}
                            className={`bg-white border rounded-none p-5 space-y-4 ${
                                mod.status === "active"
                                    ? "border-primary/30 bg-primary/[0.02]"
                                    : "border-zinc-200"
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-none ${
                                        mod.status === "active"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-zinc-100 text-zinc-500"
                                    }`}>
                                        <mod.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-900">{mod.name}</h3>
                                        <p className="text-xs text-zinc-500 mt-0.5">{mod.price}</p>
                                    </div>
                                </div>
                                <Badge
                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                        mod.status === "active"
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                    }`}
                                >
                                    {mod.status === "active" ? "Active" : "Available"}
                                </Badge>
                            </div>

                            <p className="text-xs text-zinc-600 leading-relaxed">{mod.description}</p>

                            <ul className="space-y-1.5">
                                {mod.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                                        <Check size={12} className="text-primary shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={mod.status === "active" ? "outline" : "default"}
                                size="sm"
                                className={`w-full rounded-none text-xs font-medium h-8 ${
                                    mod.status === "active"
                                        ? "border-zinc-200 text-zinc-700"
                                        : "bg-primary hover:bg-primary/90 text-white"
                                }`}
                                onClick={() => handleToggle(mod.name)}
                            >
                                {mod.status === "active" ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
