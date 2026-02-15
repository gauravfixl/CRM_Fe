"use client";

import React, { useState } from "react";
import {
    Package,
    Plus,
    Check,
    HardDrive,
    Users,
    Zap,
    Shield,
    Globe,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const addons = [
    {
        id: "addon-storage-1tb",
        name: "1TB Extra Storage",
        description: "Expand your cloud file storage capacity for documents and media.",
        price: "$49",
        period: "/mo",
        category: "Infrastructure",
        icon: HardDrive,
        active: false,
        popular: false
    },
    {
        id: "addon-users-10",
        name: "10 Additional Seats",
        description: "Add 10 more full-access user licenses to your organization.",
        price: "$99",
        period: "/mo",
        category: "Licenses",
        icon: Users,
        active: true,
        popular: true
    },
    {
        id: "addon-api-pro",
        name: "High-Volume API",
        description: "Increase rate limits to 10,000 req/min for integrations.",
        price: "$199",
        period: "/mo",
        category: "Developer",
        icon: Zap,
        active: false,
        popular: false
    },
    {
        id: "addon-sso-saml",
        name: "SAML SSO Enforcer",
        description: "Force Single Sign-On via Okta, Azure AD, or OneLogin.",
        price: "$149",
        period: "/mo",
        category: "Security",
        icon: Shield,
        active: true,
        popular: false
    },
    {
        id: "addon-regions",
        name: "Multi-Region Data",
        description: "Replicate structured data across US-East, EU, and Asia.",
        price: "$299",
        period: "/mo",
        category: "Compliance",
        icon: Globe,
        active: false,
        popular: false
    },
];

export default function AddonsPage() {
    const handlePurchase = (addonName: string) => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: "Processing transaction...",
            success: `${addonName} added to your subscription!`,
            error: "Payment failed. Please check your card."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Plan Add-ons</h1>
                    <p className="text-sm text-slate-500 mt-1">Enhance your enterprise plan with additional capabilities.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 border border-slate-200 shadow-sm rounded-none">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Current Monthly</p>
                        <p className="text-lg font-black text-slate-900">$1,389.00</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            {/* ADDONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {addons.map((addon) => (
                    <Card key={addon.id} className={`border-none shadow-md rounded-none relative group overflow-hidden flex flex-col ${addon.active ? 'ring-2 ring-emerald-500' : ''}`}>
                        {addon.active && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-1 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Active
                            </div>
                        )}
                        {addon.popular && !addon.active && (
                            <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-[9px] font-black uppercase px-2 py-1">
                                Popular
                            </div>
                        )}

                        <CardHeader className="bg-white pt-6 pb-4 flex-none">
                            <div className={`w-12 h-12 rounded-none flex items-center justify-center mb-4 ${addon.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors'}`}>
                                <addon.icon className="w-6 h-6" />
                            </div>
                            <Badge variant="outline" className="w-fit mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-slate-200">
                                {addon.category}
                            </Badge>
                            <CardTitle className="text-lg font-bold text-slate-900">{addon.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="bg-white flex-grow">
                            <CardDescription className="text-xs leading-relaxed font-medium">
                                {addon.description}
                            </CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">{addon.price}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">{addon.period}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 mt-auto">
                            {addon.active ? (
                                <Button className="w-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 font-bold rounded-none">
                                    Remove Add-on
                                </Button>
                            ) : (
                                <Button
                                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-none gap-2 shadow-lg group-hover:shadow-blue-200/50 transition-all"
                                    onClick={() => handlePurchase(addon.name)}
                                >
                                    <Plus className="w-4 h-4" /> Add to Plan
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
