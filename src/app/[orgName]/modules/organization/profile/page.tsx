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
        <div className="flex flex-col min-h-screen bg-background">
            <SubHeader
                title="Organization Profile"
                breadcrumbItems={[
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Profile", href: "/modules/organization/profile" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-xl border border-border shadow-sm bg-card">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold text-foreground">General Information</CardTitle>
                        <CardDescription className="text-muted-foreground">Official details about your registered organization.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-foreground">Organization Name</Label>
                                <Input defaultValue="Acme Corp Global" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Industry</Label>
                                <Select defaultValue="tech">
                                    <SelectTrigger className="rounded-md border-border bg-background text-foreground">
                                        <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="tech">Technology & Services</SelectItem>
                                        <SelectItem value="fin">Finance</SelectItem>
                                        <SelectItem value="health">Healthcare</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-foreground">Description</Label>
                                <Textarea className="rounded-md border-border bg-background text-foreground h-24" placeholder="Brief description of your organization..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Tax ID / EIN</Label>
                                <Input placeholder="XX-XXXXXXX" className="rounded-md border-border bg-background text-foreground font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Website</Label>
                                <Input placeholder="https://example.com" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border border-border shadow-sm bg-card">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold text-foreground">Contact Details</CardTitle>
                        <CardDescription className="text-muted-foreground">Primary contact information for billing and support.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-foreground">Primary Email</Label>
                                <Input type="email" placeholder="admin@acme.com" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Phone Number</Label>
                                <Input type="tel" placeholder="+1 (555) 000-0000" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-foreground">Address</Label>
                                <Input placeholder="123 Corporate Blvd" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">City</Label>
                                <Input placeholder="Metropolis" className="rounded-md border-border bg-background text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-foreground">Country</Label>
                                <Select defaultValue="us">
                                    <SelectTrigger className="rounded-md border-border bg-background text-foreground">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
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
