import { useQuery } from "@tanstack/react-query";
import { server_url } from "@/lib/apiClient";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";

interface InventoryData {
  products: Product[];
  tiendas: any[];
  currencys: any;
}

export const useInventory = () => {
  const { provinceId } = useProductsByLocationStore();

  return useQuery<InventoryData>({
    queryKey: ["inventory", provinceId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("emisor", "web");
      
      if (provinceId) {
        queryParams.append("provincia", provinceId.toString());
      }

      const res = await fetch(
        `${server_url}/inventory_manager?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error fetching inventory");
      }

      const data = await res.json();
      
      const realTiendas = data.tiendas?.filter((t: any) => t.active) || [];
      
      // Procesar tiendas y productos para incluir el tiendaId en cada producto
      const processedTiendas = realTiendas.map((t: any) => ({
        ...t,
        productos: (t.productos || []).map((p: any) => ({
          ...p,
          tiendaId: t.id
        }))
      }));

      const allProducts = processedTiendas.flatMap((t: any) => t.productos);

      return {
        products: allProducts,
        tiendas: processedTiendas,
        currencys: data.currencys || null,
      };
    },
    // Mantener los datos en caché indefinidamente (se actualiza por provincia o manual)
    staleTime: Infinity,
    // Refrescar cuando la ventana recupera el foco (opcional, pero recomendado)
    refetchOnWindowFocus: false,
  });
};
