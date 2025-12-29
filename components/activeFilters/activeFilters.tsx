"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface ActiveFiltersProps {
  category: string[];
  brands: string[];
  relevant: string[];
  price: [number, number];
  priceRange: { min: number; max: number };
  availableCategories: { value: string; label: string }[];
  availableBrands: { value: string; label: string }[];
  removeFilter: (type: "category" | "brand" | "relevant", value: string) => void;
  resetPrice: () => void;
  totalProducts: number;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  category,
  brands,
  relevant,
  price,
  priceRange,
  availableCategories,
  availableBrands,
  removeFilter,
  resetPrice,
  totalProducts,
}) => {
  const hasActiveFilters =
    category.length > 0 ||
    brands.length > 0 ||
    relevant.length > 0 ||
    price[0] !== priceRange.min ||
    price[1] !== priceRange.max;

  return (
    <div className="flex flex-col gap-2 mb-2 mt-2 font-bold text-sm">
      {/* Filtros aplicados */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 ">
          {category.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg  "
            >
              <div className="w-4 h-4 border-2 border-[#0b2a4a] flex items-center justify-center">
                <Check className="w-4 h-4 font-bold text-[#0b2a4a]"   strokeWidth={4}/>
              </div>
              <span className="ml-1">
                {availableCategories.find((c) => c.value === cat.toLowerCase())
                  ?.label || cat}
              </span>
              <button
                onClick={() => removeFilter("category", cat)}
                className="ml-4 text-gray-400  cursor-pointer"
              >
                <X className="w-4 h-4"   strokeWidth={4} />
              </button>
            </div>
          ))}

          {brands.map((brand) => (
            <div
              key={brand}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg  "
            >
              <div className="w-4 h-4 border-2 border-[#0b2a4a] flex items-center justify-center">
                <Check className="w-4 h-4 font-bold text-[#0b2a4a]" strokeWidth={4} />
              </div>
              <span className="ml-1">
                {availableBrands.find((b) => b.value === brand.toLowerCase())
                  ?.label || brand.charAt(0).toUpperCase() + brand.slice(1)}
              </span>
              <button
                onClick={() => removeFilter("brand", brand)}
                className="ml-4 text-gray-400  cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={4} />
              </button>
            </div>
          ))}

          {relevant.map((rel) => (
            <div
              key={rel}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg  "
            >
              <div className="w-4 h-4 border-2 border-[#0b2a4a] flex items-center justify-center">
                <Check className="w-4 h-4 font-bold text-[#0b2a4a]" strokeWidth={4} />
              </div>
              <span className="ml-1">
                {rel === "ofertas"
                  ? "Ofertas"
                  : rel === "masVendidos"
                  ? "Más vendidos"
                  : "Próximamente"}
              </span>
              <button
                onClick={() => removeFilter("relevant", rel)}
                className="ml-4 text-gray-400  cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={4} />
              </button>
            </div>
          ))}

          {(price[0] !== priceRange.min || price[1] !== priceRange.max) && (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg  ">
              <div className="w-4 h-4 border-2 border-[#0b2a4a] flex items-center justify-center">
                <Check className="w-4 h-4 font-bold text-[#0b2a4a]" strokeWidth={4} />
              </div>
              <span className="ml-1">
                ${price[0].toLocaleString()} - ${price[1].toLocaleString()}
              </span>
              <button
                onClick={resetPrice}
                className="ml-4 text-gray-400  cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={4} />
              </button>
            </div>
          )}
        </div>
      )}

      <span className=" text-[#777777] font-normal">{totalProducts} Productos</span>
    </div>
  );
};

export default ActiveFilters;
