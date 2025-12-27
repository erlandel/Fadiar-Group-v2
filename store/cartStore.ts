import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import useAuthStore from "./authStore";
import { server_url } from "@/lib/apiClient";
import { refreshToken } from "../utils/refreshToken";
import ErrorMessage from "@/messages/errorMessage";

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
  tiendaId?: string | number;
};

export type CartState = {
  items: CartItem[];
  addOrUpdateItem: (item: CartItem) => Promise<void>;
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
      
      addOrUpdateItem: async (item) => {
        const quantity = Math.max(1, item.quantity);
        
        // Función interna para actualizar el estado local
        const updateLocalState = () => {
          set((state) => {
            const existingIndex = state.items.findIndex(
              (existing) => existing.productId === item.productId
            );

            if (existingIndex === -1) {
              return {
                items: [...state.items, { ...item, quantity }],
              };
            }

            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems };
          });
        };

        // Sincronizar con el backend si el usuario está autenticado
        const { auth, setAuth } = useAuthStore.getState();
        if (auth?.access_token) {
          try {
            // Actualizar el token antes de la petición
            const token = await refreshToken(auth, setAuth);
   
            const response = await fetch(`${server_url}/agregar_producto_carrito`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                id_product: item.productId,
                id_tienda: item.tiendaId,
                count: quantity,
                emisor: "web",
              }),
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Respuesta del backend (agregar al carrito):", data);
              // SOLO si la respuesta es exitosa (200 OK), actualizamos el carrito local
              updateLocalState();
            } else {
              const errorData = await response.json().catch(() => ({}));
              console.error("El backend rechazó la petición:", errorData);
              
              // Mostrar el mensaje de error del backend al usuario
              const msg = errorData.error || errorData.message || "No se pudo agregar el producto al carrito";
              ErrorMessage(msg);
            }
          } catch (error) {
            console.error("Error al sincronizar con el backend:", error);
            ErrorMessage("Error de conexión con el servidor");
          }
        } else {
          // Si no hay usuario autenticado, lo agregamos solo localmente
          updateLocalState();
        }
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