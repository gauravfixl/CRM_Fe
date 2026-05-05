"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Building2,
    Save,
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar,
    Users,
    Briefcase,
    Package,
    Clock,
    User as UserIcon,
    CheckCircle2,
    XCircle,
    Edit3,
    DollarSign,
    Languages,
    Database,
    ChevronRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { axiosInstance } from "@/lib/axios";
import { getOrgDetails, updateOrgDetails } from "@/hooks/orgHooks";
import { showError, showSuccess } from "@/utils/toast";
import Loader from "@/shared/components/custom/Loader";

const formatDateLong = (input: string | undefined): string => {
    if (!input) return "—";
    const t = new Date(input).getTime();
    if (!Number.isFinite(t)) return "—";
    return new Date(t).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
};

export default function OrgSettingsProfilePage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "default";

    const [org, setOrg] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [firms, setFirms] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);

    const [form, setForm] = useState({
        name: "",
        contactEmail: "",
        contactPhone: "",
        contactName: "",
        address: "",
        orgCountry: "",
    });

    const loadedRef = useRef(false);
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        const safety = window.setTimeout(() => setLoading(false), 20000);

        ;(async () => {
            try {
                const [orgRes, usersRes, firmsRes] = await Promise.allSettled([
                    getOrgDetails(),
                    axiosInstance.get("/organization/users/all"),
                    axiosInstance.get("/firm/getAllFirm"),
                ]);

                if (orgRes.status === "fulfilled") {
                    const orgData = orgRes.value?.data?.organization ?? null;
                    setOrg(orgData);
                    if (orgData) {
                        setForm({
                            name: orgData.name || "",
                            contactEmail: orgData.contactEmail || "",
                            contactPhone: orgData.contactPhone || "",
                            contactName: orgData.contactName || "",
                            address: orgData.address || "",
                            orgCountry: orgData.orgCountry || "",
                        });
                    }
                }
                if (usersRes.status === "fulfilled") {
                    const d: any = usersRes.value?.data || {};
                    const arr: any[] = Array.isArray(d) ? d : d.users || d.data || [];
                    setUsers(Array.isArray(arr) ? arr : []);
                }
                if (firmsRes.status === "fulfilled") {
                    const arr = firmsRes.value?.data?.firms ?? [];
                    setFirms(Array.isArray(arr) ? arr : []);
                }
            } finally {
                window.clearTimeout(safety);
                setLoading(false);
            }
        })();
    }, []);

    const totalUsers = users.length;
    const activeFirmsCount = useMemo(() => firms.filter((f: any) => !f.isDeleted).length, [firms]);
    const enabledModules: string[] = Array.isArray(org?.modules) ? org.modules : [];

    const hasRealLogo = !!(
        org?.OrgLogo?.url &&
        !org.OrgLogo.url.includes("encrypted-tbn0.gstatic.com") &&
        !org.OrgLogo.url.includes("gstatic.com/images")
    );
    const orgInitials = useMemo(() => {
        const name = (org?.name || orgName || "Org").trim();
        const parts = name.split(/\s+/).filter(Boolean);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }, [org, orgName]);

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            showError("Organization name is required");
            return;
        }
        if (!form.contactEmail.trim()) {
            showError("Contact email is required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.contactEmail.trim())) {
            showError("Please enter a valid email address");
            return;
        }
        if (form.contactPhone) {
            const phoneRegex = /^\+?[\d\s-]{7,}$/;
            if (!phoneRegex.test(form.contactPhone.trim())) {
                showError("Please enter a valid phone number");
                return;
            }
        }

        try {
            setSaving(true);
            await updateOrgDetails(form);
            showSuccess("Organization details updated");
            setEditing(false);
            const refreshed = await getOrgDetails();
            setOrg(refreshed?.data?.organization ?? null);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to update organization");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (org) {
            setForm({
                name: org.name || "",
                contactEmail: org.contactEmail || "",
                contactPhone: org.contactPhone || "",
                contactName: org.contactName || "",
                address: org.address || "",
                orgCountry: org.orgCountry || "",
            });
        }
        setEditing(false);
    };

    if (loading) {
        return (
            <div className="relative flex flex-col h-full w-full bg-slate-50/50 font-sans">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-y-auto font-sans pb-8">
            {/* HEADER */}
            <div className="relative w-full h-44 shadow-2xl overflow-hidden flex items-center px-8 border-b-4 border-indigo-200">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-24 w-24 rounded-2xl border-4 border-white/40 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/10 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
                        {hasRealLogo ? (
                            <img src={org.OrgLogo.url} alt={org?.name || "Org"} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-white tracking-tight drop-shadow-md select-none">
                                {orgInitials}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Organization Settings</p>
                        <h1 className="text-3xl font-black text-white drop-shadow-xl">{org?.name || orgName}</h1>
                        {(org?.createdAt || typeof org?.isActive !== "undefined" || org?.contactEmail) && (
                            <div className="flex items-center gap-3 mt-2 text-white/80 text-xs flex-wrap">
                                {org?.createdAt && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Founded {formatDateLong(org.createdAt)}
                                    </span>
                                )}
                                {org?.contactEmail && (
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {org.contactEmail}
                                    </span>
                                )}
                                {typeof org?.isActive !== "undefined" && (
                                    <Badge className={`text-[10px] font-bold uppercase ${
                                        org.isActive ? "bg-emerald-500 hover:bg-emerald-500" : "bg-red-500 hover:bg-red-500"
                                    } text-white border-0`}>
                                        {org.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="ml-auto relative z-10">
                    {!editing ? (
                        <CustomButton
                            className="bg-white text-indigo-700 hover:bg-white/90 font-bold rounded-xl px-5 h-10"
                            onClick={() => setEditing(true)}
                        >
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                        </CustomButton>
                    ) : (
                        <div className="flex items-center gap-2">
                            <CustomButton
                                variant="outline"
                                className="bg-white/15 backdrop-blur-lg text-white border-white/20 hover:bg-white/25 hover:text-white rounded-xl px-4 h-10"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                className="bg-white text-indigo-700 hover:bg-white/90 font-bold rounded-xl px-5 h-10"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
                            </CustomButton>
                        </div>
                    )}
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-6 mt-6">
                <Card className="border bg-white shadow-md rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Total Users</p>
                            <p className="text-xl font-bold text-zinc-900">{totalUsers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border bg-white shadow-md rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Active Firms</p>
                            <p className="text-xl font-bold text-zinc-900">{activeFirmsCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border bg-white shadow-md rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Active Modules</p>
                            <p className="text-xl font-bold text-zinc-900">{enabledModules.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border bg-white shadow-md rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Timezone</p>
                            <p className="text-base font-bold text-zinc-900">{org?.timezone || "UTC"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* GENERAL INFORMATION + AT A GLANCE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 mt-6">
                <Card className="lg:col-span-2 border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-600" /> General Information
                        </CardTitle>
                        <CardDescription>Official details about your registered organization</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Organization Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    disabled={!editing}
                                    className="rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Contact Person</Label>
                                <Input
                                    value={form.contactName}
                                    onChange={(e) => handleChange("contactName", e.target.value)}
                                    disabled={!editing}
                                    placeholder="Primary contact name"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Contact Email *</Label>
                                <Input
                                    type="email"
                                    value={form.contactEmail}
                                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                                    disabled={!editing}
                                    className="rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Contact Phone</Label>
                                <Input
                                    value={form.contactPhone}
                                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                                    disabled={!editing}
                                    placeholder="+1 555-1234"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-zinc-700">Address</Label>
                                <Textarea
                                    value={form.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    disabled={!editing}
                                    placeholder="Street address, building, suite..."
                                    className="rounded-md min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Country</Label>
                                <Input
                                    value={form.orgCountry}
                                    onChange={(e) => handleChange("orgCountry", e.target.value)}
                                    disabled={!editing}
                                    placeholder="e.g. India"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-700">Timezone</Label>
                                <Input
                                    value={org?.timezone || "UTC"}
                                    disabled
                                    className="rounded-md bg-zinc-50"
                                />
                                <p className="text-[10px] text-zinc-400">Set during org creation</p>
                            </div>
                        </div>

                        {(org?.orgCity || org?.orgState) && (
                            <div className="pt-4 border-t border-zinc-100">
                                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-2">Location (read-only)</p>
                                <div className="flex items-center gap-4 text-sm text-zinc-700">
                                    {org?.orgCity && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {org.orgCity}
                                        </span>
                                    )}
                                    {org?.orgState && (
                                        <span className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-zinc-400" /> {org.orgState}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-indigo-600" /> At a Glance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {org?.createdAt && (
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-zinc-500">Founded</p>
                                    <p className="text-sm font-semibold text-zinc-900">{formatDateLong(org.createdAt)}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-500">Primary Email</p>
                                <p className="text-sm font-semibold text-zinc-900 truncate">{org?.contactEmail || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-500">Primary Phone</p>
                                <p className="text-sm font-semibold text-zinc-900">{org?.contactPhone || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-500">Address</p>
                                <p className="text-sm font-semibold text-zinc-900 break-words">
                                    {org?.address || "—"}
                                    {org?.orgCity && `, ${org.orgCity}`}
                                    {org?.orgState && `, ${org.orgState}`}
                                    {org?.orgCountry && `, ${org.orgCountry}`}
                                </p>
                            </div>
                        </div>

                        {(typeof org?.isActive !== "undefined" || typeof org?.isDeleted !== "undefined") && (
                            <div className="pt-4 border-t border-zinc-100">
                                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mb-3">Status</p>
                                <div className="space-y-2">
                                    {typeof org?.isActive !== "undefined" && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-600">Organization</span>
                                            <span className={`flex items-center gap-1 font-bold ${org.isActive ? "text-emerald-600" : "text-red-600"}`}>
                                                {org.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {org.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    )}
                                    {typeof org?.isDeleted !== "undefined" && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-600">Deletion</span>
                                            <span className={`flex items-center gap-1 font-bold ${!org.isDeleted ? "text-emerald-600" : "text-red-600"}`}>
                                                {!org.isDeleted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {!org.isDeleted ? "Not deleted" : "Deleted"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* MODULES + OTHER SETTINGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6">
                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" /> Active Modules
                        </CardTitle>
                        <CardDescription>Modules currently enabled for this organization</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {enabledModules.length === 0 ? (
                            <div className="text-center py-8 text-sm text-zinc-500">
                                <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                No modules activated yet
                                <CustomButton
                                    className="mt-3 h-8 text-xs block mx-auto"
                                    onClick={() => router.push(`/${orgName}/modules/organization/units`)}
                                >
                                    Manage Modules
                                </CustomButton>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {enabledModules.map((mod) => (
                                    <Badge
                                        key={mod}
                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 text-xs font-semibold capitalize border-0"
                                    >
                                        {mod}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-xl rounded-3xl bg-white">
                    <CardHeader className="border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-600" /> Other Settings
                        </CardTitle>
                        <CardDescription>Configure regional and data preferences for this org</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        {[
                            {
                                title: "Timezone & Locale",
                                hint: org?.timezone ? `Currently ${org.timezone}` : "Set regional timezone",
                                icon: Clock,
                                tone: "bg-indigo-100 text-indigo-600",
                                href: `/${orgName}/modules/organization/settings/locale`,
                            },
                            {
                                title: "Default Currency",
                                hint: "Used in invoices and pricing",
                                icon: DollarSign,
                                tone: "bg-emerald-100 text-emerald-600",
                                href: `/${orgName}/modules/organization/settings/currency`,
                            },
                            {
                                title: "Default Language",
                                hint: "Default UI language for new users",
                                icon: Languages,
                                tone: "bg-amber-100 text-amber-600",
                                href: `/${orgName}/modules/organization/settings/language`,
                            },
                            {
                                title: "Data Region",
                                hint: "Where your org data is stored",
                                icon: Database,
                                tone: "bg-blue-100 text-blue-600",
                                href: `/${orgName}/modules/organization/settings/region`,
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.title}
                                    onClick={() => router.push(item.href)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-all text-left group"
                                >
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.tone}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                                        <p className="text-xs text-zinc-500 truncate">{item.hint}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 transition-colors" />
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
