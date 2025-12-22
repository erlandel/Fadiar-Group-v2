import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ===== Tipos ===== */

export type Person = {
  id: number;
  name: string;
  lastname1: string;
  lastname2: string;
  ci: string;
  address: string;
  cellphone1: string;
  cellphone2: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  active: boolean;
  img: string | null;
  id_person: number;
  id_type: number;
  id_paquete: number | null;
  referredcode: string;
  registrationid: string | null;
  password?: string;
};

export type UserType = {
  id: number;
  category: number;
  type: string;
};

export type AuthPayload = {
  person: Person;
  user: User;
  type: UserType;
  access_token: string;
  refresh_token: string;
};

/* ===== Store ===== */

export type AuthState = {
  auth: AuthPayload | null;
  setAuth: (payload: AuthPayload) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,

      setAuth: (payload) =>
        set(() => ({
          auth: payload,
        })),

      clearAuth: () =>
        set(() => ({
          auth: null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : (undefined as unknown as Storage)
      ),
      version: 1,
    }
  )
);

export default useAuthStore;
