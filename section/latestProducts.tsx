"use client";
import { HorizontalScroll } from "@/components/horizontalScroll/horizontalScroll";
import CardLatestProducts from "@/components/ui/cardLatestProducts";
import CardSkeleton from "@/components/ui/skeletonCard";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { useLatestProducts } from "@/hooks/productRequests/useLatestProducts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SectionMasRecientesProps = {
  products?: Product[];
};

export const LatestProducts = ({
  products: productsProp,
}: SectionMasRecientesProps) => {
  const { municipalityId } = useProductsByLocationStore();
  
  // Usar el hook de caché
  const { data: latestProductsData = [], isLoading } = useLatestProducts(6);

  // Usar productos del estado de caché si no vienen como prop
  const productsToUse =
    productsProp && productsProp.length > 0 ? productsProp : latestProductsData;

  const lastSixProducts = useMemo(
    () => [...productsToUse],
    [productsToUse]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const calculatePages = useCallback(() => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollWidth = scrollRef.current.scrollWidth;
    const pages = Math.max(1, Math.ceil(scrollWidth / containerWidth));
    setTotalPages(pages);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.clientWidth;
    const scrollWidth = scrollRef.current.scrollWidth;
    const maxScroll = Math.max(scrollWidth - containerWidth, 1);
    const scrollPercentage = scrollLeft / maxScroll;
    const index = Math.min(
      Math.floor(scrollPercentage * totalPages),
      totalPages - 1
    );

    setActiveIndex(Math.max(0, index));
  }, [totalPages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleResize = () => calculatePages();

    calculatePages();
    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculatePages, handleScroll, productsToUse.length]);

  return (
    <>
      <div id="latest-products" className="w-auto h-auto mt-20 my-30 mx-4 xl:mx-10 2xl:mx-20">
        <div className="flex flex-col items-start mb-5  ">
          <h2 className="text-[20px] font-bold text-[#022954]">
            Más recientes
          </h2>
          <h1 className="text-[24px] font-bold text-accent mb-2">
            Últimos productos
          </h1>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {lastSixProducts.length > 0 ? (
              lastSixProducts.map((product) => (
                <div key={product.id} className="shrink-0">
                  <CardLatestProducts
                    category={product.categoria?.name}
                    title={product.name}
                    brand={product.brand}
                    warranty={product.warranty}
                    price={product.price}
                    image={product.img}
                    position="vertical"
                    productId={product.id}
                    tiendaId={product.tiendaId}
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="shrink-0">
                  <CardSkeleton position={"vertical"} />
                </div>
              ))
            )}
          </div>
          <div>
          <HorizontalScroll
            totalPages={totalPages}
            activeIndex={activeIndex}
            scrollRef={scrollRef}
          />
          </div>

        </div>
      </div>
    </>
  );
};
