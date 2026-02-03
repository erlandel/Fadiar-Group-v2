import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { inventory_managerUrl } from "@/urlApi/urlApi";

export const useUpcomingProducts = () => {
  const { provinceId } = useProductsByLocationStore();

  return useQuery<Product[]>({
    queryKey: ["upcoming-products", provinceId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("emisor", "web");
      queryParams.append("pre_venta_only", "true");

      if (provinceId) {
        queryParams.append("provincia", provinceId.toString());
      }

      const res = await fetch(
        `${inventory_managerUrl}?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al obtener los proximos productos");
      }

      const data = await res.json();
      const realTiendas = data.tiendas?.filter((t: any) => t.active) || [];
      const processedTiendas = realTiendas.map((t: any) => ({
        ...t,
        productos: (t.productos || []).map((p: any) => ({
          ...p,
          tiendaId: t.id,
        })),
      }));
      const allProducts = processedTiendas.flatMap((t: any) => t.productos);

      return allProducts;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
