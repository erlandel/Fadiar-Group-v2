import { useQuery } from "@tanstack/react-query";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import { Product } from "@/types/product";
import { inventory_managerUrl } from "@/urlApi/urlApi";

export interface InventoryData {
  products: Product[];
  tiendas: any[];
  currencys: any;
}

export const useInventory = <T = InventoryData>(select?: (data: InventoryData) => T) => {
  const { provinceId } = useProductsByLocationStore();
  const productos=true;

  return useQuery<InventoryData, Error, T>({
    queryKey: ["inventory", provinceId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("emisor", "web");
      queryParams.append("productos", "true");
      
      if (provinceId) {
        queryParams.append("provincia", provinceId.toString());
      }

      const res = await fetch(
        `${inventory_managerUrl}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error fetching inventory");
      }

      const data = await res.json();
      console.log("respuesta inventario:", data);
      console.log("data:", data);
      
      const realTiendas = data.tiendas?.filter((t: any) => t.active) || [];
      
      // Procesar tiendas y productos para incluir el tiendaId en cada producto
      const processedTiendas = realTiendas.map((t: any) => ({
        ...t,
        productos: (t.productos || []).map((p: any) => ({
          ...p,
          id: String(p.id),
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
    select,
  });
};
