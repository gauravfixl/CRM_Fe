import {
    getAllRolesNPermissions,
    addRole,
    updateRole as updateRoleApi,
    deleteRole as deleteRoleApi,
} from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"

// ─── Backend HRM Modules ───────────────────────────────────
export const HRM_MODULES = [
    "EMPLOYEE",
    "ONBOARDING",
    "ATTENDANCE",
    "SHIFT",
    "LEAVE",
    "HOLIDAY",
    "PAYROLL",
    "POLICY",
    "REPORTS",
    "SETTINGS",
] as const

export type HrmModule = (typeof HRM_MODULES)[number]

// ─── Display name mapping ──────────────────────────────────
export const MODULE_DISPLAY_NAMES: Record<HrmModule, string> = {
    EMPLOYEE: "Employees",
    ONBOARDING: "Onboarding",
    ATTENDANCE: "Attendance",
    SHIFT: "Shifts",
    LEAVE: "Leave Management",
    HOLIDAY: "Holidays",
    PAYROLL: "Payroll",
    POLICY: "Policies",
    REPORTS: "Reports",
    SETTINGS: "Settings",
}

// ─── Backend action strings per module ─────────────────────
export const MODULE_ACTIONS: Record<HrmModule, { view: string; create: string; edit: string; delete: string; approve: string }> = {
    EMPLOYEE: {
        view: "VIEW_ALL_EMPLOYEES",
        create: "CREATE_EMPLOYEE",
        edit: "EDIT_EMPLOYEE",
        delete: "DELETE_EMPLOYEE",
        approve: "MANAGE_EMPLOYEE_PERMISSIONS",
    },
    ONBOARDING: {
        view: "VIEW_EMPLOYEE_PROFILE",
        create: "CREATE_EMPLOYEE",
        edit: "UPDATE_EMPLOYEE_PROFILE",
        delete: "SUSPEND_EMPLOYEE",
        approve: "HIRE_CANDIDATE",
    },
    ATTENDANCE: {
        view: "MANAGE_ATTENDANCE",
        create: "MANAGE_ATTENDANCE",
        edit: "MANAGE_ATTENDANCE",
        delete: "MANAGE_ATTENDANCE",
        approve: "APPROVE_TIMESHEETS",
    },
    SHIFT: {
        view: "MANAGE_ATTENDANCE",
        create: "MANAGE_ATTENDANCE",
        edit: "MANAGE_ATTENDANCE",
        delete: "MANAGE_ATTENDANCE",
        approve: "APPROVE_TIMESHEETS",
    },
    LEAVE: {
        view: "MANAGE_EMPLOYE_LEAVE",
        create: "MANAGE_EMPLOYE_LEAVE",
        edit: "MANAGE_EMPLOYE_LEAVE",
        delete: "MANAGE_EMPLOYE_LEAVE",
        approve: "MANAGE_EMPLOYE_LEAVE",
    },
    HOLIDAY: {
        view: "MANAGE_ATTENDANCE",
        create: "MANAGE_ATTENDANCE",
        edit: "MANAGE_ATTENDANCE",
        delete: "MANAGE_ATTENDANCE",
        approve: "MANAGE_ATTENDANCE",
    },
    PAYROLL: {
        view: "VIEW_PAYSLIPS",
        create: "MANAGE_PAYROLL",
        edit: "MANAGE_PAYROLL",
        delete: "MANAGE_PAYROLL",
        approve: "MANAGE_PAYROLL",
    },
    POLICY: {
        view: "VIEW_EMPLOYEE_PROFILE",
        create: "MANAGE_EMPLOYEE_PERMISSIONS",
        edit: "MANAGE_EMPLOYEE_PERMISSIONS",
        delete: "MANAGE_EMPLOYEE_PERMISSIONS",
        approve: "MANAGE_EMPLOYEE_PERMISSIONS",
    },
    REPORTS: {
        view: "VIEW_ALL_EMPLOYEES",
        create: "VIEW_ALL_EMPLOYEES",
        edit: "VIEW_ALL_EMPLOYEES",
        delete: "VIEW_ALL_EMPLOYEES",
        approve: "VIEW_ALL_EMPLOYEES",
    },
    SETTINGS: {
        view: "MANAGE_EMPLOYEE_PERMISSIONS",
        create: "MANAGE_EMPLOYEE_PERMISSIONS",
        edit: "MANAGE_EMPLOYEE_PERMISSIONS",
        delete: "MANAGE_EMPLOYEE_PERMISSIONS",
        approve: "MANAGE_EMPLOYEE_PERMISSIONS",
    },
}

// ─── Types ─────────────────────────────────────────────────
export type ActionKey = "view" | "create" | "edit" | "delete" | "approve"

export interface HrmRolePermission {
    module: HrmModule
    actions: Record<ActionKey, boolean>
}

export interface HrmRole {
    _id: string
    name: string
    description?: string
    role: string
    isCustom: boolean
    permissions: HrmRolePermission[]
    userCount?: number
    createdAt?: string
    updatedAt?: string
}

// ─── Convert backend format → frontend format ──────────────
export function backendToFrontend(backendRole: any): HrmRole {
    const permissions: HrmRolePermission[] = HRM_MODULES.map((mod) => {
        const backendPerm = (backendRole.permissions || []).find(
            (p: any) => p.module === mod || p.module === mod.toLowerCase()
        )
        const backendActions: string[] = backendPerm?.actions || []

        const actions: Record<ActionKey, boolean> = {
            view: backendActions.includes(MODULE_ACTIONS[mod].view),
            create: backendActions.includes(MODULE_ACTIONS[mod].create),
            edit: backendActions.includes(MODULE_ACTIONS[mod].edit),
            delete: backendActions.includes(MODULE_ACTIONS[mod].delete),
            approve: backendActions.includes(MODULE_ACTIONS[mod].approve),
        }

        return { module: mod, actions }
    })

    return {
        _id: backendRole._id || backendRole.id || "",
        name: backendRole.name || "",
        description: backendRole.description || "",
        role: backendRole.role || "HRCustom",
        isCustom: backendRole.isCustom ?? true,
        permissions,
        userCount: backendRole.userCount || 0,
        createdAt: backendRole.createdAt,
        updatedAt: backendRole.updatedAt,
    }
}

// ─── Convert frontend format → backend format ──────────────
export function frontendToBackend(role: HrmRole): {
    role: string
    name: string
    permissions: { module: string; actions: string[] }[]
} {
    const permissions = role.permissions
        .map((p) => {
            const actions: string[] = []
            const actionMap = MODULE_ACTIONS[p.module]
            if (p.actions.view) actions.push(actionMap.view)
            if (p.actions.create) actions.push(actionMap.create)
            if (p.actions.edit) actions.push(actionMap.edit)
            if (p.actions.delete) actions.push(actionMap.delete)
            if (p.actions.approve) actions.push(actionMap.approve)
            // Deduplicate
            return { module: p.module, actions: [...new Set(actions)] }
        })
        .filter((p) => p.actions.length > 0)

    return {
        role: role.role || "HRCustom",
        name: role.name,
        permissions,
    }
}

// ─── API Functions ─────────────────────────────────────────

/** Fetch all HRM-scoped roles from backend */
export async function fetchHrmRoles(): Promise<HrmRole[]> {
    try {
        const response = await getAllRolesNPermissions({ scope: "sc-hrm" })

        if (response?.data?.permissions && response?.data?.iv) {
            const decrypted = decryptData(response.data.permissions, response.data.iv)
            if (Array.isArray(decrypted)) {
                return decrypted.map(backendToFrontend)
            }
        }

        // Fallback: try unencrypted response
        const roles = response?.data?.roles || response?.data?.data || response?.data
        if (Array.isArray(roles)) {
            return roles.map(backendToFrontend)
        }

        return []
    } catch (err) {
        console.error("Error fetching HRM roles:", err)
        throw err
    }
}

/** Create a new HRM custom role */
export async function createHrmRole(role: Omit<HrmRole, "_id" | "createdAt" | "updatedAt">): Promise<any> {
    try {
        const payload = frontendToBackend(role as HrmRole)
        const response = await addRole(payload)
        return response
    } catch (err) {
        console.error("Error creating HRM role:", err)
        throw err
    }
}

/** Update an existing HRM role */
export async function updateHrmRole(id: string, role: Partial<HrmRole>): Promise<any> {
    try {
        const payload: any = {}
        if (role.name) payload.name = role.name
        if (role.permissions) {
            payload.permissions = role.permissions
                .map((p) => {
                    const actions: string[] = []
                    const actionMap = MODULE_ACTIONS[p.module]
                    if (p.actions.view) actions.push(actionMap.view)
                    if (p.actions.create) actions.push(actionMap.create)
                    if (p.actions.edit) actions.push(actionMap.edit)
                    if (p.actions.delete) actions.push(actionMap.delete)
                    if (p.actions.approve) actions.push(actionMap.approve)
                    return { module: p.module, actions: [...new Set(actions)] }
                })
                .filter((p) => p.actions.length > 0)
        }
        const response = await updateRoleApi(payload, id)
        return response
    } catch (err) {
        console.error("Error updating HRM role:", err)
        throw err
    }
}

/** Delete an HRM custom role */
export async function deleteHrmRole(id: string): Promise<any> {
    try {
        const response = await deleteRoleApi(id)
        return response
    } catch (err) {
        console.error("Error deleting HRM role:", err)
        throw err
    }
}
