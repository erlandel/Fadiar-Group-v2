import { useQuery } from "@tanstack/react-query";
import { server_url } from "@/lib/apiClient";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";

export const useNineOffers = (count: number = 9) => {
  const { provinceId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["nine-offers", provinceId, count],
    queryFn: async () => {
      const res = await fetch(`${server_url}/img_mas_vendido`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          count,
          provincia: provinceId,
          emisor: "web"
        }),
      });

      if (!res.ok) {
        throw new Error("Error al obtener las ofertas");
      }

      const data = await res.json();
      const products = Array.isArray(data) ? data : [];

      // Lógica para priorizar ofertas válidas
      const hasValidOffer = (item: Product) => {
        if (!item.temporal_price) return false;
        const regular = parseFloat(item.price);
        const temporal = parseFloat(item.temporal_price);
        return !Number.isNaN(regular) && !Number.isNaN(temporal) && temporal > 0 && temporal < regular;
      };

      return [...products]
        .sort((a, b) => {
          const aOffer = hasValidOffer(a);
          const bOffer = hasValidOffer(b);
          if (aOffer !== bOffer) {
            return aOffer ? -1 : 1;
          }
          return (a.id ?? 0) - (b.id ?? 0);
        })
        .slice(0, count);
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,
    enabled: !!provinceId,
  });
};
