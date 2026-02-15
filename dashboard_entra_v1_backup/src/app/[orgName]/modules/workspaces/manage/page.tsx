"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardFooter, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import {
    CustomDropdownMenu,
    CustomDropdownMenuContent,
    CustomDropdownMenuItem,
    CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Users, FolderKanban, BarChart3 } from "lucide-react"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getMyWorkspaces, deleteWorkspace, type Workspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { showSuccess, showError } from "@/utils/toast"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function WorkspaceManagementPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    // Fetch workspaces on mount
    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                showLoader()
                // Using getMyWorkspaces for broader compatibility as getAllWorkspaces might require super-admin
                const res = await getMyWorkspaces()
                // API might return data in .data.workspaces or .data.data
                const workspacesData = res?.data?.workspaces || (Array.isArray(res?.data?.data) ? res.data.data : [])
                setWorkspaces(workspacesData)
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch workspaces:", err)
                }
            } finally {
                hideLoader()
            }
        }

        fetchWorkspaces()
    }, [showLoader, hideLoader])

    // Filter workspaces
    const filteredWorkspaces = workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workspace.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workspace.createdBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredWorkspaces.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const currentWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + pageSize)

    const handleDeleteWorkspace = async (workspaceId: string) => {
        try {
            showLoader()
            await deleteWorkspace(workspaceId)
            setWorkspaces(workspaces.filter(w => w._id !== workspaceId))
            setDeleteConfirmId(null)
            showSuccess("Workspace deleted successfully!")
        } catch (err) {
            console.error("Error deleting workspace:", err)
            showError("Failed to delete workspace!")
        } finally {
            hideLoader()
        }
    }

    const totalWorkspaces = workspaces.length
    const activeWorkspaces = workspaces.filter(w => !w.isDeleted).length

    return (
        <>
            <SubHeader
                title="Workspace Management"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces/manage` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/create`}>
                            <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                                <Plus className="w-4 h-4" /> Create Workspace
                            </CustomButton>
                        </Link>
                    </div>
                }
            />

            <div className="space-y-4 p-4">
                {/* Dashboard cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Workspaces</SmallCardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{totalWorkspaces}</div>
                            <p className="text-xs text-muted-foreground">All workspaces</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Active Workspaces</SmallCardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{activeWorkspaces}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">My Workspaces</SmallCardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{activeWorkspaces}</div>
                            <p className="text-xs text-muted-foreground">Where I'm a member</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Projects</SmallCardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Across all workspaces</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                <FlatCard>
                    <FlatCardHeader>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div>
                                <FlatCardTitle>Workspace Directory</FlatCardTitle>
                                <FlatCardDescription className="pt-1">
                                    Manage all your workspaces and projects
                                </FlatCardDescription>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="relative max-w-sm w-full md:w-auto">
                                    <CustomInput
                                        placeholder="Search workspaces..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </FlatCardHeader>

                    <FlatCardContent>
                        {currentWorkspaces.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Workspace Name</CustomTableHead>
                                        <CustomTableHead>Description</CustomTableHead>
                                        <CustomTableHead>Created By</CustomTableHead>
                                        <CustomTableHead>Created At</CustomTableHead>
                                        <CustomTableHead>Actions</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {currentWorkspaces.map((workspace) => (
                                        <CustomTableRow
                                            key={workspace._id}
                                            className="cursor-pointer hover:bg-slate-50/50 transition-colors group"
                                            onClick={() => {
                                                const wId = (workspace as any)._id || (workspace as any).id;
                                                console.log("Navigating to workspace root:", wId, workspace);
                                                if (wId) {
                                                    router.push(`/${orgName}/modules/workspaces/${wId}`);
                                                } else {
                                                    showError("Workspace ID not found!");
                                                }
                                            }}
                                        >
                                            <CustomTableCell className="font-semibold text-primary group-hover:underline">
                                                {workspace.name || "Unnamed Workspace"}
                                            </CustomTableCell>
                                            <CustomTableCell>{workspace.description || "--"}</CustomTableCell>
                                            <CustomTableCell>{(workspace.createdBy as any)?.email || (workspace.createdBy as any)?.fullName || (typeof workspace.createdBy === 'string' ? workspace.createdBy : "--")}</CustomTableCell>
                                            <CustomTableCell>
                                                {workspace.createdAt && !isNaN(Date.parse(workspace.createdAt))
                                                    ? new Date(workspace.createdAt).toLocaleDateString()
                                                    : "Recently Created"}
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <CustomDropdownMenu>
                                                        <CustomDropdownMenuTrigger asChild>
                                                            <CustomButton variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </CustomButton>
                                                        </CustomDropdownMenuTrigger>
                                                        <CustomDropdownMenuContent align="end">
                                                            <CustomDropdownMenuItem asChild>
                                                                <Link href={`/${orgName}/modules/workspaces/${(workspace as any)._id || (workspace as any).id}`} className="flex items-center w-full cursor-pointer">
                                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                                </Link>
                                                            </CustomDropdownMenuItem>
                                                            <CustomDropdownMenuItem asChild>
                                                                <Link href={`/${orgName}/modules/workspaces/${(workspace as any)._id || (workspace as any).id}/settings`} className="flex items-center w-full cursor-pointer">
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit Workspace
                                                                </Link>
                                                            </CustomDropdownMenuItem>
                                                            <CustomDropdownMenuItem
                                                                className="text-red-600"
                                                                onSelect={() => {
                                                                    setTimeout(() => setDeleteConfirmId(workspace._id), 0)
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Workspace
                                                            </CustomDropdownMenuItem>
                                                        </CustomDropdownMenuContent>
                                                    </CustomDropdownMenu>
                                                </div>
                                            </CustomTableCell>
                                        </CustomTableRow>
                                    ))}
                                </CustomTableBody>
                            </CustomTable>
                        ) : (
                            <div className="text-center text-muted-foreground py-6">
                                No workspaces found.
                            </div>
                        )}
                    </FlatCardContent>

                    {currentWorkspaces.length > 0 && (
                        <FlatCardFooter className="flex justify-between items-center">
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
                            <CustomDialogTitle>Delete Workspace</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you sure you want to delete this workspace? This will also delete all projects, boards, and tasks within it.
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</CustomButton>
                            <CustomButton variant="destructive" onClick={() => {
                                if (deleteConfirmId) handleDeleteWorkspace(deleteConfirmId);
                                setDeleteConfirmId(null);
                            }}>Delete</CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
