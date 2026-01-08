
"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Plus, Search, Trash2, Eye, Edit, Activity, Users, Building } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/useAuthStore"
import { Permission } from "@/components/custom/Permission"
import { SmallCard, SmallCardContent, SmallCardDescription, SmallCardFooter, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard } from "@/components/custom/FlatCard"
export default function FirmsPage() {
  const { firms, setFirms } = useAppStore()
  const { showLoader, hideLoader } = useLoaderStore() // <-- use loader store
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState("")
  const userRole = useAuthStore((state) => state.userRole);
  const permissions = useAuthStore((state) => state.permissions);
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  const activeFirms = Array.isArray(firms) ? firms.filter(firm => !firm.isDeleted) : [];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // firms per page






  // Filter firms by multiple fields
  const filteredFirms = activeFirms.filter(firm =>
    (firm.FirmName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.add.address1 || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.add.address2 || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.add.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.add.state || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.add.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.gst_no || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm._id || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

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
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        showLoader()
        const res = await getAllFirms()
        const firmsData = res?.data?.firms || []
        setFirms(firmsData)
      } catch (err) {
        console.error("Failed to fetch firms:", err)
        // toast.error("Failed to fetch firms.")
      } finally {
        hideLoader()
      }
    }

    fetchFirms()
  }, [setFirms, showLoader, hideLoader])

  const totalFirms = activeFirms.length
  const activeFirmsCount = activeFirms.filter(f => f.status === "Active").length
  const inactiveFirms = activeFirms.filter(f => f.status === "Inactive").length
  const totalEmployees = activeFirms.reduce((sum, firm) => sum + (firm.employeeCount || 0), 0)
  const router = useRouter()

  function truncateWebsite(url: string, startLength = 10, endLength = 10) {
    if (url.length <= startLength + endLength + 3) return url
    const start = url.slice(0, startLength)
    const end = url.slice(-endLength)
    return `${start}...${end}`
  }

  return (
    <>
      <SubHeader
        title="Firm Management"
        breadcrumbItems={[
          { label: "All Organizations", href: `/${orgName}/modules/organization/all-org` },
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

      <div className="space-y-3 all-firms-page p-4 -mt-16 z-10 ">

        <div className="flex items-center justify-between">




        </div>

        {/* Dashboard cards */}
        <div className="grid gap-4 md:grid-cols-4 add-firm-dashboard-cards">
          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Total Firms</SmallCardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{totalFirms}</div>
              <p className="text-xs text-muted-foreground">Registered firms</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Active Firms</SmallCardTitle>
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold text-green-600">{activeFirmsCount}</div>
              <p className="text-xs text-muted-foreground">Currently operating</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Inactive Firms</SmallCardTitle>
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold text-red-600">{inactiveFirms}</div>
              <p className="text-xs text-muted-foreground">Not operating</p>
            </SmallCardContent>
          </SmallCard>
          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Total Employees</SmallCardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Across all firms</p>
            </SmallCardContent>
          </SmallCard>
        </div>



        <FlatCard className="all-firms-directory-card">

          <FlatCardHeader>
            <div className="flex flex-row justify-between items-center w-full">
              {/* Left: Title + Description */}
              <div>
                <FlatCardTitle>Firm Directory</FlatCardTitle>
                <FlatCardDescription className="pt-1">
                  Complete overview of all registered firms
                </FlatCardDescription>
              </div>

              {/* Right: Search input */}
              <div className="flex items-center space-x-2">
                <div className="relative max-w-sm w-full md:w-auto">
                  {/* <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                  <CustomInput
                    placeholder="Search firms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </FlatCardHeader>


          <FlatCardContent>
            {currentFirms.length > 0 ? (
              <CustomTable className="all-firms-table">
                <CustomTableHeader className="all-firms-table-head">
                  <CustomTableRow>
                    <CustomTableHead>Firm Name</CustomTableHead>
                    <CustomTableHead>Contact Email</CustomTableHead>
                    <CustomTableHead>GST No.</CustomTableHead>
                    <CustomTableHead>Address</CustomTableHead>
                    <CustomTableHead>Phone</CustomTableHead>
                    <CustomTableHead>Website</CustomTableHead>
                    <CustomTableHead>Actions</CustomTableHead>
                    <CustomTableHead className="w-[70px]"></CustomTableHead>
                  </CustomTableRow>
                </CustomTableHeader>
                <CustomTableBody className="all-firms-table-body">
                  {currentFirms.map((firm) => {
                    const address = firm.add || { city: "", state: "", country: "" }
                    return (
                      <CustomTableRow key={firm._id}>
                        <CustomTableCell>{firm.FirmName}</CustomTableCell>
                        <CustomTableCell>{firm.email || "-"}</CustomTableCell>
                        <CustomTableCell>{firm.gst_no || "-"}</CustomTableCell>
                        <CustomTableCell>
                          {address.city}, {address.state}, {address.country}
                        </CustomTableCell>
                        <CustomTableCell>
                          {firm.phone ? firm.phone.replace(/^\+91-?/, "") : "-"}
                        </CustomTableCell>
                        <CustomTableCell>
                          {firm.website ? (
                            <a
                              href={firm.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {truncateWebsite(firm.website)}
                            </a>
                          ) : (
                            "-"
                          )}
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
