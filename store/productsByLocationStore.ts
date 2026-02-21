import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProductsByLocationState {
  province: string;
  provinceId: string | null;
  municipality: string;
  municipalityId: string | null;
  isOpen: boolean;
  products: any[];
  tiendas: any[];
  currencys: any;
  globalProducts: any[];
  lastFetchedMunicipalityId: string | null;
  setLocation: (province: string, provinceId: string | null, municipality: string, municipalityId: string | null) => void;
  clearLocation: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setProductsData: (data: { products: any[]; tiendas: any[]; currencys: any; municipalityId: string | null }) => void;
  setGlobalProducts: (products: any[]) => void;
}

export const useProductsByLocationStore = create<ProductsByLocationState>()(
  persist(
    (set) => ({
      province: "",
      provinceId: null,
      municipality: "",
      municipalityId: null,
      isOpen: false,
      products: [],
      tiendas: [],
      currencys: null,
      globalProducts: [],
      lastFetchedMunicipalityId: null,

      setLocation: (province, provinceId, municipality, municipalityId) =>
        set(() => ({
          province,
          provinceId,
          municipality,
          municipalityId,
        })),

      clearLocation: () =>
        set(() => ({
          province: "",
          provinceId: null,
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
        provinceId: state.provinceId,
        municipality: state.municipality,
        municipalityId: state.municipalityId,
      }),
    }
  )
);

export default useProductsByLocationStore;
