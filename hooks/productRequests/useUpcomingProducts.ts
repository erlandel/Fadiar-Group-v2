import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { upcomingProductsUrl } from "@/urlApi/urlApi";

export const useUpcomingProducts = (count: number = 4) => {
  const { municipalityId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["upcoming-products", municipalityId, count],
    queryFn: async () => {
      const res = await fetch(`${upcomingProductsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
          municipio: municipalityId,
         
        }),
      });

      if (!res.ok) {
        throw new Error("Error al obtener los proximos productos");
      }

      const data = await res.json();
      return data.products || [];
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,
    enabled: !!municipalityId, // Solo se ejecuta si hay una provincia seleccionada
  });
};
