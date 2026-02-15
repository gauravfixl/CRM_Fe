"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Building2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrgProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Organization Profile"
                breadcrumbItems={[
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Profile", href: "/modules/organization/profile" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">General Information</CardTitle>
                        <CardDescription>Official details about your registered organization.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Organization Name</Label>
                                <Input defaultValue="Acme Corp Global" className="rounded-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Industry</Label>
                                <Select defaultValue="tech">
                                    <SelectTrigger className="rounded-none">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tech">Technology & Services</SelectItem>
                                        <SelectItem value="fin">Finance</SelectItem>
                                        <SelectItem value="health">Healthcare</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea className="rounded-none h-24" placeholder="Brief description of your organization..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Tax ID / EIN</Label>
                                <Input placeholder="XX-XXXXXXX" className="rounded-none font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input placeholder="https://example.com" className="rounded-none" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
                        <CardDescription>Primary contact information for billing and support.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Primary Email</Label>
                                <Input type="email" placeholder="admin@acme.com" className="rounded-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input type="tel" placeholder="+1 (555) 000-0000" className="rounded-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Address</Label>
                                <Input placeholder="123 Corporate Blvd" className="rounded-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input placeholder="Metropolis" className="rounded-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select defaultValue="us">
                                    <SelectTrigger className="rounded-none">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="in">India</SelectItem>
                                        <SelectItem value="ae">UAE</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
