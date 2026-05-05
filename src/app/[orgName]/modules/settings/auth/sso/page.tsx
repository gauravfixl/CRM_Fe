"use client"

import { useState } from "react"
import {
    Key,
    Plus,
    Search,
    Globe,
    ShieldCheck,
    ChevronRight,
    MoreVertical,
    Terminal,
    RefreshCw,
    Loader2,
    Trash2,
    Copy
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Provider = {
    id: string
    name: string
    type: string
    status: "Connected" | "Disconnected"
    icon: any
}

export default function SSOIdentityProvidersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isConnectOpen, setIsConnectOpen] = useState(false)
    const [isProviderDetailsOpen, setIsProviderDetailsOpen] = useState(false)
    const [isScimOpen, setIsScimOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
    const [isEndpointsOpen, setIsEndpointsOpen] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    const [providers, setProviders] = useState<Provider[]>([
        { id: "p1", name: "Microsoft Entra ID", type: "OIDC / SAML", status: "Connected", icon: Globe },
        { id: "p2", name: "Google Workspace", type: "OIDC", status: "Disconnected", icon: ShieldCheck },
        { id: "p3", name: "Okta Workforce", type: "SAML 2.0", status: "Connected", icon: Key },
    ])

    const handleSync = () => {
        setIsSyncing(true)
        setTimeout(() => {
            setIsSyncing(false)
            toast.success("Identity providers synchronized")
        }, 1200)
    }

    const toggleProvider = (id: string) => {
        setProviders(prev => prev.map(p => p.id === id
            ? { ...p, status: p.status === "Connected" ? "Disconnected" : "Connected" }
            : p
        ))
        const p = providers.find(x => x.id === id)
        toast.success(`${p?.name} ${p?.status === "Connected" ? "disconnected" : "connected"}`)
    }

    const removeProvider = (id: string) => {
        const p = providers.find(x => x.id === id)
        setProviders(prev => prev.filter(x => x.id !== id))
        toast.success(`${p?.name} removed`)
        setIsProviderDetailsOpen(false)
    }

    const filteredProviders = providers.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Single Sign-On (SSO)"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Providers", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" onClick={handleSync} disabled={isSyncing} className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm">
                            {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            {isSyncing ? "Syncing..." : "Sync All"}
                        </CustomButton>
                        <CustomButton onClick={() => setIsConnectOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0">
                            <Plus className="w-4 h-4 mr-2" /> Connect Provider
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search identity providers..."
                        className="pl-11 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                    />
                </div>

                {/* Provider Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProviders.map((p) => (
                        <Card key={p.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                                <div className="flex gap-3 items-start min-w-0">
                                    <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${p.status === 'Connected' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                        <p.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white truncate">{p.name}</CardTitle>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{p.type}</p>
                                    </div>
                                </div>
                                <CustomButton onClick={() => { setSelectedProvider(p); setIsProviderDetailsOpen(true); }} variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg h-8 w-8 shrink-0">
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${p.status === 'Connected' ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}></span>
                                    <span className={`text-xs font-semibold ${p.status === 'Connected' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`}>{p.status}</span>
                                </div>
                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Switch
                                        checked={p.status === "Connected"}
                                        onCheckedChange={() => toggleProvider(p.id)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <CustomButton onClick={() => { setSelectedProvider(p); setIsEndpointsOpen(true); }} variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all">
                                        Endpoints <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsConnectOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[180px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Terminal className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Custom SAML / OIDC</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Federate with a generic provider</p>
                        </div>
                    </button>
                </div>

                {/* SCIM Provisioning Card */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex gap-4 items-start min-w-0">
                            <div className="h-11 w-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">SCIM v2.0 Provisioning</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                                    Enable automatic user provisioning and de-provisioning from your identity provider. Changes in the IdP will reflect here in real time.
                                </p>
                            </div>
                        </div>
                        <CustomButton onClick={() => setIsScimOpen(true)} className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-10 px-5 font-semibold text-sm shrink-0 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                            Configure SCIM
                        </CustomButton>
                    </CardContent>
                </Card>
            </div>

            {/* Connect Provider Sheet */}
            <Sheet open={isConnectOpen} onOpenChange={setIsConnectOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Connect Identity Provider</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Federate your directory with a corporate identity source.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Provider Type</Label>
                            <Select defaultValue="oidc">
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oidc">OpenID Connect (OIDC)</SelectItem>
                                    <SelectItem value="saml">SAML 2.0</SelectItem>
                                    <SelectItem value="azure">Microsoft Entra ID</SelectItem>
                                    <SelectItem value="google">Google Workspace</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Display Name</Label>
                            <Input placeholder="e.g. Corporate ID" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Metadata URL</Label>
                            <div className="flex gap-2">
                                <Input placeholder="https://idp.example.com/.well-known/..." className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                                <CustomButton variant="outline" className="h-10 px-3 rounded-lg font-semibold text-xs" onClick={() => toast.success("Metadata fetched")}>Fetch</CustomButton>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Provider connection initiated"); setIsConnectOpen(false) }}>Establish Trust</CustomButton>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsConnectOpen(false)}>Cancel</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Provider Details Sheet */}
            <Sheet open={isProviderDetailsOpen} onOpenChange={setIsProviderDetailsOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedProvider?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Provider settings and security parameters.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <Label className="font-semibold text-sm">Status</Label>
                            <Badge className={`rounded-md border-0 ${selectedProvider?.status === "Connected" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                                {selectedProvider?.status}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Security Parameters</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Group filtering</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Enforce MFA at IdP</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Just-in-time provisioning</span>
                                    <Switch className="data-[state=checked]:bg-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Provider settings saved"); setIsProviderDetailsOpen(false) }}>Save Changes</CustomButton>
                        {selectedProvider && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removeProvider(selectedProvider.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove provider
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Endpoints Dialog */}
            <Dialog open={isEndpointsOpen} onOpenChange={setIsEndpointsOpen}>
                <DialogContent className="sm:max-w-lg rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Configuration Endpoints</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">Use these to configure your application in the identity provider console.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {[
                            { label: "ACS URL", value: `https://crm.api.fixl/auth/v1/sso/${selectedProvider?.id || "provider"}/acs` },
                            { label: "Entity ID", value: "urn:fixl:crm:auth" },
                            { label: "Callback", value: `https://crm-fe.vercel.app/auth/sso/callback` }
                        ].map((e) => (
                            <div key={e.label} className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{e.label}</Label>
                                <div className="flex gap-2">
                                    <Input readOnly value={e.value} className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700" />
                                    <CustomButton size="sm" variant="outline" className="h-9 px-3 rounded-lg text-xs font-semibold" onClick={() => { navigator.clipboard.writeText(e.value); toast.success("Copied to clipboard") }}>
                                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                                    </CustomButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10" onClick={() => setIsEndpointsOpen(false)}>Done</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SCIM Configuration Sheet */}
            <Sheet open={isScimOpen} onOpenChange={setIsScimOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">SCIM v2.0 Configuration</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Automate lifecycle management for your identities.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Provisioning service online</span>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">SCIM Base URL</Label>
                                <div className="flex gap-2">
                                    <Input readOnly value="https://api.crm.fixl/scim/v2.0/org" className="h-9 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700" />
                                    <CustomButton size="sm" variant="outline" className="h-9 px-3 rounded-lg text-xs font-semibold" onClick={() => { navigator.clipboard.writeText("https://api.crm.fixl/scim/v2.0/org"); toast.success("Copied") }}>
                                        <Copy className="w-3.5 h-3.5" />
                                    </CustomButton>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Bearer Token</Label>
                                <div className="flex gap-2">
                                    <Input type="password" value="••••••••••••••••••••••••" readOnly className="h-9 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700" />
                                    <CustomButton size="sm" variant="outline" className="h-9 px-3 rounded-lg text-xs font-semibold" onClick={() => toast.success("New token generated")}>Regenerate</CustomButton>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Attribute Mapping</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "Email", value: "emails[type eq \"work\"]" },
                                    { label: "First name", value: "name.givenName" },
                                    { label: "Last name", value: "name.familyName" },
                                    { label: "Title", value: "title" }
                                ].map((attr) => (
                                    <div key={attr.value} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{attr.label}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{attr.value}</p>
                                        </div>
                                        <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-indigo-600" onClick={() => toast.info(`Editing ${attr.label} mapping`)}>
                                            <ChevronRight className="w-4 h-4" />
                                        </CustomButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("SCIM configuration saved"); setIsScimOpen(false) }}>Save Configuration</CustomButton>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsScimOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
