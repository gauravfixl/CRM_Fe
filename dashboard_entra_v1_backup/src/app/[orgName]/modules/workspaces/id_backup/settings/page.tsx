"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getWorkspaceById, updateWorkspace, deleteWorkspace, type Workspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { showError, showSuccess } from "@/utils/toast"
import { ArrowLeft, Trash2, Save } from "lucide-react"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function WorkspaceSettingsPage() {
    const [workspace, setWorkspace] = useState<Workspace | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; id: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                showLoader()
                const res = await getWorkspaceById(params.id)
                const workspaceData = res?.data?.workspace
                setWorkspace(workspaceData)
                setFormData({
                    name: workspaceData.name,
                    description: workspaceData.description || "",
                })
            } catch (err: any) {
                if (err?.response?.status !== 401) {
                    console.error("Failed to fetch workspace:", err)
                }
            } finally {
                hideLoader()
            }
        }

        if (params.id) {
            fetchWorkspace()
        }
    }, [params.id, showLoader, hideLoader])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            showError("Workspace name is required")
            return
        }

        try {
            showLoader()
            await updateWorkspace(params.id, formData)
            router.push(`/${orgName}/modules/workspaces/${params.id}`)
        } catch (err) {
            console.error("Error updating workspace:", err)
        } finally {
            hideLoader()
        }
    }

    const handleDelete = async () => {
        try {
            showLoader()
            await deleteWorkspace(params.id)
            router.push(`/${orgName}/modules/workspaces`)
        } catch (err) {
            console.error("Error deleting workspace:", err)
        } finally {
            hideLoader()
            setDeleteConfirm(false)
        }
    }

    if (!workspace) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <>
            <SubHeader
                title="Workspace Settings"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: workspace.name, href: `/${orgName}/modules/workspaces/${params.id}` },
                    { label: "Settings", href: `/${orgName}/modules/workspaces/${params.id}/settings` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces/${params.id}`}>
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
                            Update workspace name and description
                        </FlatCardDescription>
                    </FlatCardHeader>

                    <FlatCardContent>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Workspace Name <span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    id="name"
                                    placeholder="Enter workspace name"
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
                                    placeholder="Enter workspace description (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                />
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

                {/* Workspace Information */}
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>Workspace Information</FlatCardTitle>
                        <FlatCardDescription>
                            Read-only workspace metadata
                        </FlatCardDescription>
                    </FlatCardHeader>

                    <FlatCardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Workspace ID</label>
                            <p className="text-base font-mono">{workspace._id}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Created By</label>
                            <p className="text-base">{workspace.createdBy?.email || "Unknown"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Created At</label>
                            <p className="text-base">{new Date(workspace.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                            <p className="text-base">{new Date(workspace.updatedAt).toLocaleString()}</p>
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

                    <FlatCardContent>
                        <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                            <div>
                                <h4 className="font-medium text-red-600">Delete Workspace</h4>
                                <p className="text-sm text-muted-foreground">
                                    This will permanently delete the workspace and all its projects, boards, and tasks.
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

                {/* Delete Confirmation Dialog */}
                <CustomDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                    <CustomDialogContent>
                        <CustomDialogHeader>
                            <CustomDialogTitle>Delete Workspace</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you absolutely sure? This action cannot be undone. This will permanently delete
                                the workspace "{workspace.name}" and all its associated data including:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>All projects</li>
                                    <li>All boards and workflows</li>
                                    <li>All tasks and subtasks</li>
                                    <li>All team assignments</li>
                                </ul>
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setDeleteConfirm(false)}>
                                Cancel
                            </CustomButton>
                            <CustomButton variant="destructive" onClick={handleDelete}>
                                Yes, Delete Workspace
                            </CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
