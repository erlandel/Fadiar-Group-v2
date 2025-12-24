import { FilterSection } from "@/component/ui/filterModal";

interface FiltersDesktopProps {
  category: string[];
  setCategory: (value: string[]) => void;
  availableCategories: { value: string; label: string; key: string }[];
  priceRange: { min: number; max: number };
  tempPrice: [number, number];
  setTempPrice: (value: [number, number]) => void;
  applyPriceFilter: (newPrice: [number, number]) => void;
  brands: string[];
  setBrands: (value: string[]) => void;
  availableBrands: { value: string; label: string; key: string }[];
  relevant: string[];
  setRelevant: (value: string[]) => void;
}

const FiltersDesktop = ({
  category,
  setCategory,
  availableCategories,
  priceRange,
  tempPrice,
  setTempPrice,
  applyPriceFilter,
  brands,
  setBrands,
  availableBrands,
  relevant,
  setRelevant,
}: FiltersDesktopProps) => {
  return (
    <div id="Sidebar" className="w-1/5 mx-4 hidden xl:flex flex-col gap-3">
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
        valueMin={tempPrice[0]}
        valueMax={tempPrice[1]}
        onChange={setTempPrice}
        onApply={applyPriceFilter}
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
  );
};

export default FiltersDesktop;
