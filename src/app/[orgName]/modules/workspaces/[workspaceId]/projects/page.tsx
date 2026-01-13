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
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Archive, FolderKanban, Users, CheckCircle2, Clock } from "lucide-react"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getAllProjectsByWorkspace, deleteProject, type Project } from "@/modules/project-management/project/hooks/projectHooks"
import { showSuccess, showError } from "@/utils/toast"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                showLoader()
                const res = await getAllProjectsByWorkspace(params.workspaceId, {
                    page: currentPage,
                    limit: pageSize,
                })
                const projectsData = res?.data?.data?.projects || []
                setProjects(projectsData)
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch projects:", err)
                }
            } finally {
                hideLoader()
            }
        }

        if (params.workspaceId) {
            fetchProjects()
        }
    }, [params.workspaceId, currentPage, showLoader, hideLoader])

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.createdBy?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredProjects.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const currentProjects = filteredProjects.slice(startIndex, startIndex + pageSize)

    const handleDeleteProject = async (projectId: string) => {
        try {
            showLoader()
            await deleteProject(projectId, params.workspaceId)
            setProjects(projects.filter(p => p._id !== projectId))
            setDeleteConfirmId(null)
            showSuccess("Project deleted successfully!")
        } catch (err) {
            console.error("Error deleting project:", err)
            showError("Failed to delete project!")
        } finally {
            hideLoader()
        }
    }

    const totalProjects = projects.length
    const activeProjects = projects.filter(p => !p.isArchived).length
    const archivedProjects = projects.filter(p => p.isArchived).length

    return (
        <>
            <SubHeader
                title="Project Management"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/create`}>
                            <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                                <Plus className="w-4 h-4" /> Create Project
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
                            <SmallCardTitle className="text-sm font-medium">Total Projects</SmallCardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{totalProjects}</div>
                            <p className="text-xs text-muted-foreground">All projects</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Active Projects</SmallCardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{activeProjects}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Archived</SmallCardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-gray-600">{archivedProjects}</div>
                            <p className="text-xs text-muted-foreground">Archived projects</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Tasks</SmallCardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Across all projects</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                <FlatCard>
                    <FlatCardHeader>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div>
                                <FlatCardTitle>Project Directory</FlatCardTitle>
                                <FlatCardDescription className="pt-1">
                                    Manage all your projects and track progress
                                </FlatCardDescription>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="relative max-w-sm w-full md:w-auto">
                                    <CustomInput
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </FlatCardHeader>

                    <FlatCardContent>
                        {currentProjects.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Project Name</CustomTableHead>
                                        <CustomTableHead>Description</CustomTableHead>
                                        <CustomTableHead>Visibility</CustomTableHead>
                                        <CustomTableHead>Created By</CustomTableHead>
                                        <CustomTableHead>Created At</CustomTableHead>
                                        <CustomTableHead>Status</CustomTableHead>
                                        <CustomTableHead>Actions</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {currentProjects.map((project) => (
                                        <CustomTableRow
                                            key={project._id}
                                            className="cursor-pointer hover:bg-slate-50/50 transition-colors group"
                                            onClick={() => {
                                                const pId = (project as any)._id || (project as any).id;
                                                const wId = params.workspaceId;
                                                if (pId) router.push(`/${orgName}/modules/workspaces/${wId}/projects/${pId}/board`);
                                            }}
                                        >
                                            <CustomTableCell className="font-semibold text-primary group-hover:underline">
                                                {project.name}
                                            </CustomTableCell>
                                            <CustomTableCell>{project.description || "--"}</CustomTableCell>
                                            <CustomTableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${project.visibility === "public"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {project.visibility}
                                                </span>
                                            </CustomTableCell>
                                            <CustomTableCell>{project.createdBy?.email || project.createdBy?.fullName || "--"}</CustomTableCell>
                                            <CustomTableCell>
                                                {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Recently"}
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${project.isArchived
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}>
                                                    {project.isArchived ? "Archived" : "Active"}
                                                </span>
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <CustomDropdownMenu>
                                                    <CustomDropdownMenuTrigger asChild>
                                                        <CustomButton variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </CustomButton>
                                                    </CustomDropdownMenuTrigger>
                                                    <CustomDropdownMenuContent align="end">
                                                        <CustomDropdownMenuItem
                                                            onSelect={(e) => {
                                                                e.preventDefault()
                                                                const pId = (project as any)._id || (project as any).id;
                                                                if (pId) router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${pId}/board`)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" /> View Board
                                                        </CustomDropdownMenuItem>
                                                        <CustomDropdownMenuItem
                                                            onSelect={() => {
                                                                router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${project._id}/settings`)
                                                            }}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Project
                                                        </CustomDropdownMenuItem>
                                                        <CustomDropdownMenuItem
                                                            className="text-red-600"
                                                            onSelect={() => {
                                                                setTimeout(() => setDeleteConfirmId(project._id), 0)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                                                        </CustomDropdownMenuItem>
                                                    </CustomDropdownMenuContent>
                                                </CustomDropdownMenu>
                                            </CustomTableCell>
                                        </CustomTableRow>
                                    ))}
                                </CustomTableBody>
                            </CustomTable>
                        ) : (
                            <div className="text-center text-muted-foreground py-6">
                                No projects found.
                            </div>
                        )}
                    </FlatCardContent>

                    {currentProjects.length > 0 && (
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
                            <CustomDialogTitle>Delete Project</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you sure you want to delete this project? This will also delete all boards, tasks, and teams within it.
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</CustomButton>
                            <CustomButton variant="destructive" onClick={() => {
                                if (deleteConfirmId) handleDeleteProject(deleteConfirmId);
                                setDeleteConfirmId(null);
                            }}>Delete</CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
