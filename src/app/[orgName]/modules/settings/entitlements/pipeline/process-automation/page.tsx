"use client";

import React, { useState } from "react";
import { Zap, Plus, Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function ProcessAutomationPage() {
    const [automations, setAutomations] = useState([
        { id: "1", name: "Auto-assign to Rep", trigger: "Deal Created", action: "Assign Owner", conditions: 2, status: "Active", executions: 1204 },
        { id: "2", name: "Stage Progression Alert", trigger: "Stage Changed", action: "Send Email", conditions: 1, status: "Active", executions: 856 },
        { id: "3", name: "Stale Deal Reminder", trigger: "Time-Based", action: "Create Task", conditions: 3, status: "Active", executions: 342 },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Process Automation</h1>
                    <p className="text-sm text-gray-600">Automate pipeline workflows and deal progression.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Create Automation
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Automations</p>
                    <h2 className="text-white text-2xl font-bold">{automations.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Active</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Executions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{automations.reduce((sum, a) => sum + a.executions, 0).toLocaleString()}</h3>
                    <p className="text-green-600 text-xs mt-1">This month</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Success Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">99.2%</h3>
                    <p className="text-blue-600 text-xs mt-1">Highly reliable</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Time Saved</p>
                    <h3 className="text-2xl font-bold text-gray-900">240 hrs</h3>
                    <p className="text-purple-600 text-xs mt-1">This month</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search automations..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Automation Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Conditions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Executions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {automations.map((auto) => (
                                <tr key={auto.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <Zap size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{auto.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{auto.trigger}</Badge></td>
                                    <td className="px-6 py-4"><Badge className="bg-green-50 text-green-700 border-green-200 rounded-none text-[10px] font-bold px-2 py-0.5">{auto.action}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{auto.conditions}</span></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{auto.executions.toLocaleString()}</span></td>
                                    <td className="px-6 py-4"><Switch checked={auto.status === "Active"} className="data-[state=checked]:bg-green-600" /></td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="outline" className="rounded-none border-zinc-200 h-8 text-xs px-3"><Play size={12} className="mr-1" /> Test</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
