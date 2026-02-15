"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    GitPullRequest,
    Briefcase,
    MapPin,
    DollarSign,
    UserCheck,
    ArrowRightLeft,
    TrendingUp,
    History,
    FileText,
    CheckCircle2,
    XCircle,
    UserPlus
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

const LifecycleActionsPage = () => {
    const { toast } = useToast();
    const { employees, promoteEmployee, history } = useLifecycleStore();

    // Only Active Employees can have actions
    const activeEmployees = employees.filter(e => e.status === 'Active');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'Promotion' | 'Transfer'>('Promotion');
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [newValue, setNewValue] = useState(""); // New Role or Dept

    // Filter relevant history logs
    const recentActions = history.filter(h => h.type === 'growth' || h.type === 'neutral').slice(0, 10);

    const handleSubmit = () => {
        if (!selectedEmpId || !newValue) {
            toast({ title: "Error", description: "All fields are required" });
            return;
        }

        promoteEmployee(selectedEmpId, newValue); // Currently store only has promote function generic enough for role
        toast({ title: "Action Success", description: `Employee updated successfully.` });
        setIsDialogOpen(false);
        setSelectedEmpId("");
        setNewValue("");
    };

    const actions = [
        { type: "Promotion", icon: <TrendingUp size={20} />, color: "bg-[#CB9DF0]", desc: "Designation Change", action: 'Promotion' },
        { type: "Transfer", icon: <ArrowRightLeft size={20} />, color: "bg-[#F0C1E1]", desc: "Dept. / Location", action: 'Transfer' },
        { type: "Salary Revision", icon: <DollarSign size={20} />, color: "bg-[#FFF9BF]", textColor: "text-slate-700", desc: "Compensation Update", action: 'Salary' },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lifecycle Actions</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 4: Manage movements, promotions, and transfers.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Initiate {actionType}</DialogTitle>
                            <DialogDescription>Update employee records and log history.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Employee</Label>
                                <Select onValueChange={setSelectedEmpId}>
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Choose Active Employee..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeEmployees.map(e => (
                                            <SelectItem key={e.id} value={e.id}>{e.name} ({e.role})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>New {actionType === 'Promotion' ? 'Designation' : 'Department/Location'}</Label>
                                <Input placeholder={actionType === 'Promotion' ? "e.g. Senior Developer" : "e.g. Sales Team / Mumbai"} value={newValue} onChange={e => setNewValue(e.target.value)} className="rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-12" onClick={handleSubmit}>Confirm Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actions.map((act, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => {
                        //@ts-ignore
                        setActionType(act.action);
                        setIsDialogOpen(true);
                    }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] p-6 group hover:shadow-2xl transition-all relative overflow-hidden bg-white`}>
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 ${act.color} ${act.textColor || 'text-white'}`}>
                                {act.icon}
                            </div>
                            <h3 className="text-lg font-black text-slate-900">{act.type}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{act.desc}</p>
                            <div className={`absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150 ${act.textColor || 'text-black'}`}>
                                {act.icon}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent History Log */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl text-slate-900">Recent Updates Log</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="p-4 rounded-tl-xl">Event</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 rounded-tr-xl">Type</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-600">
                            {recentActions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">No actions recorded yet.</td>
                                </tr>
                            ) : recentActions.map((item, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 border-dashed">
                                    <td className="p-4 font-bold text-slate-900">
                                        {item.title}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {item.description}
                                    </td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="border-slate-200 bg-white text-slate-500 font-bold uppercase text-[10px]">{item.type}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default LifecycleActionsPage;
