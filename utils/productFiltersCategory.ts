import type { Product } from "@/types/product";

export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const buildAvailableCategories = (products: Product[]) => {
  const categoryMap = new Map<string, string>();

  products.forEach((product) => {
    const categoryName =
      (typeof product.categoria === "object" && product.categoria?.name) ||
      (typeof (product as any).category === "object" && (product as any).category?.name) ||
      (typeof product.categoria === "string" ? product.categoria : null) ||
      (typeof (product as any).category === "string" ? (product as any).category : null);

    if (categoryName) {
      const normalized = normalizeText(categoryName);
      if (!categoryMap.has(normalized)) {
        categoryMap.set(normalized, categoryName.trim());
      }
    }
  });

  return Array.from(categoryMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([normalized, original]) => ({
      value: normalized,
      label: original,
      key: normalized,
    }));
};
