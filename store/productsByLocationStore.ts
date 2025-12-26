import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProductsByLocationState {
  province: string;
  municipality: string;
  municipalityId: number | null;
  isOpen: boolean;
  setLocation: (province: string, municipality: string, municipalityId: number) => void;
  clearLocation: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useProductsByLocationStore = create<ProductsByLocationState>()(
  persist(
    (set) => ({
      province: "",
      municipality: "",
      municipalityId: null,
      isOpen: false,

      setLocation: (province, municipality, municipalityId) =>
        set(() => ({
          province,
          municipality,
          municipalityId,
        })),

      clearLocation: () =>
        set(() => ({
          province: "",
          municipality: "",
          municipalityId: null,
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
        municipalityId: state.municipalityId,
      }),
    }
  )
);

export default useProductsByLocationStore;
