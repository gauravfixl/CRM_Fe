"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { GraduationCap, History, User2, UserCheck, Calendar, Star, FileText, Plus, Rocket, Timer, ChevronRight, MoreHorizontal } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Appraisal } from "@/shared/data/performance-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

const PerformanceAppraisalsPage = () => {
    const [activeTab, setActiveTab] = useState("current-cycle");
    const { toast } = useToast();
    const { appraisals, addAppraisal, updateAppraisal } = usePerformanceStore();
    const [isLaunchOpen, setIsLaunchOpen] = useState(false);

    const [formData, setFormData] = useState({
        employeeName: "",
        cycle: "Annual Appraisal 2024"
    });

    const handleLaunch = () => {
        if (!formData.employeeName) {
            toast({ title: "Error", description: "Employee name is required.", variant: "destructive" });
            return;
        }
        addAppraisal(formData);
        toast({ title: "Appraisal Launched", description: `Cycle started for ${formData.employeeName}.` });
        setIsLaunchOpen(false);
        setFormData({ employeeName: "", cycle: "Annual Appraisal 2024" });
    };

    const StatusBadge = ({ status }: { status: Appraisal['status'] }) => {
        const styles: Record<string, string> = {
            "Draft": "bg-slate-100 text-slate-600",
            "Self Review": "bg-blue-100 text-blue-700",
            "Manager Review": "bg-purple-100 text-purple-700",
            "Completed": "bg-emerald-100 text-emerald-700"
        };
        return <Badge className={`border-none font-bold rounded-lg px-3 ${styles[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Appraisals</h1>
                    <p className="text-slate-500 font-medium italic">"Evaluation is the first step toward evolution."</p>
                </div>
                <Button
                    onClick={() => setIsLaunchOpen(true)}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Rocket className="mr-2 h-5 w-5" /> Launch Appraisal Cycle
                </Button>
            </div>

            {/* Stats / Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-indigo-600 p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Timer className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs opacity-80">Current Cycle</span>
                        </div>
                        <h2 className="text-3xl font-black mb-2">Annual Appraisal 2023-24</h2>
                        <p className="text-white/70 font-bold mb-8">Period: Apr 2023 - Mar 2024</p>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-black italic">
                                <span>Overall Completion</span>
                                <span>65%</span>
                            </div>
                            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-purple-50 flex flex-col justify-center p-8 hover:scale-[1.02] transition-transform cursor-pointer">
                        <Star className="h-8 w-8 text-purple-600 mb-4" />
                        <span className="text-3xl font-black text-purple-900">12 Days</span>
                        <span className="text-purple-600/60 font-black text-xs uppercase tracking-widest mt-1">Remaining</span>
                    </Card>
                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-blue-50 flex flex-col justify-center p-8 hover:scale-[1.02] transition-transform cursor-pointer">
                        <UserCheck className="h-8 w-8 text-blue-600 mb-4" />
                        <span className="text-3xl font-black text-blue-900">{appraisals.length}</span>
                        <span className="text-blue-600/60 font-black text-xs uppercase tracking-widest mt-1">Evaluations</span>
                    </Card>
                </div>
            </div>

            {/* Tabs & List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-8 pt-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="current-cycle" className="rounded-xl px-6 font-bold">In Progress</TabsTrigger>
                            <TabsTrigger value="completed" className="rounded-xl px-6 font-bold">Completed</TabsTrigger>
                            <TabsTrigger value="self-appraisal" className="rounded-xl px-6 font-bold">Self Assessments</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-900 h-14 pl-8">Employee</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Appraisal Cycle</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Status</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Rating</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14 pr-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appraisals.filter(a => activeTab === 'completed' ? a.status === 'Completed' : a.status !== 'Completed').map((appraisal) => (
                                    <TableRow key={appraisal.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                    <User2 className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900">{appraisal.employeeName}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold italic">Last updated {appraisal.lastUpdated}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <span className="font-bold text-slate-700 text-sm italic">{appraisal.cycle}</span>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <StatusBadge status={appraisal.status} />
                                        </TableCell>
                                        <TableCell className="py-5">
                                            {appraisal.rating ? (
                                                <div className="flex items-center gap-1.5 font-black text-slate-900">
                                                    <span className="text-emerald-600">{appraisal.rating}</span>
                                                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 font-bold uppercase tracking-tighter">Not rated</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="pr-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:text-slate-600">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 animate-in fade-in zoom-in duration-200">
                                                    <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Quick Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Share Feedback</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Download PDF</DropdownMenuItem>
                                                    {appraisal.status !== 'Completed' && (
                                                        <>
                                                            <DropdownMenuTrigger className="bg-slate-50 my-2" />
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    updateAppraisal(appraisal.id, { status: 'Completed', rating: 4.5 });
                                                                    toast({ title: "Cycle Completed", description: `Appraisal finalized for ${appraisal.employeeName}.` });
                                                                }}
                                                                className="rounded-xl font-black h-11 px-3 text-emerald-600 focus:bg-emerald-50"
                                                            >
                                                                Complete Appraisal
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Launch Dialog */}
            <Dialog open={isLaunchOpen} onOpenChange={setIsLaunchOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Launch Cycle</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Initialize a new performance review for an employee.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Employee Name</Label>
                            <Input
                                placeholder="Enter full name"
                                value={formData.employeeName}
                                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Appraisal Cycle Name</Label>
                            <Select
                                value={formData.cycle}
                                onValueChange={(val) => setFormData({ ...formData, cycle: val })}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="Annual Appraisal 2024" className="rounded-xl h-11">Annual Appraisal 2024</SelectItem>
                                    <SelectItem value="Mid-Year Review 2024" className="rounded-xl h-11">Mid-Year Review 2024</SelectItem>
                                    <SelectItem value="Q2 Performance Review" className="rounded-xl h-11">Q2 Performance Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleLaunch}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            Launch Now
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsLaunchOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PerformanceAppraisalsPage;
