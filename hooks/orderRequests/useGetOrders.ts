import { useState, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { get_ordersUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";

export interface OrderProduct {
  name: string;
  brand: string;
  price: number;
  img: string;
  count: number;
}

export interface Order {
  id: string;
  date: string;
  time: string;
  client_ci: string;
  client_cell: string;
  status: "En espera" | "Confirmado" | "Cancelado" | string;
  products: OrderProduct[];
}

export const useGetOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (lastId: string | number = 0, size: number = 10, searchText: string = "") => {
    if (loading) return; // Evitar peticiones simultáneas

    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token) {
      return;
    }

    setLoading(true);

    try {
      // 1. Refrescar el token y esperar el resultado
      const token = await refreshToken(auth, setAuth);
     

      if (!token) {
        ErrorMessage("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        setLoading(false);
        return;
      }

      // 2. Una vez obtenido el token, realizar la petición de órdenes
      const requestBody = {
        last_id: lastId,
        size: size,
        search_text: searchText
      };

      const response = await fetch(get_ordersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

    //   console.log("response", response);

      if (response.ok) {
        const data = await response.json();
       
        
        // Process data to separate date and time if they are together in 'date'
        const processedData = data.map((order: any) => {
          let dateStr = order.date || "";
          let finalDate = dateStr;
          let finalTime = order.time || "";

          if (dateStr.includes(" ")) {
            const parts = dateStr.split(" ");
            finalDate = parts[0];
            finalTime = parts[1];
          } else if (dateStr.includes("T")) {
            const parts = dateStr.split("T");
            finalDate = parts[0];
            finalTime = parts[1].split(".")[0]; // Remove milliseconds if present
          }

          return {
            ...order,
            date: finalDate,
            time: finalTime,
            status: order.state === 1 ? "Confirmado" : order.state === 0 ? "En espera" : order.state === -1 ? "Cancelado" : order.status
          };
        });

        if (lastId === 0) {
          setOrders(processedData);
        } else {
          setOrders((prev) => {
            // Avoid duplicates just in case
            const existingIds = new Set(prev.map(o => o.id));
            const newOrders = processedData.filter((o: Order) => !existingIds.has(o.id));
            return [...prev, ...newOrders];
          });
        }
        
        if (data.length < size) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error al obtener pedidos:", errorData);
        ErrorMessage(errorData.error || errorData.message || "Error al obtener los pedidos");
      }
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      ErrorMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderProducts = useCallback((orderId: string, products: OrderProduct[]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, products } : order
      )
    );
  }, []);

  return { orders, loading, hasMore, fetchOrders, updateOrderProducts };
};
