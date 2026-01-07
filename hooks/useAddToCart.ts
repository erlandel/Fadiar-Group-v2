import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore, { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { server_url } from "@/lib/apiClient";
import ErrorMessage from "@/messages/errorMessage";
import { useSyncCart } from "./useSyncCart";

export const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addOrUpdateItemLocal = useCartStore((state) => state.addOrUpdateItem);
  const { syncCart } = useSyncCart();

  const addToCart = async (item: CartItem) => {
    const { auth, setAuth } = useAuthStore.getState();

    // Si el usuario no está logueado, mandarlo al login
    if (!auth?.access_token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // 1. Sincronizar con el backend
      const token = await refreshToken(auth, setAuth);
      
      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        return;
      }

      const requestBody = {
        id_product: item.productId,
        id_tienda: item.tiendaId,
        count: item.quantity,
        emisor: "web",
      };

      const response = await fetch(`${server_url}/agregar_producto_carrito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Respuesta del backend (agregar al carrito):", response);
      if (response.ok) {
        const data = await response.json();
        // console.log("Respuesta del backend (agregar al carrito):", data);
        
        // 2. SOLO si la respuesta es exitosa (200 OK), actualizamos el carrito local
        // addOrUpdateItemLocal(item);
        // Sincronizamos el carrito completo para asegurar consistencia
        await syncCart();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("El backend rechazó la petición:", errorData);
        
        const msg = errorData.error || errorData.message || "No se pudo agregar el producto al carrito";
        ErrorMessage(msg);
      }
    } catch (error) {
      console.error("Error al sincronizar con el backend:", error);
      ErrorMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
};
