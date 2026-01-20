"use client";
import { HorizontalScroll } from "@/components/horizontalScroll/horizontalScroll";
import CardLatestProducts from "@/components/ui/cardLatestProducts";
import CardSkeleton from "@/components/ui/skeletonCard";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { useBestSelling } from "@/hooks/productRequests/useBestSelling";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BestSellingProps = {
  products?: Product[];
};

export const BestSelling = ({ products: productsProp }: BestSellingProps) => {
  const { provinceId } = useProductsByLocationStore();

  // Usar el hook de caché
  const { data: bestSellingProducts = [], isLoading } = useBestSelling(9);

  // Usar productos del estado de caché si no vienen como prop
  const productsToUse: Product[] = Array.isArray(productsProp)
    ? productsProp
    : bestSellingProducts;

  const sortedProducts = useMemo(
    () => [...productsToUse].sort((a, b) => b.id - a.id),
    [productsToUse],
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
      totalPages - 1,
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
      <div
        id="best-selling"
        className="w-auto h-auto mt-20 my-30 mx-4 xl:mx-10 2xl:mx-20"
      >
        <div className="flex flex-col items-start mb-5  ">
          <h2 className="text-[20px] font-bold text-[#022954]">
            Lo que le gusta a la gente!!!
          </h2>
          <h1 className="text-[24px] font-bold text-accent mb-2">
            Lo más Vendido
          </h1>
        </div>

        <div className="w-full">
          <div className="relative ">
            <div
              ref={scrollRef}
              className="flex overflow-x-scroll scroll-smooth scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-4 w-fit mx-auto">
                {sortedProducts.length > 0
                  ? sortedProducts.map((product) => (
                      <div key={product.id} className="shrink-0">
                        <CardLatestProducts
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
                      </div>
                    ))
                  : Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="shrink-0">
                        <CardSkeleton position={"vertical"} />
                      </div>
                    ))}
              </div>
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
      </div>
    </>
  );
};
