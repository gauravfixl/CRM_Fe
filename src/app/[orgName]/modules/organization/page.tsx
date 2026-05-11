"use client"

import React, { useState } from "react"
import {
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowUpRight,
  Search,
  Bell,
  Settings,
  LayoutGrid,
  Target,
  Activity,
  Globe,
  ExternalLink,
  ChevronRight,
  LucideIcon,
  Plus,
  ArrowUpCircle,
  Shield,
  Upload,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ActionTileProps {
  title: string
  desc: string
  icon: LucideIcon
  color: string
  onClick?: () => void
}

const ActionTile = ({ title, desc, icon: Icon, color, onClick }: ActionTileProps) => (
  <div
    onClick={onClick}
    className="group relative bg-card border border-border rounded-none p-5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer overflow-hidden"
  >
    <div className={`h-12 w-12 rounded-none ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h4 className="text-sm font-black text-foreground leading-none">{title}</h4>
    <p className="text-[10px] text-muted-foreground mt-2 font-medium leading-relaxed">{desc}</p>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="w-4 h-4 text-primary" />
    </div>
  </div>
)

export default function OrganizationDashboard() {
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const handleAddDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("deptName") as string

    if (!name) return toast.error("Department name required")

    toast.promise(new Promise(res => setTimeout(res, 1500)), {
      loading: `Creating ${name} structure...`,
      success: `${name} has been added to the institutional hierarchy.`,
      error: "Failed to create department."
    })
    setIsAddDeptOpen(false)
  }

  return (
    <div className="flex flex-col h-full w-full bg-background p-6 space-y-8 overflow-y-auto font-sans">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground border-none font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg shadow-primary/20">HQ Command</Badge>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
              <Globe className="w-3 h-3" /> Global Infrastructure
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground leading-none">Organization Overview</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg font-medium">Manage your multi-firm institutional hierarchy, compliance mandates, and global resource allocation from a single nexus.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* IMPORT DIALOG */}
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 rounded-none border-border bg-card text-foreground font-black uppercase text-[10px] tracking-widest px-6 hover:bg-muted hover:border-primary transition-all">
                <Upload className="w-4 h-4 mr-2" />
                Import Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 border border-border bg-background rounded-none overflow-hidden shadow-2xl">
              <div className="bg-zinc-900 p-8 text-white text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                <DialogTitle className="text-2xl font-black">Institutional Sync</DialogTitle>
                <p className="text-zinc-400 text-xs font-medium mt-2">Upload CSV/JSON to bulk provision units.</p>
              </div>
              <div className="p-10 space-y-6 bg-card">
                <div className="border-2 border-dashed border-border rounded-none p-10 text-center hover:border-primary transition-colors cursor-pointer group">
                  <Layers className="w-10 h-10 text-muted-foreground/30 mx-auto group-hover:text-primary transition-colors" />
                  <p className="text-sm font-bold text-muted-foreground mt-4">Drop files here or click to browse</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-widest font-black">Max 50MB per batch</p>
                </div>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-none shadow-xl shadow-primary/20" onClick={() => { toast.success("Batch processing manual override initiated."); setIsImportOpen(false); }}>
                  Process Catalog
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ADD DEPARTMENT DIALOG */}
          <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 px-6 rounded-none">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 border border-border bg-background rounded-none overflow-hidden shadow-2xl">
              <div className="bg-primary p-8 text-primary-foreground">
                <Building2 className="w-12 h-12 text-primary-foreground/20 absolute right-4 top-4" />
                <DialogTitle className="text-2xl font-black tracking-tight">Institutional Unit</DialogTitle>
                <p className="text-primary-foreground/80 text-xs font-medium mt-1">Create a new logical segment for your enterprise.</p>
              </div>
              <form onSubmit={handleAddDepartment} className="p-10 space-y-6 bg-card">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Department Name</Label>
                    <Input name="deptName" placeholder="e.g. Strategic Global Sales" className="h-12 bg-background border-border rounded-none font-bold text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Parent Division</Label>
                    <Select defaultValue="hq">
                      <SelectTrigger className="h-12 bg-background border-border rounded-none font-bold text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="hq">Headquarters (Root)</SelectItem>
                        <SelectItem value="ops">Operations</SelectItem>
                        <SelectItem value="finance">Finance & Treasury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-none shadow-xl shadow-primary/20">
                    Create Department
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TOP LEVEL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SmallCard className="bg-gradient-to-br from-primary to-primary/80 border-none shadow-[0_20px_40px_rgba(var(--primary),0.25)] hover:-translate-y-1 transition-transform">
          <SmallCardHeader className="pb-2">
            <p className="text-[10px] font-bold text-primary-foreground/80 uppercase tracking-widest">Enterprise Reach</p>
          </SmallCardHeader>
          <SmallCardContent>
            <p className="text-3xl font-black text-primary-foreground">12 Firms</p>
            <p className="text-[10px] text-primary-foreground/90 font-medium flex items-center gap-1 mt-1 font-bold">
              <Building2 className="w-3 h-3" /> 8 Active â€¢ 4 Incubating
            </p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-card border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seat Utilization</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-foreground">842 / 1.2k</p>
            <Progress value={70} className="h-1.5 mt-2 bg-muted/50" />
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-card border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Global Security</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Grade A</p>
            <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1 font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC2 Compliant
            </p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-card border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Est. Revenue</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-foreground">$14.2M</p>
            <p className="text-[10px] text-primary font-bold flex items-center gap-1 mt-1 uppercase font-black">
              <Target className="w-3 h-3" /> +12% from Q3
            </p>
          </SmallCardContent>
        </SmallCard>
      </div>

      {/* COMMAND TILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionTile
          title="Entitlements Center"
          desc="Configure module availability and granular feature access locks globally."
          icon={LayoutGrid}
          color="bg-indigo-600 shadow-lg shadow-indigo-500/20"
          onClick={() => toast.info("Navigating to Entitlements...")}
        />
        <ActionTile
          title="Audit Ledger"
          desc="Real-time institutional activity stream and administrative change tracking."
          icon={Activity}
          color="bg-emerald-600 shadow-lg shadow-emerald-500/20"
          onClick={() => toast.info("Navigating to Audit Logs...")}
        />
        <ActionTile
          title="Identity Forge"
          desc="Manage cross-firm roles, identities and multi-factor security rules."
          icon={Users}
          color="bg-blue-600 shadow-lg shadow-blue-500/20"
          onClick={() => toast.info("Navigating to Identity...")}
        />
        <ActionTile
          title="Billing Nexus"
          desc="Subscribe to new bundles, review usage meters and historical invoices."
          icon={CreditCard}
          color="bg-zinc-900 shadow-lg shadow-zinc-500/20 dark:bg-zinc-800"
          onClick={() => toast.info("Navigating to Subscription...")}
        />
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* RECENT CRITICAL EVENTS */}
        <Card className="lg:col-span-2 border-border shadow-sm bg-card overflow-hidden flex flex-col rounded-none">
          <CardHeader className="bg-muted/30 border-b border-border flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-black text-foreground uppercase tracking-tight">Governance Alert Stream</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">Critical institutional events requiring administrative oversight.</CardDescription>
            </div>
            <Button variant="ghost" className="text-xs font-black text-primary gap-1 uppercase tracking-widest hover:bg-muted" onClick={() => toast.info("Loading unified event monitor...")}>
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-border">
              {[
                { title: "Policy Override Detected", firm: "Fox HQ", time: "2m ago", severity: "high" },
                { title: "Storage Threshold Exceeded", firm: "Mumbai Unit", time: "15m ago", severity: "medium" },
                { title: "Admin Invitation Accepted", firm: "Global Trade", time: "1h ago", severity: "low" },
                { title: "MFA Reset for Identity #82", firm: "System", time: "3h ago", severity: "medium" },
              ].map((evt, i) => (
                <div key={i} className="px-6 py-5 flex items-center justify-between group hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full ${evt.severity === 'high' ? 'bg-red-500 animate-pulse ring-4 ring-red-500/10' :
                      evt.severity === 'medium' ? 'bg-amber-500 ring-4 ring-amber-500/10' : 'bg-emerald-500 ring-4 ring-emerald-500/10'
                      }`} />
                    <div>
                      <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{evt.title}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
                        Scope: <span className="text-foreground font-black">{evt.firm}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{evt.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t border-border p-3 text-center">
            <p className="w-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">Real-time governance sync: Active</p>
          </CardFooter>
        </Card>

        {/* SYSTEM HEALTH MINI */}
        <Card className="bg-zinc-950 text-white rounded-none border border-zinc-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Zap className="w-32 h-32 text-white" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              System Health <Activity className="w-4 h-4 text-emerald-400" />
            </CardTitle>
            <CardDescription className="text-zinc-400 text-xs font-medium">Core service operational thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>API Latency</span>
                <span className="text-emerald-400">24ms</span>
              </div>
              <Progress value={92} className="h-1.5 bg-zinc-800 [&>div]:bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>DB I/O Ops</span>
                <span className="text-primary-foreground">4.2k/s</span>
              </div>
              <Progress value={45} className="h-1.5 bg-zinc-800 [&>div]:bg-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>CDN Cache</span>
                <span className="text-amber-400">89%</span>
              </div>
              <Progress value={60} className="h-1.5 bg-zinc-800 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest h-12 shadow-xl shadow-primary/20 gap-2 rounded-none border-none">
              Nexus Status Center <ExternalLink className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
