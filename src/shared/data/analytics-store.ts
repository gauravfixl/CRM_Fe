import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useIssueStore } from './issue-store'
import { useProjectMemberStore } from './project-member-store'
import { useTeamStore } from './team-store'

export interface TaskMetrics {
    total: number
    completed: number
    inProgress: number
    pending: number
    overdue: number
    completionRate: number
}

export interface MemberWorkload {
    memberId: string
    memberName: string
    memberAvatar?: string
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    pendingTasks: number
    overdueTasks: number
    workloadPercentage: number
}

export interface TasksByState {
    state: string
    count: number
    percentage: number
}

export interface TasksByPriority {
    priority: string
    count: number
    percentage: number
}

export interface TasksByType {
    type: string
    count: number
    percentage: number
}

export interface ProjectAnalytics {
    projectId: string
    taskMetrics: TaskMetrics
    memberWorkload: MemberWorkload[]
    tasksByState: TasksByState[]
    tasksByPriority: TasksByPriority[]
    tasksByType: TasksByType[]
    averageCompletionTime: number // in days
    sprintVelocity: number // story points per sprint
    teamProductivity: number // tasks completed per week
}

export interface WorkspaceAnalytics {
    workspaceId: string
    totalProjects: number
    activeProjects: number
    totalMembers: number
    totalTasks: number
    completedTasks: number
    overallCompletionRate: number
    projectBreakdown: {
        projectId: string
        projectName: string
        taskCount: number
        completionRate: number
    }[]
    memberDistribution: {
        memberId: string
        memberName: string
        projectCount: number
        taskCount: number
    }[]
    tasksPerTeam: {
        teamId: string
        teamName: string
        taskCount: number
        completedCount: number
    }[]
}

interface AnalyticsStore {
    // Project Analytics
    getProjectAnalytics: (projectId: string) => ProjectAnalytics

    // Workspace Analytics
    getWorkspaceAnalytics: (workspaceId: string) => WorkspaceAnalytics

    // Time-based Analytics
    getTasksCompletedInPeriod: (projectId: string, startDate: Date, endDate: Date) => number
    getAverageTaskCompletionTime: (projectId: string) => number

    // Team Analytics
    getTeamProductivity: (teamId: string) => {
        totalTasks: number
        completedTasks: number
        avgCompletionTime: number
    }
}

export const useAnalyticsStore = create<AnalyticsStore>()((set, get) => ({
    getProjectAnalytics: (projectId: string): ProjectAnalytics => {
        const issueStore = useIssueStore.getState()
        const memberStore = useProjectMemberStore.getState()

        const tasks = issueStore.getIssuesByProject(projectId)
        const members = memberStore.getAllProjectMembers(projectId)

        // Task Metrics
        const total = tasks.length
        const completed = tasks.filter(t => t.status === "DONE" || t.status === "COMPLETED" || t.status === "VERIFIED").length
        const inProgress = tasks.filter(t => t.status === "IN_PROGRESS" || t.status === "FIXING" || t.status === "TESTING").length
        const pending = tasks.filter(t => t.status === "TODO" || t.status === "BACKLOG" || t.status === "REPORTED").length

        const now = new Date()
        const overdue = tasks.filter(t => {
            if (!t.dueDate) return false
            const dueDate = new Date(t.dueDate)
            return dueDate < now && t.status !== "DONE" && t.status !== "COMPLETED"
        }).length

        const completionRate = total > 0 ? (completed / total) * 100 : 0

        const taskMetrics: TaskMetrics = {
            total,
            completed,
            inProgress,
            pending,
            overdue,
            completionRate
        }

        // Member Workload
        const memberWorkload: MemberWorkload[] = members.map(member => {
            const memberTasks = tasks.filter(t => t.assigneeId === member.userId)
            const totalTasks = memberTasks.length
            const completedTasks = memberTasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").length
            const inProgressTasks = memberTasks.filter(t => t.status === "IN_PROGRESS").length
            const pendingTasks = memberTasks.filter(t => t.status === "TODO" || t.status === "BACKLOG").length
            const overdueTasks = memberTasks.filter(t => {
                if (!t.dueDate) return false
                const dueDate = new Date(t.dueDate)
                return dueDate < now && t.status !== "DONE"
            }).length

            const workloadPercentage = total > 0 ? (totalTasks / total) * 100 : 0

            return {
                memberId: member.userId,
                memberName: member.userName,
                memberAvatar: member.userAvatar,
                totalTasks,
                completedTasks,
                inProgressTasks,
                pendingTasks,
                overdueTasks,
                workloadPercentage
            }
        }).sort((a, b) => b.totalTasks - a.totalTasks)

        // Tasks by State
        const stateGroups = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const tasksByState: TasksByState[] = Object.entries(stateGroups).map(([state, count]) => ({
            state,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        })).sort((a, b) => b.count - a.count)

        // Tasks by Priority
        const priorityGroups = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const tasksByPriority: TasksByPriority[] = Object.entries(priorityGroups).map(([priority, count]) => ({
            priority,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }))

        // Tasks by Type
        const typeGroups = tasks.reduce((acc, task) => {
            acc[task.type] = (acc[task.type] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const tasksByType: TasksByType[] = Object.entries(typeGroups).map(([type, count]) => ({
            type,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }))

        // Average Completion Time
        const completedTasks = tasks.filter(t => t.status === "DONE" && t.updatedAt)
        const avgCompletionTime = completedTasks.length > 0
            ? completedTasks.reduce((sum, task) => {
                const created = new Date(task.createdAt).getTime()
                const completed = new Date(task.updatedAt!).getTime()
                const days = (completed - created) / (1000 * 60 * 60 * 24)
                return sum + days
            }, 0) / completedTasks.length
            : 0

        // Sprint Velocity (story points)
        const sprintTasks = tasks.filter(t => t.sprintId && t.status === "DONE")
        const sprintVelocity = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)

        // Team Productivity (tasks per week)
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const recentCompletions = tasks.filter(t => {
            if (!t.updatedAt || t.status !== "DONE") return false
            return new Date(t.updatedAt) > oneWeekAgo
        }).length

        return {
            projectId,
            taskMetrics,
            memberWorkload,
            tasksByState,
            tasksByPriority,
            tasksByType,
            averageCompletionTime: Math.round(avgCompletionTime * 10) / 10,
            sprintVelocity,
            teamProductivity: recentCompletions
        }
    },

    getWorkspaceAnalytics: (workspaceId: string): WorkspaceAnalytics => {
        const issueStore = useIssueStore.getState()
        const teamStore = useTeamStore.getState()
        const memberStore = useProjectMemberStore.getState()

        // Get all projects in workspace (mock - you'd filter by workspaceId)
        const allProjects = ["p1", "p2"] // TODO: Get from project store
        const activeProjects = allProjects.length

        const allTasks = allProjects.flatMap(pid => issueStore.getIssuesByProject(pid))
        const totalTasks = allTasks.length
        const completedTasks = allTasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").length
        const overallCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

        // Project Breakdown
        const projectBreakdown = allProjects.map(projectId => {
            const tasks = issueStore.getIssuesByProject(projectId)
            const completed = tasks.filter(t => t.status === "DONE").length
            return {
                projectId,
                projectName: `Project ${projectId}`, // TODO: Get from project store
                taskCount: tasks.length,
                completionRate: tasks.length > 0 ? (completed / tasks.length) * 100 : 0
            }
        })

        // Member Distribution
        const allMembers = memberStore.projectMembers
        const memberDistribution = allMembers.reduce((acc, member) => {
            const existing = acc.find(m => m.memberId === member.userId)
            if (existing) {
                existing.projectCount++
            } else {
                const memberTasks = allTasks.filter(t => t.assigneeId === member.userId)
                acc.push({
                    memberId: member.userId,
                    memberName: member.userName,
                    projectCount: 1,
                    taskCount: memberTasks.length
                })
            }
            return acc
        }, [] as WorkspaceAnalytics['memberDistribution'])

        // Tasks per Team
        const teams = teamStore.getTeamsByWorkspace(workspaceId)
        const tasksPerTeam = teams.map(team => {
            const teamTasks = allTasks.filter(t =>
                team.memberIds.some(memberId => t.assigneeId === memberId)
            )
            const completed = teamTasks.filter(t => t.status === "DONE").length

            return {
                teamId: team.id,
                teamName: team.name,
                taskCount: teamTasks.length,
                completedCount: completed
            }
        })

        return {
            workspaceId,
            totalProjects: allProjects.length,
            activeProjects,
            totalMembers: memberDistribution.length,
            totalTasks,
            completedTasks,
            overallCompletionRate,
            projectBreakdown,
            memberDistribution,
            tasksPerTeam
        }
    },

    getTasksCompletedInPeriod: (projectId: string, startDate: Date, endDate: Date): number => {
        const issueStore = useIssueStore.getState()
        const tasks = issueStore.getIssuesByProject(projectId)

        return tasks.filter(t => {
            if (!t.updatedAt || t.status !== "DONE") return false
            const completedDate = new Date(t.updatedAt)
            return completedDate >= startDate && completedDate <= endDate
        }).length
    },

    getAverageTaskCompletionTime: (projectId: string): number => {
        const issueStore = useIssueStore.getState()
        const tasks = issueStore.getIssuesByProject(projectId)
        const completedTasks = tasks.filter(t => t.status === "DONE" && t.updatedAt)

        if (completedTasks.length === 0) return 0

        const totalDays = completedTasks.reduce((sum, task) => {
            const created = new Date(task.createdAt).getTime()
            const completed = new Date(task.updatedAt!).getTime()
            const days = (completed - created) / (1000 * 60 * 60 * 24)
            return sum + days
        }, 0)

        return Math.round((totalDays / completedTasks.length) * 10) / 10
    },

    getTeamProductivity: (teamId: string) => {
        const issueStore = useIssueStore.getState()
        const teamStore = useTeamStore.getState()

        const team = teamStore.teams.find(t => t.id === teamId)
        if (!team) return { totalTasks: 0, completedTasks: 0, avgCompletionTime: 0 }

        const allTasks = issueStore.issues
        const teamTasks = allTasks.filter(t =>
            team.memberIds.some(memberId => t.assigneeId === memberId)
        )

        const completedTasks = teamTasks.filter(t => t.status === "DONE" && t.updatedAt)

        const avgCompletionTime = completedTasks.length > 0
            ? completedTasks.reduce((sum, task) => {
                const created = new Date(task.createdAt).getTime()
                const completed = new Date(task.updatedAt!).getTime()
                const days = (completed - created) / (1000 * 60 * 60 * 24)
                return sum + days
            }, 0) / completedTasks.length
            : 0

        return {
            totalTasks: teamTasks.length,
            completedTasks: completedTasks.length,
            avgCompletionTime: Math.round(avgCompletionTime * 10) / 10
        }
    }
}))
