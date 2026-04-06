import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
    getAllEmployees,
    getEmployeeAttendance,
    getPendingLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    getAllAppraisals,
    getAllGoals,
    getAllFeedback,
} from "@/modules/hrm/hooks/hrmHooks"

export type UserRole = "ADMIN" | "MEMBER" | "VIEWER"
export type TeamMemberRole = "TeamAdmin" | "TeamLead" | "TeamMember" | "TeamViewer"

export interface TeamMember {
    id: string
    workspaceId: string
    name: string
    email: string
    avatar: string
    role: UserRole
    joinedAt: string
    projectsCount: number
}

export interface TeamMemberWithRole extends TeamMember {
    teamRole: TeamMemberRole
    addedToTeamAt: string
    addedBy: string
}

export interface CalendarEvent {
    title: string
    date: string
    type: 'meeting' | 'birthday' | 'anniversary' | 'holiday' | 'leave'
    attendees: string[]
    color: string
}

export interface Team {
    id: string
    workspaceId: string
    projectId?: string // NEW: Link to project
    name: string
    description: string
    memberIds: string[]
    leadId: string
    avatar: string
    createdAt: string
    useTeamBoard: boolean // NEW: If true, team has its own board
    boardId?: string // NEW: Reference to team's dedicated board
    workflowId?: string // NEW: Reference to team's workflow
}

interface TeamStore {
    members: TeamMember[]
    teams: Team[]
    calendarEvents: CalendarEvent[]
    teamMemberRoles: Record<string, TeamMemberRole> // teamId-userId -> role

    // Calendar Actions
    addEvent: (event: CalendarEvent) => void

    // Member Actions (Workspace Level)
    addMember: (member: TeamMember) => void
    updateMemberRole: (memberId: string, role: UserRole) => void
    removeMember: (memberId: string) => void
    getMembersByWorkspace: (workspaceId: string) => TeamMember[]

    // Team Actions
    addTeam: (team: Team) => void
    updateTeam: (teamId: string, updates: Partial<Team>) => void
    deleteTeam: (teamId: string) => void
    getTeamsByWorkspace: (workspaceId: string) => Team[]
    getTeamsByProject: (projectId: string) => Team[]

    // Team Member Management with Roles
    addMemberToTeam: (teamId: string, memberId: string, role: TeamMemberRole, addedBy: string) => void
    removeMemberFromTeam: (teamId: string, memberId: string) => void
    updateTeamMemberRole: (teamId: string, memberId: string, role: TeamMemberRole) => void
    getTeamMembers: (teamId: string) => TeamMemberWithRole[]
    getTeamMemberRole: (teamId: string, memberId: string) => TeamMemberRole | null

    // Board Management
    assignBoardToTeam: (teamId: string, boardId: string, workflowId?: string) => void
    toggleTeamBoard: (teamId: string, useTeamBoard: boolean) => void

    // HRM API Integration
    hrmEmployees: any[]
    hrmPendingLeaves: any[]
    hrmTeamAttendance: Record<string, any[]>
    hrmAppraisals: any[]
    hrmGoals: any[]
    hrmFeedback: any[]
    loadHrmEmployees: () => Promise<void>
    loadHrmPendingLeaves: () => Promise<void>
    loadHrmTeamAttendance: (employeeId: string) => Promise<void>
    approveHrmLeave: (id: string) => Promise<void>
    rejectHrmLeave: (id: string, reason: string) => Promise<void>
    loadHrmAppraisals: () => Promise<void>
    loadHrmGoals: () => Promise<void>
    loadHrmFeedback: () => Promise<void>
}

const INITIAL_MEMBERS: TeamMember[] = [
    { id: "u1", workspaceId: "ws-1", name: "Sahil S.", email: "sahil@fixl.com", avatar: "https://i.pravatar.cc/150?u=u1", role: "ADMIN", joinedAt: "2024-01-15", projectsCount: 5 },
    { id: "u2", workspaceId: "ws-1", name: "Sarah K.", email: "sarah@fixl.com", avatar: "https://i.pravatar.cc/150?u=u2", role: "MEMBER", joinedAt: "2024-02-10", projectsCount: 3 },
    { id: "u3", workspaceId: "ws-1", name: "James W.", email: "james@fixl.com", avatar: "https://i.pravatar.cc/150?u=u3", role: "MEMBER", joinedAt: "2024-03-01", projectsCount: 2 },
    { id: "u4", workspaceId: "ws-2", name: "Mike L.", email: "mike@personal.com", avatar: "https://i.pravatar.cc/150?u=u4", role: "ADMIN", joinedAt: "2024-01-01", projectsCount: 1 },
]

const INITIAL_TEAMS: Team[] = [
    {
        id: "t1",
        workspaceId: "ws-1",
        projectId: "p1",
        name: "Frontend Core",
        description: "Responsible for the main UI components and UX experience.",
        memberIds: ["u1", "u2", "u3"],
        leadId: "u1",
        avatar: "🎨",
        createdAt: "2024-01-20",
        useTeamBoard: false
    },
    {
        id: "t2",
        workspaceId: "ws-1",
        projectId: "p1",
        name: "Design Systems",
        description: "Managing the Figma library and CSS design tokens.",
        memberIds: ["u2", "u3"],
        leadId: "u2",
        avatar: "💅",
        createdAt: "2024-02-15",
        useTeamBoard: true,
        boardId: "b-t2",
        workflowId: "w-t2"
    },
]

export const useTeamStore = create<TeamStore>()(
    persist(
        (set, get) => ({
            members: INITIAL_MEMBERS,
            teams: INITIAL_TEAMS,
            calendarEvents: [
                { title: "Team Standup", date: "2026-01-19", type: "meeting", attendees: ["u1", "u2"], color: "emerald" },
                { title: "Sprint Review", date: "2026-01-22", type: "meeting", attendees: ["u1", "u2", "u3"], color: "emerald" },
                { title: "Sarah's Birthday", date: "2026-01-25", type: "birthday", attendees: [], color: "rose" },
                { title: "Republic Day", date: "2026-01-26", type: "holiday", attendees: [], color: "indigo" },
                { title: "James on Leave", date: "2026-01-28", type: "leave", attendees: ["u3"], color: "amber" },
            ],
            teamMemberRoles: {
                "t1-u1": "TeamAdmin",
                "t1-u2": "TeamMember",
                "t1-u3": "TeamMember",
                "t2-u2": "TeamLead",
                "t2-u3": "TeamMember"
            },

            // Calendar
            addEvent: (event) => set((state) => ({
                calendarEvents: [...state.calendarEvents, event]
            })),

            // Members
            addMember: (member) => set((state) => ({
                members: [...state.members, member]
            })),
            updateMemberRole: (memberId, role) => set((state) => ({
                members: state.members.map(m => m.id === memberId ? { ...m, role } : m)
            })),
            removeMember: (memberId) => set((state) => ({
                members: state.members.filter(m => m.id !== memberId)
            })),
            getMembersByWorkspace: (workspaceId) => get().members.filter(m => m.workspaceId === workspaceId),

            // Teams
            addTeam: (team) => set((state) => ({
                teams: [team, ...state.teams]
            })),
            updateTeam: (teamId, updates) => set((state) => ({
                teams: state.teams.map(t => t.id === teamId ? { ...t, ...updates } : t)
            })),
            deleteTeam: (teamId) => set((state) => ({
                teams: state.teams.filter(t => t.id !== teamId)
            })),
            getTeamsByWorkspace: (workspaceId) => get().teams.filter(t => t.workspaceId === workspaceId),
            getTeamsByProject: (projectId) => get().teams.filter(t => t.projectId === projectId),

            // Team Management with Roles
            addMemberToTeam: (teamId, memberId, role, addedBy) => set((state) => {
                const team = state.teams.find(t => t.id === teamId)
                if (!team || team.memberIds.includes(memberId)) return state

                return {
                    teams: state.teams.map(t =>
                        t.id === teamId ? { ...t, memberIds: [...t.memberIds, memberId] } : t
                    ),
                    teamMemberRoles: {
                        ...state.teamMemberRoles,
                        [`${teamId}-${memberId}`]: role
                    }
                }
            }),

            removeMemberFromTeam: (teamId, memberId) => set((state) => {
                const newRoles = { ...state.teamMemberRoles }
                delete newRoles[`${teamId}-${memberId}`]

                return {
                    teams: state.teams.map(t =>
                        t.id === teamId ? { ...t, memberIds: t.memberIds.filter(id => id !== memberId) } : t
                    ),
                    teamMemberRoles: newRoles
                }
            }),

            updateTeamMemberRole: (teamId, memberId, role) => set((state) => ({
                teamMemberRoles: {
                    ...state.teamMemberRoles,
                    [`${teamId}-${memberId}`]: role
                }
            })),

            getTeamMembers: (teamId) => {
                const team = get().teams.find(t => t.id === teamId)
                if (!team) return []

                return get().members
                    .filter(m => team.memberIds.includes(m.id))
                    .map(m => ({
                        ...m,
                        teamRole: get().teamMemberRoles[`${teamId}-${m.id}`] || "TeamMember",
                        addedToTeamAt: team.createdAt,
                        addedBy: team.leadId
                    }))
            },

            getTeamMemberRole: (teamId, memberId) => {
                return get().teamMemberRoles[`${teamId}-${memberId}`] || null
            },

            // Board Management
            assignBoardToTeam: (teamId, boardId, workflowId) => set((state) => ({
                teams: state.teams.map(t =>
                    t.id === teamId ? { ...t, boardId, workflowId, useTeamBoard: true } : t
                )
            })),

            toggleTeamBoard: (teamId, useTeamBoard) => set((state) => ({
                teams: state.teams.map(t =>
                    t.id === teamId ? { ...t, useTeamBoard } : t
                )
            })),

            // ===== HRM API INTEGRATION =====
            hrmEmployees: [],
            hrmPendingLeaves: [],
            hrmTeamAttendance: {},
            hrmAppraisals: [],
            hrmGoals: [],
            hrmFeedback: [],

            loadHrmEmployees: async () => {
                try {
                    const res = await getAllEmployees();
                    const employees = res?.data?.data ?? res?.data ?? [];
                    set({ hrmEmployees: employees });
                } catch (err) {
                    console.error("Failed to load HRM employees:", err);
                }
            },

            loadHrmPendingLeaves: async () => {
                try {
                    const res = await getPendingLeaveRequests();
                    const leaves = res?.data?.data ?? res?.data ?? [];
                    set({ hrmPendingLeaves: leaves });
                } catch (err) {
                    console.error("Failed to load pending leaves:", err);
                }
            },

            loadHrmTeamAttendance: async (employeeId: string) => {
                try {
                    const res = await getEmployeeAttendance(employeeId);
                    const records = res?.data?.data ?? [];
                    set((state) => ({
                        hrmTeamAttendance: {
                            ...state.hrmTeamAttendance,
                            [employeeId]: records
                        }
                    }));
                } catch (err) {
                    console.error("Failed to load team attendance:", err);
                }
            },

            approveHrmLeave: async (id: string) => {
                try {
                    await approveLeaveRequest(id);
                    await get().loadHrmPendingLeaves();
                } catch (err) {
                    console.error("Failed to approve leave:", err);
                    throw err;
                }
            },

            rejectHrmLeave: async (id: string, reason: string) => {
                try {
                    await rejectLeaveRequest(id, reason);
                    await get().loadHrmPendingLeaves();
                } catch (err) {
                    console.error("Failed to reject leave:", err);
                    throw err;
                }
            },

            loadHrmAppraisals: async () => {
                try {
                    const res = await getAllAppraisals();
                    set({ hrmAppraisals: res?.data?.data ?? [] });
                } catch (err) {
                    console.error("Failed to load appraisals:", err);
                }
            },

            loadHrmGoals: async () => {
                try {
                    const res = await getAllGoals();
                    set({ hrmGoals: res?.data?.data ?? [] });
                } catch (err) {
                    console.error("Failed to load goals:", err);
                }
            },

            loadHrmFeedback: async () => {
                try {
                    const res = await getAllFeedback();
                    set({ hrmFeedback: res?.data?.data ?? [] });
                } catch (err) {
                    console.error("Failed to load feedback:", err);
                }
            }
        }),
        {
            name: 'cubicle-team-storage',
            skipHydration: true,
        }
    )
)
