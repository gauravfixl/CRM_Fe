"use client";

import React, { useState } from "react";
import { AlertTriangle, Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function ErrorHandlingPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [handlers, setHandlers] = useState([
        { id: "1", errorType: "Timeout Error", action: "Retry 3 times", notification: "Admin", severity: "High" },
        { id: "2", errorType: "API Failure", action: "Log & Alert", notification: "Dev Team", severity: "Critical" },
        { id: "3", errorType: "Validation Error", action: "Skip & Continue", notification: "None", severity: "Low" },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Error Handling</h1>
                    <p className="text-sm text-gray-600">Configure how automation errors are handled and reported.</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)} className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Add Handler
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Error Handlers</p>
                    <h2 className="text-white text-2xl font-bold">{handlers.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Errors (24h)</p>
                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                    <p className="text-amber-600 text-xs mt-1">Handled automatically</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Recovery Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">94%</h3>
                    <p className="text-green-600 text-xs mt-1">Auto-recovered</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Critical Errors</p>
                    <h3 className="text-2xl font-bold text-gray-900">2</h3>
                    <p className="text-red-600 text-xs mt-1">Needs attention</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search handlers..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Error Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Notification</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Severity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {handlers.map((handler) => (
                                <tr key={handler.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-none border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{handler.errorType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-sm text-gray-700">{handler.action}</span></td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{handler.notification}</Badge></td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${handler.severity === "Critical" ? "bg-red-600" : handler.severity === "High" ? "bg-amber-600" : "bg-blue-600"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                            {handler.severity}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {handlers.length} handlers</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">View Error Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-red-700 to-orange-800 p-8 text-white relative">
                        <h2 className="text-2xl font-bold flex items-center gap-3"><Plus size={24} /> Add Error Handler</h2>
                        <p className="text-sm opacity-80 mt-2">Define how specific errors should be handled.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Error Type</Label>
                            <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select error type" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="timeout">Timeout Error</SelectItem><SelectItem value="api">API Failure</SelectItem><SelectItem value="validation">Validation Error</SelectItem></SelectContent></Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Action</Label>
                            <Select><SelectTrigger className="rounded-none border-zinc-200 h-12"><SelectValue placeholder="Select action" /></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="retry">Retry</SelectItem><SelectItem value="log">Log & Alert</SelectItem><SelectItem value="skip">Skip & Continue</SelectItem></SelectContent></Select>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600">Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-red-100">Add Handler</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
