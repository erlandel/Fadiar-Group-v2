"use client";
import BannerPot from "@/components/banner/bannerPot";
import FiltersDesktop from "@/components/pageProducts/filtersDesktop/filtersDesktop";
import FiltersMobile from "@/components/pageProducts/filtersMobile/filtersMobile";
import { useEffect, useState, useMemo, useRef } from "react";
import { useInventory } from "@/hooks/productRequests/useInventory";
import Pagination from "@/components/ui/pagination";
import { BannerMoney } from "@/components/banner/bannerMoney";
import Pot from "@/sections/pot/pot";
import { LatestProducts } from "@/sections/sectionsProducts/latestProducts";
import CardAllProducts from "@/components/ui/cardAllProducts";
import { BestSelling } from "@/sections/sectionsProducts/bestSelling";
import ActiveFilters from "@/components/pageProducts/activeFilters/activeFilters";
import StoreSelector from "@/components/pageProducts/storeSelector/storeSelector";
import SkeletonCardAllProducts from "@/components/ui/skeletonCardAllProducts";
import useFilterStore from "@/store/filterStore";

export default function Products() {
  const { data: inventoryData, isLoading } = useInventory();

  const allProducts = inventoryData?.products || [];
  const tiendas = inventoryData?.tiendas || [];
  const globalProducts = allProducts;
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 200]);
  const [tempPrice, setTempPrice] = useState<[number, number]>([0, 200]);
  const [priceInitialized, setPriceInitialized] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [relevant, setRelevant] = useState<string[]>([]);
  const {
    isFilterOpen,
    setIsFilterOpen,
    preselectedCategory,
    setPreselectedCategory,
    shouldScrollToStore,
    setShouldScrollToStore,
  } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);

  const storeSelectorRef = useRef<HTMLDivElement>(null);
  const productosRef = useRef<HTMLDivElement>(null);

  const [itemsPerPage, setItemsPerPage] = useState(15);
  const gridRef = useRef<HTMLDivElement>(null);

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  useEffect(() => {
    if (shouldScrollToStore && productosRef.current) {
      const timer = setTimeout(() => {
        productosRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldScrollToStore(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldScrollToStore, setShouldScrollToStore]);

  useEffect(() => {
    if (preselectedCategory) {
      setCategory([preselectedCategory]);
      setPreselectedCategory(null);
    }
  }, [preselectedCategory, setPreselectedCategory]);

  useEffect(() => {
    const calculateItems = () => {
      if (!gridRef.current) return;

      const width = window.innerWidth;
      const containerWidth = gridRef.current.offsetWidth;
      const gap = 16; // gap-4

      let rows = 5;
      let columns;

      if (width >= 1280) {
        // xl
        rows = 3;
        const minWidth = 200;
        columns = Math.floor((containerWidth + gap) / (minWidth + gap));
      } else if (width >= 640) {
        // sm
        rows = 4;
        const minWidth = 200;
        columns = Math.floor((containerWidth + gap) / (minWidth + gap));
      } else {
        // < sm
        rows = 5;
        columns = 2; // Forzamos 2 columnas en móviles
      }

      const totalItems = Math.max(columns * rows, 1);

      setItemsPerPage(totalItems);
    };

    calculateItems();
    window.addEventListener("resize", calculateItems);
    return () => window.removeEventListener("resize", calculateItems);
  }, []);

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
        const normalized = normalizeText(categoryName);
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
        const normalized = normalizeText(brandName);
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
        setPriceInitialized(true);
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
        (product) => product.tiendaId === selectedStoreId,
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
        );
        const normalizedCategoryName = normalizeText(categoryName);
        return category.some((cat) => normalizedCategoryName === normalizeText(cat));
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
        );
        const normalizedBrand = normalizeText(productBrand);
        return brands.some((brand) => normalizedBrand === normalizeText(brand));
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

  useEffect(() => {
    const hasActiveFilters =
      category.length > 0 ||
      brands.length > 0 ||
      relevant.length > 0 ||
      (priceInitialized &&
        (price[0] !== priceRange.min || price[1] !== priceRange.max));

    if (productosRef.current && window.innerWidth < 1280 && hasActiveFilters) {
      productosRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [
    category,
    brands,
    price,
    relevant,
    priceRange.min,
    priceRange.max,
    priceInitialized,
  ]);

  const removeFilter = (
    type: "category" | "brand" | "relevant",
    value: string,
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
    <main className="flex w-full h-auto flex-col ">
      <div id="main" className="flex flex-row xl:gap-4">
        {" "}
        {/* filters Desktop */}
        <div className="w-1/5 ml-2 hidden xl:flex flex-col gap-3 mt-2 shrink-0">

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
        </div>

        
        <div id="content" className="w-full mb-20 xl:flex-1 overflow-hidden">
          <div id="content-ollas" className="xl:hidden">
            <BannerPot />
          </div>

          <div className="hidden xl:block">
            <Pot />
          </div>

          <div className="xl:ml-2">
            <div id={"list"} className="mt-20 px-4 xl:px-0">
              {/* Header con título y botón de filtros */}
              <div className="flex w-full justify-between items-start mb-4">
                <div 
                  ref={productosRef}
                  className="flex-1 scroll-mt-35 xl:scroll-mt-25"
                >
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
              </div>
            </div>

            {/* Selector y visualización de tiendas */}
            <div
              ref={storeSelectorRef}
              className="scroll-mt-35 xl:scroll-mt-25"
            >
              <StoreSelector
                tiendas={tiendas}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
              />
            </div>

            <div
              id="products"
              ref={gridRef}
              className="mx-4  xl:mx-0 xl:mr-10 3xl:mr-15 grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 sm:gap-4 auto-rows-fr justify-items-center"
            >
              {isLoading ? (
                // Mostrar 15 skeletons mientras carga
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonCardAllProducts key={`skeleton-${index}`} position="vertical" />
                ))
              ) : paginatedProducts && paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <CardAllProducts
                    key={`${product.id}-${index}`}
                    productId={product.id}
                  currency={product.currency}
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

            {totalPages > 1 && (
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
      </div>

      <div id="Banner dolar" className="w-full h-auto">
        <BannerMoney />
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
