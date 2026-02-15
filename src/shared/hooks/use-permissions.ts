import { useMemo } from 'react'
import { useProjectStore } from '@/shared/data/projects-store'
import { useWorkspaceStore } from '@/shared/data/workspace-store'

export type Role = 'WorkspaceAdmin' | 'ProjectOwner' | 'ProjectAdmin' | 'Member' | 'Guest'

interface Permissions {
    role: Role
    canEdit: boolean
    canDelete: boolean
    canManageMembers: boolean
    canConfigureWorkflow: boolean
    canComment: boolean
    label: string
}

/**
 * SOURCE OF TRUTH: RBAC Hook
 * Logic corresponds to the Backend Master Module Diagram roles.
 */
export function usePermissions(context: { workspaceId?: string, projectId?: string }) {
    // In a real app, we would fetch the current user's role for the given context from an API or Auth Session
    // For now, we mock the current user as "ProjectOwner" or "WorkspaceAdmin" to allow full testing

    // Mocking current user ID
    const currentUserId = "u1"

    const permissions = useMemo((): Permissions => {
        // Mocking role determination logic
        let role: Role = 'Member'

        if (context.workspaceId === "ws-guest") {
            role = 'Guest'
        } else if (context.workspaceId) {
            role = 'WorkspaceAdmin'
        } else if (context.projectId) {
            role = 'ProjectOwner'
        }

        const isAtLeastAdmin = (['WorkspaceAdmin', 'ProjectOwner', 'ProjectAdmin'] as string[]).includes(role as string)
        const isGuest = (role as string) === 'Guest'

        return {
            role,
            label: role.replace(/([A-Z])/g, ' $1').trim(),
            canEdit: !isGuest,
            canDelete: isAtLeastAdmin,
            canManageMembers: isAtLeastAdmin,
            canConfigureWorkflow: isAtLeastAdmin,
            canComment: true, // Everyone can comment in this system
        }
    }, [context.workspaceId, context.projectId])

    return permissions
}
