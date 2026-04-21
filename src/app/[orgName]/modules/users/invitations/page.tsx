"use client";

import { useState, useEffect } from "react";
import {
    UserPlus,
    Mail,
    Search,
    Send,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    Link2,
    MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning, showError } from "@/utils/toast";
import { UserFormDialog } from "@/shared/components/rbac/UserFormDialog";
import { getAllOrgInvites, createOrgInvite, declineOrgInvite } from "@/modules/crm/organizations/hooks/orgHooks";

type Invitation = {
    id: string;
    email: string;
    role: string;
    status: "Pending" | "Expired" | "Accepted";
    sentDate: string;
    expiry: string;
    token?: string;
};

const ROLES = ["Manager", "Contributor", "Member", "Viewer"] as const;

const mapApiInviteToInvitation = (inv: any): Invitation => {
    const status: Invitation["status"] =
        inv.status === "accepted" || inv.status === "Accepted"
            ? "Accepted"
            : inv.status === "expired" || inv.status === "Expired"
                ? "Expired"
                : "Pending";
    const sentDate = inv.createdAt
        ? new Date(inv.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
        : inv.sentDate || "N/A";
    let expiry = "N/A";
    if (status === "Expired") {
        expiry = "Expired";
    } else if (status === "Pending" && inv.expiresAt) {
        const diff = new Date(inv.expiresAt).getTime() - Date.now();
        if (diff <= 0) expiry = "Expired";
        else if (diff < 3600000) expiry = `${Math.round(diff / 60000)}m left`;
        else if (diff < 86400000) expiry = `${Math.round(diff / 3600000)}h left`;
        else expiry = `${Math.round(diff / 86400000)}d left`;
    }
    return {
        id: inv._id || inv.id || String(Date.now()),
        email: inv.email || "",
        role: inv.role || "Member",
        status,
        sentDate,
        expiry,
        token: inv.token || inv._id || "",
    };
};

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Invitation | null>(null);
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState<string>("Member");

    const loadInvitations = async () => {
        try {
            setLoading(true);
            const res = await getAllOrgInvites();
            const data = res?.data || res || [];
            const invitesArray = Array.isArray(data) ? data : data.invites || data.invitations || [];
            setInvitations(invitesArray.map(mapApiInviteToInvitation));
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to load invitations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvitations();
    }, []);

    const filtered = invitations.filter((inv) =>
        inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalSent = invitations.length;
    const awaiting = invitations.filter((i) => i.status === "Pending").length;
    const accepted = invitations.filter((i) => i.status === "Accepted").length;
    const expired = invitations.filter((i) => i.status === "Expired").length;
    const acceptanceRate = totalSent > 0 ? Math.round((accepted / totalSent) * 100) : 0;

    const handleCreate = async () => {
        if (!newEmail.trim() || !newRole) {
            showWarning("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail.trim())) {
            showWarning("Please enter a valid email address");
            return;
        }
        try {
            const res = await createOrgInvite({ email: newEmail, role: newRole });
            const newInvite = res?.data;
            const invite: Invitation = newInvite
                ? mapApiInviteToInvitation(newInvite)
                : {
                    id: Date.now().toString(),
                    email: newEmail,
                    role: newRole,
                    status: "Pending",
                    sentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                    expiry: "24h left",
                };
            setInvitations((prev) => [...prev, invite]);
            setNewEmail("");
            setNewRole("");
            setCreateOpen(false);
            showSuccess(`Invitation sent to ${newEmail}`);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to send invitation");
        }
    };

    const handleResend = async (inv: Invitation) => {
        try {
            await createOrgInvite({ email: inv.email, role: inv.role });
            showSuccess(`Invitation resent to ${inv.email}`);
            await loadInvitations();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to resend invitation");
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await declineOrgInvite(deleteTarget.token || deleteTarget.id);
            setInvitations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
            showSuccess(`Invitation for ${deleteTarget.email} removed`);
            setDeleteTarget(null);
            setDeleteOpen(false);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to delete invitation");
        }
    };

    const handleCopyLink = () => {
        showSuccess("Signup link copied to clipboard");
    };

    const statusIcon = (status: string) => {
        if (status === "Pending") return <Clock className="w-3.5 h-3.5 text-orange-500" />;
        if (status === "Expired") return <XCircle className="w-3.5 h-3.5 text-red-500" />;
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
    };

    const statusColor = (status: string) => {
        if (status === "Pending") return "bg-orange-50 text-orange-700 border-orange-200";
        if (status === "Expired") return "bg-red-50 text-red-700 border-red-200";
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Pending invitations</h1>
                        <p className="text-xs text-gray-600 mt-1">Manage and track all sent invitations to your organization</p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-none"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create invite
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-none p-4">
                        <p className="text-xs text-gray-600">Total sent</p>
                        <p className="text-xl font-semibold text-primary mt-1">{totalSent}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Last 30 days</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-600">Awaiting accept</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{awaiting}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Pending response</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-600">Acceptance rate</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{acceptanceRate}%</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Overall ratio</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-600">Expired</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{expired}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">No longer valid</p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white border border-gray-200 rounded-none p-3 flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by email address..."
                        className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Recipient email</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Assigned role</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Sent date</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Expiry</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center">
                                        <p className="text-sm text-gray-500">Loading invitations...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center">
                                        <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">No invitations found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-none bg-primary/10 flex items-center justify-center">
                                                    <Mail className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{inv.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="rounded-none text-xs font-medium">
                                                {inv.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {statusIcon(inv.status)}
                                                <Badge variant="outline" className={`rounded-none text-xs font-medium ${statusColor(inv.status)}`}>
                                                    {inv.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{inv.sentDate}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm ${inv.status === "Expired" ? "text-red-600" : "text-gray-600"}`}>
                                                {inv.expiry}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none">
                                                    {inv.status !== "Accepted" && (
                                                        <DropdownMenuItem onClick={() => handleResend(inv)}>
                                                            <Send className="w-3.5 h-3.5 mr-2" />
                                                            Resend invitation
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={handleCopyLink}>
                                                        <Link2 className="w-3.5 h-3.5 mr-2" />
                                                        Copy signup link
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => { setDeleteTarget(inv); setDeleteOpen(true); }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                        Delete invitation
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invitation Dialog */}
            <UserFormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                mode="invite"
                onSuccess={() => {
                    // Reload invitations or refresh the list
                    window.location.reload()
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-6 py-4">
                        <h2 className="text-sm font-semibold text-white">Delete invitation</h2>
                        <p className="text-xs text-white/70 mt-0.5">This action cannot be undone</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to delete the invitation for{" "}
                            <span className="font-semibold">{deleteTarget?.email}</span>?
                        </p>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-none">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} variant="destructive" className="rounded-none">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
