"use client"

import { useState } from "react"
import {
    Key,
    ExternalLink,
    Plus,
    Search,
    Globe,
    ShieldCheck,
    Lock,
    Info,
    ChevronRight,
    MoreVertical,
    Activity,
    Server,
    Terminal,
    RefreshCw,
    LayoutGrid
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SSOIdentityProvidersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isConnectOpen, setIsConnectOpen] = useState(false)
    const [isProviderDetailsOpen, setIsProviderDetailsOpen] = useState(false)
    const [isScimOpen, setIsScimOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<any>(null)
    const [isEndpointsOpen, setIsEndpointsOpen] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        setTimeout(() => {
            setIsSyncing(false)
            toast.success("Identity providers synchronized successfully")
        }, 1500)
    }

    const providers = [
        { id: "p1", name: "Microsoft Entra ID", type: "OIDC / SAML", users: 1240, status: "Connected", icon: Globe, health: "100%" },
        { id: "p2", name: "Google Workspace", type: "OIDC", users: 0, status: "Disconnected", icon: ShieldCheck, health: "0%" },
        { id: "p3", name: "Okta Workforce", type: "SAML 2.0", users: 12, status: "Connected", icon: Key, health: "98%" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Identity Providers (SSO)"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Providers", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton onClick={() => setIsConnectOpen(true)} className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg h-10 px-6 font-bold text-xs tracking-widest shadow-xl border-0">
                            <Plus className="w-4 h-4 mr-2" /> Connect Provider
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">



                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search connected identity providers by domain or name..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-12 bg-transparent font-bold italic"
                        />
                    </div>
                    <div className="flex gap-2">
                        <CustomButton onClick={handleSync} disabled={isSyncing} variant="ghost" className="rounded-lg h-10 px-4 font-bold text-xs tracking-widest text-zinc-500 border border-transparent hover:border-zinc-100">
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? "animate-spin" : ""}`} /> {isSyncing ? "Syncing..." : "Sync All"}
                        </CustomButton>
                    </div>
                </div>

                {/* Provider List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {providers.map((p) => (
                        <Card key={p.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-2xl transition-all group border-t-4 border-t-zinc-900 data-[status=Connected]:border-t-indigo-600" data-status={p.status}>
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className="flex gap-4 items-center">
                                    <div className={`h-12 w-12 flex items-center justify-center rounded-lg border transition-all ${p.status === 'Connected' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 text-zinc-300 border-zinc-100'
                                        }`}>
                                        <p.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">{p.name}</CardTitle>
                                        <p className="text-xs font-bold text-zinc-400 tracking-widest">{p.type}</p>
                                    </div>
                                </div>
                                <CustomButton onClick={() => { setSelectedProvider(p); setIsProviderDetailsOpen(true); }} variant="ghost" size="icon" className="text-zinc-400 rounded-lg">
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-xs font-bold text-zinc-400 tracking-widest block mb-1">Users Linked</span>
                                        <span className="text-xl font-bold italic">{p.users}</span>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-xs font-bold text-zinc-400 tracking-widest block mb-1">Health Index</span>
                                        <span className={`text-xl font-bold italic ${p.status === 'Connected' ? 'text-emerald-500' : 'text-zinc-300'}`}>{p.health}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${p.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className="text-xs font-bold tracking-widest text-zinc-500">{p.status}</span>
                                    </div>
                                    <CustomButton onClick={() => { setSelectedProvider(p); setIsEndpointsOpen(true); }} variant="ghost" className="h-10 text-xs text-zinc-500 font-bold tracking-widest hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        Endpoints <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Custom Provider Card */}
                    <div onClick={() => setIsConnectOpen(true)} className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-2xl">
                        <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center rounded-xl group-hover:bg-indigo-50 transition-colors">
                            <Terminal className="w-8 h-8 text-zinc-200 group-hover:text-indigo-300" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-400 tracking-widest">Custom SAML/OIDC</h4>
                            <p className="text-xs text-zinc-400 font-medium">Federate with a generic IdP</p>
                        </div>
                    </div>
                </div>

                {/* Scim & Provisioning Banner */}
                <div className="bg-[#121212] p-8 rounded-2xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group">
                    <LayoutGrid className="absolute -bottom-10 -left-10 h-64 w-64 opacity-5" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500 text-white rounded-lg border-0 text-xs font-bold px-2">Power User</Badge>
                            <h5 className="text-2xl font-bold tracking-tighter italic text-white">Scim Provisioning Engine</h5>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-lg italic opacity-90">
                            Enable automatic user provisioning and de-provisioning from your identity provider.
                            Changes in Entra/Okta will reflect in Real-time.
                        </p>
                        <div className="flex gap-4">
                            <CustomButton onClick={() => setIsScimOpen(true)} className="bg-white text-zinc-900 hover:bg-zinc-200 rounded-lg h-12 px-8 font-bold text-xs tracking-widest border-0">
                                Configure SCIM v2.0
                            </CustomButton>
                        </div>
                    </div>
                    <div className="relative z-10 p-6 border-l border-zinc-800 hidden md:block">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-zinc-500 tracking-widest">Active Schema</p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-24 bg-zinc-900 border border-zinc-800 text-xs font-bold flex items-center justify-center rounded-lg">CORE_USER</div>
                                <div className="h-10 w-24 bg-zinc-900 border border-zinc-800 text-xs font-bold flex items-center justify-center rounded-lg">ENTERPRISE</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Connect Provider Sheet */}
            <Sheet open={isConnectOpen} onOpenChange={setIsConnectOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">Connect Identity Provider</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">
                            Federate your directory with a corporate identity source.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Provider Type</Label>
                            <Select defaultValue="oidc">
                                <SelectTrigger className="rounded-xl h-12 border-zinc-200 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="oidc">OpenID Connect (OIDC)</SelectItem>
                                    <SelectItem value="saml">SAML 2.0</SelectItem>
                                    <SelectItem value="azure">Microsoft Entra ID (OIDC)</SelectItem>
                                    <SelectItem value="google">Google Workspace</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Display Name</Label>
                            <Input placeholder="e.g. Corporate ID" className="rounded-xl h-12 border-zinc-200 font-bold italic" />
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Metadata URL</h4>
                            <div className="flex gap-2">
                                <Input placeholder="https://idp.example.com/.well-known/..." className="rounded-lg h-10 bg-white font-mono text-[10px]" />
                                <CustomButton size="sm" variant="outline" className="h-10 px-3 rounded-lg font-bold text-[10px]">FETCH</CustomButton>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl w-full h-12 font-bold tracking-widest text-xs" onClick={() => { toast.success("Provider connection initiated"); setIsConnectOpen(false); }}>ESTABLISH TRUST</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Provider Details Sheet */}
            <Sheet open={isProviderDetailsOpen} onOpenChange={setIsProviderDetailsOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight">{selectedProvider?.name}</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">Provider settings and health status.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6 text-left">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                            <div>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-lg font-black italic">{selectedProvider?.status}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Security Parameters</Label>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-sm font-medium">Sign-out URL</span>
                                    <code className="text-[10px] bg-zinc-100 p-1 rounded">/auth/logout</code>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-sm font-medium">Group Filtering</span>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-sm font-medium">Enforce MFA at IdP</span>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="w-full rounded-xl" onClick={() => setIsProviderDetailsOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Endpoints Dialog */}
            <Dialog open={isEndpointsOpen} onOpenChange={setIsEndpointsOpen}>
                <DialogContent className="sm:max-w-lg rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold italic tracking-tight">Configuration Endpoints</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs font-medium italic">Use these to configure your application in the identity provider console.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        {[
                            { label: "ACS URL", value: `https://crm.api.fixl/auth/v1/sso/${selectedProvider?.id}/acs` },
                            { label: "Entity ID", value: "urn:fixl:crm:auth" },
                            { label: "Callback", value: `https://crm-fe.vercel.app/auth/sso/callback` }
                        ].map((e) => (
                            <div key={e.label} className="space-y-2">
                                <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{e.label}</Label>
                                <div className="flex gap-2">
                                    <Input readOnly value={e.value} className="h-9 text-[10px] font-mono bg-zinc-50 border-zinc-200" />
                                    <CustomButton size="sm" variant="ghost" className="h-9 px-2 text-indigo-600 font-bold text-xs" onClick={() => { navigator.clipboard.writeText(e.value); toast.success("Copied"); }}>COPY</CustomButton>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-zinc-900 text-white rounded-xl w-full" onClick={() => setIsEndpointsOpen(false)}>Done</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SCIM Configuration Sheet */}
            <Sheet open={isScimOpen} onOpenChange={setIsScimOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">SCIM v2.0 Configuration</SheetTitle>
                        <SheetDescription className="text-zinc-400 font-medium text-xs">Automate lifecycle management for your identities.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-8 text-left">
                        <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Provisioning Service Online</span>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SCIM Base URL</Label>
                                    <p className="text-xs font-mono text-emerald-400 truncate">https://api.crm.fixl/scim/v2.0/org_882</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Bearer Token</Label>
                                    <div className="flex gap-2">
                                        <Input type="password" value="********************************" readOnly className="bg-white/5 border-white/10 h-9 font-mono text-[10px]" />
                                        <CustomButton size="sm" className="h-9 px-3 bg-white text-zinc-900 hover:bg-zinc-200 font-bold text-xs">REGENERATE</CustomButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Attribute Mapping</h4>
                            <div className="space-y-2">
                                {['emails[type eq "work"]', 'name.givenName', 'name.familyName', 'title'].map((attr) => (
                                    <div key={attr} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 text-xs italic font-medium">
                                        <span>{attr}</span>
                                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
