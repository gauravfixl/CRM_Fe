"use client"

import { useState } from "react"
import { ShieldCheck, Lock, Clock, Ban, Database, AlertCircle, Save, Info, Key, Fingerprint } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/components/custom/SubHeader"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function OrganizationPolicies() {
    const [policies, setPolicies] = useState({
        mfaForced: true,
        passwordRotation: 90,
        sessionTimeout: 60,
        ipRestrictions: false,
        dataRetention: 7,
        failedAttempts: 5
    })

    return (
        <div className="relative min-h-screen">
            <SubHeader
                title="Organization Policies"
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Policies", href: "#" }
                ]}
                rightControls={
                    <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                        <Save className="w-4 h-4 mr-1.5" />
                        Deploy Changes
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-6 space-y-6">
                {/* Banner */}
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-900 leading-tight">Policy Governance</p>
                        <p className="text-xs text-amber-700 mt-0.5">Global policies applied here will affect all users across the entire tenant regardless of their business unit.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Section: Authentication & Access */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">Access & Identity</h3>
                                    <p className="text-[11px] text-zinc-500">Secure how users enter the system</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-800">Force Multi-Factor Authentication (MFA)</p>
                                        <p className="text-xs text-zinc-500">Require MFA for all administrative and user logins.</p>
                                    </div>
                                    <Switch checked={policies.mfaForced} onCheckedChange={(val) => setPolicies({ ...policies, mfaForced: val })} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-800">Single Sign-On (SSO) Enforced</p>
                                        <p className="text-xs text-zinc-500">Prevent password-based login for standard users.</p>
                                    </div>
                                    <Switch checked={false} />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Max Failed Login Attempts</label>
                                    <div className="flex items-center gap-4">
                                        <CustomInput type="number" value={policies.failedAttempts} className="w-32 h-9" />
                                        <p className="text-[11px] text-zinc-400">Account will be locked after these many attempts.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">Password Health</h3>
                                    <p className="text-[11px] text-zinc-500">Manage credential complexity and lifecycle</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-800">Password Rotation (Days)</label>
                                    <CustomSelect defaultValue="90">
                                        <CustomSelectTrigger className="h-9"><CustomSelectValue /></CustomSelectTrigger>
                                        <CustomSelectContent>
                                            <CustomSelectItem value="30">30 Days</CustomSelectItem>
                                            <CustomSelectItem value="60">60 Days</CustomSelectItem>
                                            <CustomSelectItem value="90">90 Days</CustomSelectItem>
                                            <CustomSelectItem value="0">Never Expire</CustomSelectItem>
                                        </CustomSelectContent>
                                    </CustomSelect>
                                </div>
                                <div className="space-y-3 pt-4">
                                    <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Complexity Requirements</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Uppercase Letters", val: true },
                                            { label: "Special Characters", val: true },
                                            { label: "Minimum Length (12)", val: true },
                                            { label: "Numeric Digits", val: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-transparent hover:border-zinc-100">
                                                <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                    <ShieldCheck className="w-2.5 h-2.5" />
                                                </div>
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Session & Data */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">Session Management</h3>
                                    <p className="text-[11px] text-zinc-500">Control active user visibility and lifespans</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-800">Inactivity Timeout (Minutes)</label>
                                    <CustomInput type="number" value={policies.sessionTimeout} className="h-9" />
                                    <p className="text-[11px] text-zinc-400">Users will be automatically logged out after this period of inactivity.</p>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-800">Concurrent Sessions</p>
                                        <p className="text-xs text-zinc-500">Allow users to log in from multiple devices simultaneously.</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-zinc-900">Data Retention</h3>
                                    <p className="text-[11px] text-zinc-500">Compliance and cleanup configuration</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-zinc-800">Audit Log Retention (Years)</label>
                                    <CustomSelect defaultValue="7">
                                        <CustomSelectTrigger className="h-9"><CustomSelectValue /></CustomSelectTrigger>
                                        <CustomSelectContent>
                                            <CustomSelectItem value="1">1 Year</CustomSelectItem>
                                            <CustomSelectItem value="3">3 Years</CustomSelectItem>
                                            <CustomSelectItem value="7">7 Years</CustomSelectItem>
                                            <CustomSelectItem value="10">Forever</CustomSelectItem>
                                        </CustomSelectContent>
                                    </CustomSelect>
                                    <p className="text-[11px] text-zinc-400">Governance logs will be strictly preserved for this period.</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-dashed mt-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-800">Automatic Trash Cleanup</p>
                                        <p className="text-xs text-zinc-500">Permanently delete items from Trash after 30 days.</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                            </div>
                        </div>

                        {/* Extra Widget */}
                        <div className="bg-zinc-900 rounded-2xl p-6 text-white text-center space-y-3 shadow-xl">
                            <Fingerprint className="w-10 h-10 text-blue-400 mx-auto" />
                            <h4 className="font-bold">Biometric Authentication</h4>
                            <p className="text-zinc-400 text-xs">Allow your users to log in using Windows Hello or Touch ID for enhanced security.</p>
                            <CustomButton variant="outline" className="w-full h-9 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                                Enable WebAuthn
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CustomSelect({ children, defaultValue }: any) {
    return (
        <div className="relative">
            {children}
        </div>
    )
}

function CustomSelectTrigger({ children, className }: any) {
    return (
        <button className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}>
            {children}
        </button>
    )
}

function CustomSelectContent({ children }: any) {
    return null; // Simplified for mockup
}

function CustomSelectItem({ children }: any) {
    return null; // Simplified for mockup
}

function CustomSelectValue({ placeholder }: any) {
    return <span className="text-zinc-600">{placeholder || '90 Days'}</span>;
}
