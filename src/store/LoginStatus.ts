import { create } from "zustand";

interface LoginStatusStore {
  loggining: boolean;
  setLoggining: (loggining: boolean) => void;
}

export const useLoginStatusStore = create<LoginStatusStore>(
  (set) => ({
    loggining: false,
    setLoggining: (loggining: boolean) => set({ loggining }),
  })
);
