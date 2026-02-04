import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { latest_productsUrl } from "@/urlApi/urlApi";

export const useLatestProducts = (count: number = 6) => {
  const { municipalityId } = useProductsByLocationStore();
  const emisor = 'web';

  return useQuery<Product[]>({
    queryKey: ["latest-products", municipalityId, count],
    queryFn: async () => {
      const res = await fetch(`${latest_productsUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count,
          municipio: municipalityId,
          emisor,        
        }),
      });


     

      if (!res.ok) {
        throw new Error("Error al obtener los productos más recientes");
      }

      const data = await res.json();
       console.log('respueta de last product: ',data.products);
      return data.products || [];
    },
    staleTime: Infinity, // Solo cambia si cambia la provincia o se invalida manualmente
    refetchOnWindowFocus: false,
    enabled: !!municipalityId, // Solo se ejecuta si hay una provincia seleccionada
  });
};
