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
    CreditCard,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const initialAddons = [
    {
        id: "addon-storage-1tb",
        name: "1Tb Extra Storage",
        description: "Expand your cloud file storage capacity for documents and media.",
        price: 49,
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
        price: 99,
        period: "/mo",
        category: "Licenses",
        icon: Users,
        active: true,
        popular: true
    },
    {
        id: "addon-api-pro",
        name: "High-Volume Api",
        description: "Increase rate limits to 10,000 req/min for integrations.",
        price: 199,
        period: "/mo",
        category: "Developer",
        icon: Zap,
        active: false,
        popular: false
    },
    {
        id: "addon-sso-saml",
        name: "Saml Sso Enforcer",
        description: "Force Single Sign-On via Okta, Azure AD, or OneLogin.",
        price: 149,
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
        price: 299,
        period: "/mo",
        category: "Compliance",
        icon: Globe,
        active: false,
        popular: false
    },
];

export default function AddonsPage() {
    const [addons, setAddons] = useState(initialAddons);
    const [removeTarget, setRemoveTarget] = useState<string | null>(null);
    const [addTarget, setAddTarget] = useState<string | null>(null);

    const basePlan = 999;
    const currentMonthly = basePlan + addons.filter(a => a.active).reduce((sum, a) => sum + a.price, 0);

    const targetAddonForRemove = addons.find(a => a.id === removeTarget);
    const targetAddonForAdd = addons.find(a => a.id === addTarget);

    const handleAddAddon = () => {
        if (!addTarget) return;
        const addon = addons.find(a => a.id === addTarget);
        if (!addon) return;

        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: `Adding ${addon.name} to your subscription...`,
            success: `${addon.name} added successfully! Your monthly bill is now $${(currentMonthly + addon.price).toLocaleString()}.00`,
            error: "Failed to add add-on. Please try again."
        });

        setAddons(prev => prev.map(a => a.id === addTarget ? { ...a, active: true } : a));
        setAddTarget(null);
    };

    const handleRemoveAddon = () => {
        if (!removeTarget) return;
        const addon = addons.find(a => a.id === removeTarget);
        if (!addon) return;

        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: `Removing ${addon.name} from your subscription...`,
            success: `${addon.name} removed. Your monthly bill is now $${(currentMonthly - addon.price).toLocaleString()}.00`,
            error: "Failed to remove add-on. Please try again."
        });

        setAddons(prev => prev.map(a => a.id === removeTarget ? { ...a, active: false } : a));
        setRemoveTarget(null);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900">Plan Add-ons</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Enhance your enterprise plan with additional capabilities.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-slate-200 shadow-sm rounded-lg">
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400">Current Monthly</p>
                        <p className="text-sm font-semibold text-slate-900">${currentMonthly.toLocaleString()}.00</p>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Addons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {addons.map((addon) => (
                    <Card key={addon.id} className={`border shadow-sm rounded-xl relative group overflow-hidden flex flex-col ${addon.active ? 'ring-1 ring-emerald-500 border-emerald-200' : 'border-slate-200'}`}>
                        {addon.active && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-medium gap-1">
                                    <Check className="w-2.5 h-2.5" /> Active
                                </Badge>
                            </div>
                        )}
                        {addon.popular && !addon.active && (
                            <div className="absolute top-2 right-2">
                                <Badge className="bg-amber-50 text-amber-700 border-none text-[10px] font-medium">
                                    Popular
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="bg-white pt-4 pb-3 px-4 flex-none">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${addon.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors'}`}>
                                <addon.icon className="w-4 h-4" />
                            </div>
                            <Badge variant="outline" className="w-fit mb-1.5 text-[10px] font-medium text-slate-400 border-slate-200">
                                {addon.category}
                            </Badge>
                            <CardTitle className="text-xs font-semibold text-slate-900">{addon.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="bg-white flex-grow px-4 pb-3">
                            <CardDescription className="text-[10px] leading-relaxed">
                                {addon.description}
                            </CardDescription>
                            <div className="mt-3 flex items-baseline gap-0.5">
                                <span className="text-xl font-semibold text-slate-900">${addon.price}</span>
                                <span className="text-[10px] font-medium text-slate-400">{addon.period}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-slate-50/50 p-3 border-t border-slate-100 mt-auto">
                            {addon.active ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-8 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 font-medium text-xs rounded-lg"
                                    onClick={() => setRemoveTarget(addon.id)}
                                >
                                    Remove Add-on
                                </Button>
                            ) : (
                                <Button
                                    className="w-full h-8 bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs rounded-lg gap-1.5 shadow-sm transition-all"
                                    onClick={() => setAddTarget(addon.id)}
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add to Plan
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Remove Confirmation Dialog */}
            <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-xl border-none shadow-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                            <DialogTitle className="text-sm font-semibold text-slate-900">Remove Add-on</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500">
                            Are you sure you want to remove <strong>{targetAddonForRemove?.name}</strong> from your subscription? This will take effect at the end of the current billing cycle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 my-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Monthly savings</span>
                            <span className="font-semibold text-emerald-600">-${targetAddonForRemove?.price}.00/mo</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-slate-500">New monthly total</span>
                            <span className="font-semibold text-slate-900">${(currentMonthly - (targetAddonForRemove?.price || 0)).toLocaleString()}.00</span>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="h-8 text-xs font-medium rounded-lg" onClick={() => setRemoveTarget(null)}>Cancel</Button>
                        <Button className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg" onClick={handleRemoveAddon}>
                            Remove Add-on
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Confirmation Dialog */}
            <Dialog open={!!addTarget} onOpenChange={(open) => !open && setAddTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-xl border-none shadow-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                            </div>
                            <DialogTitle className="text-sm font-semibold text-slate-900">Add to Plan</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500">
                            Add <strong>{targetAddonForAdd?.name}</strong> to your subscription? You will be charged a prorated amount for the remaining billing cycle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 my-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Add-on price</span>
                            <span className="font-semibold text-slate-900">+${targetAddonForAdd?.price}.00/mo</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-slate-500">New monthly total</span>
                            <span className="font-semibold text-slate-900">${(currentMonthly + (targetAddonForAdd?.price || 0)).toLocaleString()}.00</span>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="h-8 text-xs font-medium rounded-lg" onClick={() => setAddTarget(null)}>Cancel</Button>
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg" onClick={handleAddAddon}>
                            Confirm & Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
