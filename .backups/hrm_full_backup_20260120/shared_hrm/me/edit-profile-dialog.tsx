"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { ShieldCheck, Lock, UserCog, Camera, Image as ImageIcon, Trash2, Mail, Smartphone, MapPin, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useRef } from "react";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: any;
    onSave: (data: any) => void;
}

export function EditProfileDialog({
    open,
    onOpenChange,
    initialData,
    onSave,
}: EditProfileDialogProps) {
    const [formData, setFormData] = useState(initialData);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev: any) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoRemove = () => {
        setFormData((prev: any) => ({ ...prev, avatar: "" }));
    };

    // Helper for Locked System Fields
    const LockedSystemField = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
        <div className="space-y-2 opacity-90">
            <Label className="text-[10px] uppercase text-slate-400 flex items-center gap-2 font-black tracking-widest leading-none">
                {label} <Lock size={10} className="text-amber-500" />
            </Label>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-500 font-bold cursor-not-allowed flex items-center gap-3">
                {icon && <span className="opacity-40">{icon}</span>}
                {value}
            </div>
        </div>
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-[45vw] p-0 border-l border-slate-200 shadow-2xl overflow-hidden flex flex-col sm:duration-500"
            >
                {/* Modern Mesh Gradient Header */}
                <div className="bg-[#0f172a] px-10 py-12 text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/30 blur-[100px] rounded-full -mr-20 -mt-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full -ml-20 -mb-20"></div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2.5 text-blue-400">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Profile Management</span>
                        </div>
                        <div>
                            <SheetTitle className="text-4xl font-black text-white tracking-tighter leading-tight">
                                Update Personal <br />Records
                            </SheetTitle>
                            <SheetDescription className="text-slate-400 mt-4 text-base font-medium leading-relaxed max-w-sm">
                                Keep your professional profile up-to-date. Note that identity fields are managed by IT.
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 hover-scroll bg-white">
                    <form onSubmit={handleSubmit} className="space-y-12 pb-10">
                        {/* Section: Photo Management */}
                        <div className="space-y-8">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Visual Identity
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center gap-10 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative group">
                                <div className="relative">
                                    <div className="p-1 bg-white rounded-3xl shadow-xl">
                                        <Avatar className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-white">
                                            <AvatarImage src={formData.avatar} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black capitalize">
                                                {formData.name?.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#0f172a] text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform"
                                    >
                                        <Camera size={18} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-5 text-center sm:text-start">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Profile Photo</h4>
                                        <p className="text-xs text-slate-500 font-bold">Max size 2MB. JPG or PNG only.</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-11 px-6 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 bg-white hover:bg-slate-50 shadow-sm"
                                        >
                                            <ImageIcon size={14} className="text-blue-500" />
                                            Change Photo
                                        </Button>
                                        {formData.avatar && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handlePhotoRemove}
                                                className="h-11 px-6 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-black text-[10px] uppercase tracking-widest gap-2"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Locked Core Identity */}
                        <div className="space-y-8">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Registry Locked Data
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <LockedSystemField label="Employee ID" value={formData.empId} />
                                <LockedSystemField label="Joining Date" value={formData.joiningDate} />
                                <LockedSystemField label="Primary Designation" value={formData.designation} />
                                <LockedSystemField label="Assigned Unit" value={formData.department} />
                                <div className="col-span-2">
                                    <LockedSystemField label="Corporate Email Address" value={formData.workEmail} icon={<Mail size={14} />} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Editable Professional Details */}
                        <div className="space-y-10">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> User Controllable Fields
                            </h3>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Preferred Display Name</Label>
                                    <div className="relative">
                                        <UserCog className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="h-14 pl-12 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="mobile" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Personal Mobile</Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => handleInputChange("mobile", e.target.value)}
                                                className="h-14 pl-12 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="personalEmail" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Personal Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <Input
                                                id="personalEmail"
                                                value={formData.personalEmail}
                                                onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                                                className="h-14 pl-12 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="location" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Working From</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            className="h-14 pl-12 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="bio" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Professional Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        className="h-40 resize-none bg-slate-50/50 border-slate-100 rounded-[1.8rem] focus:ring-2 focus:ring-blue-500/20 p-6 text-sm font-medium leading-relaxed shadow-sm text-slate-600"
                                        placeholder="Briefly describe your expertise..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Emergency Contacts */}
                        <div className="space-y-10 pb-10">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div> Safety & Emergency
                            </h3>

                            <div className="space-y-8 bg-rose-50/30 p-8 rounded-[2.5rem] border border-rose-100/50">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3 text-start">
                                        <Label htmlFor="emergencyName" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Emergency Contact Name</Label>
                                        <Input
                                            id="emergencyName"
                                            value={formData.emergencyName}
                                            onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                                            className="h-14 bg-white border-slate-100 rounded-2xl font-bold text-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-3 text-start">
                                        <Label htmlFor="relationship" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Relationship</Label>
                                        <Select
                                            value={formData.emergencyRelationship}
                                            onValueChange={(v) => handleInputChange("emergencyRelationship", v)}
                                        >
                                            <SelectTrigger id="relationship" className="h-14 bg-white border-slate-100 rounded-2xl font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                <SelectItem value="Spouse" className="font-bold">Spouse</SelectItem>
                                                <SelectItem value="Parent" className="font-bold">Parent</SelectItem>
                                                <SelectItem value="Sibling" className="font-bold">Sibling</SelectItem>
                                                <SelectItem value="Friend" className="font-bold">Friend</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-3 text-start">
                                    <Label htmlFor="emergencyMobile" className="text-[10px] uppercase text-slate-400 font-black tracking-widest ml-1">Emergency Phone</Label>
                                    <div className="relative">
                                        <Heart className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
                                        <Input
                                            id="emergencyMobile"
                                            value={formData.emergencyMobile}
                                            onChange={(e) => handleInputChange("emergencyMobile", e.target.value)}
                                            className="h-14 pl-12 bg-white border-slate-100 rounded-2xl font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <SheetFooter className="bg-slate-50 px-10 py-8 border-t border-slate-100 gap-4 shrink-0 sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-14 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 rounded-2xl h-14 px-12 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                    >
                        COMMIT UPDATES
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
