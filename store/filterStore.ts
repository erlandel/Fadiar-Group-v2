import { create } from "zustand";

interface FilterState {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isFilterOpen: false,
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
}));

export default useFilterStore;
