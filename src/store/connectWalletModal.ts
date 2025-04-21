import { create } from "zustand";

interface ConnectWalletModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useConnectWalletModalStore = create<ConnectWalletModalStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
