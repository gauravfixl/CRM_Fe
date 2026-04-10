"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    ShieldCheck,
    Key,
    Lock,
    Zap,
    Monitor,
    Smartphone,
    ChevronRight,
    Info,
    CheckCircle2,
    LockKeyhole,
    History,
    ShieldAlert,
    Fingerprint,
    Cpu,
    ExternalLink,
    Search,
    Loader2
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { BarChart3, Shield, Globe, Terminal, FileText, SearchCode } from "lucide-react"

export default function AuthenticationSettingsPage() {
    const [methods, setMethods] = useState({
        mfa: true,
        sso: false,
        passwordless: true,
        conditional: true
    })
    const [isSaving, setIsSaving] = useState(false)
    const [isReportsOpen, setIsReportsOpen] = useState(false)
    const [isQuickConfigOpen, setIsQuickConfigOpen] = useState(false)
    const [isInvestigateOpen, setIsInvestigateOpen] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<any>(null)
    const [selectedLog, setSelectedLog] = useState<any>(null)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Simulated backend save
            await new Promise(resolve => setTimeout(resolve, 1200))
            toast.success("Identity configuration synchronized successfully")
        } catch (error) {
            toast.error("Failed to sync configuration")
        } finally {
            setIsSaving(false)
        }
    }

    const authMethods = [
        {
            id: "mfa",
            name: "Multi-Factor Authentication",
            status: "Enforced",
            icon: Smartphone,
            color: "text-orange-600",
            bg: "bg-orange-50",
            desc: "Require an extra layer of security for all identities. Supports SMS, Authenticator app, and TOTP hardware.",
            active: methods.mfa
        },
        {
            id: "sso",
            name: "Single Sign-On (SSO)",
            status: "Enterprise Only",
            icon: ExternalLink,
            color: "text-blue-600",
            bg: "bg-blue-50",
            desc: "Federate your directory with Microsoft Entra ID or Okta to allow users to sign in with their corporate credentials.",
            active: methods.sso
        },
        {
            id: "passwordless",
            name: "Passwordless Security",
            status: "Experimental",
            icon: Fingerprint,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            desc: "Allow users to log in using biometric sensors or FIDO2 security keys without ever typing a password.",
            active: methods.passwordless
        },
        {
            id: "conditional",
            name: "Conditional Access",
            status: "8 Policies Active",
            icon: LockKeyhole,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "Automatically block or challenge sign-ins based on location, device health, or user risk level.",
            active: methods.conditional
        }
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Authentication"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Security", href: "#" },
                    { label: "Auth Methods", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => setIsReportsOpen(true)}>
                            Security Reports
                        </CustomButton>
                        <CustomButton 
                            className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-10 px-6 font-semibold text-sm shadow-xl border-0" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Configuration"}
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Security Score HUD */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-1 shadow-2xl overflow-hidden flex flex-col md:flex-row border-b-4 border-b-emerald-400">
                    <div className="p-6 flex flex-col items-center justify-center md:border-r md:border-white/20 shrink-0">
                        <div className="relative h-24 w-24 mb-4">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/20 stroke-[3px]" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-500 stroke-[3px]" strokeDasharray="85, 100" strokeLinecap="square" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white">85</span>
                                <span className="text-[10px] font-semibold tracking-wide text-white/70">Score</span>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-0 rounded-xl px-3 font-semibold text-[10px]">Healthy</Badge>
                    </div>

                    <div className="p-6 flex-1 space-y-6 relative overflow-hidden">
                        <Cpu className="absolute -bottom-6 -right-6 h-64 w-64 opacity-5 pointer-events-none" />
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-2xl font-bold tracking-tighter text-white">Identity Security Posture</h2>
                            <p className="text-zinc-300 font-medium leading-relaxed max-w-xl opacity-90">
                                Your organization's authentication infrastructure is currently resilient. Enabling <span className="text-white underline decoration-emerald-500/50">Passwordless FIDO2</span> login will improve your score to 92%.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 relative z-10 pt-2">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                <span className="text-xs font-semibold tracking-wide">Strict MFA</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                                <span className="text-xs font-semibold tracking-wide">Conditional Logic</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                                <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                <span className="text-xs font-semibold tracking-wide opacity-50">SSO Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authMethods.map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-l-4 border-l-zinc-100 dark:border-l-zinc-800 data-[active=true]:border-l-indigo-600" data-active={method.active}>
                            <CardHeader className="flex flex-row items-start justify-between pb-4">
                                <div className="flex gap-4">
                                    <div className={`h-12 w-12 flex items-center justify-center rounded-xl border transition-colors ${method.active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                        }`}>
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold tracking-tight">{method.name}</CardTitle>
                                        <p className={`text-xs font-medium tracking-wide mt-1 ${method.active ? 'text-indigo-600' : 'text-zinc-400'
                                            }`}>{method.status}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={method.active}
                                    onCheckedChange={(v) => {
                                        setMethods(prev => ({ ...prev, [method.id]: v }))
                                        toast.success(`${method.name} toggled ${v ? "on" : "off"}`)
                                    }}
                                    className="data-[state=checked]:bg-indigo-600 h-6 w-11"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-xs font-medium text-zinc-500 leading-relaxed min-h-[40px]">
                                    {method.desc}
                                </p>
                                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-0 rounded-xl text-xs font-semibold px-2 py-1">Identity Policy</Badge>
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold hover:text-indigo-600 group-hover:translate-x-1 transition-transform" onClick={() => { setSelectedMethod(method); setIsQuickConfigOpen(true); }}>
                                        Configuration <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Audit & Logs */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-zinc-400 font-bold" />
                            <div>
                                <CardTitle className="text-sm font-bold">Critical Auth Events</CardTitle>
                                <CardDescription className="text-xs font-medium text-zinc-400">Real-time Directory Heartbeat</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input placeholder="Filter entries..." className="pl-9 h-9 w-48 text-xs rounded-xl border-zinc-200" />
                            </div>
                            <CustomButton variant="outline" className="h-9 rounded-xl text-xs font-semibold border-zinc-200 bg-white dark:bg-zinc-950" onClick={() => toast.info("Opening full audit logs...")}>
                                Full Logs
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {[
                                { action: "Impossible Travel Detection", user: "Michael Chen", details: "Credential reuse detected from Stockholm, SE (Session Released)", time: "12 mins ago", severity: "high" },
                                { action: "Policy Enforcement Update", user: "Directory Admin", details: "MFA challenge bypassed for verified HR subnet", time: "1 hour ago", severity: "low" },
                                { action: "Brute Force Suppression", user: "sarah.j@fixl.com", details: "IP 182.4.1.20 blocked after 5 failed attempts", time: "3 hours ago", severity: "medium" },
                                { action: "Session Hijack Prevention", user: "Unknown Identity", details: "Token invalidation triggered for suspicious cookie reuse", time: "5 hours ago", severity: "critical" },
                            ].map((log, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                                    <div className="flex gap-6 items-center">
                                        <div className={`h-12 w-12 flex items-center justify-center rounded-xl border font-semibold text-[10px] ${log.severity === 'critical' || log.severity === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            log.severity === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                                            }`}>
                                            {log.severity.substring(0, 4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{log.action}</p>
                                            <p className="text-xs text-zinc-400 font-medium">{log.user} <span className="mx-2">•</span> {log.details}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium text-zinc-400 block">{log.time}</span>
                                        <CustomButton variant="ghost" size="sm" className="h-8 px-2 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedLog(log); setIsInvestigateOpen(true); }}>
                                            Investigate
                                        </CustomButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Modals & Sheets */}

            {/* Security Reports Dialog */}
            <Dialog open={isReportsOpen} onOpenChange={setIsReportsOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            Security Insight Reports
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            Synthesized analytics for your organization's identity posture.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 grid grid-cols-2 gap-4">
                        {[
                            { title: "Successful Logins", value: "48.2k", trend: "+12%", bg: "bg-emerald-50 text-emerald-600", icon: Shield },
                            { title: "Blocked Attempts", value: "1.2k", trend: "-5%", bg: "bg-red-50 text-red-600", icon: Lock },
                            { title: "Active Sessions", value: "842", trend: "+2%", bg: "bg-blue-50 text-blue-600", icon: Monitor },
                            { title: "Global Reach", value: "14 Countries", trend: "0%", bg: "bg-amber-50 text-amber-600", icon: Globe },
                        ].map((s) => (
                            <div key={s.title} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{s.title}</p>
                                    <p className="text-2xl font-black italic">{s.value}</p>
                                    <span className={`text-[10px] font-bold mt-1 inline-block ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{s.trend} than last period</span>
                                </div>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <CustomButton variant="outline" className="rounded-xl flex-1" onClick={() => setIsReportsOpen(false)}>Close</CustomButton>
                        <CustomButton className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl flex-1">Download PDF Report</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quick Config Sheet */}
            <Sheet open={isQuickConfigOpen} onOpenChange={setIsQuickConfigOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {selectedMethod?.icon && <selectedMethod.icon className={`w-6 h-6 ${selectedMethod.color}`} />}
                            {selectedMethod?.name}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">Quick security configuration.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Enforcement Tier</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {["Standard Enforcement", "Strict (All Users)", "Custom Selection"].map((tier) => (
                                    <div key={tier} className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-colors group">
                                        <span className="text-sm font-bold">{tier}</span>
                                        <div className="h-4 w-4 rounded-full border-2 border-zinc-200 group-hover:border-indigo-600"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Policy Rules</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Auto-renew tokens</span>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Allow legacy clients</span>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl w-full h-12" onClick={() => { toast.success("Policy tier updated"); setIsQuickConfigOpen(false); }}>Update Policy</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Investigate Log Sheet */}
            <Sheet open={isInvestigateOpen} onOpenChange={setIsInvestigateOpen}>
                <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Terminal className="w-6 h-6 text-orange-600" />
                            Incident Investigation
                        </SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">Detailed forensics for the selected authentication event.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6 text-left">
                        <div className={`p-6 rounded-2xl border-2 ${selectedLog?.severity === 'critical' ? 'border-red-500 bg-red-50/10' : 'border-orange-500 bg-orange-50/10'} space-y-2`}>
                            <h4 className="text-lg font-black italic uppercase tracking-tighter">{selectedLog?.action}</h4>
                            <p className="text-xs font-bold opacity-70 italic">{selectedLog?.details}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Timestamp</Label>
                                <p className="text-sm font-bold font-mono">2024-04-10T14:42:01Z</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-zinc-400">Request ID</Label>
                                <p className="text-sm font-bold font-mono">req_88a29b20</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest">Available Actions</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <CustomButton variant="outline" className="flex items-center gap-2 h-11 rounded-xl">
                                    <FileText className="w-4 h-4" /> Export Evidence
                                </CustomButton>
                                <CustomButton variant="outline" className="flex items-center gap-2 h-11 rounded-xl">
                                    <SearchCode className="w-4 h-4" /> Similar Events
                                </CustomButton>
                                <CustomButton className="col-span-2 bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl font-bold text-xs tracking-widest">
                                    BLOCK USER ACCOUNT IMMEDIATELY
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
