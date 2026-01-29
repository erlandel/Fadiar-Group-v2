"use client";

import { useState, useRef, useEffect } from "react";
import Amount from "@/components/amount/amount";
import CartCard from "@/components/cartCard/cartCard";
import { CheckoutStepper } from "@/components/ui/stepper";
import { ChevronDown } from "lucide-react";
import { SectionMobile } from "@/sections/sectionMobile";
import { BannerMoney } from "@/components/banner/bannerMoney";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import useCartStore from "@/store/cartStore";
import MatterCart1Store from "@/store/matterCart1Store";

export default function Cart1() {
  const items = useCartStore((state) => state.items);
  const rawCart = useCartStore((state) => (state as any).rawCart);
  const removeItem = useCartStore((state) => state.removeItem);

  const { delivery } = MatterCart1Store((state) => state.formData);

  const [isClient, setIsClient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>(
    "all"
  );
  const [openStores, setOpenStores] = useState(false);
  const storesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        storesRef.current &&
        !storesRef.current.contains(event.target as Node)
      ) {
        setOpenStores(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Items del carrito (sin filtrar por domicilio)
  const filteredByDeliveryItems = items;

  // Extraer tiendas únicas del carrito filtrado
  const stores = filteredByDeliveryItems.reduce((acc, item) => {
    const tiendaId = item.tiendaId || "unknown";
    if (!acc.find((s) => s.id === tiendaId)) {
      acc.push({
        id: tiendaId,
        name: item.tiendaName || "Tienda",
      });
    }
    return acc;
  }, [] as { id: string | number; name: string }[]);

  // Resetear la tienda seleccionada si ya no está disponible
  useEffect(() => {
    if (
      selectedStoreId !== "all" &&
      !stores.find((s) => s.id === selectedStoreId)
    ) {
      setSelectedStoreId("all");
    }
  }, [stores, selectedStoreId]);

  // Añadir la opción "Todas"
  const allStores = [{ id: "all", name: "Todas" }, ...stores];

  // Agrupar items por tienda (filtrando por la tienda seleccionada)
  const groupedItems = filteredByDeliveryItems.reduce((acc, item) => {
    const tiendaId = item.tiendaId || "unknown";

    // Si hay una tienda seleccionada y no es "all", filtramos
    if (selectedStoreId !== "all" && tiendaId !== selectedStoreId) {
      return acc;
    }

    if (!acc[tiendaId]) {
      acc[tiendaId] = {
        name: item.tiendaName || "Tienda",
        direccion: item.tiendaDireccion || "",
        items: [],
      };
    }
    acc[tiendaId].items.push(item);
    return acc;
  }, {} as Record<string | number, { name: string; direccion: string; items: typeof items }>);

  return (
    <div>
      <div className="sm:px-6 xl:px-6 2xl:px-25">
        <div className="mx-4">
          <div className="mt-10">
            <p className="text-xs text-gray-400 mb-4">
              <span className="text-gray-400">Inicio - </span>
              <span className="text-primary font-semibold">
                Carrito de Compras
              </span>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl text-primary font-bold">Carrito</h1>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-160 ml-2 lg:ml-20">
              <CheckoutStepper currentStep={0} />
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center  justify-center  xl:flex-row xl:items-start  ">
            <div className="w-full sm:w-auto">
              {/* Selector de Tiendas */}
              {isClient && items.length > 0 && (
                <div className="flex items-center   gap-2" ref={storesRef}>
                  <span className="font-bold text-primary sm:text-lg whitespace-nowrap">
                    Tienda(s)
                  </span>
                  <span className="text-primary text-xl font-bold">:</span>

                  <div className="relative">
                    <div
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-2 cursor-pointer  transition-colors min-w-[200px]"
                      onClick={() => setOpenStores(!openStores)}
                    >
                      <span className="font-bold text-accent whitespace-nowrap truncate sm:text-lg">
                        {allStores.find((t) => t.id === selectedStoreId)
                          ?.name || "Todas"}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 ml-2 text-primary transition-transform duration-200 ${
                          openStores ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {openStores && (
                      <ul className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-100 max-h-60 overflow-auto py-1 w-full min-w-[200px]">
                        {allStores.map((tienda) => (
                          <li
                            key={tienda.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm transition-colors ${
                              selectedStoreId === tienda.id
                                ? "bg-primary/5 text-primary font-bold"
                                : "text-gray-700"
                            }`}
                            onClick={() => {
                              setSelectedStoreId(tienda.id);
                              setOpenStores(false);
                            }}
                          >
                            {tienda.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* LISTA DEL CARRITO */}
              <div className="w-full  mt-5 flex flex-col  gap-y-8 lg:w-140">
                <div className="max-w-120 w-full xl:w-auto 2xl:w-full">
                  {isClient &&
                    (items.length === 0 ? (
                      <div className="flex flex-col gap-y-4 items-center justify-center">
                        <p className="text-gray-400 text-md xl:text-2xl">
                          Tu carrito está vacío.
                        </p>
                      </div>
                    ) : (
                      Object.values(groupedItems).map((group) => (
                        <div
                          key={group.name}
                          className="flex flex-col gap-y-4 mb-8"
                        >
                          <div className="border-b pb-2">
                            <h2 className=" font-bold text-primary">
                              {group.name}
                            </h2>
                            {group.direccion && (
                              <p className="text-sm text-gray-500 ">
                                <span className="text-accent font-bold">
                                  dirección:
                                </span>{" "}
                                {group.direccion}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-y-4 items-center justify-center">
                            {group.items.map((item) => (
                              <CartCard
                                key={item.productId}
                                brand={item.brand}
                                price={item.price}
                                image={item.image}
                                title={item.title}
                                quantityProducts={item.quantity}
                                width="w-full"
                                padding="p-3 sm:p-4"
                                actionIcon="delete"
                                productId={item.productId}
                                cartId={item.cartId}
                                tiendaId={item.tiendaId}
                                onDelete={removeItem}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    ))}
                </div>
              </div>
            </div>

            <div className="w-full max-w-200">
              <Amount />
            </div>
          </div>
        </div>

        <div className="sm:py-20">
          <SectionMobile />
        </div>
      </div>

      <div className="sm:hidden mt-60">
        <BannerMoney />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>
    </div>
  );
}
