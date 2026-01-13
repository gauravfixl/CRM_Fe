"use client";

import { useState, useEffect } from "react";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { SmallCard, SmallCardHeader, SmallCardTitle, SmallCardContent } from "@/components/custom/SmallCard"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    CustomDropdownMenu,
    CustomDropdownMenuTrigger,
    CustomDropdownMenuContent,
    CustomDropdownMenuItem,
} from "@/components/custom/CustomDropdownMenu";
import { MoreHorizontal, Eye, Edit, RotateCcw, Plus, Search, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useLoaderStore } from "@/lib/loaderStore";
import { bulkDeleteLeads, createLead, getLeadListByOrg } from "@/hooks/leadHooks";
import { getFirmList } from "@/hooks/firmHooks";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";
import { Permission } from "@/components/custom/Permission";
import SubHeader from "@/components/custom/SubHeader";
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard";

export default function LeadsPage() {
    const { deleteLead, restoreLead } = useAppStore();
    const { showLoader, hideLoader } = useLoaderStore();
    const [leads, setLeads] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
    const [restoreLeadId, setRestoreLeadId] = useState<string | null>(null);
    const router = useRouter();
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        setOrgName(localStorage.getItem("orgName") || "");
        const fetchFirmsAndLeads = async () => {
            showLoader();
            try {
                await getFirmList();
                const response = await getLeadListByOrg();
                setLeads(response?.data?.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                hideLoader();
            }
        };
        fetchFirmsAndLeads();
    }, [showLoader, hideLoader]);

    const filteredByDeleted = showDeleted
        ? leads.filter((lead) => lead.isDeleted)
        : leads.filter((lead) => !lead.isDeleted);

    const filteredLeads = filteredByDeleted.filter((lead) => {
        const name = lead.contact?.name || lead.name || "";
        const email = lead.contact?.email || lead.email || "";
        const company = lead.contact?.company || lead.company || "";
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleDeleteLead = (id: string) => {
        deleteLead(id);
        setDeleteLeadId(null);
        toast.success("Lead deleted successfully!");
    };

    const handleBulkDelete = async () => {
        if (!selectedLeads.length) return;
        try {
            showLoader();
            await bulkDeleteLeads(selectedLeads);
            setLeads(prevLeads => prevLeads.filter(lead => !selectedLeads.includes(lead._id)));
            toast.success("Selected leads deleted successfully!");
            setSelectedLeads([]);
            setBulkDeleteConfirm(false);
        } catch (err) {
            console.error("Error deleting leads:", err);
            toast.error("Failed to delete selected leads.");
        } finally {
            hideLoader();
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedLeads(filteredLeads.map(lead => lead._id));
        else setSelectedLeads([]);
    };

    const handleRestoreLead = (id: string) => {
        restoreLead(id);
        setRestoreLeadId(null);
        toast.success("Lead restored successfully!");
    };

    const handleSelectLead = (leadId: string, checked: boolean) => {
        if (checked) setSelectedLeads((prev) => [...prev, leadId]);
        else setSelectedLeads((prev) => prev.filter((id) => id !== leadId));
    };

    const activeLeads = leads.filter((lead) => !lead.isDeleted);
    const qualifiedLeads = leads.filter(lead => lead.stage === "Qualified").length;
    const conversionRate = leads.length > 0 ? (qualifiedLeads / leads.length) * 100 : 0;
    const totalValue = activeLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New": return "bg-blue-100 text-blue-800";
            case "Qualified": return "bg-green-100 text-green-800";
            case "Proposal": return "bg-yellow-100 text-yellow-800";
            case "Negotiation": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <SubHeader
                title="Lead Management"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "CRM", href: `/${orgName}/modules/crm/leads` },
                    { label: "Leads", href: `/${orgName}/modules/crm/leads` },
                ]}
            />
            <div className="space-y-6 all-leads-page p-6 z-10 bg-white min-h-[70vh] rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h6 className="text-xl text-primary font-bold tracking-tight">Leads</h6>
                        <p className="text-muted-foreground text-sm">Manage and track your sales leads</p>
                    </div>
                    {!showDeleted && (
                        <Permission module="lead" action="CREATE_LEAD">
                            <CustomButton onClick={() => router.push(`leads/add`)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Lead
                            </CustomButton>
                        </Permission>
                    )}
                </div>

                {!showDeleted && (
                    <div className="grid gap-4 md:grid-cols-4">
                        {[
                            { label: "Total Leads", value: activeLeads.length, desc: "Active leads" },
                            { label: "Qualified", value: qualifiedLeads, desc: "Ready for proposal" },
                            { label: "Conversion Rate", value: `${conversionRate.toFixed(1)}%`, desc: "Lead to qualified" },
                            { label: "Pipeline Value", value: `$${totalValue.toLocaleString()}`, desc: "Total potential value" },
                        ].map((stat, i) => (
                            <SmallCard key={i}>
                                <SmallCardHeader className="pb-2"><SmallCardTitle className="text-sm font-medium">{stat.label}</SmallCardTitle></SmallCardHeader>
                                <SmallCardContent><div className="text-2xl font-bold">{stat.value}</div><p className="text-xs text-muted-foreground">{stat.desc}</p></SmallCardContent>
                            </SmallCard>
                        ))}
                    </div>
                )}

                <Permission module="lead" action="VIEW_TRASH">
                    <FlatCard>
                        <FlatCardHeader>
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <FlatCardTitle>{showDeleted ? "Deleted Leads" : "Leads Overview"}</FlatCardTitle>
                                    <FlatCardDescription>{showDeleted ? "Leads that can be restored" : "A list of all your leads"}</FlatCardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CustomInput placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
                                    {!showDeleted && selectedLeads.length > 0 && (
                                        <CustomButton variant="destructive" size="sm" onClick={() => setBulkDeleteConfirm(true)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedLeads.length})
                                        </CustomButton>
                                    )}
                                </div>
                            </div>
                        </FlatCardHeader>

                        <FlatCardContent className="overflow-y-auto h-[35vh] hide-scrollbar">
                            {filteredLeads.length === 0 ? (
                                <div className="text-center py-12">
                                    <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                                    <h3 className="mt-2 text-sm font-semibold text-muted-foreground">{showDeleted ? "No deleted leads" : "No leads found"}</h3>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {!showDeleted && <TableHead className="w-[50px]"><Checkbox checked={selectedLeads.length === filteredLeads.length} onCheckedChange={handleSelectAll} /></TableHead>}
                                            <TableHead>Name</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead className="w-[70px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeads.map((lead) => (
                                            <TableRow key={lead._id} className={showDeleted ? "opacity-75" : ""}>
                                                {!showDeleted && (
                                                    <TableCell><Checkbox checked={selectedLeads.includes(lead._id)} onCheckedChange={(checked) => handleSelectLead(lead._id, checked as boolean)} /></TableCell>
                                                )}
                                                <TableCell>
                                                    <div className="font-medium">{lead.contact?.name || lead.name}</div>
                                                    <div className="text-sm text-muted-foreground">{lead.contact?.email || lead.email}</div>
                                                </TableCell>
                                                <TableCell>{lead.contact?.company || lead.company || "-"}</TableCell>
                                                <TableCell><Badge className={getStatusColor(lead.stage)}>{lead.stage}</Badge></TableCell>
                                                <TableCell>{lead.source || "-"}</TableCell>
                                                <TableCell>{lead.assignedTo?.email || "-"}</TableCell>
                                                <TableCell>
                                                    <CustomDropdownMenu>
                                                        <CustomDropdownMenuTrigger asChild><CustomButton variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></CustomButton></CustomDropdownMenuTrigger>
                                                        <CustomDropdownMenuContent align="end">
                                                            {!showDeleted ? (
                                                                <>
                                                                    <Permission module="lead" action="VIEW_ONLY">
                                                                        <CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/crm/leads/${lead._id}`} className="no-underline"><Eye className="mr-2 h-4 w-4" /> View</Link></CustomDropdownMenuItem>
                                                                    </Permission>
                                                                    <Permission module="lead" action="EDIT_LEAD">
                                                                        <CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/crm/leads/${lead._id}/edit`} className="no-underline"><Edit className="mr-2 h-4 w-4" /> Edit</Link></CustomDropdownMenuItem>
                                                                        <CustomDropdownMenuItem className="text-red-600" onClick={() => setDeleteLeadId(lead._id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</CustomDropdownMenuItem>
                                                                    </Permission>
                                                                </>
                                                            ) : (
                                                                <CustomDropdownMenuItem className="text-green-600" onClick={() => setRestoreLeadId(lead._id)}><RotateCcw className="mr-2 h-4 w-4" /> Restore</CustomDropdownMenuItem>
                                                            )}
                                                        </CustomDropdownMenuContent>
                                                    </CustomDropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </FlatCardContent>
                    </FlatCard>
                </Permission>
            </div>

            <AlertDialog open={!!deleteLeadId} onOpenChange={() => setDeleteLeadId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this lead? This action can be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteLeadId && handleDeleteLead(deleteLeadId)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Leads</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete {selectedLeads.length} leads?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Delete {selectedLeads.length} Leads</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!restoreLeadId} onOpenChange={() => setRestoreLeadId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Restore Lead</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to restore this lead?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => restoreLeadId && handleRestoreLead(restoreLeadId)}>Restore</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
