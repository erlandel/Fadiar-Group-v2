"use client";
import CardSkeleton from "@/components/ui/skeletonCard";
import { Product } from "@/types/product";
import { useLatestProducts } from "@/hooks/productRequests/useLatestProducts";
import { useMemo } from "react";
import CardProduct from "@/components/ui/cardProduct";
import CardCarousel from "@/components/ui/cardCarousel";

type SectionMasRecientesProps = {
  products?: Product[];
};

export const LatestProducts = ({
  products: productsProp,
}: SectionMasRecientesProps) => {
  // Usar el hook de caché
  const { data: latestProductsData = [] } = useLatestProducts(10);

  // Usar productos del estado de caché si no vienen como prop
  const productsToUse =
    productsProp && productsProp.length > 0 ? productsProp : latestProductsData;

  const lastSixProducts = useMemo(() => [...productsToUse], [productsToUse]);

  return (
    <>
      <div
        id="latest-products"
        className="w-auto h-auto mt-20 my-30 "
      >
        <div className="flex flex-col items-start mb-5 mx-4 xl:mx-10 2xl:mx-20">
          <h2 className="text-[20px] font-bold text-[#022954]">
            Más recientes
          </h2>
          <h1 className="text-[24px] font-bold text-accent mb-2">
            Últimos productos
          </h1>
        </div>

        <div className="w-full">
          {lastSixProducts.length > 0 ? (
            <CardCarousel
              items={lastSixProducts}
              renderItem={(product) => (
                <CardProduct
                  category={product.categoria?.name}
                  title={product.name}
                  brand={product.brand}
                  warranty={product.warranty}
                  price={product.price}
                  image={product.img}
                  temporal_price={product.temporal_price}
                  position="vertical"
                  productId={product.id}
                  tiendaId={product.tiendaId}
                  count={product.count}
                />
              )}
              gap={1}
            />
          ) : (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <CardSkeleton position={"vertical"} />
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};
