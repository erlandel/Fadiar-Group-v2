import { useState, useCallback } from "react";
import useCartStore, { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
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

        // Mapear la respuesta del backend al tipo CartItem
        // Ahora la respuesta viene agrupada por tienda
        const mappedItems: CartItem[] = [];
        
        const rawCarrito = data.carrito || [];
        setRawCart(rawCarrito);

        rawCarrito.forEach((tienda: any) => {
           const tiendaId = tienda.id;
           const tiendaName = tienda.name;
           const tiendaDireccion = tienda.direccion;
           
           // Asumimos que los productos están en una propiedad de la tienda, 
           // probablemente 'productos' o similar, basándonos en que antes 
           // data.carrito era la lista de productos directamente.
           const productos = tienda.productos || [];
           
           productos.forEach((item: any) => {
             const p = item.producto;
             if (p) {
               mappedItems.push({
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
