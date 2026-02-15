"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Globe,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Twitter,
    Linkedin,
    Facebook,
    Edit,
    Save,
    X,
    Upload,
    CheckCircle2,
    Calendar,
    Briefcase,
    Link as LinkIcon
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Company } from "@/shared/data/organisation-store";

const CompanyProfilePage = () => {
    const { toast } = useToast();
    const { company, updateCompany } = useOrganisationStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Company>(company);

    const handleSave = () => {
        updateCompany(formData);
        setIsEditing(false);
        toast({
            title: "Settings Saved",
            description: "Company profile has been updated successfully.",
        });
    };

    const sectionStyles = "p-8 space-y-6";
    const gridStyles = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]/50" style={{ zoom: "90%" }}>
            <header className="py-5 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Company Profile</h1>
                            <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3 italic">
                                Institutional Settings
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Manage your organization's legal identity and contact details.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="h-10 px-6 rounded-xl font-bold border-slate-200 gap-2 text-xs"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData(company);
                                    }}
                                >
                                    <X size={16} /> Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-8 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                                >
                                    <Save size={16} /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-10 px-8 font-bold shadow-xl transition-all gap-2 text-xs"
                            >
                                <Edit size={16} /> Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
                {/* 🚀 Main Identity Card */}
                <Card className="rounded-[3rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />
                    <div className="p-10 flex flex-col lg:flex-row gap-12 items-start">
                        <div className="relative group/logo">
                            <div className="h-40 w-40 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center p-2 relative overflow-hidden transition-all duration-500 group-hover/logo:border-indigo-400">
                                <Building2 size={64} className="text-slate-300 transition-transform duration-500 group-hover/logo:scale-110" />
                                <div className="absolute inset-0 bg-indigo-600/0 group-hover/logo:bg-indigo-600/10 flex items-center justify-center transition-all opacity-0 group-hover/logo:opacity-100 italic cursor-pointer">
                                    <Upload size={24} className="text-indigo-600" />
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-white shadow-lg border border-slate-100 text-indigo-600 hover:scale-110 transition-transform">
                                <Edit size={16} />
                            </Button>
                        </div>

                        <div className="flex-1 space-y-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Official Name</Label>
                                        <Input
                                            disabled={!isEditing}
                                            className="rounded-xl h-12 bg-slate-50 border border-slate-300 font-bold px-5 text-sm focus:border-indigo-500 transition-all disabled:opacity-100 disabled:border-transparent disabled:bg-transparent disabled:px-1 disabled:text-2xl"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Slogan / Tagline</Label>
                                        <Input
                                            disabled={!isEditing}
                                            placeholder="Your brand slogan..."
                                            className="rounded-xl h-11 bg-slate-50 border border-slate-300 font-medium px-5 text-sm focus:border-indigo-500 transition-all disabled:opacity-100 disabled:border-transparent disabled:bg-transparent disabled:px-1 disabled:text-slate-500"
                                            value={formData.tagline}
                                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Industry</Label>
                                        <Input
                                            disabled={!isEditing}
                                            className="rounded-xl h-11 bg-slate-50 border border-slate-300 font-bold px-5 text-sm focus:border-indigo-500 transition-all disabled:opacity-100 disabled:border-transparent disabled:bg-transparent disabled:px-1"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Official Website</Label>
                                        <Input
                                            disabled={!isEditing}
                                            className="rounded-xl h-11 bg-slate-50 border border-slate-300 font-bold px-5 text-sm focus:border-indigo-500 transition-all disabled:opacity-100 disabled:border-transparent disabled:bg-transparent disabled:px-1 text-indigo-600 cursor-link"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700">
                                    <Globe size={16} />
                                    <span className="text-xs font-bold">Global Presence</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700">
                                    <ShieldCheck size={16} />
                                    <span className="text-xs font-bold">Verified Institution</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 🛡️ Legal & Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Legal Information */}
                    <Card className="rounded-[2.5rem] border border-slate-200 bg-white shadow-lg overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight">Legal & Registration</h2>
                            </div>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[8px] h-5 px-3 uppercase tracking-[2px]">Compliance</Badge>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Registration No.</Label>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80 disabled:bg-slate-50/50"
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">PAN Card No.</Label>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80 disabled:bg-slate-50/50"
                                        value={formData.panNumber}
                                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">GSTIN Number</Label>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80 disabled:bg-slate-50/50"
                                        value={formData.gstin}
                                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Date of Inc.</Label>
                                    <Input
                                        type="date"
                                        disabled={!isEditing}
                                        className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80 disabled:bg-slate-50/50"
                                        value={formData.incorporationDate}
                                        onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="rounded-[2.5rem] border border-slate-200 bg-white shadow-lg overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Phone size={20} />
                                </div>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight">Contact Channels</h2>
                            </div>
                            <Badge className="bg-emerald-600 text-white border-none font-bold text-[8px] h-5 px-3 uppercase tracking-[2px]">Communication</Badge>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Official Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={14} />
                                        <Input
                                            disabled={!isEditing}
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold pl-10 pr-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Support Email</Label>
                                    <div className="relative group">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" size={14} />
                                        <Input
                                            disabled={!isEditing}
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold pl-10 pr-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80"
                                            value={formData.supportEmail}
                                            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Primary Phone</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors" size={14} />
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold pl-10 pr-4 text-xs focus:border-indigo-500 transition-colors disabled:opacity-80"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 📍 Headquarters Address */}
                <Card className="rounded-[3rem] border border-slate-200 bg-white shadow-lg overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <MapPin size={20} />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Headquarters Address</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Building/Suite</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.building}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, building: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Area/Street</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.area}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, area: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">City</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.city}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">State/Province</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.state}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Country</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.country}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">PIN/ZIP Code</Label>
                                <Input
                                    disabled={!isEditing}
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.address.pincode}
                                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 🌐 Social Links */}
                <Card className="rounded-[2.5rem] border border-slate-200 bg-white shadow-lg overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                <LinkIcon size={20} />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Social Presence</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">LinkedIn Profile</Label>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg flex items-center justify-center text-slate-400">
                                        <Linkedin size={16} />
                                    </div>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-none rounded-r-lg h-10 bg-slate-50 border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors flex-1"
                                        value={formData.socialLinks?.linkedin}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Twitter (X)</Label>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg flex items-center justify-center text-slate-400">
                                        <Twitter size={16} />
                                    </div>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-none rounded-r-lg h-10 bg-slate-50 border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors flex-1"
                                        value={formData.socialLinks?.twitter}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Facebook</Label>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg flex items-center justify-center text-slate-400">
                                        <Facebook size={16} />
                                    </div>
                                    <Input
                                        disabled={!isEditing}
                                        className="rounded-none rounded-r-lg h-10 bg-slate-50 border border-slate-300 font-medium px-4 text-xs focus:border-indigo-500 transition-colors flex-1"
                                        value={formData.socialLinks?.facebook}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default CompanyProfilePage;
