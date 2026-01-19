"use client";

import { useState, useEffect } from "react";
import { MaterialSymbolsAdd } from "@/icons/icons";
import CartCard from "../cartCard/cartCard";
import { useGetOrders } from "@/hooks/orderRequests/useGetOrders";
import { useGetOrderProducts } from "@/hooks/orderRequests/useGetOrderProducts";

export default function MobileOrdes() {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);
  const { orders, loading, hasMore, fetchOrders, updateOrderProducts } = useGetOrders();
  const { fetchOrderProducts, loading: loadingProducts } = useGetOrderProducts();

  useEffect(() => {
    fetchOrders(0, 10, "");
  }, [fetchOrders]);

  const loadMore = () => {
    const lastId = orders.length > 0 ? orders[orders.length - 1].id : 0;
    fetchOrders(lastId, 10, "");
  };

  const toggleOrder = async (orderId: string) => {
    const isOpening = !openOrderIds.includes(orderId);

    setOpenOrderIds((prev) =>
      isOpening
        ? [...prev, orderId]
        : prev.filter((id) => id !== orderId)
    );

    if (isOpening) {
      const order = orders.find(o => o.id === orderId);
      if (order && (!order.products || order.products.length === 0)) {
        const products = await fetchOrderProducts(orderId);
        if (products) {
          updateOrderProducts(orderId, products);
        }
      }
    }
  };

  return (
    <div className="space-y-4 mt-4 ">
      {orders.map((order) => {
        const isOpen = openOrderIds.includes(order.id);
        return (
          <div key={order.id} className="rounded-2xl overflow-hidden">
            {/* Order Card */}
            <div
              className={`p-5 relative ${
                isOpen
                  ? "bg-[#022954] text-white rounded-t-2xl"
                  : "bg-[#F5F7FA] rounded-2xl"
              }`}
            >
              {/* Toggle Button - Top Right */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => toggleOrder(order.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform ${
                    isOpen
                      ? "border-white rotate-45"
                      : "border-[#777777] bg-white"
                  }`}
                >
                  <MaterialSymbolsAdd
                    style={{ color: isOpen ? "#FFFFFF" : "#777777" }}
                    width={16}
                    height={16}
                  />
                </button>
              </div>

              {/* Order Info */}
              <div className={`grid grid-cols-2 gap-y-3 items-center font-bold ${isOpen ? "text-white" : "text-[#777777]"}`}>
                {/* Pedido */}
                <p className="text-sm sm:text-lg">Pedido</p>
                <p className={`font-bold text-right  sm:text-xl ${isOpen ? "text-white" : "text-primary"}`}>{order.id.toString().startsWith("#") ? order.id : `#${order.id}`}</p>

                {/* Fecha */}
                <p className="text-sm sm:text-lg">Fecha</p>
                <p className=" font-bold text-right sm:text-xl">{order.date}</p>

                {/* Hora */}
                <p className="text-sm sm:text-lg">Hora</p>
                <p className=" font-bold text-right sm:text-xl">{order.time}</p>

                {/* Carnet de identidad */}
                <p className="text-sm sm:text-lg">Carnet de identidad</p>
                <p className=" font-bold text-right sm:text-xl">{order.client_ci}</p>

                {/* Teléfono */}
                <p className="text-sm sm:text-lg">Teléfono</p>
                <p className=" font-bold text-right sm:text-xl">{order.client_cell}</p>

                {/* Estado */}
                <p className="text-sm sm:text-lg">Estado</p>
                <div className="flex justify-end">
                  <span
                    className={`inline-block px-5 py-2 md:px-8 md:py-3 rounded-full text-sm ${
                      order.status === "Confirmado"
                        ? "bg-[#2BD530] text-white"
                        : order.status === "En espera"
                        ? "bg-[#FFB020] text-white"
                        : "bg-[#D52B2E] text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-4 pr-0 py-6 bg-[#F5F7FA] rounded-b-2xl">
                {order.products && order.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                    {order.products.map((product, idx) => (
                      <CartCard
                        key={idx}
                        brand={product.brand}
                        price={product.price.toString()}
                        image={product.img}
                        title={product.name}
                        padding="p-3 sm:p-4"
                        width="w-full"
                        actionIcon="none"
                        quantityProducts={product.count}
                        hideQuantitySelector={true}
                        bgColor="bg-[#F5F7FA]"
                      />
                    ))}
                  </div>
                ) : loadingProducts && isOpen ? (
                  <div className="text-center py-4 text-[#777777] text-sm pr-4">
                    Cargando productos...
                  </div>
                ) : (
                  <p className="text-[#777777] text-center py-4 text-sm pr-4">
                    No hay productos para mostrar
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="text-center py-4 text-[#777777] text-sm">Cargando pedidos...</div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-10 text-[#777777] text-sm">
          No se encontraron pedidos.
        </div>
      )}

      {!loading && hasMore && orders.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-[#022954] text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-sm"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}
