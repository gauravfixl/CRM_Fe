"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getTeamById, getTeamMembers, type Team, type TeamMember } from "@/modules/project-management/team/hooks/teamHooks"
import { ArrowLeft, Users, Settings } from "lucide-react"
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
      const [teamRes, membersRes] = await Promise.all([
        getTeamById(params.teamId),
        getTeamMembers(params.teamId, params.projectId)
      ])
      setTeam(teamRes?.data?.data)
      setMembers(membersRes?.data?.data || [])
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("Failed to fetch team:", err)
      }
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
              <CustomButton size="sm">Add Member</CustomButton>
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
      </div>
    </>
  )
}
