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
import { MoreHorizontal, Plus, Eye, Edit, Trash2, Users, Archive } from "lucide-react"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getTeamsByWorkspace, deleteTeam, type Team } from "@/modules/project-management/team/hooks/teamHooks"
import { showSuccess, showError } from "@/utils/toast"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        fetchTeams()
    }, [params.workspaceId, params.projectId, currentPage])

    const fetchTeams = async () => {
        try {
            showLoader()
            const res = await getTeamsByWorkspace({
                workspaceId: params.workspaceId,
                projectId: params.projectId,
                page: currentPage,
                limit: pageSize,
            })
            setTeams(res?.data?.data?.teams || [])
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch teams:", err)
            }
        } finally {
            hideLoader()
        }
    }

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredTeams.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const currentTeams = filteredTeams.slice(startIndex, startIndex + pageSize)

    const handleDeleteTeam = async (teamId: string) => {
        try {
            showLoader()
            await deleteTeam(teamId, params.projectId)
            setTeams(teams.filter(t => t._id !== teamId))
            setDeleteConfirmId(null)
            showSuccess("Team deleted successfully!")
        } catch (err) {
            console.error("Error deleting team:", err)
            showError("Failed to delete team!")
        } finally {
            hideLoader()
        }
    }

    const totalTeams = teams.length
    const activeTeams = teams.filter(t => !t.isArchived).length
    const archivedTeams = teams.filter(t => t.isArchived).length

    return (
        <>
            <SubHeader
                title="Team Management"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: "Teams", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams/create`}>
                            <CustomButton className="flex items-center gap-1 text-xs h-8 px-3">
                                <Plus className="w-4 h-4" /> Create Team
                            </CustomButton>
                        </Link>
                    </div>
                }
            />

            <div className="space-y-4 p-4">
                {/* Dashboard cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Total Teams</SmallCardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold">{totalTeams}</div>
                            <p className="text-xs text-muted-foreground">All teams</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Active Teams</SmallCardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-green-600">{activeTeams}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard>
                        <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <SmallCardTitle className="text-sm font-medium">Archived</SmallCardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </SmallCardHeader>
                        <SmallCardContent>
                            <div className="text-2xl font-bold text-gray-600">{archivedTeams}</div>
                            <p className="text-xs text-muted-foreground">Archived teams</p>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                <FlatCard>
                    <FlatCardHeader>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div>
                                <FlatCardTitle>Teams Directory</FlatCardTitle>
                                <FlatCardDescription className="pt-1">
                                    Manage all your teams and members
                                </FlatCardDescription>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="relative max-w-sm w-full md:w-auto">
                                    <CustomInput
                                        placeholder="Search teams..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </FlatCardHeader>

                    <FlatCardContent>
                        {currentTeams.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Team Name</CustomTableHead>
                                        <CustomTableHead>Description</CustomTableHead>
                                        <CustomTableHead>Members</CustomTableHead>
                                        <CustomTableHead>Has Board</CustomTableHead>
                                        <CustomTableHead>Status</CustomTableHead>
                                        <CustomTableHead>Actions</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {currentTeams.map((team) => (
                                        <CustomTableRow key={team._id}>
                                            <CustomTableCell className="font-medium">{team.name}</CustomTableCell>
                                            <CustomTableCell>{team.description || "-"}</CustomTableCell>
                                            <CustomTableCell>{team.membersCount || 0}</CustomTableCell>
                                            <CustomTableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${team.hasTeamBoard
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {team.hasTeamBoard ? "Yes" : "No"}
                                                </span>
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${team.isArchived
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}>
                                                    {team.isArchived ? "Archived" : "Active"}
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
                                                            onSelect={() => {
                                                                router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams/${team._id}`)
                                                            }}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </CustomDropdownMenuItem>
                                                        <CustomDropdownMenuItem
                                                            className="text-red-600"
                                                            onSelect={() => {
                                                                setTimeout(() => setDeleteConfirmId(team._id), 0)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Team
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
                                No teams found.
                            </div>
                        )}
                    </FlatCardContent>

                    {currentTeams.length > 0 && (
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
                            <CustomDialogTitle>Delete Team</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you sure you want to delete this team? This action cannot be undone.
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</CustomButton>
                            <CustomButton variant="destructive" onClick={() => {
                                if (deleteConfirmId) handleDeleteTeam(deleteConfirmId);
                                setDeleteConfirmId(null);
                            }}>Delete</CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
