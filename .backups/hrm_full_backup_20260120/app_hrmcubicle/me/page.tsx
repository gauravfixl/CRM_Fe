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

import { ME_DATA } from "@/shared/data/me-store";

const ProfilePage = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Initialize state
    const [profileData, setProfileData] = useState({
        name: ME_DATA.user.name,
        avatar: ME_DATA.user.avatar,
        empId: ME_DATA.user.empId,
        designation: ME_DATA.user.designation,
        department: ME_DATA.user.department,
        location: ME_DATA.user.location,
        workEmail: ME_DATA.user.workEmail,
        personalEmail: ME_DATA.user.personalEmail,
        mobile: ME_DATA.user.mobile,
        joiningDate: ME_DATA.user.joiningDate,
        dob: ME_DATA.user.dob,
        gender: ME_DATA.user.gender,
        bio: ME_DATA.user.bio,
        emergencyName: ME_DATA.user.emergencyContact.name,
        emergencyRelationship: ME_DATA.user.emergencyContact.relationship,
        emergencyMobile: ME_DATA.user.emergencyContact.mobile,
    });

    const [bannerImage, setBannerImage] = useState("/images/profile-banner.png");

    // Persist to localStorage on Load
    useEffect(() => {
        const savedProfile = localStorage.getItem("hr_profile_data");
        const savedBanner = localStorage.getItem("hr_profile_banner");
        if (savedProfile) {
            setProfileData(JSON.parse(savedProfile));
        }
        if (savedBanner) {
            setBannerImage(savedBanner);
        }
    }, []);

    const handleSaveProfile = (newData: any) => {
        setProfileData(newData);
        localStorage.setItem("hr_profile_data", JSON.stringify(newData));
        toast({
            title: "Registry Updated! 🚀",
            description: "Your professional profile records have been synchronized successfully.",
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const updatedData = { ...profileData, avatar: base64 };
                setProfileData(updatedData);
                localStorage.setItem("hr_profile_data", JSON.stringify(updatedData));
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
                localStorage.setItem("hr_profile_banner", base64);
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
        localStorage.removeItem("hr_profile_banner");
        toast({
            title: "Header Reset",
            description: "Transitioning back to the default workstation mesh gradient.",
        });
    };

    const handlePhotoRemove = () => {
        const updatedData = { ...profileData, avatar: "" };
        setProfileData(updatedData);
        localStorage.setItem("hr_profile_data", JSON.stringify(updatedData));
        toast({
            title: "Photo Purged",
            description: "Default placeholder identity template now in effect.",
        });
    };

    const reportingTo = ME_DATA.user.reportingTo;

    return (
        <div className="space-y-10 pb-10">
            {/* Profile Header Card */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden group">
                <div
                    className={`h-64 relative bg-cover bg-center transition-all duration-1000 ${!bannerImage ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950' : 'bg-slate-200'}`}
                    style={{ backgroundImage: bannerImage ? `url('${bannerImage}')` : 'none' }}
                >
                    {/* Subtle Overlay for better contrast */}
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px]"></div>

                    {/* Banner Upload Control */}
                    <input
                        type="file"
                        ref={bannerInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleBannerChange}
                    />
                    <div className="absolute top-8 left-8 flex gap-3">
                        <button
                            onClick={() => bannerInputRef.current?.click()}
                            className="bg-black/30 hover:bg-black/50 text-white px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/20 transition-all active:scale-95 flex items-center gap-3 text-xs font-black group/banner shadow-2xl uppercase tracking-widest"
                        >
                            <ImageIcon size={16} className="group-hover/banner:scale-110 transition-transform" />
                            {bannerImage ? 'Change Header' : 'Add Header'}
                        </button>
                        {bannerImage && (
                            <button
                                onClick={handleBannerRemove}
                                className="bg-rose-500/30 hover:bg-rose-600 text-white p-3 rounded-2xl backdrop-blur-xl border border-white/20 transition-all active:scale-95 shadow-2xl group/rembanner"
                                title="Remove Banner"
                            >
                                <X size={20} className="group-hover/rembanner:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    {/* Photo Upload Controls */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                    <div className="absolute top-8 right-8 flex gap-3">
                        {profileData.avatar && (
                            <button
                                onClick={handlePhotoRemove}
                                className="bg-rose-500/80 hover:bg-rose-600 text-white p-4 rounded-2xl backdrop-blur-2xl border border-white/30 transition-all active:scale-95 shadow-2xl group/remove"
                                title="Remove Photo"
                            >
                                <Trash2 size={24} className="group-hover/remove:scale-110 transition-transform" />
                            </button>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/50 hover:bg-white/80 text-slate-900 p-4 rounded-2xl backdrop-blur-2xl border border-white/40 transition-all active:scale-95 shadow-2xl group/cam"
                            title="Change Photo"
                        >
                            <Camera size={24} className="group-hover/cam:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="px-12 pb-14">
                    <div className="relative flex flex-col xl:flex-row xl:items-end -mt-24 gap-12">
                        {/* Avatar Cell */}
                        <div className="relative shrink-0 mx-auto xl:mx-0">
                            <div className="p-1.5 bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.03] duration-700 relative z-10">
                                <Avatar className="w-52 h-52 rounded-[2.8rem] border-[8px] border-white overflow-hidden bg-slate-50">
                                    <AvatarImage src={profileData.avatar} alt="Profile" className="object-cover" />
                                    <AvatarFallback className="text-6xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-700 text-white font-black capitalize">
                                        {profileData.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute bottom-8 right-4 bg-emerald-500 w-9 h-9 border-6 border-white rounded-full shadow-2xl z-20 animate-pulse"></div>
                        </div>

                        <div className="flex-1 pb-4 text-center xl:text-start space-y-6">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5">
                                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                        {profileData.name}
                                    </h1>
                                    <Badge className="bg-slate-900 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl border-none">
                                        Full-Time Staff
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-x-8 gap-y-3">
                                    <div className="flex items-center gap-3 text-slate-600 font-black border-r border-slate-200 pr-8 transition-colors hover:text-[#6366f1]">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                                            <Briefcase size={18} className="text-indigo-500" />
                                        </div>
                                        <span className="text-base tracking-tight">{profileData.designation}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-600 font-black transition-colors hover:text-[#6366f1]">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
                                            <Building2 size={18} className="text-emerald-500" />
                                        </div>
                                        <span className="text-base tracking-tight">{profileData.department}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center xl:justify-start gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.25em]">
                                    <MapPin size={14} className="text-[#6366f1]" />
                                    <span>Global Corporate Hub • {profileData.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pb-8 items-center justify-center xl:justify-end shrink-0">
                            <Button
                                variant="default"
                                className="h-16 px-10 gap-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-2xl shadow-slate-900/30 transition-all active:scale-95 group/btn border-b-4 border-slate-700"
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                <span className="uppercase text-xs tracking-widest">Update Records</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column - Contact & Key Info */}
                <div className="space-y-10">
                    <Card className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-start group hover:shadow-2xl transition-all">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Phone size={14} className="text-[#6366f1]" /> Communication Matrix
                        </h3>
                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-[#6366f1] group-hover/item:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Primary Work Email</p>
                                    <p className="text-base text-slate-800 font-bold break-all">{profileData.workEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover/item:bg-[#6366f1] group-hover/item:text-white transition-all">
                                    <Smartphone size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Personal Mobile Device</p>
                                    <p className="text-base text-slate-800 font-bold">{profileData.mobile}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full mt-10 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#6366f1] hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all font-sans">
                            SYNC DIRECTORY <ChevronRight size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <Card className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-start group hover:shadow-2xl transition-all">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <UserPlus size={14} className="text-emerald-500" /> Organizational Hierarchy
                        </h3>
                        <div className="p-1 bg-slate-50 rounded-[2.5rem] shadow-inner">
                            <div className="flex items-center gap-5 p-6 rounded-[2.2rem] bg-white shadow-xl shadow-slate-200/40 border border-slate-50 group/mgr cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toast({ title: "Manager Intel", description: `Viewing hierarchy for ${reportingTo.name}.` })}>
                                <Avatar className="w-16 h-16 border-4 border-white shadow-lg group-hover/mgr:scale-110 transition-transform">
                                    <AvatarImage src={reportingTo.avatar} />
                                    <AvatarFallback className="bg-indigo-600 text-white font-black text-lg">
                                        {reportingTo.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <p className="text-base font-black text-slate-900 leading-none tracking-tight">{reportingTo.name}</p>
                                    <p className="text-[10px] text-[#6366f1] font-black uppercase tracking-widest">{reportingTo.role}</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-[11px] text-slate-400 font-bold text-center italic">Reports directly to Senior Leadership</p>
                    </Card>
                </div>

                {/* Right Column - Detailed Info Sections */}
                <div className="lg:col-span-2 space-y-10">
                    <Card className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-3">
                                <User size={18} className="text-[#6366f1]" /> Identity Core Records
                            </h3>
                            <button className="text-[#6366f1] hover:text-indigo-700 text-[10px] uppercase font-black tracking-[0.2em] bg-indigo-50 px-5 py-2 rounded-full transition-all hover:shadow-lg shadow-indigo-100" onClick={() => setIsEditDialogOpen(true)}>REQUEST CHANGE</button>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                            <div className="space-y-2 group/id">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Work ID Reference</p>
                                <p className="text-lg text-slate-800 font-black group-hover/id:text-[#6366f1] transition-colors">{profileData.empId}</p>
                            </div>
                            <div className="space-y-2 group/id">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Induction Date</p>
                                <p className="text-lg text-slate-800 font-black group-hover/id:text-[#6366f1] transition-colors">{profileData.joiningDate}</p>
                            </div>
                            <div className="space-y-2 group/id">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Date of Birth</p>
                                <p className="text-lg text-slate-800 font-black group-hover/id:text-[#6366f1] transition-colors font-sans tracking-tight">{profileData.dob}</p>
                            </div>
                            <div className="space-y-2 group/id">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Gender Selection</p>
                                <p className="text-lg text-slate-800 font-black group-hover/id:text-[#6366f1] transition-colors">{profileData.gender}</p>
                            </div>
                            <div className="md:col-span-2 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-3 mb-6">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] leading-none">Professional Dossier</p>
                                    <div className="h-px flex-1 bg-slate-50"></div>
                                </div>
                                <div className="relative">
                                    <p className="text-base text-slate-600 font-bold leading-[1.8] bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 italic">
                                        "{profileData.bio}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-3">
                                <ShieldCheck size={18} className="text-rose-500" /> Safety Protocols & Emergency
                            </h3>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Point Person</p>
                                <p className="text-base text-slate-800 font-black tracking-tight">{profileData.emergencyName}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Bond / Relationship</p>
                                <p className="text-base text-slate-800 font-black tracking-tight">{profileData.emergencyRelationship}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Emergency Channel</p>
                                <p className="text-base text-slate-800 font-black tracking-tight flex items-center gap-2">
                                    <Smartphone size={14} className="text-rose-400" /> {profileData.emergencyMobile}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-start group hover:shadow-2xl transition-all">
                        <div className="px-10 py-8 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-3">
                                <Globe size={18} className="text-amber-500" /> Career Expedition Historial
                            </h3>
                            <Badge className="bg-white shadow-sm border border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest px-4 py-1.5">Last 3 Engagements</Badge>
                        </div>
                        <div className="p-10 space-y-10">
                            {ME_DATA.user.workExperience.map((exp, i) => (
                                <div key={i} className={`flex gap-8 group/exp cursor-pointer ${i > 0 ? 'border-t border-slate-50 pt-10' : ''}`}>
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-100 ring-1 ring-slate-100 flex items-center justify-center shrink-0 group-hover/exp:scale-110 group-hover/exp:rotate-3 transition-all">
                                        <Building2 size={28} className="text-slate-400 group-hover/exp:text-[#6366f1]" />
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover/exp:text-[#6366f1] transition-colors">{exp.company}</h4>
                                            <Badge variant="outline" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{exp.duration}</Badge>
                                        </div>
                                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider bg-slate-50 px-4 py-1 rounded-lg w-fit">{exp.role}</p>
                                    </div>
                                    <div className="flex items-center opacity-0 group-hover/exp:opacity-100 transition-opacity">
                                        <MousePointer2 size={20} className="text-[#6366f1]" />
                                    </div>
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
        </div>
    );
};

export default ProfilePage;
