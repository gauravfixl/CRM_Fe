"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, ArrowLeft, Search, RotateCcw, Trash2, Building, Calendar, MapPin } from 'lucide-react'
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { getAllDeletedFirms } from "@/hooks/firmHooks"
import { useEffect } from "react"
import { restoreFirm } from "@/hooks/firmHooks"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter
} from "@/components/custom/CustomDialog"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "@/components/custom/Permission"
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function DeletedFirmsPage() {
  const { firms } = useAppStore()
  const { showLoader, hideLoader } = useLoaderStore()   // <-- USE YOUR LOADER STORE
  const [searchTerm, setSearchTerm] = useState("")
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null)
  const [deletedFirms, setDeletedFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust as needed


  // Filter deleted firms only
  // const deletedFirms = firms.filter(firm => firm.isDeleted)
  const [orgName, setOrgName] = useState("")
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  // const filteredFirms = deletedFirms.filter(firm =>
  //   firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   firm.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   firm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   firm.id.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  const handleRestoreFirm = async (firmId: string) => {
    try {
      showLoader()  // <-- SHOW LOADER
      const response = await restoreFirm(firmId)

      // Remove restored firm locally
      setDeletedFirms((prev) => prev.filter((firm) => firm._id !== firmId))

      setRestoreConfirmId(null)
      toast.success("Firm restored successfully!")
    } catch (err) {
      console.error("Error restoring firm:", err)
      toast.error("Failed to restore firm!")
    } finally {
      hideLoader()  // <-- HIDE LOADER
    }
  }




  useEffect(() => {
    const fetchDeletedFirms = async () => {
      try {
        showLoader()  // <-- SHOW LOADER while fetching
        const response = await getAllDeletedFirms()
        setDeletedFirms(response.data?.firms || [])
      } catch (err) {
        console.error("Failed to fetch deleted firms:", err)
        toast.error("Failed to fetch deleted firms.")
      } finally {
        hideLoader()  // <-- HIDE LOADER when done
      }
    }
    fetchDeletedFirms()
  }, [showLoader, hideLoader])
  function truncateWebsite(url: string, startLength = 10, endLength = 10) {
    if (url.length <= startLength + endLength + 3) return url
    const start = url.slice(0, startLength)
    const end = url.slice(-endLength)
    return `${start}...${end}`
  }
  const totalPages = Math.ceil(deletedFirms.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDeletedFirms = deletedFirms.slice(startIndex, startIndex + pageSize);


  return (
    <div className="space-y-3 deleted-firms-page">
      <div className="flex flex-col items-start space-y-4">
        <Link href={`/${orgName}/modules/firm-management/firms`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Firms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Deleted Firms</h1>
          <p className="text-muted-foreground">
            Manage and restore deleted firms
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="deleted-firms-header-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deleted Firms</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deletedFirms.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for restore
            </p>
          </CardContent>
        </Card>
        {/* <Card> */}
        {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deletedFirms.reduce((sum, firm) => sum + firm.employeeCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From deleted firms
            </p>
          </CardContent> */}
        {/* </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lost Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deletedFirms.length > 0 ? "~$" + (deletedFirms.length * 2.1).toFixed(1) + "M" : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated lost revenue
            </p>
          </CardContent>
        </Card> */}
      </div>

      <Card >
        <CardHeader>
          <CardTitle>Deleted Firms</CardTitle>
          <CardDescription>
            Firms that have been deleted and can be restored
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deleted firms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="no-deleted-firms-card">
          {deletedFirms.length === 0 ? (
            <div className="text-center py-8">
              <Trash2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No deleted firms</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {deletedFirms.length === 0
                  ? "All firms are active. No firms have been deleted."
                  : "No firms match your search criteria."
                }
              </p>
            </div>
          ) : (
            <Table className="deleted-firms-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Firm Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>   <MapPin className="mr-2 h-3 w-3" />Location</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>GST NO.</TableHead>

                  <TableHead>Deleted Date</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDeletedFirms.map((firm) => (
                  <TableRow key={firm._id} className="opacity-75">
                    <TableCell>
                      <div>
                        <div className="font-medium">{firm.FirmName}</div>
                        {/* <div className="text-sm text-muted-foreground">{firm._id}</div> */}
                        {/* <div className="text-sm text-muted-foreground">{firm.registrationNumber}</div> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{firm.email}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">

                        {[firm.add.city]
                          .filter(Boolean)
                          .join(", ")}
                      </div>

                    </TableCell>
                    <TableCell className="text-center">
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
                    </TableCell>

                    <TableCell className="font-medium">{firm.gst_no}</TableCell>
                    {/* <TableCell>
                      <Badge className={getStatusColor(firm.status)}>
                        {firm.status}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-3 w-3" />
                        {new Date(firm.deletedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <Permission module="firm" action="RESTORE_FIRM">
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-green-600"
                              onSelect={() => {
                                // Radix will close the dropdown automatically first
                                setTimeout(() => setRestoreConfirmId(firm._id), 0);
                              }}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restore Firm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </TableCell>
                    </Permission>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {deletedFirms.length > 0 && (
          <CardFooter className="flex justify-between items-center delete-firms-page-controls">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}

      </Card>


      <CustomDialog
        open={!!restoreConfirmId}
        onOpenChange={() => setRestoreConfirmId(null)}
      >
        <CustomDialogContent>
          <CustomDialogHeader>
            <CustomDialogTitle>Restore Firm</CustomDialogTitle>
            <CustomDialogDescription>
              Are you sure you want to restore this firm? It will be moved back to the active firms list.
            </CustomDialogDescription>
          </CustomDialogHeader>
          <CustomDialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestoreConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                if (restoreConfirmId) handleRestoreFirm(restoreConfirmId)
                setRestoreConfirmId(null)
              }}
            >
              Restore
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  )
}
