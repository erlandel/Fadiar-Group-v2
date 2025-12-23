import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProductsByLocationState {
  province: string;
  municipality: string;
  isOpen: boolean;
  setLocation: (province: string, municipality: string) => void;
  clearLocation: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useProductsByLocationStore = create<ProductsByLocationState>()(
  persist(
    (set) => ({
      province: "",
      municipality: "",
      isOpen: false,

      setLocation: (province, municipality) =>
        set(() => ({
          province,
          municipality,
        })),

      clearLocation: () =>
        set(() => ({
          province: "",
          municipality: "",
        })),

      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "products-by-location-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : (undefined as unknown as Storage)
      ),
      partialize: (state) => ({
        province: state.province,
        municipality: state.municipality,
      }),
    }
  )
);

export default useProductsByLocationStore;
