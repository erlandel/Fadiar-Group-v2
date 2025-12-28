"use client";
import SectionPromoHome1 from "@/section/home/sectionPromoHome1";
import FiltersDesktop from "@/component/filtersDesktop/filtersDesktop";
import FiltersMobile from "@/component/filtersMobile/filtersMobile";
import { useEffect, useState, useMemo, useRef } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Pagination from "@/component/ui/pagination";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { server_url } from "@/lib/apiClient";
import Pot from "@/section/pot/pot";
import CardSkeleton from "@/component/ui/skeletonCard";
import { Product } from "@/types/product";
import { LatestProducts } from "@/section/latestProducts";
import CardAllProducts from "@/component/ui/cardAllProducts";
import { BestSelling } from "@/section/bestSelling/bestSelling";
import useProductsByLocationStore from "@/store/productsByLocationStore";

export default function Products() {
  const { municipalityId } = useProductsByLocationStore();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 200]);
  const [tempPrice, setTempPrice] = useState<[number, number]>([0, 200]);
  const [brands, setBrands] = useState<string[]>([]);
  const [relevant, setRelevant] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openStores, setOpenStores] = useState(false);
  const storesRef = useRef<HTMLDivElement>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [globalProducts, setGlobalProducts] = useState<Product[]>([]);
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [currencys, setCurrencys] = useState<any>(null);

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

  const { mutate: fetchProducts, isPending: isLoading } = useMutation({
    mutationFn: async (mId?: number | null) => {
      console.log("se ejecuta la peticion");
      const queryParams = new URLSearchParams();
      queryParams.append("productos", "true");
      if (mId) {
        queryParams.append("municipio", mId.toString());
      }
      console.log("mid", mId);

      const res = await fetch(
        `${server_url}/inventory_manager?${queryParams.toString()}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("res", res);
     
      if (!res.ok) throw new Error("Error fetching products");
      return res.json();
    },
    onSuccess: (data) => {
      console.log("data", data);

      // Guardamos la información de tiendas y monedas si están presentes
      if (data.currencys) setCurrencys(data.currencys);

      const realTiendas = data.tiendas?.filter((t: any) => t.active) || [];
      const baseProducts = realTiendas.flatMap((t: any) => t.productos || []);

      // console.log("baseProducts: ",baseProducts)
      // Creamos 10 tiendas: las reales + inventadas hasta llegar a 10
      const dummyStoreNames = [
        "Tienda Principal",
        "Fadiar Gourmet",
        "Mercado Express",
        "Almacén Central",
        "Bazar del Hogar",
        "Tienda de Ofertas",
        "Fadiar Premium",
        "Suministros Rápidos",
        "Rincón del Chef",
        "Variedades Fadiar",
      ];

      const finalTiendas = Array.from({ length: 10 }).map((_, index) => {
        const id =
          index === 0 && realTiendas[0]
            ? realTiendas[0].id
            : `store-dummy-${index}`;
        const name =
          index === 0 && realTiendas[0]
            ? realTiendas[0].name
            : dummyStoreNames[index];

        let storeProducts: any[] = [];

        if (index === 0) {
          // La primera tienda tiene todos los productos de la petición intactos
          storeProducts = [...baseProducts];
        } else {
          // Las otras tiendas tienen una mezcla clonada de los productos base
          const start = (index * 3) % (baseProducts.length || 1);
          storeProducts =
            baseProducts.length > 0
              ? [
                  ...baseProducts.slice(start, start + 10),
                  ...baseProducts.slice(
                    0,
                    Math.max(0, 10 - (baseProducts.length - start))
                  ),
                ]
              : [];
        }

        return {
          id,
          name,
          active: true,
          productos: storeProducts.map((p) => ({ ...p, tiendaId: id })),
        };
      });

      setTiendas(finalTiendas);

      // Aplanamos todos los productos de todas las tiendas generadas
      const allGeneratedProducts = finalTiendas.flatMap((t) => t.productos);
      setAllProducts(allGeneratedProducts);

      // Seleccionamos la primera tienda por defecto si no hay una seleccionada
      if (finalTiendas.length > 0) {
        setSelectedStoreId(finalTiendas[0].id);
      }
    },
    onError: (error) => {
      console.error("Error loading products:", error);
    },
  });

  useEffect(() => {
    setIsMounted(true);
    // Cargar todos los productos globalmente para los filtros una sola vez
    const fetchGlobalProducts = async () => {
      if (globalProducts.length > 0) return;
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("productos", "true");
        const res = await fetch(
          `${server_url}/inventory_manager?${queryParams.toString()}`
        );
        if (res.ok) {
          const data = await res.json();
          const allP =
            data.tiendas?.flatMap((t: any) => t.productos || []) || [];
          setGlobalProducts(allP);
        }
      } catch (error) {
        console.error("Error fetching global products:", error);
      }
    };
    fetchGlobalProducts();
  }, []);

  useEffect(() => {
    if (municipalityId != null) fetchProducts(municipalityId);
  }, [municipalityId]);

  // Resetear página cuando cambian los filtros o si la página actual es mayor que el total de páginas
  useEffect(() => {
    setCurrentPage(1);
  }, [category, brands, price, relevant, selectedStoreId]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        storesRef.current &&
        !storesRef.current.contains(event.target as Node)
      ) {
        setOpenStores(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <h2 className="text-2xl text-accent font-bold">
                  Productos
                </h2>

                <div className="flex flex-col gap-2 mb-2 mt-2">
                  {/* Filtros aplicados */}
                  {(category.length > 0 ||
                    brands.length > 0 ||
                    relevant.length > 0 ||
                    price[0] !== priceRange.min ||
                    price[1] !== priceRange.max) && (
                    <div className="flex flex-wrap gap-2 ">
                      {category.map((cat) => (
                        <div
                          key={cat}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium"
                        >
                          <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                            <svg
                              className="w-2 h-2 text-[#0b2a4a]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>
                            {availableCategories.find(
                              (c) => c.value === cat.toLowerCase()
                            )?.label || cat}
                          </span>
                          <button
                            onClick={() => removeFilter("category", cat)}
                            className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium"
                        >
                          <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                            <svg
                              className="w-2 h-2 text-[#0b2a4a]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>
                            {availableBrands.find(
                              (b) => b.value === brand.toLowerCase()
                            )?.label ||
                              brand.charAt(0).toUpperCase() + brand.slice(1)}
                          </span>
                          <button
                            onClick={() => removeFilter("brand", brand)}
                            className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {relevant.map((rel) => (
                        <div
                          key={rel}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium"
                        >
                          <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                            <svg
                              className="w-2 h-2 text-[#0b2a4a]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>
                            {rel === "ofertas"
                              ? "Ofertas"
                              : rel === "masVendidos"
                              ? "Más vendidos"
                              : "Próximamente"}
                          </span>
                          <button
                            onClick={() => removeFilter("relevant", rel)}
                            className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {(price[0] !== priceRange.min ||
                        price[1] !== priceRange.max) && (
                        <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium">
                          <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                            <svg
                              className="w-2 h-2 text-[#0b2a4a]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span>
                            ${price[0].toLocaleString()} - $
                            {price[1].toLocaleString()}
                          </span>
                          <button
                            onClick={resetPrice}
                            className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-sm text-[#777777]">
                    {filteredProducts?.length ?? 0} Productos
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="xl:hidden z-100 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-primary cursor-pointer"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

            {/* Selector y visualización de tiendas */}
          <div className="flex items-center justify-center w-full">
            {tiendas.length > 0 && (
              <div className="flex flex-wrap items-center gap-y-3 mt-4 pb-4 w-full">
                <div className="flex items-center justify-start gap-2 w-full md:hidden mx-4">
                  {/* Selector Personalizado */}
                  <div className="relative" ref={storesRef}>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-between bg-gray-50 rounded-sm p-2 cursor-pointer hover:border-primary transition-colors "
                        onClick={() => setOpenStores(!openStores)}
                      >
                        <span className="text-sm sm:text-md font-bold text-primary">
                          Tiendas 
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 ml-1 text-primary transition-transform duration-200 ${
                            openStores ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <span className="text-primary  text-md sm:text-xl font-bold">:</span>
                      <span className="text-sm md:text-md font-bold text-accent whitespace-nowrap truncate">
                        {tiendas.find((t) => t.id === selectedStoreId)?.name ||
                          "Seleccione tienda"}
                      </span>
                    </div>

                    {openStores && (
                      <ul className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-100 max-h-60 overflow-auto py-1 w-full">
                        {tiendas.map((tienda: any) => (
                          <li
                            key={tienda.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm transition-colors ${
                              selectedStoreId === tienda.id
                                ? "bg-primary/5 text-primary font-bold"
                                : "text-gray-700"
                            }`}
                            onClick={() => {
                              setSelectedStoreId(tienda.id);
                              setOpenStores(false);
                            }}
                          >
                            {tienda.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 mx-4 xl:mx-0">
                  {tiendas.map((tienda: any) => (
                    <button
                      key={tienda.id}
                      onClick={() => setSelectedStoreId(tienda.id)}
                      className={`text-sm md:text-base transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        selectedStoreId === tienda.id
                          ? "text-primary font-bold border-b-2 border-primary pb-1"
                          : "text-gray-400 hover:text-primary"
                      }`}
                    >
                      {tienda.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>


          
          {/* Filtros aplicados */}

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
              <p className="col-span-full text-center text-gray-500">
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
