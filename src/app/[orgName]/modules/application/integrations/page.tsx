"use client";

import React, { useState } from "react";
import { Link2, Plus, Search, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";

export default function IntegrationsPage() {
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

    const integrations = [
        { id: "1", name: "Slack", description: "Team communication and notifications", status: "Connected", category: "Social", icon: "https://cdn.iconscout.com/icon/free/png-256/free-slack-logo-icon-download-in-svg-png-gif-file-formats--logos-brands-pack-icons-6986270.png?f=webp" },
        { id: "2", name: "HubSpot", description: "Marketing automation sync", status: "Connected", category: "Marketing", icon: "https://cdn.iconscout.com/icon/free/png-256/free-hubspot-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-3-pack-logos-icons-2944940.png?f=webp" },
        { id: "3", name: "Gmail", description: "Email sync and tracking", status: "Disconnected", category: "Email", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png" },
        { id: "4", name: "Stripe", description: "Payment processing", status: "Error", category: "Finance", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
        { id: "5", name: "Zapier", description: "Workflow automation", status: "Disconnected", category: "Automation", icon: "https://cdn.iconscout.com/icon/free/png-256/free-zapier-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-7-pack-logos-icons-2945179.png?f=webp" },
        { id: "6", name: "Intercom", description: "Customer chat support", status: "Connected", category: "Support", icon: "https://upload.wikimedia.org/wikipedia/commons/archive/f/f6/20220912234057%21Intercom_logo.png" },
    ];

    const handleConnect = (integration: any) => {
        setSelectedIntegration(integration);
        setShowConnectModal(true);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Integrations</h1>
                    <p className="text-sm text-gray-600">Connect your CRM with third-party tools.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Request Integration
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Connected Apps</p>
                    <h2 className="text-white text-2xl font-bold">{integrations.filter(i => i.status === "Connected").length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Synced successfully</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Available</p>
                    <h3 className="text-2xl font-bold text-gray-900">{integrations.length}</h3>
                    <p className="text-blue-600 text-xs mt-1">Native integrations</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Failed Syncs</p>
                    <h3 className="text-2xl font-bold text-gray-900">{integrations.filter(i => i.status === "Error").length}</h3>
                    <p className="text-red-600 text-xs mt-1">Need attention</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Data Processed</p>
                    <h3 className="text-2xl font-bold text-gray-900">45k</h3>
                    <p className="text-purple-600 text-xs mt-1">Events today</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search integrations..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-none border-zinc-200 gap-2"><RefreshCw size={14} /> Refresh Status</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                        <div key={integration.id} className="border border-zinc-200 p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:border-blue-200 group bg-white">
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 flex items-center justify-center p-2">
                                    {/* Placeholder for image, using text if image fails to load in real scenario, but src provided */}
                                    <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                                </div>
                                <Badge className={`${integration.status === "Connected" ? "bg-green-50 text-green-700 border-green-200" :
                                        integration.status === "Error" ? "bg-red-50 text-red-700 border-red-200" :
                                            "bg-zinc-100 text-zinc-600 border-zinc-200"
                                    } rounded-none text-[10px] font-bold px-2 py-0.5 border`}>
                                    {integration.status}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{integration.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-50">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{integration.category}</span>
                                {integration.status === "Connected" ? (
                                    <Button variant="outline" className="rounded-none h-8 text-xs border-zinc-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50">Disconnect</Button>
                                ) : (
                                    <Button onClick={() => handleConnect(integration)} className="rounded-none h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 gap-1">
                                        <Link2 size={12} /> Connect
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-zinc-900 p-6 text-white text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center p-3 mb-4">
                            <img src={selectedIntegration?.icon} alt="logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-xl font-bold">Connect {selectedIntegration?.name}</h2>
                        <p className="text-sm text-zinc-400 mt-2">Allow Fixl CRM to access your {selectedIntegration?.name} data.</p>
                    </div>
                    <div className="p-8 space-y-4 bg-white text-center">
                        <div className="space-y-2 text-left bg-blue-50 p-4 border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2"><CheckCircle2 size={14} /> Permissions Required</h4>
                            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                <li>Read user data</li>
                                <li>Sync contacts and leads</li>
                                <li>Update records</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={() => setShowConnectModal(false)} className="rounded-none flex-1">Cancel</Button>
                        <Button className="rounded-none bg-blue-600 hover:bg-blue-700 flex-1 shadow-lg shadow-blue-100">Authorize Connection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
