"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import SettingsLayout from "@/components/SettingsLayout"
import People from "@/components/project/People"
import { getTeamById, getAllTeamMembers } from "@/hooks/teamHooks" // create similar hooks as workspaceHooks
import { useLoaderStore } from "@/lib/loaderStore"
import { useAuthStore } from "@/lib/useAuthStore"

const teamMenu = [
  "Details",
  "Summary",
  "Members",
  "Permissions",
]

export default function TeamSettingsPage() {
  const params = useParams()
  const teamId = params?.teamId as string
  const projectId= params?.projectId as string
  const workspaceId = params?.workspaceId as string
  const orgId = useAuthStore((state) => state.singleOrg?.organization?.id)

  const [team, setTeam] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const { showLoader, hideLoader } = useLoaderStore()

  useEffect(() => {
    if (!teamId) return

    const fetchTeam = async () => {
      try {
        showLoader()
        const res = await getTeamById(teamId)
        setTeam(res?.data?.team || null)
      } catch (err) {
        console.error("Error fetching team:", err)
      } finally {
        hideLoader()
      }
    }

    fetchTeam()
  }, [teamId])

  useEffect(() => {
    if (!teamId) return

    const fetchTeamMembers = async () => {
      try {
        showLoader()
        const res = await getAllTeamMembers(teamId,projectId)
        setTeamMembers(res?.data?.members || [])
      } catch (err) {
        console.error("Error fetching team members:", err)
      } finally {
        hideLoader()
      }
    }

    fetchTeamMembers()
  }, [teamId])

//   if (!team) {
//     return <div className="p-6 text-red-500">Team not found</div>
//   }

  const renderContent = (selectedTab: string) => {
    switch (selectedTab) {
      case "Details":
        return <div className="p-4">Team Details form here</div>
      case "Summary":
        return <div className="p-4">Team Summary content here</div>
      case "Members":
        return <People parentId={projectId} entityId={teamId} level="team" />
      case "Permissions":
        return <div className="p-4">Team Permissions settings here</div>
      default:
        return <div className="text-gray-500">Coming soon: {selectedTab}</div>
    }
  }

  return (
    <SettingsLayout
      title={`Team: ${team?.name}`}
      menuItems={teamMenu}
      renderContent={renderContent}
    />
  )
}
