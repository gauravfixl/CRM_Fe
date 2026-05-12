"use client"

import * as React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import {
    User, Lock, ShieldCheck, Bell, Monitor, Save, Smartphone, KeyRound, LogOut, AlertCircle, CheckCircle2, X, Camera,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import Loader from "@/shared/components/custom/Loader"
import { useAdminSettingsStore, type MyAccount } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"
import {
    fetchCurrentUser, patchUser,
    fetchSessions, sendSessionDeleteOtp, deleteSession,
    requestPasswordReset, generate2faQr, verify2faSetup,
} from "@/shared/hooks/useAdminSettingsApi"

type Tab = "profile" | "security" | "notifications" | "sessions"

export default function MyAccountPage() {
    const [tab, setTab] = useState<Tab>("profile")

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <User className="w-5 h-5 text-[#2563eb]" /> My Account
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Profile, password, 2FA and notification preferences for your account.</p>
            </div>

            <div className="flex items-center gap-1 border-b border-[#EEF1F6] bg-white overflow-x-auto">
                <TabBtn active={tab === "profile"} onClick={() => setTab("profile")} icon={<User className="w-3.5 h-3.5" />} label="Profile" />
                <TabBtn active={tab === "security"} onClick={() => setTab("security")} icon={<Lock className="w-3.5 h-3.5" />} label="Password & 2FA" />
                <TabBtn active={tab === "notifications"} onClick={() => setTab("notifications")} icon={<Bell className="w-3.5 h-3.5" />} label="Notifications" />
                <TabBtn active={tab === "sessions"} onClick={() => setTab("sessions")} icon={<Monitor className="w-3.5 h-3.5" />} label="Active Sessions" />
            </div>

            {tab === "profile" && <ProfilePanel />}
            {tab === "security" && <SecurityPanel />}
            {tab === "notifications" && <NotificationsPanel />}
            {tab === "sessions" && <SessionsPanel />}
        </div>
    )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-4 py-2.5 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap"
            style={{
                borderColor: active ? "#2563eb" : "transparent",
                color: active ? "#2563eb" : "#64748B",
                background: active ? "rgba(37,99,235,0.04)" : "transparent",
            }}
        >
            {icon} {label}
        </button>
    )
}

// ---------- Profile ----------
function ProfilePanel() {
    const { toast } = useToast()
    const account = useAdminSettingsStore((s) => s.account)
    const setAccount = useAdminSettingsStore((s) => s.setAccount)

    const [draft, setDraft] = useState<MyAccount>(account)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const loadedRef = useRef(false)
    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(account), [draft, account])

    // Hydrate from /auth/getprofile on mount
    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        let alive = true
        ;(async () => {
            try {
                const res = await fetchCurrentUser()
                const user = res?.data?.user || res?.data?.data || res?.data
                if (alive && user) {
                    if (user._id) setUserId(user._id)
                    const merge: Partial<MyAccount> = {}
                    if (user.firstName) merge.firstName = user.firstName
                    if (user.lastName) merge.lastName = user.lastName
                    if (user.email) merge.email = user.email
                    if (user.phone) merge.phone = user.phone
                    if (user.avatar?.url) merge.avatarUrl = user.avatar.url
                    if (user.bio) merge.bio = user.bio
                    if (Object.keys(merge).length > 0) {
                        setAccount(merge)
                        setDraft((d) => ({ ...d, ...merge }))
                    }
                }
            } catch {
                // backend unreachable — local fallback
            } finally {
                if (alive) setLoading(false)
            }
        })()
        return () => { alive = false }
    }, [setAccount])

    const set = <K extends keyof MyAccount>(k: K, v: MyAccount[K]) => {
        setDraft((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) setErrors((e) => ({ ...e, [k]: validateField(k as string, v) ?? "" }))
    }
    const onBlur = (k: keyof MyAccount) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k as string, draft[k]) ?? "" }))
    }

    const validate = () => {
        const next: Record<string, string> = {}
        const fields: Array<keyof MyAccount> = ["firstName", "lastName", "email"]
        for (const f of fields) {
            const err = validateField(f as string, draft[f])
            if (err) next[f] = err
        }
        if (draft.phone) {
            const err = validateField("phone", draft.phone)
            if (err) next.phone = err
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSave = async () => {
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSaving(true)
        try {
            if (userId) {
                try {
                    await patchUser(userId, {
                        firstName: draft.firstName.trim(),
                        lastName: draft.lastName.trim(),
                        email: draft.email.trim(),
                        phone: draft.phone.trim(),
                        bio: draft.bio,
                    })
                } catch (err: any) {
                    toast({
                        title: "Saved locally",
                        description: err?.response?.data?.message || "Backend update failed; changes kept in app",
                        variant: "destructive",
                    })
                }
            }
            setAccount(draft)
            toast({ title: "Profile saved" })
        } finally {
            setSaving(false)
        }
    }

    const initials = (draft.firstName?.[0] || "") + (draft.lastName?.[0] || "")

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                    <span className="w-1 h-9 bg-blue-500" />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">Personal Info</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Visible to other team members.</p>
                    </div>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name" required error={touched.firstName ? errors.firstName : undefined}>
                        <Input value={draft.firstName} onChange={(e) => set("firstName", e.target.value)} onBlur={() => onBlur("firstName")} className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Last Name" required error={touched.lastName ? errors.lastName : undefined}>
                        <Input value={draft.lastName} onChange={(e) => set("lastName", e.target.value)} onBlur={() => onBlur("lastName")} className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Email" required error={touched.email ? errors.email : undefined}>
                        <Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} onBlur={() => onBlur("email")} className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Phone" error={touched.phone ? errors.phone : undefined}>
                        <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => onBlur("phone")} placeholder="+91..." className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Bio" hint="Short description about yourself" className="sm:col-span-2">
                        <Textarea value={draft.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className="border-[#E5E7EB] text-[13px] resize-none rounded-none" />
                    </Field>
                </div>
                <div className="px-5 py-3 border-t border-[#EEF1F6] flex justify-end">
                    <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                        <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save Profile"}
                    </Button>
                </div>
            </div>

            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                    <span className="w-1 h-9 bg-violet-500" />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">Avatar</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Profile picture</p>
                    </div>
                </div>
                <div className="p-5 flex flex-col items-center text-center">
                    <div
                        className="w-28 h-28 flex items-center justify-center text-white text-[36px] font-bold mb-3"
                        style={{
                            background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
                            boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                            borderRadius: 0,
                        }}
                    >
                        {initials.toUpperCase() || "?"}
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A]">{draft.firstName} {draft.lastName}</p>
                    <p className="text-[12px] text-[#64748B]">{draft.email}</p>
                    <Button variant="outline" className="mt-4 h-9 rounded-none border-[#E5E7EB] text-[13px]" onClick={() => toast({ title: "Avatar upload coming soon" })}>
                        <Camera className="w-4 h-4 mr-1.5" /> Change Avatar
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ---------- Security ----------
function SecurityPanel() {
    const { toast } = useToast()
    const account = useAdminSettingsStore((s) => s.account)
    const setAccount = useAdminSettingsStore((s) => s.setAccount)

    // Password reset (uses backend forgot-password email flow)
    const [pwSending, setPwSending] = useState(false)
    const [pwConfirmOpen, setPwConfirmOpen] = useState(false)

    const onSendPasswordReset = async () => {
        if (!account.email) {
            toast({ title: "Account email not loaded yet", variant: "destructive" })
            return
        }
        setPwSending(true)
        try {
            await requestPasswordReset(account.email)
            toast({
                title: "Reset link sent",
                description: `Check ${account.email} for the password reset email.`,
            })
            setPwConfirmOpen(false)
        } catch (err: any) {
            toast({
                title: "Failed to send reset email",
                description: err?.response?.data?.message || "Please try again",
                variant: "destructive",
            })
        } finally {
            setPwSending(false)
        }
    }

    // 2FA QR/OTP setup flow
    const [qrOpen, setQrOpen] = useState(false)
    const [qrUrl, setQrUrl] = useState<string | null>(null)
    const [qrSecret, setQrSecret] = useState<string | null>(null)
    const [qrLoading, setQrLoading] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [otpSubmitting, setOtpSubmitting] = useState(false)

    const start2faSetup = async () => {
        setQrLoading(true)
        setQrUrl(null); setQrSecret(null); setOtp(""); setOtpError("")
        setQrOpen(true)
        try {
            const res = await generate2faQr()
            const data = res?.data?.data ?? res?.data
            setQrUrl(data?.qrCodeImage || data?.qrCode || data?.qrImage || null)
            setQrSecret(data?.secret || null)
        } catch (err: any) {
            toast({ title: "Couldn't generate QR", description: err?.response?.data?.message || "Try again", variant: "destructive" })
            setQrOpen(false)
        } finally {
            setQrLoading(false)
        }
    }

    const onVerify2fa = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!/^\d{6}$/.test(otp)) {
            setOtpError("Enter the 6-digit code from your authenticator app")
            return
        }
        setOtpError("")
        setOtpSubmitting(true)
        try {
            await verify2faSetup(otp)
            setAccount({ twoFactorEnabled: true })
            toast({ title: "Two-factor enabled", description: "Future logins will require an OTP." })
            setQrOpen(false)
        } catch (err: any) {
            setOtpError(err?.response?.data?.message || "Invalid code — try the latest one")
        } finally {
            setOtpSubmitting(false)
        }
    }

    const toggle2fa = (v: boolean) => {
        if (v) {
            start2faSetup()
        } else {
            setAccount({ twoFactorEnabled: false })
            toast({ title: "Two-factor disabled" })
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                    <span className="w-1 h-9 bg-blue-500" />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">Password</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Last changed never</p>
                    </div>
                </div>
                <div className="p-5">
                    <p className="text-[13px] text-[#64748B] mb-2">For your security we don't accept in-app password changes. Click below and we'll email you a one-time reset link.</p>
                    <p className="text-[12px] text-[#94A3B8] mb-4">Link will be sent to <span className="font-mono font-semibold text-[#0F172A]">{account.email || "your account email"}</span></p>
                    <Button onClick={() => setPwConfirmOpen(true)} disabled={!account.email || pwSending} className="h-10 px-4 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                        <KeyRound className="w-4 h-4 mr-1.5" /> {pwSending ? "Sending…" : "Send Password Reset Email"}
                    </Button>
                </div>
            </div>

            {/* Confirm reset email */}
            <AlertDialog open={pwConfirmOpen} onOpenChange={setPwConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Send password reset email?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>We'll email a one-time secure reset link to <strong className="text-[#0F172A]">{account.email}</strong>. The link expires after 30 minutes.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onSendPasswordReset} className="bg-blue-600 hover:bg-blue-700">{pwSending ? "Sending…" : "Send Email"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 2FA QR Setup */}
            <SideFormSheet
                open={qrOpen}
                onOpenChange={(o) => { setQrOpen(o); if (!o) { setQrUrl(null); setOtp(""); setOtpError("") } }}
                title="Enable Two-Factor Authentication"
                description="Scan the QR code with Google Authenticator, Authy or 1Password, then enter the 6-digit code below."
                icon={<ShieldCheck className="w-5 h-5" />}
                onSubmit={onVerify2fa}
                loading={otpSubmitting}
                submitLabel="Verify & Enable"
                width="md"
                accentColor="#10b981"
            >
                <div className="space-y-4">
                    {qrLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader />
                        </div>
                    ) : qrUrl ? (
                        <>
                            <div className="flex justify-center">
                                <img src={qrUrl} alt="2FA QR" className="w-44 h-44 border border-[#EEF1F6] p-2 bg-white" />
                            </div>
                            {qrSecret && (
                                <div className="bg-[#F8FAFC] border border-[#EEF1F6] p-3 text-center">
                                    <p className="text-[11px] uppercase tracking-wide text-[#94A3B8] font-semibold">Or enter this key manually</p>
                                    <p className="font-mono text-[12.5px] font-bold text-[#0F172A] mt-1 break-all">{qrSecret}</p>
                                </div>
                            )}
                            <Field label="6-Digit Code" required error={otpError}>
                                <Input
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); if (otpError) setOtpError("") }}
                                    inputMode="numeric"
                                    placeholder="000000"
                                    maxLength={6}
                                    className="h-11 border-[#E5E7EB] text-center text-[18px] tracking-[0.4em] font-bold rounded-none"
                                />
                            </Field>
                        </>
                    ) : (
                        <p className="text-[13px] text-red-600">Could not load QR. Close and try again.</p>
                    )}
                </div>
            </SideFormSheet>

            <div className="border shadow-sm rounded-none" style={{ background: account.twoFactorEnabled ? "linear-gradient(180deg, #10b9810d 0%, #ffffff 50%)" : "#fff", borderColor: account.twoFactorEnabled ? "#10b98133" : "#EEF1F6" }}>
                <div className="px-5 py-3.5 border-b flex items-start gap-2" style={{ borderColor: account.twoFactorEnabled ? "#10b98122" : "#EEF1F6" }}>
                    <span className="w-1 h-9" style={{ backgroundColor: account.twoFactorEnabled ? "#10b981" : "#94A3B8" }} />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A] inline-flex items-center gap-2">
                            Two-Factor Authentication
                            {account.twoFactorEnabled && <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-none">Active</span>}
                        </h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Adds a second verification step at sign-in.</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3 p-3 border border-[#EEF1F6] bg-white">
                        <div className="flex items-start gap-3">
                            {account.twoFactorEnabled ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-[#94A3B8] mt-0.5" />}
                            <div>
                                <p className="text-[13px] font-semibold text-[#0F172A]">Authenticator App</p>
                                <p className="text-[12px] text-[#64748B]">Use Google Authenticator, Authy or 1Password.</p>
                            </div>
                        </div>
                        <Switch checked={account.twoFactorEnabled} onCheckedChange={toggle2fa} />
                    </div>
                    {!account.twoFactorEnabled && (
                        <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-none flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            Your account is not protected by 2FA. Enable it for stronger security.
                        </p>
                    )}
                </div>
            </div>

        </div>
    )
}

// ---------- Notifications ----------
function NotificationsPanel() {
    const { toast } = useToast()
    const account = useAdminSettingsStore((s) => s.account)
    const setAccount = useAdminSettingsStore((s) => s.setAccount)
    const [draft, setDraft] = useState({ notifyEmail: account.notifyEmail, notifyInApp: account.notifyInApp, notifyPush: account.notifyPush })
    const [saving, setSaving] = useState(false)
    const dirty = JSON.stringify(draft) !== JSON.stringify({ notifyEmail: account.notifyEmail, notifyInApp: account.notifyInApp, notifyPush: account.notifyPush })

    const onSave = () => {
        setSaving(true)
        setTimeout(() => {
            setAccount(draft)
            toast({ title: "Notification preferences saved" })
            setSaving(false)
        }, 200)
    }

    return (
        <div className="border bg-white shadow-sm rounded-none">
            <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between">
                <div className="flex items-start gap-2">
                    <span className="w-1 h-9 bg-amber-500" />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">Notification Channels</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Where do you want to be notified.</p>
                    </div>
                </div>
                <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                    <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save"}
                </Button>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
                <ToggleRow icon={<User className="w-4 h-4" />} label="In-App Notifications" description="Bell icon at top of dashboard." checked={draft.notifyInApp} onChange={(v) => setDraft((d) => ({ ...d, notifyInApp: v }))} />
                <ToggleRow icon={<ShieldCheck className="w-4 h-4" />} label="Email Notifications" description="Sent to your account email address." checked={draft.notifyEmail} onChange={(v) => setDraft((d) => ({ ...d, notifyEmail: v }))} />
                <ToggleRow icon={<Smartphone className="w-4 h-4" />} label="Push Notifications" description="Mobile push (requires app installation)." checked={draft.notifyPush} onChange={(v) => setDraft((d) => ({ ...d, notifyPush: v }))} />
            </div>
        </div>
    )
}

function ToggleRow({ icon, label, description, checked, onChange }: { icon: React.ReactNode; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3 min-w-0">
                <span className="w-9 h-9 flex items-center justify-center text-white shrink-0 bg-amber-500" style={{ borderRadius: 0 }}>{icon}</span>
                <div>
                    <p className="text-[13.5px] font-semibold text-[#0F172A]">{label}</p>
                    <p className="text-[12.5px] text-[#64748B] mt-0.5">{description}</p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}

// ---------- Sessions ----------
function SessionsPanel() {
    const { toast } = useToast()
    const storeSessions = useAdminSettingsStore((s) => s.sessions)

    const [sessions, setSessions] = useState<Array<any>>(storeSessions)
    const [loading, setLoading] = useState(true)
    const [revokingId, setRevokingId] = useState<string | null>(null)
    const [otpStep, setOtpStep] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [revoking, setRevoking] = useState(false)
    const loadedRef = useRef(false)

    const refreshSessions = async () => {
        try {
            const res = await fetchSessions()
            const arr: any[] = res?.data?.sessions || res?.data?.data || res?.data || []
            if (Array.isArray(arr) && arr.length > 0) {
                const mapped = arr.map((s: any) => ({
                    id: s._id || s.id,
                    device: s.deviceType || s.device || "Unknown device",
                    browser: s.userAgent || s.browser || "Unknown browser",
                    location: s.location || "Unknown",
                    ip: s.ip || s.ipAddress || "—",
                    lastActive: s.lastActiveAt
                        ? new Date(s.lastActiveAt).toLocaleString()
                        : s.updatedAt
                        ? new Date(s.updatedAt).toLocaleString()
                        : "Recently",
                    current: !!s.isCurrent || !!s.current,
                }))
                setSessions(mapped)
            }
        } catch {
            // Backend unreachable — keep mock store sessions
        }
    }

    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        ;(async () => {
            await refreshSessions()
            setLoading(false)
        })()
    }, [])

    const onAskRevoke = async (sessionId: string) => {
        setRevokingId(sessionId)
        setOtp(""); setOtpError("")
        try {
            await sendSessionDeleteOtp()
            setOtpStep(true)
            toast({ title: "OTP sent", description: "Check your registered email for the OTP." })
        } catch (err: any) {
            // Backend unreachable — fallback to local revoke immediately
            setSessions((s) => s.filter((x) => x.id !== sessionId || x.current))
            setRevokingId(null)
            toast({ title: "Session revoked locally", description: err?.response?.data?.message || "Backend unreachable" })
        }
    }

    const onConfirmRevoke = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!revokingId) return
        if (!/^\d{4,6}$/.test(otp)) {
            setOtpError("Enter the OTP sent to your email")
            return
        }
        setOtpError("")
        setRevoking(true)
        try {
            await deleteSession(revokingId, otp)
            setSessions((s) => s.filter((x) => x.id !== revokingId))
            toast({ title: "Session revoked" })
            setOtpStep(false)
            setRevokingId(null)
            setOtp("")
        } catch (err: any) {
            setOtpError(err?.response?.data?.message || "Invalid OTP")
        } finally {
            setRevoking(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader />
            </div>
        )
    }

    const otherCount = sessions.filter((s) => !s.current).length

    return (
        <div className="border bg-white shadow-sm rounded-none">
            <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between">
                <div className="flex items-start gap-2">
                    <span className="w-1 h-9 bg-emerald-500" />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">Active Sessions</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{sessions.length} session{sessions.length !== 1 ? "s" : ""} · revoke requires OTP verification.</p>
                    </div>
                </div>
                <Button variant="outline" onClick={refreshSessions} className="h-9 rounded-none border-[#E5E7EB] text-[13px]">
                    Refresh
                </Button>
            </div>
            <ul className="divide-y divide-[#F1F5F9]">
                {sessions.map((s) => (
                    <li key={s.id} className="px-5 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 flex items-center justify-center text-white shrink-0 bg-emerald-500" style={{ borderRadius: 0 }}>
                                <Monitor className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[13.5px] font-semibold text-[#0F172A] flex items-center gap-2">
                                    {s.device}
                                    {s.current && <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-none">Current</span>}
                                </p>
                                <p className="text-[12px] text-[#64748B]">{s.browser} · {s.location} · {s.ip}</p>
                                <p className="text-[11px] text-[#94A3B8] mt-0.5">Last active {s.lastActive}</p>
                            </div>
                        </div>
                        {!s.current && (
                            <Button
                                onClick={() => onAskRevoke(s.id)}
                                disabled={revokingId === s.id}
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-none border-red-200 text-red-600 hover:bg-red-50 text-[12px] disabled:opacity-50"
                            >
                                <X className="w-3.5 h-3.5 mr-1" /> Revoke
                            </Button>
                        )}
                    </li>
                ))}
                {otherCount === 0 && sessions.length > 0 && (
                    <li className="px-5 py-3 text-[12px] text-[#94A3B8] text-center">Only the current session is active.</li>
                )}
            </ul>

            <SideFormSheet
                open={otpStep}
                onOpenChange={(o) => { setOtpStep(o); if (!o) { setRevokingId(null); setOtp(""); setOtpError("") } }}
                title="Verify OTP to revoke session"
                description="We sent a one-time code to your email. Enter it below to confirm."
                icon={<KeyRound className="w-5 h-5" />}
                onSubmit={onConfirmRevoke}
                loading={revoking}
                submitLabel="Confirm Revoke"
                width="md"
                accentColor="#ef4444"
            >
                <Field label="OTP" required error={otpError}>
                    <Input
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); if (otpError) setOtpError("") }}
                        inputMode="numeric"
                        placeholder="000000"
                        maxLength={6}
                        className="h-11 border-[#E5E7EB] text-center text-[18px] tracking-[0.4em] font-bold rounded-none"
                    />
                </Field>
            </SideFormSheet>
        </div>
    )
}
