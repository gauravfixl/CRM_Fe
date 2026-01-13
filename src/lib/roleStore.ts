import { create } from "zustand";

interface RolesState {
  platform: any;
  organization: any;
  workspace: any;
  project: any;
  team: any;
}

interface RoleStore {
  roles: RolesState;
  simpleRoles: any[] | null;
  setRoles: (updater: Partial<RolesState> | ((prev: RolesState) => RolesState)) => void;
  setSimpleRoles: (roles: any[] | null) => void;
}

const useRolesStore = create<RoleStore>((set) => ({
  roles: {
    platform: null,
    organization: null,
    workspace: null,
    project: null,
    team: null,
  },
  simpleRoles: null,

  setRoles: (updater) =>
    set((state) => {
      const newRoles =
        typeof updater === "function"
          ? updater(state.roles)
          : { ...state.roles, ...updater };
      return { roles: newRoles };
    }),

  setSimpleRoles: (roles) =>
    set(() => {
      return { simpleRoles: roles };
    }),
}));

export default useRolesStore;
