import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TeamMember {
    id: string
    userId: string
    userName: string
    userEmail: string
    userAvatar?: string
    role: "TeamAdmin" | "Member" | "Viewer"
    permissions: string[]
    status: "active" | "removed"
    addedAt: string
}

export interface Team {
    id: string
    name: string
    workspaceId: string
    projectId: string
    creatorId: string
    isArchived: boolean
    membersCount: number
    useTeamBoard: boolean
    createdAt: string
}

interface TeamStore {
    teams: Team[]
    teamMembers: Record<string, TeamMember[]> // teamId -> members
    isLoading: boolean

    // Actions
    setTeams: (teams: Team[]) => void
    addTeam: (team: Team) => void
    updateTeam: (id: string, updates: Partial<Team>) => void
    deleteTeam: (id: string) => void
    setTeamMembers: (teamId: string, members: TeamMember[]) => void
    addTeamMember: (teamId: string, member: TeamMember) => void
    removeTeamMember: (teamId: string, memberId: string) => void
    setLoading: (loading: boolean) => void
}

export const useTeamStore = create<TeamStore>()(
    persist(
        (set) => ({
            teams: [
                {
                    id: "team-1",
                    name: "Frontend Core",
                    workspaceId: "ws-1",
                    projectId: "p1",
                    creatorId: "u1",
                    isArchived: false,
                    membersCount: 5,
                    useTeamBoard: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "team-2",
                    name: "QA & Testing",
                    workspaceId: "ws-1",
                    projectId: "p1",
                    creatorId: "u2",
                    isArchived: false,
                    membersCount: 3,
                    useTeamBoard: false,
                    createdAt: new Date().toISOString()
                }
            ],
            teamMembers: {
                "team-1": [
                    { id: "tm-1", userId: "u1", userName: "Gaurav Garg", userEmail: "gaurav@example.com", userAvatar: "https://i.pravatar.cc/150?u=u1", role: "TeamAdmin", permissions: ["*"], status: "active", addedAt: new Date().toISOString() },
                    { id: "tm-2", userId: "u3", userName: "Alex Rivera", userEmail: "alex@example.com", userAvatar: "https://i.pravatar.cc/150?u=u3", role: "Member", permissions: ["READ", "WRITE"], status: "active", addedAt: new Date().toISOString() }
                ]
            },
            isLoading: false,

            setTeams: (teams) => set({ teams }),
            addTeam: (team) => set((state) => ({ teams: [team, ...state.teams] })),
            updateTeam: (id, updates) => set((state) => ({
                teams: state.teams.map(t => t.id === id ? { ...t, ...updates } : t)
            })),
            deleteTeam: (id) => set((state) => ({
                teams: state.teams.filter(t => t.id !== id)
            })),
            setTeamMembers: (teamId, members) => set((state) => ({
                teamMembers: { ...state.teamMembers, [teamId]: members }
            })),
            addTeamMember: (teamId, member) => set((state) => ({
                teamMembers: {
                    ...state.teamMembers,
                    [teamId]: [member, ...(state.teamMembers[teamId] || [])]
                }
            })),
            removeTeamMember: (teamId, memberId) => set((state) => ({
                teamMembers: {
                    ...state.teamMembers,
                    [teamId]: (state.teamMembers[teamId] || []).filter(m => m.id !== memberId)
                }
            })),
            setLoading: (isLoading) => set({ isLoading })
        }),
        {
            name: 'cubicle-teams-storage',
            skipHydration: true
        }
    )
)
