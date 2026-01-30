"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MaterialSymbolsAdd } from "@/icons/icons";
import CartCard from "../cartCard/cartCard";
import { useGetOrderProducts } from "@/hooks/orderRequests/useGetOrderProducts";
import LoadingDots from "../loadingDots/loadingDots";
import { Loader } from "lucide-react";
import { Order, OrderProduct } from "@/hooks/orderRequests/useGetOrders";
import { EmojioneLeftArrow } from "@/icons/icons";
import { WhatsApp } from "@/icons/icons";

interface MobileOrdesProps {
  orders: Order[];
  fetchOrdersMutation: any;
  updateOrderProducts: (orderId: string, products: OrderProduct[]) => void;
  hasMore: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function MobileOrdes({
  orders,
  fetchOrdersMutation,
  updateOrderProducts,
  hasMore,
  currentPage,
  onPageChange,
}: MobileOrdesProps) {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);
  const { fetchOrderProducts } = useGetOrderProducts();

  const fetchOrderProductsMutation = useMutation({
    mutationFn: (orderId: string) => fetchOrderProducts(orderId),
    onSuccess: (products, orderId) => {
      if (products) {
        updateOrderProducts(orderId, products);
      }
    },
  });

  const toggleOrder = async (orderId: string) => {
    const isOpening = !openOrderIds.includes(orderId);

    setOpenOrderIds((prev) =>
      isOpening ? [...prev, orderId] : prev.filter((id) => id !== orderId),
    );

    if (isOpening) {
      const order = orders.find((o) => o.id === orderId);
      if (order && (!order.products || order.products.length === 0)) {
        fetchOrderProductsMutation.mutate(orderId);
      }
    }
  };

  const startIndex = (currentPage - 1) * 10;
  const paginatedOrders = orders.slice(startIndex, startIndex + 10);

  return (
    <div className="space-y-4 mt-4 ">
      {!fetchOrdersMutation.isPending &&
        fetchOrdersMutation.status !== "idle" && (
          <>
            {paginatedOrders.map((order) => {
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
                    <div
                      className={`grid grid-cols-2 gap-y-3 items-center font-bold ${isOpen ? "text-white" : "text-[#777777]"}`}
                    >
                      {/* Pedido */}
                      <p className="text-sm sm:text-lg">Pedido</p>
                      <p
                        className={`font-bold text-right  sm:text-xl ${isOpen ? "text-white" : "text-primary"}`}
                      >
                        {order.id.toString().startsWith("#")
                          ? order.id
                          : `#${order.id}`}
                      </p>

                      {/* Fecha */}
                      <p className="text-sm sm:text-lg">Fecha</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.date}
                      </p>

                      {/* Hora */}
                      <p className="text-sm sm:text-lg">Hora</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.time}
                      </p>

                  

                      {/* Teléfono */}
                      <p className="text-sm sm:text-lg">Teléfono</p>
                      <p className=" font-bold text-right sm:text-xl">
                        {order.client_cell}
                      </p>

                      {/* Estado */}
                      <p className="text-sm sm:text-lg">Estado</p>
                      <div className="flex justify-end">
                        <span
                          className={`inline-block px-5 py-2 md:px-8 md:py-3 rounded-full text-sm font-medium ${
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

    {/* Soporte */}
                      <p className="text-sm sm:text-lg">Soporte</p>
                      <p className=" flex justify-end">
                        <WhatsApp className="h-9 w-9 cursor-pointer transition-all duration-300 ease-out hover:scale-110" />
                      </p>

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
                              price={
                                product.temporal_price &&
                                Number(product.temporal_price) !== 0
                                  ? String(product.temporal_price)
                                  : String(product.price)
                              }
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
                      ) : fetchOrderProductsMutation.isPending &&
                        fetchOrderProductsMutation.variables === order.id &&
                        isOpen ? (
                        <div className="w-full flex justify-center items-center ">
                          <Loader
                            className="h-10 w-10 animate-spin text-accent "
                            strokeWidth={3}
                          />
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

            {orders.length === 0 && (
              <div className="text-center py-10 text-[#777777] text-sm">
                No se encontraron pedidos.
              </div>
            )}
          </>
        )}

      {(fetchOrdersMutation.isPending ||
        fetchOrdersMutation.status === "idle") && (
        <div className="w-full text-center py-8">
          <LoadingDots
            text="Cargando pedidos"
            size="0.7rem"
            textSize="1.3rem"
            className="text-[#777777] font-bold"
            margin="6px"
          />
        </div>
      )}

      {!fetchOrdersMutation.isPending &&
        fetchOrdersMutation.status !== "idle" && (
          <div className="flex justify-center items-center gap-4 mt-5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || fetchOrdersMutation.isPending}
              className="disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <EmojioneLeftArrow className="h-10 w-10 text-primary cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110" />
            </button>

            <div className="text-primary font-bold text-2xl text-center">
              {currentPage}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasMore || fetchOrdersMutation.isPending}
              className="disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <EmojioneLeftArrow className="h-10 w-10 text-primary cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 rotate-180" />
            </button>
          </div>
        )}
    </div>
  );
}
