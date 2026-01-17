import { useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import ErrorMessage from "@/messages/errorMessage";
import SuccesMessage from "@/messages/succesMessage";
import { useSyncCart } from "./useSyncCart";
import { delete_product_from_cartUrl } from "@/urlApi/urlApi";

export const useDeleteFromCart = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const removeItemLocal = useCartStore((state) => state.removeItem);
  const { syncCart } = useSyncCart();

  const deleteFromCart = async (cartId: number, productId: number | string) => {
    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const token = await refreshToken(auth, setAuth);
      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        return;
      }

      const response = await fetch(
        `${delete_product_from_cartUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_carrito: cartId,
            emisor: "web",
          }),
        }
      );

      console.log("response ", response);
      if (response.ok) {
        // removeItemLocal(productId);
        await syncCart();
        SuccesMessage("Producto eliminado del carrito");
      } else {
        const errorData = await response.json().catch(() => ({}));
        ErrorMessage(errorData.error || "No se pudo eliminar el producto del carrito");
      }
    } catch (error) {
      ErrorMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return { deleteFromCart, loading };
};
