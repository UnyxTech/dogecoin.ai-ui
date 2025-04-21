import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface LoginInfoState {
  token?: string;
}

interface LoginAction {
  setToken: (token: LoginInfoState["token"]) => void;
}

export const useLoginStore = create<LoginInfoState & LoginAction>()(
  devtools(
    persist(
      (set) => ({
        token: undefined,
        setToken: (token: LoginInfoState["token"]) => set({ token }),
      }),
      {
        name: "login-token",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
