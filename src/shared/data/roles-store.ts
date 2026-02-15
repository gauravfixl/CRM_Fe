import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve';
export type DataScope = 'Self' | 'Team' | 'Department' | 'Organization';

export interface ModulePermission {
    module: string;
    actions: Record<PermissionAction, boolean>;
    scope: DataScope;
    hasConfidentialAccess: boolean; // Quick toggle for sensitive blocks
    fieldAccess: Record<string, 'view' | 'edit' | 'hidden'>; // Granular field control
}

export interface RoleHistory {
    id: string;
    action: 'Created' | 'Updated' | 'Permission Change' | 'Deleted';
    details: string;
    timestamp: string;
    actor: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    type: 'System' | 'Custom';
    permissions: ModulePermission[];
    approvalAuthorityLevel: number; // 0-5
    assignedTo: string[]; // Employee IDs
    history: RoleHistory[];
    createdAt: string;
    updatedAt: string;
}

export interface RoleAssignment {
    id: string;
    employeeId: string;
    employeeName: string;
    roleId: string;
    roleName: string;
    assignedBy: string;
    assignedAt: string;
}

interface RolesState {
    roles: Role[];
    assignments: RoleAssignment[];

    // Role CRUD
    createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'assignedTo' | 'history'>) => void;
    updateRole: (id: string, updates: Partial<Role>, actor?: string) => void;
    deleteRole: (id: string, actor?: string) => void;

    // Permission Management
    updatePermissions: (roleId: string, permissions: ModulePermission[], actor?: string) => void;

    // Role Assignment
    assignRole: (employeeId: string, employeeName: string, roleId: string, assignedBy: string) => void;
    unassignRole: (assignmentId: string) => void;

    // Queries
    getRoleById: (id: string) => Role | undefined;
    getRolesByEmployee: (employeeId: string) => Role[];
}

// Available Modules for Permission Mapping
export const AVAILABLE_MODULES = [
    'Dashboard',
    'Employees',
    'Attendance',
    'Leave Management',
    'Payroll',
    'Performance',
    'Recruitment',
    'Assets',
    'Documents',
    'Reports',
    'Settings',
    'Access Control'
];

// Initial System Roles
const INITIAL_ROLES: Role[] = [
    {
        id: 'role-2',
        name: 'HR Manager',
        description: 'HR operations and employee management',
        type: 'System',
        approvalAuthorityLevel: 3,
        permissions: [
            { module: 'Employees', actions: { view: true, create: true, edit: true, delete: false, approve: true }, scope: 'Organization', hasConfidentialAccess: true, fieldAccess: {} },
            { module: 'Attendance', actions: { view: true, create: false, edit: true, delete: false, approve: true }, scope: 'Organization', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Leave Management', actions: { view: true, create: false, edit: false, delete: false, approve: true }, scope: 'Organization', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Payroll', actions: { view: true, create: true, edit: true, delete: false, approve: true }, scope: 'Organization', hasConfidentialAccess: true, fieldAccess: {} },
            { module: 'Recruitment', actions: { view: true, create: true, edit: true, delete: true, approve: true }, scope: 'Organization', hasConfidentialAccess: true, fieldAccess: {} },
        ],
        assignedTo: [],
        history: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'role-3',
        name: 'Manager',
        description: 'Team management and approvals',
        type: 'System',
        approvalAuthorityLevel: 2,
        permissions: [
            { module: 'Employees', actions: { view: true, create: false, edit: false, delete: false, approve: false }, scope: 'Team', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Attendance', actions: { view: true, create: false, edit: false, delete: false, approve: true }, scope: 'Team', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Leave Management', actions: { view: true, create: false, edit: false, delete: false, approve: true }, scope: 'Team', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Performance', actions: { view: true, create: true, edit: true, delete: false, approve: true }, scope: 'Team', hasConfidentialAccess: true, fieldAccess: {} },
        ],
        assignedTo: [],
        history: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    },
    {
        id: 'role-4',
        name: 'Employee',
        description: 'Basic employee access',
        type: 'System',
        approvalAuthorityLevel: 0,
        permissions: [
            { module: 'Dashboard', actions: { view: true, create: false, edit: false, delete: false, approve: false }, scope: 'Self', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Attendance', actions: { view: true, create: true, edit: false, delete: false, approve: false }, scope: 'Self', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Leave Management', actions: { view: true, create: true, edit: false, delete: false, approve: false }, scope: 'Self', hasConfidentialAccess: false, fieldAccess: {} },
            { module: 'Documents', actions: { view: true, create: false, edit: false, delete: false, approve: false }, scope: 'Self', hasConfidentialAccess: false, fieldAccess: {} },
        ],
        assignedTo: [],
        history: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01'
    }
];

export const useRolesStore = create<RolesState>()(
    persist(
        (set, get) => ({
            roles: INITIAL_ROLES,
            assignments: [],

            createRole: (roleData) => set((state) => {
                const newRole: Role = {
                    ...roleData,
                    id: `role-${Date.now()}`,
                    assignedTo: [],
                    history: [{
                        id: `hist-${Date.now()}`,
                        action: 'Created',
                        details: `Role ${roleData.name} created`,
                        timestamp: new Date().toISOString(),
                        actor: 'HR Admin'
                    }],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                return { roles: [...state.roles, newRole] };
            }),

            updateRole: (id, updates, actor = 'HR Admin') => set((state) => ({
                roles: state.roles.map(role =>
                    role.id === id
                        ? {
                            ...role,
                            ...updates,
                            updatedAt: new Date().toISOString(),
                            history: [
                                {
                                    id: `hist-${Date.now()}`,
                                    action: 'Updated',
                                    details: `Role settings updated`,
                                    timestamp: new Date().toISOString(),
                                    actor
                                },
                                ...role.history
                            ]
                        }
                        : role
                )
            })),

            deleteRole: (id) => set((state) => {
                const role = state.roles.find(r => r.id === id);
                if (role?.type === 'System') {
                    console.error('Cannot delete system roles');
                    return state;
                }
                return {
                    roles: state.roles.filter(r => r.id !== id),
                    assignments: state.assignments.filter(a => a.roleId !== id)
                };
            }),

            updatePermissions: (roleId, permissions, actor = 'HR Admin') => set((state) => ({
                roles: state.roles.map(role =>
                    role.id === roleId
                        ? {
                            ...role,
                            permissions,
                            updatedAt: new Date().toISOString(),
                            history: [
                                {
                                    id: `hist-${Date.now()}`,
                                    action: 'Permission Change',
                                    details: `Access permissions modified`,
                                    timestamp: new Date().toISOString(),
                                    actor
                                },
                                ...role.history
                            ]
                        }
                        : role
                )
            })),

            assignRole: (employeeId, employeeName, roleId, assignedBy) => set((state) => {
                const role = state.roles.find(r => r.id === roleId);
                if (!role) return state;

                const newAssignment: RoleAssignment = {
                    id: `assign-${Date.now()}`,
                    employeeId,
                    employeeName,
                    roleId,
                    roleName: role.name,
                    assignedBy,
                    assignedAt: new Date().toISOString()
                };

                return {
                    assignments: [...state.assignments, newAssignment],
                    roles: state.roles.map(r =>
                        r.id === roleId
                            ? { ...r, assignedTo: [...r.assignedTo, employeeId] }
                            : r
                    )
                };
            }),

            unassignRole: (assignmentId) => set((state) => {
                const assignment = state.assignments.find(a => a.id === assignmentId);
                if (!assignment) return state;

                return {
                    assignments: state.assignments.filter(a => a.id !== assignmentId),
                    roles: state.roles.map(r =>
                        r.id === assignment.roleId
                            ? { ...r, assignedTo: r.assignedTo.filter(id => id !== assignment.employeeId) }
                            : r
                    )
                };
            }),

            getRoleById: (id) => get().roles.find(r => r.id === id),

            getRolesByEmployee: (employeeId) => {
                const assignments = get().assignments.filter(a => a.employeeId === employeeId);
                return assignments.map(a => get().roles.find(r => r.id === a.roleId)).filter(Boolean) as Role[];
            }
        }),
        { name: 'roles-storage' }
    )
);
