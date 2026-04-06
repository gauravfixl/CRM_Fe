"use client"

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Settings, Save, Clock, Calendar, ShieldCheck, GitBranch } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    getActiveAttendancePolicy,
    getActiveShifts,
    getHolidaysByYear,
    upsertAttendancePolicy,
} from "@/modules/hrm/hooks/hrmHooks";

const TimeAttendSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("attendance-rules");
    const { toast } = useToast();

    // Settings state
    const [gracePeriod, setGracePeriod] = useState(15);
    const [halfDayAfterLate, setHalfDayAfterLate] = useState(true);
    const [ipRestriction, setIpRestriction] = useState(true);
    const [geoFencing, setGeoFencing] = useState(false);
    const [noticePeriod, setNoticePeriod] = useState(3);
    const [negativeBalance, setNegativeBalance] = useState(false);
    const [autoApproval, setAutoApproval] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Workflow dialog state
    const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
    const [workflowName, setWorkflowName] = useState("");
    const [workflowSteps, setWorkflowSteps] = useState("");

    const [workflows, setWorkflows] = useState([
        { id: "WF-01", name: "Standard Leave Approval", steps: "Reporting Manager → Department Head → HR Admin" },
    ]);
    const [shiftCount, setShiftCount] = useState(0);
    const [holidayCount, setHolidayCount] = useState(0);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [policyRes, shiftsRes, holidaysRes] = await Promise.all([
                    getActiveAttendancePolicy().catch(() => null),
                    getActiveShifts().catch(() => null),
                    getHolidaysByYear(new Date().getFullYear()).catch(() => null),
                ]);
                const policy = policyRes?.data?.data;
                if (policy) {
                    setGracePeriod(Number(policy?.lateAllowedMinutes ?? 15));
                    setHalfDayAfterLate(Boolean(policy?.halfDayThresholdMinutes));
                    setIpRestriction(Boolean(policy?.allowLatePunch ?? true));
                    setGeoFencing(Boolean(policy?.allowEarlyPunch ?? false));
                    setNegativeBalance(Boolean(policy?.allowBackdatedRegularization ?? false));
                }
                setShiftCount(Array.isArray(shiftsRes?.data?.data) ? shiftsRes.data.data.length : 0);
                setHolidayCount(Array.isArray(holidaysRes?.data?.data) ? holidaysRes.data.data.length : 0);
            } catch {
                // keep local defaults
            }
        };
        loadSettings();
    }, []);

    const handleSaveAll = () => {
        setIsSaving(true);
        (async () => {
            try {
                await upsertAttendancePolicy({
                    lateAllowedMinutes: gracePeriod,
                    halfDayThresholdMinutes: halfDayAfterLate ? 240 : 0,
                    absentThresholdMinutes: 480,
                    allowEarlyPunch: geoFencing,
                    allowLatePunch: ipRestriction,
                    allowBackdatedRegularization: negativeBalance,
                    maxBackdateDays: noticePeriod,
                });
                toast({
                    title: "Settings Saved Successfully",
                    description: `Policy updated. Active shifts: ${shiftCount}, holidays this year: ${holidayCount}.`,
                    className: "bg-emerald-50 border-emerald-100 text-emerald-800"
                });
            } catch {
                toast({
                    title: "Save failed",
                    description: "Could not save policy on backend",
                    variant: "destructive",
                });
            } finally {
                setIsSaving(false);
            }
        })();
    };

    const handleOpenWorkflowDialog = (workflow?: any) => {
        if (workflow) {
            setEditingWorkflow(workflow);
            setWorkflowName(workflow.name);
            setWorkflowSteps(workflow.steps);
        } else {
            setEditingWorkflow(null);
            setWorkflowName("");
            setWorkflowSteps("");
        }
        setIsWorkflowDialogOpen(true);
    };

    const handleSaveWorkflow = () => {
        if (!workflowName || !workflowSteps) {
            toast({ title: "Incomplete", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }
        if (editingWorkflow) {
            setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? { ...w, name: workflowName, steps: workflowSteps } : w));
            toast({ title: "Workflow Updated", description: `"${workflowName}" has been modified.` });
        } else {
            const newWorkflow = { id: `WF-0${workflows.length + 1}`, name: workflowName, steps: workflowSteps };
            setWorkflows(prev => [...prev, newWorkflow]);
            toast({ title: "Workflow Created", description: `"${workflowName}" is now active.` });
        }
        setIsWorkflowDialogOpen(false);
        setEditingWorkflow(null);
        setWorkflowName("");
        setWorkflowSteps("");
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Module Settings</h2>
                    <p className="text-slate-500 text-sm mt-1">Configure policies and rules for time, attendance, and leave. Active shifts: {shiftCount} | Holidays: {holidayCount}</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" disabled={isSaving} onClick={handleSaveAll}>
                    <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save All Changes"}
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
                                        <Input type="number" className="w-20 border border-slate-200" value={gracePeriod} onChange={(e) => setGracePeriod(Number(e.target.value))} />
                                        <span className="text-sm text-slate-500">Mins</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Mark Half Day After Late</Label>
                                        <p className="text-sm text-slate-500">Automatically mark half day if late by over 2 hours.</p>
                                    </div>
                                    <Switch checked={halfDayAfterLate} onCheckedChange={setHalfDayAfterLate} />
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
                                    <Switch checked={ipRestriction} onCheckedChange={setIpRestriction} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Geo-fencing</Label>
                                        <p className="text-sm text-slate-500">Mark attendance only within 100m of office location.</p>
                                    </div>
                                    <Switch checked={geoFencing} onCheckedChange={setGeoFencing} />
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
                                    <Input type="number" className="w-20 border border-slate-200" value={noticePeriod} onChange={(e) => setNoticePeriod(Number(e.target.value))} />
                                    <span className="text-sm text-slate-500">Days</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Allow Negative Balance</Label>
                                    <p className="text-sm text-slate-500">Allow employees to take more leave than then have.</p>
                                </div>
                                <Switch checked={negativeBalance} onCheckedChange={setNegativeBalance} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shift Rules Tab */}
                <TabsContent value="shift-rules" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-[#6366f1]" /> Shift Configuration
                                </CardTitle>
                                <CardDescription>Define shift timings and rotation rules.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Default Shift Start</Label>
                                        <p className="text-sm text-slate-500">Standard start time for the default shift.</p>
                                    </div>
                                    <Input type="time" defaultValue="09:00" className="w-32 border border-slate-200" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Default Shift End</Label>
                                        <p className="text-sm text-slate-500">Standard end time for the default shift.</p>
                                    </div>
                                    <Input type="time" defaultValue="18:00" className="w-32 border border-slate-200" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Minimum Break Duration</Label>
                                        <p className="text-sm text-slate-500">Minimum break time between shifts (in minutes).</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" defaultValue={60} className="w-20 border border-slate-200" />
                                        <span className="text-sm text-slate-500">Mins</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-[#6366f1]" /> Rotation & Allowances
                                </CardTitle>
                                <CardDescription>Configure shift rotation and allowance rules.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Enable Shift Rotation</Label>
                                        <p className="text-sm text-slate-500">Automatically rotate shifts on a weekly basis.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Night Shift Allowance</Label>
                                        <p className="text-sm text-slate-500">Enable additional allowance for night shift employees.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
                            {workflows.map((wf) => (
                                <div key={wf.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-slate-900">{wf.name}</h4>
                                        <p className="text-sm text-slate-500">{wf.steps}</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handleOpenWorkflowDialog(wf)}>Modify</Button>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-900">Automatic Approval (Regularization)</h4>
                                    <p className="text-sm text-slate-500">Approve automatically if regularization is within 30 mins.</p>
                                </div>
                                <Switch checked={autoApproval} onCheckedChange={setAutoApproval} />
                            </div>
                            <Button className="w-full bg-indigo-50 text-[#6366f1] hover:bg-indigo-100 border border-indigo-200 shadow-none" onClick={() => handleOpenWorkflowDialog()}>
                                <GitBranch className="mr-2 h-4 w-4" /> Create New Workflow
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Workflow Create/Edit Dialog */}
            <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-2xl p-8 bg-white border-2 border-slate-200 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {editingWorkflow ? "Edit Workflow" : "Create New Workflow"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Define the approval chain for this workflow.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label className="font-semibold text-slate-700">Workflow Name</Label>
                            <Input
                                placeholder="e.g. Overtime Approval"
                                value={workflowName}
                                onChange={(e) => setWorkflowName(e.target.value)}
                                className="h-11 rounded-lg border border-slate-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="font-semibold text-slate-700">Approval Steps</Label>
                            <Input
                                placeholder="e.g. Manager → HR → Director"
                                value={workflowSteps}
                                onChange={(e) => setWorkflowSteps(e.target.value)}
                                className="h-11 rounded-lg border border-slate-200"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsWorkflowDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={handleSaveWorkflow}>
                            {editingWorkflow ? "Save Changes" : "Create Workflow"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TimeAttendSettingsPage;
