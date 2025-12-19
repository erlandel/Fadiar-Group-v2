import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthState = {
  email: string | null;
  access_token: string | null;
  refresh_token: string | null;
  setAuth: (payload: {
    email: string | null;
    access_token: string | null;
    refresh_token: string | null;
  }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      access_token: null,
      refresh_token: null,
      setAuth: ({ email, access_token, refresh_token }) =>
        set(() => ({ email, access_token, refresh_token })),
      clearAuth: () => set(() => ({ email: null, access_token: null, refresh_token: null })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined as unknown as Storage)),
      partialize: (state) => ({
        email: state.email,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
      }),
      version: 1,
    }
  )
);

export default useAuthStore;
