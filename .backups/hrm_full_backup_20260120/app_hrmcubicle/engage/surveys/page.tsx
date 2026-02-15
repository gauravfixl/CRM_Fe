"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ClipboardList, Plus, BarChart, Send, Layers, History, MoreHorizontal, Trash2, Edit, Calendar } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore, type Survey } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";

const SurveysPage = () => {
    const [activeTab, setActiveTab] = useState("Active");
    const { toast } = useToast();
    const { surveys, addSurvey, updateSurvey, deleteSurvey } = useEngageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        endDate: ""
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", endDate: "" });
        setActiveSurvey(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.endDate) {
            toast({ title: "Error", description: "Title and End Date are required.", variant: "destructive" });
            return;
        }

        if (activeSurvey) {
            updateSurvey(activeSurvey.id, formData);
            toast({ title: "Survey Updated" });
        } else {
            addSurvey(formData);
            toast({ title: "Survey Created", description: "The survey is now live and collecting responses." });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (survey: Survey) => {
        setActiveSurvey(survey);
        setFormData({
            title: survey.title,
            description: survey.description,
            endDate: survey.endDate
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Permanently delete this survey and all responses?")) {
            deleteSurvey(id);
            toast({ title: "Survey Deleted", variant: "destructive" });
        }
    };

    const StatusBadge = ({ status }: { status: Survey['status'] }) => {
        const styles: Record<string, string> = {
            "Active": "bg-emerald-100 text-emerald-700",
            "Draft": "bg-amber-100 text-amber-700",
            "Closed": "bg-slate-100 text-slate-600"
        };
        return <Badge className={`border-none font-bold rounded-lg px-3 ${styles[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employee Surveys</h1>
                    <p className="text-slate-500 font-medium">Measure sentiment and gather valuable employee feedback.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" /> Launch New Survey
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 flex-1 flex flex-col">
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12 w-fit">
                    <TabsTrigger value="Active" className="rounded-xl px-8 font-bold">Live Surveys</TabsTrigger>
                    <TabsTrigger value="Draft" className="rounded-xl px-8 font-bold">Drafts</TabsTrigger>
                    <TabsTrigger value="Closed" className="rounded-xl px-8 font-bold">Closed</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-0 flex-1 h-auto">
                    {surveys.filter(s => s.status === activeTab).map((survey) => (
                        <Card key={survey.id} className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl hover:shadow-purple-50 transition-all group overflow-hidden flex flex-col">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <StatusBadge status={survey.status} />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 text-slate-300 hover:text-slate-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                                            <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Survey Management</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEdit(survey)} className="rounded-xl font-bold h-11 px-3">
                                                <Edit className="h-4 w-4 mr-2" /> Modify Survey
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">
                                                <BarChart className="h-4 w-4 mr-2" /> View Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                            <DropdownMenuItem onClick={() => handleDelete(survey.id)} className="rounded-xl font-bold h-11 px-3 text-red-600 focus:bg-red-50 focus:text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete Survey
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{survey.title}</h3>
                                <p className="text-slate-500 font-medium text-sm mt-3 line-clamp-2 italic">"{survey.description}"</p>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                                <div className="mt-auto space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                            <span>Responses</span>
                                            <span className="text-slate-900">{survey.responses}</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${survey.status === 'Active' ? 'bg-[#CB9DF0]' : 'bg-slate-200'} rounded-full transition-all duration-1000`}
                                                style={{ width: `${Math.min(100, (survey.responses / 200) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-tighter">
                                            <Calendar className="h-4 w-4" /> Ends: {survey.endDate}
                                        </div>
                                        <Button variant="ghost" className="rounded-xl font-black text-purple-600 hover:bg-purple-50 tracking-tight text-xs">
                                            Preview Survey <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {surveys.filter(s => s.status === activeTab).length === 0 && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-300 gap-3 border-2 border-dashed border-slate-100 rounded-[3rem]">
                            <ClipboardList className="h-12 w-12 opacity-20" />
                            <p className="font-black text-xs uppercase tracking-widest italic">No {activeTab.toLowerCase()} surveys found</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Design Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">
                            {activeSurvey ? "Edit survey" : "New survey"}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Understanding your team is the key to collective growth.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Survey Title</Label>
                            <Input
                                placeholder="What is this survey about?"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Objective / Description</Label>
                            <Textarea
                                placeholder="Tell the employees why this survey is important..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="rounded-[2rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold p-8 min-h-[140px] italic"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">End Date</Label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            {activeSurvey ? "Save Changes" : "Launch Survey"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
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

export default SurveysPage;
