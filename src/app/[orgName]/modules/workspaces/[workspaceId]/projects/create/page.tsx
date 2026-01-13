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
import { createProject } from "@/modules/project-management/project/hooks/projectHooks"
import { listTemplates, type ProjectTemplate } from "@/modules/project-management/template/hooks/templateHooks"
import { showSuccess, showError } from "@/utils/toast"
import { ArrowLeft, Layout } from "lucide-react"

export default function CreateProjectPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        visibility: "public" as "public" | "private",
        templateId: "",
    })

    const [templates, setTemplates] = useState<ProjectTemplate[]>([])
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)

        const fetchTemplates = async () => {
            setIsLoadingTemplates(true)
            try {
                const res = await listTemplates()
                setTemplates(res.data.templates || [])
            } catch (err) {
                console.error("Failed to fetch templates:", err)
            } finally {
                setIsLoadingTemplates(false)
            }
        }
        fetchTemplates()
    }, [params.orgName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            showError("Project name is required")
            return
        }

        try {
            showLoader()
            await createProject(params.workspaceId, {
                name: formData.name,
                description: formData.description,
                visibility: formData.visibility,
                templateId: formData.templateId || undefined,
            })
            router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects`)
        } catch (err) {
            console.error("Error creating project:", err)
        } finally {
            hideLoader()
        }
    }

    return (
        <>
            <SubHeader
                title="Create Project"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: "Create", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/create` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects`}>
                        <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                            <ArrowLeft className="w-4 h-4" /> Back to Projects
                        </CustomButton>
                    </Link>
                }
            />

            <div className="p-4 max-w-2xl mx-auto">
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>New Project</FlatCardTitle>
                        <FlatCardDescription>
                            Create a new project to organize your tasks and teams
                        </FlatCardDescription>
                    </FlatCardHeader>

                    <FlatCardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2">
                                <label htmlFor="template" className="text-sm font-medium">
                                    Project Template (Optional)
                                </label>
                                <CustomSelect
                                    value={formData.templateId}
                                    onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                                    disabled={isLoadingTemplates}
                                >
                                    <CustomSelectItem value="">No Template - Start from scratch</CustomSelectItem>
                                    {templates.map((template) => (
                                        <CustomSelectItem key={template._id} value={template._id}>
                                            <div className="flex items-center gap-2">
                                                <Layout className="h-4 w-4" />
                                                {template.name}
                                            </div>
                                        </CustomSelectItem>
                                    ))}
                                    {/* Fallback hardcoded for demo if DB is empty */}
                                    {templates.length === 0 && !isLoadingTemplates && (
                                        <>
                                            <CustomSelectItem value="kanban">Kanban Board</CustomSelectItem>
                                            <CustomSelectItem value="scrum">Scrum Board</CustomSelectItem>
                                            <CustomSelectItem value="bug-tracking">Bug Tracking</CustomSelectItem>
                                        </>
                                    )}
                                </CustomSelect>
                                <p className="text-xs text-muted-foreground">
                                    Templates provide pre-configured workflows and board layouts
                                </p>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects`}>
                                    <CustomButton type="button" variant="outline">
                                        Cancel
                                    </CustomButton>
                                </Link>
                                <CustomButton type="submit">
                                    Create Project
                                </CustomButton>
                            </div>
                        </form>
                    </FlatCardContent>
                </FlatCard>
            </div>
        </>
    )
}
