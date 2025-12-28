import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { updateCartApi } from "@/api/cartApi/upadateCartApi";
import { useSyncCart } from "./useSyncCart";
import ErrorMessage from "@/messages/errorMessage";

export const useUpdateCart = () => {
  const [loading, setLoading] = useState(false);
  const { syncCart } = useSyncCart();

  const updateQuantity = async (
    productId: string | number,
    tiendaId: string | number | undefined,
    newCount: number
  ) => {
    if (newCount < 1) return;

    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token || !auth?.user?.id) {
      return;
    }

    setLoading(true);
    try {
      const token = await refreshToken(auth, setAuth);
      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        return;
      }

      const response = await updateCartApi(
        auth.user.id,
        productId,
        tiendaId,
        newCount,
        token
      );

      if (response.ok) {
        await syncCart();
      } else {
        const errorData = await response.json().catch(() => ({}));
        ErrorMessage(errorData.error || "No se pudo actualizar la cantidad");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      ErrorMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return { updateQuantity, loading };
};
