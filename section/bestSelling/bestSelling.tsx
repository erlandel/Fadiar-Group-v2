"use client";
import { HorizontalScroll } from "@/components/horizontalScroll/horizontalScroll";
import CardLatestProducts from "@/components/ui/cardLatestProducts";
import CardSkeleton from "@/components/ui/skeletonCard";
import { server_url } from "@/lib/apiClient";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BestSellingProps = {
  products?: Product[];
};

export const BestSelling = ({ products: productsProp }: BestSellingProps) => {
  const { municipalityId } = useProductsByLocationStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const getAllProducts = async () => {
    const res = await fetch(`${server_url}/img_mas_vendido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        count: 9,
        municipio: municipalityId
      }),
    });


    if (!res.ok) {
      throw new Error("Error al obtener productos más vendidos");
    }

    const data = await res.json();

 

    // 👇 backend devuelve un ARRAY DIRECTO
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    setIsMounted(true);
    getAllProducts();
  }, [municipalityId]);

  // Usar productos del estado interno si no vienen como prop
  const productsToUse: Product[] = Array.isArray(productsProp)
    ? productsProp
    : products;

  const sortedProducts = useMemo(
    () => [...productsToUse].sort((a, b) => b.id - a.id),
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
      <div id="best-selling" className="w-full h-auto mt-20 my-30">
        <div className="flex flex-col items-start mb-5 ml-7 sm:ml-20">
          <h2 className="text-[20px] font-bold text-[#022954]">
            Lo que le gusta a la gente!!!
          </h2>
          <h1 className="text-[24px] font-bold text-accent mb-2">
            Lo más Vendido
          </h1>
        </div>

        <div className="relative px-5 xl:px-20">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
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
                      position="vertical"
                      productId={product.id}
                      tiendaId={product.tiendaId}
                    />
                  </div>
                ))
              : Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="shrink-0">
                    <CardSkeleton position={"vertical"} />
                  </div>
                ))}
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
