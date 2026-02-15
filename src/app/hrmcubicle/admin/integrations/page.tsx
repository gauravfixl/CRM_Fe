"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Plug,
    Webhook,
    Key,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Copy,
    Trash2,
    ExternalLink,
    Search,
    Code2,
    Settings,
    Shield,
    Plus,
    MessageSquare,
    Calendar,
    Video,
    FileText,
    Activity,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useIntegrationsStore, type Integration, type Webhook as WebhookType } from "@/shared/data/integrations-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";

const IntegrationsPage = () => {
    const { integrations, webhooks, apiKeys, toggleIntegration, updateIntegrationConfig, addWebhook, deleteWebhook, generateApiKey, revokeApiKey, addIntegration } = useIntegrationsStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("apps");

    // Deep Configuration State
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [configForm, setConfigForm] = useState<any>({});

    // Add Integration State
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newApp, setNewApp] = useState({ name: "", provider: "Custom", category: "Communication" });

    // Developer States
    const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
    const [newWebhook, setNewWebhook] = useState({ url: "", events: [] as string[], isActive: true });
    const [keyName, setKeyName] = useState("");

    const handleAddApp = () => {
        if (!newApp.name) return;
        addIntegration({
            name: newApp.name,
            provider: newApp.provider as any,
            category: newApp.category as any,
            isConnected: false,
            config: {}
        });
        setAddDialogOpen(false);
        setNewApp({ name: "", provider: "Custom", category: "Communication" });
        toast({ title: "Integration Added", description: `${newApp.name} added to marketplace.` });
    };

    const handleOpenConfig = (integration: Integration) => {
        setSelectedIntegration(integration);
        setConfigForm(integration.config || {});
    };

    const handleSaveConfig = () => {
        if (!selectedIntegration) return;
        updateIntegrationConfig(selectedIntegration.id, configForm);
        // If it wasn't connected, connect it now if fields are filled
        if (!selectedIntegration.isConnected) {
            toggleIntegration(selectedIntegration.id, true);
        }
        toast({ title: "Configuration Saved", description: `${selectedIntegration.name} settings updated.` });
        setSelectedIntegration(null);
    };

    const handleDisconnect = () => {
        if (!selectedIntegration) return;
        toggleIntegration(selectedIntegration.id, false);
        toast({ title: "Disconnected", description: "Integration disabled." });
        setSelectedIntegration(null);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied", description: "Copied to clipboard." });
    };

    // --- Provider Specific Forms ---
    const renderConfigForm = (provider: string) => {
        switch (provider) {
            case 'Slack':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Bot User OAuth Token</Label>
                            <Input type="password" value={configForm.apiKey || ''} onChange={e => setConfigForm({ ...configForm, apiKey: e.target.value })} placeholder="xoxb-..." />
                            <p className="text-[10px] text-slate-400">Found in Slack App &gt; OAuth & Permissions.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Default Notification Channel</Label>
                            <Input value={configForm.channelId || ''} onChange={e => setConfigForm({ ...configForm, channelId: e.target.value })} placeholder="#hr-updates" />
                        </div>
                        <div className="space-y-2">
                            <Label>Webhook URL (Optional)</Label>
                            <Input value={configForm.webhookUrl || ''} onChange={e => setConfigForm({ ...configForm, webhookUrl: e.target.value })} placeholder="https://hooks.slack.com/..." />
                        </div>
                    </div>
                );
            case 'WhatsApp':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phone Number ID</Label>
                            <Input value={configForm.clientId || ''} onChange={e => setConfigForm({ ...configForm, clientId: e.target.value })} placeholder="10039..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Permanent Access Token</Label>
                            <Textarea value={configForm.apiKey || ''} onChange={e => setConfigForm({ ...configForm, apiKey: e.target.value })} placeholder="EAAG..." className="min-h-[80px]" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Switch checked={configForm.syncTemplates} onCheckedChange={v => setConfigForm({ ...configForm, syncTemplates: v })} />
                            <Label>Auto-sync Message Templates</Label>
                        </div>
                    </div>
                );
            case 'Google':
                return (
                    <div className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                            <div className="flex items-center gap-2 text-orange-700 font-bold text-sm mb-2">
                                <AlertCircle size={14} /> Critical Scopes
                            </div>
                            <ul className="list-disc list-inside text-xs text-orange-600 space-y-1">
                                <li>Calendar Events (Read/Write)</li>
                                <li>Gmail (Send on behalf)</li>
                                <li>Drive (Read Only for Docs)</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <Label>Client ID</Label>
                            <Input value={configForm.clientId || ''} onChange={e => setConfigForm({ ...configForm, clientId: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Client Secret</Label>
                            <Input type="password" value={configForm.apiKey || ''} onChange={e => setConfigForm({ ...configForm, apiKey: e.target.value })} />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-2">
                        <Label>API Key</Label>
                        <Input value={configForm.apiKey || ''} onChange={e => setConfigForm({ ...configForm, apiKey: e.target.value })} />
                    </div>
                );
        }
    };

    // --- Developer Functions ---
    const handleGenerateKey = () => {
        if (!keyName) return;
        generateApiKey(keyName);
        setKeyName("");
        toast({ title: "Key Generated", description: "Copy it now. It won't be shown again." });
    };

    const handleSaveWebhook = () => {
        if (!newWebhook.url) return;
        addWebhook(newWebhook);
        setWebhookDialogOpen(false);
        setNewWebhook({ url: "", events: [], isActive: true });
        toast({ title: "Webhook Verified", description: "Endpoint registered successfully." });
    };

    const AppCard = ({ integration }: { integration: Integration }) => (
        <Card onClick={() => handleOpenConfig(integration)} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all group cursor-pointer relative overflow-hidden">
            {integration.isConnected && <div className="absolute top-0 right-0 p-4"><div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div></div>}
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${integration.provider === 'Slack' ? 'bg-[#4A154B] text-white' :
                        integration.provider === 'WhatsApp' ? 'bg-[#25D366] text-white' :
                            integration.provider === 'Google' ? 'bg-white border border-slate-100 text-orange-500' :
                                'bg-blue-600 text-white'
                        }`}>
                        {integration.provider === 'Google' ? <div className="flex gap-1"><span className="text-blue-500">G</span></div> : integration.provider.charAt(0)}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800">{integration.name}</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{integration.category}</p>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {integration.isConnected ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={12} /> Active</span>
                    ) : (
                        <span className="flex items-center gap-1 text-slate-400"><XCircle size={12} /> Not Connected</span>
                    )}
                    {integration.lastSync && (
                        <span className="ml-auto opacity-70">Synced {new Date(integration.lastSync).toLocaleDateString()}</span>
                    )}
                </div>
            </CardContent>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between group-hover:bg-cyan-50/50 transition-colors">
                <span className="text-xs font-bold text-slate-500 group-hover:text-cyan-700">Configure</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500 transform group-hover:translate-x-1 transition-all" />
            </div>
        </Card>
    );

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                        <Plug size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integrations & API</h1>
                        <p className="text-sm font-medium text-slate-500">Connect third-party apps and manage API keys.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="apps" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-8 overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <TabsList className="bg-white border border-slate-200 rounded-xl p-1 h-12 w-fit shadow-sm">
                        <TabsTrigger value="apps" className="rounded-lg px-6 font-semibold data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">App Marketplace</TabsTrigger>
                        <TabsTrigger value="developers" className="rounded-lg px-6 font-semibold data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">Developer Settings</TabsTrigger>
                    </TabsList>

                    {activeTab === 'developers' && (
                        <Button onClick={() => setWebhookDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-100 font-bold">
                            <Webhook size={18} className="mr-2" /> New Webhook
                        </Button>
                    )}
                </div>

                <ScrollArea className="flex-1 -mx-4 px-4 pb-10">
                    {/* Apps Tab */}
                    <TabsContent value="apps" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {integrations.map(int => (
                                <AppCard key={int.id} integration={int} />
                            ))}
                            {/* Add More Card */}
                            <div onClick={() => setAddDialogOpen(true)} className="rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors">
                                    <Plus size={24} />
                                </div>
                                <h3 className="font-bold text-slate-600 group-hover:text-cyan-700">Add Integration</h3>
                                <p className="text-xs text-slate-400 mt-1">Register a new app.</p>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Developer Tab */}
                    <TabsContent value="developers" className="m-0 space-y-8">
                        {/* API Keys */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Key className="text-cyan-500" size={20} /> API Keys</h3>
                                    <p className="text-sm text-slate-500">Manage access tokens for custom integrations.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Key Label (e.g. Mobile App)"
                                        className="bg-white w-64"
                                        value={keyName}
                                        onChange={(e) => setKeyName(e.target.value)}
                                    />
                                    <Button onClick={handleGenerateKey} variant="secondary" className="font-bold">Generate</Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                                {apiKeys.length > 0 ? apiKeys.map(key => (
                                    <div key={key.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                <Code2 size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{key.name}</p>
                                                <p className="text-xs font-mono text-slate-400 mt-0.5">{key.key.substr(0, 12)}••••••••</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleCopy(key.key)}>
                                                <Copy size={14} className="mr-2" /> Copy
                                            </Button>
                                            <Button size="sm" variant="ghost" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600" onClick={() => revokeApiKey(key.id)}>
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-400 italic">No active API keys found.</div>
                                )}
                            </div>
                        </div>

                        {/* Webhooks */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Webhook className="text-purple-500" size={20} /> Webhooks</h3>
                                <p className="text-sm text-slate-500">Event subscriptions.</p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                                {webhooks.length > 0 ? webhooks.map(hook => (
                                    <div key={hook.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                                <Webhook size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 break-all">{hook.url}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {hook.events.map(ev => <Badge key={ev} variant="secondary" className="text-[10px] bg-slate-100 text-slate-500">{ev}</Badge>)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 mr-4">
                                                <Switch checked={hook.isActive} />
                                                <span className="text-xs font-semibold text-slate-500">Active</span>
                                            </div>
                                            <Button size="icon" variant="ghost" className="text-rose-500 hover:bg-rose-50 hover:text-rose-600" onClick={() => deleteWebhook(hook.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-400 italic">No webhooks configured.</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            {/* Deep Configuration Sheet */}
            <Sheet open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedIntegration && (
                        <div className="space-y-8 py-6">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 ${selectedIntegration.provider === 'Slack' ? 'bg-[#4A154B] text-white' :
                                    selectedIntegration.provider === 'WhatsApp' ? 'bg-[#25D366] text-white' :
                                        selectedIntegration.provider === 'Google' ? 'bg-white text-orange-500' :
                                            'bg-blue-600 text-white'
                                    }`}>
                                    {selectedIntegration.provider.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedIntegration.name}</h2>
                                    <p className="text-sm font-medium text-slate-500">{selectedIntegration.category} Integration</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge className={`px-2 py-0.5 text-xs font-bold ${selectedIntegration.isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {selectedIntegration.isConnected ? 'CONNECTED' : 'INACTIVE'}
                                        </Badge>
                                        {selectedIntegration.isConnected && (
                                            <Button variant="link" onClick={handleDisconnect} className="h-auto p-0 text-rose-500 text-xs hover:no-underline">Disconnect</Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 leading-relaxed border border-slate-200">
                                This integration allows {selectedIntegration.provider} to access employee data and send automated notifications. Ensure you have the necessary <strong>Client ID</strong> and <strong>Secret</strong> from your {selectedIntegration.provider} Admin Console.
                            </div>

                            {/* Configuration Form */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Configuration</h3>
                                {renderConfigForm(selectedIntegration.provider)}
                            </div>

                            {/* Sync History (Mock) */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Recent Activity</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                <span className="font-medium text-slate-700">{i === 1 ? 'Sync Failed' : 'Data Synced'}</span>
                                            </div>
                                            <span className="text-xs text-slate-400">{i * 4} hours ago</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-slate-200">
                                <Button onClick={handleSaveConfig} className="w-full h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                                    Save & Connect
                                </Button>
                                <p className="text-center text-[10px] text-slate-400 mt-4">
                                    By connecting, you agree to the data sharing policy.
                                </p>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Webhook Dialog (Keep existing) */}
            <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Register Webhook</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Endpoint URL</Label>
                            <Input placeholder="https://api.yourapp.com/hooks" value={newWebhook.url} onChange={e => setNewWebhook({ ...newWebhook, url: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Events to Subscribe</Label>
                            <Textarea
                                placeholder="leave.approved, employee.created (comma separated)"
                                value={newWebhook.events.join(', ')}
                                onChange={e => setNewWebhook({ ...newWebhook, events: e.target.value.split(',').map(s => s.trim()) })}
                                className="bg-slate-50"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveWebhook} className="bg-cyan-600 text-white w-full h-12 rounded-xl font-bold hover:bg-cyan-700">Create Subscription</Button>
                </DialogContent>
            </Dialog>

            {/* Add Integration Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Add Integration</DialogTitle>
                        <DialogDescription>Register a new custom integration.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>App Name</Label>
                            <Input placeholder="e.g. Jira, GitHub" value={newApp.name} onChange={e => setNewApp({ ...newApp, name: e.target.value })} className="bg-slate-50" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={newApp.category} onValueChange={(val) => setNewApp({ ...newApp, category: val })}>
                                <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Communication">Communication</SelectItem>
                                    <SelectItem value="Calendar">Calendar</SelectItem>
                                    <SelectItem value="Meeting">Meeting</SelectItem>
                                    <SelectItem value="Storage">Storage</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={handleAddApp} className="bg-slate-900 text-white w-full h-12 rounded-xl font-bold hover:bg-slate-800">Add to Marketplace</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IntegrationsPage;
