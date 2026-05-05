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

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {authMethods.map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group overflow-hidden data-[active=true]:border-l-4 data-[active=true]:border-l-indigo-600" data-active={method.active}>
                            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${method.active ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                                        }`}>
                                        <method.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white truncate">{method.name}</CardTitle>
                                        <p className={`text-xs font-medium mt-0.5 ${method.active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'
                                            }`}>{method.status}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={method.active}
                                    onCheckedChange={(v) => {
                                        setMethods(prev => ({ ...prev, [method.id]: v }))
                                        toast.success(`${method.name} toggled ${v ? "on" : "off"}`)
                                    }}
                                    className="data-[state=checked]:bg-indigo-600 shrink-0"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[40px]">
                                    {method.desc}
                                </p>
                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-0 rounded-md text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide">Identity Policy</Badge>
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedMethod(method); setIsQuickConfigOpen(true); }}>
                                        Configure <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Audit & Logs */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <CardHeader className="bg-zinc-50/60 dark:bg-zinc-900/50 flex flex-row items-center justify-between gap-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                                <History className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-white">Critical Auth Events</CardTitle>
                                <CardDescription className="text-xs font-medium text-zinc-400 mt-0.5">Real-time directory heartbeat</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input placeholder="Filter entries..." className="pl-9 h-9 w-48 text-xs rounded-lg border-zinc-200 dark:border-zinc-700" />
                            </div>
                            <CustomButton variant="outline" className="h-9 rounded-lg text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950" onClick={() => toast.info("Opening full audit logs...")}>
                                Full Logs
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                            {[
                                { action: "Impossible Travel Detection", user: "Michael Chen", details: "Credential reuse detected from Stockholm, SE (Session Released)", time: "12 mins ago", severity: "high" },
                                { action: "Policy Enforcement Update", user: "Directory Admin", details: "MFA challenge bypassed for verified HR subnet", time: "1 hour ago", severity: "low" },
                                { action: "Brute Force Suppression", user: "sarah.j@fixl.com", details: "IP 182.4.1.20 blocked after 5 failed attempts", time: "3 hours ago", severity: "medium" },
                                { action: "Session Hijack Prevention", user: "Unknown Identity", details: "Token invalidation triggered for suspicious cookie reuse", time: "5 hours ago", severity: "critical" },
                            ].map((log, i) => {
                                const sev = log.severity
                                const sevStyles =
                                    sev === 'critical' ? { dot: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-900/50' } :
                                    sev === 'high' ? { dot: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-900/50' } :
                                    sev === 'medium' ? { dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/50' } :
                                    { dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/50' }
                                return (
                                    <div key={i} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-all group">
                                        <div className="flex gap-4 items-center min-w-0">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-lg border shrink-0 ${sevStyles.bg} ${sevStyles.border}`}>
                                                <ShieldAlert className={`w-4 h-4 ${sevStyles.text}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{log.action}</p>
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${sevStyles.bg} ${sevStyles.text} ${sevStyles.border}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${sevStyles.dot}`}></span>
                                                        {sev}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 truncate">
                                                    {log.user} <span className="mx-1.5 text-zinc-300">•</span> {log.details}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs font-medium text-zinc-400 hidden sm:block">{log.time}</span>
                                            <CustomButton variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { setSelectedLog(log); setIsInvestigateOpen(true); }}>
                                                Investigate
                                            </CustomButton>
                                        </div>
                                    </div>
                                )
                            })}
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
