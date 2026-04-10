"use client"

import React, { useState } from "react"
import {
    Package,
    CheckCircle2,
    XCircle,
    Zap,
    Users,
    Building2,
    Lock,
    BarChart3,
    Settings,
    ShieldCheck,
    AlertCircle,
    Info,
    LayoutGrid,
    Search,
    ChevronRight,
    ArrowRight,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const modules = [
    { id: "mod-crm", name: "CRM Suite", icon: Users, description: "Manage leads, deals, and client relationships across all firms.", status: true, usage: "12/12 Firms", tier: "Enterprise" },
    { id: "mod-hrm", name: "HRM Cubicle", icon: Building2, description: "Employee management, payroll, and workforce orchestration.", status: true, usage: "8/12 Firms", tier: "Enterprise" },
    { id: "mod-pm", name: "Project Management", icon: LayoutGrid, description: "Advanced task tracking, board management, and resource planning.", status: true, usage: "5/12 Firms", tier: "Business" },
    { id: "mod-acc", name: "Accounting & Fin", icon: BarChart3, description: "Ledgers, invoicing, and financial health reporting.", status: false, usage: "0/12 Firms", tier: "Enterprise" },
    { id: "mod-auto", name: "Advanced Automations", icon: Zap, description: "No-code workflows and event-driven triggers for system efficiency.", status: true, usage: "12/12 Firms", tier: "Professional" },
    { id: "mod-sec", name: "Security & Compliance", icon: Lock, description: "Audit logs, policy enforcement, and infrastructure health monitoring.", status: true, usage: "All Firms (Enforced)", tier: "Core" },
]

export default function ModuleAccessPage() {
    const [moduleList, setModuleList] = useState(modules)

    const handleToggle = (id: string, name: string, currentStatus: boolean) => {
        setModuleList(prev => prev.map(m => m.id === id ? { ...m, status: !m.status } : m))
        if (currentStatus) {
            toast.error(`${name} has been disabled for the organization.`)
        } else {
            toast.success(`${name} has been enabled for the organization.`)
        }
    }

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto font-outfit">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Module Access</h1>
                    <p className="text-sm text-muted-foreground mt-1">Configure global application availability and feature access control.</p>
                </div>
                <div className="flex gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2 border-border">
                                <Info className="w-4 h-4" />
                                Usage Reports
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader>
                                <DialogTitle>Global Usage Reports</DialogTitle>
                                <DialogDescription>
                                    Recent module assignment and usage activity across the platform.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="flex justify-between items-center text-sm border-b pb-3 border-border/50"><p className="font-medium text-foreground">CRM Suite assigned to Firm A</p><span className="text-muted-foreground text-xs">2 mins ago</span></div>
                                <div className="flex justify-between items-center text-sm border-b pb-3 border-border/50"><p className="font-medium text-foreground">Accounting disabled globally</p><span className="text-muted-foreground text-xs">1 hour ago</span></div>
                                <div className="flex justify-between items-center text-sm border-b pb-3 border-border/50"><p className="font-medium text-foreground">HRM firm limit reached (8/12)</p><span className="text-muted-foreground text-xs">Yesterday</span></div>
                                <div className="flex justify-between items-center text-sm border-b pb-3 border-border/50"><p className="font-medium text-foreground">Project Management auto-enabled</p><span className="text-muted-foreground text-xs">2 days ago</span></div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-primary-foreground gap-2 font-bold shadow-sm">
                                <Settings className="w-4 h-4" />
                                Configure Defaults
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Configure Default Mappings</SheetTitle>
                                <SheetDescription>
                                    Set up the default policies and tier allocations for all new business units.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 py-6">
                                <div className="flex flex-col space-y-2">
                                    <Label>Default Entitlement Tier</Label>
                                    <Select defaultValue="enterprise">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="core">Core</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Auto-assign to new firms</Label>
                                        <p className="text-xs text-muted-foreground">Automatically grant core modules.</p>
                                    </div>
                                    <Switch defaultChecked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Firm Overrides</Label>
                                        <p className="text-xs text-muted-foreground">Let firms buy add-ons.</p>
                                    </div>
                                    <Switch defaultChecked={true} />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button onClick={() => toast.success("Global default mappings updated successfully.")}>Save Defaults</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-foreground text-xs opacity-80">Active Solutions</p>
                                <p className="text-primary-foreground text-xl font-semibold mt-1">5/6</p>
                                <p className="text-primary-foreground text-[10px] mt-1 flex items-center gap-1">Current Enterprise Portfolio</p>
                            </div>
                            <Package className="w-5 h-5 text-primary-foreground" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs">Firms With Custom Sets</p>
                                <p className="text-xl font-semibold text-foreground mt-1">4</p>
                                <p className="text-blue-600 text-[10px] mt-1 flex items-center gap-1"><Info className="w-3 h-3" /> Specific overrides active</p>
                            </div>
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs">Org-Wide Enforced</p>
                                <p className="text-xl font-semibold text-foreground mt-1">2</p>
                                <p className="text-emerald-600 text-[10px] mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Security & Core</p>
                            </div>
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs">Module Health</p>
                                <p className="text-xl font-semibold text-foreground mt-1">Stable</p>
                                <p className="text-emerald-600 text-[10px] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All APIs operational</p>
                            </div>
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MODULE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {moduleList.map((mod) => (
                    <Card key={mod.id} className={`overflow-hidden border transition-all duration-300 ${mod.status ? 'bg-card shadow-md hover:shadow-lg transform hover:-translate-y-1 border-primary/20' : 'bg-muted shadow-sm opacity-75 grayscale-[0.3] border-border'}`}>
                        <CardHeader className="p-5 pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${mod.status ? 'bg-primary/10' : 'bg-muted'}`}>
                                    <mod.icon className={`w-5 h-5 ${mod.status ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex items-center gap-3">
                                    {mod.status && (
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider hidden sm:flex">
                                            Active
                                        </Badge>
                                    )}
                                    <Switch
                                        checked={mod.status}
                                        onCheckedChange={() => handleToggle(mod.id, mod.name, mod.status)}
                                        // Disable toggle for Security module which is Core
                                        disabled={mod.tier === 'Core'}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                    {mod.name}
                                    {mod.tier === 'Core' && <Badge className="bg-slate-100 text-muted-foreground hover:bg-muted text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0">Core</Badge>}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground mt-1">
                                    {mod.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 py-3 border-t border-border/50 bg-background mt-2 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Usage Statistics</span>
                                <span className="text-xs font-semibold text-foreground">{mod.usage}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Tier</span>
                                    <span className="text-xs font-semibold text-primary">{mod.tier}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">API Status</span>
                                    <span className={`text-xs font-semibold ${mod.status ? 'text-emerald-600' : 'text-slate-400'}`}>Operational</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-0 border-t border-border/50">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="w-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 gap-2 rounded-none transition-colors">
                                        Manage Config <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Configure {mod.name}</SheetTitle>
                                        <SheetDescription>
                                            Manage organization-wide policies and firm limits for {mod.name}.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="space-y-6 py-6">
                                        <div className="flex flex-col space-y-2">
                                            <Label>Entitlement Tier</Label>
                                            <Select defaultValue={mod.tier.toLowerCase()}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="core">Core</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="professional">Professional</SelectItem>
                                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Firm Allocation Limit</Label>
                                                <p className="text-xs text-muted-foreground">Max firms allowed to use this.</p>
                                            </div>
                                            <Input type="number" defaultValue={mod.usage.includes('/') ? parseInt(mod.usage.split('/')[1]) : 12} className="w-24 text-right"/>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Allow Firm Overrides</Label>
                                                <p className="text-xs text-muted-foreground">Firms can upgrade this module.</p>
                                            </div>
                                            <Switch defaultChecked={true} />
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button onClick={() => toast.success(`${mod.name} configuration saved successfully.`)}>Save Changes</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* ALERT BOX */}
            <div className="flex items-start gap-4 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl shadow-sm">
                <div className="h-10 w-10 bg-amber-100 flex items-center justify-center rounded-full shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Access Propagation Warning</h4>
                    <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                        Disabling a global module like <span className="font-bold underline">"CRM Suite"</span> will immediately restrict access for all firms and users.
                        In-progress workflows may be interrupted and data will remain archived until the module is re-enabled.
                    </p>
                </div>
            </div>
        </div>
    )
}
