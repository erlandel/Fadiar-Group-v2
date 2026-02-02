import { create } from "zustand";

interface FilterState {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  preselectedCategory: string | null;
  setPreselectedCategory: (category: string | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isFilterOpen: false,
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  preselectedCategory: null,
  setPreselectedCategory: (category) => set({ preselectedCategory: category }),
}));

export default useFilterStore;
