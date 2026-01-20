"use client";
import { HorizontalScroll } from "@/components/horizontalScroll/horizontalScroll";
import CardNineOffers from "@/components/ui/cardNineOffers";
import CardSkeleton from "@/components/ui/skeletonCard";
import { useNineOffers } from "@/hooks/productRequests/useNineOffers";
import { useCallback, useEffect, useRef, useState } from "react";


export default function NineOffers() {
  const { data: offers = [], isLoading } = useNineOffers(9);
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
  }, [calculatePages, handleScroll, offers.length]);

  const renderOfferCard = (
    index: number,
    position: "horizontal" | "vertical"
  ) => {
    if (isLoading || !offers[index]) {
      return <CardSkeleton position={position} />;
    }

    const offer = offers[index];

    return (
      <CardNineOffers
        key={offer.id}
        productId={offer.id}
        category={offer.categoria?.name}
        title={offer.name}
        brand={offer.brand}
        warranty={offer.warranty}
        price={offer.price}
        image={offer.img}
        temporal_price={offer.temporal_price}
        tiendaId={offer.tiendaId}
        count={offer.count}
        position={position}
      />
    );
  };

  const cardIndexes = Array.from({ length: 9 }, (_, idx) => idx);

  return (
    <main className="mx-4 xl:mx-10 2xl:mx-20 my-20">
      <div className="flex flex-col gap-1 mb-8">
        <p className="text-[20px] font-bold text-primary">¡No pierdas la oportunidad!</p>
        <h2 className="text-[24px] font-bold text-accent">Nuestras Ofertas</h2>
      </div>

      <div className="w-full flex justify-center">
      <div className="w-full max-w-350">
      {/* Screens smaller than xl: Horizontal Scroll with vertical cards */}
      <div className="xl:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cardIndexes.map((cardIndex) => (
            <div key={`mobile-offer-${cardIndex}`} className="shrink-0">
              {renderOfferCard(cardIndex, "vertical")}
            </div>
          ))}
        </div>
        <HorizontalScroll
          totalPages={totalPages}
          activeIndex={activeIndex}
          scrollRef={scrollRef}
        />
      </div>

      {/* xl and up: mixed layout */}
      <div className="hidden gap-3 xl:grid xl:grid-cols-3">
        {/* Columna Izquierda - 1/3 */}
        <div className="flex flex-col gap-3 ">
          {renderOfferCard(0, "horizontal")}
          <div className="grid grid-cols-2 gap-3 justify-between w-full">
            {renderOfferCard(1, "vertical")}
            {renderOfferCard(2, "vertical")}
          </div>
        </div>

        {/* Columna Derecha - 2/3 */}
        <div className="flex flex-col gap-3 xl:col-span-2">
          {/* Fila Superior */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
            {renderOfferCard(3, "vertical")}

            <div className="xl:col-span-2 flex flex-col gap-3">
              {renderOfferCard(4, "horizontal")}
              {renderOfferCard(5, "horizontal")}
            </div>

            {renderOfferCard(6, "vertical")}
          </div>

          {/* Fila Inferior */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {renderOfferCard(7, "horizontal")}
            {renderOfferCard(8, "horizontal")}
          </div>
        </div>
      </div>

      </div>
      </div>




    </main>
  );
}
