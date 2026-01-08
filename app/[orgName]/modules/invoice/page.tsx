"use client"

import { useState, useEffect } from "react"
import { CustomButton } from "@/components/custom/CustomButton"
import { SmallCard, SmallCardContent, SmallCardDescription, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { CustomInput } from "@/components/custom/CustomInput"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CustomTable,
  CustomTableBody,
  CustomTableCell,
  CustomTableHead,
  CustomTableHeader,
  CustomTableRow,
} from "@/components/custom/CustomTable"
import {
  CustomDropdownMenu,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import {
  CustomAlertDialog,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
  CustomAlertDialogContent,
  CustomAlertDialogDescription,
  CustomAlertDialogFooter,
  CustomAlertDialogHeader,
  CustomAlertDialogTitle,
} from "@/components/custom/CustomAlertDialog"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/lib/store"
import { MoreHorizontal, Plus, Search, FileText, Download, Send, Eye, Calendar, DollarSign, Clock, CheckCircle, X, RotateCcw, Edit, Filter } from 'lucide-react'
import Link from "next/link"
import { getAllInvoices, getAllDrafts, getCancelledInvoices, cancelInvoice, restoreCancelledInvoice, draftToInvoice } from "@/hooks/invoiceHooks"
import { showSuccess } from "@/utils/toast"
import { Permission } from "@/components/custom/Permission"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Paid": return <CheckCircle className="h-4 w-4" />
    case "Pending": return <Clock className="h-4 w-4" />
    case "Overdue": return <Calendar className="h-4 w-4" />
    case "Draft": return <FileText className="h-4 w-4" />
    case "Canceled": return <X className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}

export default function AllInvoicesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgName, setOrgName] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const invoiceHookMap: Record<string, Function> = {
    Draft: getAllDrafts,
    Canceled: getCancelledInvoices,
  };

  const fetchInvoicesByStatus = async (status: string) => {
    const apiFunction = invoiceHookMap[status];
    if (!apiFunction) return [];
    try {
      setLoading(true);
      const response = await apiFunction();
      return status === "Draft" ? response.data.Invoice || [] : response.data.data || [];
    } catch (err: any) {
      console.error(`Error fetching ${status} invoices:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await getAllInvoices()
        setInvoices(response.data.data || [])
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch invoices")
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName");
    setOrgName(storedOrg || "");
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    if (invoice.isDeleted) return false
    const clientName = invoice.clientName || invoice.client?.firstName || "";
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || invoice.status.toLowerCase() === activeTab.toLowerCase()
    const matchesStatus = statusFilter === "All statuses" || invoice.status === statusFilter
    return matchesSearch && matchesTab && matchesStatus
  })

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredInvoices.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage) || 1;

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  const totalAmount = invoices.filter(inv => !inv.isDeleted).reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = invoices.filter(inv => inv.status === "Paid" && !inv.isDeleted).reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = invoices.filter(inv => inv.status === "Pending" && !inv.isDeleted).reduce((sum, invoice) => sum + invoice.amount, 0)
  const overdueAmount = invoices.filter(inv => inv.status === "Overdue" && !inv.isDeleted).reduce((sum, invoice) => sum + invoice.amount, 0)

  const handleCancel = async () => {
    if (!selectedInvoiceId) return;
    try {
      await cancelInvoice(selectedInvoiceId);
      toast({ title: "Success", description: "Invoice cancelled successfully" });
      const updatedInvoices = await getAllInvoices();
      setInvoices(updatedInvoices.data.data);
      setCancelDialogOpen(false);
      setSelectedInvoiceId(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to cancel invoice", variant: "destructive" });
    }
  };

  const handleRestore = async () => {
    if (!selectedInvoiceId) return;
    try {
      const res = await restoreCancelledInvoice(selectedInvoiceId);
      showSuccess(res.data.message || "Invoice restored successfully")
      setInvoices(prev => prev.map(inv => inv._id === selectedInvoiceId ? { ...inv, status: "active" } : inv))
      setRestoreDialogOpen(false);
      setSelectedInvoiceId(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to restore invoice" })
    }
  }

  const handleConvert = async () => {
    if (!selectedInvoiceId) return;
    try {
      const res = await draftToInvoice(selectedInvoiceId)
      toast({ title: "Success", description: res.data.message || "Draft converted to invoice successfully" })
      setInvoices(prev => prev.map(inv => inv._id === selectedInvoiceId ? { ...inv, draft: false, status: "Pending" } : inv))
      setConvertDialogOpen(false);
      setSelectedInvoiceId(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to convert draft to invoice" })
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary">Invoice Management</h1>
          <p className="text-sm text-muted-foreground">Create, track, and manage all your invoices in one place</p>
        </div>
        <Permission module="invoice" action="CREATE_INVOICE">
          <CustomButton asChild size="sm">
            <Link href={`/${orgName}/modules/invoice/create`} className="flex items-center">
              <Plus className="mr-1 h-3 w-3" /> Create Invoice
            </Link>
          </CustomButton>
        </Permission>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Invoiced", value: totalAmount, icon: DollarSign, color: "text-muted-foreground" },
          { title: "Paid", value: paidAmount, icon: CheckCircle, color: "text-green-600" },
          { title: "Pending", value: pendingAmount, icon: Clock, color: "text-yellow-600" },
          { title: "Overdue", value: overdueAmount, icon: Calendar, color: "text-red-600" },
        ].map((card, i) => (
          <SmallCard key={i}>
            <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
              <SmallCardTitle className="text-sm font-medium">{card.title}</SmallCardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">${card.value.toLocaleString()}</div>
            </SmallCardContent>
          </SmallCard>
        ))}
      </div>

      <Permission module="invoice" action="VIEW_ONLY">
        <SmallCard>
          <SmallCardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <SmallCardTitle>Invoice Overview</SmallCardTitle>
                <SmallCardDescription>Manage all your invoices and track payment status</SmallCardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <CustomInput
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <CustomDropdownMenu>
                  <CustomDropdownMenuTrigger asChild>
                    <CustomButton variant="outline" size="sm">
                      <Filter className="mr-2 h-3 w-3" /> {statusFilter}
                    </CustomButton>
                  </CustomDropdownMenuTrigger>
                  <CustomDropdownMenuContent align="end">
                    {["All statuses", "Paid", "Pending", "Overdue", "Draft", "Canceled"].map((status) => (
                      <CustomDropdownMenuItem key={status} onClick={async () => {
                        setStatusFilter(status);
                        if (status === "All statuses") {
                          const res = await getAllInvoices();
                          setInvoices(res.data.data);
                        } else {
                          const data = await fetchInvoicesByStatus(status);
                          setInvoices(data);
                        }
                      }}>
                        {status}
                      </CustomDropdownMenuItem>
                    ))}
                  </CustomDropdownMenuContent>
                </CustomDropdownMenu>
              </div>
            </div>
          </SmallCardHeader>
          <SmallCardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {["all", "pending", "paid", "overdue", "draft"].map(tab => (
                  <TabsTrigger key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab} className="mt-4">
                <CustomTable>
                  <CustomTableHeader>
                    <CustomTableRow>
                      <CustomTableHead>Invoice No.</CustomTableHead>
                      <CustomTableHead>Client Name</CustomTableHead>
                      <CustomTableHead>Firm Name</CustomTableHead>
                      <CustomTableHead>Status</CustomTableHead>
                      <CustomTableHead className="w-[70px]">Action</CustomTableHead>
                    </CustomTableRow>
                  </CustomTableHeader>
                  <CustomTableBody>
                    {currentRows.map((invoice) => (
                      <CustomTableRow key={invoice._id}>
                        <CustomTableCell className="font-medium">{invoice.invoiceNumber}</CustomTableCell>
                        <CustomTableCell>
                          <div className="font-medium">{invoice.clientName || invoice.client?.firstName}</div>
                          <div className="text-xs text-muted-foreground">{invoice.clientemail}</div>
                        </CustomTableCell>
                        <CustomTableCell>{invoice.firmName || invoice.client?.clientFirmName}</CustomTableCell>
                        <CustomTableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            <span className="flex items-center gap-1">{getStatusIcon(invoice.status)} {invoice.status}</span>
                          </Badge>
                        </CustomTableCell>
                        <CustomTableCell>
                          <CustomDropdownMenu>
                            <CustomDropdownMenuTrigger asChild><CustomButton variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></CustomButton></CustomDropdownMenuTrigger>
                            <CustomDropdownMenuContent align="end">
                              <CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/invoice/${invoice._id}`}><Eye className="mr-2 h-4 w-4" /> View</Link></CustomDropdownMenuItem>
                              {invoice.status === "Draft" && (
                                <>
                                  <Permission module="invoice" action="EDIT_INVOICE"><CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/invoice/${invoice.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></CustomDropdownMenuItem></Permission>
                                  <CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice.id); setConvertDialogOpen(true); }}><RotateCcw className="mr-2 h-4 w-4" /> Convert</CustomDropdownMenuItem>
                                </>
                              )}
                              {invoice.status !== "Cancelled" && invoice.status !== "Paid" && (
                                <CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice.id); setCancelDialogOpen(true); }} className="text-red-600"><X className="mr-2 h-4 w-4" /> Cancel</CustomDropdownMenuItem>
                              )}
                              {invoice.status === "Cancelled" && (
                                <Permission module="invoice" action="RESTORE_INVOICE"><CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice.id); setRestoreDialogOpen(true); }} className="text-green-600"><RotateCcw className="mr-2 h-4 w-4" /> Restore</CustomDropdownMenuItem></Permission>
                              )}
                            </CustomDropdownMenuContent>
                          </CustomDropdownMenu>
                        </CustomTableCell>
                      </CustomTableRow>
                    ))}
                  </CustomTableBody>
                </CustomTable>
                {filteredInvoices.length > 0 && (
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span>Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                      <CustomButton size="sm" variant="outline" onClick={handlePrev} disabled={currentPage === 1}>Prev</CustomButton>
                      <CustomButton size="sm" variant="outline" onClick={handleNext} disabled={currentPage === totalPages}>Next</CustomButton>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </SmallCardContent>
        </SmallCard>
      </Permission>

      <CustomAlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <CustomAlertDialogContent>
          <CustomAlertDialogHeader><CustomAlertDialogTitle>Cancel Invoice</CustomAlertDialogTitle><CustomAlertDialogDescription>Are you sure you want to cancel this invoice?</CustomAlertDialogDescription></CustomAlertDialogHeader>
          <CustomAlertDialogFooter><CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel><CustomAlertDialogAction onClick={handleCancel}>Confirm</CustomAlertDialogAction></CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>

      <CustomAlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <CustomAlertDialogContent>
          <CustomAlertDialogHeader><CustomAlertDialogTitle>Restore Invoice</CustomAlertDialogTitle><CustomAlertDialogDescription>This will restore the cancelled invoice.</CustomAlertDialogDescription></CustomAlertDialogHeader>
          <CustomAlertDialogFooter><CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel><CustomAlertDialogAction onClick={handleRestore}>Restore</CustomAlertDialogAction></CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>

      <CustomAlertDialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <CustomAlertDialogContent>
          <CustomAlertDialogHeader><CustomAlertDialogTitle>Convert Draft</CustomAlertDialogTitle><CustomAlertDialogDescription>Convert this draft to a pending invoice?</CustomAlertDialogDescription></CustomAlertDialogHeader>
          <CustomAlertDialogFooter><CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel><CustomAlertDialogAction onClick={handleConvert}>Convert</CustomAlertDialogAction></CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>
    </div>
  )
}
