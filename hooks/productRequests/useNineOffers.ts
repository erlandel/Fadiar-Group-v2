import { Product } from "@/types/product";
import { useInventory } from "./useInventory";

export const useNineOffers = (count: number = 9) => {
  return useInventory<Product[]>((data) => {
    const products = data?.products || [];

    // Lógica para filtrar ofertas: si tiene temporal_price, está en descuento
    const hasValidOffer = (item: Product) => !!item.temporal_price;

    return products
      .filter(hasValidOffer)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .slice(0, count);
  });
};
