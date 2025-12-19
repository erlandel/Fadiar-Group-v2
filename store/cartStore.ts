import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

export type CartItem = {
  productId: number | string;
  title: string;
  brand: string;
  category?: string;
  warranty?: string;
  price: string;
  temporal_price?: string;
  image: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  addOrUpdateItem: (item: CartItem) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  removeItem: (productId: number | string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number | string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

type CartStore = CartState;

const cartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addOrUpdateItem: (item) => {
        const quantity = Math.max(1, item.quantity);
        set((state) => {
          const existingIndex = state.items.findIndex(
            (existing) => existing.productId === item.productId
          );

          if (existingIndex === -1) {
            // Agregar nuevo item
            return {
              items: [...state.items, { ...item, quantity }],
            };
          }

          // Actualizar item existente (incrementar cantidad)
          const updatedItems = [...state.items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          };
          return { items: updatedItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),

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
      name: "cart-storage",
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