import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PermissionKey = "view" | "create" | "edit" | "delete" | "admin"

export interface RolePermissions {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
    admin: boolean
}

export interface Role {
    id: string
    name: string
    description: string
    members: number
    permissions: RolePermissions
    isSystem: boolean // System roles (Admin, etc.) cannot be deleted
    createdAt: string
}

interface RolePermissionStore {
    roles: Role[]
    addRole: (data: Omit<Role, 'id' | 'createdAt' | 'isSystem'>) => Role
    updateRole: (id: string, updates: Partial<Role>) => void
    deleteRole: (id: string) => boolean
    togglePermission: (roleId: string, perm: PermissionKey) => void
    getRoleById: (id: string) => Role | undefined
}

const INITIAL: Role[] = [
    { id: "r1", name: "Admin", description: "Full control over the workspace", members: 2, permissions: { view: true, create: true, edit: true, delete: true, admin: true }, isSystem: true, createdAt: new Date().toISOString() },
    { id: "r2", name: "Manager", description: "Manage projects and teams", members: 5, permissions: { view: true, create: true, edit: true, delete: false, admin: false }, isSystem: true, createdAt: new Date().toISOString() },
    { id: "r3", name: "Member", description: "Create and update assigned issues", members: 12, permissions: { view: true, create: true, edit: true, delete: false, admin: false }, isSystem: true, createdAt: new Date().toISOString() },
    { id: "r4", name: "Viewer", description: "Read-only access", members: 3, permissions: { view: true, create: false, edit: false, delete: false, admin: false }, isSystem: true, createdAt: new Date().toISOString() },
]

export const useRolePermissionStore = create<RolePermissionStore>()(
    persist(
        (set, get) => ({
            roles: INITIAL,

            addRole: (data) => {
                const newRole: Role = {
                    ...data,
                    id: `role-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    isSystem: false,
                    createdAt: new Date().toISOString(),
                }
                set(state => ({ roles: [...state.roles, newRole] }))
                return newRole
            },

            updateRole: (id, updates) => set(state => ({
                roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            deleteRole: (id) => {
                const role = get().roles.find(r => r.id === id)
                if (!role) return false
                if (role.isSystem) {
                    console.error("Cannot delete system role")
                    return false
                }
                set(state => ({ roles: state.roles.filter(r => r.id !== id) }))
                return true
            },

            togglePermission: (roleId, perm) => set(state => ({
                roles: state.roles.map(r =>
                    r.id === roleId
                        ? { ...r, permissions: { ...r.permissions, [perm]: !r.permissions[perm] } }
                        : r
                )
            })),

            getRoleById: (id) => get().roles.find(r => r.id === id),
        }),
        {
            name: 'cubicle-role-permissions-storage',
            skipHydration: true,
        }
    )
)
