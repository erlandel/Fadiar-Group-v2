"use client"
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import MatterCart1Store from "@/store/matterCart1Store";
import { server_url } from "@/urlApi/urlApi";

export default function ProductListConfirmation() {
  const [isClient, setIsClient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>("all");
  const [openStores, setOpenStores] = useState(false);
  const storesRef = useRef<HTMLDivElement | null>(null);

  const { stores: formStores } = MatterCart1Store((state) => state.formData);
  const stores = formStores || [];

  const allStores = [{ id: "all", name: "Todas" }, ...stores];

  const filteredStores = stores.filter(store => 
    selectedStoreId === "all" || store.id === selectedStoreId
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

      {isClient && stores.length > 0 && (
        <div className="flex items-center  gap-2 mt-4" ref={storesRef}>
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
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="flex flex-col gap-y-4 mb-8"
            >
              <div className="border-b pb-2">
                <h2 className=" font-bold text-primary">{store.name}</h2>
                {store.direccion && (
                  <p className="text-sm text-gray-500 ">
                    <span className="text-accent font-bold">
                      dirección:
                    </span>{" "}
                    {store.direccion}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-y-4 items-center justify-center">
                {(store.products || []).map((item: any) => (
                  <div
                    key={item.productId}
                    className="bg-white w-full border border-gray-300 rounded-2xl shadow-sm h-full flex flex-row p-2"
                  >
                    <div className="w-32 h-[124px] overflow-hidden rounded-2xl shrink-0">
                      <img
                        className="w-full h-full object-contain"
                        src={`${server_url}/${item.image}`}
                        alt={item.title}
                      />
                    </div>

                    <div className="flex-1 flex flex-col ml-4 min-w-0">
                      <div className="mb-3">
                        <h3 className="text-primary font-bold text-md sm:text-xl truncate">
                          {item.title}
                        </h3>
                        <p className="text-primary text-md sm:text-xl">{item.brand}</p>
                      </div>

                      <p className="text-primary font-bold text-lg sm:text-2xl  mb-4">
                        $
                        {item.temporal_price &&
                        Number(item.temporal_price) !== 0
                          ? item.temporal_price
                          : item.price}{" "}
                        <span className="text-primary font-normal text-lg sm:text-2xl">
                          {item.currency?.currency }
                        </span>
                      </p>
                      <div className="mt-auto  flex items-center justify-between gap-2">
                        <p className="text-[#777777] text-md">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
