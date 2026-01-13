import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FormData = {
  phone: string;
  identityCard: string;
  province: string;
  municipality: string;
  delivery: boolean;
  customerName?: string;
  firstName: string;
  lastName1: string;
  lastName2: string;
  address: string;
};

export type FormState = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setFormData: (data: FormData) => void;
  clearFormData: () => void;
  resetToDefaults: () => void;
};

const defaultFormData: FormData = {
  phone: "+53 ",
  identityCard: "",
  province: "",
  municipality: "",
  delivery: false,
  customerName: "",
  firstName: "",
  lastName1: "",
  lastName2: "",
  address: "",
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
