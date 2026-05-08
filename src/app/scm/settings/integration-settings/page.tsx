"use client"

import * as React from "react"
import { useState } from "react"
import {
    Truck, CreditCard, Building, Barcode, Mail, MessageSquare, Phone, Calculator,
    Plug, Save,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/use-toast"

interface Integration {
    key: string
    name: string
    description: string
    icon: React.ReactNode
    enabled: boolean
    apiKey: string
}

const initial: Integration[] = [
    { key: "courier", name: "Courier API", description: "Connect Delhivery, Shiprocket, Blue Dart, etc.", icon: <Truck className="w-4 h-4" />, enabled: true, apiKey: "" },
    { key: "payment", name: "Payment Gateway", description: "Razorpay, Stripe, PayPal payment processing.", icon: <CreditCard className="w-4 h-4" />, enabled: true, apiKey: "rzp_test_••••" },
    { key: "erp", name: "ERP System", description: "Sync with SAP, Oracle, Odoo or NetSuite.", icon: <Building className="w-4 h-4" />, enabled: false, apiKey: "" },
    { key: "barcode", name: "Barcode Scanner", description: "Bluetooth or USB scanner integration.", icon: <Barcode className="w-4 h-4" />, enabled: true, apiKey: "" },
    { key: "email", name: "Email Notifications", description: "Transactional emails (orders, alerts).", icon: <Mail className="w-4 h-4" />, enabled: true, apiKey: "" },
    { key: "sms", name: "SMS Gateway", description: "Twilio, MSG91 outbound SMS.", icon: <Phone className="w-4 h-4" />, enabled: false, apiKey: "" },
    { key: "whatsapp", name: "WhatsApp Notifications", description: "WhatsApp Business API for order updates.", icon: <MessageSquare className="w-4 h-4" />, enabled: false, apiKey: "" },
    { key: "accounting", name: "Accounting Software", description: "Tally, Zoho Books, QuickBooks sync.", icon: <Calculator className="w-4 h-4" />, enabled: false, apiKey: "" },
]

export default function IntegrationSettingsPage() {
    const { toast } = useToast()
    const [items, setItems] = useState<Integration[]>(initial)

    const update = (key: string, patch: Partial<Integration>) =>
        setItems((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))

    const onSave = () => {
        toast({ title: "Integrations saved", description: "Connection settings updated." })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Integration Settings</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Manage external integrations and API connections.</p>
                </div>
                <Button onClick={onSave} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Save className="w-4 h-4 mr-1.5" /> Save All
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.key} className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: item.enabled ? "#2563eb" : "#94A3B8" }}>
                                {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[14px] font-semibold text-[#0F172A] truncate">{item.name}</p>
                                    <Switch checked={item.enabled} onCheckedChange={(v) => update(item.key, { enabled: v })} />
                                </div>
                                <p className="text-[12.5px] text-[#64748B] mt-0.5">{item.description}</p>
                                {item.enabled && (
                                    <div className="mt-3">
                                        <label className="text-[11.5px] uppercase tracking-wide font-semibold text-[#64748B]">API Key / Token</label>
                                        <Input
                                            type="password"
                                            value={item.apiKey}
                                            onChange={(e) => update(item.key, { apiKey: e.target.value })}
                                            placeholder="Enter API key"
                                            className="h-9 mt-1 border-[#E5E7EB] text-[12.5px] font-mono"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Plug className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[13px] font-semibold text-blue-900">Frontend-only configuration</p>
                    <p className="text-[12.5px] text-blue-700 mt-0.5">
                        Settings are stored in browser session for now. Backend integration will persist them centrally.
                    </p>
                </div>
            </div>
        </div>
    )
}
