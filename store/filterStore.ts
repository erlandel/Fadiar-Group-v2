import { create } from "zustand";

interface FilterState {
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  shouldScrollToProducts: boolean;
  setShouldScrollToProducts: (shouldScroll: boolean) => void;
  shouldScrollToStore: boolean;
  setShouldScrollToStore: (shouldScroll: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isFilterOpen: false,
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  selectedCategories: [],
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),
  shouldScrollToProducts: false,
  setShouldScrollToProducts: (shouldScroll) =>
    set({ shouldScrollToProducts: shouldScroll }),
  shouldScrollToStore: false,
  setShouldScrollToStore: (shouldScroll) =>
    set({ shouldScrollToStore: shouldScroll }),
}));

export default useFilterStore;
