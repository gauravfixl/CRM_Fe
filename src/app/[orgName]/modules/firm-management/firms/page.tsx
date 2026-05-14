
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"

import { CustomInput } from "@/components/custom/CustomInput"
import {
  CustomTable,
  CustomTableBody,
  CustomTableCell,
  CustomTableHead,
  CustomTableHeader,
  CustomTableRow,
} from "@/components/custom/CustomTable"
import { FlatCardContent, FlatCardDescription, FlatCardFooter, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import {
  CustomDropdownMenu,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import { MoreHorizontal, Plus, Search, Trash2, Eye, Edit, Activity, Users, Building2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { getAllFirms, deleteFirm } from "@/hooks/firmHooks"
import { showError, showSuccess } from "@/utils/toast"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle
} from "@/components/custom/CustomDialog"
import { useLoaderStore } from "@/lib/loaderStore"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/lib/useAuthStore"
import { Permission } from "@/components/custom/Permission"
import { SmallCard, SmallCardContent, SmallCardDescription, SmallCardFooter, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard } from "@/components/custom/FlatCard"
import Loader from "@/shared/components/custom/Loader"
export default function FirmsPage() {
  const { firms, setFirms } = useAppStore()
  const { showLoader, hideLoader } = useLoaderStore() // <-- use loader store
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const params_url = useParams() as { orgName?: string };
  const [orgName, setOrgName] = useState("")
  const userRole = useAuthStore((state) => state.userRole);
  const permissions = useAuthStore((state) => state.permissions);
  useEffect(() => {
    const pOrg = params_url.orgName;
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg);
  }, [params_url.orgName]);

  const activeFirms = Array.isArray(firms) ? firms.filter(firm => !firm.isDeleted) : [];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // firms per page






  // Filter firms by multiple fields
  const filteredFirms = activeFirms.filter(firm => {
    const matchesStatus = !statusFilter
      ? true
      : statusFilter === "Active"
        ? (!firm.status || firm.status === "Active")
        : firm.status === statusFilter
    if (!matchesStatus) return false
    const q = searchTerm.toLowerCase()
    return (
      (firm.FirmName || "").toLowerCase().includes(q) ||
      (firm.add?.address1 || "").toLowerCase().includes(q) ||
      (firm.add?.address2 || "").toLowerCase().includes(q) ||
      (firm.add?.city || "").toLowerCase().includes(q) ||
      (firm.add?.state || "").toLowerCase().includes(q) ||
      (firm.add?.country || "").toLowerCase().includes(q) ||
      (firm.email || "").toLowerCase().includes(q) ||
      (firm.gst_no || "").toLowerCase().includes(q) ||
      (firm._id || "").toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filteredFirms.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentFirms = filteredFirms.slice(startIndex, startIndex + pageSize);

  const handleDeleteFirm = async (firmId: string) => {
    try {
      showLoader();

      // Optimistically update the UI
      const updatedFirms = firms.filter(firm => firm._id !== firmId);
      setFirms(updatedFirms);

      // Call API
      await deleteFirm(firmId);

      setDeleteConfirmId(null);
      showSuccess("Firm deleted successfully!");
    } catch (err) {
      console.error("Error deleting firm:", err);
      showError("Failed to delete firm!");
    } finally {
      hideLoader();
    }
  };
  // Fetch firms on mount
  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const safety = window.setTimeout(() => {
      setLoading(false)
    }, 20000)

    ;(async () => {
      try {
        const [firmsRes] = await Promise.allSettled([getAllFirms()])
        if (firmsRes.status === "fulfilled") {
          const firmsData = firmsRes.value?.data?.firms || []
          setFirms(firmsData)
        } else {
          const err: any = firmsRes.reason
          if (err?.response?.status !== 401) {
            console.error("Failed to fetch firms:", err)
          }
        }
      } finally {
        window.clearTimeout(safety)
        setLoading(false)
      }
    })()
  }, [setFirms])

  const totalFirms = activeFirms.length
  // Count based on the actual status field (defaulting to Active if not set)
  const activeFirmsCount = activeFirms.filter(f => !f.status || f.status === "Active").length
  const inactiveFirms = activeFirms.filter(f => f.status === "Inactive").length
  const totalEmployees = activeFirms.reduce((sum, firm) => sum + (firm.employeeCount || 0), 0)
  const router = useRouter()

  function truncateWebsite(url: string, startLength = 10, endLength = 10) {
    if (url.length <= startLength + endLength + 3) return url
    const start = url.slice(0, startLength)
    const end = url.slice(-endLength)
    return `${start}...${end}`
  }

  if (loading) {
    return (
      <div className="relative h-full w-full">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <SubHeader
        title="Firm Management"
        breadcrumbItems={[
          { label: "Organisation", href: `/${orgName}/modules/organization/all-org` },
          { label: "Firms", href: `/${orgName}/modules/firm-management/firms` },
        ]}
        rightControls={
          <div className="flex space-x-2">
            <Permission module="firm" action="VIEW_TRASH">
              <Link href={`/${orgName}/modules/firm-management/firms/deleted`}>
                <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                  <Trash2 className="w-4 h-4" /> Deleted Firms
                </CustomButton>
              </Link>
            </Permission>
            <Permission module="firm" action="CREATE_FIRM">
              <Link href={`/${orgName}/modules/firm-management/firms/add`}>
                <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                  <Plus className="w-4 h-4" /> Add Firm
                </CustomButton>
              </Link>
            </Permission>
          </div>
        }
      />

      <div className="space-y-4 all-firms-page p-4">

        <div className="flex items-center justify-between">




        </div>

        {/* Dashboard cards */}
        <div className="grid gap-4 md:grid-cols-4 add-firm-dashboard-cards">
          <SmallCard
            onClick={() => { setStatusFilter(""); setCurrentPage(1); }}
            className={`cursor-pointer hover:shadow-md transition-all ${statusFilter === "" ? "ring-2 ring-primary" : ""}`}
          >
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Total Firms</SmallCardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{totalFirms}</div>
              <p className="text-xs text-muted-foreground">Registered firms</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard
            onClick={() => { setStatusFilter("Active"); setCurrentPage(1); }}
            className={`cursor-pointer hover:shadow-md transition-all ${statusFilter === "Active" ? "ring-2 ring-emerald-500" : ""}`}
          >
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Active Firms</SmallCardTitle>
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeFirmsCount}</div>
              <p className="text-xs text-muted-foreground">Currently operating</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard
            onClick={() => { setStatusFilter("Inactive"); setCurrentPage(1); }}
            className={`cursor-pointer hover:shadow-md transition-all ${statusFilter === "Inactive" ? "ring-2 ring-red-500" : ""}`}
          >
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Inactive Firms</SmallCardTitle>
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveFirms}</div>
              <p className="text-xs text-muted-foreground">Not operating</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard
            onClick={() => router.push(`/${orgName}/modules/organization/users`)}
            className="cursor-pointer hover:shadow-md transition-all"
          >
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Total Employees</SmallCardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold text-foreground">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Across all firms</p>
            </SmallCardContent>
          </SmallCard>
        </div>



        <FlatCard className="all-firms-directory-card border-border bg-card">

          <FlatCardHeader className="border-b border-border">
            <div className="flex flex-row justify-between items-center w-full">
              {/* Left: Title + Description */}
              <div>
                <FlatCardTitle className="text-foreground">Firm Directory</FlatCardTitle>
                <FlatCardDescription className="pt-1 text-muted-foreground">
                  Complete overview of all registered firms
                </FlatCardDescription>
              </div>

              {/* Right: Search input */}
              <div className="flex items-center space-x-2">
                <div className="relative max-w-sm w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <CustomInput
                    placeholder="Search firms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
          </FlatCardHeader>


          <FlatCardContent className="p-0">
            {currentFirms.length > 0 ? (
              <CustomTable className="all-firms-table">
                <CustomTableHeader className="all-firms-table-head bg-muted/30">
                  <CustomTableRow>
                    <CustomTableHead>Firm Name</CustomTableHead>
                    <CustomTableHead>Contact Email</CustomTableHead>
                    <CustomTableHead>GST No.</CustomTableHead>
                    <CustomTableHead>Address</CustomTableHead>
                    <CustomTableHead>Phone</CustomTableHead>
                    <CustomTableHead>Website</CustomTableHead>
                    <CustomTableHead>Onboarding</CustomTableHead>
                    <CustomTableHead>Actions</CustomTableHead>
                    <CustomTableHead className="w-[70px]"></CustomTableHead>
                  </CustomTableRow>
                </CustomTableHeader>
                <CustomTableBody className="all-firms-table-body">
                  {currentFirms.map((firm) => {
                    const address = firm.add || { city: "", state: "", country: "" }
                    return (
                      <CustomTableRow key={firm._id} className="hover:bg-muted/50 border-border">
                        <CustomTableCell className="text-foreground font-medium">{firm.FirmName}</CustomTableCell>
                        <CustomTableCell className="text-muted-foreground">{firm.email || "-"}</CustomTableCell>
                        <CustomTableCell className="text-muted-foreground">{firm.gst_no || "-"}</CustomTableCell>
                        <CustomTableCell className="text-muted-foreground">
                          {address.city}, {address.state}, {address.country}
                        </CustomTableCell>
                        <CustomTableCell className="text-muted-foreground">
                          {firm.phone ? firm.phone.replace(/^\+91-?/, "") : "-"}
                        </CustomTableCell>
                        <CustomTableCell>
                          {firm.website ? (
                            <a
                              href={firm.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              {truncateWebsite(firm.website)}
                            </a>
                          ) : (
                            "-"
                          )}
                        </CustomTableCell>
                        <CustomTableCell>
                          <div className="flex flex-col gap-1 w-24">
                             <div className="flex items-center justify-between text-[9px] font-bold tracking-widest uppercase">
                                <span className={(!firm.status || firm.status === 'Active') ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500 dark:text-amber-400"}>
                                  {firm.status || 'Active'}
                                </span>
                             </div>
                             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${(!firm.status || firm.status === 'Active') ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-1/3'}`} />
                             </div>
                          </div>
                        </CustomTableCell>
                        <CustomTableCell>
                          <CustomDropdownMenu>
                            <CustomDropdownMenuTrigger asChild>
                              <CustomButton variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </CustomButton>
                            </CustomDropdownMenuTrigger>
                            <CustomDropdownMenuContent align="end">
                              <Permission module="firm" action="VIEW_ONLY">
                                <CustomDropdownMenuItem
                                  onSelect={() => {
                                    router.push(`/${orgName}/modules/firm-management/firms/${firm._id}`)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </CustomDropdownMenuItem>
                              </Permission>
                              <Permission module="firm" action="EDIT_FIRM">
                                <CustomDropdownMenuItem
                                  onSelect={() => {
                                    router.push(`/${orgName}/modules/firm-management/firms/${firm._id}/edit`)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit Firm
                                </CustomDropdownMenuItem>
                              </Permission>
                              <Permission module="firm" action="DELETE_FIRM">
                                <CustomDropdownMenuItem
                                  className="text-red-600"
                                  onSelect={() => {
                                    setTimeout(() => setDeleteConfirmId(firm._id), 0)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Firm
                                </CustomDropdownMenuItem>
                              </Permission>
                            </CustomDropdownMenuContent>
                          </CustomDropdownMenu>
                        </CustomTableCell>
                      </CustomTableRow>
                    )
                  })}
                </CustomTableBody>
              </CustomTable>
            ) : (
              <div className="text-center text-muted-foreground py-6 no-firms">
                No firms found.
              </div>
            )}
          </FlatCardContent>

          {/* ✅ Show pagination only if firms exist */}
          {currentFirms.length > 0 && (
            <FlatCardFooter className="flex justify-between items-center all-firms-page-controls">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <CustomButton
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </CustomButton>
                <CustomButton
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </CustomButton>
              </div>
            </FlatCardFooter>
          )}
        </FlatCard>


        {/* Delete confirm dialog */}
        <CustomDialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <CustomDialogContent>
            <CustomDialogHeader>
              <CustomDialogTitle>Delete Firm</CustomDialogTitle>
              <CustomDialogDescription>
                Are you sure you want to delete this firm? This action can be undone from the deleted firms section.
              </CustomDialogDescription>
            </CustomDialogHeader>
            <CustomDialogFooter>
              <CustomButton variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</CustomButton>
              <CustomButton variant="destructive" onClick={() => {
                if (deleteConfirmId) handleDeleteFirm(deleteConfirmId);
                setDeleteConfirmId(null);
              }}>Delete</CustomButton>
            </CustomDialogFooter>
          </CustomDialogContent>
        </CustomDialog>
      </div>
    </>
  )
}
