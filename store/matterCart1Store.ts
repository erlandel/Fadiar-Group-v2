import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SelectedStore = {
  id: string | number;
  name: string;
  direccion?: string;
  products: any[];
  deliveryPrice?: number;
};

export type FormData = {
  phone: string;
  province: string;
  municipality: string;
  delivery: boolean;
  deliveryPrice?: number;
  customerName?: string;
  firstName: string;
  lastName1: string;
  lastName2: string;
  address: string;
  note?: string;
  stores?: SelectedStore[];
  showDeliveryOverlay?: boolean;
};

export type FormState = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setFormData: (data: FormData) => void;
  clearFormData: () => void;
  resetToDefaults: () => void;
};

export const defaultFormData: FormData = {
  phone: "+53 ",
  province: "",
  municipality: "",
  delivery: false,
  deliveryPrice: 0,
  customerName: "",
  firstName: "",
  lastName1: "",
  lastName2: "",
  address: "",
  note: "",
  stores: [],
  showDeliveryOverlay: false,
};

type FormStore = FormState;

const MatterCart1Store = create<FormStore>()(
  persist(
    (set) => ({
      formData: defaultFormData,
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setFormData: (data) =>
        set(() => ({
          formData: data,
        })),

      clearFormData: () =>
        set(() => ({
          formData: defaultFormData,
        })),

      resetToDefaults: () =>
        set(() => ({
          formData: defaultFormData,
        })),
    }),
    {
      name: "form-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : (undefined as unknown as Storage)
      ),
      version: 1,
      partialize: (state) => ({
        formData: state.formData,
      }),
    }
  )
);

export default MatterCart1Store;
