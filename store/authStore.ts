import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const AUTH_STORAGE_NAME = "auth-storage";
const AUTH_SYNC_CHANNEL = "auth-sync";

/* ===== Tipos ===== */

export type Person = {
  id: string;
  name: string;
  lastname1: string;
  lastname2: string;
  ci: string;
  address: string;
  cellphone1: string;
  cellphone2: string | null;
};

export type User = {
  id: string;
  username: string;
  email: string;
  active: boolean;
  img: string | null;
  id_person: string;
  id_type: string;
  id_paquete: string | null;
  referredcode: string;
  registrationid: string | null;
  password?: string;
};

export type UserType = {
  id: string;
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
  updatePerson: (person: Partial<Person>) => void;
  clearAuth: () => void;
};

type PersistedAuthStore = {
  state?: {
    auth?: AuthPayload | null;
  };
  version?: number;
};

type AuthSyncMessage = {
  type: "AUTH_STATE_SYNC";
  auth: AuthPayload | null;
  timestamp: number;
};

let authChannel: BroadcastChannel | null = null;
let authSyncInitialized = false;

const canUseBrowserAPIs = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

const getAuthChannel = () => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  if (!authChannel) {
    authChannel = new BroadcastChannel(AUTH_SYNC_CHANNEL);
  }

  return authChannel;
};

const broadcastAuthState = (auth: AuthPayload | null) => {
  const channel = getAuthChannel();

  if (!channel) return;

  const message: AuthSyncMessage = {
    type: "AUTH_STATE_SYNC",
    auth,
    timestamp: Date.now(),
  };

  channel.postMessage(message);
};

const parsePersistedAuth = (value: string | null) => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as PersistedAuthStore;
    return parsed.state?.auth ?? null;
  } catch {
    return null;
  }
};

const getCurrentAuth = () => useAuthStore.getState().auth;

const syncAuthState = (nextAuth: AuthPayload | null) => {
  const currentAuth = getCurrentAuth();

  if (JSON.stringify(currentAuth) === JSON.stringify(nextAuth)) {
    return;
  }

  useAuthStore.setState({ auth: nextAuth });
};

export const initializeAuthSync = () => {
  if (!canUseBrowserAPIs() || authSyncInitialized) {
    return () => undefined;
  }

  authSyncInitialized = true;

  const channel = getAuthChannel();

  const handleSync = (nextAuth: AuthPayload | null) => {
    syncAuthState(nextAuth);
  };

  const handleBroadcastMessage = (event: MessageEvent<AuthSyncMessage>) => {
    if (event.data?.type !== "AUTH_STATE_SYNC") return;
    handleSync(event.data.auth);
  };

  const handleStorage = (event: StorageEvent) => {
    if (
      event.storageArea !== localStorage ||
      event.key !== AUTH_STORAGE_NAME
    ) {
      return;
    }

    handleSync(parsePersistedAuth(event.newValue));
  };

  channel?.addEventListener("message", handleBroadcastMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleBroadcastMessage);
    window.removeEventListener("storage", handleStorage);
    authSyncInitialized = false;
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,

      setAuth: (payload) =>
        set(() => {
          broadcastAuthState(payload);
          return {
            auth: payload,
          };
        }),

      updatePerson: (personUpdates) =>
        set((state) => {
          if (!state.auth) return state;
          const nextAuth = {
            ...state.auth,
            person: {
              ...state.auth.person,
              ...personUpdates,
            },
          };

          broadcastAuthState(nextAuth);

          return {
            auth: {
              ...nextAuth,
            },
          };
        }),

      clearAuth: () =>
        set(() => {
          broadcastAuthState(null);
          return {
            auth: null,
          };
        }),
    }),
    {
      name: AUTH_STORAGE_NAME,
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
