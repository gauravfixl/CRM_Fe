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

export default function SSOIdentityProvidersPage() {
    const [searchQuery, setSearchQuery] = useState("")

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
                        <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-10 px-6 font-black uppercase text-xs tracking-widest shadow-xl border-0">
                            <Plus className="w-4 h-4 mr-2" /> Connect Provider
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Federation HUD */}
                <div className="bg-zinc-950 text-white p-10 rounded-none flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl border-b-8 border-b-indigo-600">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-white">
                        <Globe className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Badge className="bg-indigo-600 text-white border-0 rounded-none px-3 font-black text-[10px] tracking-widest">FEDERATED IDENTITY</Badge>
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <Activity className="w-3.5 h-3.5 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">System Operational</span>
                            </div>
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none italic uppercase text-white">Federation Gateway</h2>
                        <p className="text-zinc-300 font-medium leading-relaxed text-lg italic opacity-90">
                            Centralized Single Sign-On allows you to manage authentication across all corporate directories.
                            Enforce protocol mapping and just-in-time (JIT) user provisioning.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-10 pt-4">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-white italic tracking-tighter">2</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Configured</span>
                            </div>
                            <Separator orientation="vertical" className="h-10 bg-zinc-800" />
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-indigo-500 italic tracking-tighter uppercase">1.2k</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Synced Identities</span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 relative z-10 w-full md:w-80 space-y-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-none text-center space-y-2">
                            <Server className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-30" />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Identity Sync Engine</p>
                            <p className="text-xl font-bold italic tracking-tighter uppercase text-white">Last Heartbeat: 2m ago</p>
                            <div className="h-1 w-full bg-zinc-800 mt-4">
                                <div className="h-full bg-emerald-500 w-[94%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search connected identity providers by domain or name..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-bold italic"
                        />
                    </div>
                    <div className="flex gap-2">
                        <CustomButton variant="ghost" className="rounded-none h-10 px-4 font-black text-[10px] uppercase tracking-widest text-zinc-500 border border-transparent hover:border-zinc-100">
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync All
                        </CustomButton>
                    </div>
                </div>

                {/* Provider List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {providers.map((p) => (
                        <Card key={p.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-2xl transition-all group border-t-4 border-t-zinc-900 data-[status=Connected]:border-t-indigo-600" data-status={p.status}>
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className="flex gap-4 items-center">
                                    <div className={`h-12 w-12 flex items-center justify-center rounded-none border transition-all ${p.status === 'Connected' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 text-zinc-300 border-zinc-100'
                                        }`}>
                                        <p.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight">{p.name}</CardTitle>
                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{p.type}</p>
                                    </div>
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-none">
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-none border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Users Linked</span>
                                        <span className="text-xl font-black italic">{p.users}</span>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-none border border-zinc-100 dark:border-zinc-800">
                                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Heath Index</span>
                                        <span className={`text-xl font-black italic ${p.status === 'Connected' ? 'text-emerald-500' : 'text-zinc-300'}`}>{p.health}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-none ${p.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{p.status}</span>
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-[10px] text-zinc-500 font-black uppercase tracking-widest hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        Endpoints <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Custom Provider Card */}
                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10">
                        <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <Terminal className="w-8 h-8 text-zinc-200 group-hover:text-indigo-300" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Custom SAML/OIDC</h4>
                            <p className="text-[10px] text-zinc-400 font-medium">Federate with a generic IdP</p>
                        </div>
                    </div>
                </div>

                {/* Scim & Provisioning Banner */}
                <div className="bg-[#121212] p-8 rounded-none text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden group">
                    <LayoutGrid className="absolute -bottom-10 -left-10 h-64 w-64 opacity-5" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500 text-white rounded-none border-0 text-[10px] font-black px-2">POWER USER</Badge>
                            <h5 className="text-2xl font-black tracking-tighter uppercase italic text-white">SCIM Provisioning Engine</h5>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-lg italic opacity-90">
                            Enable automatic user provisioning and de-provisioning from your identity provider.
                            Changes in Entra/Okta will reflect in Real-time.
                        </p>
                        <div className="flex gap-4">
                            <CustomButton className="bg-white text-zinc-900 hover:bg-zinc-200 rounded-none h-12 px-8 font-black uppercase text-[10px] tracking-widest border-0">
                                Configure SCIM v2.0
                            </CustomButton>
                        </div>
                    </div>
                    <div className="relative z-10 p-6 border-l border-zinc-800 hidden md:block">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Schema</p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-24 bg-zinc-900 border border-zinc-800 text-[10px] font-bold flex items-center justify-center">CORE_USER</div>
                                <div className="h-10 w-24 bg-zinc-900 border border-zinc-800 text-[10px] font-bold flex items-center justify-center">ENTERPRISE</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
