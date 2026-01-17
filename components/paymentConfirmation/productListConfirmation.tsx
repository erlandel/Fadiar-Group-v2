"use client"
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import cartStore, { CartItem } from "@/store/cartStore";
import CartCard from "../cartCard/cartCard";

export default function ProductListConfirmation() {
  const [isClient, setIsClient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>("all");
  const [openStores, setOpenStores] = useState(false);
  const storesRef = useRef<HTMLDivElement | null>(null);

  const cartItems = cartStore((state) => state.items);

  const stores = cartItems.reduce((acc, item) => {
    const tiendaId = item.tiendaId || "unknown";
    if (!acc.find((s) => s.id === tiendaId)) {
      acc.push({
        id: tiendaId,
        name: item.tiendaName || "Tienda",
      });
    }
    return acc;
  }, [] as { id: string | number; name: string }[]);

  const allStores = [{ id: "all", name: "Todas" }, ...stores];

  const groupedItems = cartItems.reduce(
    (
      acc: Record<
        string | number,
        { name: string; direccion: string; items: CartItem[] }
      >,
      item
    ) => {
      const tiendaId = item.tiendaId || "unknown";

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
    },
    {}
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  useEffect(() => {
    if (
      selectedStoreId !== "all" &&
      !stores.find((s) => s.id === selectedStoreId)
    ) {
      setSelectedStoreId("all");
    }
  }, [stores, selectedStoreId]);

  return (
    <div>
      <h5 className="text-primary font-bold text-xl ml-4 pb-1">
        PRODUCTOS
      </h5>
      <div className="w-full  border-b-2 border-gray"></div>

      {isClient && cartItems.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4" ref={storesRef}>
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
                {allStores.find((t) => t.id === selectedStoreId)?.name ||
                  "Todas"}
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

      <div className="mt-4  flex flex-col justify-center items-center lg:flex-row lg:items-start  ">
        <div className="w-full max-w-120">
          {Object.values(groupedItems).map((group) => (
            <div
              key={group.name}
              className="flex flex-col gap-y-4 mb-8"
            >
              <div className="border-b pb-2">
                <h2 className=" font-bold text-primary">{group.name}</h2>
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
                    actionIcon="none"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

