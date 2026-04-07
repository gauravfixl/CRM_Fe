"use client";

import React, { useState, useMemo } from "react";
import {
    Bell,
    Plus,
    Mail,
    MessageSquare,
    Smartphone,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Users,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { showSuccess, showWarning } from "@/utils/toast";

const TRIGGER_OPTIONS = [
    { value: "lead-assigned", label: "Lead Assigned" },
    { value: "task-due", label: "Task Due in 24h" },
    { value: "deal-won", label: "Deal Closed Won" },
    { value: "leave-submitted", label: "Leave Submitted" },
];

const RECIPIENT_OPTIONS = [
    { value: "sales-team", label: "Sales Team" },
    { value: "task-owner", label: "Task Owner" },
    { value: "all-sales", label: "All Sales" },
    { value: "manager", label: "Manager" },
];

const CHANNEL_OPTIONS = ["Email", "SMS", "In-App", "Slack"];

type NotificationRule = {
    id: string;
    name: string;
    trigger: string;
    channels: string[];
    recipients: string;
    status: string;
};

type FormErrors = {
    name?: string;
    trigger?: string;
    channels?: string;
    recipients?: string;
};

export default function NotificationRulesPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newRule, setNewRule] = useState<{ name: string; trigger: string; channels: string[]; recipients: string }>({
        name: "",
        trigger: "",
        channels: [],
        recipients: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editRule, setEditRule] = useState<{ id: string; name: string; trigger: string; channels: string[]; recipients: string }>({
        id: "",
        name: "",
        trigger: "",
        channels: [],
        recipients: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
        { id: "1", name: "New Lead Assignment", trigger: "Lead Assigned", channels: ["Email", "In-App"], recipients: "Sales Team", status: "Active" },
        { id: "2", name: "Task Deadline Alert", trigger: "Task Due in 24h", channels: ["Email", "SMS"], recipients: "Task Owner", status: "Active" },
        { id: "3", name: "Deal Won Celebration", trigger: "Deal Closed Won", channels: ["In-App", "Slack"], recipients: "All Sales", status: "Active" },
        { id: "4", name: "Leave Request Notification", trigger: "Leave Submitted", channels: ["Email"], recipients: "Manager", status: "Paused" },
    ]);

    const filteredRules = useMemo(() => {
        return notificationRules.filter((rule) => {
            const matchesSearch =
                searchQuery === "" ||
                rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rule.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
                rule.recipients.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || rule.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [notificationRules, searchQuery, statusFilter]);

    const toggleStatus = (id: string) => {
        setNotificationRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, status: rule.status === "Active" ? "Paused" : "Active" } : rule
        ));
    };

    const deleteRule = (id: string) => {
        const rule = notificationRules.find(r => r.id === id);
        if (!rule) return;
        const confirmed = window.confirm(`Are you sure you want to delete "${rule.name}"? This action cannot be undone.`);
        if (!confirmed) return;
        setNotificationRules(prev => prev.filter(r => r.id !== id));
        showSuccess(`Rule "${rule.name}" deleted successfully`);
    };

    const getTriggerLabel = (value: string) => {
        return TRIGGER_OPTIONS.find(t => t.value === value)?.label || value;
    };

    const getRecipientLabel = (value: string) => {
        return RECIPIENT_OPTIONS.find(r => r.value === value)?.label || value;
    };

    const getTriggerValue = (label: string) => {
        return TRIGGER_OPTIONS.find(t => t.label === label)?.value || "";
    };

    const getRecipientValue = (label: string) => {
        return RECIPIENT_OPTIONS.find(r => r.label === label)?.value || "";
    };

    const toggleChannel = (channel: string, isCreate: boolean) => {
        if (isCreate) {
            setNewRule(prev => ({
                ...prev,
                channels: prev.channels.includes(channel)
                    ? prev.channels.filter(c => c !== channel)
                    : [...prev.channels, channel],
            }));
        } else {
            setEditRule(prev => ({
                ...prev,
                channels: prev.channels.includes(channel)
                    ? prev.channels.filter(c => c !== channel)
                    : [...prev.channels, channel],
            }));
        }
    };

    const handleCreate = () => {
        const errors: FormErrors = {};
        const sanitizedName = newRule.name.trim();

        if (!sanitizedName) {
            errors.name = "Rule name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Rule name cannot contain numbers";
        }

        if (!newRule.trigger) errors.trigger = "Trigger event is required";
        if (newRule.channels.length === 0) errors.channels = "At least one channel is required";
        if (!newRule.recipients) errors.recipients = "Recipients is required";

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }

        const rule: NotificationRule = {
            id: Date.now().toString(),
            name: sanitizedName,
            trigger: getTriggerLabel(newRule.trigger),
            channels: [...newRule.channels],
            recipients: getRecipientLabel(newRule.recipients),
            status: "Active",
        };

        setNotificationRules(prev => [...prev, rule]);
        setNewRule({ name: "", trigger: "", channels: [], recipients: "" });
        setFormErrors({});
        setShowCreateModal(false);
        showSuccess(`Rule "${rule.name}" created successfully`);
    };

    const openEdit = (rule: NotificationRule) => {
        setEditRule({
            id: rule.id,
            name: rule.name,
            trigger: getTriggerValue(rule.trigger) || rule.trigger,
            channels: [...rule.channels],
            recipients: getRecipientValue(rule.recipients) || rule.recipients,
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        const errors: FormErrors = {};
        const sanitizedName = editRule.name.trim();

        if (!sanitizedName) {
            errors.name = "Rule name is required";
        } else if (/\d/.test(sanitizedName)) {
            errors.name = "Rule name cannot contain numbers";
        }

        if (!editRule.trigger) errors.trigger = "Trigger event is required";
        if (editRule.channels.length === 0) errors.channels = "At least one channel is required";
        if (!editRule.recipients) errors.recipients = "Recipients is required";

        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            showWarning(errors.name || "Please fill in all required fields");
            return;
        }

        setNotificationRules(prev =>
            prev.map(rule =>
                rule.id === editRule.id
                    ? {
                          ...rule,
                          name: sanitizedName,
                          trigger: getTriggerLabel(editRule.trigger),
                          channels: [...editRule.channels],
                          recipients: getRecipientLabel(editRule.recipients),
                      }
                    : rule
            )
        );
        setShowEditModal(false);
        setEditFormErrors({});
        showSuccess(`Rule "${sanitizedName}" updated successfully`);
    };

    const testNotification = (rule: NotificationRule) => {
        showSuccess(`Test notification sent for "${rule.name}"`);
    };

    const cycleStatusFilter = () => {
        setStatusFilter(prev => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Paused";
            return "All";
        });
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case "Email": return <Mail size={12} />;
            case "SMS": return <Smartphone size={12} />;
            case "In-App": return <Bell size={12} />;
            case "Slack": return <MessageSquare size={12} />;
            default: return <Bell size={12} />;
        }
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Notification Rules</h1>
                    <p className="text-sm text-gray-600">Configure automated notifications across multiple channels.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewRule({ name: "", trigger: "", channels: [], recipients: "" });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create Rule
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Active Rules</p>
                    <p className="text-white text-xl font-semibold mt-1">{notificationRules.filter(r => r.status === "Active").length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Currently running</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Notifications Sent</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">12,450</p>
                    <p className="text-primary text-[10px] mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Delivery Rate</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">99.2%</p>
                    <p className="text-green-600 text-[10px] mt-1">Excellent</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Open Rate</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">68.5%</p>
                    <p className="text-primary text-[10px] mt-1">Above average</p>
                </div>
            </div>

            {/* Rules List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search notification rules..."
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={cycleStatusFilter}
                            className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                            {statusFilter !== "All" && (
                                <Badge className={`${statusFilter === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 ml-1`}>
                                    {statusFilter}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Rule Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Trigger Event</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Channels</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Recipients</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredRules.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-zinc-100 rounded-full">
                                                <Bell size={24} className="text-zinc-400" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-500">No notification rules found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Create your first notification rule to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                    <Bell size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{rule.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{rule.trigger}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {rule.channels.map((channel, idx) => (
                                                    <Badge key={idx} className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                                                        {getChannelIcon(channel)} {channel}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <Users size={12} /> {rule.recipients}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={rule.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(rule.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${rule.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {rule.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                    <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(rule)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Edit size={14} /> Edit Rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => testNotification(rule)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Bell size={14} /> Test Notification
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteRule(rule.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Delete
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

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredRules.length} of {notificationRules.length} notification rules</p>
                    <Button variant="link" className="text-primary text-sm flex items-center gap-1 group">
                        View Analytics <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Plus size={16} /> Create Notification Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Set up automated notifications for your team.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Rule Name</Label>
                            <Input
                                placeholder="e.g., New Lead Assignment"
                                className={`rounded-none border-zinc-200 h-9 text-sm ${formErrors.name ? "border-red-500" : ""}`}
                                value={newRule.name}
                                onChange={(e) => {
                                    setNewRule(prev => ({ ...prev, name: e.target.value }));
                                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }));
                                }}
                            />
                            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                            <Select
                                value={newRule.trigger}
                                onValueChange={(value) => {
                                    setNewRule(prev => ({ ...prev, trigger: value }));
                                    if (formErrors.trigger) setFormErrors(prev => ({ ...prev, trigger: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.trigger ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {TRIGGER_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.trigger && <p className="text-xs text-red-500">{formErrors.trigger}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Notification Channels</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {CHANNEL_OPTIONS.map((channel) => (
                                    <label
                                        key={channel}
                                        className={`flex items-center gap-2 p-2 border rounded-none cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all ${
                                            newRule.channels.includes(channel) ? "border-primary/40 bg-primary/10" : "border-zinc-200"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded-none"
                                            checked={newRule.channels.includes(channel)}
                                            onChange={() => toggleChannel(channel, true)}
                                        />
                                        <span className="text-sm font-bold text-gray-700">{channel}</span>
                                    </label>
                                ))}
                            </div>
                            {formErrors.channels && <p className="text-xs text-red-500">{formErrors.channels}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Recipients</Label>
                            <Select
                                value={newRule.recipients}
                                onValueChange={(value) => {
                                    setNewRule(prev => ({ ...prev, recipients: value }));
                                    if (formErrors.recipients) setFormErrors(prev => ({ ...prev, recipients: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${formErrors.recipients ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select recipients" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {RECIPIENT_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.recipients && <p className="text-xs text-red-500">{formErrors.recipients}</p>}
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Create Rule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white relative">
                        <h2 className="text-base font-bold flex items-center gap-2">
                            <Edit size={16} /> Edit Notification Rule
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update the notification rule settings.</p>
                    </div>
                    <div className="p-5 space-y-4 bg-white">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Rule Name</Label>
                            <Input
                                placeholder="e.g., New Lead Assignment"
                                className={`rounded-none border-zinc-200 h-9 text-sm ${editFormErrors.name ? "border-red-500" : ""}`}
                                value={editRule.name}
                                onChange={(e) => {
                                    setEditRule(prev => ({ ...prev, name: e.target.value }));
                                    if (editFormErrors.name) setEditFormErrors(prev => ({ ...prev, name: undefined }));
                                }}
                            />
                            {editFormErrors.name && <p className="text-xs text-red-500">{editFormErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Trigger Event</Label>
                            <Select
                                value={editRule.trigger}
                                onValueChange={(value) => {
                                    setEditRule(prev => ({ ...prev, trigger: value }));
                                    if (editFormErrors.trigger) setEditFormErrors(prev => ({ ...prev, trigger: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.trigger ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select trigger" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {TRIGGER_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editFormErrors.trigger && <p className="text-xs text-red-500">{editFormErrors.trigger}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Notification Channels</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {CHANNEL_OPTIONS.map((channel) => (
                                    <label
                                        key={channel}
                                        className={`flex items-center gap-2 p-2 border rounded-none cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all ${
                                            editRule.channels.includes(channel) ? "border-primary/40 bg-primary/10" : "border-zinc-200"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded-none"
                                            checked={editRule.channels.includes(channel)}
                                            onChange={() => toggleChannel(channel, false)}
                                        />
                                        <span className="text-sm font-bold text-gray-700">{channel}</span>
                                    </label>
                                ))}
                            </div>
                            {editFormErrors.channels && <p className="text-xs text-red-500">{editFormErrors.channels}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-600">Recipients</Label>
                            <Select
                                value={editRule.recipients}
                                onValueChange={(value) => {
                                    setEditRule(prev => ({ ...prev, recipients: value }));
                                    if (editFormErrors.recipients) setEditFormErrors(prev => ({ ...prev, recipients: undefined }));
                                }}
                            >
                                <SelectTrigger className={`rounded-none border-zinc-200 h-9 ${editFormErrors.recipients ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select recipients" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {RECIPIENT_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editFormErrors.recipients && <p className="text-xs text-red-500">{editFormErrors.recipients}</p>}
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
