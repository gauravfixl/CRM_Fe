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
import { MoreHorizontal, Plus, FileText, Download, Send, Eye, Calendar, DollarSign, Clock, CheckCircle, X, RotateCcw, Edit, Filter } from 'lucide-react'
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
  const [orgName, setOrgName] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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
      return status === "Draft" ? (response.data.Invoice || []) : (response.data.data || []);
    } catch (err) {
      console.error(`Error fetching ${status} invoices:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await getAllInvoices()
      setInvoices(response.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setOrgName(localStorage.getItem("orgName") || "");
    fetchInvoices();
  }, [])

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
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

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
      await fetchInvoices();
      setCancelDialogOpen(false);
      setSelectedInvoiceId(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to cancel invoice", variant: "destructive" });
    }
  };

  const handleRestore = async () => {
    if (!selectedInvoiceId) return;
    try {
      const res = await restoreCancelledInvoice(selectedInvoiceId)
      showSuccess(res.data.message || "Invoice restored successfully")
      await fetchInvoices();
      setRestoreDialogOpen(false)
      setSelectedInvoiceId(null)
    } catch (error) {
      console.error("Error restoring invoice:", error)
      toast({ title: "Error", description: "Failed to restore invoice" })
    }
  }

  const handleConvert = async () => {
    if (!selectedInvoiceId) return;
    try {
      const res = await draftToInvoice(selectedInvoiceId)
      toast({ title: "Success", description: res.data.message || "Draft converted to invoice successfully" })
      await fetchInvoices();
      setConvertDialogOpen(false)
      setSelectedInvoiceId(null)
    } catch (error) {
      console.error("Error converting draft:", error)
      toast({ title: "Error", description: "Failed to convert draft to invoice" })
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h6 className="text-xl font-semibold tracking-tight mb-1 leading-tight text-primary">Invoice Management</h6>
          <p className="text-sm text-muted-foreground mb-0 leading-snug">Create, track, and manage all your invoices in one place</p>
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
          { label: "Total Invoiced", value: `$${totalAmount.toLocaleString()}`, icon: DollarSign, color: "" },
          { label: "Paid", value: `$${paidAmount.toLocaleString()}`, icon: CheckCircle, color: "text-green-600" },
          { label: "Pending", value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: "text-yellow-600" },
          { label: "Overdue", value: `$${overdueAmount.toLocaleString()}`, icon: Calendar, color: "text-red-600" },
        ].map((stat, i) => (
          <SmallCard key={i}>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">{stat.label}</SmallCardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />
            </SmallCardHeader>
            <SmallCardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </SmallCardContent>
          </SmallCard>
        ))}
      </div>

      <Permission module="invoice" action="VIEW_ONLY">
        <SmallCard>
          <SmallCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <SmallCardTitle>Invoice Overview</SmallCardTitle>
                <SmallCardDescription>Manage all your invoices and track payment status</SmallCardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <CustomInput placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
                <CustomDropdownMenu>
                  <CustomDropdownMenuTrigger asChild>
                    <CustomButton variant="outline"><Filter className="mr-2 h-4 w-4" /> {statusFilter}</CustomButton>
                  </CustomDropdownMenuTrigger>
                  <CustomDropdownMenuContent align="end">
                    {["All statuses", "Paid", "Pending", "Overdue", "Draft", "Canceled"].map((status) => (
                      <CustomDropdownMenuItem key={status} onClick={async () => {
                        setStatusFilter(status);
                        if (status === "All statuses") await fetchInvoices();
                        else setInvoices(await fetchInvoicesByStatus(status));
                      }}>{status}</CustomDropdownMenuItem>
                    ))}
                  </CustomDropdownMenuContent>
                </CustomDropdownMenu>
              </div>
            </div>
          </SmallCardHeader>
          <SmallCardContent>
            <Tabs variant="custom" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {["all", "pending", "paid", "overdue", "draft"].map(tab => (
                  <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab} className="mt-6">
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
                          <div>
                            <div className="font-medium">{invoice.clientName || invoice.client?.firstName}</div>
                            <div className="text-sm text-muted-foreground">{invoice.clientemail}</div>
                          </div>
                        </CustomTableCell>
                        <CustomTableCell><div className="font-medium">{invoice.firmName || invoice.client?.clientFirmName}</div></CustomTableCell>
                        <CustomTableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            <div className="flex items-center space-x-1">{getStatusIcon(invoice.status)}<span>{invoice.status}</span></div>
                          </Badge>
                        </CustomTableCell>
                        <CustomTableCell>
                          <CustomDropdownMenu>
                            <CustomDropdownMenuTrigger asChild><CustomButton variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></CustomButton></CustomDropdownMenuTrigger>
                            <CustomDropdownMenuContent align="end">
                              <CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/invoice/${invoice._id}`}><Eye className="mr-2 h-4 w-4" /> View Invoice</Link></CustomDropdownMenuItem>
                              {invoice.status === "Draft" && (
                                <Permission module="invoice" action="EDIT_INVOICE">
                                  <CustomDropdownMenuItem asChild><Link href={`/${orgName}/modules/invoice/${invoice._id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit Draft</Link></CustomDropdownMenuItem>
                                  <CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice._id); setConvertDialogOpen(true); }}><RotateCcw className="mr-2 h-4 w-4" /> Convert to Invoice</CustomDropdownMenuItem>
                                </Permission>
                              )}
                              <CustomDropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download PDF</CustomDropdownMenuItem>
                              {invoice.status !== "Cancelled" && invoice.status !== "Draft" && (
                                <CustomDropdownMenuItem><Send className="mr-2 h-4 w-4" /> Send to Client</CustomDropdownMenuItem>
                              )}
                              {invoice.status !== "Cancelled" && invoice.status !== "Paid" && (
                                <CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice._id); setCancelDialogOpen(true); }} className="text-red-600"><X className="mr-2 h-4 w-4" /> Cancel Invoice</CustomDropdownMenuItem>
                              )}
                              {invoice.status === "Cancelled" && (
                                <Permission module="invoice" action="RESTORE_INVOICE">
                                  <CustomDropdownMenuItem onClick={() => { setSelectedInvoiceId(invoice._id); setRestoreDialogOpen(true); }} className="text-green-600"><RotateCcw className="mr-2 h-4 w-4" /> Restore Invoice</CustomDropdownMenuItem>
                                </Permission>
                              )}
                            </CustomDropdownMenuContent>
                          </CustomDropdownMenu>
                        </CustomTableCell>
                      </CustomTableRow>
                    ))}
                  </CustomTableBody>
                </CustomTable>
                {filteredInvoices.length > rowsPerPage && (
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-muted-foreground">Page {currentPage} of {totalPages}</span>
                    <div className="space-x-2">
                      <CustomButton variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>Prev</CustomButton>
                      <CustomButton variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>Next</CustomButton>
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
          <CustomAlertDialogHeader>
            <CustomAlertDialogTitle>Cancel Invoice</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>Are you sure you want to cancel this invoice? This action cannot be undone, but you can restore it later.</CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter>
            <CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel>
            <CustomAlertDialogAction onClick={handleCancel}>Cancel Invoice</CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>

      <CustomAlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <CustomAlertDialogContent>
          <CustomAlertDialogHeader>
            <CustomAlertDialogTitle>Restore Invoice</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>This action will restore the cancelled invoice and make it active again.</CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter>
            <CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel>
            <CustomAlertDialogAction onClick={handleRestore}>Restore Invoice</CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>

      <CustomAlertDialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <CustomAlertDialogContent>
          <CustomAlertDialogHeader>
            <CustomAlertDialogTitle>Convert Draft to Invoice</CustomAlertDialogTitle>
            <CustomAlertDialogDescription>This action will convert the draft to a pending invoice.</CustomAlertDialogDescription>
          </CustomAlertDialogHeader>
          <CustomAlertDialogFooter>
            <CustomAlertDialogCancel>Cancel</CustomAlertDialogCancel>
            <CustomAlertDialogAction onClick={handleConvert}>Convert to Invoice</CustomAlertDialogAction>
          </CustomAlertDialogFooter>
        </CustomAlertDialogContent>
      </CustomAlertDialog>
    </div>
  )
}
