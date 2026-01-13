"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { createWorkspace } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { showError } from "@/utils/toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateWorkspacePage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            showError("Workspace name is required")
            return
        }

        try {
            showLoader()
            // Using params.orgName as the orgId since the URL follows /[orgId]/...
            await createWorkspace(formData, params.orgName)
            router.push(`/${orgName}/modules/workspaces`)
        } catch (err: any) {
            console.error("Error creating workspace:", err.response?.data || err.message)
            showError(err?.response?.data?.message || "Failed to create workspace. Please ensure you have selected an organization.")
        } finally {
            hideLoader()
        }
    }

    return (
        <>
            <SubHeader
                title="Create Workspace"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Create", href: `/${orgName}/modules/workspaces/create` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces`}>
                        <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                            <ArrowLeft className="w-4 h-4" /> Back to Workspaces
                        </CustomButton>
                    </Link>
                }
            />

            <div className="p-4 max-w-2xl mx-auto">
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>New Workspace</FlatCardTitle>
                        <FlatCardDescription>
                            Create a new workspace to organize your projects and teams
                        </FlatCardDescription>
                    </FlatCardHeader>

                    <FlatCardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="flex justify-end space-x-2">
                                <Link href={`/${orgName}/modules/workspaces`}>
                                    <CustomButton type="button" variant="outline">
                                        Cancel
                                    </CustomButton>
                                </Link>
                                <CustomButton type="submit">
                                    Create Workspace
                                </CustomButton>
                            </div>
                        </form>
                    </FlatCardContent>
                </FlatCard>
            </div>
        </>
    )
}
