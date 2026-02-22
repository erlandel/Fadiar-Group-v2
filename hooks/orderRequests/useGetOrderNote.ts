import { useState, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { noteUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";

export const useGetOrderNote = () => {
  const [loading, setLoading] = useState(false);

  const fetchOrderNote = useCallback(async (orderId: string | number) => {
    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token) {
      return null;
    }

    setLoading(true);

    try {
      const token = await refreshToken(auth, setAuth);

      if (!token) {
        ErrorMessage("No se pudo obtener una sesión válida");
        setLoading(false);
        return null;
      }

      const requestBody = {
        id_order: orderId,
      };

      const response = await fetch(noteUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("data recibida para nota:", data);

      if (response.ok) {
        // Acceder a messages[0].message basado en la estructura proporcionada
        if (data && data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
          return data.messages;
        }
        return null;
      } else {
        console.error("Error al obtener la nota del pedido:", data);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener la nota del pedido:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchOrderNote, loading };
};
