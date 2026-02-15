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
        <div className="space-y-1.5 opacity-90">
            <Label className="text-[9px] uppercase text-slate-400 flex items-center gap-2 font-bold tracking-wider leading-none">
                {label} <Lock size={10} className="text-amber-500" />
            </Label>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-500 font-semibold cursor-not-allowed flex items-center gap-2.5">
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
                {/* Modern Light Gradient Header */}
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-8 py-10 relative overflow-hidden shrink-0 border-b border-indigo-100">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/30 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/30 blur-[80px] rounded-full -ml-20 -mb-20"></div>

                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                <ShieldCheck size={16} />
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest">Profile Management</span>
                        </div>
                        <div>
                            <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                                Update Personal Records
                            </SheetTitle>
                            <SheetDescription className="text-slate-600 mt-2 text-sm font-medium leading-relaxed max-w-sm">
                                Keep your professional profile up-to-date. Identity fields are managed by IT.
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 hover-scroll bg-gradient-to-br from-slate-50 to-indigo-50/30">
                    <form onSubmit={handleSubmit} className="space-y-8 pb-6">
                        {/* Section: Photo Management */}
                        <div className="space-y-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-6 rounded-2xl border border-blue-100/50">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2.5 pb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> Visual Identity
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-white/60 rounded-2xl border border-blue-100/30 relative group">
                                <div className="relative">
                                    <div className="p-1 bg-white rounded-2xl shadow-lg border border-slate-100">
                                        <Avatar className="w-24 h-24 rounded-xl border-2 border-white overflow-hidden bg-white">
                                            <AvatarImage src={formData.avatar} className="object-cover" />
                                            <AvatarFallback className="text-3xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold capitalize">
                                                {formData.name?.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1.5 -right-1.5 h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 transition-transform"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-3 text-center sm:text-start">
                                    <div className="space-y-0.5">
                                        <h4 className="text-base font-bold text-slate-900 tracking-tight">Profile Photo</h4>
                                        <p className="text-[10px] text-slate-500 font-semibold">Max size 2MB. JPG or PNG only.</p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
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
                                            className="h-9 px-5 rounded-lg border-slate-200 font-bold text-[9px] uppercase tracking-wider gap-2 bg-white hover:bg-slate-50 shadow-sm"
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
                                                className="h-9 px-5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-[9px] uppercase tracking-widest gap-2"
                                            >
                                                <Trash2 size={12} />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Locked Core Identity */}
                        <div className="space-y-5 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-6 rounded-2xl border border-amber-100/50">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2.5 pb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div> Registry Locked Data
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <LockedSystemField label="Employee ID" value={formData.empId} />
                                <LockedSystemField label="Joining Date" value={formData.joiningDate} />
                                <LockedSystemField label="Designation" value={formData.designation} />
                                <LockedSystemField label="Department" value={formData.department} />
                                <div className="md:col-span-2">
                                    <LockedSystemField label="Corporate Email" value={formData.workEmail} icon={<Mail size={12} />} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Editable Professional Details */}
                        <div className="space-y-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 rounded-2xl border border-indigo-100/50">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2.5 pb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div> User Controllable Fields
                            </h3>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Preferred Display Name</Label>
                                        <div className="relative">
                                            <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="h-12 pl-11 bg-white/60 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 font-semibold text-slate-700 placeholder:text-slate-300 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Working From</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange("location", e.target.value)}
                                                className="h-12 pl-11 bg-white/60 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 font-semibold text-slate-700 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Personal Mobile</Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <Input
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => handleInputChange("mobile", e.target.value)}
                                                className="h-12 pl-11 bg-white/60 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 font-semibold text-slate-700 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="personalEmail" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Personal Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <Input
                                                id="personalEmail"
                                                value={formData.personalEmail}
                                                onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                                                className="h-12 pl-11 bg-white/60 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500/10 font-semibold text-slate-700 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Professional Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange("bio", e.target.value)}
                                        className="h-32 resize-none bg-white/60 border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/10 p-5 text-sm font-medium leading-relaxed shadow-sm text-slate-600"
                                        placeholder="Briefly describe your expertise..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Emergency Contacts */}
                        <div className="space-y-5 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6 rounded-2xl border border-rose-100/50">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2.5 pb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div> Safety & Emergency
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="emergencyName" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Emergency Contact Name</Label>
                                    <Input
                                        id="emergencyName"
                                        value={formData.emergencyName}
                                        onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                                        className="h-12 bg-white/60 border-rose-100 rounded-xl font-semibold text-slate-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="relationship" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Relationship</Label>
                                    <Select
                                        value={formData.emergencyRelationship}
                                        onValueChange={(v) => handleInputChange("emergencyRelationship", v)}
                                    >
                                        <SelectTrigger id="relationship" className="h-12 bg-white/60 border-rose-100 rounded-xl font-semibold text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                            <SelectItem value="Spouse" className="font-semibold">Spouse</SelectItem>
                                            <SelectItem value="Parent" className="font-semibold">Parent</SelectItem>
                                            <SelectItem value="Sibling" className="font-semibold">Sibling</SelectItem>
                                            <SelectItem value="Friend" className="font-semibold">Friend</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="emergencyMobile" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Emergency Phone</Label>
                                    <div className="relative">
                                        <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={16} />
                                        <Input
                                            id="emergencyMobile"
                                            value={formData.emergencyMobile}
                                            onChange={(e) => handleInputChange("emergencyMobile", e.target.value)}
                                            className="h-12 pl-11 bg-white/60 border-rose-100 rounded-xl font-semibold text-slate-700 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Bank Details */}
                        <div className="space-y-5 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 rounded-2xl border border-emerald-100/50 pb-8">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2.5 pb-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> Financial Coordinates
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="bankName" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Bank Name</Label>
                                    <Input
                                        id="bankName"
                                        value={formData.bankName}
                                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                                        className="h-12 bg-white/60 border-emerald-100 rounded-xl font-semibold text-slate-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="accountNo" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Account Number</Label>
                                    <Input
                                        id="accountNo"
                                        value={formData.accountNo}
                                        onChange={(e) => handleInputChange("accountNo", e.target.value)}
                                        className="h-12 bg-white/60 border-emerald-100 rounded-xl font-semibold text-slate-700 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="ifsc" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">IFSC Code</Label>
                                    <Input
                                        id="ifsc"
                                        value={formData.ifsc}
                                        onChange={(e) => handleInputChange("ifsc", e.target.value)}
                                        className="h-12 bg-white/60 border-emerald-100 rounded-xl font-semibold text-slate-700 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-2 text-start">
                                    <Label htmlFor="pan" className="text-[9px] uppercase text-slate-400 font-bold tracking-wider ml-1">Tax PAN</Label>
                                    <Input
                                        id="pan"
                                        value={formData.pan}
                                        onChange={(e) => handleInputChange("pan", e.target.value)}
                                        className="h-12 bg-white/60 border-emerald-100 rounded-xl font-semibold text-slate-700 text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <SheetFooter className="bg-slate-50 px-8 py-6 border-t border-slate-100 gap-3 shrink-0 sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg h-11 px-6 font-bold text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-600"
                    >
                        Discard Changes
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/10 rounded-xl h-11 px-10 font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95"
                    >
                        COMMIT UPDATES
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
