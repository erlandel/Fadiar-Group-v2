"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface StoreSelectorProps {
  tiendas: any[];
  selectedStoreId: string | null;
  setSelectedStoreId: (id: string | null) => void;
}

const StoreSelector = forwardRef<HTMLDivElement, StoreSelectorProps>(
  ({ tiendas, selectedStoreId, setSelectedStoreId }, ref) => {
    const [openStores, setOpenStores] = useState(false);
    const storesRef = useRef<HTMLDivElement>(null);

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (tiendas.length === 0) return null;

    return (
      <div className="flex items-center justify-center w-full" ref={ref}>
        <div className="flex flex-wrap items-center gap-y-3 mt-4 pb-4 w-full">
          {/* Vista Móvil (Selector Desplegable) */}
          <div className="flex items-center justify-start gap-2 w-full md:hidden mx-4">
            <div className="relative" ref={storesRef}>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-between bg-gray-50 rounded-sm p-2 cursor-pointer hover:border-primary transition-colors "
                  onClick={() => setOpenStores(!openStores)}
                >
                  <span className=" font-bold text-primary sm:text-lg">
                    Tiendas
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 ml-1 text-primary transition-transform duration-200 ${
                      openStores ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <span className="text-primary  text-xl font-bold">:</span>
                <span className=" font-bold text-accent whitespace-nowrap truncate sm:text-lg">
                  {tiendas.find((t) => t.id === selectedStoreId)?.name ||
                    "Seleccione tienda"}
                </span>
              </div>

              {openStores && (
                <ul className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-100 max-h-60 overflow-auto py-1 w-full">
                  {tiendas.map((tienda: any) => (
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

          {/* Vista Desktop (Botones) */}
          <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 mx-4 xl:mx-0">
            {tiendas.map((tienda: any) => (
              <button
                key={tienda.id}
                onClick={() => setSelectedStoreId(tienda.id)}
                className={`text-sm md:text-base whitespace-nowrap cursor-pointer ${
                  selectedStoreId === tienda.id
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-gray-400 hover:text-primary transition-opacity duration-200 ease-out "
                }`}
              >
                {tienda.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default StoreSelector;
