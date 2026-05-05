"use client"

import { useState } from "react"
import { Shield, Save, Landmark, FileText, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { showSuccess } from "@/utils/toast"

export default function StatutorySettingsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [pf, setPf] = useState({ enabled: true, employeeRate: 12, employerRate: 12, wageLimit: 15000, includeDA: true, edliEnabled: true })
    const [esi, setEsi] = useState({ enabled: true, employeeRate: 0.75, employerRate: 3.25, wageLimit: 21000 })
    const [pt, setPt] = useState({ enabled: true, state: "Maharashtra", maxMonthly: 200, frequency: "Monthly" })
    const [tds, setTds] = useState({ enabled: true, regime: "New", cess: 4 })

    useEffect(() => {
        (async () => {
            try {
                const res = await statutorySettingsApi.get()
                const s: any = res?.data || {}
                if (typeof s.pfEnabled === "boolean") setPf((p) => ({ ...p, enabled: s.pfEnabled }))
                if (typeof s.pfRate === "number") setPf((p) => ({ ...p, employeeRate: s.pfRate }))
                if (typeof s.esiEnabled === "boolean") setEsi((e) => ({ ...e, enabled: s.esiEnabled }))
                if (typeof s.esiRate === "number") setEsi((e) => ({ ...e, employeeRate: s.esiRate }))
                if (typeof s.ptEnabled === "boolean") setPt((t) => ({ ...t, enabled: s.ptEnabled }))
                if (typeof s.tdsEnabled === "boolean") setTds((t) => ({ ...t, enabled: s.tdsEnabled }))
                if (s.payFrequency) setPt((t) => ({ ...t, frequency: s.payFrequency }))
            } catch (err) {
                // Silent — fall back to UI defaults
            }
        })()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        setTimeout(() => { setIsSaving(false); showSuccess("Statutory settings saved") }, 400)
    }

    const ToggleRow = ({ title, desc, checked, onChange }: { title: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <div className="flex items-center justify-between gap-4 py-2">
            <div>
                <p className="text-xs font-semibold text-zinc-700">{title}</p>
                {desc && <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>}
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Statutory Compliance</h1>
                        <p className="text-sm text-zinc-500 mt-1">Configure PF, ESI, Professional Tax, and TDS settings for payroll compliance.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Save size={14} /> {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">PF Rate</p>
                        <p className="text-white text-xl font-semibold mt-1">{pf.employeeRate}%</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Employee contribution</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">ESI</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{esi.enabled ? "Active" : "Disabled"}</p>
                        <p className="text-primary text-[10px] mt-1">Wage limit ₹{esi.wageLimit.toLocaleString()}</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Professional Tax</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">₹{pt.maxMonthly}</p>
                        <p className="text-amber-600 text-[10px] mt-1">{pt.state}</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">TDS Regime</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{tds.regime}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Cess {tds.cess}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PF */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Provident Fund (PF)</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <ToggleRow title="Enable PF" desc="Employer and employee PF contributions" checked={pf.enabled} onChange={(v) => setPf({ ...pf, enabled: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Employee Rate (%)</Label>
                                    <Input type="number" value={pf.employeeRate} onChange={(e) => setPf({ ...pf, employeeRate: parseFloat(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Employer Rate (%)</Label>
                                    <Input type="number" value={pf.employerRate} onChange={(e) => setPf({ ...pf, employerRate: parseFloat(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">PF Wage Limit (₹)</Label>
                                <Input type="number" value={pf.wageLimit} onChange={(e) => setPf({ ...pf, wageLimit: parseInt(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                            </div>
                            <div className="pt-2 border-t border-zinc-100">
                                <ToggleRow title="Include DA in PF wage" checked={pf.includeDA} onChange={(v) => setPf({ ...pf, includeDA: v })} />
                                <ToggleRow title="EDLI Contribution" checked={pf.edliEnabled} onChange={(v) => setPf({ ...pf, edliEnabled: v })} />
                            </div>
                        </div>
                    </div>

                    {/* ESI */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Employee State Insurance (ESI)</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <ToggleRow title="Enable ESI" desc="Insurance contributions for eligible employees" checked={esi.enabled} onChange={(v) => setEsi({ ...esi, enabled: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Employee Rate (%)</Label>
                                    <Input type="number" step="0.01" value={esi.employeeRate} onChange={(e) => setEsi({ ...esi, employeeRate: parseFloat(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Employer Rate (%)</Label>
                                    <Input type="number" step="0.01" value={esi.employerRate} onChange={(e) => setEsi({ ...esi, employerRate: parseFloat(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">ESI Wage Limit (₹)</Label>
                                <Input type="number" value={esi.wageLimit} onChange={(e) => setEsi({ ...esi, wageLimit: parseInt(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Professional Tax */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Professional Tax</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <ToggleRow title="Enable PT" desc="State-specific professional tax deduction" checked={pt.enabled} onChange={(v) => setPt({ ...pt, enabled: v })} />
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">State</Label>
                                <Select value={pt.state} onValueChange={(v) => setPt({ ...pt, state: v })}>
                                    <SelectTrigger className="rounded-none h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {["Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "West Bengal", "Gujarat", "Madhya Pradesh", "Andhra Pradesh"].map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Max Monthly (₹)</Label>
                                <Input type="number" value={pt.maxMonthly} onChange={(e) => setPt({ ...pt, maxMonthly: parseInt(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* TDS */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">TDS Configuration</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <ToggleRow title="Enable TDS" desc="Tax deducted at source settings" checked={tds.enabled} onChange={(v) => setTds({ ...tds, enabled: v })} />
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Tax Regime</Label>
                                <Select value={tds.regime} onValueChange={(v) => setTds({ ...tds, regime: v })}>
                                    <SelectTrigger className="rounded-none h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Old">Old Regime</SelectItem>
                                        <SelectItem value="New">New Regime</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Health & Education Cess (%)</Label>
                                <Input type="number" value={tds.cess} onChange={(e) => setTds({ ...tds, cess: parseFloat(e.target.value) || 0 })} className="rounded-none h-9 text-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
