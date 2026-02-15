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
    className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer overflow-hidden"
  >
    <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h4 className="text-sm font-black text-slate-900 leading-none">{title}</h4>
    <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">{desc}</p>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="w-4 h-4 text-blue-500" />
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
    <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 shadow-lg shadow-blue-500/20">HQ Command</Badge>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Globe className="w-3 h-3" /> Global Infrastructure
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Organization Overview</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg font-medium">Manage your multi-firm institutional hierarchy, compliance mandates, and global resource allocation from a single nexus.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* IMPORT DIALOG */}
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest px-6 hover:bg-white hover:border-blue-500 transition-all">
                <Upload className="w-4 h-4 mr-2" />
                Import Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 p-8 text-white text-center">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
                <DialogTitle className="text-2xl font-black">Institutional Sync</DialogTitle>
                <p className="text-slate-400 text-xs font-medium mt-2">Upload CSV/JSON to bulk provision units.</p>
              </div>
              <div className="p-10 space-y-6 bg-white">
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center hover:border-blue-300 transition-colors cursor-pointer group">
                  <Layers className="w-10 h-10 text-slate-200 mx-auto group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-bold text-slate-500 mt-4">Drop files here or click to browse</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">Max 50MB per batch</p>
                </div>
                <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl" onClick={() => { toast.success("Batch processing manual override initiated."); setIsImportOpen(false); }}>
                  Process Catalog
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* ADD DEPARTMENT DIALOG */}
          <Dialog open={isAddDeptOpen} onOpenChange={setIsAddDeptOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 px-6 rounded-2xl">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-blue-600 p-8 text-white">
                <Building2 className="w-12 h-12 text-white/20 absolute right-4 top-4" />
                <DialogTitle className="text-2xl font-black tracking-tight">Institutional Unit</DialogTitle>
                <p className="text-blue-100 text-xs font-medium mt-1">Create a new logical segment for your enterprise.</p>
              </div>
              <form onSubmit={handleAddDepartment} className="p-10 space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Name</Label>
                    <Input name="deptName" placeholder="e.g. Strategic Global Sales" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Division</Label>
                    <Select defaultValue="hq">
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hq">Headquarters (Root)</SelectItem>
                        <SelectItem value="ops">Operations</SelectItem>
                        <SelectItem value="finance">Finance & Treasury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-blue-100">
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
        <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
          <SmallCardHeader className="pb-2">
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Enterprise Reach</p>
          </SmallCardHeader>
          <SmallCardContent>
            <p className="text-3xl font-black text-white">12 Firms</p>
            <p className="text-[10px] text-blue-100 font-medium flex items-center gap-1 mt-1 font-bold">
              <Building2 className="w-3 h-3" /> 8 Active • 4 Incubating
            </p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seat Utilization</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-slate-900">842 / 1.2k</p>
            <Progress value={70} className="h-1.5 mt-2 bg-slate-100" />
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-emerald-600">Global Security</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-emerald-600">Grade A</p>
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC2 Compliant
            </p>
          </SmallCardContent>
        </SmallCard>

        <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <SmallCardHeader className="pb-2 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Revenue</p>
          </SmallCardHeader>
          <SmallCardContent className="text-left">
            <p className="text-3xl font-black text-slate-900">$14.2M</p>
            <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1 uppercase font-black">
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
          color="bg-indigo-600 shadow-lg shadow-indigo-200"
          onClick={() => toast.info("Navigating to Entitlements...")}
        />
        <ActionTile
          title="Audit Ledger"
          desc="Real-time institutional activity stream and administrative change tracking."
          icon={Activity}
          color="bg-emerald-600 shadow-lg shadow-emerald-200"
          onClick={() => toast.info("Navigating to Audit Logs...")}
        />
        <ActionTile
          title="Identity Forge"
          desc="Manage cross-firm roles, identities and multi-factor security rules."
          icon={Users}
          color="bg-blue-600 shadow-lg shadow-blue-200"
          onClick={() => toast.info("Navigating to Identity...")}
        />
        <ActionTile
          title="Billing Nexus"
          desc="Subscribe to new bundles, review usage meters and historical invoices."
          icon={CreditCard}
          color="bg-slate-900 shadow-lg shadow-slate-300"
          onClick={() => toast.info("Navigating to Subscription...")}
        />
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* RECENT CRITICAL EVENTS */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden flex flex-col rounded-3xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Governance Alert Stream</CardTitle>
              <CardDescription className="text-xs font-medium">Critical institutional events requiring administrative oversight.</CardDescription>
            </div>
            <Button variant="ghost" className="text-xs font-black text-blue-600 gap-1 uppercase tracking-widest hover:bg-white" onClick={() => toast.info("Loading unified event monitor...")}>
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {[
                { title: "Policy Override Detected", firm: "Fox HQ", time: "2m ago", severity: "high" },
                { title: "Storage Threshold Exceeded", firm: "Mumbai Unit", time: "15m ago", severity: "medium" },
                { title: "Admin Invitation Accepted", firm: "Global Trade", time: "1h ago", severity: "low" },
                { title: "MFA Reset for Identity #82", firm: "System", time: "3h ago", severity: "medium" },
              ].map((evt, i) => (
                <div key={i} className="px-6 py-5 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-2.5 w-2.5 rounded-full ${evt.severity === 'high' ? 'bg-red-500 animate-pulse ring-4 ring-red-100' :
                      evt.severity === 'medium' ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-emerald-500 ring-4 ring-emerald-100'
                      }`} />
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{evt.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        Scope: <span className="text-slate-600 font-black">{evt.firm}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{evt.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-3 text-center">
            <p className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time governance sync: Active</p>
          </CardFooter>
        </Card>

        {/* SYSTEM HEALTH MINI */}
        <Card className="bg-slate-900 text-white rounded-3xl border-none shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Zap className="w-32 h-32 text-white" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              System Health <Activity className="w-4 h-4 text-emerald-400" />
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs font-medium">Core service operational thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>API Latency</span>
                <span className="text-emerald-400">24ms</span>
              </div>
              <Progress value={92} className="h-1.5 bg-slate-800 [&>div]:bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>DB I/O Ops</span>
                <span className="text-blue-400">4.2k/s</span>
              </div>
              <Progress value={45} className="h-1.5 bg-slate-800 [&>div]:bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>CDN Cache</span>
                <span className="text-amber-400">89%</span>
              </div>
              <Progress value={60} className="h-1.5 bg-slate-800 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest h-12 shadow-xl gap-2 rounded-2xl border-none">
              Nexus Status Center <ExternalLink className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
