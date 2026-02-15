"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Building2,
    Calendar as CalendarIcon,
    ShieldCheck,
    Edit2,
    Camera,
    Globe,
    Smartphone,
    CreditCard,
    UserPlus,
    X,
    Image as ImageIcon,
    Clock,
    MousePointer2,
    Trash2,
    ChevronRight
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { EditProfileDialog } from "@/shared/components/hrm/me/edit-profile-dialog";
import { useToast } from "@/shared/components/ui/use-toast";

import { useMeStore } from "@/shared/data/me-store";

const ProfilePage = () => {
    const { user, bankDetails, updateUser, updateBankDetails } = useMeStore();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Profile state for the dialog (keeps edits decoupled until saved)
    const [profileData, setProfileData] = useState({
        name: user.name,
        avatar: user.avatar,
        empId: user.empId,
        designation: user.designation,
        department: user.department,
        location: user.location,
        workEmail: user.workEmail,
        personalEmail: user.personalEmail,
        mobile: user.mobile,
        joiningDate: user.joiningDate,
        dob: user.dob,
        gender: user.gender,
        bio: user.bio,
        emergencyName: user.emergencyContact.name,
        emergencyRelationship: user.emergencyContact.relationship,
        emergencyMobile: user.emergencyContact.mobile,
        bankName: bankDetails.bankName,
        accountNo: bankDetails.accountNo,
        ifsc: bankDetails.ifsc,
        pan: bankDetails.pan,
    });

    const [bannerImage, setBannerImage] = useState("/images/profile-banner.png");

    // Sync profileData whenever store data changes
    useEffect(() => {
        setProfileData({
            name: user.name,
            avatar: user.avatar,
            empId: user.empId,
            designation: user.designation,
            department: user.department,
            location: user.location,
            workEmail: user.workEmail,
            personalEmail: user.personalEmail,
            mobile: user.mobile,
            joiningDate: user.joiningDate,
            dob: user.dob,
            gender: user.gender,
            bio: user.bio,
            emergencyName: user.emergencyContact.name,
            emergencyRelationship: user.emergencyContact.relationship,
            emergencyMobile: user.emergencyContact.mobile,
            bankName: bankDetails.bankName,
            accountNo: bankDetails.accountNo,
            ifsc: bankDetails.ifsc,
            pan: bankDetails.pan,
        });
    }, [user, bankDetails]);

    const handleSaveProfile = (newData: any) => {
        setProfileData(newData);
        // Sync to unified me store
        updateUser({
            name: newData.name,
            avatar: newData.avatar,
            location: newData.location,
            personalEmail: newData.personalEmail,
            mobile: newData.mobile,
            gender: newData.gender,
            bio: newData.bio,
            emergencyContact: {
                name: newData.emergencyName,
                relationship: newData.emergencyRelationship,
                mobile: newData.emergencyMobile
            }
        });
        updateBankDetails({
            bankName: newData.bankName,
            accountNo: newData.accountNo,
            ifsc: newData.ifsc,
            pan: newData.pan
        });

        toast({
            title: "Registry Updated! 🚀",
            description: "Your professional profile records have been synchronized successfully across the platform.",
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateUser({ avatar: base64 });
                toast({
                    title: "Visual ID Updated",
                    description: "Your professional profile picture has been transmitted successfully.",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setBannerImage(base64);
                toast({
                    title: "Brand Banner Updated",
                    description: "Your profile's visual header has been successfully updated.",
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerRemove = () => {
        setBannerImage("");
        toast({
            title: "Header Reset",
            description: "Transitioning back to the default workstation mesh gradient.",
        });
    };

    const handlePhotoRemove = () => {
        updateUser({ avatar: "" });
        toast({
            title: "Photo Purged",
            description: "Default placeholder identity template now in effect.",
        });
    };

    const reportingTo = user.reportingTo;

    return (
        <div className="space-y-6 pb-10">
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group">
                <div
                    className={`h-40 relative bg-cover bg-center transition-all duration-1000 ${!bannerImage ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950' : 'bg-slate-200'}`}
                    style={{ backgroundImage: bannerImage ? `url('${bannerImage}')` : 'none' }}
                >
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Banner Controls */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <button
                            onClick={() => bannerInputRef.current?.click()}
                            className="bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                        >
                            <ImageIcon size={12} />
                            {bannerImage ? 'Update' : 'Add Cover'}
                        </button>
                        {bannerImage && (
                            <button
                                onClick={handleBannerRemove}
                                className="bg-rose-500/40 hover:bg-rose-600 text-white p-2 rounded-lg backdrop-blur-md border border-white/10 transition-all"
                                title="Remove Banner"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerChange} />
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="p-1 bg-white rounded-3xl shadow-xl relative z-10 transition-transform hover:scale-105 duration-500">
                                <Avatar className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-slate-50">
                                    <AvatarImage src={user.avatar} alt="Profile" className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-indigo-600 text-white font-bold">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-all z-20 border-2 border-white"
                                    title="Edit Photo"
                                >
                                    <Camera size={14} />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                            <div className="absolute bottom-4 right-1 bg-emerald-500 w-5 h-5 border-2 border-white rounded-full shadow-lg z-30 animate-pulse"></div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-1">
                            <div className="text-center md:text-start space-y-2">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{user.name}</h1>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[9px] px-3 py-1 uppercase tracking-widest shadow-none">
                                        Full-Time Staff
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500">
                                    <div className="flex items-center gap-1.5 font-semibold text-xs transition-colors hover:text-indigo-600">
                                        <Briefcase size={14} className="text-indigo-500" />
                                        {user.designation}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-xs transition-colors hover:text-emerald-600">
                                        <Building2 size={14} className="text-emerald-500" />
                                        {user.department}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                                        <MapPin size={12} className="text-indigo-400" />
                                        {user.location}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0">
                                <Button
                                    onClick={() => setIsEditDialogOpen(true)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 group/btn border-none"
                                >
                                    <Edit2 size={16} className="mr-2 group-hover/btn:rotate-12 transition-transform" />
                                    <span className="uppercase text-[10px] tracking-widest">Update Records</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact & Key Info */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg shadow-indigo-200/40 border border-indigo-100 text-start group hover:shadow-xl transition-all">
                        <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2.5">
                            <Phone size={12} className="text-[#6366f1]" /> Communication Matrix
                        </h3>
                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-[#6366f1] group-hover/item:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Primary Work Email</p>
                                    <p className="text-sm text-slate-800 font-semibold break-all">{user.workEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-[#6366f1] group-hover/item:text-white transition-all">
                                    <Smartphone size={20} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Personal Mobile Device</p>
                                    <p className="text-sm text-slate-800 font-semibold">{user.mobile}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full mt-8 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#6366f1] hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all font-sans">
                            SYNC DIRECTORY <ChevronRight size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <Card className="bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg shadow-sky-200/40 border border-sky-100 text-start group hover:shadow-xl transition-all">
                        <h3 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-6 flex items-center gap-2.5">
                            <UserPlus size={12} className="text-sky-500" /> Organizational Hierarchy
                        </h3>
                        <div className="p-1 bg-slate-50 rounded-[2rem] shadow-inner">
                            <div className="flex items-center gap-4 p-4 rounded-[1.8rem] bg-white shadow-xl shadow-slate-200/40 border border-slate-50 group/mgr cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toast({ title: "Manager Intel", description: `Viewing hierarchy for ${reportingTo.name}.` })}>
                                <Avatar className="w-10 h-10 border-2 border-white shadow-md group-hover/mgr:scale-105 transition-transform">
                                    <AvatarImage src={reportingTo.avatar} />
                                    <AvatarFallback className="bg-indigo-600 text-white font-bold text-base">
                                        {reportingTo.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900 leading-none tracking-tight">{reportingTo.name}</p>
                                    <p className="text-[9px] text-[#6366f1] font-bold uppercase tracking-wider">{reportingTo.role}</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-[11px] text-slate-400 font-bold text-center">Reports directly to Senior Leadership</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 rounded-2xl shadow-lg shadow-purple-200/40 border border-purple-100 text-start group hover:shadow-xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full blur-3xl -mr-12 -mt-12 opacity-50" />
                        <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-6 flex items-center gap-2.5">
                            <ShieldCheck size={12} className="text-purple-500" /> Skill Highlights
                        </h3>
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {['Strategic HR', 'Payroll Ops', 'Employee Relations', 'Talent Acquisition', 'Conflict Res.', 'Compliance'].map((skill, i) => (
                                <Badge key={i} className="bg-slate-50 text-slate-600 border border-slate-100 font-bold text-[9px] px-3 py-1.5 uppercase tracking-wider rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-default">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Profile Strength</span>
                                <span className="text-[10px] font-bold text-indigo-600">85%</span>
                            </div>
                            <Progress value={85} className="h-1.5 bg-slate-100" />
                        </div>
                    </Card>
                </div>

                {/* Right Column - Detailed Info Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                                <User size={16} className="text-[#6366f1]" /> Identity Core Records
                            </h3>
                            <button className="text-[#6366f1] hover:text-indigo-700 text-[9px] uppercase font-bold tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full transition-all hover:shadow-md shadow-indigo-100" onClick={() => setIsEditDialogOpen(true)}>REQUEST CHANGE</button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                            <div className="space-y-1 group/id">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Work ID Reference</p>
                                <p className="text-base text-slate-800 font-bold group-hover/id:text-[#6366f1] transition-colors">{user.empId}</p>
                            </div>
                            <div className="space-y-1 group/id">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Induction Date</p>
                                <p className="text-base text-slate-800 font-bold group-hover/id:text-[#6366f1] transition-colors">{user.joiningDate}</p>
                            </div>
                            <div className="space-y-1 group/id">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Date of Birth</p>
                                <p className="text-base text-slate-800 font-bold group-hover/id:text-[#6366f1] transition-colors font-sans tracking-tight">{user.dob}</p>
                            </div>
                            <div className="space-y-1 group/id">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Gender Selection</p>
                                <p className="text-base text-slate-800 font-bold group-hover/id:text-[#6366f1] transition-colors">{user.gender}</p>
                            </div>
                            <div className="md:col-span-2 pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none">Professional Dossier</p>
                                    <div className="h-px flex-1 bg-slate-50"></div>
                                </div>
                                <div className="relative">
                                    <p className="text-sm text-slate-600 font-medium leading-[1.6] bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                        "{user.bio}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-8 py-6 bg-slate-50/30 border-b border-slate-50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                                <ShieldCheck size={16} className="text-rose-500" /> Safety Protocols & Emergency
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Point Person</p>
                                <p className="text-sm text-slate-800 font-bold tracking-tight">{user.emergencyContact.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Bond / Relationship</p>
                                <p className="text-sm text-slate-800 font-bold tracking-tight">{user.emergencyContact.relationship}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none">Emergency Channel</p>
                                <p className="text-sm text-slate-800 font-bold tracking-tight flex items-center gap-2">
                                    <Smartphone size={12} className="text-rose-400" /> {user.emergencyContact.mobile}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-8 py-6 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                                <Globe size={16} className="text-amber-500" /> Career Expedition Historial
                            </h3>
                            <Badge className="bg-white shadow-sm border border-slate-100 text-slate-400 text-[8px] font-bold uppercase tracking-widest px-3 py-1">Last 3 Engagements</Badge>
                        </div>
                        <div className="p-6 space-y-6">
                            {user.workExperience.map((exp, i) => (
                                <div key={i} className={`flex gap-6 group/exp cursor-pointer ${i > 0 ? 'border-t border-slate-50 pt-8' : ''}`}>
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-md shadow-slate-100 ring-1 ring-slate-100 flex items-center justify-center shrink-0 group-hover/exp:scale-105 transition-all">
                                        <Building2 size={24} className="text-slate-400 group-hover/exp:text-[#6366f1]" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover/exp:text-[#6366f1] transition-colors">{exp.company}</h4>
                                            <Badge variant="outline" className="text-[9px] font-bold uppercase text-slate-400 tracking-wider px-2 py-0.5">{exp.duration}</Badge>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 px-3 py-0.5 rounded-md w-fit">{exp.role}</p>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover/exp:opacity-100 transition-opacity">
                                        <MousePointer2 size={20} className="text-[#6366f1]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Financial Details Card */}
                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-8 py-6 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                                <CreditCard size={16} className="text-emerald-500" /> Financial Coordinates
                            </h3>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 border text-[8px] font-bold uppercase tracking-widest px-3 py-1">Verified</Badge>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Bank</p>
                                <p className="text-[15px] text-slate-800 font-bold tracking-tight">{bankDetails.bankName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Account Number</p>
                                <p className="text-[15px] text-slate-800 font-bold tracking-tight font-mono">{bankDetails.accountNo}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">IFSC Code</p>
                                <p className="text-[15px] text-slate-800 font-bold tracking-tight font-mono">{bankDetails.ifsc}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Tax PAN</p>
                                <p className="text-[15px] text-slate-800 font-bold tracking-tight font-mono">{bankDetails.pan}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Request History Log */}
                    <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-8 py-6 bg-slate-50/30 border-b border-slate-50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                                <Clock size={16} className="text-slate-400" /> Profile Request Log
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { title: 'Mobile Number Update', date: 'Oct 24, 2024', status: 'Approved' },
                                { title: 'Address Change', date: 'Sep 12, 2024', status: 'Rejected' },
                                { title: 'Bank Account Update', date: 'Aug 05, 2024', status: 'Approved' }
                            ].map((req, i) => (
                                <div key={i} className="flex items-center justify-between pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-slate-800 text-xs">{req.title}</h4>
                                        <p className="text-[9px] uppercase font-bold text-slate-400">{req.date}</p>
                                    </div>
                                    <Badge className={`${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} border-none font-bold text-[9px] px-2.5 py-0.5`}>
                                        {req.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <EditProfileDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                initialData={profileData}
                onSave={handleSaveProfile}
            />
        </div >
    );
};

export default ProfilePage;
