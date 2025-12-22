import { create } from "zustand";

interface ImgFileState {
  pendingAvatar: File | null;
  setPendingAvatar: (file: File | null) => void;
  clearPendingAvatar: () => void;
}

const useImgFileStore = create<ImgFileState>((set) => ({
  pendingAvatar: null,
  setPendingAvatar: (file) => set({ pendingAvatar: file }),
  clearPendingAvatar: () => set({ pendingAvatar: null }),
}));

export default useImgFileStore;
