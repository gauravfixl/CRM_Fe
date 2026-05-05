import { useMemo } from 'react'
import { useAuthStore } from '@/lib/useAuthStore'
import { MODULES, PERMISSIONS } from '@/shared/utils/module-permission-map'

export type Role = 'WorkspaceAdmin' | 'ProjectOwner' | 'ProjectAdmin' | 'Member' | 'Guest'

interface PermissionsResult {
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
 * Now reads real permissions from the auth store instead of hardcoded mock data.
 * Falls back to role-based determination when specific workspace/project context is provided.
 */
export function usePermissions(context: { workspaceId?: string, projectId?: string }) {
    const userRole = useAuthStore((state) => state.userRole)
    const userPermissions = useAuthStore((state) => state.permissions)

    const permissions = useMemo((): PermissionsResult => {
        // Determine the effective role based on auth store userRole + context
        let role: Role = 'Member'

        // Map backend roles to frontend role types
        const adminRoles = ['SuperAdmin', 'OrgOwner', 'OrgAdmin', 'admin', 'ADMIN', 'SUB_ADMIN', 'PlatformAdmin']
        const managerRoles = ['SalesManager', 'FinanceManager', 'HRAdmin', 'HRManager']

        if (adminRoles.includes(userRole || '')) {
            // Admin users get WorkspaceAdmin level access
            role = 'WorkspaceAdmin'
        } else if (managerRoles.includes(userRole || '')) {
            // Manager users get ProjectAdmin level
            role = 'ProjectAdmin'
        } else if (context.workspaceId === "ws-guest") {
            role = 'Guest'
        } else if (context.workspaceId) {
            // Check if user has workspace admin permissions from backend
            const hasProjectMgmt = userPermissions?.find(p => p.module === MODULES.PROJECT_MANAGEMENT)
            if (hasProjectMgmt) {
                const actions = hasProjectMgmt.actions
                if (actions.includes(PERMISSIONS.EDIT_PROJECT) || actions.includes(PERMISSIONS.DELETE_PROJECT)) {
                    role = 'WorkspaceAdmin'
                } else if (actions.includes(PERMISSIONS.CREATE_PROJECT)) {
                    role = 'ProjectAdmin'
                } else if (actions.includes(PERMISSIONS.VIEW_PROJECT)) {
                    role = 'Member'
                }
            } else {
                role = 'Member'
            }
        } else if (context.projectId) {
            // Check if user has project-level permissions from backend
            const hasProjectMgmt = userPermissions?.find(p => p.module === MODULES.PROJECT_MANAGEMENT)
            if (hasProjectMgmt) {
                const actions = hasProjectMgmt.actions
                if (actions.includes(PERMISSIONS.DELETE_PROJECT)) {
                    role = 'ProjectOwner'
                } else if (actions.includes(PERMISSIONS.EDIT_PROJECT)) {
                    role = 'ProjectAdmin'
                } else if (actions.includes(PERMISSIONS.VIEW_PROJECT)) {
                    role = 'Member'
                }
            } else {
                role = 'Member'
            }
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
            canComment: true,
        }
    }, [context.workspaceId, context.projectId, userRole, userPermissions])

    return permissions
}
