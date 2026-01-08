"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  SmallCard,
  SmallCardContent,
  SmallCardDescription,
  SmallCardHeader,
  SmallCardTitle,
} from "@/components/custom/SmallCard"
import { CustomButton } from "@/components/custom/CustomButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Calendar, Crown, MoreHorizontal } from "lucide-react"
import {
  CustomDropdownMenu,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuTrigger,
} from "@/components/custom/CustomDropdownMenu"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { createTeam } from "@/hooks/teamHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import CreateTeamDialog from "./create-team-dialog"
import type { Team } from "@/lib/types"

interface TeamManagementProps {
  workspaceId: string
  projectId: string
  teams: Team[]
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
}

export function TeamManagement({
  workspaceId,
  projectId,
  teams,
  setTeams,
}: TeamManagementProps) {
  const { dispatch } = useApp()
  const { toast } = useToast()
  const { showLoader, hideLoader } = useLoaderStore()
  const router = useRouter()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [searchTerm] = useState("")

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)
  }, [])

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) =>
        (team?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [teams, searchTerm]
  )

  const handleCreateTeam = useCallback(
    async (formData: { name: string; description: string }, boardType?: string | null) => {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "Team name is required",
          variant: "destructive",
        })
        return
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description,
        useTeamBoard: true,
        templateId: "686b75e45c48532b2a1601be",
        projectId,
        workspaceId,
      }

      try {
        showLoader()
        const response = await createTeam(payload)
        const savedTeam = response?.data.team

        setTeams((prev) => [...prev, savedTeam])

        toast({
          title: "Success",
          description: `Team created successfully${boardType ? ` with a ${boardType} board` : ""}`,
        })

        setIsCreateOpen(false)
      } catch (error) {
        console.error("Failed to create team:", error)
        toast({
          title: "Error",
          description: "Failed to create team. Please try again.",
          variant: "destructive",
        })
      } finally {
        hideLoader()
      }
    },
    [setTeams, toast, workspaceId, projectId, showLoader, hideLoader]
  )

  const handleSoftDeleteTeam = (teamId: string) => {
    dispatch({ type: "SOFT_DELETE_TEAM", payload: teamId })
    toast({ title: "Success", description: "Team moved to trash" })
  }

  const handleViewTeamSettings = (teamId: string) => {
    if (!orgName) return
    router.push(
      `/${orgName}/modules/workspaces/${workspaceId}/projects/${projectId}/teams/${teamId}/settings`
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-[92%] justify-between">
        <div>
          <h6 className="text-xl font-bold tracking-tight">Teams</h6>
          <p className="text-muted-foreground mt-2">
            Organize your workspace members into focused teams
          </p>
        </div>
        <CustomButton className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Team
        </CustomButton>
        <CreateTeamDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          handleCreateTeam={handleCreateTeam}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => {
          const teamLead = team.members?.find((m: any) => m.role === "lead")

          return (
            <SmallCard
              key={team._id}
              className="group hover:shadow-md transition-all hover:ml-3 duration-200 hover:border-primary"
            >
              <SmallCardHeader className="p-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br bg-primary flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <SmallCardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => router.push(`teams/${team._id}`)}
                      >
                        {team.name}
                      </SmallCardTitle>
                      {teamLead && (
                        <div className="flex items-center gap-1">
                          <Crown className="h-2 w-2 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">{teamLead.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <CustomDropdownMenu>
                    <CustomDropdownMenuTrigger asChild>
                      <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </CustomButton>
                    </CustomDropdownMenuTrigger>
                    <CustomDropdownMenuContent align="end">
                      <CustomDropdownMenuItem onClick={() => handleViewTeamSettings(team._id)}>
                        Team settings
                      </CustomDropdownMenuItem>
                      <CustomDropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleSoftDeleteTeam(team._id)}
                      >
                        Delete team
                      </CustomDropdownMenuItem>
                    </CustomDropdownMenuContent>
                  </CustomDropdownMenu>
                </div>
              </SmallCardHeader>

              <SmallCardContent className="space-y-1">
                <SmallCardDescription className="line-clamp-2">
                  {team.description}
                </SmallCardDescription>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{team.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {team.updatedAt
                        ? new Date(team.updatedAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 4).map((member: any) => (
                      <Avatar
                        key={member.id}
                        className="h-6 w-6 border-2 border-background"
                      >
                        <AvatarImage
                          src={member.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members?.length > 4 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{team.members.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </SmallCardContent>
            </SmallCard>
          )
        })}
      </div>
    </div>
  )
}
