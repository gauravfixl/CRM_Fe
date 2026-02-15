"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Settings, Save, Clock, Calendar, ShieldCheck, GitBranch } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const TimeAttendSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("attendance-rules");
    const { toast } = useToast();

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Module Settings</h2>
                    <p className="text-slate-500 text-sm mt-1">Configure policies and rules for time, attendance, and leave.</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Settings Saved", description: "All configuration changes have been applied." })}>
                    <Save className="mr-2 h-4 w-4" /> Save All Changes
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Attendance Rules", "Leave Rules", "Shift Rules", "Approval Workflows"].map((tab) => (
                        <TabsTrigger
                            key={tab.toLowerCase().replace(" ", "-")}
                            value={tab.toLowerCase().replace(" ", "-")}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Attendance Rules Tab */}
                <TabsContent value="attendance-rules" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-[#6366f1]" /> Punctuality Rules
                                </CardTitle>
                                <CardDescription>Define late coming and early exit policies.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Late Coming Grace Period</Label>
                                        <p className="text-sm text-slate-500">Allow employees some extra time before marking late.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" className="w-20" defaultValue={15} />
                                        <span className="text-sm text-slate-500">Mins</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Mark Half Day After Late</Label>
                                        <p className="text-sm text-slate-500">Automatically mark half day if late by over 2 hours.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-[#6366f1]" /> Capture Methods
                                </CardTitle>
                                <CardDescription>Configure how attendance is captured.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">IP Restriction</Label>
                                        <p className="text-sm text-slate-500">Restrict attendance marking to office IP range.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Geo-fencing</Label>
                                        <p className="text-sm text-slate-500">Mark attendance only within 100m of office location.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Leave Rules Tab */}
                <TabsContent value="leave-rules" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#6366f1]" /> Global Leave Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Minimum Notice Period</Label>
                                    <p className="text-sm text-slate-500">Days required to apply for leave in advance.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input type="number" className="w-20" defaultValue={3} />
                                    <span className="text-sm text-slate-500">Days</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Allow Negative Balance</Label>
                                    <p className="text-sm text-slate-500">Allow employees to take more leave than then have.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Approval Workflows Tab */}
                <TabsContent value="approval-workflows" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <GitBranch className="h-5 w-5 text-[#6366f1]" /> Workflow Automation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-900">Standard Leave Approval</h4>
                                    <p className="text-sm text-slate-500">Reporting Manager → Department Head → HR Admin</p>
                                </div>
                                <Button variant="outline" size="sm">Modify</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-900">Automatic Approval (Regularization)</h4>
                                    <p className="text-sm text-slate-500">Approve automatically if regularization is within 30 mins.</p>
                                </div>
                                <Switch />
                            </div>
                            <Button className="w-full bg-indigo-50 text-[#6366f1] hover:bg-indigo-100 border border-indigo-200 shadow-none">
                                <GitBranch className="mr-2 h-4 w-4" /> Create New Workflow
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TimeAttendSettingsPage;
