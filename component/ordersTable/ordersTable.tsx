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
  {
    id: "#53803",
    date: "2025-10-01",
    time: "08:39",
    idCard: "82022135776",
    phone: "56131490",
    status: "Entregado",
    products: [],
  },
  {
    id: "#25603",
    date: "2025-10-01",
    time: "08:39",
    idCard: "82022135776",
    phone: "56131490",
    status: "Entregado",
    products: [],
  },
];

export default function OrdersTable() {
  const [openOrderIds, setOpenOrderIds] = useState<string[]>([]);

  const toggleOrder = (orderId: string) => {
    setOpenOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  return (
    <>
      <div>
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-6 py-4 font-bold  text-[#777777] items-center">
          <div className="text-center">Pedido</div>
          <div className="text-center">Fecha</div>
          <div className="text-center">Hora</div>
          <div className="text-center">Carnet de identidad</div>
          <div className="text-center">Teléfono</div>
          <div className="text-center">Estado</div>
          <div className="flex justify-center"></div>
        </div>

        {/* Table Body with Accordion */}
        {mockOrders.map((order) => {
          const isOpen = openOrderIds.includes(order.id);
          return (
            <div key={order.id} className="py-2 ">
              {/* Order Row */}
              <div
                className={`grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center transition-colors ${
                  isOpen
                    ? "bg-[#022954] text-white rounded-t-xl"
                    : "bg-[#F5F7FA] rounded-2xl"
                }`}
              >
                <div
                  className={`font-bold text-xl text-center ${
                    isOpen ? "text-white" : "text-[#022954]"
                  }`}
                >
                  {order.id}
                </div>
                <div
                  className={`text-center ${
                    isOpen ? "text-white" : "text-[#777777]"
                  }`}
                >
                  {order.date}
                </div>
                <div
                  className={`text-center ${
                    isOpen ? "text-white" : "text-[#777777]"
                  }`}
                >
                  {order.time}
                </div>
                <div
                  className={`text-center ${
                    isOpen ? "text-white" : "text-[#777777]"
                  }`}
                >
                  {order.idCard}
                </div>
                <div
                  className={`text-center ${
                    isOpen ? "text-white" : "text-[#777777]"
                  }`}
                >
                  {order.phone}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === "Entregado"
                        ? "bg-[#2BD530] text-white"
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
                <div className="px-6 py-6 bg-[#F5F7FA] rounded-b-xl">
                  {order.products.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto ">
                      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
                        {order.products.map((product, idx) => (
                          <CartCard
                            key={idx}
                            brand={product.brand}
                            price={product.price.toString()}
                            image={product.image}
                            title={product.name}                      
                            padding="p-3 sm:p-4"
                            width="w-92"
                            actionIcon="none"
                            hideQuantitySelector={true}
                            bgColor="bg-[F5F7FA]"
                          />
                        ))}
                      </div>
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
    </>
  );
}
