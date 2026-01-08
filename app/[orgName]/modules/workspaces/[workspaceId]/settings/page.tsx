"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import SettingsLayout from "@/components/SettingsLayout"
import { getWorkspaceById, getWorkspaceMembers, updateWorkspace } from "@/hooks/workspaceHooks"
import People from "@/components/project/People"
import { useLoaderStore } from "@/lib/loaderStore"
import { useAuthStore } from "@/lib/useAuthStore"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { useToast } from "@/hooks/use-toast"

const workspaceMenu = [
  "Details",
  "Summary",
  "People",
  "Permissions",
  {
    title: "Notifications",
    children: ["Settings", "Project email audit"],
  },
]

export default function WorkSpaceSettingsPage() {
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  const orgId = useAuthStore((state) => state.singleOrg?.orgId)
  const [workspace, setWorkspace] = useState<any>(null)
  const { showLoader, hideLoader } = useLoaderStore()
  const { toast } = useToast()

  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  useEffect(() => {
    if (!workspaceId) return

    const fetchData = async () => {
      try {
        showLoader()
        const [wsRes] = await Promise.all([
          getWorkspaceById(workspaceId),
          getWorkspaceMembers(workspaceId)
        ])
        const ws = wsRes?.data?.workspace || null
        setWorkspace(ws)
        if (ws) {
          setEditName(ws.name || "")
          setEditDescription(ws.description || "")
        }
      } catch (err) {
        console.error("Error fetching workspace data:", err)
      } finally {
        hideLoader()
      }
    }

    fetchData()
  }, [workspaceId, showLoader, hideLoader])

  const handleUpdateWorkspace = async () => {
    try {
      showLoader()
      await updateWorkspace(workspaceId, { name: editName, description: editDescription })
      setWorkspace({ ...workspace, name: editName, description: editDescription })
      toast({ title: "Success", description: "Workspace updated successfully." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update workspace.", variant: "destructive" })
    } finally {
      hideLoader()
    }
  }

  if (!workspace) {
    return <div className="p-6 text-red-500">Workspace not found</div>
  }

  const renderContent = (selectedTab: string) => {
    switch (selectedTab) {
      case "Details":
        return (
          <div className="p-6 space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <CustomLabel>Workspace Name</CustomLabel>
                <CustomInput value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <CustomLabel>Description</CustomLabel>
                <CustomInput value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <CustomButton onClick={handleUpdateWorkspace}>Save Changes</CustomButton>
            </div>
          </div>
        )
      case "Summary":
        return (
          <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Projects</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-2xl font-bold">{workspace.projects?.length || 0}</p></SmallCardContent>
            </SmallCard>
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Total Tasks</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-2xl font-bold">--</p></SmallCardContent>
            </SmallCard>
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Created At</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-sm">{new Date(workspace.createdAt).toLocaleDateString()}</p></SmallCardContent>
            </SmallCard>
          </div>
        )
      case "People":
        return <People parentId={orgId} entityId={workspaceId} level="workspace" />
      default:
        return <div className="text-gray-500 p-6">Content for {selectedTab} is under development.</div>
    }
  }

  return (
    <SettingsLayout
      title={`Workspace: ${workspace.name}`}
      menuItems={workspaceMenu}
      renderContent={renderContent}
    />
  )
}
