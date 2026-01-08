"use client"

import { WorkspaceDashboard } from "@/components/workspace-dashboard"
import { getWorkspaceAnalytics } from "@/hooks/workspaceHooks"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLoaderStore } from "@/lib/loaderStore"
import { Permission } from "@/components/custom/Permission"

export default function WorkspaceDashboardPage() {
  const { workspaceId } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showLoader, hideLoader } = useLoaderStore()

  useEffect(() => {
    if (!workspaceId) return

    const fetchAnalytics = async () => {
      showLoader()
      try {
        const res = await getWorkspaceAnalytics(workspaceId as string)
        setAnalytics(res.data.analytics)
      } catch (err) {
        console.error("Error fetching workspace analytics:", err)
      } finally {
        setLoading(false)
        hideLoader()
      }
    }

    fetchAnalytics()
  }, [workspaceId, showLoader, hideLoader])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading workspace analytics...</div>
  }

  return (
    <div className="overflow-y-auto h-[85vh] hide-scrollbar">
      <Permission module="project" action="VIEW_WORKSPACE_ANALYTICS">
        <WorkspaceDashboard
          workspaceId={workspaceId as string}
          analytics={analytics}
        />
      </Permission>
    </div>
  )
}
