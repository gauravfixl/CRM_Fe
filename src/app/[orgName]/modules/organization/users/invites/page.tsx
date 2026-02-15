"use client";

import React, { useState } from "react";
import {
    Mail,
    Send,
    Trash2,
    RefreshCw,
    Clock,
    CheckCircle2,
    UserPlus,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const invites = [
    { id: "inv-1", email: "sarah.connor@example.com", role: "Viewer", sentAt: "2 hours ago", status: "Pending", expires: "48h" },
    { id: "inv-2", email: "kyle.reese@example.com", role: "Org Admin", sentAt: "1 day ago", status: "Pending", expires: "24h" },
    { id: "inv-3", email: "john.doe@external.com", role: "Editor", sentAt: "5 days ago", status: "Expired", expires: "Expired" },
];

export default function InvitesPage() {
    const [inviteList, setInviteList] = useState(invites);
    const [email, setEmail] = useState("");

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Sending invitation email...",
            success: `Invitation sent to ${email}`,
            error: "Failed to send invitation"
        });
        setEmail("");
    };

    const handleResend = (email: string) => {
        toast.success(`Invitation re-sent to ${email}`);
    };

    const handleRevoke = (id: string) => {
        setInviteList(prev => prev.filter(inv => inv.id !== id));
        toast.info("Invitation revoked successfully.");
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pending Invitations</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage outstanding access requests and user onboarding.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-200 rounded-none transition-all hover:translate-y-[-1px]">
                            <UserPlus className="w-4 h-4" />
                            Invite Users
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-none border-t-4 border-t-blue-600">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Send Invitation
                            </DialogTitle>
                            <DialogDescription>
                                Add a new member to your organization via email.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSendInvite} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-slate-500">Email Address</label>
                                <Input
                                    className="rounded-none font-medium"
                                    placeholder="colleague@company.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-slate-500">Assign Role</label>
                                <Select defaultValue="viewer">
                                    <SelectTrigger className="rounded-none font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="admin">Organization Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 font-bold rounded-none gap-2">
                                <Send className="w-4 h-4" /> Send Invite
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* INVITE LIST */}
            <div className="grid gap-4">
                {inviteList.length > 0 ? (
                    inviteList.map((inv) => (
                        <Card key={inv.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-none group">
                            <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between">
                                <div className="p-6 flex-1 flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${inv.status === 'Expired' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{inv.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[9px] uppercase font-bold rounded-none border-slate-200 text-slate-500">
                                                {inv.role}
                                            </Badge>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Sent {inv.sentAt}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:border-l border-slate-100 bg-slate-50/30 flex items-center gap-6 w-full md:w-auto justify-end">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[9px] uppercase font-bold text-slate-400">Expires In</p>
                                        <p className={`font-mono text-sm font-bold ${inv.status === 'Expired' ? 'text-red-500' : 'text-slate-700'}`}>{inv.expires}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 gap-2 rounded-none border-slate-200 font-bold hover:bg-white hover:text-blue-600"
                                            onClick={() => handleResend(inv.email)}
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            <span className="hidden lg:inline">Resend</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors"
                                            onClick={() => handleRevoke(inv.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-none">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm">No pending invitations. Everyone you've invited has already joined.</p>
                    </div>
                )}
            </div>

            {/* INVITE LINK CARD */}
            <Card className="border-blue-100 bg-blue-50/50 shadow-none rounded-none">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900">Quick Invite Link</h4>
                            <p className="text-xs text-blue-700 mt-1 max-w-md">
                                Anyone with this link can join as a <strong>Viewer</strong>.
                                This link expires in 7 days.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <Input
                            value="https://portal.fixl.io/join/org_882910"
                            readOnly
                            className="bg-white border-blue-200 font-mono text-sm h-10 w-full md:w-64 rounded-none text-slate-500"
                        />
                        <Button
                            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-none"
                            onClick={() => toast.success("Invite link copied to clipboard")}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function LinkIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
    )
}
