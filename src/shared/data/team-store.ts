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

export interface MemberDocument {
    id: string
    name: string
    type: string
    size: string
    status: string
}

export interface TeamMember {
    id: string
    workspaceId: string
    name: string
    email: string
    phone?: string
    avatar: string
    role: UserRole
    joinedAt: string
    projectsCount: number
    // HR-specific fields
    designation?: string
    department?: string
    status?: 'Active' | 'On Leave' | 'Inactive'
    joiningDate?: string
    documents?: MemberDocument[]
}

export interface TeamMemberWithRole extends TeamMember {
    teamRole: TeamMemberRole
    addedToTeamAt: string
    addedBy: string
}

export interface CalendarEvent {
    id: string
    title: string
    date: string
    type: 'meeting' | 'birthday' | 'anniversary' | 'holiday' | 'leave'
    attendees: string[]
    color: string
    time?: string
    location?: string
}

export interface Team {
    id: string
    workspaceId: string
    projectId?: string
    name: string
    description: string
    memberIds: string[]
    leadId: string
    avatar: string
    createdAt: string
    useTeamBoard: boolean
    boardId?: string
    workflowId?: string
}

export interface AttendanceRecord {
    empId: string
    status: 'Present' | 'Absent' | 'On Leave'
    checkIn?: string
    checkOut?: string
    date?: string
}

export interface LeaveRequest {
    id: string
    empId: string
    empName: string
    type: string
    startDate: string
    endDate: string
    days: number
    reason: string
    status: 'Pending' | 'Approved' | 'Rejected'
}

export interface PerformanceReview {
    id: string
    rating: string
    feedback: string
    date: string
}

export interface PerformanceGoal {
    id: string
    heading: string
    period: string
    priority: string
    completed: boolean
}

export interface PerformanceRecord {
    empId: string
    rating: string
    goalsCompleted: number
    totalGoals: number
    reviews: PerformanceReview[]
    goals: PerformanceGoal[]
}

interface TeamStore {
    members: TeamMember[]
    teams: Team[]
    calendarEvents: CalendarEvent[]
    attendance: AttendanceRecord[]
    leaves: LeaveRequest[]
    performance: PerformanceRecord[]
    teamMemberRoles: Record<string, TeamMemberRole>

    // Calendar Actions
    addEvent: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
    deleteEvent: (id: string) => void

    // Member Actions
    addMember: (member: Partial<TeamMember> & { name: string; email: string; avatar: string }) => void
    updateMember: (memberId: string, updates: Partial<TeamMember>) => void
    updateMemberRole: (memberId: string, role: UserRole) => void
    removeMember: (memberId: string) => void
    getMembersByWorkspace: (workspaceId: string) => TeamMember[]
    addDocumentToMember: (memberId: string, doc: Omit<MemberDocument, 'id'>) => void
    removeDocumentFromMember: (memberId: string, docId: string) => void

    // Attendance Actions
    updateAttendance: (empId: string, updates: Partial<AttendanceRecord>) => void
    markAttendance: (empId: string, status: AttendanceRecord['status']) => void

    // Leave Actions
    addLeave: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void
    approveLeave: (id: string) => void
    rejectLeave: (id: string) => void
    cancelLeave: (id: string) => void

    // Performance Actions
    addReview: (empId: string, review: { rating: string; feedback: string }) => void
    updateGoals: (empId: string, completed: number, total: number) => void
    addGoal: (empId: string, goal: Omit<PerformanceGoal, 'id' | 'completed'>) => void
    toggleGoal: (empId: string, goalId: string) => void
    removeGoal: (empId: string, goalId: string) => void

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
    {
        id: "EMP001", workspaceId: "ws-1", name: "Sahil Sharma", email: "sahil@fixl.com", phone: "+91 9876543210",
        avatar: "SS", role: "ADMIN", joinedAt: "2024-01-15", projectsCount: 5,
        designation: "Senior Engineer", department: "Engineering", status: "Active",
        joiningDate: "2024-01-15T00:00:00.000Z",
        documents: [
            { id: "DOC001", name: "Offer Letter.pdf", type: "PDF", size: "245 KB", status: "Verified" },
            { id: "DOC002", name: "Aadhaar Card.pdf", type: "PDF", size: "512 KB", status: "Verified" },
        ]
    },
    {
        id: "EMP002", workspaceId: "ws-1", name: "Sarah Khan", email: "sarah@fixl.com", phone: "+91 9876543211",
        avatar: "SK", role: "MEMBER", joinedAt: "2024-02-10", projectsCount: 3,
        designation: "UX Designer", department: "Design", status: "Active",
        joiningDate: "2024-02-10T00:00:00.000Z",
        documents: [
            { id: "DOC003", name: "PAN Card.pdf", type: "PDF", size: "180 KB", status: "Verified" },
        ]
    },
    {
        id: "EMP003", workspaceId: "ws-1", name: "Rahul Sharma", email: "rahul@fixl.com", phone: "+91 9876543212",
        avatar: "RS", role: "MEMBER", joinedAt: "2024-03-01", projectsCount: 2,
        designation: "Frontend Developer", department: "Engineering", status: "On Leave",
        joiningDate: "2024-03-01T00:00:00.000Z",
        documents: []
    },
    {
        id: "EMP004", workspaceId: "ws-1", name: "Priya Verma", email: "priya@fixl.com", phone: "+91 9876543213",
        avatar: "PV", role: "MEMBER", joinedAt: "2024-04-20", projectsCount: 4,
        designation: "Backend Developer", department: "Engineering", status: "Active",
        joiningDate: "2024-04-20T00:00:00.000Z",
        documents: [
            { id: "DOC004", name: "Experience Letter.pdf", type: "PDF", size: "320 KB", status: "Verified" },
        ]
    },
    {
        id: "EMP005", workspaceId: "ws-1", name: "Aman Gupta", email: "aman@fixl.com", phone: "+91 9876543214",
        avatar: "AG", role: "MEMBER", joinedAt: "2024-05-05", projectsCount: 3,
        designation: "Product Manager", department: "Product", status: "Active",
        joiningDate: "2024-05-05T00:00:00.000Z",
        documents: []
    },
    {
        id: "EMP006", workspaceId: "ws-1", name: "Kriti Sanon", email: "kriti@fixl.com", phone: "+91 9876543215",
        avatar: "KS", role: "MEMBER", joinedAt: "2024-06-10", projectsCount: 2,
        designation: "QA Engineer", department: "Engineering", status: "Active",
        joiningDate: "2024-06-10T00:00:00.000Z",
        documents: []
    },
]

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
    { empId: "EMP001", status: "Present", checkIn: "09:02 AM", checkOut: "--:--" },
    { empId: "EMP002", status: "Present", checkIn: "09:15 AM", checkOut: "--:--" },
    { empId: "EMP003", status: "On Leave", checkIn: "--:--", checkOut: "--:--" },
    { empId: "EMP004", status: "Present", checkIn: "09:05 AM", checkOut: "--:--" },
    { empId: "EMP005", status: "Present", checkIn: "09:30 AM", checkOut: "--:--" },
    { empId: "EMP006", status: "Absent", checkIn: "--:--", checkOut: "--:--" },
]

const INITIAL_LEAVES: LeaveRequest[] = [
    { id: "LV001", empId: "EMP002", empName: "Sarah Khan", type: "Casual Leave", startDate: "2026-01-22", endDate: "2026-01-24", days: 3, reason: "Family vacation to Shimla", status: "Pending" },
    { id: "LV002", empId: "EMP004", empName: "Priya Verma", type: "Sick Leave", startDate: "2026-01-20", endDate: "2026-01-21", days: 2, reason: "Fever and flu symptoms", status: "Pending" },
    { id: "LV003", empId: "EMP003", empName: "Rahul Sharma", type: "Earned Leave", startDate: "2026-01-15", endDate: "2026-01-19", days: 5, reason: "Wedding ceremony in family", status: "Approved" },
    { id: "LV004", empId: "EMP005", empName: "Aman Gupta", type: "Casual Leave", startDate: "2026-01-10", endDate: "2026-01-10", days: 1, reason: "Personal work", status: "Approved" },
    { id: "LV005", empId: "EMP006", empName: "Kriti Sanon", type: "Sick Leave", startDate: "2026-01-08", endDate: "2026-01-09", days: 2, reason: "Medical emergency", status: "Rejected" },
]

const INITIAL_PERFORMANCE: PerformanceRecord[] = [
    {
        empId: "EMP001", rating: "4.8", goalsCompleted: 7, totalGoals: 8,
        reviews: [{ id: "R001", rating: "4.8", feedback: "Consistently delivers high-quality work.", date: "2026-01-05" }],
        goals: [
            { id: "G001", heading: "Lead Q1 migration project", period: "q1", priority: "critical", completed: true },
            { id: "G002", heading: "Mentor 2 junior engineers", period: "q1", priority: "high", completed: false },
        ]
    },
    {
        empId: "EMP002", rating: "4.5", goalsCompleted: 5, totalGoals: 6,
        reviews: [],
        goals: [
            { id: "G003", heading: "Redesign onboarding flow", period: "q1", priority: "high", completed: true },
        ]
    },
    {
        empId: "EMP003", rating: "3.8", goalsCompleted: 3, totalGoals: 5,
        reviews: [],
        goals: [
            { id: "G004", heading: "Complete React 19 upgrade", period: "q1", priority: "medium", completed: false },
        ]
    },
    {
        empId: "EMP004", rating: "4.2", goalsCompleted: 4, totalGoals: 6,
        reviews: [],
        goals: []
    },
    {
        empId: "EMP005", rating: "4.6", goalsCompleted: 6, totalGoals: 7,
        reviews: [],
        goals: []
    },
    {
        empId: "EMP006", rating: "3.5", goalsCompleted: 2, totalGoals: 5,
        reviews: [],
        goals: []
    },
]

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: "EV001", title: "Team Standup", date: "2026-01-19", type: "meeting", attendees: ["EMP001", "EMP002"], color: "emerald", time: "10:00 AM", location: "Zoom" },
    { id: "EV002", title: "Sprint Review", date: "2026-01-22", type: "meeting", attendees: ["EMP001", "EMP002", "EMP003"], color: "emerald", time: "02:00 PM", location: "Conference Room A" },
    { id: "EV003", title: "Sarah's Birthday", date: "2026-01-25", type: "birthday", attendees: [], color: "rose" },
    { id: "EV004", title: "Republic Day", date: "2026-01-26", type: "holiday", attendees: [], color: "indigo" },
    { id: "EV005", title: "Rahul on Leave", date: "2026-01-28", type: "leave", attendees: ["EMP003"], color: "amber" },
    { id: "EV006", title: "Aman's Work Anniversary", date: "2026-01-28", type: "anniversary", attendees: ["EMP005"], color: "rose" },
]

const INITIAL_TEAMS: Team[] = [
    {
        id: "t1", workspaceId: "ws-1", projectId: "p1", name: "Frontend Core",
        description: "Responsible for the main UI components and UX experience.",
        memberIds: ["EMP001", "EMP002", "EMP003"], leadId: "EMP001", avatar: "🎨",
        createdAt: "2024-01-20", useTeamBoard: false
    },
]

export const useTeamStore = create<TeamStore>()(
    persist(
        (set, get) => ({
            members: INITIAL_MEMBERS,
            teams: INITIAL_TEAMS,
            calendarEvents: INITIAL_CALENDAR_EVENTS,
            attendance: INITIAL_ATTENDANCE,
            leaves: INITIAL_LEAVES,
            performance: INITIAL_PERFORMANCE,
            teamMemberRoles: {
                "t1-EMP001": "TeamAdmin",
                "t1-EMP002": "TeamMember",
                "t1-EMP003": "TeamMember",
            },

            // Calendar
            addEvent: (event) => set((state) => ({
                calendarEvents: [
                    ...state.calendarEvents,
                    { id: event.id || `EV${Date.now()}`, ...event } as CalendarEvent
                ]
            })),
            updateEvent: (id, updates) => set((state) => ({
                calendarEvents: state.calendarEvents.map(e => e.id === id ? { ...e, ...updates } : e)
            })),
            deleteEvent: (id) => set((state) => ({
                calendarEvents: state.calendarEvents.filter(e => e.id !== id)
            })),

            // Members
            addMember: (member) => set((state) => {
                const newMember: TeamMember = {
                    id: member.id || `EMP${String(state.members.length + 1).padStart(3, '0')}`,
                    workspaceId: member.workspaceId || "ws-1",
                    name: member.name,
                    email: member.email,
                    phone: member.phone || "",
                    avatar: member.avatar,
                    role: member.role || "MEMBER",
                    joinedAt: member.joinedAt || new Date().toISOString(),
                    projectsCount: member.projectsCount || 0,
                    designation: member.designation || "",
                    department: member.department || "",
                    status: member.status || "Active",
                    joiningDate: member.joiningDate || new Date().toISOString(),
                    documents: member.documents || [],
                }
                return {
                    members: [...state.members, newMember],
                    attendance: [...state.attendance, { empId: newMember.id, status: "Present", checkIn: "--:--", checkOut: "--:--" }],
                    performance: [...state.performance, { empId: newMember.id, rating: "0.0", goalsCompleted: 0, totalGoals: 0, reviews: [], goals: [] }],
                }
            }),
            updateMember: (memberId, updates) => set((state) => ({
                members: state.members.map(m => m.id === memberId ? { ...m, ...updates } : m)
            })),
            updateMemberRole: (memberId, role) => set((state) => ({
                members: state.members.map(m => m.id === memberId ? { ...m, role } : m)
            })),
            removeMember: (memberId) => set((state) => ({
                members: state.members.filter(m => m.id !== memberId),
                attendance: state.attendance.filter(a => a.empId !== memberId),
                leaves: state.leaves.filter(l => l.empId !== memberId),
                performance: state.performance.filter(p => p.empId !== memberId),
            })),
            getMembersByWorkspace: (workspaceId) => get().members.filter(m => m.workspaceId === workspaceId),

            addDocumentToMember: (memberId, doc) => set((state) => ({
                members: state.members.map(m => m.id === memberId
                    ? { ...m, documents: [...(m.documents || []), { id: `DOC${Date.now()}`, ...doc }] }
                    : m
                )
            })),
            removeDocumentFromMember: (memberId, docId) => set((state) => ({
                members: state.members.map(m => m.id === memberId
                    ? { ...m, documents: (m.documents || []).filter(d => d.id !== docId) }
                    : m
                )
            })),

            // Attendance
            updateAttendance: (empId, updates) => set((state) => {
                const existing = state.attendance.find(a => a.empId === empId)
                if (existing) {
                    return {
                        attendance: state.attendance.map(a => a.empId === empId ? { ...a, ...updates } : a)
                    }
                }
                return {
                    attendance: [...state.attendance, { empId, status: "Present", ...updates } as AttendanceRecord]
                }
            }),
            markAttendance: (empId, status) => set((state) => ({
                attendance: state.attendance.map(a => a.empId === empId ? { ...a, status } : a)
            })),

            // Leaves
            addLeave: (leave) => set((state) => ({
                leaves: [...state.leaves, { id: `LV${Date.now()}`, status: "Pending", ...leave }]
            })),
            approveLeave: (id) => set((state) => {
                const leave = state.leaves.find(l => l.id === id)
                const updates: Partial<TeamStore> = {
                    leaves: state.leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l)
                }
                // Auto-update attendance if leave is current
                if (leave) {
                    const today = new Date()
                    const start = new Date(leave.startDate)
                    const end = new Date(leave.endDate)
                    if (today >= start && today <= end) {
                        updates.attendance = state.attendance.map(a =>
                            a.empId === leave.empId ? { ...a, status: "On Leave" } : a
                        )
                    }
                }
                return updates as any
            }),
            rejectLeave: (id) => set((state) => ({
                leaves: state.leaves.map(l => l.id === id ? { ...l, status: "Rejected" } : l)
            })),
            cancelLeave: (id) => set((state) => ({
                leaves: state.leaves.filter(l => l.id !== id)
            })),

            // Performance
            addReview: (empId, review) => set((state) => ({
                performance: state.performance.map(p => p.empId === empId
                    ? {
                        ...p,
                        rating: review.rating,
                        reviews: [...p.reviews, { id: `R${Date.now()}`, ...review, date: new Date().toISOString().split('T')[0] }]
                    }
                    : p
                )
            })),
            updateGoals: (empId, completed, total) => set((state) => ({
                performance: state.performance.map(p => p.empId === empId
                    ? { ...p, goalsCompleted: completed, totalGoals: total }
                    : p
                )
            })),
            addGoal: (empId, goal) => set((state) => ({
                performance: state.performance.map(p => p.empId === empId
                    ? {
                        ...p,
                        goals: [...p.goals, { id: `G${Date.now()}`, completed: false, ...goal }],
                        totalGoals: p.totalGoals + 1,
                    }
                    : p
                )
            })),
            toggleGoal: (empId, goalId) => set((state) => ({
                performance: state.performance.map(p => {
                    if (p.empId !== empId) return p
                    const newGoals = p.goals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g)
                    return {
                        ...p,
                        goals: newGoals,
                        goalsCompleted: newGoals.filter(g => g.completed).length,
                    }
                })
            })),
            removeGoal: (empId, goalId) => set((state) => ({
                performance: state.performance.map(p => {
                    if (p.empId !== empId) return p
                    const newGoals = p.goals.filter(g => g.id !== goalId)
                    return {
                        ...p,
                        goals: newGoals,
                        totalGoals: Math.max(0, p.totalGoals - 1),
                        goalsCompleted: newGoals.filter(g => g.completed).length,
                    }
                })
            })),

            // Teams
            addTeam: (team) => set((state) => ({ teams: [team, ...state.teams] })),
            updateTeam: (teamId, updates) => set((state) => ({
                teams: state.teams.map(t => t.id === teamId ? { ...t, ...updates } : t)
            })),
            deleteTeam: (teamId) => set((state) => ({
                teams: state.teams.filter(t => t.id !== teamId)
            })),
            getTeamsByWorkspace: (workspaceId) => get().teams.filter(t => t.workspaceId === workspaceId),
            getTeamsByProject: (projectId) => get().teams.filter(t => t.projectId === projectId),

            // Team member management with roles
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
                teamMemberRoles: { ...state.teamMemberRoles, [`${teamId}-${memberId}`]: role }
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

            // Board management
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
                        hrmTeamAttendance: { ...state.hrmTeamAttendance, [employeeId]: records }
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
            },
        }),
        {
            name: 'cubicle-team-storage-v2',
        }
    )
)
