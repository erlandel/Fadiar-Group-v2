
"use client";

import { useState } from "react";
import { MaterialSymbolsAdd } from "@/icons/icons";
import CartCard from "../cartCard/cartCard";

interface Order {
  id: string;
  date: string;
  time: string;
  idCard: string;
  phone: string;
  status: "Entregado" | "Cancelado";
  products: Array<{
    name: string;
    brand: string;
    price: number;
    image: string;
  }>;
}

const mockOrders: Order[] = [
  {
    id: "#83803",
    date: "2025-10-01",
    time: "08:39",
    idCard: "82022135776",
    phone: "56131490",
    status: "Entregado",
    products: [
      {
        name: "Nevera 5.5 Pies",
        brand: "Marca Eko",
        price: 365,
        image: "/images/004.svg",
      },
      {
        name: "Freidora de Aire 5.5 L",
        brand: "Marca Eko",
        price: 63,
        image: "/images/004.svg",
      },
    ],
  },
  {
    id: "#53833",
    date: "2025-10-01",
    time: "08:39",
    idCard: "82022135776",
    phone: "56131490",
    status: "Entregado",
    products: [],
  },
  {
    id: "#63803",
    date: "2025-10-01",
    time: "08:39",
    idCard: "82022135776",
    phone: "56131490",
    status: "Cancelado",
    products: [],
  },
];

export default function MobileOrdes() {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);

  const toggleOrder = (orderId: string) => {
    setOpenOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <div className="space-y-4 mt-4">
      {mockOrders.map((order) => {
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
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              {/* Header with Pedido and ID in same line */}
              <div className="flex justify-between items-center mb-4">
                <p
                  className={`text-sm font-bold ${
                    isOpen ? "text-white" : "text-[#777777]"
                  }`}
                >
                  Pedido
                </p>
                <p
                  className={` font-bold ${
                    isOpen ? "text-white" : "text-[#022954]"
                  }`}
                >
                  {order.id}
                </p>
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    Fecha
                  </span>
                  <span
                    className={`text-sm ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    {order.date}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    Hora
                  </span>
                  <span
                    className={`text-sm ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    {order.time}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    Carnet de identidad
                  </span>
                  <span
                    className={`text-sm ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    {order.idCard}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    className={`text-sm font-bold ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    Teléfono
                  </span>
                  <span
                    className={`text-sm ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    {order.phone}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span
                    className={`text-sm font-bold ${
                      isOpen ? "text-white" : "text-[#777777]"
                    }`}
                  >
                    Estado
                  </span>
                  <span
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      order.status === "Entregado"
                        ? "bg-[#2BD530] text-white"
                        : "bg-[#D52B2E] text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Accordion Content - Products */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 bg-[#F5F7FA] rounded-b-2xl">
                {order.products.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {order.products.map((product, idx) => (
                      <CartCard
                        key={idx}
                        brand={product.brand}
                        price={product.price.toString()}
                        image={product.image}
                        title={product.name}
                        padding="p-4"
                        width="w-full"
                        actionIcon="none"
                        hideQuantitySelector={true}
                        bgColor="bg-[#F5F7FA]"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[#777777] text-center py-4">
                    No hay productos para mostrar
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}