import { useQuery } from "@tanstack/react-query";
import { server_url } from "@/lib/apiClient";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";

export const useLatestProducts = (count: number = 6) => {
  const { provinceId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["latest-products", provinceId, count],
    queryFn: async () => {
      const res = await fetch(`${server_url}/getNewerProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
          provincia: provinceId,
          emisor: "web",
        }),
      });

      if (!res.ok) {
        throw new Error("Error al obtener los productos más recientes");
      }

      const data = await res.json();
      return data.products || [];
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,
    enabled: !!provinceId, // Solo se ejecuta si hay una provincia seleccionada
  });
};
