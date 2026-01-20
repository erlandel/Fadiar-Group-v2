"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MaterialSymbolsAdd } from "@/icons/icons";
import CartCard from "../cartCard/cartCard";
import LoadingDots from "@/components/loadingDots/loadingDots";
import { useGetOrders } from "@/hooks/orderRequests/useGetOrders";
import { useGetOrderProducts } from "@/hooks/orderRequests/useGetOrderProducts";
import { Loader } from "lucide-react";

export default function OrdersTable() {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);
  const { orders, hasMore, fetchOrders, updateOrderProducts } = useGetOrders();
  const { fetchOrderProducts } = useGetOrderProducts();

  const fetchOrdersMutation = useMutation({
    mutationFn: (params: { lastId: string | number; size: number; searchText: string }) => 
      fetchOrders(params.lastId, params.size, params.searchText),
  });

  const fetchOrderProductsMutation = useMutation({
    mutationFn: (orderId: string) => fetchOrderProducts(orderId),
    onSuccess: (products, orderId) => {
      if (products) {
        updateOrderProducts(orderId, products);
      }
    },
  });

  useEffect(() => {
    fetchOrdersMutation.mutate({ lastId: 0, size: 10, searchText: "" });
  }, []);

  const loadMore = () => {
    const lastId = orders.length > 0 ? orders[orders.length - 1].id : 0;
    fetchOrdersMutation.mutate({ lastId, size: 10, searchText: "" });
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
        fetchOrderProductsMutation.mutate(orderId);
      }
    }
  };

  return (
    <>
      <div>
       
        {/* Table Header */}
        {orders.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-6 py-4 font-bold  text-[#777777] items-center">
            <div className="text-center">Pedido</div>
            <div className="text-center">Fecha</div>
            <div className="text-center">Hora</div>
            <div className="text-center">Carnet de identidad</div>
            <div className="text-center">Teléfono</div>
            <div className="text-center">Estado</div>
            <div className="flex justify-center"></div>
          </div>
        )}

        {/* Table Body with Accordion */}
        {orders.map((order) => {
          const isOpen = openOrderIds.includes(order.id);
          return (
            <div key={order.id} className="py-2 ">
              {/* Order Row */}
              <div
                className={`grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center transition-colors ${
                  isOpen
                    ? "bg-[#022954] text-white rounded-t-xl"
                    : "bg-[#F5F7FA] text-[#777777] rounded-2xl"
                }`}
              >
                <div
                  className={`font-bold text-xl text-center ${
                    !isOpen && "text-[#022954]"
                  }`}
                >
                  {order.id.toString().startsWith("#") ? order.id : `#${order.id}`}
                </div>
                <div className="text-center">
                  {order.date}
                </div>
                <div className="text-center">
                  {order.time}
                </div>
                <div className="text-center">
                  {order.client_ci}
                </div>
                <div className="text-center">
                  {order.client_cell}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-5 py-2 rounded-full text-md font-medium ${
                      order.status === "Confirmado"
                        ? "bg-[#2BD530] text-white"
                        : order.status === "En espera"
                        ? "bg-yellow-500 text-white"
                        : "bg-[#D52B2E] text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-center ">
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer ${
                      isOpen ? "border-white rotate-45" : "border-[#777777] "
                    }`}
                  >
                    <MaterialSymbolsAdd
                      style={{ color: isOpen ? "#FFFFFF" : "#777777" }}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-6 pr-0 py-6 bg-[#F5F7FA] rounded-b-xl">
                  {order.products && order.products.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-6">
                      <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
                        {order.products.map((product, idx) => (
                          <CartCard
                            key={idx}
                            brand={product.brand}
                            price={(product.temporal_price && Number(product.temporal_price) !== 0) 
                              ? String(product.temporal_price) 
                              : String(product.price)}
                            image={product.img}
                            title={product.name}                      
                            padding="p-3 sm:p-4"
                            width="w-92"
                            actionIcon="none"
                            quantityProducts={product.count}
                            hideQuantitySelector={true}
                            bgColor="bg-[#F5F7FA]"
                          />
                        ))}
                      </div>
                      
                    </div>
                  ) : fetchOrderProductsMutation.isPending && fetchOrderProductsMutation.variables === order.id && isOpen ? (
                    <div className="w-full flex justify-center items-center ">               
                       <Loader className="h-10 w-10 animate-spin text-accent "strokeWidth={3} />
                    </div>
                  ) : (
                    <p className="text-[#777777] text-center py-4 pr-6">
                      No hay productos para mostrar
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {(fetchOrdersMutation.isPending || fetchOrdersMutation.status === "idle") && (
          <div className="w-full text-center py-8">
            <LoadingDots 
              text="Cargando pedidos"
              size="1.5rem"
              textSize="2rem"
              className="text-[#777777] font-bold"
              margin="6px"
            />
          </div>
        )}

        {fetchOrdersMutation.isSuccess && orders.length === 0 && (
          <div className="text-center py-10 text-[#777777]">
            No se encontraron pedidos.
          </div>
        )}

        {!fetchOrdersMutation.isPending && hasMore && orders.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-[#022954] text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-colors"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>
    </>
  );
}
