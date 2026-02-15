"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Megaphone, Pin, Clock, Eye, Send, MoreHorizontal, Plus, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore, type Announcement } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";

const AnnouncementsPage = () => {
    const [activeTab, setActiveTab] = useState("Active");
    const { toast } = useToast();
    const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useEngageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeAnn, setActiveAnn] = useState<Announcement | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "HR Department",
        priority: "Medium" as Announcement['priority'],
        pinned: false
    });

    const resetForm = () => {
        setFormData({ title: "", content: "", author: "HR Department", priority: "Medium", pinned: false });
        setActiveAnn(null);
    };

    const handleSave = () => {
        if (!formData.title || !formData.content) {
            toast({ title: "Error", description: "Title and Content are required.", variant: "destructive" });
            return;
        }

        if (activeAnn) {
            updateAnnouncement(activeAnn.id, formData);
            toast({ title: "Announcement Updated", description: "Changes saved successfully." });
        } else {
            addAnnouncement(formData);
            toast({ title: "Announcement Posted", description: "Successfully broadcasted to the team." });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (ann: Announcement) => {
        setActiveAnn(ann);
        setFormData({
            title: ann.title,
            content: ann.content,
            author: ann.author,
            priority: ann.priority,
            pinned: ann.pinned
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Permanently delete this announcement?")) {
            deleteAnnouncement(id);
            toast({ title: "Announcement Removed", variant: "destructive" });
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Announcements</h1>
                    <p className="text-slate-500 font-medium">Broadcast important news and updates to the entire organization.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" /> Post New Update
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                        <TabsTrigger value="Active" className="rounded-xl px-8 font-bold">Active</TabsTrigger>
                        <TabsTrigger value="Scheduled" className="rounded-xl px-8 font-bold">Scheduled</TabsTrigger>
                        <TabsTrigger value="Archived" className="rounded-xl px-8 font-bold">Archived</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="grid grid-cols-1 gap-6 m-0">
                        {announcements.filter(a => activeTab === 'all' || a.status === activeTab).map((ann) => (
                            <Card key={ann.id} className={`rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group relative transition-all hover:shadow-xl hover:shadow-purple-50 ${ann.pinned ? 'ring-2 ring-purple-100' : ''}`}>
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${ann.priority === "High" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                                                <Megaphone className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{ann.title}</h3>
                                                    {ann.pinned && (
                                                        <Badge className="bg-purple-50 text-[#CB9DF0] border-none rounded-lg h-6 px-2 gap-1 font-black text-[10px] uppercase">
                                                            <Pin className="h-3 w-3 fill-current" /> Pinned
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 tracking-tighter uppercase">
                                                        <Clock className="h-3.5 w-3.5" /> Published {ann.date}
                                                    </span>
                                                    <span className="text-xs font-black text-slate-400 italic">By {ann.author}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 text-slate-300 hover:text-slate-600">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 animate-in fade-in zoom-in duration-200">
                                                <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Broadcast Controls</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(ann)} className="rounded-xl font-bold h-11 px-3">
                                                    <Edit className="h-4 w-4 mr-2" /> Edit Content
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateAnnouncement(ann.id, { pinned: !ann.pinned })} className="rounded-xl font-bold h-11 px-3">
                                                    <Pin className="h-4 w-4 mr-2" /> {ann.pinned ? 'Unpin' : 'Pin to Top'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                <DropdownMenuItem onClick={() => handleDelete(ann.id)} className="rounded-xl font-bold h-11 px-3 text-red-600 focus:bg-red-50 focus:text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Post
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-slate-600 font-bold leading-relaxed max-w-4xl text-sm italic">
                                        "{ann.content}"
                                    </p>

                                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-slate-300" />
                                            <span className="text-xs font-black text-slate-400">{ann.views} Employee Views</span>
                                        </div>
                                        <Button variant="ghost" className="rounded-xl font-black text-[#CB9DF0] hover:bg-purple-50 tracking-tight">
                                            Acknowledge Receipt <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {announcements.filter(a => activeTab === 'all' || a.status === activeTab).length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3 border-2 border-dashed border-slate-100 rounded-[3rem]">
                                <Megaphone className="h-12 w-12 opacity-20" />
                                <p className="font-black text-xs uppercase tracking-widest italic">No announcements in this category</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Post/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">
                            {activeAnn ? "Edit update" : "New broadcast"}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Communication is the solvent of all problems.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Announcement Title</Label>
                            <Input
                                placeholder="Headline for the update"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Update Content</Label>
                            <Textarea
                                placeholder="What's the news?"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="rounded-[2rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold p-8 min-h-[180px] italic"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Priority Level</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, priority: val as any })} defaultValue={formData.priority}>
                                    <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Low">Low Priority</SelectItem>
                                        <SelectItem value="Medium">Medium Priority</SelectItem>
                                        <SelectItem value="High" className="text-red-600">High Priority</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Pinned to Top</Label>
                                <div className="flex items-center h-14 bg-slate-50 rounded-[1.25rem] px-6 gap-3">
                                    <input
                                        type="checkbox"
                                        id="pinned"
                                        checked={formData.pinned}
                                        onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                                        className="h-5 w-5 accent-[#CB9DF0] rounded-md transition-all"
                                    />
                                    <Label htmlFor="pinned" className="font-black text-slate-400 text-xs uppercase cursor-pointer">Always show first</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            {activeAnn ? "Publish Changes" : "Broadcast Now"}
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

export default AnnouncementsPage;
