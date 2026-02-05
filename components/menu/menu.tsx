"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { MaterialSymbolsClose, MaterialSymbolsMenu } from "@/icons/icons";
import useLoadingStore from "@/store/loadingStore";
import { useInventory } from "@/hooks/productRequests/useInventory";
import useFilterStore from "@/store/filterStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import { buildAvailableCategories } from "@/utils/productFiltersCategory";

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsSubmenuOpen, setIsProductsSubmenuOpen] = useState(false);
  const productsItemRef = useRef<HTMLDivElement | null>(null);
  const startLoading = useLoadingStore((state) => state.startLoading);
  const { data: inventoryData } = useInventory();
  const {
    selectedCategories,
    toggleCategory,
    setShouldScrollToProducts,
  } = useFilterStore();

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/products", label: "Productos" },
    { href: "/about", label: "Sobre Nosotros" },
    { href: "/faq", label: "Preguntas Frecuentes" },
    { href: "/warranty", label: "Garantía" },
    { href: "/shipping", label: "Envíos" },
    { href: "/contact", label: "Contacto" },
  ];

  const checkActive = (href: string) => {
    const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
    const normalizedHref = href.endsWith("/") ? href : `${href}/`;
    return normalizedPath === normalizedHref;
  };

  const availableCategories = useMemo(
    () => buildAvailableCategories(inventoryData?.products || []),
    [inventoryData],
  );

  const handleCategoryClick = (categoryValue: string) => {
    toggleCategory(categoryValue);
    setShouldScrollToProducts(true);

    if (!checkActive("/products")) {
      startLoading();
      router.push("/products");
    }
  };

  

  return (
    <>
      {/* Botón hamburguesa - Solo visible en móvil */}
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden  top-4 left-4 z-50 p-2"
        aria-label="Abrir menú"
      >
     <MaterialSymbolsMenu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0   bg-opacity-50 z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú móvil - Drawer */}
      <div
        className={`fixed top-0  left-0  p-2 h-125 rounded-2xl  w-75 bg-white z-100 transform transition-transform duration-300 xl:hidden ${
          isOpen ? "translate-x-2" : "-translate-x-full"
        }`}
      >
        <div className="p-6 ">
          {/* Logo y botón cerrar */}
          <div className="flex justify-between items-center mb-8">
            <Image src="/images/logo.svg" alt="Logo" width={100} height={50} />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Cerrar menú"
            >
              <MaterialSymbolsClose className="w-6 h-6" />
            </button>
          </div>

          <hr className="mb-6 border-gray-200" />

          {/* Links del menú móvil */}
          <nav
            className="flex flex-col gap-6"
            onPointerDown={(e) => {
              if (!isProductsSubmenuOpen) return;
              const target = e.target as Node;
              if (
                productsItemRef.current &&
                !productsItemRef.current.contains(target)
              ) {
                setIsProductsSubmenuOpen(false);
              }
            }}
          >
            {links.map((link) => (
                <div
                  key={link.href}
                  className="flex flex-col relative"
                  ref={link.href === "/products" ? productsItemRef : undefined}
                >
                  <div className="flex items-center justify-between">
                    {link.href === "/products" ? (
                      <button
                        onClick={() =>
                          setIsProductsSubmenuOpen(!isProductsSubmenuOpen)
                        }
                        className={`flex w-full items-center  text-md transition hover:text-primary ${
                          checkActive(link.href)
                            ? "text-primary font-semibold"
                            : "text-gray-700"
                        }`}
                        aria-expanded={isProductsSubmenuOpen}
                        aria-controls="products-submenu"
                      >
                        <span>{link.label}</span>
                        {isProductsSubmenuOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (!checkActive(link.href)) startLoading();
                        }}
                        className={`text-md transition hover:text-primary ${
                          checkActive(link.href)
                            ? "text-primary font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>

                  {link.href === "/products" && isProductsSubmenuOpen && (
                    <div
                      id="products-submenu"
                      className="absolute left-0 top-full z-50 bg-white shadow-lg rounded-lg border border-gray-100 px-4 py-3 mt-2 overflow-x-auto overflow-y-auto custom-scrollbar max-h-120 flex flex-col gap-3 w-max"
                    >
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (!checkActive("/products")) {
                            startLoading();
                            router.push("/products");
                          } else {
                            setShouldScrollToProducts(true);
                          }
                        }}
                        className={`w-full text-left text-sm transition flex items-center gap-2 ${
                          pathname === "/products"
                            ? "text-primary font-bold"
                            : "text-gray-600 hover:text-primary"
                        }`}>
                        <span
                          className={`inline-block w-4 h-4 rounded-full border-2 border-dashed ${
                            pathname === "/products"
                              ? "border-primary "
                              : "border-gray-300 bg-transparent"
                          }`}
                        />
                        <span className="whitespace-nowrap">Ver todos los productos</span>
                      </button>
                      {availableCategories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat.value);
                        return (
                          <button
                            key={cat.value}
                            onClick={() => {
                              handleCategoryClick(cat.value);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left text-sm transition hover:text-primary flex items-center gap-2 ${
                              isSelected ? "text-primary font-bold" : "text-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block w-4 h-4 rounded-full border-2 border-dashed ${
                                isSelected
                                  ? "border-primary "
                                  : "border-gray-300 bg-transparent"
                              }`}
                            />
                            <span className="whitespace-nowrap">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
            ))}
          </nav>

        </div>
      </div>







      {/* Menú desktop - Solo visible en md y superiores */}
      <div className="hidden xl:block w-full bg-white ml-5">
        <nav className="relative flex justify-center gap-9 text-sm ">
          {links.map((link) => (
              <div key={link.href} className="group pb-2">
                <Link
                
                  href={link.href}
                  onClick={() => {
                    if (!checkActive(link.href)) startLoading();
                  }}
                  className={`transition flex items-center  hover:text-primary   ${
                    checkActive(link.href) ? "text-primary font-semibold" : "text-gray-700"
                  }`}
                >
                  {link.label}
                  {link.href === "/products" && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {link.href === "/products" && availableCategories.length > 0 && (
                <div >            
             
                  <div className="absolute left-0 right-0 top-full hidden group-hover:flex justify-center xl:-ml-5">
                    <div className="w-full  bg-white shadow-lg rounded-b-lg border border-gray-100 px-6 py-4 mt-0.5">
                      <div className=" overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex flex-wrap gap-x-20 gap-y-3">
                      
                          {availableCategories.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => handleCategoryClick(cat.value)}
                              className={`w-fit text-left py-2 text-sm transition-colors hover:text-primary cursor-pointer flex items-center gap-1 ${
                                selectedCategories.includes(cat.value)
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block w-3.5 h-3.5 rounded-full border-2 border-dashed flex-none shrink-0 ${
                                  selectedCategories.includes(cat.value)
                                    ? "border-primary "
                                    : "border-gray-300 bg-transparent"
                                }`}
                              />
                              <span className="whitespace-nowrap">{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                )}
              </div>
            ))}
        </nav>
      </div>
    </>
  );
}
