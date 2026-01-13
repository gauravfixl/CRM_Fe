"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardFooter, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import {
    CustomDropdownMenu,
    CustomDropdownMenuContent,
    CustomDropdownMenuItem,
    CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember, type WorkspaceMember } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { showError, showSuccess } from "@/utils/toast"
import { ArrowLeft, MoreHorizontal, Plus, Trash2, UserPlus, Shield } from "lucide-react"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"
import { CustomSelect, CustomSelectItem } from "@/components/custom/CustomSelect"

export default function WorkspaceMembersPage() {
    const [members, setMembers] = useState<WorkspaceMember[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalMembers, setTotalMembers] = useState(0)
    const [addMemberDialog, setAddMemberDialog] = useState(false)
    const [removeMemberDialog, setRemoveMemberDialog] = useState<string | null>(null)
    const [newMember, setNewMember] = useState({ email: "", role: "Member" })
    const pageSize = 10

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; id: string }
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        fetchMembers()
    }, [params.id, currentPage])

    const fetchMembers = async () => {
        try {
            showLoader()
            const res = await getWorkspaceMembers(params.id, {
                page: currentPage,
                limit: pageSize,
                email: searchTerm || undefined,
            })
            setMembers(res?.data?.data?.members || [])
            setTotalMembers(res?.data?.data?.total || 0)
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch members:", err)
            }
        } finally {
            hideLoader()
        }
    }

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMember.email.trim()) {
            showError("Email is required")
            return
        }

        try {
            showLoader()
            await addWorkspaceMember(params.id, newMember)
            setAddMemberDialog(false)
            setNewMember({ email: "", role: "Member" })
            fetchMembers()
        } catch (err) {
            console.error("Error adding member:", err)
        } finally {
            hideLoader()
        }
    }

    const handleRemoveMember = async (email: string) => {
        try {
            showLoader()
            await removeWorkspaceMember(params.id, { email, reason: "Removed by admin" })
            setRemoveMemberDialog(null)
            fetchMembers()
        } catch (err) {
            console.error("Error removing member:", err)
        } finally {
            hideLoader()
        }
    }

    const totalPages = Math.ceil(totalMembers / pageSize)

    return (
        <>
            <SubHeader
                title="Workspace Members"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Members", href: `/${orgName}/modules/workspaces/${params.id}/members` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/${params.id}`}>
                            <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </CustomButton>
                        </Link>
                        <CustomButton
                            onClick={() => setAddMemberDialog(true)}
                            className="flex items-center gap-1 text-xs h-8 px-3"
                        >
                            <Plus className="w-4 h-4" /> Add Member
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4">
                <FlatCard>
                    <FlatCardHeader>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div>
                                <FlatCardTitle>Members Directory</FlatCardTitle>
                                <FlatCardDescription>
                                    Manage workspace members and their roles
                                </FlatCardDescription>
                            </div>

                            <div className="flex items-center space-x-2">
                                <CustomInput
                                    placeholder="Search by email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64"
                                />
                                <CustomButton size="sm" onClick={fetchMembers}>Search</CustomButton>
                            </div>
                        </div>
                    </FlatCardHeader>

                    <FlatCardContent>
                        {members.length > 0 ? (
                            <CustomTable>
                                <CustomTableHeader>
                                    <CustomTableRow>
                                        <CustomTableHead>Name</CustomTableHead>
                                        <CustomTableHead>Email</CustomTableHead>
                                        <CustomTableHead>Role</CustomTableHead>
                                        <CustomTableHead>Status</CustomTableHead>
                                        <CustomTableHead>Joined At</CustomTableHead>
                                        <CustomTableHead>Actions</CustomTableHead>
                                    </CustomTableRow>
                                </CustomTableHeader>
                                <CustomTableBody>
                                    {members.map((member) => (
                                        <CustomTableRow key={member._id}>
                                            <CustomTableCell className="font-medium">
                                                {member.userId?.fullName || "N/A"}
                                            </CustomTableCell>
                                            <CustomTableCell>{member.userId?.email}</CustomTableCell>
                                            <CustomTableCell>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                                    {member.role?.name}
                                                </div>
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${member.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {member.status}
                                                </span>
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                {new Date(member.joinedAt).toLocaleDateString()}
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
                                                            className="text-red-600"
                                                            onSelect={() => {
                                                                setTimeout(() => setRemoveMemberDialog(member.userId?.email), 0)
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove Member
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
                                No members found.
                            </div>
                        )}
                    </FlatCardContent>

                    {members.length > 0 && (
                        <FlatCardFooter className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages} ({totalMembers} total members)
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

                {/* Add Member Dialog */}
                <CustomDialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
                    <CustomDialogContent>
                        <CustomDialogHeader>
                            <CustomDialogTitle>Add Member</CustomDialogTitle>
                            <CustomDialogDescription>
                                Add a new member to this workspace
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    id="email"
                                    type="email"
                                    placeholder="member@example.com"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium">
                                    Role
                                </label>
                                <CustomSelect
                                    value={newMember.role}
                                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                                >
                                    <CustomSelectItem value="WorkspaceAdmin">Workspace Admin</CustomSelectItem>
                                    <CustomSelectItem value="Member">Member</CustomSelectItem>
                                    <CustomSelectItem value="Viewer">Viewer</CustomSelectItem>
                                </CustomSelect>
                            </div>
                            <CustomDialogFooter>
                                <CustomButton type="button" variant="outline" onClick={() => setAddMemberDialog(false)}>
                                    Cancel
                                </CustomButton>
                                <CustomButton type="submit">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add Member
                                </CustomButton>
                            </CustomDialogFooter>
                        </form>
                    </CustomDialogContent>
                </CustomDialog>

                {/* Remove Member Dialog */}
                <CustomDialog open={!!removeMemberDialog} onOpenChange={() => setRemoveMemberDialog(null)}>
                    <CustomDialogContent>
                        <CustomDialogHeader>
                            <CustomDialogTitle>Remove Member</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you sure you want to remove this member from the workspace?
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setRemoveMemberDialog(null)}>
                                Cancel
                            </CustomButton>
                            <CustomButton
                                variant="destructive"
                                onClick={() => {
                                    if (removeMemberDialog) handleRemoveMember(removeMemberDialog)
                                }}
                            >
                                Remove
                            </CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
