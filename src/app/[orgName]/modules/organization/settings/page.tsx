"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Camera,
    Mail,
    Phone,
    MapPin,
    Globe,
    Save,
    X,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { axiosInstance } from "@/lib/axios";
import { getOrgDetails } from "@/hooks/orgHooks";

export default function OrgProfilePage() {
    const [orgName, setOrgName] = useState("");
    const [description, setDescription] = useState("");
    const [logoUrl, setLogoUrl] = useState("/placeholder-logo.png");
    const logoInputRef = React.useRef<HTMLInputElement>(null);

    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactName, setContactName] = useState("");

    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("");

    const builtAddress = useMemo(() => {
        const parts = [streetAddress, city, stateName, zip]
            .map((p) => (p || "").trim())
            .filter(Boolean);
        return parts.join(", ");
    }, [streetAddress, city, stateName, zip]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getOrgDetails();
                const o = res?.data?.organization;
                if (!o) return;

                setOrgName(o.name ?? "");
                setContactEmail(o.contactEmail ?? "");
                setContactPhone(o.contactPhone ?? "");
                setContactName(o.contactName ?? "");

                // backend: address, orgCity, orgState, orgCountry
                setStreetAddress(o.address ?? "");
                setCity(o.orgCity ?? "");
                setStateName(o.orgState ?? "");
                setCountry(o.orgCountry ?? "");

                // frontend page uses description locally; backend doesn't expose it in this controller response
                setDescription("");
            } catch {
                // keep empty defaults
            }
        };

        load();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoUrl(reader.result as string);
            toast.success("Logo updated locally (Save to persist).");
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            await axiosInstance.patch("/organization/update/details", {
                name: orgName,
                contactEmail,
                contactPhone,
                contactName,
                address: builtAddress || streetAddress,
                orgCountry: country,
            });

            toast.success("Profile updated successfully.");
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to update profile.");
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-slate-600" />
                        Organization Profile
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage public facing details and contact information.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 border-slate-200 font-bold rounded-lg hover:bg-slate-100">
                        Cancel
                    </Button>
                    <Button
                        className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-lg transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LOGO & IDENTITY */}
                <Card className="border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow bg-white overflow-visible relative flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 w-full rounded-t-xl relative shrink-0">
                        <div className="absolute -bottom-12 w-full flex justify-center">
                            <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                <Avatar className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden transition-transform group-hover:scale-105 duration-300">
                                    <AvatarImage src={logoUrl} className="object-contain p-2" />
                                    <AvatarFallback className="text-3xl font-black bg-slate-50 text-indigo-300 rounded-2xl">AC</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-10 backdrop-blur-sm">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <CardContent className="pt-20 px-6 pb-6 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-5 flex-1">
                            <div className="space-y-2 text-center">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</Label>
                                <Input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="font-black text-xl rounded-lg h-12 text-center border-slate-200 shadow-sm focus-visible:ring-indigo-500 placeholder:font-normal placeholder:text-slate-300 placeholder:italic"
                                    placeholder="Company Name"
                                />
                            </div>
                            <Separator className="bg-slate-100" />
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                                    Description <span className="font-normal normal-case">0/250</span>
                                </Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="text-sm rounded-lg min-h-[120px] resize-none border-slate-200 focus-visible:ring-indigo-500 leading-relaxed"
                                    placeholder="Enter a brief description of your organization..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CONTACT INFO */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            Contact & Location Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Public Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                                <Input
                                    className="pl-10 rounded-lg font-medium h-10 border-slate-200 focus-visible:ring-indigo-500"
                                    placeholder="contact@acme.com"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                                <Input
                                    className="pl-10 rounded-lg font-medium h-10 border-slate-200 focus-visible:ring-indigo-500"
                                    placeholder="+1 (555) 000-0000"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                                <Input className="pl-10 rounded-lg font-medium text-indigo-600 h-10 border-slate-200 focus-visible:ring-indigo-500" placeholder="https://acme.com" />
                            </div>
                        </div>

                        <Separator className="md:col-span-2 my-1" />

                        <div className="space-y-3 md:col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headquarters Address</Label>
                            <Input
                                className="rounded-lg font-medium mb-3 border-slate-200 h-10 focus-visible:ring-indigo-500"
                                placeholder="Street Address"
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                            />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <Input className="rounded-lg font-medium border-slate-200 h-10 focus-visible:ring-indigo-500" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                                <Input
                                    className="rounded-lg font-medium border-slate-200 h-10 focus-visible:ring-indigo-500"
                                    placeholder="State / Province"
                                    value={stateName}
                                    onChange={(e) => setStateName(e.target.value)}
                                />
                                <Input className="rounded-lg font-medium border-slate-200 h-10 focus-visible:ring-indigo-500" placeholder="Zip / Postal" value={zip} onChange={(e) => setZip(e.target.value)} />
                                <Input
                                    className="rounded-lg font-medium border-slate-200 h-10 focus-visible:ring-indigo-500"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
