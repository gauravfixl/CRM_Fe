"use client";

import React, { useState, useEffect } from "react";
import {
    Mail,
    Send,
    Trash2,
    RefreshCw,
    Clock,
    CheckCircle2,
    UserPlus,
    Copy,
    LinkIcon,
    Loader2
} from "lucide-react";
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { getAllOrgInvites, createOrgInvite, declineOrgInvite } from "@/modules/crm/organizations/hooks/orgHooks";

export default function InvitesPage() {
    const [inviteList, setInviteList] = useState<any[]>([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchInvites = async () => {
        try {
            setLoading(true);
            const res = await getAllOrgInvites();
            setInviteList(res?.data?.invites || []);
        } catch (err) {
            console.error("Error fetching invites:", err);
            toast.error("Failed to fetch invitations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSending(true);
            await createOrgInvite({ email, role });
            toast.success(`Invitation sent to ${email}`);
            setEmail("");
            setRole("viewer");
            setDialogOpen(false);
            await fetchInvites();
        } catch (err: any) {
            console.error("Error sending invite:", err);
            toast.error(err?.response?.data?.message || "Failed to send invitation");
        } finally {
            setSending(false);
        }
    };

    const handleResend = async (inviteEmail: string) => {
        try {
            await createOrgInvite({ email: inviteEmail, role: "viewer" });
            toast.success(`Invitation re-sent to ${inviteEmail}`);
            await fetchInvites();
        } catch (err) {
            console.error("Error resending invite:", err);
            toast.error("Failed to resend invitation");
        }
    };

    const handleRevoke = async (token: string) => {
        try {
            await declineOrgInvite(token);
            toast.success("Invitation revoked successfully.");
            await fetchInvites();
        } catch (err) {
            console.error("Error revoking invite:", err);
            toast.error("Failed to revoke invitation");
        }
    };

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Pending Invitations"
                breadcrumbItems={[
                    { label: "Org Admins", href: "#" },
                    { label: "Org Staff", href: "#" },
                    { label: "Invitations", href: "#" }
                ]}
                rightControls={
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold shadow-xl border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Users
                            </CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                            <div className="h-2 bg-indigo-600 w-full" />
                            <div className="p-6 sm:p-8 space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        Send Invitation
                                    </DialogTitle>
                                    <DialogDescription className="font-medium text-zinc-500 pt-2">
                                        Add a new member to your organization via email.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSendInvite} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Email Address</label>
                                        <Input
                                            className="rounded-xl font-medium h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                            placeholder="colleague@company.com"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Assign Role</label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger className="rounded-xl font-medium h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-zinc-100 dark:border-zinc-800 shadow-xl">
                                                <SelectItem value="admin">Organization Admin</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <CustomButton type="submit" disabled={sending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 text-sm border-0">
                                        {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                        {sending ? "Sending..." : "Send Invite"}
                                    </CustomButton>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* INVITE LINK CARD */}
                <Card className="border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-none rounded-3xl">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 dark:text-indigo-400 tracking-tight text-lg">Quick Invite Link</h4>
                                <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-1 max-w-md font-medium">
                                    Anyone with this link can join as a <strong className="text-indigo-900 dark:text-indigo-400">Viewer</strong>.
                                    This link expires in 7 days.
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <Input
                                value="https://portal.fixl.io/join/org_882910"
                                readOnly
                                className="bg-white dark:bg-zinc-950 border-indigo-200 dark:border-indigo-900/50 font-mono text-sm h-12 w-full md:w-72 rounded-xl text-zinc-500 font-medium focus-visible:ring-0"
                            />
                            <CustomButton
                                className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl font-semibold border-0"
                                onClick={() => toast.success("Invite link copied to clipboard")}
                            >
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </CustomButton>
                        </div>
                    </CardContent>
                </Card>

                {/* INVITE LIST */}
                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium text-sm">Loading invitations...</p>
                        </div>
                    ) : inviteList.length > 0 ? (
                        inviteList.map((inv) => {
                            const isExpired = inv.status?.toLowerCase() === "expired";
                            const sentAt = inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "Unknown";
                            return (
                                <Card key={inv.token || inv._id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all rounded-3xl group overflow-hidden">
                                    <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between">
                                        <div className="p-6 flex-1 flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center border ${isExpired ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-900/50'}`}>
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">{inv.email}</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Badge className="text-[10px] uppercase font-semibold tracking-wider rounded-md border-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5">
                                                        {inv.role}
                                                    </Badge>
                                                    <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> Sent {sentAt}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 md:border-l border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-8 w-full md:w-auto justify-end">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">Status</p>
                                                <p className={`font-mono text-sm font-bold mt-1 ${isExpired ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'}`}>{inv.status || "Pending"}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <CustomButton
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-10 gap-2 rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-white dark:hover:bg-zinc-800 hover:text-indigo-600"
                                                    onClick={() => handleResend(inv.email)}
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    <span className="hidden lg:inline">Resend</span>
                                                </CustomButton>
                                                <CustomButton
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                                                    onClick={() => handleRevoke(inv.token)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </CustomButton>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">All caught up!</h3>
                            <p className="text-zinc-500 font-medium max-w-sm mx-auto mt-2 text-sm">No pending invitations. Everyone you've invited has already joined.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
