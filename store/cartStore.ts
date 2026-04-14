import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CART_STORAGE_NAME = "cart-storage";
const CART_SYNC_CHANNEL = "cart-sync";

export type CartItem = {
  cartId?: string;
  productId: string;
  title: string;
  brand: string;
  category?: string;
  warranty?: string;
  price: string;
  temporal_price?: string;
  image: string;
  quantity: number;
  expiryTimestamp?: number;
  currency?: {
    currency: string;
  };
  tiendaId?: string;
  tiendaName?: string;
  tiendaDireccion?: string;
};

export type CartState = {
  items: CartItem[];
  rawCart: any[];
  addOrUpdateItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setItems: (items: CartItem[]) => void;
  setRawCart: (cart: any[]) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

type CartStore = CartState;

type PersistedCartStore = {
  state?: {
    items?: CartItem[];
  };
  version?: number;
};

type CartSyncState = {
  items: CartItem[];
  rawCart: any[];
};

type CartSyncMessage = {
  type: "CART_STATE_SYNC";
  payload: CartSyncState;
  timestamp: number;
};

let cartChannel: BroadcastChannel | null = null;
let cartSyncInitialized = false;

const canUseBrowserAPIs = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

const getCartChannel = () => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  if (!cartChannel) {
    cartChannel = new BroadcastChannel(CART_SYNC_CHANNEL);
  }

  return cartChannel;
};

const getCartState = () => {
  const state = cartStore.getState();
  return {
    items: state.items,
    rawCart: state.rawCart,
  };
};

const getCartSignature = (state: CartSyncState) =>
  JSON.stringify({
    items: state.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      tiendaId: item.tiendaId,
      cartId: item.cartId,
    })),
    rawCartLength: state.rawCart.length,
  });

const broadcastCartState = (payload: CartSyncState) => {
  const channel = getCartChannel();
  if (!channel) return;

  const message: CartSyncMessage = {
    type: "CART_STATE_SYNC",
    payload,
    timestamp: Date.now(),
  };

  channel.postMessage(message);
};

const parsePersistedCart = (value: string | null): CartSyncState => {
  if (!value) return { items: [], rawCart: [] };

  try {
    const parsed = JSON.parse(value) as PersistedCartStore;
    return {
      items: parsed.state?.items ?? [],
      rawCart: [],
    };
  } catch {
    return { items: [], rawCart: [] };
  }
};

const syncCartState = (nextState: CartSyncState) => {
  const currentState = getCartState();
  if (getCartSignature(currentState) === getCartSignature(nextState)) {
    return;
  }

  cartStore.setState({
    items: nextState.items,
    rawCart: nextState.rawCart,
  });
};

export const initializeCartSync = () => {
  if (!canUseBrowserAPIs() || cartSyncInitialized) {
    return () => undefined;
  }

  cartSyncInitialized = true;
  const channel = getCartChannel();

  const handleSync = (nextState: CartSyncState) => {
    syncCartState(nextState);
  };

  const handleBroadcastMessage = (event: MessageEvent<CartSyncMessage>) => {
    if (event.data?.type !== "CART_STATE_SYNC") return;
    handleSync(event.data.payload);
  };

  const handleStorage = (event: StorageEvent) => {
    if (
      event.storageArea !== localStorage ||
      event.key !== CART_STORAGE_NAME
    ) {
      return;
    }

    handleSync(parsePersistedCart(event.newValue));
  };

  channel?.addEventListener("message", handleBroadcastMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleBroadcastMessage);
    window.removeEventListener("storage", handleStorage);
    cartSyncInitialized = false;
  };
};

const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      rawCart: [],
      
      addOrUpdateItem: (item) => {
        const quantity = Math.max(1, item.quantity);

        set((state) => {
          const existingIndex = state.items.findIndex(
            (existing) => existing.productId === item.productId
          );

          if (existingIndex === -1) {
            const nextState = {
              items: [...state.items, { ...item, quantity }],
              rawCart: state.rawCart,
            };
            broadcastCartState(nextState);
            return nextState;
          }

          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          };
          const nextState = {
            items: updatedItems,
            rawCart: state.rawCart,
          };
          broadcastCartState(nextState);
          return nextState;
        });
      },


      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        
        set((state) => {
          const nextState = {
            items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
            ),
            rawCart: state.rawCart,
          };
          broadcastCartState(nextState);
          return nextState;
        });
      },

      removeItem: (productId) =>
        set((state) => {
          const nextState = {
            items: state.items.filter((item) => item.productId !== productId),
            rawCart: state.rawCart,
          };
          broadcastCartState(nextState);
          return nextState;
        }),

      setItems: (items) =>
        set((state) => {
          const nextState = { items, rawCart: state.rawCart };
          broadcastCartState(nextState);
          return nextState;
        }),

      setRawCart: (rawCart) =>
        set((state) => {
          const nextState = { items: state.items, rawCart };
          broadcastCartState(nextState);
          return nextState;
        }),

      clearCart: () =>
        set(() => {
          const nextState = { items: [], rawCart: [] };
          broadcastCartState(nextState);
          return nextState;
        }),

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.productId === productId);
        return item?.quantity || 0;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
          return total + (price * item.quantity);
        }, 0);
      },
    }),
    {
      name: CART_STORAGE_NAME,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : (undefined as unknown as Storage)
      ),
      version: 1,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default cartStore;