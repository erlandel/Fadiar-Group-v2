"use client";
import Card2 from "@/component/ui/card2";
import CardSkeleton from "@/component/ui/skeletonCard";
import { server_url } from "@/lib/apiClient";
import { Product } from "@/type/product";
import { useEffect, useState } from "react";


export default function NineOffers() {
  const [offers, setOffers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4NDAsImV4cCI6MTc2Mzg3NDg0NX0.-W2-13mCQ6L7x8MQ5KQCzuhK59ZpeqAOe6Vfo7TsThk";
      const res = await fetch(`${server_url}/inventory_manager`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      const responseText = await res.text();

      if (!res.ok) {
        throw new Error(
          `Error HTTP ${res.status}: ${responseText.slice(0, 120)}`
        );
      }

      let data: { products?: Product[] } | null = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        throw new Error(
          `Respuesta no válida del servidor, se esperaba JSON. Fragmento: ${responseText
            .slice(0, 120)
            .trim()}`
        );
      }

      const hasValidOffer = (item: Product) => {
        if (!item.temporal_price) return false;
        const regular = parseFloat(item.price);
        const temporal = parseFloat(item.temporal_price);
        return !Number.isNaN(regular) && !Number.isNaN(temporal) && temporal > 0 && temporal < regular;
      };

      const prioritizedOffers = [...(data?.products ?? [])]
        .sort((a, b) => {
          const aOffer = hasValidOffer(a);
          const bOffer = hasValidOffer(b);
          if (aOffer !== bOffer) {
            return aOffer ? -1 : 1;
          }
          return (a.id ?? 0) - (b.id ?? 0);
        })
        .slice(0, 9);

      setOffers(prioritizedOffers);
    } catch (error) {
      console.error("Error al obtener las ofertas", error);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const renderOfferCard = (
    index: number,
    position: "horizontal" | "vertical"
  ) => {
    if (isLoading || !offers[index]) {
      return <CardSkeleton position={position} />;
    }

    const offer = offers[index];

    return (
      <Card2
        key={offer.id}
        productId={offer.id}
        category={offer.categoria?.name}
        title={offer.name}
        brand={offer.brand}
        warranty={offer.warranty}
        price={offer.price}
        image={offer.img}
        temporal_price={offer.temporal_price}
        position={position}
      />
    );
  };

  const cardIndexes = Array.from({ length: 9 }, (_, idx) => idx);

  return (
    <main className="mx-5 lg:mx-20 my-20">
      <div className="flex flex-col gap-1 mb-8">
        <p className="text-[20px] font-medium text-primary">¡No pierdas la oportunidad!</p>
        <h2 className="text-[24px] font-bold text-accent">Nuestras Ofertas</h2>
      </div>

      {/* sm to lg: 3 cards per row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:hidden">
        {cardIndexes.map((cardIndex) => (
          <div key={`mobile-offer-${cardIndex}`}>
            {renderOfferCard(cardIndex, "vertical")}
          </div>
        ))}
      </div>

      {/* lg to xl: 4 cards per row */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-4 xl:hidden">
        {[0, 1, 2, 3].map((cardIndex) => (
          <div key={`lg-offer-${cardIndex}`} className="flex flex-col gap-3">
            {renderOfferCard(cardIndex, "vertical")}
          </div>
        ))}
        {[4, 5, 6, 7, 8].map((cardIndex) => (
          <div key={`lg-offer-${cardIndex}`} className="flex flex-col gap-3">
            {renderOfferCard(cardIndex, "vertical")}
          </div>
        ))}
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
    </main>
  );
}