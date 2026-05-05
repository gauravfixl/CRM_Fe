"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Pencil,
  X,
  Check,
  Camera,
  Building2,
  Globe,
  ImagePlus,
  Loader2,
  ArrowLeft,
  Briefcase,
  Lock,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { CustomButton } from "@/shared/components/custom/CustomButton";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, singleOrg } = useAuthStore();
  const [localUser, setLocalUser] = useState(user || {});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setLocalUser(user);
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUser(localUser);
    setEditingSection(null);
    toast.success("Profile updated successfully");
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosInstance.patch("/auth/updateProfilephoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        updateUser({
          avatar: { url: res.data.profilePhoto, public_id: "" },
        } as any);
        toast.success("Profile photo updated");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        updateUser({ coverPhoto: base64 } as any);
        setCoverUploading(false);
        toast.success("Cover photo updated");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Cover upload failed:", err);
      setCoverUploading(false);
      toast.error("Failed to upload cover photo");
    }
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  if (!localUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No user data found.</p>
        </div>
      </div>
    );
  }

  const u = localUser as any;
  const initials = `${(u.firstName || "")[0] || ""}${(u.lastName || "")[0] || ""}`.toUpperCase();
  const avatarUrl = u.avatar?.url;
  const coverUrl = u.coverPhoto;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hidden file inputs */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CustomButton 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </CustomButton>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
              <p className="text-xs text-slate-500 font-medium">Manage your professional identity and security</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
             <CustomButton variant="ghost" size="sm" className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                Sign out
             </CustomButton>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
          {/* Banner Container */}
          <div className="h-40 relative group overflow-hidden">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              </div>
            )}
            
            {/* Banner Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <CustomButton 
                size="sm" 
                className="bg-white/90 text-slate-900 hover:bg-white border-none font-bold"
                onClick={() => coverInputRef.current?.click()}
              >
                <ImagePlus className="w-3.5 h-3.5 mr-2" /> Change Cover
              </CustomButton>
              {coverUrl && (
                <CustomButton 
                  size="sm" 
                  variant="destructive"
                  className="bg-red-500/90 text-white font-bold"
                  onClick={() => updateUser({ coverPhoto: undefined } as any)}
                >
                  Remove
                </CustomButton>
              )}
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 relative z-10">
              {/* Avatar section */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-white dark:bg-zinc-900 p-1.5 shadow-2xl ring-4 ring-white dark:ring-zinc-900">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black">
                      {initials}
                    </div>
                  )}
                  {/* Photo Edit Overlay */}
                  <div className="absolute inset-1.5 bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                     <Camera className="w-6 h-6 text-white text-opacity-80" />
                  </div>
                </div>
                <button 
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-lg shadow-lg flex items-center justify-center border-2 border-white dark:border-zinc-900 hover:bg-indigo-700 transition-all active:scale-90"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Identity & Badges */}
              <div className="flex-1 space-y-2 pb-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{u.firstName} {u.lastName}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm">
                    {u.role || "Administrator"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {u.email}
                  </div>
                  {singleOrg?.orgName && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {singleOrg.orgName}
                    </div>
                  )}
                </div>
              </div>

              {/* Global Actions */}
              <div className="flex items-center gap-2">
                <CustomButton 
                   className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-bold text-xs h-9 px-5"
                   onClick={() => setEditingSection(editingSection ? null : "personal")}
                >
                  {editingSection === "personal" ? <><X className="w-3.5 h-3.5 mr-2" /> Cancel Edit</> : <><Pencil className="w-3.5 h-3.5 mr-2" /> Edit Profile</>}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Details Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Basic Information</h3>
                </div>
              </div>

              {editingSection === "personal" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "firstName", label: "First Name", icon: User },
                      { name: "lastName", label: "Last Name", icon: User },
                      { name: "phone", label: "Phone & Contact", icon: Smartphone },
                    ].map(({ name, label, icon: Icon }) => (
                      <div key={name} className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest px-1">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            name={name}
                            value={u[name] || ""}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2 text-sm font-bold text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <CustomButton type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold px-6">
                      Save Changes
                    </CustomButton>
                    <CustomButton type="button" variant="ghost" size="sm" onClick={() => setEditingSection(null)} className="text-xs font-bold text-slate-500">
                      Discard
                    </CustomButton>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  {[
                    { label: "First Name", value: u.firstName, icon: User },
                    { label: "Last Name", value: u.lastName, icon: User },
                    { label: "Email Address", value: u.email, icon: Mail },
                    { label: "Phone Number", value: u.phone, icon: Phone },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="group">
                      <div className="flex items-center gap-2 mb-1">
                         <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                         <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{label}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 pl-5">{value || "Not set"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workplace & Location */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/50 p-6 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Workplace & Origin</h3>
                </div>
                {editingSection !== "address" && (
                   <button onClick={() => setEditingSection("address")} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Manage</button>
                )}
              </div>

               {editingSection === "address" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "country", label: "Country", icon: Globe },
                      { name: "city", label: "City", icon: Building2 },
                      { name: "state", label: "State", icon: MapPin },
                    ].map(({ name, label, icon: Icon }) => (
                      <div key={name} className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            name={name}
                            value={u[name] || ""}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2 text-sm font-bold text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <CustomButton type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6 border-none">Update Location</CustomButton>
                </form>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: "City / Region", value: u.city, icon: Building2 },
                      { label: "State / District", value: u.state, icon: MapPin },
                      { label: "Country", value: u.country, icon: Globe },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                        <div className="flex items-center gap-2">
                           <Icon className="w-3 h-3 text-emerald-500" />
                           <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{value || "—"}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar Area - Security & Stats */}
          <div className="space-y-6">
            {/* Security Profile */}
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 transition-transform group-hover:scale-110">
                  <Shield className="w-32 h-32 text-white/10" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-200" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Account Security</h4>
                  </div>
                  <div>
                    <p className="text-2xl font-black">2FA: {u.twoFAEnabled ? "Active" : "Off"}</p>
                    <p className="text-[10px] text-indigo-100/70 font-bold mt-1 leading-relaxed">Multi-factor authentication adds a layer of protection to your account.</p>
                  </div>
                  <CustomButton className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-[11px] rounded-xl border-none">
                     Secure Device Info <ExternalLink className="w-3 h-3 ml-2" />
                  </CustomButton>
               </div>
            </div>

            {/* Quick Stats / Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/60 dark:border-zinc-800/50 p-6 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Integrity</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Profile Strength</p>
                     <p className="text-xs font-black text-indigo-600">85%</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Verify your phone number to reach 100%.</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
