"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SettingsLayout from "@/components/SettingsLayout"
import { getWorkspaceById, getWorkspaceMembers, updateWorkspace, deleteWorkspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import People from "@/components/project/People"
import { useLoaderStore } from "@/lib/loaderStore"
import { useAuthStore } from "@/lib/useAuthStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SmallCard, SmallCardContent, SmallCardHeader, SmallCardTitle } from "@/components/custom/SmallCard"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FolderKanban, Save, Trash2, AlertTriangle, ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
  const router = useRouter()
  const workspaceId = params?.workspaceId as string
  const orgName = params?.orgName as string
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
        const ws = wsRes?.data?.workspace || wsRes?.data?.data || null
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

  const handleDeleteWorkspace = async () => {
    try {
      showLoader()
      await deleteWorkspace(workspaceId)
      toast({ title: "Success", description: "Workspace deleted successfully." })
      router.push(`/${orgName}/modules/workspaces`)
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete workspace.", variant: "destructive" })
    } finally {
      hideLoader()
    }
  }

  if (!workspace) {
    return <div className="p-8 text-center text-muted-foreground">Loading workspace settings...</div>
  }

  const renderContent = (selectedTab: string) => {
    switch (selectedTab) {
      case "Details":
        return (
          <div className="space-y-8 max-w-4xl animate-in fade-in-50">
            {/* Header Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <FolderKanban className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">General Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your workspace profile and preferences.</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Workspace Profile</CardTitle>
                <CardDescription>Update your workspace details visible to other members.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="ws-name">Workspace Name</Label>
                  <Input
                    id="ws-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter workspace name"
                    className="max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">This is your workspace's visible name within the organization.</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ws-desc">Description</Label>
                  <Textarea
                    id="ws-desc"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Describe what this workspace is for..."
                    className="max-w-xl min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">A brief description to help members understand the goal of this workspace.</p>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="bg-muted/20 py-4 flex justify-between items-center">
                <span className="text-xs text-muted-foreground italic">Last updated: {new Date(workspace.updatedAt || Date.now()).toLocaleDateString()}</span>
                <Button onClick={handleUpdateWorkspace} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>

            <div className="pt-6">
              <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Danger Zone
              </h3>
              <Card className="border-red-200 dark:border-red-900/50 bg-red-50/10 dark:bg-red-950/10">
                <CardHeader>
                  <CardTitle className="text-base text-red-600">Delete Workspace</CardTitle>
                  <CardDescription>
                    Permanently remove this workspace and all its contents. This action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" /> Delete Workspace
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the workspace
                          <span className="font-semibold text-foreground"> "{workspace.name}" </span>
                          and remove all associated data including projects, tasks, and files.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteWorkspace} className="bg-red-600 hover:bg-red-700">
                          Yes, delete workspace
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "Summary":
        return (
          <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50">
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Projects</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-3xl font-bold text-primary">{workspace.projects?.length || 0}</p></SmallCardContent>
            </SmallCard>
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Members</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-3xl font-bold text-blue-600">{workspace.members?.length || 0}</p></SmallCardContent>
            </SmallCard>
            <SmallCard>
              <SmallCardHeader><SmallCardTitle>Created Date</SmallCardTitle></SmallCardHeader>
              <SmallCardContent><p className="text-xl font-medium">{new Date(workspace.createdAt).toLocaleDateString()}</p></SmallCardContent>
            </SmallCard>
          </div>
        )
      case "People":
        return <People parentId={orgId} entityId={workspaceId} level="workspace" />
      default:
        return <div className="text-muted-foreground p-6 flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
          <p>This section is under development.</p>
        </div>
    }
  }

  return (
    <SettingsLayout
      title={`Settings: ${workspace.name}`}
      menuItems={workspaceMenu}
      renderContent={renderContent}
    />
  )
}
