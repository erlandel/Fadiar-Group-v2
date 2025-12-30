import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProductsByLocationState {
  province: string;
  municipality: string;
  municipalityId: number | null;
  isOpen: boolean;
  products: any[];
  tiendas: any[];
  currencys: any;
  globalProducts: any[];
  lastFetchedMunicipalityId: number | null;
  setLocation: (province: string, municipality: string, municipalityId: number) => void;
  clearLocation: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setProductsData: (data: { products: any[]; tiendas: any[]; currencys: any; municipalityId: number }) => void;
  setGlobalProducts: (products: any[]) => void;
}

export const useProductsByLocationStore = create<ProductsByLocationState>()(
  persist(
    (set) => ({
      province: "",
      municipality: "",
      municipalityId: null,
      isOpen: false,
      products: [],
      tiendas: [],
      currencys: null,
      globalProducts: [],
      lastFetchedMunicipalityId: null,

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
          products: [],
          tiendas: [],
          currencys: null,
          globalProducts: [],
          lastFetchedMunicipalityId: null,
        })),

      setIsOpen: (isOpen) => set({ isOpen }),

      setProductsData: ({ products, tiendas, currencys, municipalityId }) =>
        set({
          products,
          tiendas,
          currencys,
          lastFetchedMunicipalityId: municipalityId,
        }),

      setGlobalProducts: (globalProducts) => set({ globalProducts }),
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
