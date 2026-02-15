"use client";

import React, { useState } from "react";
import { Key, Globe, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";

export default function DeveloperAPIPage() {
    const [showCreateKey, setShowCreateKey] = useState(false);
    const [keys, setKeys] = useState([
        { id: "1", name: "Production API Key", prefix: "sk_prod_...", created: "2024-01-15", lastUsed: "1 min ago", status: "Active" },
        { id: "2", name: "Staging Key", prefix: "sk_test_...", created: "2024-02-10", lastUsed: "2 days ago", status: "Active" },
        { id: "3", name: "Mobile App Key", prefix: "sk_mob_...", created: "2023-11-05", lastUsed: "1 week ago", status: "Revoked" },
    ]);

    const [webhooks, setWebhooks] = useState([
        { id: "1", url: "https://api.acmecorp.com/webhooks/crm", event: "deal.updated", status: "Active", failures: 0 },
        { id: "2", url: "https://hooks.slack.com/services/...", event: "lead.created", status: "Active", failures: 12 },
    ]);

    return (
        <div className="space-y-8 text-[#1A1A1A] pb-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Developer API</h1>
                    <p className="text-sm text-gray-600">Manage API keys and webhooks for custom integrations.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Globe size={16} /> API Documentation
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">API Requests</p>
                    <h2 className="text-white text-2xl font-bold">1.2M</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Average Latency</p>
                    <h3 className="text-2xl font-bold text-gray-900">124ms</h3>
                    <p className="text-green-600 text-xs mt-1">Optimal performance</p>
                </div>
            </div>

            {/* API Keys Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">API Keys</h2>
                    <Button onClick={() => setShowCreateKey(true)} variant="outline" className="rounded-none border-zinc-200 gap-2 text-blue-600 hover:bg-blue-50"><Plus size={14} /> Create New Key</Button>
                </div>
                <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Token Prefix</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Used</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {keys.map((key) => (
                                    <tr key={key.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{key.name}</span></td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 bg-zinc-50 px-2 py-1 w-fit rounded-none border border-zinc-100">{key.prefix}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{key.created}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{key.lastUsed}</td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${key.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-none rounded-none text-[10px]`}>
                                                {key.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-100 group"><RefreshCw size={14} className="text-gray-400 group-hover:text-blue-600" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-red-50 group"><Trash2 size={14} className="text-gray-400 group-hover:text-red-600" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Webhooks Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Webhooks</h2>
                    <Button variant="outline" className="rounded-none border-zinc-200 gap-2 text-purple-600 hover:bg-purple-50"><Plus size={14} /> Add Endpoint</Button>
                </div>
                <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Endpoint URL</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Event Trigger</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600">Recent Failures</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {webhooks.map((hook) => (
                                    <tr key={hook.id} className="hover:bg-purple-50/30 transition-colors">
                                        <td className="px-6 py-4"><span className="text-sm font-mono text-blue-600 truncate max-w-[200px] block">{hook.url}</span></td>
                                        <td className="px-6 py-4"><Badge className="bg-purple-50 text-purple-700 border-purple-200 rounded-none text-[10px]">{hook.event}</Badge></td>
                                        <td className="px-6 py-4">
                                            <Switch checked={hook.status === "Active"} className="data-[state=checked]:bg-green-600" />
                                        </td>
                                        <td className="px-6 py-4">
                                            {hook.failures > 0 ? (
                                                <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> {hook.failures}</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-red-50 group"><Trash2 size={14} className="text-gray-400 group-hover:text-red-600" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={showCreateKey} onOpenChange={setShowCreateKey}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-zinc-900 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Key size={20} /> Generate API Key</h2>
                        <p className="text-sm text-zinc-400 mt-2">Create a new secret key for authentication.</p>
                    </div>
                    <div className="p-8 space-y-4 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-600">Key Name</Label>
                            <Input placeholder="e.g., Marketing Dashboard" className="rounded-none border-zinc-200 text-sm" />
                        </div>
                        <div className="space-y-4 pt-2">
                            <Label className="text-xs font-bold text-gray-600">Permissions</Label>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm border p-2 border-zinc-100">
                                    <span>Read Data</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                                </div>
                                <div className="flex justify-between items-center text-sm border p-2 border-zinc-100">
                                    <span>Write/Edit Data</span>
                                    <Switch className="data-[state=checked]:bg-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={() => setShowCreateKey(false)} className="rounded-none flex-1">Cancel</Button>
                        <Button className="rounded-none bg-blue-600 hover:bg-blue-700 flex-1 shadow-lg shadow-blue-100">Create Key</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
