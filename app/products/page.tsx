"use client";
import SectionPromoHome1 from "@/section/home/sectionPromoHome1";
import FiltersDesktop from "@/components/pageProducts/filtersDesktop/filtersDesktop";
import FiltersMobile from "@/components/pageProducts/filtersMobile/filtersMobile";
import { useEffect, useState, useMemo, useRef } from "react";
import { Filter } from "lucide-react";
import { useInventory } from "@/hooks/productRequests/useInventory";
import Pagination from "@/components/ui/pagination";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import Pot from "@/section/pot/pot";
import CardSkeleton from "@/components/ui/skeletonCard";
import { LatestProducts } from "@/section/latestProducts";
import CardAllProducts from "@/components/ui/cardAllProducts";
import { BestSelling } from "@/section/bestSelling/bestSelling";
import useProductsByLocationStore from "@/store/productsByLocationStore";
import ActiveFilters from "@/components/pageProducts/activeFilters/activeFilters";
import StoreSelector from "@/components/pageProducts/storeSelector/storeSelector";

export default function Products() {
  const { 
    provinceId,
  } = useProductsByLocationStore();

  const { data: inventoryData, isLoading } = useInventory();
  
  const allProducts = inventoryData?.products || [];
  const tiendas = inventoryData?.tiendas || [];
  const currencys = inventoryData?.currencys || null;
  const globalProducts = allProducts; // En este contexto, allProducts ya son los productos disponibles

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 200]);
  const [tempPrice, setTempPrice] = useState<[number, number]>([0, 200]);
  const [brands, setBrands] = useState<string[]>([]);
  const [relevant, setRelevant] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const storeSelectorRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 15;

  // Extraer categorías únicas de los productos (normalizado para evitar duplicados)
  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, string>(); // Key: normalized, Value: original (el primero que encuentre)
    const productsToUse =
      globalProducts.length > 0 ? globalProducts : allProducts;

    productsToUse.forEach((product) => {
      // Intentar obtener el nombre de la categoría de varias formas para mayor robustez
      const categoryName =
        (typeof product.categoria === "object" && product.categoria?.name) ||
        (typeof product.category === "object" && product.category?.name) ||
        (typeof product.categoria === "string" ? product.categoria : null) ||
        (typeof product.category === "string" ? product.category : null);

      if (categoryName) {
        const normalized = categoryName.toLowerCase().trim();
        // Usar el valor normalizado como clave para evitar duplicados como "Desmatt" vs "desmatt"
        if (!categoryMap.has(normalized)) {
          categoryMap.set(normalized, categoryName.trim()); // Guardar el primer nombre original que encontremos
        }
      }
    });
    return Array.from(categoryMap.entries())
      .sort(([a], [b]) => a.localeCompare(b)) // Ordenar por nombre normalizado
      .map(([normalized, original]) => ({
        value: normalized,
        label: original,
        key: normalized, // Clave única basada en el nombre normalizado
      }));
  }, [allProducts, globalProducts]);

  // Extraer marcas únicas de los productos (normalizado para evitar duplicados)
  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, string>(); // Key: normalized, Value: original (el primero que encuentre)
    const productsToUse =
      globalProducts.length > 0 ? globalProducts : allProducts;

    productsToUse.forEach((product) => {
      // Intentar obtener la marca de varias formas para mayor robustez
      const brandName =
        (typeof product.brand === "string" ? product.brand : null) ||
        (typeof (product as any).marca === "string"
          ? (product as any).marca
          : null) ||
        (typeof (product as any).marca === "object" &&
        (product as any).marca?.name
          ? (product as any).marca.name
          : null);

      if (brandName) {
        const normalized = brandName.toLowerCase().trim();
        // Usar el valor normalizado como clave para evitar duplicados como "Ecko" vs "ecko"
        if (!brandMap.has(normalized)) {
          brandMap.set(normalized, brandName.trim()); // Guardar el primer nombre original que encontremos
        }
      }
    });
    return Array.from(brandMap.entries())
      .sort(([a], [b]) => a.localeCompare(b)) // Ordenar por nombre normalizado
      .map(([normalized, original]) => ({
        value: normalized,
        label: original,
        key: normalized, // Clave única basada en el nombre normalizado
      }));
  }, [allProducts, globalProducts]);

  // Calcular rango de precios
  const priceRange = useMemo(() => {
    const productsToUse =
      globalProducts.length > 0 ? globalProducts : allProducts;
    if (productsToUse.length === 0) return { min: 0, max: 200 };

    const prices = productsToUse
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) return { min: 0, max: 200 };

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts, globalProducts]);

  // Inicializar el precio cuando se cargan los productos
  useEffect(() => {
    if (priceRange.min !== 0 || priceRange.max !== 200) {
      if (price[0] === 0 && price[1] === 200) {
        setPrice([priceRange.min, priceRange.max]);
        setTempPrice([priceRange.min, priceRange.max]);
      }
    }
  }, [priceRange.min, priceRange.max]);

  // Función para aplicar el filtro de precio cuando el usuario termina de ajustar
  const applyPriceFilter = (newPrice: [number, number]) => {
    setTempPrice(newPrice);
    setPrice(newPrice);
  };

  // Aplicar filtros a los productos
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filtro por tienda seleccionada
    if (selectedStoreId) {
      filtered = filtered.filter(
        (product) => product.tiendaId === selectedStoreId
      );
    }

    // Filtro por categorías
    if (category.length > 0) {
      filtered = filtered.filter((product) => {
        const categoryName = (
          (typeof product.categoria === "object" && product.categoria?.name) ||
          (typeof product.category === "object" && product.category?.name) ||
          (typeof product.categoria === "string" ? product.categoria : null) ||
          (typeof product.category === "string" ? product.category : null) ||
          ""
        ).toLowerCase();
        return category.some((cat) => categoryName === cat.toLowerCase());
      });
    }

    // Filtro por marcas
    if (brands.length > 0) {
      filtered = filtered.filter((product) => {
        const productBrand = (
          (typeof product.brand === "string" ? product.brand : null) ||
          (typeof (product as any).marca === "string"
            ? (product as any).marca
            : null) ||
          (typeof (product as any).marca === "object" &&
          (product as any).marca?.name
            ? (product as any).marca.name
            : null) ||
          ""
        ).toLowerCase();
        return brands.some((brand) => productBrand === brand.toLowerCase());
      });
    }

    // Filtro por precio
    if (price[0] !== priceRange.min || price[1] !== priceRange.max) {
      filtered = filtered.filter((product) => {
        const productPrice = parseFloat(product.price) || 0;
        return productPrice >= price[0] && productPrice <= price[1];
      });
    }

    // Filtro por relevantes (solo aplica si hay una selección)
    if (relevant.length > 0) {
      filtered = filtered.filter((product) => {
        // Si es "ofertas", mostrar solo productos con precio temporal menor que precio normal
        if (relevant.includes("ofertas")) {
          return (
            product.temporal_price &&
            parseFloat(product.temporal_price) > 0 &&
            parseFloat(product.temporal_price) < parseFloat(product.price)
          );
        }
        // Si es "masVendidos", actualmente muestra todos (puedes agregar lógica con datos reales)
        if (relevant.includes("masVendidos")) {
          // TODO: Agregar lógica basada en cantidad de ventas si está disponible
          return true;
        }
        // Si es "proximamente", actualmente muestra todos (puedes agregar lógica con datos reales)
        if (relevant.includes("proximamente")) {
          // TODO: Agregar lógica basada en fecha de lanzamiento si está disponible
          return true;
        }
        return false;
      });
    }

    return filtered;
  }, [
    allProducts,
    category,
    brands,
    price,
    relevant,
    priceRange,
    selectedStoreId,
  ]);

  // Calcular total de páginas basado en productos filtrados
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length, itemsPerPage]);

  // Calcular productos paginados desde productos filtrados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    if (tiendas.length > 0 && !selectedStoreId) {
      setSelectedStoreId(tiendas[0].id);
    }
  }, [tiendas, selectedStoreId]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [category, brands, price, relevant, selectedStoreId]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    if (storeSelectorRef.current) {
      storeSelectorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const removeFilter = (
    type: "category" | "brand" | "relevant",
    value: string
  ) => {
    if (type === "category") {
      setCategory(category.filter((c) => c !== value));
    } else if (type === "brand") {
      setBrands(brands.filter((b) => b !== value));
    } else if (type === "relevant") {
      setRelevant(relevant.filter((r) => r !== value));
    }
  };

  const resetPrice = () => {
    setPrice([priceRange.min, priceRange.max]);
    setTempPrice([priceRange.min, priceRange.max]);
  };

  return (
    <main className="flex w-full h-auto flex-col">
      <div id="main" className="flex flex-row">
        {/* filters Desktop */}
        <FiltersDesktop
          category={category}
          setCategory={setCategory}
          availableCategories={availableCategories}
          priceRange={priceRange}
          tempPrice={tempPrice}
          setTempPrice={setTempPrice}
          applyPriceFilter={applyPriceFilter}
          brands={brands}
          setBrands={setBrands}
          availableBrands={availableBrands}
          relevant={relevant}
          setRelevant={setRelevant}
        />

        <div id="content" className="w-full mb-20  xl:w-4/5 overflow-hidden">
          <div id="content-ollas" className="xl:hidden">
            <SectionPromoHome1 />
          </div>

          <div className="hidden xl:block">
            <Pot />
          </div>

          <div id={"list"} className="mt-20 px-4 xl:px-0">
            {/* Header con título y botón de filtros */}
            <div className="flex w-full justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl text-accent font-bold">Productos</h2>

                {/* Filtros aplicados */}
                <ActiveFilters
                  category={category}
                  brands={brands}
                  relevant={relevant}
                  price={price}
                  priceRange={priceRange}
                  availableCategories={availableCategories}
                  availableBrands={availableBrands}
                  removeFilter={removeFilter}
                  resetPrice={resetPrice}
                  totalProducts={filteredProducts?.length ?? 0}
                />
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="xl:hidden z-50 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-primary cursor-pointer"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Selector y visualización de tiendas */}
          <StoreSelector
            tiendas={tiendas}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
            ref={storeSelectorRef}
          />


          <div
            id="products"
            className=" mx-4 xl:mx-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:mt-0 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:mr-15 auto-rows-fr"
          >
            {isLoading ? (
              // Mostrar 15 skeletons mientras carga
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <CardSkeleton key={`skeleton-${index}`} position="vertical" />
              ))
            ) : paginatedProducts && paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <CardAllProducts
                  key={`${product.id}-${index}`}
                  productId={product.id}
                  category={product.categoria?.name}
                  title={product.name}
                  brand={product.brand}
                  warranty={product.warranty}
                  price={product.price}
                  image={product.img}
                  count={product.count}
                  temporal_price={product?.temporal_price}
                  tiendaId={product.tiendaId}
                  position="vertical"
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 h-80 text-xl sm:text-2xl  ">
                No se encontraron productos
              </p>
            )}
          </div>
          {totalPages > 0 && (
            <div className="flex justify-center my-10">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div id="Banner dolar" className="w-full h-auto">
        <SectionAbout4 />
      </div>

      <div className="hidden xl:block">
        <LatestProducts />
      </div>

      <div className="xl:hidden">
        <BestSelling />
      </div>

      {/* Modal de filtros para móvil */}
      <FiltersMobile
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        category={category}
        setCategory={setCategory}
        availableCategories={availableCategories}
        priceRange={priceRange}
        price={price}
        setPrice={setPrice}
        brands={brands}
        setBrands={setBrands}
        availableBrands={availableBrands}
        relevant={relevant}
        setRelevant={setRelevant}
      />
    </main>
  );
}
