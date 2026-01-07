import { useQuery } from "@tanstack/react-query";
import { server_url } from "@/lib/apiClient";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";

export const useBestSelling = (count: number = 9) => {
  const { municipalityId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["best-selling", municipalityId, count],
    queryFn: async () => {
      const res = await fetch(`${server_url}/img_mas_vendido`, {
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
        throw new Error("Error al obtener productos más vendidos");
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,
    enabled: !!municipalityId, // Solo se ejecuta si hay una provincia seleccionada
  });
};
