import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";

interface InfoState {
  evmAddress?: string;
  appLoginStatus: 'authed'|'disconnecting'|'disconnected';
  installWallets: any; // or another appropriate type
  currentEvmWallet?: string;
  evmProviderNameState: string | undefined;
  ethBalance?: string;
}

interface UserAction {
  setEvmAddress: (evmAddress: InfoState["evmAddress"]) => void;
  setInstallWallets: (installWallets: InfoState["installWallets"]) => void;
  setCurrentEvmWallet: (
    currentEvmWallet: InfoState["currentEvmWallet"]
  ) => void;
  setEvmProviderNameState: (
    evmProviderNameState: InfoState["evmProviderNameState"]
  ) => void;
  setEthBalance: (ethBalance: InfoState["ethBalance"]) => void;
  setAppLoginStatus: (appLoginStatus: InfoState["appLoginStatus"]) => void;
}

export const useUserStore = create<InfoState & UserAction>()(
  devtools(
    persist(
      (set) => ({
        evmAddress: undefined,
        installWallets: undefined,
        currentEvmWallet: undefined,
        evmProviderNameState: undefined,
        appLoginStatus: 'disconnected',
        evmBalance: undefined,
        setEvmAddress: (evmAddress: InfoState["evmAddress"]) =>
          set({ evmAddress }),
        setInstallWallets: (installWallets: InfoState["installWallets"]) =>
          set({ installWallets }),
        setCurrentEvmWallet: (
          currentEvmWallet: InfoState["currentEvmWallet"]
        ) => set({ currentEvmWallet }),
        setEvmProviderNameState: (
          evmProviderNameState: InfoState["evmProviderNameState"]
        ) => set({ evmProviderNameState }),
        setEthBalance: (ethBalance: InfoState["ethBalance"]) =>
          set({ ethBalance }),
        setAppLoginStatus: (appLoginStatus: InfoState["appLoginStatus"]) =>
          set({ appLoginStatus }),
      }),
      {
        name: "dogecoin",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          const { installWallets, ...rest } = state;
          return rest;
        },
      }
    )
  )
);
