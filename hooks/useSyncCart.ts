import { useState, useCallback } from "react";
import useCartStore, { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { getCartApi } from "@/api/cartApi/getCartApi";

export const useSyncCart = () => {
  const [loading, setLoading] = useState(false);
  const setItems = useCartStore((state) => state.setItems);

  const syncCart = useCallback(async () => {
    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token || !auth?.user?.id) {
      return;
    }

    setLoading(true);
    try {
      const token = await refreshToken(auth, setAuth);
      if (!token) {
        return;
      }

      const response = await getCartApi(auth.user.id, token);

      if (response.ok) {
        const data = await response.json();
        console.log("Carrito obtenido del backend:", data);

        // Mapear la respuesta del backend al tipo CartItem
        // Según la estructura: data.carrito es el array, y cada item tiene item.id (cartId) y item.producto
        const mappedItems: CartItem[] = (data.carrito || []).map((item: any) => {
          const p = item.producto;
          return {
            cartId: item.id, // Este es el id_carrito
            productId: p.id,
            title: p.name,
            brand: p.brand,
            category: p.categoria?.name,
            warranty: p.warranty ? String(p.warranty) : undefined,
            price: String(p.price),
            temporal_price: p.temporal_price ? String(p.temporal_price) : undefined,
            image: p.img,
            quantity: item.en_carrito,
            tiendaId: item.id_tienda,
          };
        });

        setItems(mappedItems);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error al obtener el carrito:", errorData);
      }
    } catch (error) {
      console.error("Error de conexión al sincronizar el carrito:", error);
    } finally {
      setLoading(false);
    }
  }, [setItems]);

  return { syncCart, loading };
};
