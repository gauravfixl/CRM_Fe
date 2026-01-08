import { create } from "zustand";

/**
 * State interface for the global loader.
 */
interface LoaderState {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

/**
 * Store for managing global loading state.
 */
export const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  showLoader: () => set({ loading: true }),
  hideLoader: () => set({ loading: false }),
}));
