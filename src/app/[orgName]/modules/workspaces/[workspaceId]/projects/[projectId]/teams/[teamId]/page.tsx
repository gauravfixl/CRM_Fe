"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getTeamById, getTeamMembers, addTeamMember, getAssignableMembersForTeam, removeTeamMember, type Team, type TeamMember } from "@/modules/project-management/team/hooks/teamHooks"
import { ArrowLeft, Users, Settings, Plus, Trash2 } from "lucide-react"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle
} from "@/components/custom/CustomDialog"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomSelect, CustomSelectItem } from "@/components/custom/CustomSelect"
import { showSuccess, showError } from "@/utils/toast"
import {
  CustomTable,
  CustomTableBody,
  CustomTableCell,
  CustomTableHead,
  CustomTableHeader,
  CustomTableRow,
} from "@/components/custom/CustomTable"

export default function TeamDetailsPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [assignableMembers, setAssignableMembers] = useState<any[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState("")

  const { showLoader, hideLoader } = useLoaderStore()
  const params = useParams() as { orgName?: string; workspaceId: string; projectId: string; teamId: string }
  const router = useRouter()
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    const pOrg = params.orgName
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
  }, [params.orgName])

  useEffect(() => {
    fetchTeamData()
  }, [params.teamId])

  const fetchTeamData = async () => {
    try {
      showLoader()
      const [teamRes, membersRes, assignableRes] = await Promise.allSettled([
        getTeamById(params.teamId),
        getTeamMembers(params.teamId, params.projectId),
        getAssignableMembersForTeam(params.projectId, params.teamId)
      ])
      if (teamRes.status === 'fulfilled') setTeam(teamRes.value?.data?.data)
      if (membersRes.status === 'fulfilled') setMembers(membersRes.value?.data?.data || [])
      if (assignableRes.status === 'fulfilled') {
        const assignable = assignableRes.value?.data?.data?.members || assignableRes.value?.data?.members || assignableRes.value?.data?.data || []
        setAssignableMembers(Array.isArray(assignable) ? assignable : [])
      }
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("Failed to fetch team:", err)
      }
    } finally {
      hideLoader()
    }
  }

  const handleAddMember = async () => {
    if (!selectedMemberId) { showError("Please select a member"); return }
    try {
      showLoader()
      await addTeamMember(params.teamId, {
        projectId: params.projectId,
        memberId: selectedMemberId,
        role: "member"
      })
      setIsAddMemberOpen(false)
      setSelectedMemberId("")
      fetchTeamData()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to add member")
    } finally {
      hideLoader()
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      showLoader()
      await removeTeamMember(params.teamId, memberId, params.projectId)
      fetchTeamData()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to remove member")
    } finally {
      hideLoader()
    }
  }

  if (!team) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <>
      <SubHeader
        title={team.name}
        breadcrumbItems={[
          { label: "Dashboard", href: `/${orgName}/dashboard` },
          { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
          { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
          { label: "Teams", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams` },
          { label: team.name, href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams/${params.teamId}` },
        ]}
        rightControls={
          <div className="flex space-x-2">
            <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams`}>
              <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                <ArrowLeft className="w-4 h-4" /> Back
              </CustomButton>
            </Link>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Total Members</SmallCardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{team.membersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Team members</p>
            </SmallCardContent>
          </SmallCard>

          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Team Board</SmallCardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{team.hasTeamBoard ? "Yes" : "No"}</div>
              <p className="text-xs text-muted-foreground">Dedicated board</p>
            </SmallCardContent>
          </SmallCard>

          <SmallCard>
            <SmallCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SmallCardTitle className="text-sm font-medium">Status</SmallCardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </SmallCardHeader>
            <SmallCardContent>
              <div className="text-2xl font-bold">{team.isArchived ? "Archived" : "Active"}</div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </SmallCardContent>
          </SmallCard>
        </div>

        <FlatCard>
          <FlatCardHeader>
            <FlatCardTitle>Team Information</FlatCardTitle>
            <FlatCardDescription>Basic details about this team</FlatCardDescription>
          </FlatCardHeader>
          <FlatCardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base">{team.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-base">{team.description || "No description provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(team.createdAt).toLocaleString()}</p>
            </div>
          </FlatCardContent>
        </FlatCard>

        <FlatCard>
          <FlatCardHeader>
            <div className="flex justify-between items-center">
              <div>
                <FlatCardTitle>Team Members</FlatCardTitle>
                <FlatCardDescription>All members in this team</FlatCardDescription>
              </div>
              <CustomButton size="sm" onClick={() => setIsAddMemberOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Member
              </CustomButton>
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
                      <CustomTableCell>{member.role?.name}</CustomTableCell>
                      <CustomTableCell>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </CustomTableCell>
                      <CustomTableCell>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </CustomButton>
                      </CustomTableCell>
                    </CustomTableRow>
                  ))}
                </CustomTableBody>
              </CustomTable>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <p>No members yet. Add members to get started.</p>
              </div>
            )}
          </FlatCardContent>
        </FlatCard>

        {/* Add Member Dialog */}
        <CustomDialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <CustomDialogContent>
            <CustomDialogHeader>
              <CustomDialogTitle>Add Team Member</CustomDialogTitle>
              <CustomDialogDescription>
                {assignableMembers.length > 0
                  ? "Select a project member to add to this team."
                  : "Enter the member ID to add to this team."}
              </CustomDialogDescription>
            </CustomDialogHeader>
            <div className="space-y-4 py-4">
              {assignableMembers.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Member</label>
                  <CustomSelect value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    {assignableMembers.map((m: any) => (
                      <CustomSelectItem key={m.mId || m._id} value={m.mId || m._id}>
                        {m.email || m.fullName || m.mId}
                      </CustomSelectItem>
                    ))}
                  </CustomSelect>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member ID</label>
                  <CustomInput
                    placeholder="Enter project member ID"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                  />
                </div>
              )}
            </div>
            <CustomDialogFooter>
              <CustomButton variant="outline" onClick={() => { setIsAddMemberOpen(false); setSelectedMemberId("") }}>Cancel</CustomButton>
              <CustomButton onClick={handleAddMember}>Add Member</CustomButton>
            </CustomDialogFooter>
          </CustomDialogContent>
        </CustomDialog>
      </div>
    </>
  )
}
