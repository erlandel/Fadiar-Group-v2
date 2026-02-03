'use client';

import "@fontsource/just-me-again-down-here";
import { useUpcomingProducts } from "@/hooks/productRequests/useUpcomingProducts";
import CardCarousel from "../ui/cardCarousel";
import CardProductPreSale from "../ui/cardProductPreSale";
import SkeletonCardProductPreSale from "../ui/skeletonCardProductPreSale";

export default function BannerUpcomingProducts() {
  const { data: upcomingProducts = [], isLoading } = useUpcomingProducts();

  return (
    <section className="relative w-full h-140 sm:h-130 overflow-hidden mt-20 xl:mt-30">
      {/* ===== BACKGROUND (CAPA INFERIOR) ===== */}
      <div className="absolute inset-0 bg-primary z-0">
        <img
          src="/images/Rectangle.webp"
          alt="Background"
          className="absolute bottom-0 right-0 w-full h-5 md:h-8 xl:h-12 left-10 "
        />

        <img
          src="/images/Vector15.webp"
          alt="Background"
          className="absolute bottom-0 w-full h-8 md:h-15 xl:h-20  "
        />

        <img
          src="/images/Vector16.webp"
          alt="Background"
          className="absolute bottom-0 right-0 w-full h-10 sm:h-28 "
        />
      </div>

      {/* ===== CONTENT (CAPA SUPERIOR) ===== */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* TEXTO */}
        <h2 className="w-full text-center font-bold text-[36px] md:text-4xl 2xl:text-5xl mb-6">
          <span className="text-[#D69F04]">Próximamente</span>
          <span className="text-white"> en nuestra Tienda</span>
        </h2>

        {/* CARRUSEL */}
        <div className="w-full    overflow-hidden">
          {!isLoading && upcomingProducts.length > 0 ? (
            <CardCarousel
              items={upcomingProducts}
              speed={150}
              gap={1.5}
              renderItem={(product) => (
                <CardProductPreSale
                  category={product.categoria?.name}
                  title={product.name}
                  brand={product.brand}
                  warranty={product.warranty}
                  price={product.price}
                  image={product.img}
                  temporal_price={product.temporal_price}
                  currency={product.currency}
                  position="vertical"
                  productId={product.id}
                  tiendaId={product.tiendaId}
                  count={product.count}
                />
              )}
            />
          ) : (
            <div className="flex justify-center gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCardProductPreSale key={index} position="vertical" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
