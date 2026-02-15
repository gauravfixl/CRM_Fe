"use client";

import React, { useState } from "react";
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

export default function OrgProfilePage() {
    const [orgName, setOrgName] = useState("Acme Corp");
    const [description, setDescription] = useState("Leading provider of roadrunner catching equipment.");

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Updating organization profile...",
            success: "Profile updated successfully.",
            error: "Failed to update profile."
        });
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
                    <Button variant="outline" className="h-9 border-slate-200 font-bold rounded-none hover:bg-slate-100">
                        Cancel
                    </Button>
                    <Button
                        className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LOGO & IDENTITY */}
                <Card className="border-none shadow-md rounded-none hover:shadow-lg transition-shadow bg-white overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 w-full relative">
                        <div className="absolute bottom-0 left-0 p-6 translate-y-1/2">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-24 w-24 rounded-none border-4 border-white shadow-sm bg-white">
                                    <AvatarImage src="/placeholder-logo.png" />
                                    <AvatarFallback className="text-2xl font-black bg-slate-100 text-slate-400 rounded-none">AC</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <CardContent className="pt-16 p-6 space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Display Name</Label>
                                <Input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="font-bold text-lg rounded-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="text-sm rounded-none min-h-[100px] resize-none"
                                />
                                <p className="text-[10px] text-slate-400 text-right">0 / 250 characters</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CONTACT INFO */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-none">
                    <CardHeader className="border-b border-slate-100 p-6">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Public Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input className="pl-10 rounded-none font-medium" placeholder="contact@acme.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input className="pl-10 rounded-none font-medium" placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input className="pl-10 rounded-none font-medium text-blue-600 underline" placeholder="https://acme.com" />
                            </div>
                        </div>

                        <Separator className="md:col-span-2 my-2" />

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Headquarters Address</Label>
                            <Input className="rounded-none font-medium mb-2" placeholder="Street Address" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                <Input className="rounded-none font-medium" placeholder="City" />
                                <Input className="rounded-none font-medium" placeholder="State / Province" />
                                <Input className="rounded-none font-medium" placeholder="Zip / Postal" />
                                <Input className="rounded-none font-medium" placeholder="Country" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
