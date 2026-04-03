"use client"

import { useState } from "react"
import { Shield, Save, Landmark, Percent, FileText, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatutorySettingsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [pf, setPf] = useState({ enabled: true, employeeRate: 12, employerRate: 12, wageLimit: 15000, includeDA: true, edliEnabled: true })
    const [esi, setEsi] = useState({ enabled: true, employeeRate: 0.75, employerRate: 3.25, wageLimit: 21000 })
    const [pt, setPt] = useState({ enabled: true, state: "Maharashtra", maxMonthly: 200, frequency: "Monthly" })
    const [tds, setTds] = useState({ enabled: true, regime: "New", cess: 4 })

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => { setIsSaving(false); toast.success("Statutory settings saved") }, 600)
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span><span>/</span><span className="text-gray-900 font-semibold">Statutory Settings</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Statutory Compliance</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure PF, ESI, Professional Tax, and TDS settings for payroll compliance.</p>
                    </div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5" onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4" />{isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">PF Rate</p><p className="text-xl font-semibold">{pf.employeeRate}%</p><p className="text-[10px] text-white/70">Employee contribution</p></div><Landmark className="w-5 h-5 text-white/80" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">ESI</p><p className="text-xl font-semibold text-gray-900">{esi.enabled ? "Active" : "Disabled"}</p><p className="text-[10px] text-gray-500">Wage limit ₹{esi.wageLimit.toLocaleString()}</p></div><Shield className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Professional Tax</p><p className="text-xl font-semibold text-gray-900">₹{pt.maxMonthly}</p><p className="text-[10px] text-gray-500">{pt.state}</p></div><IndianRupee className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">TDS Regime</p><p className="text-xl font-semibold text-gray-900">{tds.regime}</p><p className="text-[10px] text-gray-500">Cess {tds.cess}%</p></div><FileText className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PF */}
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><Landmark className="w-4 h-4 text-gray-500" />Provident Fund (PF)</CardTitle><CardDescription className="text-xs">Employer and employee PF contributions</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">Enable PF</Label><Switch checked={pf.enabled} onCheckedChange={(v) => setPf({ ...pf, enabled: v })} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Employee Rate (%)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={pf.employeeRate} onChange={(e) => setPf({ ...pf, employeeRate: parseFloat(e.target.value) || 0 })} /></div>
                            <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Employer Rate (%)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={pf.employerRate} onChange={(e) => setPf({ ...pf, employerRate: parseFloat(e.target.value) || 0 })} /></div>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">PF Wage Limit (₹)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={pf.wageLimit} onChange={(e) => setPf({ ...pf, wageLimit: parseInt(e.target.value) || 0 })} /></div>
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">Include DA in PF wage</Label><Switch checked={pf.includeDA} onCheckedChange={(v) => setPf({ ...pf, includeDA: v })} /></div>
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">EDLI Contribution</Label><Switch checked={pf.edliEnabled} onCheckedChange={(v) => setPf({ ...pf, edliEnabled: v })} /></div>
                    </CardContent>
                </Card>

                {/* ESI */}
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" />ESI (Employee State Insurance)</CardTitle><CardDescription className="text-xs">Insurance contributions for eligible employees</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">Enable ESI</Label><Switch checked={esi.enabled} onCheckedChange={(v) => setEsi({ ...esi, enabled: v })} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Employee Rate (%)</Label><Input type="number" step="0.01" className="h-9 rounded-lg text-xs" value={esi.employeeRate} onChange={(e) => setEsi({ ...esi, employeeRate: parseFloat(e.target.value) || 0 })} /></div>
                            <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Employer Rate (%)</Label><Input type="number" step="0.01" className="h-9 rounded-lg text-xs" value={esi.employerRate} onChange={(e) => setEsi({ ...esi, employerRate: parseFloat(e.target.value) || 0 })} /></div>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">ESI Wage Limit (₹)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={esi.wageLimit} onChange={(e) => setEsi({ ...esi, wageLimit: parseInt(e.target.value) || 0 })} /></div>
                    </CardContent>
                </Card>

                {/* Professional Tax */}
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><IndianRupee className="w-4 h-4 text-gray-500" />Professional Tax</CardTitle><CardDescription className="text-xs">State-specific professional tax deduction</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">Enable PT</Label><Switch checked={pt.enabled} onCheckedChange={(v) => setPt({ ...pt, enabled: v })} /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">State</Label>
                            <Select value={pt.state} onValueChange={(v) => setPt({ ...pt, state: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "West Bengal", "Gujarat", "Madhya Pradesh", "Andhra Pradesh"].map((s) => (<SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Max Monthly (₹)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={pt.maxMonthly} onChange={(e) => setPt({ ...pt, maxMonthly: parseInt(e.target.value) || 0 })} /></div>
                    </CardContent>
                </Card>

                {/* TDS */}
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader><CardTitle className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-gray-500" />TDS Configuration</CardTitle><CardDescription className="text-xs">Tax Deducted at Source settings</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between"><Label className="text-xs font-semibold text-gray-700">Enable TDS</Label><Switch checked={tds.enabled} onCheckedChange={(v) => setTds({ ...tds, enabled: v })} /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Tax Regime</Label>
                            <Select value={tds.regime} onValueChange={(v) => setTds({ ...tds, regime: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Old" className="text-xs">Old Regime</SelectItem><SelectItem value="New" className="text-xs">New Regime</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Health & Education Cess (%)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={tds.cess} onChange={(e) => setTds({ ...tds, cess: parseFloat(e.target.value) || 0 })} /></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
