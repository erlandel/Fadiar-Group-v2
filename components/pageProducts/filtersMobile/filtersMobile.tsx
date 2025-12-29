import { FilterSection } from "@/components/ui/filterModal";
import { X } from "lucide-react";

interface FiltersMobileProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  category: string[];
  setCategory: (value: string[]) => void;
  availableCategories: { value: string; label: string; key: string }[];
  priceRange: { min: number; max: number };
  price: [number, number];
  setPrice: (value: [number, number]) => void;
  brands: string[];
  setBrands: (value: string[]) => void;
  availableBrands: { value: string; label: string; key: string }[];
  relevant: string[];
  setRelevant: (value: string[]) => void;
}

const FiltersMobile = ({
  isFilterOpen,
  setIsFilterOpen,
  category,
  setCategory,
  availableCategories,
  priceRange,
  price,
  setPrice,
  brands,
  setBrands,
  availableBrands,
  relevant,
  setRelevant,
}: FiltersMobileProps) => {
  if (!isFilterOpen) return null;

  return (
    <div className="fixed inset-0 z-150 xl:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Modal content */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-[#1A2B49]">Filtros</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 pb-20">
          {/* Categorías */}
          <FilterSection
            title="Categorías"
            type="checkbox"
            selected={category}
            onChange={setCategory}
            options={availableCategories}
          />

          {/* Precio */}
          <FilterSection
            title="Precio"
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            valueMin={price[0]}
            valueMax={price[1]}
            onChange={setPrice}
          />

          {/* Marcas */}
          <FilterSection
            title="Marcas"
            type="checkbox"
            selected={brands}
            onChange={setBrands}
            options={availableBrands}
          />

          {/* Relevantes */}
          <FilterSection
            title="Relevantes"
            type="radio"
            selected={relevant}
            onChange={(value) => setRelevant(value as string[])}
            options={[
              { label: "Ofertas", value: "ofertas" },
              { label: "Más vendidos", value: "masVendidos" },
              { label: "Próximamente", value: "proximamente" },
            ]}
          />
        </div>

        {/* Footer con botones de acción */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-60">
          <button
            onClick={() => {
              setCategory([]);
              setBrands([]);
              setRelevant([]);
              setPrice([priceRange.min, priceRange.max]);
            }}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersMobile;
