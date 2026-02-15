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
import { createTeam } from "@/modules/project-management/team/hooks/teamHooks"
import { showError } from "@/utils/toast"
import { ArrowLeft } from "lucide-react"

export default function CreateTeamPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        useTeamBoard: false,
    })

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string }
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
            showError("Team name is required")
            return
        }

        try {
            showLoader()
            await createTeam({
                name: formData.name,
                description: formData.description,
                workspaceId: params.workspaceId,
                projectId: params.projectId,
                useTeamBoard: formData.useTeamBoard,
            })
            router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams`)
        } catch (err) {
            console.error("Error creating team:", err)
        } finally {
            hideLoader()
        }
    }

    return (
        <>
            <SubHeader
                title="Create Team"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: "Teams", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams` },
                    { label: "Create", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams/create` },
                ]}
                rightControls={
                    <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams`}>
                        <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                            <ArrowLeft className="w-4 h-4" /> Back to Teams
                        </CustomButton>
                    </Link>
                }
            />

            <div className="p-4 max-w-2xl mx-auto">
                <FlatCard>
                    <FlatCardHeader>
                        <FlatCardTitle>New Team</FlatCardTitle>
                        <FlatCardDescription>
                            Create a new team to organize your project members
                        </FlatCardDescription>
                    </FlatCardHeader>

                    <FlatCardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Team Name <span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    id="name"
                                    placeholder="Enter team name"
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
                                    placeholder="Enter team description (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="useTeamBoard"
                                    checked={formData.useTeamBoard}
                                    onChange={(e) => setFormData({ ...formData, useTeamBoard: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="useTeamBoard" className="text-sm font-medium">
                                    Create dedicated team board
                                </label>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/teams`}>
                                    <CustomButton type="button" variant="outline">
                                        Cancel
                                    </CustomButton>
                                </Link>
                                <CustomButton type="submit">
                                    Create Team
                                </CustomButton>
                            </div>
                        </form>
                    </FlatCardContent>
                </FlatCard>
            </div>
        </>
    )
}
