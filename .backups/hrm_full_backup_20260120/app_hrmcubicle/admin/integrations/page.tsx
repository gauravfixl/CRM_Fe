"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Plug,
    CheckCircle2,
    XCircle,
    Settings,
    Key,
    Mail,
    Database,
    CreditCard,
    Fingerprint,
    Calendar as CalendarIcon,
    Webhook
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: any;
    status: 'Connected' | 'Disconnected';
    category: 'Biometric' | 'Accounting' | 'Banking' | 'Communication' | 'Calendar';
    config?: {
        apiKey?: string;
        endpoint?: string;
    };
}

const IntegrationsPage = () => {
    const { toast } = useToast();
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: '1',
            name: 'Biometric Device',
            description: 'Connect biometric attendance devices for automated check-in/out',
            icon: Fingerprint,
            status: 'Connected',
            category: 'Biometric',
            config: { endpoint: 'http://192.168.1.100:8080' }
        },
        {
            id: '2',
            name: 'Email Gateway (SMTP)',
            description: 'Send automated emails for notifications and alerts',
            icon: Mail,
            status: 'Connected',
            category: 'Communication',
            config: { endpoint: 'smtp.gmail.com' }
        },
        {
            id: '3',
            name: 'Accounting Software',
            description: 'Sync payroll data with Tally/QuickBooks',
            icon: Database,
            status: 'Disconnected',
            category: 'Accounting'
        },
        {
            id: '4',
            name: 'Bank Integration',
            description: 'Direct salary transfer via bank API',
            icon: CreditCard,
            status: 'Disconnected',
            category: 'Banking'
        },
        {
            id: '5',
            name: 'Google Calendar',
            description: 'Sync leave and holidays with Google Calendar',
            icon: CalendarIcon,
            status: 'Disconnected',
            category: 'Calendar'
        },
        {
            id: '6',
            name: 'Webhooks',
            description: 'Custom webhooks for third-party integrations',
            icon: Webhook,
            status: 'Disconnected',
            category: 'Communication'
        }
    ]);

    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [configForm, setConfigForm] = useState({ apiKey: '', endpoint: '' });

    const handleConnect = (integration: Integration) => {
        setIntegrations(integrations.map(i =>
            i.id === integration.id
                ? { ...i, status: i.status === 'Connected' ? 'Disconnected' : 'Connected' }
                : i
        ));
        toast({
            title: integration.status === 'Connected' ? "Disconnected" : "Connected",
            description: `${integration.name} has been ${integration.status === 'Connected' ? 'disconnected' : 'connected'}.`
        });
    };

    const handleConfigure = (integration: Integration) => {
        setSelectedIntegration(integration);
        setConfigForm({
            apiKey: integration.config?.apiKey || '',
            endpoint: integration.config?.endpoint || ''
        });
        setIsConfigOpen(true);
    };

    const handleSaveConfig = () => {
        if (!selectedIntegration) return;

        setIntegrations(integrations.map(i =>
            i.id === selectedIntegration.id
                ? { ...i, config: configForm }
                : i
        ));

        setIsConfigOpen(false);
        toast({ title: "Configuration Saved", description: `${selectedIntegration.name} settings updated.` });
    };

    const stats = [
        { label: "Total Integrations", value: integrations.length, color: "bg-[#CB9DF0]", icon: <Plug className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Connected", value: integrations.filter(i => i.status === 'Connected').length, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Disconnected", value: integrations.filter(i => i.status === 'Disconnected').length, color: "bg-rose-100", icon: <XCircle className="text-rose-600" />, textColor: "text-rose-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Integrations</h1>
                    <p className="text-slate-500 font-medium">Connect external systems and automate workflows.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                    <Card key={integration.id} className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${integration.status === 'Connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                <integration.icon size={24} />
                            </div>
                            <Badge className={`${integration.status === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none font-bold`}>
                                {integration.status}
                            </Badge>
                        </div>

                        <h3 className="font-black text-lg text-slate-900 mb-2">{integration.name}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{integration.description}</p>

                        <Badge className="bg-violet-100 text-violet-700 border-none text-xs font-bold mb-4">
                            {integration.category}
                        </Badge>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-xl border-slate-200 font-bold"
                                onClick={() => handleConfigure(integration)}
                            >
                                <Settings size={14} className="mr-2" /> Configure
                            </Button>
                            <Button
                                size="sm"
                                className={`flex-1 rounded-xl font-bold ${integration.status === 'Connected' ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                                onClick={() => handleConnect(integration)}
                            >
                                {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Configuration Dialog */}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                    <DialogHeader>
                        <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
                        <DialogDescription>Update connection settings and API credentials.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label>API Key / Token</Label>
                            <Input
                                placeholder="Enter API key or access token"
                                value={configForm.apiKey}
                                onChange={e => setConfigForm({ ...configForm, apiKey: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-mono text-sm"
                                type="password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Endpoint / Server URL</Label>
                            <Input
                                placeholder="e.g. https://api.example.com"
                                value={configForm.endpoint}
                                onChange={e => setConfigForm({ ...configForm, endpoint: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3">
                            <Key className="text-amber-600 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-xs font-bold text-amber-900">Security Note</p>
                                <p className="text-xs text-amber-700 mt-1">API keys are encrypted and stored securely. Never share your credentials.</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleSaveConfig}>
                            Save Configuration
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IntegrationsPage;
