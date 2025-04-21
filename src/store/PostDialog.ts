import { create } from "zustand";

interface PostDialogStore {
  needReopen: boolean;
  openPageId: number;
  setOpenPageId: (openPageId: number) => void;
  setNeedReopen: (needReopen: boolean) => void;
}

export const usePostDialogStore = create<PostDialogStore>(
  (set) => ({
    needReopen: false,
    openPageId: 0,
    setOpenPageId: (openPageId: number) => set({ openPageId }),
    setNeedReopen: (needReopen: boolean) => set({ needReopen }),
  })
);
