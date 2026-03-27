"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { showSuccess } from "@/utils/toast";

export default function UpgradeDowngradePage() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
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
    ];

    const handleSelectPlan = (planName: string) => {
        showSuccess(`Plan change to ${planName} requested successfully`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Upgrade / Downgrade
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Choose the plan that best fits your organization&apos;s needs
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`text-sm font-medium ${
                            !isYearly ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                        Monthly
                    </span>
                    <Switch
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-primary rounded-none"
                    />
                    <span
                        className={`text-sm font-medium ${
                            isYearly ? "text-gray-900" : "text-gray-400"
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

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`relative bg-white border rounded-none p-6 flex flex-col ${
                            plan.isCurrent
                                ? "border-primary bg-primary/5"
                                : "border-gray-200"
                        }`}
                    >
                        {plan.isPopular && (
                            <Badge className="absolute top-4 right-4 bg-primary text-white rounded-none text-xs font-medium">
                                Popular
                            </Badge>
                        )}

                        {plan.isCurrent && (
                            <Badge className="absolute top-4 right-4 bg-primary/10 text-primary border-primary/20 rounded-none text-xs font-medium">
                                Current
                            </Badge>
                        )}

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {plan.description}
                            </p>
                        </div>

                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-2xl font-semibold text-gray-900">
                                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                            </span>
                            <span className="text-sm text-gray-500">/mo</span>
                        </div>

                        <ul className="space-y-3 mb-6 flex-grow">
                            {plan.features.map((feature, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                    <Check
                                        size={16}
                                        className="text-primary shrink-0"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            disabled={plan.isCurrent}
                            onClick={() => !plan.isCurrent && handleSelectPlan(plan.name)}
                            className={`w-full rounded-none font-medium text-sm ${
                                plan.isCurrent
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    : "bg-primary hover:bg-primary/90 text-white"
                            }`}
                        >
                            {plan.isCurrent ? "Current Plan" : "Select Plan"}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Contact Sales */}
            <div className="bg-white border border-gray-200 rounded-none p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        Need a custom solution?
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Get in touch with our sales team for a tailored plan that
                        meets your specific requirements.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="rounded-none border-primary text-primary hover:bg-primary hover:text-white font-medium text-sm shrink-0"
                >
                    Contact Sales
                </Button>
            </div>
        </div>
    );
}
