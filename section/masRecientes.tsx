"use client";
import Card from "@/component/ui/card";
import { server_url } from "@/lib/apiClient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Product {
  id: number;
  categoria?: {
    id: number;
    name: string;
  };
  name: string;
  brand: string;
  warranty: string;
  price: string;
  img: string;
  temporal_price?: string;
}

type SectionMasRecientesProps = {
  products?: Product[];
};

export const SectionMasRecientes = ({
  products: productsProp,
}: SectionMasRecientesProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const getAllProducts = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4NDAsImV4cCI6MTc2Mzg3NDg0NX0.-W2-13mCQ6L7x8MQ5KQCzuhK59ZpeqAOe6Vfo7TsThk'; // tu token guardado
    const res = await fetch(`${server_url}/inventory_manager`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    setIsMounted(true);
    getAllProducts();
  }, []);

  // Usar productos del estado interno si no vienen como prop
  const productsToUse = productsProp && productsProp.length > 0 ? productsProp : products;

  const lastSixProducts = useMemo(
    () =>
      [...productsToUse]
        .sort((a, b) => b.id - a.id)
        .slice(0, 6),
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
        <div id="Mas recientes" className="w-full h-auto mt-20 my-30">
              <div className="flex flex-col items-start mb-5 ml-7 sm:ml-20">
              <h2 className="text-[20px] font-bold text-[#022954]">Más recientes</h2>
              <h1 className="text-[24px] font-bold text-accent mb-2">Últimos productos</h1>
              </div>

                <div className="relative px-5 xl:px-20">
                  <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {lastSixProducts.length > 0 ? lastSixProducts.map((product) => (
                      <div key={product.id} className="shrink-0">
                        <Card
                          category={product.categoria?.name}
                          title={product.name}
                          brand={product.brand}
                          warranty={product.warranty}
                          price={product.price}
                          image={product.img}
                          position="vertical"
                          productId={product.id}                   
                        />
                      </div>
                    )) : (
                      <p className="text-sm text-gray-500 px-2">
                        Cargando productos...
                      </p>
                    )}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeIndex ? 'bg-accent' : 'bg-gray-300'
                          }`}
                          onClick={() => {
                            if (scrollRef.current) {
                              const containerWidth = scrollRef.current.clientWidth;
                              scrollRef.current.scrollTo({ left: index * containerWidth, behavior: 'smooth' });
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
            </div>
        </>
    );
};