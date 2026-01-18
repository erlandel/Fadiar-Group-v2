import { useState, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { get_product_orderUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";
import { OrderProduct } from "./useGetOrders";

export const useGetOrderProducts = () => {
  const [loading, setLoading] = useState(false);

  const fetchOrderProducts = useCallback(async (orderId: string | number) => {
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

      console.log("Enviando body al backend (getOrder):", requestBody);

      const response = await fetch(get_product_orderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos del pedido recibidos:", data);
        
        // Los productos vienen dentro de la propiedad 'products' del objeto devuelto
        if (data && data.products && Array.isArray(data.products)) {
          return data.products as OrderProduct[];
        }
        
        return [];
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error al obtener productos del pedido:", errorData);
        ErrorMessage(errorData.error || errorData.message || "Error al obtener los productos del pedido");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener productos del pedido:", error);
      ErrorMessage("Error de conexión con el servidor");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchOrderProducts, loading };
};
