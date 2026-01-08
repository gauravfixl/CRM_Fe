import { create } from "zustand"

export interface Tax {
  id: string
  name: string
  type: "gst" | "custom"
  scope: "global" | "firm"
  firmId?: string
  rate: number
  description?: string
  isEnabled: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  permissions: string[]
  userCount: number
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
  activities?: ActivityEntry[]
}

interface Store {
  taxes: Tax[]
  addTax: (tax: Tax) => void
  updateTax: (id: string, updates: Partial<Tax>) => void
  deleteTax: (id: string) => void
  // Roles & Permissions
  roles: Role[]
  permissions: Permission[]
  addRole: (role: Omit<Role, "id" | "createdAt" | "updatedAt">) => void
  updateRole: (id: string, updates: Partial<Role>) => void
  deleteRole: (id: string) => void
  restoreRole: (id: string) => void
  getRoleById: (id: string) => Role | undefined
  getPermissionsByModule: (module: string) => Permission[]
  getAllPermissions: () => Permission[]
  addRoleActivity: (roleId: string, activity: Omit<ActivityEntry, "id" | "performedAt">) => void
}

interface ActivityEntry {
  id: string
  type: string
  title: string
  description: string
  performedBy: string
  performedAt: string
}

const initialPermissions: Permission[] = [
  // CRM Permissions
  { id: "crm_view", name: "View CRM", description: "View CRM data", module: "CRM", action: "view" },
  { id: "crm_create", name: "Create CRM", description: "Create CRM records", module: "CRM", action: "create" },
  { id: "crm_edit", name: "Edit CRM", description: "Edit CRM records", module: "CRM", action: "edit" },
  { id: "crm_delete", name: "Delete CRM", description: "Delete CRM records", module: "CRM", action: "delete" },

  // Lead Management Permissions
  { id: "leads_view", name: "View Leads", description: "View leads data", module: "Lead Management", action: "view" },
  {
    id: "leads_create",
    name: "Create Leads",
    description: "Create new leads",
    module: "Lead Management",
    action: "create",
  },
  {
    id: "leads_edit",
    name: "Edit Leads",
    description: "Edit lead information",
    module: "Lead Management",
    action: "edit",
  },
  {
    id: "leads_delete",
    name: "Delete Leads",
    description: "Delete leads",
    module: "Lead Management",
    action: "delete",
  },

  // Invoice Management Permissions
  {
    id: "invoice_view",
    name: "View Invoices",
    description: "View invoice data",
    module: "Invoice Management",
    action: "view",
  },
  {
    id: "invoice_create",
    name: "Create Invoices",
    description: "Create new invoices",
    module: "Invoice Management",
    action: "create",
  },
  {
    id: "invoice_edit",
    name: "Edit Invoices",
    description: "Edit invoice information",
    module: "Invoice Management",
    action: "edit",
  },
  {
    id: "invoice_delete",
    name: "Delete Invoices",
    description: "Delete invoices",
    module: "Invoice Management",
    action: "delete",
  },

  // Project Management Permissions
  {
    id: "project_view",
    name: "View Projects",
    description: "View project data",
    module: "Project Management",
    action: "view",
  },
  {
    id: "project_create",
    name: "Create Projects",
    description: "Create new projects",
    module: "Project Management",
    action: "create",
  },
  {
    id: "project_edit",
    name: "Edit Projects",
    description: "Edit project information",
    module: "Project Management",
    action: "edit",
  },
  {
    id: "project_delete",
    name: "Delete Projects",
    description: "Delete projects",
    module: "Project Management",
    action: "delete",
  },

  // HRMS Permissions
  { id: "hrms_view", name: "View HRMS", description: "View HRMS data", module: "HRMS", action: "view" },
  { id: "hrms_create", name: "Create HRMS", description: "Create HRMS records", module: "HRMS", action: "create" },
  { id: "hrms_edit", name: "Edit HRMS", description: "Edit HRMS records", module: "HRMS", action: "edit" },
  { id: "hrms_delete", name: "Delete HRMS", description: "Delete HRMS records", module: "HRMS", action: "delete" },

  // Administration Permissions
  {
    id: "admin_view",
    name: "View Administration",
    description: "View admin settings",
    module: "Administration",
    action: "view",
  },
  {
    id: "admin_manage_roles",
    name: "Manage Roles",
    description: "Create and manage roles",
    module: "Administration",
    action: "manage_roles",
  },
  {
    id: "admin_manage_users",
    name: "Manage Users",
    description: "Manage user accounts",
    module: "Administration",
    action: "manage_users",
  },
  {
    id: "admin_system_settings",
    name: "System Settings",
    description: "Configure system settings",
    module: "Administration",
    action: "system_settings",
  },
]

const initialRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all permissions",
    isSystem: true,
    permissions: initialPermissions.map((p) => p.id),
    userCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    activities: [
      {
        id: "act1",
        type: "created",
        title: "Role Created",
        description: "Administrator role created",
        performedBy: "System",
        performedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Management level access with most permissions",
    isSystem: true,
    permissions: [
      "crm_view",
      "crm_create",
      "crm_edit",
      "leads_view",
      "leads_create",
      "leads_edit",
      "invoice_view",
      "invoice_create",
      "invoice_edit",
      "project_view",
      "project_create",
      "project_edit",
      "hrms_view",
      "hrms_create",
      "hrms_edit",
    ],
    userCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    activities: [
      {
        id: "act2",
        type: "created",
        title: "Role Created",
        description: "Manager role created",
        performedBy: "System",
        performedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "employee",
    name: "Employee",
    description: "Basic employee access with view and limited edit permissions",
    isSystem: true,
    permissions: ["crm_view", "leads_view", "leads_create", "invoice_view", "project_view", "hrms_view"],
    userCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    activities: [
      {
        id: "act3",
        type: "created",
        title: "Role Created",
        description: "Employee role created",
        performedBy: "System",
        performedAt: "2024-01-01T00:00:00Z",
      },
    ],
  },
]

const useStore = create<Store>((set, get) => ({
  taxes: [
    {
      id: "tax-1",
      name: "GST",
      type: "gst",
      scope: "global",
      rate: 18,
      description: "Goods and Services Tax",
      isEnabled: true,
      isDeleted: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "tax-2",
      name: "Service Tax",
      type: "custom",
      scope: "firm",
      firmId: "firm-1",
      rate: 15,
      description: "Custom service tax for specific firm",
      isEnabled: true,
      isDeleted: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  addTax: (tax) =>
    set((state) => ({
      taxes: [...state.taxes, tax],
    })),
  updateTax: (id, updates) =>
    set((state) => ({
      taxes: state.taxes.map((tax) => (tax.id === id ? { ...tax, ...updates } : tax)),
    })),
  deleteTax: (id) =>
    set((state) => ({
      taxes: state.taxes.map((tax) => (tax.id === id ? { ...tax, isDeleted: true } : tax)),
    })),
  // Roles & Permissions
  roles: initialRoles,
  permissions: initialPermissions,
  addRole: (roleData) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          type: "created",
          title: "Role Created",
          description: `New role "${roleData.name}" created`,
          performedBy: "System",
          performedAt: new Date().toISOString(),
        },
      ],
    }
    set((state) => ({ roles: [...state.roles, newRole] }))
  },
  updateRole: (id, updates) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id
          ? {
              ...role,
              ...updates,
              updatedAt: new Date().toISOString(),
              activities: [
                ...(role.activities || []),
                {
                  id: `act-${Date.now()}`,
                  type: "updated",
                  title: "Role Updated",
                  description: "Role information updated",
                  performedBy: "System",
                  performedAt: new Date().toISOString(),
                },
              ],
            }
          : role,
      ),
    }))
  },
  deleteRole: (id) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id
          ? {
              ...role,
              isDeleted: true,
              updatedAt: new Date().toISOString(),
              activities: [
                ...(role.activities || []),
                {
                  id: `act-${Date.now()}`,
                  type: "deleted",
                  title: "Role Deleted",
                  description: "Role moved to deleted items",
                  performedBy: "System",
                  performedAt: new Date().toISOString(),
                },
              ],
            }
          : role,
      ),
    }))
  },
  restoreRole: (id) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id
          ? {
              ...role,
              isDeleted: false,
              updatedAt: new Date().toISOString(),
              activities: [
                ...(role.activities || []),
                {
                  id: `act-${Date.now()}`,
                  type: "restored",
                  title: "Role Restored",
                  description: "Role restored from deleted items",
                  performedBy: "System",
                  performedAt: new Date().toISOString(),
                },
              ],
            }
          : role,
      ),
    }))
  },
  getRoleById: (id) => get().roles.find((role) => role.id === id),
  getPermissionsByModule: (module) => get().permissions.filter((permission) => permission.module === module),
  getAllPermissions: () => get().permissions,
  addRoleActivity: (roleId, activity) => {
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              activities: [
                ...(role.activities || []),
                {
                  ...activity,
                  id: `act-${Date.now()}`,
                  performedAt: new Date().toISOString(),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : role,
      ),
    }))
  },
}))

export default useStore
