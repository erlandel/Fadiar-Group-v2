import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import { refreshToken } from "@/utils/refreshToken";
import { get_ordersUrl } from "@/urlApi/urlApi";
import ErrorMessage from "@/messages/errorMessage";

import { Order, OrderProduct } from "../../types/order";

export const useGetOrders = (lastId: string = "", size: number = 10, searchText: string = "") => {
  const queryClient = useQueryClient();

  const fetchOrdersFn = async () => {
    const requestSize = size + 11;
    const { auth, setAuth } = useAuthStore.getState();

    if (!auth?.access_token) {
      return { orders: [], hasMore: false };
    }

    const token = await refreshToken(auth, setAuth);

    if (!token) {
      ErrorMessage("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      return { orders: [], hasMore: false };
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

    if (response.ok) {
      const data = await response.json();
      console.log("Datos del pedido recibidos:", data);

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
          finalTime = parts[1].split(".")[0];
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
          client_cell: finalCell,
        };
      });

      const hasMore = data.length > size + 10;
      return { orders: processedData, hasMore };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error al obtener pedidos:", errorData);
      ErrorMessage(
        errorData.error || errorData.message || "Error al obtener los pedidos"
      );
      return { orders: [], hasMore: false };
    }
  };

  const queryKey = ["orders", lastId, size, searchText];

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: fetchOrdersFn,
    staleTime: Infinity, // Solo se actualiza si se invalida manualmente
    gcTime: 1000 * 60 * 30, // Mantener en caché por 30 minutos
  });

  const orders = data?.orders || [];
  const hasMore = data?.hasMore || false;

  const updateOrderProducts = useCallback(
    (orderId: string, products: OrderProduct[]) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((order: Order) =>
            order.id === orderId ? { ...order, products } : order
          ),
        };
      });
    },
    [queryClient, queryKey]
  );

  const updateOrderNote = useCallback(
    (orderId: string, nota: Order["nota"]) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          orders: old.orders.map((order: Order) =>
            order.id === orderId ? { ...order, nota } : order
          ),
        };
      });
    },
    [queryClient, queryKey]
  );

  return {
    orders,
    loading: isLoading,
    hasMore,
    fetchOrders: refetch,
    updateOrderProducts,
    updateOrderNote,
  };
};
