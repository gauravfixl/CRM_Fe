"use client";

import React, { useState } from "react";
import { Sparkles, Beaker, Zap, Smartphone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function FeatureManagementPage() {
    const [features, setFeatures] = useState([
        { id: "1", name: "AI Lead Scoring", description: "Uses predictive analysis to score leads.", status: "Beta", enabled: true, category: "Intelligence", icon: <Sparkles size={18} /> },
        { id: "2", name: "New Kanban Board", description: "Redesigned drag-and-drop board with swimlanes.", status: "Alpha", enabled: false, category: "UI/UX", icon: <Beaker size={18} /> },
        { id: "3", name: "Smart Automation v2", description: "Faster execution engine with multi-step branches.", status: "Stable", enabled: true, category: "Automation", icon: <Zap size={18} /> },
        { id: "4", name: "Mobile Offline Mode", description: "Access CRM data without internet connection.", status: "Beta", enabled: false, category: "Mobile", icon: <Smartphone size={18} /> },
    ]);

    const toggleFeature = (id: string) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Feature Management</h1>
                    <p className="text-sm text-gray-600">Control early access features and beta capabilities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Available Features</p>
                    <h2 className="text-white text-2xl font-bold">{features.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Beta & Alpha</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Active</p>
                    <h3 className="text-2xl font-bold text-gray-900">{features.filter(f => f.enabled).length}</h3>
                    <p className="text-green-600 text-xs mt-1">Enabled in org</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Feedback Sent</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-blue-600 text-xs mt-1">User reports</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Stability Score</p>
                    <h3 className="text-2xl font-bold text-gray-900">92%</h3>
                    <p className="text-purple-600 text-xs mt-1">System healthy</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-zinc-100 pb-4">Early Access Controls</h3>

                <div className="space-y-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-start justify-between p-4 border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all rounded-none group bg-zinc-50/30">
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-none ${feature.enabled ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"} transition-colors`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-base font-bold text-gray-900">{feature.name}</h4>
                                        <Badge className={`${feature.status === "Beta" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                feature.status === "Alpha" ? "bg-red-100 text-red-700 border-red-200" :
                                                    "bg-green-100 text-green-700 border-green-200"
                                            } rounded-none text-[10px] font-bold border px-1.5 py-0`}>
                                            {feature.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{feature.category}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <Switch checked={feature.enabled} onCheckedChange={() => toggleFeature(feature.id)} className="data-[state=checked]:bg-blue-600" />
                                    <span className="text-xs text-gray-500 mt-1">{feature.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-none flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900">Want to try experimental features?</h4>
                        <p className="text-xs text-indigo-700 mt-1">Join our insider program to get access to cutting-edge tools before anyone else.</p>
                    </div>
                    <Button className="rounded-none bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">Join Insider Program</Button>
                </div>
            </div>
        </div>
    );
}
