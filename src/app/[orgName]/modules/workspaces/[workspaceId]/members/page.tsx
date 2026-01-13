"use client"

import { useParams } from "next/navigation"
import People from "@/components/project/People"
import { useAuthStore } from "@/lib/useAuthStore"

export default function MembersPage() {
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  const orgId = useAuthStore((state) => state.singleOrg?.organization?.id)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
        <p className="text-muted-foreground">Manage members and their roles within this workspace.</p>
      </div>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <People parentId={orgId} entityId={workspaceId} level="workspace" />
      </div>
    </div>
  )
}
