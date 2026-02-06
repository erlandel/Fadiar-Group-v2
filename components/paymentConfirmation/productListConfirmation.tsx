"use client"
import { useEffect, useState } from "react";
import MatterCart1Store from "@/store/matterCart1Store";
import CartCard from "@/components/cartCard/cartCard";
import StoreSelector from "@/components/storeSelector/storeSelector";
import ListByStore from "@/components/listByStore/listByStore";

export default function ProductListConfirmation() {
  const [isClient, setIsClient] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>("all");

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
        <div className="mt-4">
          <StoreSelector
            stores={allStores}
            selectedId={selectedStoreId}
            onChange={setSelectedStoreId}
            label="Tienda(s)"
          />
        </div>
      )}

      <div className="mt-4  flex flex-col justify-center items-center lg:flex-row lg:items-start  ">
        <div className="w-full max-w-120">
          <ListByStore
            groups={filteredStores.map((store) => ({
              id: store.id,
              name: store.name,
              direccion: store.direccion,
              items: (store.products || []) as any[],
            }))}
            renderItem={(item: any) => (
              <CartCard
                key={item.productId}
                title={item.title}
                brand={item.brand}
                price={String(item.price)}
                temporal_price={
                  item.temporal_price !== undefined && item.temporal_price !== null
                    ? String(item.temporal_price)
                    : undefined
                }
                image={item.image}
                actionIcon="none"
                quantityProducts={item.quantity}
                currency={item.currency ?? { currency: "" }}
                bgColor="bg-white"
                width="w-full"
                padding="p-2"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
