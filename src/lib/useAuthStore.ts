import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Permission {
  module: string;
  actions: string[];
  _id?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  twoFAEnabled: boolean;
  isActive: boolean;
  permissions?: Permission[]; // add permissions array
}

export interface Organization {
  orgId: string;
  orgName: string;
  orgContact?: string;
  orgEmail?: string;
  orgPhone?: string;
  logo?: string | null;
  employeeId?: string;
  memberId?: string;
  joinedAt?: string;
  orgActive?: boolean;
}

interface AuthState {
  user: User | null;
  organizations: Organization[];
  isAuthenticated: boolean;
  singleOrg: Organization | null;
  userRole: string | null;
  permissions: Permission[]; // add permissions

  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  setOrganizations: (orgs: Organization[] | Organization | unknown) => void;
  addOrganization: (newOrg: Organization) => void;
  updateOrganization: (index: number, updatedData: Partial<Organization>) => void;
  setSingleOrganization: (org: Organization) => void;
  setUserRole: (role: string | null) => void;
  setPermissions: (permissions: Permission[]) => void; // new setter
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        firstName: "Dev",
        lastName: "Admin",
        email: "admin@fixl.com",
        phone: "0000000000",
        twoFAEnabled: false,
        isActive: true,
        permissions: []
      },
      organizations: [
        {
          orgId: "dev-org-id",
          orgName: "Fixl",
          orgActive: true
        }
      ],
      isAuthenticated: true,
      singleOrg: {
        orgId: "dev-org-id",
        orgName: "Fixl",
        orgActive: true
      },
      userRole: "admin",
      permissions: [], // initialize empty array

      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          organizations: [],
          isAuthenticated: false,
          singleOrg: null,
          userRole: null,
          permissions: [],
        }),

      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),

      setOrganizations: (orgs) =>
        set(() => {
          let normalized: Organization[] = [];
          if (Array.isArray(orgs)) normalized = orgs.flat();
          else if (typeof orgs === 'object' && orgs !== null) normalized = [orgs as Organization];
          return { organizations: normalized };
        }),

      addOrganization: (newOrg) =>
        set((state) => ({
          organizations: [...state.organizations, newOrg],
        })),

      updateOrganization: (index, updatedData) =>
        set((state) => {
          if (!state.organizations[index]) return state;
          const updatedOrg = { ...state.organizations[index], ...updatedData };
          const newOrgs = [...state.organizations];
          newOrgs[index] = updatedOrg;
          return { organizations: newOrgs };
        }),

      setSingleOrganization: (org) => set({ singleOrg: org }),
      setUserRole: (role) => set({ userRole: role }),
      setPermissions: (permissions) => set({ permissions }), // setter for permissions
    }),
    {
      name: 'auth-storage',
    }
  )
);
