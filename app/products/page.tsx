
"use client";
import SectionPromoHome1 from "@/section/home/sectionPromoHome1";
import { FilterSection } from "@/component/ui/filterModal";
import { useEffect, useState, useMemo } from "react";
import Pagination from "@/component/ui/pagination";
import { SectionAbout4 } from "@/section/aboutUS/sectionAbout4";
import { server_url } from "@/lib/apiClient";
import Pot from "@/section/pot/pot";
import { SectionMasRecientes } from "@/section/masRecientes";
import CardSkeleton from "@/component/ui/skeletonCard";
import Card2 from "@/component/ui/card2";
import { Product } from "@/type/product";



export default function Products(){
    const [category, setCategory] = useState<string[]>([]);
    const [price, setPrice] = useState<[number, number]>([0, 200]);
    const [tempPrice, setTempPrice] = useState<[number, number]>([0, 200]);
    const [brands, setBrands] = useState<string[]>([]);
    const [relevant, setRelevant] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

const [allProducts, setAllProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);

const itemsPerPage = 15;

// Extraer categorías únicas de los productos (normalizado para evitar duplicados)
const availableCategories = useMemo(() => {
  const categoryMap = new Map<string, string>(); // Key: normalized, Value: original (el primero que encuentre)
  allProducts.forEach((product) => {
    const categoryName = product.categoria?.name || product.category?.name;
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
}, [allProducts]);

// Extraer marcas únicas de los productos (normalizado para evitar duplicados)
const availableBrands = useMemo(() => {
  const brandMap = new Map<string, string>(); // Key: normalized, Value: original (el primero que encuentre)
  allProducts.forEach((product) => {
    if (product.brand) {
      const normalized = product.brand.toLowerCase().trim();
      // Usar el valor normalizado como clave para evitar duplicados como "Ecko" vs "ecko"
      if (!brandMap.has(normalized)) {
        brandMap.set(normalized, product.brand.trim()); // Guardar el primer nombre original que encontremos
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
}, [allProducts]);

// Calcular rango de precios
const priceRange = useMemo(() => {
  if (allProducts.length === 0) return { min: 0, max: 200 };
  
  const prices = allProducts
    .map((product) => parseFloat(product.price) || 0)
    .filter((price) => price > 0);
  
  if (prices.length === 0) return { min: 0, max: 200 };
  
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}, [allProducts]);

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

  // Filtro por categorías
  if (category.length > 0) {
    filtered = filtered.filter((product) => {
      const categoryName = (product.categoria?.name || product.category?.name || '').toLowerCase();
      return category.some((cat) => categoryName === cat.toLowerCase());
    });
  }

  // Filtro por marcas
  if (brands.length > 0) {
    filtered = filtered.filter((product) => {
      const productBrand = (product.brand || '').toLowerCase();
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
      if (relevant.includes('ofertas')) {
        return product.temporal_price && 
               parseFloat(product.temporal_price) > 0 && 
               parseFloat(product.temporal_price) < parseFloat(product.price);
      }
      // Si es "masVendidos", actualmente muestra todos (puedes agregar lógica con datos reales)
      if (relevant.includes('masVendidos')) {
        // TODO: Agregar lógica basada en cantidad de ventas si está disponible
        return true;
      }
      // Si es "proximamente", actualmente muestra todos (puedes agregar lógica con datos reales)
      if (relevant.includes('proximamente')) {
        // TODO: Agregar lógica basada en fecha de lanzamiento si está disponible
        return true;
      }
      return false;
    });
  }

  return filtered;
}, [allProducts, category, brands, price, relevant, priceRange]);

// Calcular total de páginas basado en productos filtrados
const totalPages = useMemo(() => {
  return Math.ceil(filteredProducts.length / itemsPerPage);
}, [filteredProducts.length, itemsPerPage]);

// Calcular productos paginados desde productos filtrados
const paginatedProducts = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let pageProducts = filteredProducts.slice(startIndex, endIndex);
  
  // Si es la última página y hay menos productos que itemsPerPage, rellenar con productos de la primera página
  if (currentPage === totalPages && pageProducts.length < itemsPerPage && filteredProducts.length > 0) {
    const neededItems = itemsPerPage - pageProducts.length;
    const firstPageProducts = filteredProducts.slice(0, neededItems);
    pageProducts = [...pageProducts, ...firstPageProducts];
  }
  
  return pageProducts;
}, [filteredProducts, currentPage, totalPages, itemsPerPage]);

const getAllProducts = async () => {
  setIsLoading(true);
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4NDAsImV4cCI6MTc2Mzg3NDg0NX0.-W2-13mCQ6L7x8MQ5KQCzuhK59ZpeqAOe6Vfo7TsThk'; // tu token guardado
    const res = await fetch(`${server_url}/inventory_manager`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { 
        revalidate: 300 // Cachea la respuesta por 5 minutos (300 segundos)
      },
      cache: 'force-cache' // Fuerza el uso de caché cuando esté disponible
    });

    const data = await res.json();
    setAllProducts(data.products);
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  setIsMounted(true);
  getAllProducts();
}, []);

// Resetear página cuando cambian los filtros o si la página actual es mayor que el total de páginas
useEffect(() => {
  setCurrentPage(1);
}, [category, brands, price, relevant]);

useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }
}, [totalPages, currentPage]);


    const removeFilter = (type: 'category' | 'brand' | 'relevant', value: string) => {
      if (type === 'category') {
        setCategory(category.filter(c => c !== value));
      } else if (type === 'brand') {
        setBrands(brands.filter(b => b !== value));
      } else if (type === 'relevant') {
        setRelevant(relevant.filter(r => r !== value));
      }
    };

    const resetPrice = () => {
      setPrice([priceRange.min, priceRange.max]);
      setTempPrice([priceRange.min, priceRange.max]);
    };

    return(
        <main className="flex w-full h-auto flex-col">
            <div id="main" className="flex flex-row">

            {/* Sidebar Desktop */}
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

            <div id="content" className="w-full mb-20  xl:w-4/5 overflow-hidden">
                <div id="content-ollas" className="xl:hidden">
                    <SectionPromoHome1 />
                </div>

                <div className="hidden xl:block">
                  <Pot/>
                </div>

                   <div id={"list"} className="mt-20 px-4 xl:px-0">
                      {/* Header con título y botón de filtros */}
                      <div className="flex w-full justify-between items-start mb-4">
                        <div className="flex-1">
                          <h2 className="text-lg md:text-xl text-primary font-bold mb-2">Todos las Categorías</h2>
                          <span className="text-sm text-[#777777]">{filteredProducts?.length ?? 0} Productos</span>
                        </div>

                        <button 
                          onClick={() => setIsFilterOpen(true)}
                          className="xl:hidden flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-primary"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                        </button>
                      </div>

                      {/* Filtros aplicados */}
                      {(category.length > 0 || brands.length > 0 || relevant.length > 0 || price[0] !== priceRange.min || price[1] !== priceRange.max) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {category.map((cat) => (
                            <div key={cat} className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium">
                              <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                                <svg className="w-2 h-2 text-[#0b2a4a]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>
                                {availableCategories.find(c => c.value === cat.toLowerCase())?.label || cat}
                              </span>
                              <button 
                                onClick={() => removeFilter('category', cat)} 
                                className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {brands.map((brand) => (
                            <div key={brand} className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium">
                              <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                                <svg className="w-2 h-2 text-[#0b2a4a]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>
                                {availableBrands.find(b => b.value === brand.toLowerCase())?.label || brand.charAt(0).toUpperCase() + brand.slice(1)}
                              </span>
                              <button 
                                onClick={() => removeFilter('brand', brand)} 
                                className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {relevant.map((rel) => (
                            <div key={rel} className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium">
                              <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                                <svg className="w-2 h-2 text-[#0b2a4a]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>{rel === 'ofertas' ? 'Ofertas' : rel === 'masVendidos' ? 'Más vendidos' : 'Próximamente'}</span>
                              <button 
                                onClick={() => removeFilter('relevant', rel)} 
                                className="ml-1 text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {(price[0] !== priceRange.min || price[1] !== priceRange.max) && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#f6f8fb] text-[#0b2a4a] rounded-lg text-sm font-medium">
                              <div className="w-3 h-3 border border-[#0b2a4a] flex items-center justify-center rounded-sm">
                                <svg className="w-2 h-2 text-[#0b2a4a]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>${price[0].toLocaleString()} - ${price[1].toLocaleString()}</span>
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
                  </div>

                  {/* Filtros aplicados */}
                  
                  

                <div id="products" className="mt-20 mx-4 xl:mx-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:mt-0 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:mr-15 auto-rows-fr">
                  {isLoading ? (
                    // Mostrar 15 skeletons mientras carga
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <CardSkeleton
                        key={`skeleton-${index}`}
                        position="vertical"
                      />
                    ))
                  ) : paginatedProducts && paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product, index) => {
                      // Crear una clave única combinando el ID del producto con su índice
                      // Esto asegura que cada producto tenga una clave única incluso si los IDs están duplicados
                      const uniqueKey = `${product.id}-${index}`;
                      
                      return (
                        <Card2
                          key={uniqueKey}
                          productId={product.id}
                          category={product.categoria?.name}
                          title={product.name}
                          brand={product.brand}
                          warranty={product.warranty}
                          price={product.price}
                          image={product.img}
                          temporal_price={product?.temporal_price}
                          position="vertical"
                        />
                      );
                    })
                  ) : (
                    <p className="col-span-full text-center text-gray-500">No se encontraron productos</p>
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

            <SectionMasRecientes products={allProducts} />

            {/* Modal de filtros para móvil */}
            {isFilterOpen && (
              <div className="fixed inset-0 z-50 xl:hidden">
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
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
            )}

        </main>
    );
}