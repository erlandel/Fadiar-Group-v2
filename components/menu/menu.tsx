"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
    { href: "/warranty", label: "Garantia" },
    { href: "/shipping", label: "Envios" },
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

    if (pathname !== "/products") {
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
          <nav className="flex flex-col gap-6">
            {links.map((link) => {
              const isActive = checkActive(link.href);
              const isProducts = link.href === "/products";

              return (
                <div key={link.href} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        if (isProducts) {
                          e.preventDefault();
                          setIsProductsSubmenuOpen(!isProductsSubmenuOpen);
                          return;
                        }
                        setIsOpen(false);
                        if (!isActive) startLoading();
                      }}
                      className={`text-md transition hover:text-primary ${
                        isActive ? "text-primary font-semibold" : "text-gray-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {isProducts && (
                      <button
                        onClick={() =>
                          setIsProductsSubmenuOpen(!isProductsSubmenuOpen)
                        }
                        className="p-2"
                      >
                        {isProductsSubmenuOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {isProducts && isProductsSubmenuOpen && (
                    <div className="flex flex-col gap-4 ml-4 mt-4 border-l-2 border-gray-100 pl-4 max-h-60 overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (pathname !== "/products") {
                            startLoading();
                            router.push("/products");
                          } else {
                            setShouldScrollToProducts(true);
                          }
                        }}
                        className="text-left text-sm text-gray-600 hover:text-primary"
                      >
                        Ver todos los productos
                      </button>
                      {availableCategories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            handleCategoryClick(cat.value);
                            setIsOpen(false);
                          }}
                          className={`text-left text-sm transition hover:text-primary ${
                            selectedCategories.includes(cat.value)
                              ? "text-primary font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>







      {/* Menú desktop - Solo visible en md y superiores */}
      <div className="hidden xl:block w-full bg-white ml-5">
        <nav className="relative flex justify-center gap-9 text-sm ">
          {links.map((link) => {
            const isActive = checkActive(link.href);
            const isProducts = link.href === "/products";

            return (
              <div key={link.href} className="group pb-2">
                <Link
                
                  href={link.href}
                  onClick={() => {
                    if (!isActive) startLoading();
                  }}
                  className={`transition flex items-center  hover:text-primary   ${
                    isActive ? "text-primary font-semibold" : "text-gray-700"
                  }`}
                >
                  {link.label}
                  {isProducts && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {isProducts && availableCategories.length > 0 && (
                <div >            
             
                  <div className="absolute left-0 right-0 top-full hidden group-hover:flex justify-center xl:-ml-5">
                    <div className="w-full  bg-white shadow-lg rounded-b-lg border border-gray-100 px-6 py-4 mt-0.5">
                      <div className=" overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex flex-wrap gap-x-20 gap-y-3">
                      
                          {availableCategories.map((cat) => (
                            <button
                              key={cat.value}
                              onClick={() => handleCategoryClick(cat.value)}
                              className={`w-fit text-left py-2 text-sm transition-colors hover:text-primary cursor-pointer  ${
                                selectedCategories.includes(cat.value)
                                  ? "text-primary font-bold"
                                  : "text-gray-600"
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
