import { Product } from "@/types/product";
import { useInventory } from "./useInventory";

export const useNineOffers = (count: number = 9) => {
  return useInventory<Product[]>((data) => {
    const products = data?.products || [];

    // Lógica para priorizar ofertas válidas
    const hasValidOffer = (item: Product) => {
      if (!item.temporal_price) return false;
      const regular = parseFloat(item.price);
      const temporal = parseFloat(item.temporal_price);
      return (
        !Number.isNaN(regular) &&
        !Number.isNaN(temporal) &&
        temporal > 0 &&
        temporal < regular
      );
    };

    return products
      .filter(hasValidOffer)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .slice(0, count);
  });
};
