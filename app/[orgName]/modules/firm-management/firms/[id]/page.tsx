


"use client"
import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/custom/DataTable"
import Image from "next/image"
import Link from "next/link"
import {
  FlatCard,
  FlatCardHeader,
  FlatCardTitle,
  FlatCardContent,
} from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomAccordion, CustomAccordionItem, CustomAccordionTrigger, CustomAccordionContent } from "@/components/custom/CustomAccordion"
import { CustomDialog, CustomDialogContent, CustomDialogDescription, CustomDialogFooter, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger } from "@/components/custom/CustomDialog"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"

import { Breadcrumb } from "@/components/custom/CustomBreadCrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomSelect, CustomSelectContent, CustomSelectTrigger, CustomSelectItem, CustomSelectValue } from "@/components/custom/CustomSelect"
import { useAppStore } from "@/lib/store"
import { useLoaderStore } from "@/lib/loaderStore"
// import { getInvoicesByFirm, getAllTaxesByFirm } from "@/hooks/firmHooks" // ✅ import your API hooks
import { getInvoicesByFirm } from "@/hooks/invoiceHooks"
import { getAllTaxesByFirm } from "@/hooks/taxHooks"
import CreateTaxDialog from "@/components/custom/taxes/CreateTaxDialog"
export default function FirmDetailsPage() {
  const params = useParams()
  const firmId = params.id as string
  const firms = useAppStore((state) => state.firms)
  const firm = firms.find((firm) => firm._id === firmId)
  const [orgName, setOrgName] = useState("")
  const { showLoader, hideLoader } = useLoaderStore()
  const router = useRouter()

  const [invoiceStatus, setInvoiceStatus] = useState("All")
  const [invoices, setInvoices] = useState<any[]>([])
  const [taxes, setTaxes] = useState<any[]>([])
  const [isCreateTaxOpen, setIsCreateTaxOpen] = useState(false)


  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName")
    setOrgName(storedOrg || "")
  }, [])

  useEffect(() => {
    if (!firm) {
      showLoader()
    } else {
      hideLoader()
      // ✅ fetch firm data only when firm is available
      fetchFirmData()
    }
  }, [firm])

  const fetchFirmData = async () => {
    try {
      // fetch invoices
      const invoiceRes = await getInvoicesByFirm(firmId)
      setInvoices(invoiceRes.data?.data || [])

      // fetch taxes
      const taxRes = await getAllTaxesByFirm(firmId)
      setTaxes(taxRes.data.data || [])
    } catch (err) {
      console.error("Error fetching firm data:", err)
    }
  }
  const handleCreateInvoice = () => {

    router.push(`/${orgName}/modules/firm-management/firms/${firmId}/create-invoice`)
  }

  // ✅ filter invoices by status
  const filteredInvoices = useMemo(() => {
    if (!invoices.length) return []
    if (invoiceStatus === "All") return invoices
    return invoices.filter(
      (inv) => inv.status?.toLowerCase() === invoiceStatus.toLowerCase()
    )
  }, [invoices, invoiceStatus])

  return (
    <div className="p-4">
      {/* Subheader */}
      <SubHeader
        title="View Firm"
        breadcrumbItems={[
          { label: "All Firms", href: `/${params.orgName}/modules/firm-management/firms` },
          { label: "View", href: `/${params.orgName}/modules/firm-management/firms/${params.firmId}` },
        ]}
      />



      <div className="-mt-14 mx-2 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left column */}
        <div className="lg:col-span-3">
          <FlatCard>
            <FlatCardHeader>
              <FlatCardTitle>About</FlatCardTitle>
            </FlatCardHeader>
            <FlatCardContent className="space-y-3 text-sm">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={firm?.logo || "/placeholder.svg"} alt={firm?.FirmName} />
                  <AvatarFallback>{firm?.FirmName?.[0]}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-lg">{firm?.FirmName}</p>
              </div>
              <dl className="space-y-2">
                <div><dt className="font-small">Website:</dt><dd className="text-blue-600">{firm?.website || "-"}</dd></div>
                <div><dt className="font-small">GST:</dt><dd>{firm?.gst_no || "-"}</dd></div>
                <div><dt className="font-small">Phone:</dt><dd>{firm?.phone || "-"}</dd></div>
                <div><dt className="font-small">Email:</dt><dd>{firm?.email || "-"}</dd></div>
                <div><dt className="font-small">Address:</dt><dd>{firm?.add?.address1}, {firm?.add?.city}, {firm?.add?.state}, {firm?.add?.country} - {firm?.add?.pincode}</dd></div>
              </dl>
            </FlatCardContent>
          </FlatCard>
        </div>

        {/* Middle column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FlatCard className="text-center p-4">
              <p className="text-lg ">0.00</p>
              <p className="text-sm text-muted-foreground">Tax Collected</p>
            </FlatCard>
            <FlatCard className="text-center p-4">
              <p className="text-lg ">{invoices.length}</p>
              <p className="text-sm text-muted-foreground">Invoices</p>
            </FlatCard>
            <FlatCard className="text-center p-4">
              <p className="text-lg ">0.00</p>
              <p className="text-sm text-muted-foreground">Due</p>
            </FlatCard>
          </div>

          {/* Accordion */}
          <CustomAccordion type="single" collapsible className="w-full">
            {/* Taxes */}
            <CustomAccordionItem value="taxes">
              <CustomAccordionTrigger className="bg-primary text-white hover:text-white px-3"><span className="px-2 text-white">Taxes</span></CustomAccordionTrigger>
              <CustomAccordionContent>
                <div className=" h-[35vh] overflow-y-auto hide-scrollbar ">
                  <DataTable
                    columns={[
                      { key: "sno", label: "S.No." },
                      { key: "taxName", label: "Tax Name" },
                      { key: "rate", label: "Rate (%)" },
                    ]}
                    data={taxes.flatMap((t, idx) =>
                      (t.taxRates || []).map((rateObj, subIdx) => ({
                        sno: idx + 1, // e.g. 1-1, 1-2 if multiple inside one doc
                        taxName: rateObj.name,
                        rate: rateObj.rate,
                      }))
                    )}
                    emptyMessage="No Taxes To Show"
                  />

                </div>

              </CustomAccordionContent>
            </CustomAccordionItem>

            {/* Invoices */}
            <CustomAccordionItem value="invoices">
              <CustomAccordionTrigger className="bg-primary text-white hover:text-white px-3"><span className="px-2 text-white">Invoices</span></CustomAccordionTrigger>
              <CustomAccordionContent className="space-y-4">
                <div className="flex justify-between items-center">
                  {/* Inline Tabs */}
                  <Tabs variant="custom" value={invoiceStatus} onValueChange={setInvoiceStatus}>
                    <TabsList>
                      <TabsTrigger value="All">All</TabsTrigger>
                      <TabsTrigger value="Pending">Pending</TabsTrigger>
                      <TabsTrigger value="Paid">Paid</TabsTrigger>
                      <TabsTrigger value="Overdue">Overdue</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Dropdown */}
                  <CustomSelect value={invoiceStatus} onValueChange={setInvoiceStatus}>
                    <CustomSelectTrigger className="w-40">
                      <CustomSelectValue placeholder="Filter Status" />
                    </CustomSelectTrigger>
                    <CustomSelectContent>
                      <CustomSelectItem value="All">All</CustomSelectItem>
                      <CustomSelectItem value="Pending">Pending</CustomSelectItem>
                      <CustomSelectItem value="Partial Paid">Partial Paid</CustomSelectItem>
                      <CustomSelectItem value="Paid">Paid</CustomSelectItem>
                      <CustomSelectItem value="Overdue">Overdue</CustomSelectItem>
                      <CustomSelectItem value="Draft">Draft</CustomSelectItem>
                      <CustomSelectItem value="Deleted">Deleted</CustomSelectItem>
                      <CustomSelectItem value="Canceled">Canceled</CustomSelectItem>
                      <CustomSelectItem value="Disputed">Disputed</CustomSelectItem>
                    </CustomSelectContent>
                  </CustomSelect>
                </div>
                <div className=" h-[35vh] overflow-y-auto hide-scrollbar ">
                  <DataTable
                    columns={[
                      { key: "invoiceNumber", label: "Invoice No." },
                      { key: "firmName", label: "Firm Name" },
                      { key: "clientName", label: "Client Name" },
                      { key: "status", label: "Status" },
                      { key: "dueAmount", label: "Due Amount" },
                    ]}
                    data={filteredInvoices.map((inv) => ({
                      invoiceNumber: inv.invoiceNumber,
                      firmName: inv.firm?.name ?? "-",
                      clientName: inv.client ? `${inv.client.firstName} ${inv.client.lastName}` : "-",
                      status: inv.status,
                      dueAmount: inv.dueAmount,
                    }))}
                    emptyMessage="No matching invoices"
                  />
                </div>

              </CustomAccordionContent>
            </CustomAccordionItem>
          </CustomAccordion>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-6">
          <FlatCard>
            <FlatCardHeader><FlatCardTitle>Options</FlatCardTitle></FlatCardHeader>
            <FlatCardContent className="flex flex-col gap-2">
              <CustomButton variant="default" className="bg-primary text-white text-xs" onClick={() => handleCreateInvoice()}>Create Invoice</CustomButton>
              <CustomButton variant="default"

                className="bg-primary text-white text-xs"
                onClick={() => setIsCreateTaxOpen(true)}
              >
                Create Taxes
              </CustomButton>

              {/* <CustomButton variant="outline" className="bg-primary text-white text-xs">Create Product</CustomButton> */}
              <Link href={`/${orgName}/modules/firm-management/firms/${firm?._id}/edit?from=view`}>
                <CustomButton variant="default" className="bg-primary text-white w-full text-xs">Edit Firm</CustomButton>
              </Link>
              <CustomButton variant="destructive">Delete Firm</CustomButton>
            </FlatCardContent>
          </FlatCard>
        </div>
      </div>
      <CreateTaxDialog
        firmId={firmId}
        context="firm"
        open={isCreateTaxOpen}
        onOpenChange={setIsCreateTaxOpen}
        onSave={() => {
          // refresh taxes list here
        }}
      />

    </div>
  )
}
