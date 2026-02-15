"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { CustomSelect, CustomSelectItem } from "@/components/custom/CustomSelect"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectById, updateProject, deleteProject, archiveProject, type Project } from "@/modules/project-management/project/hooks/projectHooks"
import { showError, showSuccess } from "@/utils/toast"
import { ArrowLeft, Trash2, Save, Archive } from "lucide-react"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function ProjectSettingsPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public" as "public" | "private",
  })
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [archiveConfirm, setArchiveConfirm] = useState(false)

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
    const fetchProject = async () => {
      try {
        showLoader()
        const res = await getProjectById(params.projectId, params.workspaceId)
        const projectData = res?.data?.data
        setProject(projectData)
        setFormData({
          name: projectData.name,
          description: projectData.description || "",
          visibility: projectData.visibility,
        })
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.error("Failed to fetch project:", err)
        }
      } finally {
        hideLoader()
      }
    }

    if (params.projectId && params.workspaceId) {
      fetchProject()
    }
  }, [params.projectId, params.workspaceId, showLoader, hideLoader])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showError("Project name is required")
      return
    }

    try {
      showLoader()
      await updateProject(params.projectId, formData)
      router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}`)
    } catch (err) {
      console.error("Error updating project:", err)
    } finally {
      hideLoader()
    }
  }

  const handleDelete = async () => {
    try {
      showLoader()
      await deleteProject(params.projectId, params.workspaceId)
      router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects`)
    } catch (err) {
      console.error("Error deleting project:", err)
    } finally {
      hideLoader()
      setDeleteConfirm(false)
    }
  }

  const handleArchive = async () => {
    try {
      showLoader()
      await archiveProject(params.projectId)
      router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects`)
    } catch (err) {
      console.error("Error archiving project:", err)
    } finally {
      hideLoader()
      setArchiveConfirm(false)
    }
  }

  if (!project) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <>
      <SubHeader
        title="Project Settings"
        breadcrumbItems={[
          { label: "Dashboard", href: `/${orgName}/dashboard` },
          { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
          { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
          { label: project.name, href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}` },
          { label: "Settings", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/settings` },
        ]}
        rightControls={
          <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}`}>
            <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
              <ArrowLeft className="w-4 h-4" /> Back
            </CustomButton>
          </Link>
        }
      />

      <div className="p-4 max-w-3xl mx-auto space-y-6">
        {/* General Settings */}
        <FlatCard>
          <FlatCardHeader>
            <FlatCardTitle>General Settings</FlatCardTitle>
            <FlatCardDescription>
              Update project name, description, and visibility
            </FlatCardDescription>
          </FlatCardHeader>

          <FlatCardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  id="name"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <CustomTextarea
                  id="description"
                  placeholder="Enter project description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="visibility" className="text-sm font-medium">
                  Visibility
                </label>
                <CustomSelect
                  value={formData.visibility}
                  onValueChange={(value) => setFormData({ ...formData, visibility: value as "public" | "private" })}
                >
                  <CustomSelectItem value="public">Public - Visible to all workspace members</CustomSelectItem>
                  <CustomSelectItem value="private">Private - Only visible to project members</CustomSelectItem>
                </CustomSelect>
              </div>

              <div className="flex justify-end">
                <CustomButton type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </CustomButton>
              </div>
            </form>
          </FlatCardContent>
        </FlatCard>

        {/* Project Information */}
        <FlatCard>
          <FlatCardHeader>
            <FlatCardTitle>Project Information</FlatCardTitle>
            <FlatCardDescription>
              Read-only project metadata
            </FlatCardDescription>
          </FlatCardHeader>

          <FlatCardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project ID</label>
              <p className="text-base font-mono">{project._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created By</label>
              <p className="text-base">{project.createdBy?.email || "Unknown"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(project.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-base">{new Date(project.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className="text-base">{project.isArchived ? "Archived" : "Active"}</p>
            </div>
          </FlatCardContent>
        </FlatCard>

        {/* Danger Zone */}
        <FlatCard className="border-red-200 dark:border-red-900">
          <FlatCardHeader>
            <FlatCardTitle className="text-red-600">Danger Zone</FlatCardTitle>
            <FlatCardDescription>
              Irreversible and destructive actions
            </FlatCardDescription>
          </FlatCardHeader>

          <FlatCardContent className="space-y-4">
            {/* Archive Project */}
            <div className="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-900 rounded-lg">
              <div>
                <h4 className="font-medium text-orange-600">Archive Project</h4>
                <p className="text-sm text-muted-foreground">
                  Archive this project. It will be hidden but can be restored later.
                </p>
              </div>
              <CustomButton
                variant="outline"
                onClick={() => setArchiveConfirm(true)}
                className="flex items-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                disabled={project.isArchived}
              >
                <Archive className="w-4 h-4" />
                Archive
              </CustomButton>
            </div>

            {/* Delete Project */}
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
              <div>
                <h4 className="font-medium text-red-600">Delete Project</h4>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete the project and all its boards, tasks, and teams.
                </p>
              </div>
              <CustomButton
                variant="destructive"
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </CustomButton>
            </div>
          </FlatCardContent>
        </FlatCard>

        {/* Archive Confirmation Dialog */}
        <CustomDialog open={archiveConfirm} onOpenChange={setArchiveConfirm}>
          <CustomDialogContent>
            <CustomDialogHeader>
              <CustomDialogTitle>Archive Project</CustomDialogTitle>
              <CustomDialogDescription>
                Are you sure you want to archive "{project.name}"? The project will be hidden but can be restored later.
              </CustomDialogDescription>
            </CustomDialogHeader>
            <CustomDialogFooter>
              <CustomButton variant="outline" onClick={() => setArchiveConfirm(false)}>
                Cancel
              </CustomButton>
              <CustomButton onClick={handleArchive} className="bg-orange-600 hover:bg-orange-700">
                Archive Project
              </CustomButton>
            </CustomDialogFooter>
          </CustomDialogContent>
        </CustomDialog>

        {/* Delete Confirmation Dialog */}
        <CustomDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
          <CustomDialogContent>
            <CustomDialogHeader>
              <CustomDialogTitle>Delete Project</CustomDialogTitle>
              <CustomDialogDescription>
                Are you absolutely sure? This action cannot be undone. This will permanently delete
                the project "{project.name}" and all its associated data including:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>All boards and workflows</li>
                  <li>All tasks and subtasks</li>
                  <li>All team assignments</li>
                  <li>All project members</li>
                </ul>
              </CustomDialogDescription>
            </CustomDialogHeader>
            <CustomDialogFooter>
              <CustomButton variant="outline" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </CustomButton>
              <CustomButton variant="destructive" onClick={handleDelete}>
                Yes, Delete Project
              </CustomButton>
            </CustomDialogFooter>
          </CustomDialogContent>
        </CustomDialog>
      </div>
    </>
  )
}
