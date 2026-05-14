/**
 * Event bridges — centralized utility functions that fan out a single user action
 * to multiple stores (audit logs, notifications, automation rules).
 *
 * Frontend-only: no backend calls. All state lives in zustand+localStorage.
 *
 * Use these helpers anywhere you mutate an issue/project/sprint and want the
 * activity feed, notifications bell, and automation rules to react.
 */

import { useAuditLogsStore } from './audit-logs-store'
import { useNotificationStore } from './notification-store'
import { useAutomationStore } from './automation-store'
import type { Issue, IssueStatus } from './issue-store'
import type { Project } from './projects-store'

// Default actor — frontend-only mode, we don't have real auth context
const DEFAULT_ACTOR = {
    userId: 'u1',
    userName: 'Current User',
    avatar: '',
}

function getActor() {
    return DEFAULT_ACTOR
}

// ---------- ISSUE EVENTS ----------

export function emitIssueCreated(issue: Issue) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'TASK_CREATED',
        entityType: 'task',
        entityId: issue.id,
        entityName: issue.title,
        userId: actor.userId,
        userName: actor.userName,
        details: {
            action: `Created task "${issue.title}"`,
            metadata: { type: issue.type, priority: issue.priority, status: issue.status },
        },
        projectId: issue.projectId,
    })

    // Auto-create notification if assignee != reporter
    if (issue.assigneeId && issue.assigneeId !== issue.reporterId) {
        useNotificationStore.getState().createNotification({
            type: 'TASK_ASSIGNED',
            title: 'New task assigned',
            message: `You were assigned: "${issue.title}"`,
            userId: issue.assigneeId,
            organizationId: 'org-1',
            projectId: issue.projectId,
            taskId: issue.id,
            actorId: actor.userId,
            actorName: actor.userName,
            actionUrl: `/projectmanagement/projects/${issue.projectId}/board?task=${issue.id}`,
        })
    }

    // Run automation rules
    useAutomationStore.getState().runRulesFor('ISSUE_CREATED', { issueId: issue.id, type: issue.type, priority: issue.priority })
}

export function emitIssueStatusChanged(issue: Issue, oldStatus: IssueStatus, newStatus: IssueStatus) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'TASK_MOVED',
        entityType: 'task',
        entityId: issue.id,
        entityName: issue.title,
        userId: actor.userId,
        userName: actor.userName,
        details: {
            action: `Moved "${issue.title}" from ${oldStatus} to ${newStatus}`,
            changes: [{ field: 'status', oldValue: oldStatus, newValue: newStatus }],
        },
        projectId: issue.projectId,
    })

    // Notify assignee on status changes (skip if self-move)
    if (issue.assigneeId && issue.assigneeId !== actor.userId) {
        useNotificationStore.getState().createNotification({
            type: 'TASK_UPDATED',
            title: 'Task status updated',
            message: `"${issue.title}" moved to ${newStatus.replace(/_/g, ' ')}`,
            userId: issue.assigneeId,
            organizationId: 'org-1',
            projectId: issue.projectId,
            taskId: issue.id,
            actorId: actor.userId,
            actorName: actor.userName,
            actionUrl: `/projectmanagement/projects/${issue.projectId}/board?task=${issue.id}`,
        })
    }

    useAutomationStore.getState().runRulesFor('STATUS_CHANGED', { issueId: issue.id, from: oldStatus, to: newStatus })
}

export function emitIssueUpdated(issue: Issue, changedFields: { field: string; oldValue: any; newValue: any }[]) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'TASK_UPDATED',
        entityType: 'task',
        entityId: issue.id,
        entityName: issue.title,
        userId: actor.userId,
        userName: actor.userName,
        details: {
            action: `Updated "${issue.title}"`,
            changes: changedFields,
        },
        projectId: issue.projectId,
    })

    // If assignee changed, notify new assignee
    const assigneeChange = changedFields.find(c => c.field === 'assigneeId')
    if (assigneeChange && assigneeChange.newValue && assigneeChange.newValue !== actor.userId) {
        useNotificationStore.getState().createNotification({
            type: 'TASK_ASSIGNED',
            title: 'New task assigned',
            message: `You were assigned: "${issue.title}"`,
            userId: assigneeChange.newValue,
            organizationId: 'org-1',
            projectId: issue.projectId,
            taskId: issue.id,
            actorId: actor.userId,
            actorName: actor.userName,
            actionUrl: `/projectmanagement/projects/${issue.projectId}/board?task=${issue.id}`,
        })
    }

    useAutomationStore.getState().runRulesFor('ISSUE_UPDATED', { issueId: issue.id, changes: changedFields })
}

export function emitIssueDeleted(issue: Issue) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'TASK_DELETED',
        entityType: 'task',
        entityId: issue.id,
        entityName: issue.title,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Deleted "${issue.title}"` },
        projectId: issue.projectId,
    })
}

export function emitCommentAdded(issue: Issue, commentBody: string, mentionedUserIds: string[] = []) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'COMMENT_ADDED',
        entityType: 'comment',
        entityId: issue.id,
        entityName: issue.title,
        userId: actor.userId,
        userName: actor.userName,
        details: {
            action: `Commented on "${issue.title}"`,
            metadata: { preview: commentBody.slice(0, 80) },
        },
        projectId: issue.projectId,
    })

    // Notify assignee about comment
    if (issue.assigneeId && issue.assigneeId !== actor.userId) {
        useNotificationStore.getState().createNotification({
            type: 'TASK_COMMENTED',
            title: 'New comment',
            message: `${actor.userName} commented on "${issue.title}"`,
            userId: issue.assigneeId,
            organizationId: 'org-1',
            projectId: issue.projectId,
            taskId: issue.id,
            actorId: actor.userId,
            actorName: actor.userName,
            actionUrl: `/projectmanagement/projects/${issue.projectId}/board?task=${issue.id}`,
        })
    }

    // Notify mentioned users
    mentionedUserIds.forEach(uid => {
        if (uid === actor.userId) return
        useNotificationStore.getState().createNotification({
            type: 'MENTION',
            title: `${actor.userName} mentioned you`,
            message: `In "${issue.title}": ${commentBody.slice(0, 80)}`,
            userId: uid,
            organizationId: 'org-1',
            projectId: issue.projectId,
            taskId: issue.id,
            actorId: actor.userId,
            actorName: actor.userName,
            actionUrl: `/projectmanagement/projects/${issue.projectId}/board?task=${issue.id}`,
        })
    })
}

// ---------- PROJECT EVENTS ----------

export function emitProjectCreated(project: Project) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'PROJECT_CREATED',
        entityType: 'project',
        entityId: project.id,
        entityName: project.name,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Created project "${project.name}"`, metadata: { methodology: project.methodology } },
        projectId: project.id,
        workspaceId: project.workspaceId,
    })
}

export function emitProjectUpdated(project: Project, changes: { field: string; oldValue: any; newValue: any }[]) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'PROJECT_UPDATED',
        entityType: 'project',
        entityId: project.id,
        entityName: project.name,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Updated "${project.name}"`, changes },
        projectId: project.id,
        workspaceId: project.workspaceId,
    })
}

export function emitProjectDeleted(project: Project) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'PROJECT_DELETED',
        entityType: 'project',
        entityId: project.id,
        entityName: project.name,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Deleted project "${project.name}"` },
        projectId: project.id,
        workspaceId: project.workspaceId,
    })
}

// ---------- SPRINT EVENTS ----------

export function emitSprintStarted(sprintId: string, sprintName: string, projectId: string) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'PROJECT_UPDATED',
        entityType: 'project',
        entityId: sprintId,
        entityName: sprintName,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Started sprint "${sprintName}"` },
        projectId,
    })
    useNotificationStore.getState().createNotification({
        type: 'SPRINT_STARTED',
        title: 'Sprint started',
        message: `${sprintName} is now active`,
        userId: actor.userId,
        organizationId: 'org-1',
        projectId,
        actorId: actor.userId,
        actorName: actor.userName,
    })
}

export function emitSprintCompleted(sprintId: string, sprintName: string, projectId: string) {
    const actor = getActor()
    useAuditLogsStore.getState().addLog({
        eventType: 'PROJECT_UPDATED',
        entityType: 'project',
        entityId: sprintId,
        entityName: sprintName,
        userId: actor.userId,
        userName: actor.userName,
        details: { action: `Completed sprint "${sprintName}"` },
        projectId,
    })
    useNotificationStore.getState().createNotification({
        type: 'SPRINT_COMPLETED',
        title: 'Sprint completed',
        message: `${sprintName} has been completed`,
        userId: actor.userId,
        organizationId: 'org-1',
        projectId,
        actorId: actor.userId,
        actorName: actor.userName,
    })
}

// ---------- MENTION PARSER ----------
// Extracts @userName patterns from a comment body. Returns matched user ids
// by looking them up in a name→id resolver.
export function parseMentions(body: string, nameToIdResolver: (name: string) => string | null): string[] {
    const matches = body.match(/@(\w+)/g) || []
    const ids: string[] = []
    matches.forEach(m => {
        const name = m.slice(1)
        const id = nameToIdResolver(name)
        if (id) ids.push(id)
    })
    return ids
}
