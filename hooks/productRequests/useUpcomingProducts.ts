import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { upcomingProductsUrl } from "@/urlApi/urlApi";

interface UpcomingProductsResponse {
  products?: Product[];
  currencys?: any;
}

export const useUpcomingProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["upcoming-products"],
    queryFn: async () => {
      const res = await fetch(`${upcomingProductsUrl}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los proximos productos");
      }

      const data: UpcomingProductsResponse = await res.json();
      return data.products || [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
