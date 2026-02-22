import { useState, useCallback } from "react";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { get_ordersUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";

import { Order, OrderProduct } from "../../types/order";

export const useGetOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (lastId: string = "", size: number = 10, searchText: string = "") => {
    if (loading) return;

    const requestSize = size + 11;

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

      const requestBody = {
        last_id: lastId,
        size: requestSize,
        search_text: searchText,
      };

      console.log("requestBody en fetchOrders: ", requestBody);

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
        console.log("Datos del pedido recibidos:", data);
       
        
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

          const rawStatus = order.state !== undefined ? order.state : order.status;
          let finalStatus = order.status;

          if (rawStatus === 1 || rawStatus === "1") {
            finalStatus = "Confirmado";
          } else if (rawStatus === 0 || rawStatus === "0") {
            finalStatus = "En espera";
          } else if (rawStatus === -1 || rawStatus === "-1") {
            finalStatus = "Cancelado";
          }

          // Mostrar el cellphone2 en vez del cellphone1 si la dirrecion no esta vacia
          // Pero usar client_cell si tiene un +
          let finalCell = order.client_cell;
          const hasDirection = order.direccion && order.direccion.trim() !== "";
          const cell2 = order.client_cell2 || order.cellphone2;
          const hasPlus = order.client_cell && order.client_cell.includes("+");

          if (hasDirection && cell2 && !hasPlus) {
            finalCell = cell2;
          }

          return {
            ...order,
            date: finalDate,
            time: finalTime,
            status: finalStatus,
            client_cell: finalCell
          };
        });

        if (lastId === '') {
          setOrders(processedData);
        } else {
          setOrders((prev) => {
            // Avoid duplicates just in case
            const existingIds = new Set(prev.map(o => o.id));
            const newOrders = processedData.filter((o: Order) => !existingIds.has(o.id));
            return [...prev, ...newOrders];
          });
        }
        
        if (data.length <= size + 10) {
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

  const updateOrderNote = useCallback((orderId: string, nota: Order["nota"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, nota } : order
      )
    );
  }, []);

  return { orders, loading, hasMore, fetchOrders, updateOrderProducts, updateOrderNote };
};
