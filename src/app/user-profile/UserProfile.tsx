"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import { axiosInstance } from "@/lib/axios";
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
} from "lucide-react";

export default function ProfilePage() {
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
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
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
      // Store cover photo as base64 in local state since no backend API exists for cover
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        updateUser({ coverPhoto: base64 } as any);
        setCoverUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Cover upload failed:", err);
      setCoverUploading(false);
    }
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  if (!localUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleAvatarUpload}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleCoverUpload}
      />

      <div className="max-w-[1400px] mx-auto px-8 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information and preferences</p>
        </div>

        {/* Profile Hero Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          {/* Cover Photo / Banner */}
          <div className="h-44 relative group">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzB2Mkgydi0yaDM0em0wIDEwdjJIMnYtMmgzNHptMCAxMHYySDJ2LTJoMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              </div>
            )}
            {/* Cover photo overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 text-slate-700 text-xs font-bold shadow-lg hover:bg-white transition-colors cursor-pointer"
              >
                {coverUploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : (
                  <><ImagePlus className="w-4 h-4" /> Change Cover Photo</>
                )}
              </button>
              {coverUrl && (
                <button
                  onClick={() => updateUser({ coverPhoto: undefined } as any)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/90 text-white text-xs font-bold shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Avatar & Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-lg shadow-slate-200/50">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                </div>
                {/* Avatar upload button */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  {avatarUploading ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                {/* Avatar remove button */}
                {avatarUrl && (
                  <button
                    onClick={() => updateUser({ avatar: undefined } as any)}
                    className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-lg shadow-md flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>

              {/* Name & Role */}
              <div className="flex-1 pb-1">
                <h2 className="text-2xl font-bold text-slate-900">{u.firstName} {u.lastName}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    {u.role || "User"}
                  </span>
                  {singleOrg?.orgName && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      <Building2 className="w-3 h-3" />
                      {singleOrg.orgName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6">

          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your basic contact details</p>
                </div>
              </div>
              {editingSection !== "personal" && (
                <button
                  onClick={() => setEditingSection("personal")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="px-7 py-6">
              {editingSection === "personal" ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: "firstName", label: "First Name", icon: User },
                      { name: "lastName", label: "Last Name", icon: User },
                      { name: "email", label: "Email Address", icon: Mail },
                      { name: "phone", label: "Phone Number", icon: Phone },
                    ].map(({ name, label, icon: Icon }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={name === "email" ? "email" : "text"}
                            name={name}
                            value={u[name] || ""}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "First Name", value: u.firstName, icon: User },
                    { label: "Last Name", value: u.lastName, icon: User },
                    { label: "Email Address", value: u.email, icon: Mail },
                    { label: "Phone Number", value: u.phone, icon: Phone },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Address</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Your location details</p>
                </div>
              </div>
              {editingSection !== "address" && (
                <button
                  onClick={() => setEditingSection("address")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="px-7 py-6">
              {editingSection === "address" ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: "country", label: "Country", icon: Globe },
                      { name: "city", label: "City", icon: Building2 },
                      { name: "state", label: "State", icon: MapPin },
                    ].map(({ name, label, icon: Icon }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name={name}
                            value={u[name] || ""}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Country", value: u.country, icon: Globe },
                    { label: "City", value: u.city, icon: Building2 },
                    { label: "State", value: u.state, icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{value || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Security</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your security preferences</p>
                </div>
              </div>
            </div>
            <div className="px-7 py-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Shield className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.twoFAEnabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {u.twoFAEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
