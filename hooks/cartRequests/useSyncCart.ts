import { useState, useCallback } from "react";
import useCartStore, { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import MatterCart1Store from "@/store/matterCart1Store";
import { refreshToken } from "@/utils/refreshToken";
import { get_cart_productsUrl } from "@/urlApi/urlApi";

export const useSyncCart = () => {
  const [loading, setLoading] = useState(false);
  const setItems = useCartStore((state) => state.setItems);
  const setRawCart = useCartStore((state) => state.setRawCart);

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

      const response = await fetch(`${get_cart_productsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_user: auth.user.id,
          comisiones: true,
        }),
      });

    
      if (response.ok) {
        const data = await response.json();
        
        console.log("Carrito obtenido del backend:", data);

        const mappedItems: CartItem[] = [];
        const rawCarrito = data.carrito || [];

        setRawCart(rawCarrito);

        if (rawCarrito.length > 0) {
          MatterCart1Store.getState().updateFormData({ delivery: false });
        }

        rawCarrito.forEach((tienda: any) => {
          const tiendaId = tienda.id;
          const tiendaName = tienda.name;
          const tiendaDireccion = tienda.direccion;
          const productos = tienda.productos || [];
          
          productos.forEach((item: any) => {
            const p = item.producto;
            if (p) {
              mappedItems.push({
                cartId: item.id,
                productId: String(p.id),
                title: p.name,
                brand: p.brand,
                category: p.categoria?.name,
                warranty: p.warranty ? String(p.warranty) : undefined,
                price:
                  p.temporal_price && Number(p.temporal_price) !== 0
                    ? String(p.temporal_price)
                    : String(p.price),
                temporal_price: p.temporal_price
                  ? String(p.temporal_price)
                  : undefined,
                image: p.img,
                quantity: item.en_carrito,
                currency: p.currency,
                tiendaId: tiendaId,
                tiendaName: tiendaName,
                tiendaDireccion: tiendaDireccion,
              });
            }
          });
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
